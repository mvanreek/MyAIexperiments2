import React from 'react';
import { Target, ChevronRight, Sliders, Sparkles, Filter } from 'lucide-react';

interface MessiStatsOverviewProps {
  onQuickFilter: (query: string) => void;
}

export const MessiStatsOverview: React.FC<MessiStatsOverviewProps> = ({
  onQuickFilter,
}) => {
  const presets = [
    {
      label: 'Fuzzy: Champions League',
      query: 'shjow me Messi goals he made in Champions League',
      tag: 'Substring Match',
      matchedParam: 'Competition: "UEFA Champions League"',
      note: 'Auto-corrects substring to exact dashboard parameter',
      color: 'border-blue-500/30 text-blue-300 hover:border-blue-400',
    },
    {
      label: 'Fuzzy: Opponent FC Ajax',
      query: "show me Messi goals he made against (oponent) 'FC Ajax'",
      tag: 'Prefix & Tag Clean',
      matchedParam: 'Oponent: "Ajax"',
      note: 'Strips (oponent) tag and FC prefix to match parameter Ajax',
      color: 'border-emerald-500/30 text-emerald-300 hover:border-emerald-400',
    },
    {
      label: 'Argentina in World Cup',
      query: 'Show me Messi for Argentina in the Worldcup',
      tag: 'Team & Competition',
      matchedParam: 'Team: "Argentina" + Competition: "FIFA World Cup"',
      note: 'Sets parameters Team: Argentina and Competition: FIFA World Cup',
      color: 'border-sky-500/30 text-sky-300 hover:border-sky-400',
    },
    {
      label: 'All Argentina Goals',
      query: 'Show me all Messi goals for Argentina',
      tag: 'Team Only',
      matchedParam: 'Team: "Argentina"',
      note: 'Leaves competition unfiltered (all tournaments)',
      color: 'border-sky-500/30 text-sky-300 hover:border-sky-400',
    },
    {
      label: 'Barcelona in La Liga',
      query: 'Messi goals for FC Barcelona in La Liga',
      tag: 'Team & Competition',
      matchedParam: 'Team: "FC Barcelona" + Competition: "La Liga"',
      note: 'Filters Spanish league matches',
      color: 'border-amber-500/30 text-amber-300 hover:border-amber-400',
    },
    {
      label: 'Against Real Madrid',
      query: 'Messi goals against Real Madrid',
      tag: 'Opponent Only',
      matchedParam: 'Oponent: "Real Madrid"',
      note: 'Filters by rival club in parameter Opponent',
      color: 'border-purple-500/30 text-purple-300 hover:border-purple-400',
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">
            Dashboard Parameter Presets &amp; Test Queries
          </h2>
        </div>
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <Sliders className="w-3.5 h-3.5 text-sky-400" />
          Fuzzy Match Tested
        </span>
      </div>

      <p className="text-xs text-slate-400">
        Click any preset to test natural language parsing and generate the Looker Studio report URL:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {presets.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onQuickFilter(item.query)}
            className={`text-left p-3 rounded-xl bg-slate-950/60 border ${item.color} transition-all hover:bg-slate-950 group active:scale-95 flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                  {item.label}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  {item.tag}
                </span>
              </div>
              <div className="text-[11px] font-mono text-emerald-400 mt-2 font-semibold">
                {item.matchedParam}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                {item.note}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-900 text-[10px] text-slate-400 group-hover:text-sky-300">
              <span className="truncate mr-2 font-mono text-slate-500">
                &quot;{item.query}&quot;
              </span>
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
