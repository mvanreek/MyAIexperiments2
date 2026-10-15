export interface SamplePrompt {
  label: string;
  query: string;
  team: string;
  competition: string;
  badge: string;
  flag?: string;
}

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  {
    label: 'Messi for Champions League',
    query: 'Show me Messi for Champions League',
    team: '',
    competition: 'UEFA Champions League',
    badge: '⭐',
  },
  {
    label: 'Champions League (Fuzzy match)',
    query: 'shjow me Messi goals he made in Champions League',
    team: '',
    competition: 'UEFA Champions League',
    badge: '🏆',
  },
  {
    label: 'FC Ajax (Fuzzy match)',
    query: "show me Messi goals he made against (oponent) 'FC Ajax'",
    team: '',
    competition: '',
    badge: '🎯',
  },
  {
    label: 'Argentina in World Cup',
    query: 'Show me Messi for Argentina in the Worldcup',
    team: 'Argentina',
    competition: 'FIFA World Cup',
    badge: '🇦🇷',
  },
  {
    label: 'All goals for Argentina',
    query: 'Show me all Messi goals for Argentina',
    team: 'Argentina',
    competition: '',
    badge: '🇦🇷',
  },
  {
    label: 'Barcelona in Champions League',
    query: 'Messi goals for Barcelona in UEFA Champions League',
    team: 'FC Barcelona',
    competition: 'UEFA Champions League',
    badge: '🇪🇸',
  },
  {
    label: 'Inter Miami in MLS',
    query: 'Show Messi goals for Inter Miami in MLS',
    team: 'Inter Miami',
    competition: 'Major League Soccer',
    badge: '🇺🇸',
  },
  {
    label: 'Argentina in Copa América',
    query: 'All goals for Argentina in Copa America tournament',
    team: 'Argentina',
    competition: 'Copa América',
    badge: '🏆',
  },
  {
    label: 'Barcelona in La Liga',
    query: 'Messi goals for FC Barcelona in La Liga',
    team: 'FC Barcelona',
    competition: 'La Liga',
    badge: '⚽',
  },
  {
    label: 'PSG in Ligue 1',
    query: 'Messi goals for Paris Saint-Germain in Ligue 1',
    team: 'Paris Saint-Germain',
    competition: 'Ligue 1',
    badge: '🇫🇷',
  },
  {
    label: 'Free kicks vs Real Madrid',
    query: 'Messi free kicks against Real Madrid for Barcelona',
    team: 'FC Barcelona',
    competition: 'La Liga',
    badge: '🎯',
  },
  {
    label: 'Inter Miami Leagues Cup',
    query: 'Inter Miami in the Leagues Cup championship run',
    team: 'Inter Miami',
    competition: 'Leagues Cup',
    badge: '🌟',
  },
];

export const TEAMS_LIST = [
  'Argentina',
  'FC Barcelona',
  'Inter Miami',
  'Paris Saint-Germain',
  'Argentina U20',
  'Argentina Olympic',
];

export const COMPETITIONS_LIST = [
  'UEFA Champions League',
  'FIFA World Cup',
  'World Cup',
  'La Liga',
  'Copa América',
  'Copa del Rey',
  'Spanish Super Cup',
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
  // Specific tournament editions
  'WCP World Cup 2022',
  'WCP World Cup 2018',
  'WCP World Cup 2014',
  'WCP World Cup 2006',
  'CPA Copa América 2024',
  'CPA Copa América 2021',
  'CPA Copa América 2019',
  'CPA Copa América 2015',
  'CPA Copa América 2007',
  'CPA Copa América Centenario',
  'EUR UEFA Champions League',
  'PRM La Liga',
  'PRM Ligue 1',
  'PRM Major League Soccer',
  'PRM Major League Soccer Play Offs',
  'CUP Copa del Rey',
  'SUP Spanish Super Cup',
  'SUP Trophée des Champions',
  'NAM Leagues Cup',
  'NAM Concacaf Champions Cup',
  'FRN International friendly',
  'IUP Campeones Cup',
  'IUP UEFA European Super Cup',
  'WCT FIFA Club World Cup',
  'WCQ World Cup 2026 Qualification',
  'WCQ World Cup 2022 Qualification',
  'WCQ World Cup 2018 Qualification',
  'WCQ World Cup 2014 Qualification',
  'WCQ World Cup 2010 Qualification',
];

export function getTeamStyle(teamName: string) {
  const normalized = teamName.toLowerCase();
  if (normalized.includes('argentina')) {
    return {
      bg: 'bg-sky-500/10 border-sky-400/30 text-sky-300',
      pill: 'bg-sky-500 text-slate-950 font-bold',
      gradient: 'from-sky-500 to-blue-600',
      accent: '#38bdf8',
      name: 'Argentina',
      flag: '🇦🇷',
    };
  }
  if (normalized.includes('barcelona') || normalized.includes('barca')) {
    return {
      bg: 'bg-rose-500/10 border-blue-500/30 text-rose-300',
      pill: 'bg-gradient-to-r from-blue-700 to-rose-600 text-white font-bold',
      gradient: 'from-blue-700 to-rose-600',
      accent: '#ef4444',
      name: 'FC Barcelona',
      flag: '🇪🇸',
    };
  }
  if (normalized.includes('miami')) {
    return {
      bg: 'bg-pink-500/10 border-pink-400/30 text-pink-300',
      pill: 'bg-pink-500 text-slate-950 font-bold',
      gradient: 'from-pink-500 to-rose-600',
      accent: '#ec4899',
      name: 'Inter Miami',
      flag: '🇺🇸',
    };
  }
  if (normalized.includes('paris') || normalized.includes('psg')) {
    return {
      bg: 'bg-indigo-500/10 border-red-400/30 text-indigo-300',
      pill: 'bg-indigo-600 text-white font-bold',
      gradient: 'from-blue-900 to-red-600',
      accent: '#6366f1',
      name: 'Paris Saint-Germain',
      flag: '🇫🇷',
    };
  }
  return {
    bg: 'bg-amber-500/10 border-amber-400/30 text-amber-300',
    pill: 'bg-amber-500 text-slate-950 font-bold',
    gradient: 'from-amber-500 to-amber-600',
    accent: '#f59e0b',
    name: teamName || 'Messi Career',
    flag: '⚽',
  };
}
