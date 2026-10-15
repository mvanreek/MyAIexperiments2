import { ExtractionData, ParameterConfig } from '../types';
import {
  matchDashboardCompetition,
  matchDashboardTeam,
  matchDashboardOpponent,
} from './fuzzyMatch';

export const DEFAULT_CONFIG: ParameterConfig = {
  domain: 'datastudio.google.com',
  reportId: '9d51c83b-11ea-44eb-b4dd-20a8ca54fd8a',
  pageId: 'JS6uB',
  teamFilterControlId: 'df6', // Verified: Team = Argentina generates df6
  competitionFilterControlId: 'df5', // Competition Dropdown Filter Control
  opponentFilterControlId: 'df8', // Opponent Control 1
  opponentSecondaryFilterControlId: 'df9', // Opponent Control 2 (Verified: df9 is the Opponent combobox)
  teamParamKey: 'ds0.Team',
  competitionParamKey: 'ds0.Competition',
  opponentParamKey: 'ds0.Oponent',
  seasonParamKey: 'ds0.Season',
  includeFilterControls: true, // Enabled: interactive on-screen combobox controls
  includeDataParameters: true,
};

export const ORIGINAL_REPORT_URL =
  'https://datastudio.google.com/u/0/reporting/9d51c83b-11ea-44eb-b4dd-20a8ca54fd8a/page/JS6uB';

/**
 * Builds the Looker Studio viewer filter control string (e.g. df6, df5).
 * Looker Studio stores the internal delimiter as %EE%80%80 in the JSON payload,
 * which when URL-encoded produces %25EE%2580%2580 in the query string.
 * Example: 'include%EE%80%800%EE%80%80IN%EE%80%80Argentina'
 */
export function buildFilterControlValue(val: string): string {
  return `include%EE%80%800%EE%80%80IN%EE%80%80${val}`;
}

/**
 * Maps standard/canonical competition names to the exact filter control label in Looker Studio dropdown/combobox.
 * The dashboard combobox options must match exact allowed values (e.g. 'UEFA Champions League', not 'Champions League').
 */
export function mapCompetitionToFilterControl(canonicalComp: string): string {
  const lower = canonicalComp.toLowerCase();
  if (lower.includes('champions league') || lower.includes('ucl')) {
    // The Looker Studio dashboard combobox has a leading space: " UEFA Champions League"
    return '%20UEFA%20Champions%20League';
  }
  if (lower.includes('world cup') && !lower.includes('club') && !lower.includes('qualif')) {
    return 'World Cup';
  }
  if (lower.includes('la liga') || lower.includes('laliga')) {
    // The Looker Studio dashboard combobox has a leading space for La Liga: " La Liga" (%20La%20Liga)
    return '%20La%20Liga';
  }
  if (lower.includes('copa america') || lower.includes('copa américa')) {
    return 'Copa America';
  }
  if (lower.includes('mls') || lower.includes('major league soccer')) {
    return 'Major League Soccer';
  }
  if (lower.includes('ligue 1') || lower.includes('ligue1')) {
    return '%20Ligue%201';
  }
  if (lower.includes('copa del rey')) {
    return '%20Copa%20del%20Rey';
  }
  if (lower.includes('leagues cup')) {
    return 'Leagues Cup';
  }
  if (lower.includes('supercopa') || lower.includes('spanish super cup')) {
    return '%20Spanish%20Super%20Cup';
  }
  if (lower.includes('club world cup')) {
    return 'FIFA Club World Cup';
  }
  if (lower.includes('super cup') || lower.includes('uefa super cup') || lower.includes('european super cup')) {
    return 'UEFA European Super Cup';
  }
  if (lower.includes('friendly')) {
    return 'International friendly';
  }
  if (lower.includes('qualification') || lower.includes('qualifier')) {
    return 'World Cup Qualification';
  }
  return canonicalComp;
}

export const DEFAULT_EXCLUDE_UNDEFINED = 'exclude%EE%80%803%EE%80%80undefined';

/**
 * Builds the params JSON object based on current configuration and extraction data.
 * Sets both 'ds0.<Key>', '<Key>' AND interactive on-screen filter controls ('df6', 'df5').
 * When a filter control is active on the dashboard (e.g. Team df6), Looker Studio sets
 * any unselected companion controls (e.g. Competition df5) to 'exclude%EE%80%803%EE%80%80undefined'.
 */
export function buildParamsObject(
  extracted: ExtractionData | null,
  config: ParameterConfig = DEFAULT_CONFIG
): Record<string, string> {
  if (!extracted) return {};

  const params: Record<string, string> = {};

  const rawTeam = (extracted.teamNormalized || extracted.team || '').trim();
  const rawComp = (extracted.competitionNormalized || extracted.competition || '').trim();
  const rawOpponent = (extracted.opponentNormalized || extracted.opponent || '').trim();

  const team = rawTeam ? (matchDashboardTeam(rawTeam) || rawTeam) : '';
  const comp = rawComp ? (matchDashboardCompetition(rawComp) || rawComp) : '';
  const opponent = rawOpponent ? (matchDashboardOpponent(rawOpponent) || rawOpponent) : '';

  // 1. Team Filter
  if (team) {
    if (config.includeDataParameters) {
      if (config.teamParamKey) {
        params[config.teamParamKey] = team;
      }
      params['Team'] = team;
      params['ds0.Team'] = team;
    }
  }

  // 2. Competition Filter
  if (comp) {
    if (config.includeDataParameters) {
      if (config.competitionParamKey) {
        params[config.competitionParamKey] = comp;
      }
      params['Competition'] = comp;
      params['ds0.Competition'] = comp;
    }
  }

  // 3. Dropdown Filter Controls (df5 = Competition, df6 = Team)
  if (config.includeFilterControls && (team || comp)) {
    // Competition Control (df5)
    if (config.competitionFilterControlId) {
      if (comp) {
        const filterValue = mapCompetitionToFilterControl(comp);
        params[config.competitionFilterControlId] = buildFilterControlValue(filterValue);
      } else {
        // Looker Studio explicit cleared/unfiltered state
        params[config.competitionFilterControlId] = DEFAULT_EXCLUDE_UNDEFINED;
      }
    }

    // Team Control (df6)
    if (config.teamFilterControlId) {
      if (team) {
        params[config.teamFilterControlId] = buildFilterControlValue(team);
      } else {
        // Looker Studio explicit cleared/unfiltered state
        params[config.teamFilterControlId] = DEFAULT_EXCLUDE_UNDEFINED;
      }
    }
  }

  // 4. Opponent Filter (ONLY if specified by the user, e.g. Netherlands, Ajax)
  if (opponent) {
    if (config.includeDataParameters) {
      params['ds0.Oponent'] = opponent;
      params['ds0.Opponent'] = opponent;
      params['Oponent'] = opponent;
      params['Opponent'] = opponent;
    }
    if (config.includeFilterControls) {
      if (config.opponentFilterControlId) {
        params[config.opponentFilterControlId] = buildFilterControlValue(opponent);
      }
      if (config.opponentSecondaryFilterControlId) {
        params[config.opponentSecondaryFilterControlId] = buildFilterControlValue(opponent);
      }
    }
  }

  return params;
}

/**
 * Encodes the params JSON object matching Google Looker Studio's exact URL syntax
 */
export function encodeLookerParams(paramsObj: Record<string, string>): string {
  const jsonString = JSON.stringify(paramsObj);
  // Standard RFC URI encoding matching Looker Studio's browser navigation
  return encodeURIComponent(jsonString)
    .replace(/%3A/g, ':')
    .replace(/%2C/g, ',');
}

export function encodeReadableLookerParams(paramsObj: Record<string, string>): string {
  const jsonString = JSON.stringify(paramsObj);
  return encodeURIComponent(jsonString)
    .replace(/%3A/g, ':')
    .replace(/%2C/g, ',');
}

/**
 * Generates the full clickable direct Looker Studio URL
 */
export function generateLookerUrl(
  extracted: ExtractionData | null,
  config: ParameterConfig = DEFAULT_CONFIG,
  useAlternateDomain = false
): string {
  const domain = useAlternateDomain
    ? (config.domain === 'datastudio.google.com' ? 'lookerstudio.google.com' : 'datastudio.google.com')
    : config.domain;

  const baseUrl = `https://${domain}/reporting/${config.reportId}/page/${config.pageId}`;

  if (!extracted) {
    return baseUrl;
  }

  const paramsObj = buildParamsObject(extracted, config);
  if (Object.keys(paramsObj).length === 0) {
    return baseUrl;
  }

  const encodedParams = encodeLookerParams(paramsObj);
  return `${baseUrl}?params=${encodedParams}`;
}

/**
 * Generates the Looker Studio embed URL for iframe preview
 */
export function generateEmbedUrl(
  extracted: ExtractionData | null,
  config: ParameterConfig = DEFAULT_CONFIG
): string {
  const baseUrl = `https://${config.domain}/embed/reporting/${config.reportId}/page/${config.pageId}`;

  if (!extracted) {
    return baseUrl;
  }

  const paramsObj = buildParamsObject(extracted, config);
  if (Object.keys(paramsObj).length === 0) {
    return baseUrl;
  }

  const encodedParams = encodeLookerParams(paramsObj);
  return `${baseUrl}?params=${encodedParams}`;
}
