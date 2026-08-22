import React from 'react';
import { Link } from 'react-router-dom';
import { Hand, Heart, ShieldCheck, Sparkles, Globe, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
                <Hand className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                SIGN<span className="text-teal-400">BRIDGE</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              "Breaking communication barriers with AI." Empowering seamless two-way dialogue between deaf, hard-of-hearing, and hearing individuals across multiple spoken and sign languages.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-teal-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Frontend Prototype — Ready for AI Model Integration</span>
            </div>
          </div>

          {/* Core Tools */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Communication Tools
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/live-sign" className="hover:text-teal-400 transition-colors">
                  Live Sign Camera
                </Link>
              </li>
              <li>
                <Link to="/video-upload" className="hover:text-teal-400 transition-colors">
                  Upload Sign Video
                </Link>
              </li>
              <li>
                <Link to="/speech-to-sign" className="hover:text-teal-400 transition-colors">
                  Speech to Sign
                </Link>
              </li>
              <li>
                <Link to="/text-to-sign" className="hover:text-teal-400 transition-colors">
                  Text to Sign
                </Link>
              </li>
              <li>
                <Link to="/conversation" className="hover:text-teal-400 transition-colors">
                  Two-Way Conversation
                </Link>
              </li>
            </ul>
          </div>

          {/* Languages & Formats */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Supported Systems
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Indian Sign Language (ISL)</li>
              <li>American Sign Language (ASL)</li>
              <li>British Sign Language (BSL)</li>
              <li>English, Tamil, Hindi</li>
              <li>Malayalam, Telugu, Kannada</li>
            </ul>
          </div>

          {/* Platform & Ethics */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform & Legal
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/how-it-works" className="hover:text-teal-400 transition-colors">
                  How It Works & AI Pipeline
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-teal-400 transition-colors">
                  Accessibility Preferences
                </Link>
              </li>
              <li>
                <span className="text-slate-500">Privacy & Local Storage</span>
              </li>
              <li>
                <span className="text-slate-500">WCAG 2.1 AAA Standard</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SIGNBRIDGE</span>
            <span>•</span>
            <span>Frontend Prototype</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              100% Client-Side Privacy Guaranteed
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
