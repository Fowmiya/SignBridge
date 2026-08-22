import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { videoAnalysisService, VideoAnalysisResult } from '../../services/videoAnalysisService';
import { VideoProcessingStep, SignLanguageCode } from '../../types';
import { speechSynthesisService } from '../../services/speechSynthesisService';
import { translationService } from '../../services/translationService';
import {
  Upload,
  Video,
  FileVideo,
  Trash2,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Copy,
  Globe,
  Sparkles,
  Layers,
  Clock,
  HardDrive,
  Cpu,
} from 'lucide-react';
import { SignLanguageSelector } from '../common/SignLanguageSelector';

export const VideoUploader: React.FC = () => {
  const { signLang, spokenLang, addHistoryItem, showToast } = useApp();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [steps, setSteps] = useState<VideoProcessingStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [result, setResult] = useState<VideoAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoElemRef = useRef<HTMLVideoElement | null>(null);

  // Validate and handle file
  const handleFile = (file: File) => {
    setError(null);
    setResult(null);
    setSteps([]);

    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp4|mov|webm)$/i)) {
      setError('This video format isn’t supported. Please upload MP4, MOV, or WebM video files.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setError('Video file is too large. Please choose a video under 100MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoUrl(objectUrl);
    showToast(`Loaded "${file.name}"`, 'info');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setSelectedFile(null);
    setVideoUrl(null);
    setVideoDuration(null);
    setResult(null);
    setSteps([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a sign-language video first.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await videoAnalysisService.analyzeVideo(
        selectedFile,
        signLang,
        (updatedSteps, idx) => {
          setSteps(updatedSteps);
          setCurrentStepIdx(idx);
        }
      );

      setResult(res);
      setIsProcessing(false);
      showToast('Video analysis completed successfully', 'success');

      // Auto add to history
      addHistoryItem({
        inputType: 'sign-video',
        sourceText: `🎥 Video Analysis: ${selectedFile.name}`,
        translatedText: res.detectedText,
        sourceLang: signLang,
        targetLang: spokenLang,
        signLang: signLang,
        confidence: res.confidence,
        status: 'completed',
        notes: `Processed ${res.framesAnalyzed} frames across ${res.gesturesRecognized} detected gestures`,
      });
    } catch (err: any) {
      console.error(err);
      setError('An error occurred during video analysis simulation.');
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.detectedText);
      showToast('Copied text to clipboard', 'success');
    }
  };

  const handleSpeak = () => {
    if (result) {
      speechSynthesisService.speak(result.detectedText);
      showToast('Speaking recognized video text', 'info');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6" id="video-analysis-module">
      {/* Top Model Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200">
            <FileVideo className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Video Recognition Pipeline</h3>
            <p className="text-xs text-slate-500">Upload recorded signing clips for deep temporal frame extraction</p>
          </div>
        </div>

        <div className="w-full sm:w-auto min-w-[240px]">
          <SignLanguageSelector idPrefix="video-engine" label="Target Sign Grammar" compact />
        </div>
      </div>

      {/* Main Upload / Preview Area */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-10 sm:p-14 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-200 text-center bg-white ${
            isDragging
              ? 'border-teal-500 bg-teal-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-teal-400 hover:bg-slate-50/70'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
          aria-label="Upload sign language video"
          id="dropzone-video-upload"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm"
            onChange={e => {
              if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
            }}
            className="hidden"
            id="hidden-file-input"
          />

          <div className="w-20 h-20 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 border border-teal-200 shadow-sm">
            <Video className="w-10 h-10" />
          </div>

          <h4 className="text-lg font-bold text-slate-900 mb-1">Drop your video here</h4>
          <p className="text-sm text-slate-500 mb-4">or click anywhere to browse your files</p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors">
            <Upload className="w-4 h-4" />
            <span>Choose Video</span>
          </div>

          <div className="flex items-center gap-4 mt-6 text-xs text-slate-400 font-medium">
            <span>MP4</span>
            <span>•</span>
            <span>MOV</span>
            <span>•</span>
            <span>WebM</span>
            <span>•</span>
            <span>Max 100MB</span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header with file telemetry */}
          <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <FileVideo className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-xs sm:max-w-md">
                  {selectedFile.name}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-0.5">
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3 h-3 text-teal-600" />
                    {formatFileSize(selectedFile.size)}
                  </span>
                  {videoDuration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-teal-600" />
                      {videoDuration.toFixed(1)}s
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Replace Video</span>
              </button>

              <button
                onClick={handleRemove}
                disabled={isProcessing}
                className="p-2 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl transition-colors disabled:opacity-50"
                title="Remove video"
                aria-label="Remove video"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center relative">
                {videoUrl && (
                  <video
                    ref={videoElemRef}
                    src={videoUrl}
                    controls
                    playsInline
                    onLoadedMetadata={e => {
                      setVideoDuration(e.currentTarget.duration);
                    }}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {!result && (
                <button
                  onClick={handleAnalyze}
                  disabled={isProcessing}
                  className="w-full py-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-60 cursor-pointer"
                  id="analyze-video-btn"
                >
                  {isProcessing ? (
                    <>
                      <Cpu className="w-5 h-5 animate-spin" />
                      <span>Analyzing Gesture Sequence...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze Video with AI Pipeline</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Right Side: Step-by-Step Progress & Results */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
              {/* Step by step processing UI */}
              {steps.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Deep Learning Extraction Pipeline
                    </span>
                    <span className="text-[11px] font-mono text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded">
                      Demo Simulation
                    </span>
                  </div>

                  <div className="space-y-2">
                    {steps.map(step => {
                      let icon = <span className="w-2 h-2 rounded-full bg-slate-300"></span>;
                      let textClass = 'text-slate-400';

                      if (step.status === 'completed') {
                        icon = <CheckCircle2 className="w-4 h-4 text-teal-600" />;
                        textClass = 'text-slate-900 font-semibold';
                      } else if (step.status === 'in-progress') {
                        icon = <Cpu className="w-4 h-4 text-teal-600 animate-spin" />;
                        textClass = 'text-teal-700 font-bold';
                      }

                      return (
                        <div key={step.id} className="flex items-start gap-2.5 text-xs">
                          <div className="mt-0.5 shrink-0">{icon}</div>
                          <div className="flex-1">
                            <span className={textClass}>{step.title}</span>
                            <span className="text-[11px] text-slate-600 ml-1.5 hidden sm:inline">
                              — {step.description}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Analysis Result Card */}
              {result && (
                <div className="p-6 rounded-2xl bg-teal-950 text-white border border-teal-800 shadow-xl space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 font-mono text-xs font-bold border border-teal-500/40">
                      <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                      Recognition Output
                    </span>
                    <span className="text-xs font-mono text-slate-300">
                      Confidence: <strong className="text-teal-300">{result.confidence * 100}%</strong>
                    </span>
                  </div>

                  {/* Main Detected Sentence */}
                  <div>
                    <span className="text-xs uppercase font-bold text-teal-300 tracking-wider block mb-1">
                      Detected Sentence
                    </span>
                    <p className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
                      "{result.detectedText}"
                    </p>
                  </div>

                  {/* Detected Signs Glosses */}
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-1.5">
                      Extracted Sign Tokens
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.detectedSigns.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-teal-900/80 border border-teal-700 text-teal-200 text-xs font-mono font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs border-t border-teal-900/80 pt-3 text-slate-300">
                    <div>Frames Sampled: <strong className="text-white">{result.framesAnalyzed}</strong></div>
                    <div>Sign Model: <strong className="text-white">{result.signLanguage}</strong></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={handleSpeak}
                      className="flex-1 py-2.5 px-4 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      id="video-play-voice-btn"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Play Voice</span>
                    </button>

                    <button
                      onClick={handleCopy}
                      className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy Text</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Error Notice */}
              {error && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
