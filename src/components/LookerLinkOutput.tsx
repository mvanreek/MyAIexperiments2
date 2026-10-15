import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Code2,
  Share2,
  Layers,
  ArrowUpRight,
  Globe,
  SlidersHorizontal,
  CheckSquare,
  HelpCircle,
  Filter,
} from 'lucide-react';
import { ExtractionData, ParameterConfig } from '../types';
import {
  generateLookerUrl,
  generateEmbedUrl,
  buildParamsObject,
  mapCompetitionToFilterControl,
} from '../utils/lookerUrl';

interface LookerLinkOutputProps {
  extracted: ExtractionData;
  config: ParameterConfig;
  onUpdateConfig: (newConfig: ParameterConfig) => void;
  onSelectEmbedTab?: () => void;
}

export const LookerLinkOutput: React.FC<LookerLinkOutputProps> = ({
  extracted,
  config,
  onUpdateConfig,
  onSelectEmbedTab,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedParams, setCopiedParams] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const lookerUrl = generateLookerUrl(extracted, config);
  const embedUrl = generateEmbedUrl(extracted, config);
  const paramsObj = buildParamsObject(extracted, config);
  const paramsJsonPretty = JSON.stringify(paramsObj, null, 2);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(lookerUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyParams = () => {
    navigator.clipboard.writeText(paramsJsonPretty);
    setCopiedParams(true);
    setTimeout(() => setCopiedParams(false), 2000);
  };

  const handleCopyEmbedCode = () => {
    const embedCode = `<iframe width="100%" height="750" src="${embedUrl}" frameborder="0" style="border:0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  const setDomain = (domain: 'datastudio.google.com' | 'lookerstudio.google.com') => {
    onUpdateConfig({
      ...config,
      domain,
    });
  };

  const toggleFilterControls = () => {
    onUpdateConfig({
      ...config,
      includeFilterControls: !config.includeFilterControls,
    });
  };

  const toggleDataParams = () => {
    onUpdateConfig({
      ...config,
      includeDataParameters: !config.includeDataParameters,
    });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Dynamic Looker Studio Output
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {Boolean(extracted.teamNormalized || extracted.team) && (
              <span className="text-sky-300 font-mono font-semibold mr-2">
                Team (&quot;{extracted.teamNormalized || extracted.team}&quot;)
              </span>
            )}
            {Boolean(extracted.competitionNormalized || extracted.competition) && (
              <span className="text-amber-300 font-mono font-semibold mr-2">
                Competition (&quot;{extracted.competitionNormalized || extracted.competition}&quot;)
              </span>
            )}
            {Boolean(extracted.opponentNormalized || extracted.opponent) && (
              <span className="text-emerald-300 font-mono font-semibold">
                Oponent (&quot;{extracted.opponentNormalized || extracted.opponent}&quot;)
              </span>
            )}
            {!extracted.teamNormalized && !extracted.team && !extracted.competitionNormalized && !extracted.competition && !extracted.opponentNormalized && !extracted.opponent && (
              <span>Unfiltered career dashboard link</span>
            )}
          </p>
        </div>

        {/* Domain toggle */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setDomain('datastudio.google.com')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              config.domain === 'datastudio.google.com'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            datastudio.google.com (Default)
          </button>
          <button
            type="button"
            onClick={() => setDomain('lookerstudio.google.com')}
            className={`px-2.5 py-1 rounded font-medium transition-colors ${
              config.domain === 'lookerstudio.google.com'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            lookerstudio.google.com
          </button>
        </div>
      </div>

      {/* Filter Control Configuration Bar */}
      <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-sky-400" />
            Looker Studio Parameters &amp; Filter Controls Enabled:
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFilterControls}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                config.includeFilterControls
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Dropdown Controls (df6, df5)</span>
            </button>

            <button
              type="button"
              onClick={toggleDataParams}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                config.includeDataParameters
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'bg-slate-900 text-slate-500 border border-slate-800'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Data Parameters (ds0.Team)</span>
            </button>
          </div>
        </div>

        {/* Active Keys Info Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
          <span className="text-slate-400 font-sans">Active in URL:</span>
          {Boolean(extracted.teamNormalized || extracted.team) && config.includeDataParameters && (
            <span className="bg-slate-900 text-sky-300 px-2 py-0.5 rounded border border-slate-800">
              Team / ds0.Team = &quot;{extracted.teamNormalized || extracted.team}&quot;
            </span>
          )}
          {Boolean(extracted.teamNormalized || extracted.team) && config.includeFilterControls && (
            <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-slate-800">
              df6 = Team Filter Control
            </span>
          )}
          {Boolean(extracted.competitionNormalized || extracted.competition) && config.includeDataParameters && (
            <span className="bg-slate-900 text-amber-300 px-2 py-0.5 rounded border border-slate-800">
              Competition / ds0.Competition = &quot;{extracted.competitionNormalized || extracted.competition}&quot;
            </span>
          )}
          {Boolean(extracted.competitionNormalized || extracted.competition) && config.includeFilterControls && (
            <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-slate-800">
              df5 = Competition Filter Control
            </span>
          )}
          {Boolean(extracted.opponentNormalized || extracted.opponent) && config.includeDataParameters && (
            <span className="bg-slate-900 text-emerald-400 px-2 py-0.5 rounded border border-slate-800">
              Oponent / ds0.Oponent = &quot;{extracted.opponentNormalized || extracted.opponent}&quot;
            </span>
          )}
          {Boolean(extracted.opponentNormalized || extracted.opponent) && config.includeFilterControls && (
            <span className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-slate-800">
              {config.opponentFilterControlId || 'df8'} &amp; {config.opponentSecondaryFilterControlId || 'df9'} = Opponent Controls
            </span>
          )}
          {!extracted.teamNormalized && !extracted.team && !extracted.competitionNormalized && !extracted.competition && !extracted.opponentNormalized && !extracted.opponent && (
            <span className="bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
              (No query parameters active - full career view)
            </span>
          )}
        </div>
      </div>

      {/* Primary Clickable Link Card & Open Button */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-sky-500/30 rounded-xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider">
              Generated Report URL
            </span>
            <span className="text-[10px] text-slate-400">
              (Live filter link)
            </span>
          </div>
          <a
            href={lookerUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Click to open pre-filtered report in Looker Studio"
            className="text-xs sm:text-sm font-mono text-sky-300 hover:text-sky-100 hover:underline break-all block line-clamp-2"
          >
            {lookerUrl}
          </a>
        </div>

        {/* Big Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95 shadow-sm"
            title="Copy URL to clipboard"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <a
            href={lookerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/25 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>Open in Looker Studio</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Parameter Details & Embed Options */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* JSON Parameter Payload Preview */}
        <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-sky-400" />
              Passed `params` Payload (JSON):
            </span>
            <button
              onClick={handleCopyParams}
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              {copiedParams ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-400 bg-slate-900/90 p-2.5 rounded-lg overflow-x-auto border border-slate-800/80 leading-relaxed">
            {paramsJsonPretty}
          </pre>
        </div>

        {/* Embed code / Quick sharing card */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              Embed &amp; Sharing
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              Embed this pre-filtered Messi dashboard into internal wikis, Notion, or websites.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleCopyEmbedCode}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copiedEmbed ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Embed Code Copied!</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy &lt;iframe&gt; Code</span>
                </>
              )}
            </button>

            {onSelectEmbedTab && (
              <button
                onClick={onSelectEmbedTab}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>View Live Dashboard Below</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Looker Studio Configuration Tip Box */}
      <div className="bg-sky-950/30 border border-sky-800/30 rounded-xl p-3.5 text-xs text-sky-200 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sky-100">
            Looker Studio Filter Control Binding:
          </p>
          <p className="text-slate-300 leading-relaxed">
            In Looker Studio, on-screen filter controls use bookmark identifiers (e.g. <code>df6</code> for Team and <code>df5</code> for Competition).
            The tool passes both <code>df6</code> and <code>ds0.Team</code> so your dashboard dropdown values populate immediately!
          </p>
        </div>
      </div>
    </div>
  );
};
