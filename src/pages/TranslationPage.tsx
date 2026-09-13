import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { translationService, SPOKEN_LANGUAGES } from '../services/translationService';
import { apiService } from '../services/apiService';
import { SpokenLanguageCode } from '../types';
import { speechSynthesisService } from '../services/speechSynthesisService';
import {
  ArrowRightLeft,
  Volume2,
  Copy,
  Sparkles,
} from 'lucide-react';
import { SignAvatarViewer } from '../components/common/SignAvatarViewer';

export const TranslationPage: React.FC = () => {
  const { spokenLang, signLang, addHistoryItem, showToast } = useApp();

  const [sourceLang, setSourceLang] = useState<SpokenLanguageCode>('en');
  const [targetLang, setTargetLang] = useState<SpokenLanguageCode>('ta');
  const [inputText, setInputText] = useState<string>('');
  const [result, setResult] = useState<{
  translatedText: string;
  confidence: number;
  isExact: boolean;
}>({
  translatedText: '',
  confidence: 0,
  isExact: false,
});

  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!inputText.trim()) return;

    try {
      setIsTranslating(true);

      const res = await apiService.translate(
        inputText,
        sourceLang,
        targetLang
      );

      setResult({
        translatedText: res.translatedText,
        confidence: res.confidence,
        isExact: res.isExact,
      });

      showToast('Translation updated', 'info');

      // Save to history
      addHistoryItem({
        inputType: 'text',
        sourceText: inputText,
        translatedText: res.translatedText,
        sourceLang,
        targetLang,
        signLang,
        confidence: res.confidence,
        status: 'completed',
        notes: `Translated from ${sourceLang} to ${targetLang}`,
      });
    } catch (error) {
      console.error('Translation error:', error);

      showToast(
        error instanceof Error
          ? error.message
          : 'Translation failed',
        'error'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSwap = async () => {
    const temp = sourceLang;

    setSourceLang(targetLang);
    setTargetLang(temp);

    if (!result.translatedText) return;

    try {
      setIsTranslating(true);

      setInputText(result.translatedText);

      const res = await apiService.translate(
        result.translatedText,
        targetLang,
        temp
      );

      setResult({
        translatedText: res.translatedText,
        confidence: res.confidence,
        isExact: res.isExact,
      });
    } catch (error) {
      console.error('Translation swap error:', error);

      showToast(
        error instanceof Error
          ? error.message
          : 'Unable to swap translation',
        'error'
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSpeak = (text: string, langCode: string) => {
    const langObj = SPOKEN_LANGUAGES.find(l => l.code === langCode);

    speechSynthesisService.speak(text, {
      lang: langObj?.speechCode,
    });

    showToast(
      `Speaking in ${langObj?.name || 'selected voice'}`,
      'info'
    );
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard', 'success');
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8"
      id="translation-page-root"
    >
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Multilingual Speech & Text Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Regional Language Translation
        </h1>

        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Translate between English, Tamil, Hindi, Malayalam, Telugu, and Kannada with instant phonetic audio playback and sign gloss alignments.
        </p>
      </div>

      {/* Language Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Source Language */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            From:
          </span>

          <select
            value={sourceLang}
            onChange={e =>
              setSourceLang(e.target.value as SpokenLanguageCode)
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 cursor-pointer"
            aria-label="Source language"
          >
            {SPOKEN_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={isTranslating}
          className="p-2.5 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-xl border border-slate-200 transition-colors shadow-2xs disabled:opacity-40"
          title="Swap Languages"
          aria-label="Swap source and target languages"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </button>

        {/* Target Language */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            To:
          </span>

          <select
            value={targetLang}
            onChange={e =>
              setTargetLang(e.target.value as SpokenLanguageCode)
            }
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 cursor-pointer"
            aria-label="Target language"
          >
            {SPOKEN_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>
                {l.flag} {l.name} ({l.nativeName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Translation Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Text Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Original Text
              </span>

              <button
                onClick={() => setInputText('')}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            </div>

            <textarea
              rows={5}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Enter text to translate..."
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-base focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleSpeak(inputText, sourceLang)}
                disabled={!inputText.trim()}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-40"
                title="Speak source text"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleCopy(inputText)}
                disabled={!inputText.trim()}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-40"
                title="Copy source text"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => handleTranslate()}
              disabled={!inputText.trim() || isTranslating}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
              id="translate-btn"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>

        {/* Target Translation Box */}
        <div className="bg-teal-950 text-white rounded-3xl border border-teal-800 shadow-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Translated Result
              </span>

              <span className="text-[11px] font-mono text-teal-300 font-bold bg-teal-900 px-2 py-0.5 rounded">
                Confidence {result.confidence * 100}%
              </span>
            </div>

            <div className="min-h-[130px] p-4 rounded-2xl bg-teal-900/60 border border-teal-800/80">
              <p className="text-xl sm:text-2xl font-bold leading-relaxed text-white">
                {result.translatedText || '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-teal-900/80">
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  handleSpeak(result.translatedText, targetLang)
                }
                disabled={!result.translatedText}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Play Voice</span>
              </button>

              <button
                onClick={() => handleCopy(result.translatedText)}
                disabled={!result.translatedText}
                className="p-2 hover:bg-slate-800 rounded-xl text-slate-300 hover:text-white transition-colors"
                title="Copy translated text"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Target:{' '}
              {SPOKEN_LANGUAGES.find(l => l.code === targetLang)?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Sign Translation for result */}
      <div className="pt-4 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Sign Language Mapping for this Message
        </h3>

        <SignAvatarViewer
          text={inputText}
          signLanguage={signLang}
          autoPlay={false}
        />
      </div>
    </div>
  );
};