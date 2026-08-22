import React from 'react';
import { VideoUploader } from '../components/video/VideoUploader';
import { Video, Sparkles, FileCheck, Layers, Cpu } from 'lucide-react';

export const VideoUploadPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8" id="video-upload-page-root">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 text-xs font-bold border border-indigo-200">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Deep Temporal Video Extraction</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Upload Sign Language Video
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
          Upload recorded sign-language videos in MP4, MOV, or WebM formats to extract 3D gesture landmarks and convert them into natural language.
        </p>
      </div>

      {/* Main Video Uploader & Pipeline Component */}
      <VideoUploader />

      {/* Architecture Deep Dive Strip */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>How Video AI Sequence Extraction Works</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-1">
            <span className="font-bold text-white block">1. Frame Sampling</span>
            <p className="text-slate-400">Uniform 30fps extraction slicing video frames for temporal consistency.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-1">
            <span className="font-bold text-white block">2. 3D Joint Tracking</span>
            <p className="text-slate-400">MediaPipe Hands tracks (x,y,z) coordinate changes across every wrist and finger joint.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-1">
            <span className="font-bold text-white block">3. Sequence Decoding</span>
            <p className="text-slate-400">Spatial-Temporal Graph Convolutional Networks (ST-GCN) classify gesture words.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/70 space-y-1">
            <span className="font-bold text-white block">4. Syntax Translation</span>
            <p className="text-slate-400">Sign gloss tokens map to natural language sentences in your chosen spoken dialect.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
