import React from 'react';
import { TwoWayPanel } from '../components/conversation/TwoWayPanel';
import { MessageSquareText, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';

export const ConversationPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="conversation-page-root">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Real-Time Bi-Directional Dialogue</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Two-Way Conversation Bridge
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Connect sign-language users and hearing speakers in an inclusive, instant dialogue. Both participants have specialized input controls and real-time translations.
        </p>
      </div>

      {/* Main Two-Way Panel */}
      <TwoWayPanel />

      {/* Security & Experience Notice */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>All conversation transcripts are stored locally in your browser's private storage.</span>
        </div>
        <span className="font-semibold text-teal-700 hidden sm:inline">Encrypted Client Session</span>
      </div>
    </div>
  );
};
