import React, { useState } from 'react';
import {
  Trophy,
  Shield,
  Calendar,
  Crosshair,
  CheckCircle2,
  Info,
  Edit2,
  Check,
  Sparkles,
  HelpCircle,
  Cpu,
  ArrowRight,
  Search,
} from 'lucide-react';
import { ExtractionData } from '../types';
import {
  getTeamStyle,
  TEAMS_LIST,
  COMPETITIONS_LIST,
} from '../utils/messiData';

interface ExtractionResultCardProps {
  extracted: ExtractionData;
  onUpdateExtracted: (updated: ExtractionData) => void;
}

export const ExtractionResultCard: React.FC<ExtractionResultCardProps> = ({
  extracted,
  onUpdateExtracted,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [teamInput, setTeamInput] = useState(
    extracted.teamNormalized || extracted.team
  );
  const [competitionInput, setCompetitionInput] = useState(
    extracted.competitionNormalized || extracted.competition
  );
  const [opponentInput, setOpponentInput] = useState(
    extracted.opponentNormalized || extracted.opponent || ''
  );

  const teamStyle = getTeamStyle(extracted.teamNormalized || extracted.team);

  const handleSaveEdit = () => {
    onUpdateExtracted({
      ...extracted,
      team: teamInput,
      teamNormalized: teamInput,
      competition: competitionInput,
      competitionNormalized: competitionInput,
      opponent: opponentInput,
      opponentNormalized: opponentInput,
    });
    setIsEditing(false);
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> Exact &amp; Fuzzy Matched
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Info className="w-3 h-3" /> Heuristic Match
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/30">
            <HelpCircle className="w-3 h-3" /> Query Match
          </span>
        );
    }
  };

  const hasTeam = Boolean(extracted.teamNormalized || extracted.team);
  const hasComp = Boolean(extracted.competitionNormalized || extracted.competition);
  const hasOpponent = Boolean(extracted.opponentNormalized || extracted.opponent);
  const patterns = extracted.matchedPatterns;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm relative overflow-hidden space-y-4">
      {/* Decorative accent background */}
      <div
        className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ backgroundColor: teamStyle.accent }}
      ></div>

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Extracted Dashboard Parameters
            </h2>
            <p className="text-[11px] text-slate-400">
              Only filters specified in your command are applied to the dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getConfidenceBadge(extracted.confidence)}
          <button
            onClick={() => {
              if (isEditing) {
                handleSaveEdit();
              } else {
                setTeamInput(extracted.teamNormalized || extracted.team);
                setCompetitionInput(
                  extracted.competitionNormalized || extracted.competition
                );
                setOpponentInput(
                  extracted.opponentNormalized || extracted.opponent || ''
                );
                setIsEditing(true);
              }
            }}
            className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            {isEditing ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save</span>
              </>
            ) : (
              <>
                <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Manual Override</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Extracted Entities: Team, Competition, Opponent */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Team Card */}
        <div
          className={`border rounded-xl p-3.5 flex flex-col justify-between transition-all ${
            hasTeam
              ? 'bg-slate-950/70 border-sky-500/30'
              : 'bg-slate-950/40 border-slate-800/60 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-sky-400" /> Team Filter
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                hasTeam
                  ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              {hasTeam ? 'ds0.Team' : 'Unfiltered'}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-1.5">
              <select
                value={teamInput}
                onChange={(e) => setTeamInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="">(None - All Teams)</option>
                {TEAMS_LIST.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="text-xl">{hasTeam ? teamStyle.flag : '⚪'}</div>
              <div>
                <div className="text-sm font-bold text-white tracking-tight">
                  {hasTeam ? (extracted.teamNormalized || extracted.team) : 'All Teams'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {hasTeam ? 'Pre-filled in Team, ds0.Team & df6' : 'No team filter specified in query'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Competition Card */}
        <div
          className={`border rounded-xl p-3.5 flex flex-col justify-between transition-all ${
            hasComp
              ? 'bg-slate-950/70 border-amber-500/30'
              : 'bg-slate-950/40 border-slate-800/60 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Competition Filter
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                hasComp
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              {hasComp ? 'Competition & df5' : 'Unfiltered'}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-1.5">
              <select
                value={competitionInput}
                onChange={(e) => setCompetitionInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">(None - All Competitions)</option>
                {COMPETITIONS_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Trophy className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white tracking-tight truncate">
                  {hasComp
                    ? (extracted.competitionNormalized || extracted.competition)
                    : 'All Competitions'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {hasComp ? 'Pre-filled in Competition, ds0.Competition & df5' : 'No competition filter in query'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Opponent Card */}
        <div
          className={`border rounded-xl p-3.5 flex flex-col justify-between transition-all ${
            hasOpponent
              ? 'bg-slate-950/70 border-emerald-500/30'
              : 'bg-slate-950/40 border-slate-800/60 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" /> Opponent Filter
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                hasOpponent
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              {hasOpponent ? 'Oponent / ds0.Oponent' : 'Unfiltered'}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-1.5">
              <input
                type="text"
                placeholder="Opponent name (e.g. Ajax, Real Madrid)"
                value={opponentInput}
                onChange={(e) => setOpponentInput(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Crosshair className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-bold text-white tracking-tight truncate">
                  {hasOpponent
                    ? (extracted.opponentNormalized || extracted.opponent)
                    : 'All Opponents'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {hasOpponent ? 'Pre-filled in ds0.Oponent & Opponent' : 'No opponent filter in query'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fuzzy-Pattern Matching Trace Indicator */}
      {(patterns?.competitionMatched || patterns?.opponentMatched || patterns?.teamMatched) && (
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Fuzzy-Pattern Matching Resolution:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {patterns.competitionMatched && (
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/90 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Parameter: Competition
                </span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-mono text-amber-300 line-through text-[11px]">
                    &quot;{patterns.competitionOriginal || 'Champions League'}&quot;
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="font-mono font-bold text-emerald-400 text-[11px]">
                    &quot;{patterns.competitionMatched}&quot;
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Match type: Substring match in dashboard values
                </span>
              </div>
            )}

            {patterns.opponentMatched && (
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/90 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Parameter: Oponent
                </span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-mono text-amber-300 line-through text-[11px]">
                    &quot;{patterns.opponentOriginal || 'FC Ajax'}&quot;
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="font-mono font-bold text-emerald-400 text-[11px]">
                    &quot;{patterns.opponentMatched}&quot;
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Match type: Cleaned tag/prefix &amp; matched parameter
                </span>
              </div>
            )}

            {patterns.teamMatched && (
              <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/90 space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Parameter: Team
                </span>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <span className="font-mono text-amber-300 text-[11px]">
                    &quot;{patterns.teamOriginal}&quot;
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="font-mono font-bold text-sky-400 text-[11px]">
                    &quot;{patterns.teamMatched}&quot;
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Match type: Canonical team identifier
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Query Filter Summary */}
      <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-800/20 flex items-center gap-2.5">
        <Info className="w-4 h-4 text-sky-400 shrink-0" />
        <span className="text-xs text-sky-200 font-medium">
          Dashboard query scope: <strong className="text-white">{extracted.querySummary}</strong>
        </span>
      </div>
    </div>
  );
};
