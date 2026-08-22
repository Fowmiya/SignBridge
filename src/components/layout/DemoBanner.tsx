import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { Sparkles, Info, X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoBannerVisible, setIsDemoBannerVisible } = useApp();

  if (!isDemoBannerVisible) return null;

  return (
    <div
      role="banner"
      aria-label="Demo notice"
      className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white border-b border-teal-800/40 text-xs px-4 py-2.5 transition-all shadow-inner"
      id="signbridge-demo-banner"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[280px]">
          <span className="inline-flex items-center gap-1 bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/40 tracking-wider text-[10px] uppercase shrink-0">
            <Sparkles className="w-3 h-3 text-teal-300" />
            Demo Mode
          </span>
          <p className="text-slate-300 font-normal leading-tight">
            <span className="font-semibold text-white">Frontend Prototype:</span> Real browser camera, speech recognition, and text-to-speech are enabled. Future MediaPipe & Transformer AI models will connect here.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/how-it-works"
            className="text-teal-300 hover:text-teal-200 underline font-medium flex items-center gap-1 transition-colors"
          >
            <Info className="w-3 h-3" />
            <span>View Architecture</span>
          </Link>
          <button
            onClick={() => setIsDemoBannerVisible(false)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/10 transition-colors"
            aria-label="Dismiss banner"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
