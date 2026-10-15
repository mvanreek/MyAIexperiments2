import React from 'react';
import { History, Star, ArrowRight, Trash2, Clock } from 'lucide-react';
import { QueryHistoryItem } from '../types';

interface HistoryAndBookmarksProps {
  history: QueryHistoryItem[];
  onSelectQuery: (item: QueryHistoryItem) => void;
  onToggleFavorite: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryAndBookmarks: React.FC<HistoryAndBookmarksProps> = ({
  history,
  onSelectQuery,
  onToggleFavorite,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h2 className="text-sm font-bold text-white tracking-wide">
            Recent Queries &amp; Bookmarks
          </h2>
        </div>
        <button
          onClick={onClearHistory}
          className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
          title="Clear search history"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {history.map((item) => (
          <div
            key={item.id}
            className="group relative bg-slate-950/70 hover:bg-slate-950 border border-slate-800/90 hover:border-sky-500/40 rounded-xl p-3 transition-all flex flex-col justify-between space-y-2 cursor-pointer shadow-sm hover:shadow-md"
            onClick={() => onSelectQuery(item)}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-slate-200 line-clamp-2 leading-relaxed">
                &ldquo;{item.query}&rdquo;
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item.id);
                }}
                className={`p-1 rounded-md transition-colors ${
                  item.isFavorite
                    ? 'text-amber-400'
                    : 'text-slate-600 hover:text-amber-400 opacity-60 group-hover:opacity-100'
                }`}
                title={item.isFavorite ? 'Remove bookmark' : 'Bookmark query'}
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    item.isFavorite ? 'fill-amber-400' : ''
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-900">
              <div className="flex items-center gap-1.5 text-slate-400 truncate">
                <span className="text-sky-300 font-semibold truncate max-w-[80px]">
                  {item.extracted.teamNormalized || item.extracted.team}
                </span>
                <span>•</span>
                <span className="text-amber-300 font-semibold truncate max-w-[90px]">
                  {item.extracted.competitionNormalized ||
                    item.extracted.competition}
                </span>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-sky-400 transition-colors shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
