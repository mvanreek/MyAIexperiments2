import React, { useState } from 'react';
import {
  ExternalLink,
  RefreshCw,
  Maximize2,
  Minimize2,
  Smartphone,
  Monitor,
  AlertCircle,
  BarChart2,
} from 'lucide-react';
import { ExtractionData, ParameterConfig } from '../types';
import { generateEmbedUrl, generateLookerUrl, mapCompetitionToFilterControl } from '../utils/lookerUrl';

interface DashboardEmbedPreviewProps {
  extracted: ExtractionData | null;
  config: ParameterConfig;
  onUpdateConfig?: (newConfig: ParameterConfig) => void;
}

export const DashboardEmbedPreview: React.FC<DashboardEmbedPreviewProps> = ({
  extracted,
  config,
  onUpdateConfig,
}) => {
  const [key, setKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceWidth, setDeviceWidth] = useState<'full' | 'desktop' | 'tablet'>('full');

  const embedUrl = generateEmbedUrl(extracted, config);
  const directUrl = generateLookerUrl(extracted, config);

  const handleRefresh = () => {
    setKey((prev) => prev + 1);
  };

  const getContainerWidth = () => {
    switch (deviceWidth) {
      case 'tablet':
        return 'max-w-3xl';
      case 'desktop':
        return 'max-w-5xl';
      default:
        return 'w-full';
    }
  };

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-4 z-50 flex flex-col bg-slate-950 border-sky-500/50'
          : 'relative'
      }`}
    >
      {/* Dashboard Preview Toolbar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide">
                Live Looker Studio Preview
              </h2>
              {extracted && (
                <span className="hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  {extracted.teamNormalized || extracted.team || 'All Teams'}
                  {(extracted.competitionNormalized || extracted.competition) && (
                    <> • {extracted.competitionNormalized || extracted.competition}</>
                  )}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive Google Looker Studio Embed
            </p>
          </div>
        </div>

        {/* Viewport & Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Device toggle */}
          <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setDeviceWidth('tablet')}
              className={`p-1.5 rounded transition-colors ${
                deviceWidth === 'tablet'
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tablet view"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceWidth('desktop')}
              className={`p-1.5 rounded transition-colors ${
                deviceWidth === 'desktop'
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Desktop view"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeviceWidth('full')}
              className={`px-2 py-1 text-[11px] font-medium rounded transition-colors ${
                deviceWidth === 'full'
                  ? 'bg-slate-800 text-sky-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Full width"
            >
              100%
            </button>
          </div>

          {/* Refresh iframe button */}
          <button
            onClick={handleRefresh}
            className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center gap-1"
            title="Reload dashboard frame"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {/* Open direct in new tab */}
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors shadow-sm"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Sub-bar: Active Filter Controls (df6, df5) and Parameters */}
      <div className="bg-slate-950/70 border-b border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-300">Active URL Parameters:</span>
          {(extracted?.teamNormalized || extracted?.team) && config.includeFilterControls && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              df6: &quot;{extracted.teamNormalized || extracted.team}&quot;
            </span>
          )}
          {(extracted?.teamNormalized || extracted?.team) && config.includeDataParameters && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30">
              Team / ds0.Team: &quot;{extracted.teamNormalized || extracted.team}&quot;
            </span>
          )}
          {(extracted?.competitionNormalized || extracted?.competition) && config.includeFilterControls && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
              df5: &quot;{mapCompetitionToFilterControl(extracted?.competitionNormalized || extracted?.competition || '')}&quot;
            </span>
          )}
          {(extracted?.competitionNormalized || extracted?.competition) && config.includeDataParameters && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Competition / ds0.Competition: &quot;{extracted.competitionNormalized || extracted.competition}&quot;
            </span>
          )}
          {(extracted?.opponentNormalized || extracted?.opponent) && config.includeFilterControls && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              df8 &amp; df9: &quot;{extracted.opponentNormalized || extracted.opponent}&quot;
            </span>
          )}
          {(extracted?.opponentNormalized || extracted?.opponent) && config.includeDataParameters && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Oponent / ds0.Oponent: &quot;{extracted.opponentNormalized || extracted.opponent}&quot;
            </span>
          )}
          {!extracted?.teamNormalized && !extracted?.team && !extracted?.competitionNormalized && !extracted?.competition && !extracted?.opponentNormalized && !extracted?.opponent && (
            <span className="text-[11px] text-slate-400 font-mono">None (Unfiltered Dashboard)</span>
          )}
        </div>

        {onUpdateConfig && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onUpdateConfig({
                  ...config,
                  includeFilterControls: !config.includeFilterControls,
                });
                setKey((prev) => prev + 1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                config.includeFilterControls
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-slate-950 text-slate-500 border border-slate-900'
              }`}
            >
              Filter Controls: {config.includeFilterControls ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => {
                onUpdateConfig({
                  ...config,
                  includeDataParameters: !config.includeDataParameters,
                });
                setKey((prev) => prev + 1);
              }}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                config.includeDataParameters
                  ? 'bg-slate-800 text-slate-200 border border-slate-700'
                  : 'bg-slate-950 text-slate-500 border border-slate-900'
              }`}
            >
              ds0 Params: {config.includeDataParameters ? 'ON' : 'OFF'}
            </button>
          </div>
        )}
      </div>

      {/* Helpful banner for Looker Studio permissions */}
      <div className="bg-sky-950/40 border-b border-sky-800/30 px-4 py-2 flex items-center justify-between text-xs text-sky-300">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>
            Passing filter parameters to Looker Studio URL. If third-party cookie restrictions or Google authentication prevent frame updates, click{' '}
            <strong>Open in Tab</strong> to launch directly.
          </span>
        </div>
      </div>

      {/* Interactive Frame Container */}
      <div
        className={`p-2 sm:p-4 mx-auto flex justify-center ${
          isFullscreen ? 'flex-1 overflow-auto' : ''
        }`}
      >
        <div className={`w-full ${getContainerWidth()} transition-all duration-200`}>
          <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
            <iframe
              key={key}
              src={embedUrl}
              title="Messi Goal Tracker Google Looker Studio Dashboard"
              className={`w-full border-0 ${
                isFullscreen ? 'h-[calc(100vh-140px)]' : 'h-[650px] sm:h-[750px]'
              }`}
              allowFullScreen
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
