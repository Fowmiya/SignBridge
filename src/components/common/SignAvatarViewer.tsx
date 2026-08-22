import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { signGenerationService, GeneratedSignSequence, SignKeyframe } from '../../services/signGenerationService';
import { SignLanguageCode } from '../../types';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Hand,
  Sparkles,
  Subtitles,
  Info,
  ChevronRight,
} from 'lucide-react';
import { speechSynthesisService } from '../../services/speechSynthesisService';

interface Props {
  text: string;
  signLanguage?: SignLanguageCode;
  autoPlay?: boolean;
}

export const SignAvatarViewer: React.FC<Props> = ({
  text,
  signLanguage = 'ISL',
  autoPlay = false,
}) => {
  const { accessibility, showToast } = useApp();
  const [sequence, setSequence] = useState<GeneratedSignSequence | null>(null);
  const [currentKeyframeIndex, setCurrentKeyframeIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const timerRef = useRef<any>(null);

  // Generate sequence whenever text or signLanguage changes
  useEffect(() => {
    if (text.trim()) {
      const seq = signGenerationService.generateSignSequence(text, signLanguage as SignLanguageCode);
      setSequence(seq);
      setCurrentKeyframeIndex(0);
      setIsPlaying(autoPlay);
    } else {
      setSequence(null);
    }
  }, [text, signLanguage, autoPlay]);

  // Handle animation timer
  useEffect(() => {
    if (!isPlaying || !sequence || sequence.keyframes.length === 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentKf = sequence.keyframes[currentKeyframeIndex];
    const duration = Math.max(400, (currentKf.durationMs || 900) / speed);

    timerRef.current = setTimeout(() => {
      setCurrentKeyframeIndex(prev => {
        if (prev + 1 < sequence.keyframes.length) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return 0; // Loop or reset
        }
      });
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentKeyframeIndex, sequence, speed]);

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setCurrentKeyframeIndex(0);
    setIsPlaying(true);
  };

  const handleSpeakText = () => {
    if (text) {
      speechSynthesisService.speak(text);
      showToast('Speaking original text', 'info');
    }
  };

  if (!text || !sequence) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-100/70 rounded-2xl border-2 border-dashed border-slate-300 text-center min-h-[320px]">
        <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
          <Hand className="w-7 h-7" />
        </div>
        <h4 className="text-base font-bold text-slate-800">Sign Language Output</h4>
        <p className="text-sm text-slate-500 max-w-sm mt-1">
          Type or speak a message to generate visual sign language representations and animated gloss sequences.
        </p>
      </div>
    );
  }

  const currentKf: SignKeyframe = sequence.keyframes[currentKeyframeIndex] || sequence.keyframes[0];

  return (
    <div
      className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col"
      id="sign-avatar-viewer"
    >
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          <span className="font-bold tracking-wide text-teal-300 uppercase">
            {signLanguage} Visual Output
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSpeakText}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Pronounce text"
            aria-label="Speak text"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <span className="text-[11px] text-slate-400 font-mono bg-slate-800 px-2 py-0.5 rounded">
            Step {currentKeyframeIndex + 1}/{sequence.keyframes.length}
          </span>
        </div>
      </div>

      {/* Main Avatar / Visual Stage */}
      <div className="relative h-64 sm:h-72 bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center overflow-hidden">
        {/* Visual spatial grid background */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#0d9488_1px,transparent_1px),linear-gradient(to_bottom,#0d9488_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Dynamic 2D/3D Avatar Silhouette with Landmark Skeleton & Hand Shapes */}
        <div className="relative w-48 h-56 flex flex-col items-center justify-center">
          {/* Head & Facial Expression Ring */}
          <div className="relative w-16 h-18 rounded-full bg-teal-950 border-2 border-teal-400/80 flex items-center justify-center shadow-lg shadow-teal-500/20 transition-all duration-300">
            {/* Eyes */}
            <div className="flex gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-300"></span>
              <span className="w-2 h-2 rounded-full bg-teal-300"></span>
            </div>
            {/* Mouth */}
            <div className="absolute bottom-3 w-4 h-1 bg-teal-300 rounded-full"></div>

            {/* Expression Indicator */}
            <div className="absolute -top-3 bg-teal-500/20 text-teal-300 text-[9px] px-1.5 py-0.2 rounded-full border border-teal-500/40 uppercase font-mono">
              Face: {currentKf.facialExpression.split(',')[0]}
            </div>
          </div>

          {/* Shoulders & Torso */}
          <div className="w-32 h-20 bg-slate-800/80 rounded-t-3xl border-t-2 border-slate-700 mt-2 relative flex justify-between px-2 pt-2">
            {/* Left Arm & Hand Skeleton */}
            <div
              className={`flex flex-col items-center transition-all duration-300 transform ${
                isPlaying ? 'scale-105 -translate-y-1' : ''
              }`}
            >
              <div className="w-1.5 h-12 bg-teal-500/80 rounded-full transform -rotate-25 origin-top"></div>
              <div className="w-9 h-9 rounded-xl bg-teal-600/90 border border-teal-300 flex items-center justify-center text-white shadow-md shadow-teal-600/40 mt-1 animate-landmark">
                <Hand className="w-5 h-5" />
              </div>
            </div>

            {/* Right Arm & Hand Skeleton */}
            <div
              className={`flex flex-col items-center transition-all duration-300 transform ${
                isPlaying ? 'scale-105 -translate-y-2' : ''
              }`}
            >
              <div className="w-1.5 h-12 bg-teal-500/80 rounded-full transform rotate-25 origin-top"></div>
              <div className="w-9 h-9 rounded-xl bg-teal-500 border border-teal-200 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-teal-400/30 mt-1 animate-landmark">
                <span className="text-xs">{currentKf.signGloss.slice(0, 3)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtitles Overlay if enabled */}
        {accessibility.captionsEnabled && (
          <div className="absolute bottom-3 left-4 right-4 bg-slate-950/90 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-slate-700/80 text-center">
            <span className="text-teal-400 font-mono font-bold text-xs uppercase mr-2">
              GLOSS: [{currentKf.signGloss}]
            </span>
            <span className="text-slate-300 text-xs">"{text}"</span>
          </div>
        )}

        {/* Demo notice badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-800/90 text-slate-400 text-[10px] px-2 py-0.5 rounded-full border border-slate-700">
          <Sparkles className="w-3 h-3 text-teal-400" />
          <span>Simulated 3D Avatar Sequence</span>
        </div>
      </div>

      {/* Gloss Token Navigation Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 shrink-0">
          Glosses:
        </span>
        {sequence.keyframes.map((kf, idx) => (
          <button
            key={kf.id + idx}
            onClick={() => {
              setCurrentKeyframeIndex(idx);
              setIsPlaying(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
              idx === currentKeyframeIndex
                ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-400 shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            {kf.signGloss}
          </button>
        ))}
      </div>

      {/* Gesture details breakdown */}
      <div className="p-4 bg-slate-900 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">Hand Configuration:</span>
          <p className="text-slate-200 font-medium">{currentKf.handShape}</p>
        </div>
        <div className="space-y-1">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">Motion Vector:</span>
          <p className="text-slate-200 font-medium">{currentKf.motionDescription}</p>
        </div>
      </div>

      {/* Playback Controls Footer */}
      <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={handlePlayToggle}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-teal-400 cursor-pointer shadow-xs"
            id="play-sign-btn"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play Sign'}</span>
          </button>

          {/* Replay */}
          <button
            onClick={handleReplay}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            title="Replay sequence"
            aria-label="Replay sign sequence"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Speed:</span>
          {[0.5, 1.0, 1.5].map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-0.5 rounded text-xs font-mono font-medium transition-colors ${
                speed === s
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                  : 'hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
