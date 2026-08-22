import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Sparkles,
  Camera,
  Video,
  Mic,
  Type,
  Volume2,
  Hand,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Code,
  Network,
  Binary,
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12" id="how-it-works-root">
      {/* Header */}
      <div className="space-y-3 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
          <Cpu className="w-3.5 h-3.5 text-teal-600" />
          <span>Technology & Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          How SignBridge Works
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Explore the dual-pipeline architecture transforming physical gestures into natural speech and converting audible language into dynamic visual sign animations.
        </p>
      </div>

      {/* SECTION 1: SIGN -> TEXT PIPELINE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Hand className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Pipeline A</span>
            <h2 className="text-2xl font-bold text-slate-900">Sign Language → Text & Voice</h2>
          </div>
        </div>

        {/* Interactive Step Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { step: '1', title: 'Camera / Video', desc: 'Real-time webcam or uploaded MP4/WebM video' },
            { step: '2', title: 'Computer Vision', desc: 'OpenCV frame filtering and resolution normalization' },
            { step: '3', title: 'MediaPipe', desc: 'Tracking 21 3D landmarks for both hands + upper body' },
            { step: '4', title: 'Landmarks', desc: 'Normalized joint distances and angular trajectory vectors' },
            { step: '5', title: 'Feature Extraction', desc: 'Spatial and temporal motion pattern embedding' },
            { step: '6', title: 'ML / Transformer', desc: 'ST-GCN or Bidirectional LSTM classification' },
            { step: '7', title: 'Text & Speech', desc: 'Synthesized spoken sentence with Web Audio' },
          ].map((item, idx) => (
            <div key={item.step} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {item.step}
                </span>
                {idx < 6 && <span className="text-slate-300 hidden lg:inline font-bold">→</span>}
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h3>
              <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: TEXT/SPEECH -> SIGN PIPELINE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Mic className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Pipeline B</span>
            <h2 className="text-2xl font-bold text-slate-900">Speech / Text → Visual Sign Output</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: '1', title: 'Speech / Audio', desc: 'Browser Web Speech API capturing live voice' },
            { step: '2', title: 'Transcription', desc: 'Converting speech audio into text string' },
            { step: '3', title: 'NLP Parsing', desc: 'Extracting lemmas, entities, and question markers' },
            { step: '4', title: 'Sign Grammar', desc: 'Re-arranging word order to ISL/ASL/BSL syntax' },
            { step: '5', title: 'Sign Gloss Mapping', desc: 'Aligning grammar tokens with dictionary keyframes' },
            { step: '6', title: 'Avatar Animation', desc: 'Rendering animated 3D hand poses and facial markers' },
          ].map((item, idx) => (
            <div key={item.step} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 relative">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center">
                  {item.step}
                </span>
                {idx < 5 && <span className="text-slate-300 hidden lg:inline font-bold">→</span>}
              </div>
              <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{item.title}</h3>
              <p className="text-[11px] text-slate-500 leading-tight">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: FUTURE ARCHITECTURE SPECIFICATION */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            System Design Specification
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Future Full-Stack AI Stack
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            The SignBridge codebase has been structured with clean service layers (`signRecognitionService`, `videoAnalysisService`, `translationService`) ready for seamless REST / WebSocket connection to the Python ML backend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
              <Code className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">Client Layer (Current)</h3>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>React 19 + TypeScript + Vite</li>
              <li>Tailwind CSS Accessible System</li>
              <li>Browser MediaDevices & Web Speech API</li>
              <li>LocalStorage session persistence</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Network className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">Backend Microservices (Planned)</h3>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Python FastAPI / Node.js Gateway</li>
              <li>WebSocket frame streaming</li>
              <li>OpenCV video chunking</li>
              <li>Multi-user room coordination</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
              <Binary className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-base">AI & Vision Core (Planned)</h3>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Google MediaPipe Holistic (Hands + Pose)</li>
              <li>Spatial-Temporal Graph ConvNet (ST-GCN)</li>
              <li>Transformer Sequence Translator</li>
              <li>ISL / ASL / BSL Corpus Trained Models</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center p-8 bg-teal-50/60 rounded-3xl border border-teal-200/80 space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Experience the Prototype in Action</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Test live camera gesture tracking, upload videos, or start a two-way dialogue right now.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm"
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
