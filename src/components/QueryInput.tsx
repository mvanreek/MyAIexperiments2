import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Mic, MicOff, X, ArrowRight, Loader2 } from 'lucide-react';
import { SAMPLE_PROMPTS, SamplePrompt } from '../utils/messiData';

interface QueryInputProps {
  query: string;
  setQuery: (q: string) => void;
  onSubmit: (customQuery?: string) => void;
  isLoading: boolean;
  onClear: () => void;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  query,
  setQuery,
  onSubmit,
  isLoading,
  onClear,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSpeech =
        'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setSpeechSupported(hasSpeech);
    }
  }, []);

  const toggleSpeech = () => {
    if (!speechSupported) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuery(transcript);
          onSubmit(transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handlePromptClick = (prompt: SamplePrompt) => {
    setQuery(prompt.query);
    onSubmit(prompt.query);
  };

  return (
    <div className="w-full space-y-3">
      {/* Search Input Bar */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 via-blue-500 to-amber-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>

        <div className="relative flex items-center bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-center pl-2 sm:pl-3 pr-2 text-sky-400">
            <Sparkles className="w-5 h-5 animate-pulse text-sky-400" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Type command: e.g. 'Show me Messi for Argentina in the Worldcup'..."
            className="w-full bg-transparent border-0 text-white placeholder-slate-400 text-sm sm:text-base focus:ring-0 focus:outline-none px-2 py-1.5"
          />

          <div className="flex items-center space-x-1.5 pr-1">
            {query && !isLoading && (
              <button
                type="button"
                onClick={onClear}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {speechSupported && (
              <button
                type="button"
                onClick={toggleSpeech}
                className={`p-2 rounded-xl transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
                title={isListening ? 'Listening...' : 'Voice command'}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
            )}

            <button
              type="button"
              onClick={() => onSubmit()}
              disabled={isLoading || !query.trim()}
              className="flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Analyzing...</span>
                </>
              ) : (
                <>
                  <span>Extract Filter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts / Example Chips */}
      <div className="pt-1">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Try Quick Commands:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt)}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-sky-500/40 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <span>{prompt.badge}</span>
              <span>{prompt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
