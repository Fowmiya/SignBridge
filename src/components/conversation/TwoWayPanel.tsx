import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConversationMessage, InputMode } from '../../types';
import { speechSynthesisService } from '../../services/speechSynthesisService';
import { translationService } from '../../services/translationService';
import { SignAvatarViewer } from '../common/SignAvatarViewer';
import {
  Send,
  Mic,
  Camera,
  FileVideo,
  Type,
  Volume2,
  Hand,
  Sparkles,
  RotateCcw,
  Globe,
  Trash2,
  CheckCheck,
  User,
  Radio,
  Eye,
} from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { SignLanguageSelector } from '../common/SignLanguageSelector';

export const TwoWayPanel: React.FC = () => {
  const {
    messages,
    addMessage,
    clearConversation,
    spokenLang,
    signLang,
    showToast,
  } = useApp();

  // Left Sign User input state
  const [signUserMode, setSignUserMode] = useState<InputMode>('text');
  const [signUserText, setSignUserText] = useState<string>('');

  // Right Hearing User input state
  const [hearingUserMode, setHearingUserMode] = useState<'type' | 'speech'>('type');
  const [hearingUserText, setHearingUserText] = useState<string>('');

  // Sign preview modal in conversation
  const [activeSignPreviewText, setActiveSignPreviewText] = useState<string | null>(null);

  // Send message from Deaf/Sign User
  const handleSendSignUser = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!signUserText.trim()) return;

    const gloss = translationService.generateSignGloss(signUserText, signLang);
    const trans = translationService.translateText(signUserText, 'en', spokenLang);

    addMessage({
      sender: 'sign_user',
      senderName: 'Sign Language User',
      inputType: signUserMode,
      text: signUserText.trim(),
      translatedText: trans.translatedText !== signUserText ? trans.translatedText : undefined,
      signGloss: gloss,
      confidence: 0.96,
    });

    setSignUserText('');
    showToast('Sign user message sent', 'info');
  };

  // Send message from Hearing Partner
  const handleSendHearingUser = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!hearingUserText.trim()) return;

    const gloss = translationService.generateSignGloss(hearingUserText, signLang);

    addMessage({
      sender: 'hearing_user',
      senderName: 'Hearing Partner',
      inputType: hearingUserMode === 'speech' ? 'speech' : 'text',
      text: hearingUserText.trim(),
      signGloss: gloss,
    });

    setHearingUserText('');
    showToast('Hearing partner message sent', 'info');
  };

  const handleSpeak = (text: string) => {
    speechSynthesisService.speak(text);
    showToast('Speaking message', 'info');
  };

  return (
    <div className="space-y-6" id="two-way-conversation-module">
      {/* Top Header & Settings */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Hand className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Two-Way Conversation Bridge</h3>
            <p className="text-xs text-slate-500">Live dual-sided dialogue between Signer and Hearing speaker</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={clearConversation}
            className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-semibold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[460px] max-h-[560px]">
        {/* Messages Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
              <Sparkles className="w-10 h-10 text-teal-400 mb-2" />
              <p className="text-sm font-semibold text-slate-200">Conversation is empty</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Send a message from either the Sign Language User side (Left) or Hearing Partner side (Right) below.
              </p>
            </div>
          ) : (
            messages.map(msg => {
              const isSignUser = msg.sender === 'sign_user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isSignUser ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                    <span className="font-bold text-slate-300">{msg.senderName}</span>
                    <span>•</span>
                    <span className="capitalize font-mono text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-teal-300">
                      {msg.inputType === 'sign-camera' ? '📷 Camera Sign' : msg.inputType === 'sign-video' ? '🎥 Video Sign' : msg.inputType === 'speech' ? '🎤 Speech' : '⌨️ Text'}
                    </span>
                    <span>•</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-md ${
                      isSignUser
                        ? 'bg-teal-950 text-white border border-teal-800 rounded-tl-xs'
                        : 'bg-slate-800 text-white border border-slate-700 rounded-tr-xs'
                    }`}
                  >
                    <p className="text-base font-semibold leading-relaxed">{msg.text}</p>

                    {/* Translation row if present */}
                    {msg.translatedText && (
                      <div className="mt-2 pt-2 border-t border-teal-900/80 text-xs text-teal-200 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>{msg.translatedText}</span>
                      </div>
                    )}

                    {/* Action Bar inside bubble */}
                    <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {/* Left actions */}
                      <div className="flex items-center gap-1.5">
                        {isSignUser ? (
                          <button
                            onClick={() => handleSpeak(msg.text)}
                            className="px-2.5 py-1 rounded-lg bg-teal-900/90 hover:bg-teal-800 text-teal-200 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-3 h-3 text-teal-400" />
                            <span>Play Voice</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveSignPreviewText(msg.text)}
                            className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-teal-300 font-medium text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Hand className="w-3 h-3 text-teal-400" />
                            <span>View Sign Output</span>
                          </button>
                        )}
                      </div>

                      {/* Gloss indicator */}
                      {msg.signGloss && msg.signGloss.length > 0 && (
                        <span className="text-[10px] font-mono text-slate-400">
                          [{msg.signGloss.slice(0, 3).join(' ')}]
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Dual Input Panels: Left for Signer, Right for Hearing Speaker */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Sign Language User Input Station */}
        <div className="bg-white rounded-3xl border-2 border-teal-100 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold">
                <Hand className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Sign Language User</h4>
                <span className="text-[11px] text-teal-700 font-semibold block">Deaf / Non-Speaking</span>
              </div>
            </div>

            {/* Input method selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSignUserMode('text')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  signUserMode === 'text' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500'
                }`}
                title="Type text"
              >
                <Type className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignUserMode('sign-camera');
                  setSignUserText('I need help with directions.');
                  showToast('Camera sign gesture pre-filled', 'info');
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  signUserMode === 'sign-camera' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500'
                }`}
                title="Camera sign input"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSignUserMode('sign-video');
                  setSignUserText('Where is the nearest medical store?');
                  showToast('Video sign gesture pre-filled', 'info');
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  signUserMode === 'sign-video' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-500'
                }`}
                title="Video upload input"
              >
                <FileVideo className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSendSignUser} className="space-y-3">
            <div className="relative">
              <textarea
                value={signUserText}
                onChange={e => setSignUserText(e.target.value)}
                placeholder="Type your message or use sign recognition..."
                rows={2}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {['Hello!', 'I need help', 'Thank you'].map(quick => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setSignUserText(quick)}
                    className="px-2 py-1 bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-800 text-[11px] font-medium rounded-lg border border-slate-200 transition-colors"
                  >
                    {quick}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!signUserText.trim()}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Hearing Partner Input Station */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Hearing Partner</h4>
                <span className="text-[11px] text-indigo-700 font-semibold block">Speech / Text</span>
              </div>
            </div>

            {/* Mode selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setHearingUserMode('type')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  hearingUserMode === 'type' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                }`}
                title="Type text"
              >
                <Type className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setHearingUserMode('speech');
                  setHearingUserText('Yes, I am happy to help you find it.');
                  showToast('Microphone speech simulated', 'info');
                }}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                  hearingUserMode === 'speech' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                }`}
                title="Speech recognition input"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSendHearingUser} className="space-y-3">
            <div className="relative">
              <textarea
                value={hearingUserText}
                onChange={e => setHearingUserText(e.target.value)}
                placeholder="Speak or type your message here..."
                rows={2}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {['Of course!', 'Where are you going?', 'Take care'].map(quick => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setHearingUserText(quick)}
                    className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 text-[11px] font-medium rounded-lg border border-slate-200 transition-colors"
                  >
                    {quick}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                disabled={!hearingUserText.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Floating Sign Preview Drawer if user clicked "View Sign Output" on hearing partner message */}
      {activeSignPreviewText && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-teal-400">
                <Hand className="w-5 h-5" />
                <h4 className="font-bold text-white text-base">Sign Language Translation View</h4>
              </div>
              <button
                onClick={() => setActiveSignPreviewText(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            <SignAvatarViewer
              text={activeSignPreviewText}
              signLanguage={signLang}
              autoPlay={true}
            />

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveSignPreviewText(null)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl transition-colors"
              >
                Back to Conversation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
