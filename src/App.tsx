import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Link2,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Layers,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { Header } from './components/Header';
import { QueryInput } from './components/QueryInput';
import { ExtractionResultCard } from './components/ExtractionResultCard';
import { LookerLinkOutput } from './components/LookerLinkOutput';
import { DashboardEmbedPreview } from './components/DashboardEmbedPreview';
import { LookerConfigModal } from './components/LookerConfigModal';
import { HistoryAndBookmarks } from './components/HistoryAndBookmarks';
import { MessiStatsOverview } from './components/MessiStatsOverview';
import { ParameterComboboxSelector } from './components/ParameterComboboxSelector';
import { ExtractionData, ParameterConfig, QueryHistoryItem } from './types';
import { DEFAULT_CONFIG } from './utils/lookerUrl';
import {
  matchDashboardCompetition,
  matchDashboardOpponent,
  matchDashboardTeam,
  fuzzyMatchString,
  DASHBOARD_COMPETITIONS,
  DASHBOARD_OPPONENTS,
  DASHBOARD_TEAMS,
} from './utils/fuzzyMatch';

export default function App() {
  const [query, setQuery] = useState(
    'Show me Messi for Argentina in the Worldcup'
  );
  const [extracted, setExtracted] = useState<ExtractionData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<ParameterConfig>(() => {
    try {
      localStorage.removeItem('messi_looker_config_v4');
      localStorage.removeItem('messi_looker_config_v3');
      const saved = localStorage.getItem('messi_looker_config_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CONFIG, ...parsed, includeFilterControls: true };
      }
      return DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [history, setHistory] = useState<QueryHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('messi_looker_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState<'preview' | 'embed'>('preview');
  const embedSectionRef = useRef<HTMLDivElement>(null);

  // Initial parse on mount so the user immediately sees the requested query output
  useEffect(() => {
    handleParseQuery('Show me all Messi goals for Argentina');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save config to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('messi_looker_config_v5', JSON.stringify(config));
    } catch {}
  }, [config]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('messi_looker_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  const handleParseQuery = async (queryToRun?: string) => {
    const text = (queryToRun !== undefined ? queryToRun : query).trim();
    if (!text) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/parse-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to parse natural language query');
      }

      setExtracted(data.result);

      // Add to history
      const newHistoryItem: QueryHistoryItem = {
        id: Date.now().toString(),
        query: text,
        timestamp: Date.now(),
        extracted: data.result,
        isFavorite: false,
      };

      setHistory((prev) => {
        const filtered = prev.filter(
          (h) => h.query.toLowerCase() !== text.toLowerCase()
        );
        return [newHistoryItem, ...filtered].slice(0, 15);
      });
    } catch (err: any) {
      console.error('Query parse error:', err);
      setError(
        err.message ||
          'Could not connect to Gemini parser. Falling back to default extraction.'
      );
      // Fallback offline heuristic if server has cold start or issue
      fallbackExtraction(text);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackExtraction = (text: string) => {
    const trimmed = text.trim();
    const lower = trimmed.toLowerCase();

    // 1. Team extraction (ONLY if explicitly mentioned)
    let team = '';
    if (lower.includes('argentina') || lower.includes('albiceleste')) {
      team = 'Argentina';
    } else if (lower.includes('barcelona') || lower.includes('barca') || lower.includes('barça')) {
      team = 'FC Barcelona';
    } else if (lower.includes('miami')) {
      team = 'Inter Miami';
    } else if (lower.includes('psg') || lower.includes('paris saint-germain') || (lower.includes('paris') && !lower.includes('against paris'))) {
      team = 'Paris Saint-Germain';
    }
    const teamMatch = team ? fuzzyMatchString(team, DASHBOARD_TEAMS) : null;
    const teamNormalized = teamMatch ? teamMatch.match : (team ? matchDashboardTeam(team) : '');

    // 2. Competition extraction (fuzzy pattern match, handles "Champions League", "World Cup", etc.)
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
    } else if (lower.includes('ligue 1') || lower.includes('ligue1')) {
      competition = 'Ligue 1';
    } else if (lower.includes('copa del rey')) {
      competition = 'Copa del Rey';
    } else if (lower.includes('leagues cup')) {
      competition = 'Leagues Cup';
    } else if (lower.includes('supercopa')) {
      competition = 'Supercopa de España';
    }
    const compMatch = competition ? fuzzyMatchString(competition, DASHBOARD_COMPETITIONS) : null;
    const competitionNormalized = compMatch ? compMatch.match : (competition ? matchDashboardCompetition(competition) : '');

    // 3. Opponent extraction (handles "(oponent) 'FC Ajax'", "against Ajax", etc.)
    let opponent = '';
    const vsMatch = trimmed.match(/(?:against|\(oponent\)|\(opponent\)|vs\.?|versus)\s+['"“”]?([A-Za-z0-9\s.-]+?)['"“”]?(?:\s+in|\s+for|\s+with|\.|$)/i);
    if (vsMatch && vsMatch[1]) {
      opponent = vsMatch[1].trim();
    } else {
      for (const opp of DASHBOARD_OPPONENTS) {
        if (lower.includes(opp.toLowerCase())) {
          opponent = opp;
          break;
        }
      }
    }
    const oppMatch = opponent ? fuzzyMatchString(opponent, DASHBOARD_OPPONENTS) : null;
    const opponentNormalized = oppMatch ? oppMatch.match : (opponent ? matchDashboardOpponent(opponent) : '');

    // Summary strictly describing the applied dashboard filters
    const summaryParts: string[] = ['Messi goals'];
    if (teamNormalized) summaryParts.push(`for ${teamNormalized}`);
    if (opponentNormalized) summaryParts.push(`against ${opponentNormalized}`);
    if (competitionNormalized) summaryParts.push(`in ${competitionNormalized}`);
    const summary = summaryParts.length > 1 ? summaryParts.join(' ') : 'All Messi career goals';

    const fallbackResult: ExtractionData = {
      team: team || '',
      competition: competition || '',
      teamNormalized: teamNormalized || '',
      competitionNormalized: competitionNormalized || '',
      opponent: opponent || '',
      opponentNormalized: opponentNormalized || '',
      querySummary: summary,
      confidence: 'medium',
      inferredTeam: false,
      inferredCompetition: false,
      matchedPatterns: {
        competitionOriginal: competition,
        competitionMatched: competitionNormalized,
        competitionMatchType: compMatch ? compMatch.matchType : 'direct',
        opponentOriginal: opponent,
        opponentMatched: opponentNormalized,
        opponentMatchType: oppMatch ? oppMatch.matchType : 'direct',
        teamOriginal: team,
        teamMatched: teamNormalized,
        teamMatchType: teamMatch ? teamMatch.matchType : 'direct',
      },
    };

    setExtracted(fallbackResult);
  };

  const handleToggleFavorite = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleSelectHistoryItem = (item: QueryHistoryItem) => {
    setQuery(item.query);
    setExtracted(item.extracted);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickMilestone = (queryToRun: string) => {
    setQuery(queryToRun);
    handleParseQuery(queryToRun);
  };

  const scrollToEmbed = () => {
    setActiveTab('embed');
    setTimeout(() => {
      embedSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSelectCompetition = (comp: string) => {
    if (!extracted) {
      setExtracted({
        team: '',
        competition: comp,
        teamNormalized: comp,
        competitionNormalized: comp,
        opponent: '',
        opponentNormalized: '',
        querySummary: comp ? `Messi goals in ${comp}` : 'All Messi career goals',
        confidence: 'high',
        inferredTeam: false,
        inferredCompetition: false,
      });
      return;
    }
    const updated: ExtractionData = {
      ...extracted,
      competition: comp,
      competitionNormalized: comp,
      querySummary: comp
        ? `Messi goals in ${comp}${extracted.teamNormalized ? ` for ${extracted.teamNormalized}` : ''}`
        : (extracted.teamNormalized ? `Messi goals for ${extracted.teamNormalized}` : 'All Messi career goals'),
    };
    setExtracted(updated);
  };

  const handleSelectTeam = (team: string) => {
    if (!extracted) {
      setExtracted({
        team,
        competition: '',
        teamNormalized: team,
        competitionNormalized: '',
        opponent: '',
        opponentNormalized: '',
        querySummary: team ? `Messi goals for ${team}` : 'All Messi career goals',
        confidence: 'high',
        inferredTeam: false,
        inferredCompetition: false,
      });
      return;
    }
    const updated: ExtractionData = {
      ...extracted,
      team,
      teamNormalized: team,
      querySummary: team
        ? `Messi goals for ${team}${extracted.competitionNormalized ? ` in ${extracted.competitionNormalized}` : ''}`
        : (extracted.competitionNormalized ? `Messi goals in ${extracted.competitionNormalized}` : 'All Messi career goals'),
    };
    setExtracted(updated);
  };

  const handleSelectOpponent = (opp: string) => {
    if (!extracted) {
      setExtracted({
        team: '',
        competition: '',
        teamNormalized: '',
        competitionNormalized: '',
        opponent: opp,
        opponentNormalized: opp,
        querySummary: opp ? `Messi goals against ${opp}` : 'All Messi career goals',
        confidence: 'high',
        inferredTeam: false,
        inferredCompetition: false,
      });
      return;
    }
    const updated: ExtractionData = {
      ...extracted,
      opponent: opp,
      opponentNormalized: opp,
      querySummary: opp
        ? `Messi goals against ${opp}`
        : (extracted.competitionNormalized ? `Messi goals in ${extracted.competitionNormalized}` : 'All Messi career goals'),
    };
    setExtracted(updated);
  };

  const handleClearFilters = () => {
    if (extracted) {
      setExtracted({
        ...extracted,
        team: '',
        teamNormalized: '',
        competition: '',
        competitionNormalized: '',
        opponent: '',
        opponentNormalized: '',
        querySummary: 'All Messi career goals (unfiltered)',
      });
    }
  };

  const isCustomConfig =
    config.teamFilterControlId !== DEFAULT_CONFIG.teamFilterControlId ||
    config.reportId !== DEFAULT_CONFIG.reportId;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenSettings={() => setIsConfigOpen(true)}
        isCustomConfig={isCustomConfig}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Natural Language to Looker Studio URL Generator</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Filter Messi&apos;s Goal Tracker with{' '}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-amber-300 bg-clip-text text-transparent">
              Natural Language
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Ask for any team, tournament, or season. Gemini extracts the parameters
            and generates dynamic, clickable Google Looker Studio links instantly.
          </p>
        </div>

        {/* Input Box Section */}
        <div className="max-w-4xl mx-auto">
          <QueryInput
            query={query}
            setQuery={setQuery}
            onSubmit={(q) => handleParseQuery(q)}
            isLoading={isLoading}
            onClear={() => setQuery('')}
          />

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* View Switcher Tabs (Output Links vs Embedded Preview) */}
        {extracted && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'preview'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Link2 className="w-4 h-4" />
                  <span>Filtered Link &amp; Parameters</span>
                </button>

                <button
                  onClick={() => setActiveTab('embed')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    activeTab === 'embed'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Live Dashboard Preview</span>
                </button>
              </div>

              <span className="hidden sm:inline-block text-xs text-slate-500">
                Report: <code className="text-slate-400">9d51c83b-11ea...</code>
              </span>
            </div>

            {/* Direct Dashboard Combobox Dropdowns */}
            <ParameterComboboxSelector
              extracted={extracted}
              onSelectCompetition={handleSelectCompetition}
              onSelectTeam={handleSelectTeam}
              onSelectOpponent={handleSelectOpponent}
              onClearFilters={handleClearFilters}
            />

            {/* Extracted Entity Cards */}
            <ExtractionResultCard
              extracted={extracted}
              onUpdateExtracted={(updated) => setExtracted(updated)}
            />

            {/* Tab 1: Dynamic Clickable Link & Details */}
            {activeTab === 'preview' && (
              <LookerLinkOutput
                extracted={extracted}
                config={config}
                onUpdateConfig={(newCfg) => setConfig(newCfg)}
                onSelectEmbedTab={scrollToEmbed}
              />
            )}

            {/* Tab 2: Embedded Looker Studio Frame */}
            <div
              ref={embedSectionRef}
              className={activeTab === 'embed' ? 'block' : 'hidden'}
            >
              <DashboardEmbedPreview
                extracted={extracted}
                config={config}
                onUpdateConfig={(newCfg) => setConfig(newCfg)}
              />
            </div>
          </div>
        )}

        {/* Messi Stats Cheat Sheet */}
        <div className="max-w-5xl mx-auto">
          <MessiStatsOverview onQuickFilter={handleQuickMilestone} />
        </div>

        {/* History & Bookmarks */}
        <div className="max-w-5xl mx-auto">
          <HistoryAndBookmarks
            history={history}
            onSelectQuery={handleSelectHistoryItem}
            onToggleFavorite={handleToggleFavorite}
            onClearHistory={handleClearHistory}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-semibold text-slate-300">
              Messi Goal Tracker
            </span>
            <span>•</span>
            <span>Google Looker Studio Integration</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by Gemini 3.8 Flash</span>
            <button
              onClick={() => setIsConfigOpen(true)}
              className="text-sky-400 hover:underline"
            >
              Parameter Settings
            </button>
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <LookerConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onSaveConfig={(newConfig) => setConfig(newConfig)}
      />
    </div>
  );
}
