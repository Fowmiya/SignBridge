import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { speechService } from '../../services/speechService';
import { SPOKEN_LANGUAGES } from '../../services/translationService';
import { SignAvatarViewer } from '../common/SignAvatarViewer';
import {
  Mic,
  MicOff,
  RotateCcw,
  Copy,
  Sparkles,
  AlertCircle,
  Volume2,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import { LanguageSelector } from '../common/LanguageSelector';
import { SignLanguageSelector } from '../common/SignLanguageSelector';

export const SpeechRecognizer: React.FC = () => {
  const { spokenLang, signLang, addHistoryItem, showToast } = useApp();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimText, setInterimText] = useState<string>('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);

  useEffect(() => {
    setIsSupported(speechService.isSupported());
  }, []);

  const handleToggleListening = () => {
    setSpeechError(null);

    if (isListening) {
      speechService.stop();
      setIsListening(false);
    } else {
      const selectedLangObj = SPOKEN_LANGUAGES.find(l => l.code === spokenLang);
      const speechCode = selectedLangObj?.speechCode || 'en-US';

      const success = speechService.start(
        speechCode,
        (text, isFinal) => {
          if (isFinal) {
            setTranscript(text);
            setInterimText('');
            showToast('Speech recognized', 'success');

            // Save to history
            addHistoryItem({
              inputType: 'speech',
              sourceText: text,
              translatedText: `🤟 ${signLang} Representation`,
              sourceLang: spokenLang,
              targetLang: signLang,
              signLang: signLang,
              confidence: 0.97,
              status: 'completed',
              notes: 'Captured via browser Web Speech API',
            });
          } else {
            setInterimText(text);
          }
        },
        errorMsg => {
          setSpeechError(errorMsg);
          setIsListening(false);
        },
        listeningState => {
          setIsListening(listeningState);
        }
      );

      if (!success && !speechError) {
        setSpeechError('Speech recognition could not be started in this browser.');
      }
    }
  };

  const handleReset = () => {
    speechService.stop();
    setIsListening(false);
    setTranscript('');
    setInterimText('');
    setSpeechError(null);
  };

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      showToast('Copied transcript to clipboard', 'success');
    }
  };

  return (
    <div className="space-y-6" id="speech-to-sign-module">
      {/* Top Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <LanguageSelector idPrefix="speech-spoken" label="Your Spoken Language" />
        <SignLanguageSelector idPrefix="speech-target-sign" label="Target Sign Language" />
      </div>

      {/* Main Microphone Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Recording Box */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-8 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[380px]">
            {/* Ambient waveform pulse */}
            {isListening && (
              <div className="absolute inset-0 bg-teal-50/50 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full bg-teal-200/40 animate-ping"></div>
                <div className="absolute w-44 h-44 rounded-full bg-teal-300/40 animate-pulse"></div>
              </div>
            )}

            {/* Giant Microphone Button */}
            <button
              onClick={handleToggleListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform active:scale-95 focus:ring-4 focus:ring-teal-400 cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white shadow-rose-600/40 ring-4 ring-rose-200 animate-pulse'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30'
              }`}
              aria-label={isListening ? 'Stop recording microphone' : 'Start speaking with microphone'}
              id="main-mic-btn"
            >
              {isListening ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </button>

            {/* Status Label */}
            <div className="relative z-10 mt-6 space-y-1">
              <h4 className="text-lg font-bold text-slate-900">
                {isListening ? 'Listening to speech...' : transcript ? 'Speech Captured' : 'Start Speaking'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs">
                {isListening
                  ? 'Speak naturally into your microphone. Words are transcribed live in your browser.'
                  : 'Click the microphone button to convert your spoken words into sign language.'}
              </p>
            </div>

            {/* Quick Demo Pre-fills for testing without mic */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-100 w-full flex flex-col items-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Or tap a quick phrase:
              </span>
              <div className="flex flex-wrap justify-center gap-1.5">
                {[
                  'Can you help me?',
                  'Where are you going?',
                  'Thank you very much.',
                  'Nice to meet you.',
                ].map(phrase => (
                  <button
                    key={phrase}
                    onClick={() => {
                      setTranscript(phrase);
                      setInterimText('');
                      showToast(`Loaded "${phrase}"`, 'info');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    "{phrase}"
                  </button>
                ))}
              </div>
            </div>

            {/* Error state */}
            {speechError && (
              <div className="relative z-10 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{speechError}</span>
              </div>
            )}

            {!isSupported && (
              <div className="relative z-10 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  Web Speech API is not enabled in this browser. You can use the quick test buttons above or type text in the Text to Sign tab.
                </span>
              </div>
            )}
          </div>

          {/* Transcript Display Box */}
          {(transcript || interimText) && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Recognized Speech Transcript
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
                    title="Copy transcript"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-lg transition-colors"
                    title="Reset speech"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-lg font-bold text-slate-900 leading-snug">
                {transcript}
                {interimText && <span className="text-slate-400 font-normal"> {interimText}</span>}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Generated Sign Output Animation */}
        <div className="lg:col-span-6">
          <SignAvatarViewer
            text={transcript || interimText || ''}
            signLanguage={signLang}
            autoPlay={true}
          />
        </div>
      </div>
    </div>
  );
};
