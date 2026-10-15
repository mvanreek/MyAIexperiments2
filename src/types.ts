export interface ExtractionData {
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

export interface ParseResponse {
  success: boolean;
  originalQuery: string;
  result: ExtractionData;
  error?: string;
}

export interface ParameterConfig {
  domain: 'datastudio.google.com' | 'lookerstudio.google.com';
  reportId: string;
  pageId: string;
  teamFilterControlId: string; // e.g. df6
  competitionFilterControlId: string; // e.g. df5
  opponentFilterControlId?: string; // e.g. df8
  opponentSecondaryFilterControlId?: string; // e.g. df9
  teamParamKey: string; // e.g. ds0.Team
  competitionParamKey: string; // e.g. ds0.Competition
  opponentParamKey: string; // e.g. ds0.Oponent
  seasonParamKey: string;
  includeFilterControls: boolean;
  includeDataParameters: boolean;
}

export interface QueryHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  extracted: ExtractionData;
  isFavorite?: boolean;
}
