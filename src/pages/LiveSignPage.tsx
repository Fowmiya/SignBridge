import React from 'react';
import { CameraViewer } from '../components/camera/CameraViewer';
import { Sparkles, Info, ShieldCheck } from 'lucide-react';

export const LiveSignPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="live-sign-page-root">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Real-Time Gesture Vision</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Live Sign Recognition
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Use your camera to translate sign language into natural text and spoken voice. Frame landmarks are tracked directly in your browser.
        </p>
      </div>

      {/* Main Camera Studio Component */}
      <CameraViewer />

      {/* Instructional Guidance Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-mono text-[11px]">1</span>
            Position Yourself
          </span>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ensure your upper body and both hands are clearly visible within the center signing window.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-mono text-[11px]">2</span>
            Sign Naturally
          </span>
          <p className="text-xs text-slate-500 leading-relaxed">
            Perform manual signs with steady wrist pauses between phrases for optimal landmark tracking.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-mono text-[11px]">3</span>
            Audible Synthesis
          </span>
          <p className="text-xs text-slate-500 leading-relaxed">
            Tap "Play Voice" to synthesize recognized gestures into clear audio speech for your partner.
          </p>
        </div>
      </div>
    </div>
  );
};
