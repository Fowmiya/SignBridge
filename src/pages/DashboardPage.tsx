import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Camera,
  Video,
  Mic,
  Type,
  MessageSquareText,
  History as HistoryIcon,
  Sparkles,
  ArrowRight,
  Globe,
  Sliders,
  Volume2,
  CheckCircle2,
  Clock,
  Hand,
  TrendingUp,
} from 'lucide-react';
import { LanguageSelector } from '../components/common/LanguageSelector';
import { SignLanguageSelector } from '../components/common/SignLanguageSelector';
import { speechSynthesisService } from '../services/speechSynthesisService';

export const DashboardPage: React.FC = () => {
  const { spokenLang, signLang, history, messages, showToast } = useApp();

  const mainCards = [
    {
      icon: Camera,
      title: 'Live Sign Recognition',
      desc: 'Use your camera to sign in real time.',
      buttonText: 'Start Camera',
      link: '/live-sign',
      badge: 'Live Webcam',
      color: 'teal',
    },
    {
      icon: Video,
      title: 'Upload Sign Video',
      desc: 'Analyze a recorded video with AI pipeline.',
      buttonText: 'Upload Video',
      link: '/video-upload',
      badge: 'MP4 / WebM',
      color: 'indigo',
    },
    {
      icon: Mic,
      title: 'Speech to Sign',
      desc: 'Speak and display animated sign language.',
      buttonText: 'Start Speaking',
      link: '/speech-to-sign',
      badge: 'Microphone',
      color: 'sky',
    },
    {
      icon: Type,
      title: 'Text to Sign',
      desc: 'Type a message and translate to sign gloss.',
      buttonText: 'Enter Text',
      link: '/text-to-sign',
      badge: 'Keyboard',
      color: 'slate',
    },
  ];

  const recentHistory = history.slice(0, 3);
  const recentMessages = messages.slice(-3);

  const handleSpeak = (text: string) => {
    speechSynthesisService.speak(text);
    showToast('Speaking text', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10" id="dashboard-page-root">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Welcome to SignBridge</span>
            <span className="text-3xl animate-bounce">👋</span>
          </h1>
          <p className="text-base text-slate-600">
            Choose how you want to communicate today.
          </p>
        </div>

        {/* Quick Language Context Card */}
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="min-w-[170px]">
            <LanguageSelector label="Spoken Target" compact idPrefix="dash-spoken" />
          </div>
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          <div className="min-w-[170px]">
            <SignLanguageSelector label="Sign Grammar" compact idPrefix="dash-sign" />
          </div>
        </div>
      </div>

      {/* 2. MAIN 4 FEATURE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainCards.map(card => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:border-teal-400 hover:shadow-lg transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 group-hover:bg-teal-600 text-teal-700 group-hover:text-white flex items-center justify-center transition-colors shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{card.desc}</p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100">
                <Link
                  to={card.link}
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                  id={`dashboard-btn-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. TWO-COLUMN STATUS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Recent Translations */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              <span>Recent Translations</span>
            </h3>
            <Link
              to="/history"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {recentHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No recent translations yet. Try using the camera, speech, or text tools.
              </div>
            ) : (
              recentHistory.map(item => (
                <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-teal-700 capitalize">
                        {item.inputType.replace('-', ' ')}
                      </span>
                      <span>•</span>
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span className="text-teal-600 font-semibold">{Math.round(item.confidence * 100)}% Confidence</span>
                    </div>

                    <p className="text-sm font-bold text-slate-900 leading-snug">{item.translatedText}</p>
                    <p className="text-xs text-slate-500">{item.sourceText}</p>
                  </div>

                  <button
                    onClick={() => handleSpeak(item.translatedText)}
                    className="p-2 hover:bg-teal-50 text-slate-400 hover:text-teal-700 rounded-xl transition-colors shrink-0"
                    title="Speak translation"
                    aria-label="Speak translation"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 5 Cols: Recent Conversation & Quick Actions */}
        <div className="lg:col-span-5 space-y-6">
          {/* Active Dialogue Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                <MessageSquareText className="w-4 h-4" />
                Active Two-Way Dialogue
              </span>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Connect in real-time between deaf signers and hearing partners with instant sign-to-voice & speech-to-sign conversions.
            </p>

            <div className="space-y-2 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80">
              {recentMessages.map(m => (
                <div key={m.id} className="text-xs">
                  <span className="font-bold text-teal-300">{m.senderName}: </span>
                  <span className="text-slate-200">{m.text}</span>
                </div>
              ))}
            </div>

            <Link
              to="/conversation"
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Resume Full Conversation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Quick Accessibility Tip */}
          <div className="p-5 rounded-3xl bg-teal-50/70 border border-teal-200/80 text-teal-950 flex items-start gap-3.5">
            <Sliders className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">Accessibility Tip</h4>
              <p className="text-xs text-teal-900 leading-relaxed">
                You can toggle <strong>Large Text</strong>, <strong>High Contrast</strong>, or adjust <strong>Speech Synthesis Speed</strong> at any time via the top navigation or Settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
