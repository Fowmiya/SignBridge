import React from 'react';
import { SpeechRecognizer } from '../components/speech/SpeechRecognizer';
import { Mic, Sparkles } from 'lucide-react';

export const SpeechToSignPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="speech-to-sign-page-root">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-800 text-xs font-bold border border-sky-200">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Speech Recognition & Sign Avatar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Speech to Sign
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Speak naturally into your device microphone. Spoken words are transcribed live and converted into animated visual sign sequences.
        </p>
      </div>

      {/* Main Recognizer Component */}
      <SpeechRecognizer />
    </div>
  );
};
