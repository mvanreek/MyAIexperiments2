import React from 'react';
import { Trophy, Shield, Crosshair, Check, ChevronDown, Sparkles } from 'lucide-react';
import {
  DASHBOARD_COMPETITIONS,
  DASHBOARD_TEAMS,
  DASHBOARD_OPPONENTS,
} from '../utils/fuzzyMatch';
import { ExtractionData } from '../types';

interface ParameterComboboxSelectorProps {
  extracted: ExtractionData | null;
  onSelectCompetition: (comp: string) => void;
  onSelectTeam: (team: string) => void;
  onSelectOpponent: (opp: string) => void;
  onClearFilters: () => void;
}

export const ParameterComboboxSelector: React.FC<ParameterComboboxSelectorProps> = ({
  extracted,
  onSelectCompetition,
  onSelectTeam,
  onSelectOpponent,
  onClearFilters,
}) => {
  const currentComp = extracted?.competitionNormalized || extracted?.competition || '';
  const currentTeam = extracted?.teamNormalized || extracted?.team || '';
  const currentOpp = extracted?.opponentNormalized || extracted?.opponent || '';

  const hasAnyFilter = Boolean(currentComp || currentTeam || currentOpp);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-amber-400"></span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Dashboard Combobox Parameter Dropdowns
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Strict rule: Parameters must match allowed dropdown values exactly (e.g.{' '}
            <span className="text-amber-300 font-medium">&quot;UEFA Champions League&quot;</span>,{' '}
            <span className="text-emerald-300 font-medium">&quot;Ajax&quot;</span>,{' '}
            <span className="text-sky-300 font-medium">&quot;FC Barcelona&quot;</span>)
          </p>
        </div>

        {hasAnyFilter && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-[11px] text-slate-400 hover:text-white underline hover:no-underline self-start sm:self-auto"
          >
            Clear all filters (full career)
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Competition Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-amber-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              Competition:
            </span>
            <span className="text-[10px] font-mono text-slate-400">ds0.Competition</span>
          </label>
          <div className="relative">
            <select
              value={currentComp}
              onChange={(e) => onSelectCompetition(e.target.value)}
              className="w-full appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none pr-8 cursor-pointer font-medium"
            >
              <option value="">(All Competitions - Unfiltered)</option>
              {DASHBOARD_COMPETITIONS.map((comp) => (
                <option key={comp} value={comp}>
                  {comp}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {currentComp && (
            <p className="text-[10px] text-amber-400/90 font-mono truncate">
              ✓ Active: &quot;{currentComp}&quot;
            </p>
          )}
        </div>

        {/* 2. Team Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-sky-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-sky-400" />
              Team:
            </span>
            <span className="text-[10px] font-mono text-slate-400">ds0.Team</span>
          </label>
          <div className="relative">
            <select
              value={currentTeam}
              onChange={(e) => onSelectTeam(e.target.value)}
              className="w-full appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none pr-8 cursor-pointer font-medium"
            >
              <option value="">(All Teams - Unfiltered)</option>
              {DASHBOARD_TEAMS.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {currentTeam && (
            <p className="text-[10px] text-sky-400/90 font-mono truncate">
              ✓ Active: &quot;{currentTeam}&quot;
            </p>
          )}
        </div>

        {/* 3. Opponent Dropdown */}
        <div className="space-y-1">
          <label className="text-[11px] font-semibold text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              Opponent:
            </span>
            <span className="text-[10px] font-mono text-slate-400">ds0.Oponent</span>
          </label>
          <div className="relative">
            <select
              value={currentOpp}
              onChange={(e) => onSelectOpponent(e.target.value)}
              className="w-full appearance-none bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-white focus:outline-none pr-8 cursor-pointer font-medium"
            >
              <option value="">(All Opponents - Unfiltered)</option>
              {DASHBOARD_OPPONENTS.map((opp) => (
                <option key={opp} value={opp}>
                  {opp}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {currentOpp && (
            <p className="text-[10px] text-emerald-400/90 font-mono truncate">
              ✓ Active: &quot;{currentOpp}&quot;
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
