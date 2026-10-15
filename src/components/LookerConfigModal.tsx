import React, { useState } from 'react';
import { X, Save, RotateCcw, HelpCircle, Check, Sliders, CheckSquare, Filter } from 'lucide-react';
import { ParameterConfig } from '../types';
import { DEFAULT_CONFIG } from '../utils/lookerUrl';

interface LookerConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ParameterConfig;
  onSaveConfig: (newConfig: ParameterConfig) => void;
}

export const LookerConfigModal: React.FC<LookerConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<ParameterConfig>(config);
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveConfig(formData);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 800);
  };

  const handleReset = () => {
    setFormData(DEFAULT_CONFIG);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Looker Studio Filter &amp; Parameter Settings
              </h3>
              <p className="text-xs text-slate-400">
                Configure filter control IDs (df6, df5) and data parameters (ds0.Team)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Guide Callout */}
          <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs text-sky-200 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-sky-100">
                How Looker Studio Filters Work:
              </p>
              <p className="text-slate-300 leading-relaxed">
                • <strong className="text-emerald-300">df6</strong> &amp; <strong className="text-emerald-300">df5</strong>:
                Interactive on-screen dropdown filter controls (e.g. <code>include%EE%80%800%EE%80%80IN%EE%80%80Argentina</code>).
                <br />
                • <strong className="text-sky-300">ds0.Team</strong> &amp; <strong className="text-sky-300">ds0.Competition</strong>:
                Report-level data parameters.
              </p>
            </div>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              URL Payload Components
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    includeFilterControls: !formData.includeFilterControls,
                  })
                }
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-start gap-2.5 ${
                  formData.includeFilterControls
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <CheckSquare className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">Dropdown Controls</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Includes <code>df6</code> (Team) and <code>df5</code> (Competition)
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    includeDataParameters: !formData.includeDataParameters,
                  })
                }
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-start gap-2.5 ${
                  formData.includeDataParameters
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <CheckSquare className="w-4 h-4 shrink-0 mt-0.5 text-sky-400" />
                <div>
                  <div className="font-bold text-white">Data Parameters</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Includes <code>ds0.Team</code> and <code>ds0.Competition</code>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Filter Control IDs */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Filter Control IDs (Interactive Dropdowns)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Team (df6)
                </label>
                <input
                  type="text"
                  value={formData.teamFilterControlId}
                  onChange={(e) =>
                    setFormData({ ...formData, teamFilterControlId: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Competition (df5)
                </label>
                <input
                  type="text"
                  value={formData.competitionFilterControlId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      competitionFilterControlId: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Opponent (df8)
                </label>
                <input
                  type="text"
                  value={formData.opponentFilterControlId || 'df8'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      opponentFilterControlId: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Opponent (df9)
                </label>
                <input
                  type="text"
                  value={formData.opponentSecondaryFilterControlId || 'df9'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      opponentSecondaryFilterControlId: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Data Parameter Keys */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Data Parameter Keys
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Team Parameter
                </label>
                <input
                  type="text"
                  value={formData.teamParamKey}
                  onChange={(e) =>
                    setFormData({ ...formData, teamParamKey: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Competition Parameter
                </label>
                <input
                  type="text"
                  value={formData.competitionParamKey}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      competitionParamKey: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Opponent Parameter
                </label>
                <input
                  type="text"
                  value={formData.opponentParamKey || 'ds0.Oponent'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      opponentParamKey: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Report ID & Page ID */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">
                Looker Studio Report UUID
              </label>
              <input
                type="text"
                value={formData.reportId}
                onChange={(e) =>
                  setFormData({ ...formData, reportId: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Page ID
                </label>
                <input
                  type="text"
                  value={formData.pageId}
                  onChange={(e) =>
                    setFormData({ ...formData, pageId: e.target.value })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  Default Domain
                </label>
                <select
                  value={formData.domain}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      domain: e.target.value as any,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="datastudio.google.com">
                    datastudio.google.com (Direct - No Redirects)
                  </option>
                  <option value="lookerstudio.google.com">
                    lookerstudio.google.com (Modern)
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-500/20 transition-all active:scale-95"
            >
              {showSavedToast ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
