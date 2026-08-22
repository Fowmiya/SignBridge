import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Hand,
  Camera,
  Video,
  Mic,
  Type,
  Volume2,
  Globe,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Sliders,
  CheckCircle2,
  MessageSquareText,
  Layers,
  HeartHandshake,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { spokenLang, signLang } = useApp();

  const coreFeatures = [
    {
      icon: Camera,
      title: 'Live Sign Recognition',
      desc: 'Use your webcam or mobile camera to translate sign gestures into spoken words and text in real time.',
      link: '/live-sign',
      tag: 'Real-Time Camera',
    },
    {
      icon: Video,
      title: 'Video Upload & Analysis',
      desc: 'Upload pre-recorded sign language MP4/WebM videos for frame-by-frame deep spatial sequence analysis.',
      link: '/video-upload',
      tag: 'File Extraction',
    },
    {
      icon: Volume2,
      title: 'Sign to Voice Synthesis',
      desc: 'Synthesize deaf users’ sign expressions into natural audible speech with customizable pitch and reading rate.',
      link: '/live-sign',
      tag: 'Speech Output',
    },
    {
      icon: Mic,
      title: 'Speech to Visual Sign',
      desc: 'Speak naturally into your device microphone and convert audio instantly into visual sign representations.',
      link: '/speech-to-sign',
      tag: 'Speech Recognition',
    },
    {
      icon: Type,
      title: 'Text to Sign Mapping',
      desc: 'Type any message to generate structured sign language glosses and animated 3D hand avatar sequences.',
      link: '/text-to-sign',
      tag: 'Text Glossing',
    },
    {
      icon: Globe,
      title: 'Multilingual Regional Support',
      desc: 'Bridge conversations across English, Tamil, Hindi, Malayalam, Telugu, and Kannada with ISL/ASL/BSL syntax.',
      link: '/translate',
      tag: '6+ Languages',
    },
  ];

  const whyPoints = [
    {
      title: 'Engineered for True Accessibility',
      desc: 'Built from the ground up complying with WCAG 2.1 AAA contrast, screen-reader live regions, large typography, and zero reliance on color alone.',
    },
    {
      title: 'Bi-Directional Equal Dialogue',
      desc: 'Both conversational partners have dedicated, tailored input and output tools — ensuring no one is excluded or delayed in dialogue.',
    },
    {
      title: 'Privacy-First Client Processing',
      desc: 'Camera streams, speech recordings, and video uploads process directly within your local browser without third-party cloud data harvesting.',
    },
    {
      title: 'Regional Indian & Global Sign Systems',
      desc: 'Explicit support for Indian Sign Language (ISL), American Sign Language (ASL), and British Sign Language (BSL) syntactic rules.',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 py-10 sm:py-16" id="landing-page-root">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI-Powered Inclusive Communication Platform</span>
          </div>

          {/* Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
            Communication <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-700 to-indigo-700">
              Without Barriers.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 font-normal max-w-2xl leading-relaxed">
            Translate sign language, speech, and text with AI — making conversations more accessible, natural, and equal for everyone.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-base rounded-2xl shadow-xl shadow-teal-700/25 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 focus:ring-4 focus:ring-teal-400"
              id="hero-start-communicating-btn"
            >
              <Hand className="w-5 h-5" />
              <span>Start Communicating</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/how-it-works"
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 font-bold text-base rounded-2xl border-2 border-slate-200 hover:border-slate-300 shadow-sm flex items-center gap-2 transition-all"
              id="hero-how-it-works-btn"
            >
              <span>Explore How It Works</span>
            </Link>
          </div>

          {/* 2. HERO VISUAL: BIDIRECTIONAL FLOW PIPELINE */}
          <div className="w-full pt-10">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-10 text-white relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-6 flex items-center justify-center gap-2">
                <Layers className="w-4 h-4" />
                <span>SignBridge Bidirectional Translation Pipeline</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Direction 1: Sign to Voice */}
                <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex flex-col items-center text-center space-y-4">
                  <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Direction A: Signer → Speaker
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm font-bold">
                    <div className="px-3 py-2 rounded-xl bg-teal-900/80 border border-teal-700 text-teal-200 flex items-center gap-1.5">
                      <Hand className="w-4 h-4 text-teal-400" />
                      <span>🤟 Sign</span>
                    </div>
                    <span className="text-teal-400">→</span>
                    <div className="px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-slate-200">
                      <span>Vision AI</span>
                    </div>
                    <span className="text-teal-400">→</span>
                    <div className="px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-slate-200">
                      <span>Text</span>
                    </div>
                    <span className="text-teal-400">→</span>
                    <div className="px-3 py-2 rounded-xl bg-indigo-900/80 border border-indigo-700 text-indigo-200 flex items-center gap-1.5">
                      <Volume2 className="w-4 h-4 text-indigo-400" />
                      <span>🔊 Voice</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Camera & video footage extracts 47 hand & pose landmarks, decoded into natural speech.
                  </p>
                </div>

                {/* Direction 2: Speech to Sign */}
                <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/70 flex flex-col items-center text-center space-y-4">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    Direction B: Speaker → Signer
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm font-bold">
                    <div className="px-3 py-2 rounded-xl bg-indigo-900/80 border border-indigo-700 text-indigo-200 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-indigo-400" />
                      <span>🎤 Voice</span>
                    </div>
                    <span className="text-indigo-400">→</span>
                    <div className="px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-slate-200">
                      <span>Text</span>
                    </div>
                    <span className="text-indigo-400">→</span>
                    <div className="px-3 py-2 rounded-xl bg-slate-700 border border-slate-600 text-slate-200">
                      <span>Gloss</span>
                    </div>
                    <span className="text-indigo-400">→</span>
                    <div className="px-3 py-2 rounded-xl bg-teal-900/80 border border-teal-700 text-teal-200 flex items-center gap-1.5">
                      <Hand className="w-4 h-4 text-teal-400" />
                      <span>🤟 Sign</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    Spoken audio transcribes to text, re-ordered by sign grammar into visual animations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Six Modalities of Communication
          </h2>
          <p className="text-slate-600 text-base">
            Every tool is designed to work seamlessly together across mobile, tablet, and desktop screens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreFeatures.map(f => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white rounded-3xl border border-slate-200 p-7 shadow-xs hover:shadow-lg hover:border-teal-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100 uppercase tracking-wider">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {f.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <Link
                    to={f.link}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 group-hover:text-teal-700 hover:gap-2.5 transition-all"
                  >
                    <span>Launch Tool</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. WHY SIGNBRIDGE? */}
      <section className="bg-slate-900 text-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider block">
                Purpose & Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Designed for dignity, speed, and real inclusion.
              </h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Most translation applications are built purely for spoken languages. SignBridge places manual languages and accessibility at the absolute core of system design.
              </p>
              <Link
                to="/conversation"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-teal-900/30"
              >
                <MessageSquareText className="w-4 h-4" />
                <span>Try Two-Way Conversation</span>
              </Link>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {whyPoints.map(item => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUPPORTED LANGUAGES & ACCESSIBILITY STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Languages Side */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Supported Languages</h3>
                <p className="text-xs text-slate-500">Tailored sign models & regional vernaculars</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Sign Language Systems (Non-Interchangeable)
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900">
                    🤟 Indian Sign Language (ISL)
                  </span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900">
                    🤟 American Sign Language (ASL)
                  </span>
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900">
                    🤟 British Sign Language (BSL)
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Spoken Languages
                </span>
                <div className="flex flex-wrap gap-2 text-xs font-semibold">
                  {['English (en)', 'Tamil (தமிழ்)', 'Hindi (हिन्दी)', 'Malayalam (മലയാളം)', 'Telugu (తెలుగు)', 'Kannada (ಕನ್ನಡ)'].map(l => (
                    <span key={l} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Side */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Accessibility Standards</h3>
                <p className="text-xs text-slate-500">WCAG 2.1 AAA compliance checklist</p>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>High-contrast canvas & large text</strong> modes customizable via instant quick-settings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>ARIA Live regions</strong> providing real-time screen-reader transcript broadcasts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>44px+ minimum clickable targets</strong> and clear visible keyboard focus rings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Reduced motion respect</strong> for vestibular comfort and clean readability.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 rounded-3xl p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to break communication barriers?
            </h2>
            <p className="text-teal-100 text-sm sm:text-base leading-relaxed">
              Launch the live sign camera, upload a video, or start a two-way dialogue right inside your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-teal-900 font-extrabold text-sm sm:text-base rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Open Dashboard
            </Link>
            <Link
              to="/conversation"
              className="px-8 py-4 bg-teal-900/60 hover:bg-teal-900 text-white font-bold text-sm sm:text-base rounded-2xl border border-teal-400/40 transition-all"
            >
              Two-Way Chat
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
