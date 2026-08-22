import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SignAvatarViewer } from '../components/common/SignAvatarViewer';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { SignLanguageSelector } from '../components/common/SignLanguageSelector';
import {
  Type,
  Sparkles,
  ArrowRight,
  Hand,
  Volume2,
  Copy,
  RotateCcw,
  BookOpen,
} from 'lucide-react';
import { translationService } from '../services/translationService';
import { speechSynthesisService } from '../services/speechSynthesisService';

export const TextToSignPage: React.FC = () => {
  const { spokenLang, signLang, addHistoryItem, showToast } = useApp();

  const [inputVal, setInputVal] = useState<string>('Where are you going?');
  const [activeMessage, setActiveMessage] = useState<string>('Where are you going?');

  const handleConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    setActiveMessage(inputVal.trim());
    showToast('Converted text to sign sequence', 'success');

    // Add to history
    addHistoryItem({
      inputType: 'text',
      sourceText: inputVal.trim(),
      translatedText: `🤟 ${signLang} Visual Representation`,
      sourceLang: spokenLang,
      targetLang: signLang,
      signLang: signLang,
      confidence: 0.98,
      status: 'completed',
      notes: `Generated sign gloss and keyframe sequence for ${signLang}`,
    });
  };

  const handleSpeak = () => {
    if (activeMessage) {
      speechSynthesisService.speak(activeMessage);
      showToast('Speaking original message', 'info');
    }
  };

  const handleCopy = () => {
    if (activeMessage) {
      navigator.clipboard.writeText(activeMessage);
      showToast('Copied to clipboard', 'success');
    }
  };

  const samplePhrases = [
    'Where are you going?',
    'I need help, please.',
    'Thank you very much.',
    'Nice to meet you.',
    'I need to see a doctor.',
    'Please give me water.',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="text-to-sign-page-root">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Natural Language to Sign Synthesis</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Text to Sign
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Type any sentence in your preferred language to translate it into structured sign language glosses and animated visual hand representations.
        </p>
      </div>

      {/* Language Controls Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <LanguageSelector idPrefix="text-spoken" label="Spoken Language" />
        <SignLanguageSelector idPrefix="text-target-sign" label="Target Sign System" showHelp />
      </div>

      {/* Main Translation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Text Box */}
        <div className="lg:col-span-6 space-y-4">
          <form onSubmit={handleConvert} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="text-to-sign-textarea" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Message to Sign
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {inputVal.length} / 500 characters
              </span>
            </div>

            <textarea
              id="text-to-sign-textarea"
              rows={4}
              maxLength={500}
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="Type what you want to communicate..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none leading-relaxed"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
                  title="Pronounce text"
                  aria-label="Speak text"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
                  title="Copy text"
                  aria-label="Copy text"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="px-6 py-3.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all shadow-md shadow-teal-900/20 cursor-pointer"
                id="convert-to-sign-btn"
              >
                <span>Convert to Sign</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Phrases Palette */}
          <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              Sample Everyday Phrases
            </span>
            <div className="flex flex-wrap gap-2">
              {samplePhrases.map(phrase => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => {
                    setInputVal(phrase);
                    setActiveMessage(phrase);
                    showToast(`Loaded "${phrase}"`, 'info');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-xs font-medium border border-slate-200/80 transition-colors shadow-2xs"
                >
                  "{phrase}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sign Avatar Visualizer */}
        <div className="lg:col-span-6">
          <SignAvatarViewer
            text={activeMessage}
            signLanguage={signLang}
            autoPlay={true}
          />
        </div>
      </div>
    </div>
  );
};
