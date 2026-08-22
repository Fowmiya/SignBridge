import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { signRecognitionService, SAMPLE_SIGNS_DATA } from '../../services/signRecognitionService';
import { speechSynthesisService } from '../../services/speechSynthesisService';
import { RecognitionResult } from '../../types';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Play,
  Pause,
  Square,
  Volume2,
  Globe,
  Trash2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { SignLanguageSelector } from '../common/SignLanguageSelector';

export const CameraViewer: React.FC = () => {
  const { signLang, spokenLang, accessibility, addHistoryItem, showToast } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionIntervalRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // States
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // Recognition state
  const [statusText, setStatusText] = useState<string>('Waiting for camera to be started...');
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [sampleIdx, setSampleIdx] = useState<number>(0);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (recognitionIntervalRef.current) {
      clearInterval(recognitionIntervalRef.current);
      recognitionIntervalRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setIsPaused(false);
    setStatusText('Camera stopped. Ready to start again.');
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Start Camera on user explicit action
  const startCamera = async (facing: 'user' | 'environment' = facingMode) => {
    setPermissionError(null);
    setIsConnecting(true);
    setStatusText('Requesting camera permission...');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API (getUserMedia) is not supported in this browser.');
      }

      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
          setIsConnecting(false);
          setIsPaused(false);
          setStatusText('Tracking 21 MediaPipe hand landmarks (Demo Stream)...');
          startRecognitionLoop();
          showToast('Camera started successfully', 'success');
        };
      }
    } catch (err: any) {
      console.warn('Camera permission or device error:', err);
      setIsConnecting(false);
      setCameraActive(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionError('Camera access was denied. Please allow camera permission in your browser URL bar or settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setPermissionError('No camera device was found on this system.');
      } else {
        setPermissionError(err.message || 'Camera access isn’t available. Please check your browser permissions.');
      }
      setStatusText('Camera access error');
    }
  };

  // Landmark canvas render loop
  const drawLandmarks = useCallback(() => {
    if (!canvasRef.current || !cameraActive || isPaused) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (accessibility.showLandmarks) {
      const data = signRecognitionService.generateHandSkeleton(sampleIdx);

      // Draw hand skeletons
      const drawHand = (points: typeof data.leftHand, color: string) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffffff';

        // Connect fingers to wrist
        const wrist = points[0];
        if (!wrist) return;

        // Draw joints & connection lines
        for (let i = 1; i < points.length; i++) {
          const pt = points[i];
          const px = pt.x * canvas.width;
          const py = pt.y * canvas.height;

          // Connection
          if (i % 4 === 1) {
            ctx.beginPath();
            ctx.moveTo(wrist.x * canvas.width, wrist.y * canvas.height);
            ctx.lineTo(px, py);
            ctx.stroke();
          } else {
            const prev = points[i - 1];
            ctx.beginPath();
            ctx.moveTo(prev.x * canvas.width, prev.y * canvas.height);
            ctx.lineTo(px, py);
            ctx.stroke();
          }

          // Joint Dot
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, 2 * Math.PI);
          ctx.fill();
        }
      };

      drawHand(data.leftHand, '#0d9488');
      drawHand(data.rightHand, '#14b8a6');
    }

    if (cameraActive && !isPaused) {
      animFrameRef.current = requestAnimationFrame(drawLandmarks);
    }
  }, [cameraActive, isPaused, accessibility.showLandmarks, sampleIdx]);

  useEffect(() => {
    if (cameraActive && !isPaused) {
      animFrameRef.current = requestAnimationFrame(drawLandmarks);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [cameraActive, isPaused, drawLandmarks]);

  // Recognition polling loop
  const startRecognitionLoop = () => {
    if (recognitionIntervalRef.current) clearInterval(recognitionIntervalRef.current);

    let idx = 0;
    recognitionIntervalRef.current = setInterval(async () => {
      if (!streamRef.current) return;

      const rec = await signRecognitionService.recognizeFrame(signLang, idx % SAMPLE_SIGNS_DATA.length);
      setResult(rec);
      setSampleIdx(idx);
      idx++;
    }, 2800);
  };

  const handlePauseResume = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.play();
        setIsPaused(false);
        setStatusText('Camera tracking resumed.');
        startRecognitionLoop();
      } else {
        videoRef.current.pause();
        setIsPaused(true);
        setStatusText('Camera feed paused.');
        if (recognitionIntervalRef.current) clearInterval(recognitionIntervalRef.current);
      }
    }
  };

  const handleSwitchCamera = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    if (cameraActive) {
      startCamera(nextMode);
    }
  };

  const handleSpeak = () => {
    if (result?.recognizedText) {
      speechSynthesisService.speak(result.recognizedText);
      showToast('Speaking recognized sign text', 'info');
    }
  };

  const handleSaveToHistory = () => {
    if (result) {
      addHistoryItem({
        inputType: 'sign-camera',
        sourceText: `🤟 Sign Gesture: ${result.detectedSign}`,
        translatedText: result.recognizedText,
        sourceLang: signLang,
        targetLang: spokenLang,
        signLang: signLang,
        confidence: result.confidence,
        status: 'completed',
        notes: `Recognized with ${result.confidence * 100}% confidence (${result.latencyMs}ms)`,
      });
      showToast('Saved to translation history', 'success');
    }
  };

  const handleClear = () => {
    setResult(null);
    setStatusText('Recognition cleared. Signing window active.');
  };

  return (
    <div className="space-y-6" id="live-sign-recognition-module">
      {/* Top Config Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Camera Recognition Engine</h3>
            <p className="text-xs text-slate-500">Real-time MediaPipe hand landmark & gesture extraction</p>
          </div>
        </div>

        <div className="w-full sm:w-auto min-w-[240px]">
          <SignLanguageSelector idPrefix="camera-engine" label="Target Model" compact />
        </div>
      </div>

      {/* Main Camera + Recognition Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Viewport */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="relative aspect-video sm:aspect-4/3 w-full bg-slate-950 rounded-2xl border-2 border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
            {/* Real HTML5 Video element */}
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full object-cover transform ${
                facingMode === 'user' ? 'scale-x-[-1]' : ''
              } ${cameraActive ? 'block' : 'hidden'}`}
            />

            {/* Landmark Overlay Canvas */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className={`absolute inset-0 w-full h-full pointer-events-none ${
                cameraActive && !isPaused ? 'block' : 'hidden'
              } ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />

            {/* Placeholder state when camera is inactive */}
            {!cameraActive && (
              <div className="flex flex-col items-center justify-center p-6 text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 text-slate-400 flex items-center justify-center mb-4">
                  <CameraOff className="w-8 h-8 text-teal-400" />
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Camera Is Idle</h4>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  Click <strong className="text-teal-300">"Start Camera"</strong> to request browser camera permission and begin real-time sign detection.
                </p>
                <button
                  onClick={() => startCamera()}
                  disabled={isConnecting}
                  className="px-6 py-3.5 bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-teal-900/40 flex items-center gap-2 transition-all focus:ring-2 focus:ring-teal-400 cursor-pointer disabled:opacity-50"
                  id="start-camera-btn"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isConnecting ? 'Accessing Camera...' : 'Start Camera'}</span>
                </button>
              </div>
            )}

            {/* Permission Error State */}
            {permissionError && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
                <div className="w-14 h-14 rounded-2xl bg-rose-950 border border-rose-800 text-rose-300 flex items-center justify-center mb-3">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h4 className="text-base font-bold text-white mb-2">Camera Access Required</h4>
                <p className="text-xs sm:text-sm text-rose-200 max-w-sm mb-5 leading-relaxed">
                  {permissionError}
                </p>
                <button
                  onClick={() => startCamera()}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Live Indicator Overlay */}
            {cameraActive && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-white z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                <span className="font-mono font-bold tracking-wider text-rose-400 uppercase">
                  {isPaused ? 'Paused' : 'Live Stream'}
                </span>
              </div>
            )}

            {/* Demo Overlay Watermark */}
            <div className="absolute bottom-4 right-4 bg-slate-900/90 text-slate-300 text-[10px] px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 z-10">
              <Sparkles className="w-3 h-3 text-teal-400" />
              <span>Demo mode — AI recognition simulation</span>
            </div>
          </div>

          {/* Camera Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2">
              {!cameraActive ? (
                <button
                  onClick={() => startCamera()}
                  disabled={isConnecting}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-xs"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Camera</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handlePauseResume}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>

                  <button
                    onClick={stopCamera}
                    className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all"
                  >
                    <Square className="w-4 h-4" />
                    <span>Stop</span>
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSwitchCamera}
                disabled={!cameraActive}
                className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors disabled:opacity-40"
                title="Switch Camera (Front/Rear)"
                aria-label="Switch camera"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Recognition Telemetry Panel */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between h-full space-y-6">
            {/* Status Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Recognition Status
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  <Activity className="w-3.5 h-3.5 text-teal-600" />
                  {cameraActive ? (isPaused ? 'Paused' : 'Active') : 'Idle'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-mono">{statusText}</p>
            </div>

            {/* Detected Sign Feature Block */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Detected Sign
                </span>
                <div className="text-2xl font-black text-slate-900 tracking-tight flex items-baseline justify-between">
                  <span>{result ? result.detectedSign : '—'}</span>
                  {result && (
                    <span className="text-xs font-mono text-teal-600 font-semibold">
                      {result.gloss}
                    </span>
                  )}
                </div>
              </div>

              {/* Recognized Natural Sentence */}
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-200/70 space-y-1">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">
                  Recognized Sentence
                </span>
                <p className="text-base font-semibold text-slate-900 leading-snug">
                  {result ? `"${result.recognizedText}"` : '—'}
                </p>
              </div>

              {/* Confidence & Telemetry Gauges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="font-semibold">Confidence</span>
                    <span className="font-mono font-bold text-teal-600">
                      {result ? `${Math.round(result.confidence * 100)}%` : '—'}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-600 rounded-full transition-all duration-500"
                      style={{ width: result ? `${result.confidence * 100}%` : '0%' }}
                    ></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="font-semibold">Latency</span>
                    <span className="font-mono font-bold text-slate-700">
                      {result ? `${result.latencyMs}ms` : '—'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-600 block">47 Landmarks Tracked</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2.5">
              <button
                onClick={handleSpeak}
                disabled={!result}
                className="flex-1 py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer shadow-xs"
                id="camera-play-voice-btn"
              >
                <Volume2 className="w-4 h-4" />
                <span>Play Voice</span>
              </button>

              <button
                onClick={handleSaveToHistory}
                disabled={!result}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
                title="Save translation to history"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Save</span>
              </button>

              <button
                onClick={handleClear}
                disabled={!result}
                className="p-2.5 hover:bg-slate-100 text-slate-500 hover:text-slate-900 rounded-xl transition-colors disabled:opacity-40"
                title="Clear current result"
                aria-label="Clear result"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
