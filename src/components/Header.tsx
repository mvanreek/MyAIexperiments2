import React from 'react';
import { ExternalLink, Settings, Sparkles, BarChart3 } from 'lucide-react';
import { ORIGINAL_REPORT_URL } from '../utils/lookerUrl';

interface HeaderProps {
  onOpenSettings: () => void;
  isCustomConfig: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, isCustomConfig }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand / Title */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-800 shadow-lg shadow-sky-500/20 text-white font-black text-lg border border-sky-300/30">
            <span className="tracking-tight">10</span>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center text-[9px] text-slate-950 font-black">
              ★
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Messi Goal Tracker
                <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Looker Studio Bridge
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Natural Language AI Filter</span>
              <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Gemini 3.8 Powered
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <a
            href={ORIGINAL_REPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="View original Looker Studio report"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-lg border border-slate-700/60 transition-colors"
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            <span>Base Dashboard</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          <button
            onClick={onOpenSettings}
            className={`relative p-2 rounded-lg border transition-all text-slate-300 hover:text-white ${
              isCustomConfig
                ? 'bg-sky-950/60 border-sky-500/40 text-sky-300'
                : 'bg-slate-900 border-slate-800 hover:bg-slate-800'
            }`}
            title="Configure Looker Studio parameter keys & options"
          >
            <Settings className="w-4 h-4" />
            {isCustomConfig && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400 animate-ping"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
