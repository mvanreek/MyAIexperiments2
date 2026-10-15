export const DASHBOARD_COMPETITIONS = [
  'UEFA Champions League',
  'La Liga',
  'Copa del Rey',
  'Spanish Super Cup',
  'FIFA World Cup',
  'World Cup',
  'Copa América',
  'Major League Soccer',
  'Major League Soccer Play Offs',
  'Ligue 1',
  'Leagues Cup',
  'FIFA Club World Cup',
  'UEFA European Super Cup',
  'Campeones Cup',
  'Concacaf Champions Cup',
  'International friendly',
  'Trophée des Champions',
  'World Cup Qualification',
  'Supercopa de España',
  // Specific editions from parameter combobox:
  'CPA Copa América 2007',
  'CPA Copa América 2015',
  'CPA Copa América 2019',
  'CPA Copa América 2021',
  'CPA Copa América 2024',
  'CPA Copa América Centenario',
  'CUP Copa del Rey',
  'EUR UEFA Champions League',
  'FRN International friendly',
  'IUP Campeones Cup',
  'IUP UEFA European Super Cup',
  'NAM Concacaf Champions Cup',
  'NAM Leagues Cup',
  'PRM La Liga',
  'PRM Ligue 1',
  'PRM Major League Soccer',
  'PRM Major League Soccer Play Offs',
  'SUP Spanish Super Cup',
  'SUP Trophée des Champions',
  'WCP World Cup 2006',
  'WCP World Cup 2014',
  'WCP World Cup 2018',
  'WCP World Cup 2022',
  'WCP World Cup 2026',
  'WCQ World Cup 2010 Qualification',
  'WCQ World Cup 2014 Qualification',
  'WCQ World Cup 2018 Qualification',
  'WCQ World Cup 2022 Qualification',
  'WCQ World Cup 2026 Qualification',
  'WCT FIFA Club World Cup',
];

export const DASHBOARD_TEAMS = [
  'Argentina',
  'FC Barcelona',
  'Paris Saint-Germain',
  'Inter Miami',
];

export const DASHBOARD_OPPONENTS = [
  // European / Global Clubs
  'Ajax',
  'Real Madrid',
  'Sevilla',
  'Atletico Madrid',
  'Valencia',
  'Athletic Bilbao',
  'Espanyol',
  'Osasuna',
  'Real Betis',
  'Levante',
  'Getafe',
  'Deportivo La Coruna',
  'Rayo Vallecano',
  'Real Sociedad',
  'Villarreal',
  'Mallorca',
  'Eibar',
  'Racing Santander',
  'Malaga',
  'Almeria',
  'Granada',
  'Celta Vigo',
  'Elche',
  'Alaves',
  'Leganes',
  'Girona',
  'Real Valladolid',
  'Arsenal',
  'AC Milan',
  'Celtic',
  'Paris Saint-Germain',
  'Manchester City',
  'Bayern Munich',
  'Chelsea',
  'Juventus',
  'Lyon',
  'Shakhtar Donetsk',
  'Bayer Leverkusen',
  'Dynamo Kyiv',
  'PSV Eindhoven',
  'Borussia Dortmund',
  'AS Roma',
  'Napoli',
  'Liverpool',
  'Inter Milan',
  'Manchester United',
  'Benfica',
  'Porto',
  'Sporting CP',
  'Marseille',
  'Lille',
  'Montpellier',
  'Nantes',
  'Lens',
  'Troyes',
  'Ajaccio',
  'Nice',
  'Strasbourg',
  'Brest',
  'Reims',
  'Toulouse',
  'Angers',
  'Lorient',
  'Clermont',
  'Maccabi Haifa',
  'Red Star Belgrade',
  'Slavia Prague',
  'Ferencvaros',
  'Olympiacos',
  'BATE Borisov',
  'Panathinaikos',
  'Spartak Moscow',
  'Basel',
  'Werder Bremen',
  'VfB Stuttgart',
  'Rangers',
  'Cadiz',
  'Huesca',
  'Cordoba',
  'Hercules',
  'Numancia',
  'Gimnastic',
  'Albacete',
  // MLS / North American Clubs
  'Atlanta United',
  'Nashville SC',
  'Philadelphia Union',
  'Charlotte FC',
  'Sporting Kansas City',
  'New York Red Bulls',
  'New England Revolution',
  'Columbus Crew',
  'Orlando City',
  'St. Louis City',
  'Colorado Rapids',
  'CF Montreal',
  'Toronto FC',
  'Cruz Azul',
  'FC Dallas',
  // National Teams
  'Brazil',
  'Uruguay',
  'Chile',
  'Bolivia',
  'Paraguay',
  'Ecuador',
  'Colombia',
  'Venezuela',
  'Peru',
  'Mexico',
  'France',
  'Croatia',
  'Netherlands',
  'Germany',
  'Switzerland',
  'Nigeria',
  'Australia',
  'Saudi Arabia',
  'Estonia',
  'Curacao',
  'Haiti',
  'Guatemala',
  'Jamaica',
  'Panama',
  'United States',
  'Italy',
  'Spain',
  'Portugal',
  'Canada',
  'Poland',
  'Bosnia and Herzegovina',
  'Iran',
  'Serbia and Montenegro',
  'United Arab Emirates',
];

export interface FuzzyMatchResult {
  match: string;
  score: number;
  matchType: 'exact' | 'substring' | 'prefix_cleaned' | 'fuzzy_distance' | 'token_overlap';
  originalInput: string;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Strips common team/club prefixes (FC, CF, AC, Real, etc.) and query wrappers like (oponent)
 */
export function cleanEntityString(s: string): string {
  return s
    .replace(/\(oponent\)/gi, '')
    .replace(/\(opponent\)/gi, '')
    .replace(/['"“”]/g, '')
    .replace(/^(against|vs|versus)\s+/i, '')
    .replace(/^(fc|cf|afc|ac|as|cd|ud|sd|rc|rcd|ca|sc|real|club|the)\s+/i, '')
    .replace(/\s+(fc|cf|afc|ac|sc)$/i, '')
    .trim();
}

/**
 * Computes Levenshtein distance between two strings
 */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[m][n];
}

/**
 * Robust fuzzy pattern matcher for Looker Studio string parameters.
 * Implements:
 * 1. Exact match (case-insensitive)
 * 2. Prefix & tag cleaned match (e.g. "(oponent) 'FC Ajax'" -> "Ajax")
 * 3. Substring match (user input is substring of parameter value, e.g. "Champions League" inside "UEFA Champions League")
 * 4. Inverse substring match (parameter value is substring of user input, e.g. "Ajax" inside "FC Ajax Amsterdam")
 * 5. Levenshtein edit distance for minor typos (e.g. "shjow me", "Champiosn", "Barcalona")
 * 6. Token overlap match
 */
export function fuzzyMatchString(
  input: string | undefined | null,
  candidates: string[]
): FuzzyMatchResult | null {
  if (!input || !input.trim()) return null;

  const raw = input.trim();
  const lower = raw.toLowerCase();
  const norm = normalize(raw);
  const cleaned = cleanEntityString(raw);
  const lowerCleaned = cleaned.toLowerCase();
  const normCleaned = normalize(cleaned);

  // 1. Exact match (case insensitive)
  for (const c of candidates) {
    if (c.toLowerCase() === lower || c.toLowerCase() === lowerCleaned) {
      return { match: c, score: 1.0, matchType: 'exact', originalInput: raw };
    }
  }

  // 2. Normalized match (ignoring spaces, punctuation)
  for (const c of candidates) {
    if (normalize(c) === norm || normalize(c) === normCleaned) {
      return { match: c, score: 0.98, matchType: 'prefix_cleaned', originalInput: raw };
    }
  }

  // 3. Substring Match: input (or cleaned input) is a substring of candidate
  // User Example: "Champions League" is a substring of "UEFA Champions League"
  // User Example: "World Cup" is a substring of "FIFA World Cup"
  let bestSub: string | null = null;
  let minSubLenDiff = Infinity;

  for (const c of candidates) {
    const cLower = c.toLowerCase();
    const cNorm = normalize(c);

    if (
      (lowerCleaned.length >= 3 && cLower.includes(lowerCleaned)) ||
      (normCleaned.length >= 3 && cNorm.includes(normCleaned)) ||
      (lower.length >= 3 && cLower.includes(lower))
    ) {
      const diff = Math.abs(c.length - (cleaned.length || raw.length));
      if (diff < minSubLenDiff) {
        minSubLenDiff = diff;
        bestSub = c;
      }
    }
  }

  if (bestSub) {
    return {
      match: bestSub,
      score: 0.95,
      matchType: 'substring',
      originalInput: raw,
    };
  }

  // 4. Inverse Substring Match: candidate is a substring of input
  // User Example: candidate "Ajax" is a substring of "(oponent) 'FC Ajax'"
  let bestCandInInput: string | null = null;
  let maxCandLen = 0;

  for (const c of candidates) {
    const cLower = c.toLowerCase();
    const cNorm = normalize(c);

    if (
      (cLower.length >= 3 && lowerCleaned.includes(cLower)) ||
      (cNorm.length >= 3 && normCleaned.includes(cNorm)) ||
      (cLower.length >= 3 && lower.includes(cLower))
    ) {
      if (c.length > maxCandLen) {
        maxCandLen = c.length;
        bestCandInInput = c;
      }
    }
  }

  if (bestCandInInput) {
    return {
      match: bestCandInInput,
      score: 0.92,
      matchType: 'substring',
      originalInput: raw,
    };
  }

  // 5. Typo tolerance: Levenshtein distance on cleaned string
  let bestLevCandidate: string | null = null;
  let lowestDistance = Infinity;

  for (const c of candidates) {
    const cClean = cleanEntityString(c).toLowerCase();
    const target = lowerCleaned || lower;
    const dist = levenshtein(target, cClean);
    // Allow up to 2 edits for words > 4 chars, 3 edits for words > 8 chars
    const maxAllowed = target.length > 8 ? 3 : target.length > 4 ? 2 : 1;

    if (dist <= maxAllowed && dist < lowestDistance) {
      lowestDistance = dist;
      bestLevCandidate = c;
    }
  }

  if (bestLevCandidate) {
    return {
      match: bestLevCandidate,
      score: 0.88,
      matchType: 'fuzzy_distance',
      originalInput: raw,
    };
  }

  // 6. Token overlap matching
  const inputTokens = lowerCleaned.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  let bestOverlap: string | null = null;
  let maxScore = 0;

  for (const c of candidates) {
    const cTokens = c
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2);
    let common = 0;
    for (const t of inputTokens) {
      if (cTokens.includes(t)) common++;
    }
    const score = common / Math.max(cTokens.length, 1);
    if (score > maxScore && common >= 1) {
      maxScore = score;
      bestOverlap = c;
    }
  }

  if (maxScore >= 0.4 && bestOverlap) {
    return {
      match: bestOverlap,
      score: 0.82,
      matchType: 'token_overlap',
      originalInput: raw,
    };
  }

  return null;
}

/**
 * Fuzzy match a competition string to the exact Looker Studio dashboard value
 * User Example: ' Champions League' -> 'UEFA Champions League'
 */
export function matchDashboardCompetition(input: string): string {
  if (!input || !input.trim()) return '';

  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // Common quick aliases
  if (lower.includes('champions league') || lower === 'ucl') {
    return 'UEFA Champions League';
  }
  if (lower.includes('world cup') || lower.includes('worldcup') || lower === 'wc' || lower.includes('mundial')) {
    return 'FIFA World Cup';
  }
  if (lower.includes('copa america') || lower.includes('copa américa')) {
    return 'Copa América';
  }
  if (lower.includes('mls') || lower.includes('major league soccer')) {
    return 'Major League Soccer';
  }
  if (lower.includes('la liga') || lower.includes('laliga')) {
    return 'La Liga';
  }
  if (lower.includes('ligue 1') || lower.includes('ligue1')) {
    return 'Ligue 1';
  }
  if (lower.includes('copa del rey')) {
    return 'Copa del Rey';
  }
  if (lower.includes('leagues cup')) {
    return 'Leagues Cup';
  }
  if (lower.includes('supercopa')) {
    return 'Supercopa de España';
  }
  if (lower.includes('club world cup')) {
    return 'FIFA Club World Cup';
  }

  const result = fuzzyMatchString(trimmed, DASHBOARD_COMPETITIONS);
  return result ? result.match : trimmed;
}

/**
 * Fuzzy match an opponent string to the exact Looker Studio dashboard value
 * User Example: "show me Messi goals he made against (oponent) 'FC Ajax'" -> "Ajax"
 */
export function matchDashboardOpponent(input: string): string {
  if (!input || !input.trim()) return '';

  const cleaned = cleanEntityString(input);
  const result = fuzzyMatchString(cleaned, DASHBOARD_OPPONENTS);
  return result ? result.match : cleaned;
}

/**
 * Fuzzy match a team string to the exact Looker Studio dashboard value
 * e.g. "Barca" -> "FC Barcelona"
 */
export function matchDashboardTeam(input: string): string {
  if (!input || !input.trim()) return '';

  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (
    lower.includes('barca') ||
    lower.includes('barça') ||
    lower.includes('barcelona') ||
    lower === 'fcb'
  ) {
    return 'FC Barcelona';
  }
  if (lower.includes('argentina') || lower.includes('albiceleste')) {
    return 'Argentina';
  }
  if (lower.includes('miami')) {
    return 'Inter Miami';
  }
  if (lower.includes('psg') || lower.includes('paris')) {
    return 'Paris Saint-Germain';
  }

  const result = fuzzyMatchString(trimmed, DASHBOARD_TEAMS);
  return result ? result.match : trimmed;
}
