import React from 'react';
import { useApp } from '../context/AppContext';
import { SPOKEN_LANGUAGES, SIGN_LANGUAGES } from '../services/translationService';
import { SpokenLanguageCode, SignLanguageCode } from '../types';
import { speechSynthesisService } from '../services/speechSynthesisService';
import {
  Sliders,
  Sparkles,
  Volume2,
  Globe,
  Hand,
  ShieldCheck,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Eye,
  Activity,
  Zap,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    accessibility,
    updateAccessibility,
    spokenLang,
    setSpokenLang,
    signLang,
    setSignLang,
    clearHistory,
    clearConversation,
    showToast,
  } = useApp();

  const handleTestVoice = () => {
    speechSynthesisService.speak('Hello! This is a test of your SignBridge speech settings.', {
      rate: accessibility.speechRate,
      pitch: accessibility.speechPitch,
    });
    showToast('Testing speech playback', 'info');
  };

  const handleResetDefaults = () => {
    updateAccessibility({
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      speechRate: 1.0,
      speechPitch: 1.0,
      showLandmarks: true,
      captionsEnabled: true,
    });
    setSpokenLang('en');
    setSignLang('ISL');
    showToast('Settings reset to default', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10" id="settings-page-root">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
            <Sliders className="w-3.5 h-3.5 text-teal-600" />
            <span>Preferences & System Controls</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Settings
          </h1>
          <p className="text-sm text-slate-600">
            Customize accessibility modes, languages, speech playback, and local data.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* 1. ACCESSIBILITY SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Accessibility & Display</h2>
            <p className="text-xs text-slate-500">Tailor the visual environment to your personal visual preferences</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 space-y-4">
          {/* High Contrast */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <label htmlFor="settings-high-contrast" className="text-sm font-bold text-slate-900 cursor-pointer">
                High Contrast Mode
              </label>
              <p className="text-xs text-slate-500">Increases contrast ratios across text, buttons, and borders (WCAG AAA).</p>
            </div>
            <input
              id="settings-high-contrast"
              type="checkbox"
              checked={accessibility.highContrast}
              onChange={e => updateAccessibility({ highContrast: e.target.checked })}
              className="w-6 h-6 text-teal-600 rounded-lg border-slate-300 focus:ring-teal-500 cursor-pointer"
            />
          </div>

          {/* Large Text */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <label htmlFor="settings-large-text" className="text-sm font-bold text-slate-900 cursor-pointer">
                Large Text Mode
              </label>
              <p className="text-xs text-slate-500">Scales base typography up by 125% for easier legibility.</p>
            </div>
            <input
              id="settings-large-text"
              type="checkbox"
              checked={accessibility.largeText}
              onChange={e => updateAccessibility({ largeText: e.target.checked })}
              className="w-6 h-6 text-teal-600 rounded-lg border-slate-300 focus:ring-teal-500 cursor-pointer"
            />
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between pt-4">
            <div className="space-y-0.5">
              <label htmlFor="settings-reduced-motion" className="text-sm font-bold text-slate-900 cursor-pointer">
                Reduced Motion
              </label>
              <p className="text-xs text-slate-500">Disables intensive UI animations and smooths transitions.</p>
            </div>
            <input
              id="settings-reduced-motion"
              type="checkbox"
              checked={accessibility.reducedMotion}
              onChange={e => updateAccessibility({ reducedMotion: e.target.checked })}
              className="w-6 h-6 text-teal-600 rounded-lg border-slate-300 focus:ring-teal-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 2. AUDIO & SPEECH SYNTHESIS */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Audio & Voice Synthesis</h2>
            <p className="text-xs text-slate-500">Control how recognized sign gestures are vocalized</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Speech Rate (Speed)</span>
              <span className="text-teal-700 font-mono font-bold">{accessibility.speechRate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={accessibility.speechRate}
              onChange={e => updateAccessibility({ speechRate: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              aria-label="Speech speed"
            />
          </div>

          {/* Pitch */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700">Voice Pitch</span>
              <span className="text-indigo-700 font-mono font-bold">{accessibility.speechPitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.1"
              value={accessibility.speechPitch}
              onChange={e => updateAccessibility({ speechPitch: parseFloat(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              aria-label="Voice pitch"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleTestVoice}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-200"
            >
              <Volume2 className="w-4 h-4" />
              <span>Test Speech Playback</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. DEFAULT LANGUAGES */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Default Language Systems</h2>
            <p className="text-xs text-slate-500">Configure your primary spoken and sign language rules</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Default Spoken Dialect
            </label>
            <select
              value={spokenLang}
              onChange={e => setSpokenLang(e.target.value as SpokenLanguageCode)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {SPOKEN_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.name} ({l.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Default Sign Language Grammar
            </label>
            <select
              value={signLang}
              onChange={e => setSignLang(e.target.value as SignLanguageCode)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              {SIGN_LANGUAGES.map(s => (
                <option key={s.code} value={s.code}>
                  🤟 {s.name} ({s.code}) - {s.region}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. PRIVACY & LOCAL DATA STORAGE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Privacy & Data Management</h2>
            <p className="text-xs text-slate-500">SignBridge stores all transcripts and media locally on this device</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900">Clear Local App Data</h4>
            <p className="text-xs text-slate-500">Purges conversation messages and translation histories from your browser.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                clearConversation();
                clearHistory();
                showToast('Cleared all local data', 'success');
              }}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge All History & Messages</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
