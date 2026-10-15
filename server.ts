import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  matchDashboardCompetition,
  matchDashboardOpponent,
  matchDashboardTeam,
  fuzzyMatchString,
  DASHBOARD_COMPETITIONS,
  DASHBOARD_OPPONENTS,
  DASHBOARD_TEAMS,
} from './src/utils/fuzzyMatch.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ExtractionResult {
  team: string;
  competition: string;
  teamNormalized: string;
  competitionNormalized: string;
  opponent?: string;
  opponentNormalized?: string;
  seasonOrYear?: string;
  goalType?: string;
  querySummary: string;
  confidence: 'high' | 'medium' | 'low';
  inferredTeam: boolean;
  inferredCompetition: boolean;
  matchedPatterns?: {
    competitionOriginal?: string;
    competitionMatched?: string;
    competitionMatchType?: string;
    opponentOriginal?: string;
    opponentMatched?: string;
    opponentMatchType?: string;
    teamOriginal?: string;
    teamMatched?: string;
    teamMatchType?: string;
  };
}

// System prompt guiding Gemini to accurately identify parameters for Messi's Goal Tracker
const SYSTEM_INSTRUCTION = `You are an analytics query parser for the Messi Goal Tracker dashboard in Google Looker Studio.
Extract the parameter filters requested by the user: 'team', 'competition', 'opponent', 'seasonOrYear', and 'goalType'.

Looker Studio Parameter Values:
- Competitions: "UEFA Champions League", "La Liga", "Copa del Rey", "Supercopa de España", "FIFA World Cup", "Copa América", "Major League Soccer", "Ligue 1", "Leagues Cup", "FIFA Club World Cup", "UEFA Super Cup", "FIFA World Cup qualification", "International Friendly", "Trophée des Champions", "CONCACAF Champions Cup", "US Open Cup", "Finalissima"
- Teams: "Argentina", "FC Barcelona", "Paris Saint-Germain", "Inter Miami"
- Opponents: Match clean club or country name (e.g., "Ajax" for "FC Ajax", "Real Madrid", "Sevilla", "Atletico Madrid", "Bayern Munich", etc.)

CRITICAL EXTRACTION RULES:
1. FUZZY PATTERN MATCHING FOR STRING PARAMETERS:
   - For competition: If user types "Champions League", match to the exact dashboard parameter value "UEFA Champions League". If "World Cup", match to "FIFA World Cup". If "MLS", match to "Major League Soccer".
   - For opponent: If user asks "show me Messi goals he made against (oponent) 'FC Ajax'" or mentions "(oponent) 'FC Ajax'", match to exact dashboard parameter value "Ajax". Strip prefixes like FC, CF, AC, quotes, and query wrappers like "(oponent)".
   - For team: If user types "Barca" or "Barcelona", match to "FC Barcelona". If "Miami", match to "Inter Miami". If "Argentina", match to "Argentina".

2. STRICTLY NO HALLUCINATED OR INFERRED FILTERS:
   - If the user ONLY specifies a competition (e.g. "shjow me Messi goals he made in Champions League"), team MUST be empty string ("") and teamNormalized MUST be empty string (""). DO NOT assume or infer Barcelona or PSG!
   - If the user ONLY specifies an opponent (e.g. "show me Messi goals he made against (oponent) 'FC Ajax'"), team and competition MUST be empty string ("").
   - If the user ONLY specifies a team (e.g. "Show me all Messi goals for Argentina"), competition and opponent MUST be empty string ("").

3. ABSOLUTELY NO EXTERNAL TRIVIA:
   - Do NOT output external awards or trivia (such as 8 Ballon d'Or, trophies, personal life). Only output filter fields directly present in the goal tracker dashboard.`;

function fallbackSemanticExtract(query: string): ExtractionResult {
  const lower = query.toLowerCase();

  // 1. Team extraction (only if explicitly mentioned)
  let team = '';
  if (lower.includes('argentina') || lower.includes('albiceleste')) {
    team = 'Argentina';
  } else if (lower.includes('barcelona') || lower.includes('barca') || lower.includes('barça')) {
    team = 'FC Barcelona';
  } else if (lower.includes('inter miami') || lower.includes('miami')) {
    team = 'Inter Miami';
  } else if (lower.includes('psg') || lower.includes('paris saint-germain') || (lower.includes('paris') && !lower.includes('against paris'))) {
    team = 'Paris Saint-Germain';
  }
  const teamNormalized = team ? matchDashboardTeam(team) : '';

  // 2. Competition extraction (only if explicitly mentioned)
  let competition = '';
  if (lower.includes('champions league') || lower.includes('ucl')) {
    competition = 'UEFA Champions League';
  } else if (lower.includes('world cup') || lower.includes('worldcup') || lower.includes('mundial')) {
    competition = 'FIFA World Cup';
  } else if (lower.includes('la liga') || lower.includes('laliga')) {
    competition = 'La Liga';
  } else if (lower.includes('copa america') || lower.includes('copa américa')) {
    competition = 'Copa América';
  } else if (lower.includes('mls') || lower.includes('major league soccer')) {
    competition = 'Major League Soccer';
  } else if (lower.includes('leagues cup')) {
    competition = 'Leagues Cup';
  } else if (lower.includes('ligue 1') || lower.includes('ligue1')) {
    competition = 'Ligue 1';
  } else if (lower.includes('copa del rey')) {
    competition = 'Copa del Rey';
  } else if (lower.includes('supercopa')) {
    competition = 'Supercopa de España';
  } else if (lower.includes('club world cup')) {
    competition = 'FIFA Club World Cup';
  }
  const competitionNormalized = competition ? matchDashboardCompetition(competition) : '';

  // 3. Opponent extraction
  let opponent = '';
  const vsMatch = query.match(/(?:against|\(oponent\)|\(opponent\)|vs\.?|versus)\s+['"“”]?([A-Za-z0-9\s.-]+?)['"“”]?(?:\s+in|\s+for|\s+with|\.|$)/i);
  if (vsMatch && vsMatch[1]) {
    opponent = vsMatch[1].trim();
  } else {
    // Check known opponents
    for (const opp of DASHBOARD_OPPONENTS) {
      if (lower.includes(opp.toLowerCase())) {
        opponent = opp;
        break;
      }
    }
  }
  const opponentNormalized = opponent ? matchDashboardOpponent(opponent) : '';

  // 4. Season or year
  let seasonOrYear = '';
  const yearMatch = query.match(/\b(20\d\d(?:[-/]\d\d)?)\b/);
  if (yearMatch) {
    seasonOrYear = yearMatch[1];
  }

  // Summary strictly describing the filters
  const parts: string[] = ['Messi goals'];
  if (teamNormalized) parts.push(`for ${teamNormalized}`);
  if (opponentNormalized) parts.push(`against ${opponentNormalized}`);
  if (competitionNormalized) parts.push(`in ${competitionNormalized}`);
  if (seasonOrYear) parts.push(`(${seasonOrYear})`);

  return {
    team: team || '',
    competition: competition || '',
    teamNormalized: teamNormalized || '',
    competitionNormalized: competitionNormalized || '',
    opponent: opponent || '',
    opponentNormalized: opponentNormalized || '',
    seasonOrYear,
    querySummary: parts.length > 1 ? parts.join(' ') : 'All Messi career goals',
    confidence: 'high',
    inferredTeam: false,
    inferredCompetition: false,
    matchedPatterns: {
      competitionOriginal: competition,
      competitionMatched: competitionNormalized,
      opponentOriginal: opponent,
      opponentMatched: opponentNormalized,
      teamOriginal: team,
      teamMatched: teamNormalized,
    },
  };
}

app.post('/api/parse-query', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const trimmedQuery = query.trim();
    let parsedData: ExtractionResult | null = null;

    try {
      // Call Gemini with a timeout promise
      const fetchPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: trimmedQuery,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              team: {
                type: Type.STRING,
                description: 'The team Messi was playing for, or empty string if not explicitly mentioned in prompt',
              },
              competition: {
                type: Type.STRING,
                description: 'The competition or tournament name, or empty string if not explicitly mentioned in prompt',
              },
              teamNormalized: {
                type: Type.STRING,
                description: 'Standardized team name in Looker Studio (Argentina, FC Barcelona, Paris Saint-Germain, Inter Miami), or empty string',
              },
              competitionNormalized: {
                type: Type.STRING,
                description: 'Standardized competition name in Looker Studio (e.g. UEFA Champions League, FIFA World Cup), or empty string',
              },
              opponent: {
                type: Type.STRING,
                description: 'Opponent team as mentioned in prompt, or empty string',
              },
              opponentNormalized: {
                type: Type.STRING,
                description: 'Standardized opponent name in Looker Studio (e.g. Ajax for FC Ajax, Real Madrid), or empty string',
              },
              seasonOrYear: {
                type: Type.STRING,
                description: 'Season or year if mentioned, e.g. 2022, 2014-15, otherwise empty string',
              },
              goalType: {
                type: Type.STRING,
                description: 'Type of goal if specified (e.g. Free kick, Penalty, Header)',
              },
              querySummary: {
                type: Type.STRING,
                description: 'A concise summary of the filters applied',
              },
              confidence: {
                type: Type.STRING,
                description: 'high, medium, or low confidence',
              },
              inferredTeam: {
                type: Type.BOOLEAN,
                description: 'Whether the team was inferred (should be false)',
              },
              inferredCompetition: {
                type: Type.BOOLEAN,
                description: 'Whether the competition was inferred (should be false)',
              },
            },
            required: [
              'team',
              'competition',
              'teamNormalized',
              'competitionNormalized',
              'querySummary',
              'confidence',
              'inferredTeam',
              'inferredCompetition',
            ],
          },
        },
      });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout waiting for Gemini response')), 6000)
      );

      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const parsedJsonText = response.text?.trim() || '{}';
      parsedData = JSON.parse(parsedJsonText);
    } catch (err: any) {
      console.info('Gemini generation fallback to semantic extractor:', err?.message || err);
      parsedData = fallbackSemanticExtract(trimmedQuery);
    }

    if (!parsedData) {
      parsedData = fallbackSemanticExtract(trimmedQuery);
    }

    // Apply strict fuzzy pattern matching to guarantee exact Looker Studio parameter values:
    const rawComp = (parsedData.competition || '').trim();
    const rawOpp = (parsedData.opponent || '').trim();
    const rawTeam = (parsedData.team || '').trim();

    // Check if opponent was mentioned in prompt but missed by Gemini
    let detectedOpp = rawOpp;
    if (!detectedOpp) {
      const vsMatch = trimmedQuery.match(/(?:against|\(oponent\)|\(opponent\)|vs\.?|versus)\s+['"“”]?([A-Za-z0-9\s.-]+?)['"“”]?(?:\s+in|\s+for|\s+with|\.|$)/i);
      if (vsMatch && vsMatch[1]) {
        detectedOpp = vsMatch[1].trim();
      }
    }

    // Double check team wasn't inferred when not in prompt
    const lowerQuery = trimmedQuery.toLowerCase();
    const queryHasTeam =
      lowerQuery.includes('argentina') ||
      lowerQuery.includes('barcelona') ||
      lowerQuery.includes('barca') ||
      lowerQuery.includes('barça') ||
      lowerQuery.includes('miami') ||
      lowerQuery.includes('psg') ||
      (lowerQuery.includes('paris') && !lowerQuery.includes('against paris'));

    let finalTeam = queryHasTeam ? rawTeam : '';
    let finalTeamNormalized = '';
    let teamMatchType = 'none';

    if (finalTeam) {
      const teamMatchRes = fuzzyMatchString(finalTeam, DASHBOARD_TEAMS);
      finalTeamNormalized = teamMatchRes ? teamMatchRes.match : matchDashboardTeam(finalTeam);
      teamMatchType = teamMatchRes ? teamMatchRes.matchType : 'direct';
    }

    // Check if competition was mentioned in prompt but missed by Gemini
    let detectedComp = rawComp;
    if (!detectedComp) {
      if (lowerQuery.includes('champions league') || lowerQuery.includes('ucl')) {
        detectedComp = 'UEFA Champions League';
      } else if (lowerQuery.includes('world cup') || lowerQuery.includes('worldcup') || lowerQuery.includes('mundial')) {
        detectedComp = 'FIFA World Cup';
      } else if (lowerQuery.includes('la liga') || lowerQuery.includes('laliga')) {
        detectedComp = 'La Liga';
      } else if (lowerQuery.includes('copa america') || lowerQuery.includes('copa américa')) {
        detectedComp = 'Copa América';
      } else if (lowerQuery.includes('mls') || lowerQuery.includes('major league soccer')) {
        detectedComp = 'Major League Soccer';
      } else if (lowerQuery.includes('leagues cup')) {
        detectedComp = 'Leagues Cup';
      } else if (lowerQuery.includes('ligue 1') || lowerQuery.includes('ligue1')) {
        detectedComp = 'Ligue 1';
      } else if (lowerQuery.includes('copa del rey')) {
        detectedComp = 'Copa del Rey';
      } else if (lowerQuery.includes('supercopa')) {
        detectedComp = 'Supercopa de España';
      }
    }

    // Competition fuzzy match
    let finalCompNormalized = '';
    let compMatchType = 'none';
    if (detectedComp) {
      const compMatchRes = fuzzyMatchString(detectedComp, DASHBOARD_COMPETITIONS);
      finalCompNormalized = compMatchRes ? compMatchRes.match : matchDashboardCompetition(detectedComp);
      compMatchType = compMatchRes ? compMatchRes.matchType : 'direct';
    }

    // Opponent fuzzy match
    let finalOppNormalized = '';
    let oppMatchType = 'none';
    if (detectedOpp) {
      const oppMatchRes = fuzzyMatchString(detectedOpp, DASHBOARD_OPPONENTS);
      finalOppNormalized = oppMatchRes ? oppMatchRes.match : matchDashboardOpponent(detectedOpp);
      oppMatchType = oppMatchRes ? oppMatchRes.matchType : 'direct';
    }

    parsedData.team = finalTeam;
    parsedData.teamNormalized = finalTeamNormalized;
    parsedData.competition = detectedComp;
    parsedData.competitionNormalized = finalCompNormalized;
    parsedData.opponent = detectedOpp;
    parsedData.opponentNormalized = finalOppNormalized;
    parsedData.inferredTeam = false;
    parsedData.inferredCompetition = false;

    // Build concise query summary based solely on dashboard filters
    const summaryParts: string[] = ['Messi goals'];
    if (finalTeamNormalized) summaryParts.push(`for ${finalTeamNormalized}`);
    if (finalOppNormalized) summaryParts.push(`against ${finalOppNormalized}`);
    if (finalCompNormalized) summaryParts.push(`in ${finalCompNormalized}`);
    if (parsedData.seasonOrYear) summaryParts.push(`(${parsedData.seasonOrYear})`);
    parsedData.querySummary = summaryParts.length > 1 ? summaryParts.join(' ') : 'All Messi career goals';

    parsedData.matchedPatterns = {
      competitionOriginal: detectedComp,
      competitionMatched: finalCompNormalized,
      competitionMatchType: compMatchType,
      opponentOriginal: detectedOpp,
      opponentMatched: finalOppNormalized,
      opponentMatchType: oppMatchType,
      teamOriginal: finalTeam,
      teamMatched: finalTeamNormalized,
      teamMatchType: teamMatchType,
    };

    return res.json({
      success: true,
      originalQuery: trimmedQuery,
      result: parsedData,
    });
  } catch (error: any) {
    console.error('Error generating query parsing via Gemini:', error);
    const fallback = fallbackSemanticExtract(req.body?.query || '');
    return res.json({
      success: true,
      originalQuery: req.body?.query || '',
      result: fallback,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
