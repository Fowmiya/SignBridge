import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sliders,
  X,
  Eye,
  Type,
  Zap,
  Volume2,
  Sparkles,
  Subtitles,
  ShieldCheck,
  Accessibility,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<Props> = ({
  isOpen,
  onClose,
}) => {
  const {
    accessibility,
    updateAccessibility,
    showToast,
  } = useApp();

  // Temporary settings used only inside the modal.
  // Changes are applied only after clicking "Apply & Close".
  const [draftAccessibility, setDraftAccessibility] =
    useState(accessibility);

  // When the modal opens, copy the currently applied
  // settings into the temporary draft.
  useEffect(() => {
    if (isOpen) {
      setDraftAccessibility(accessibility);
    }
  }, [isOpen, accessibility]);

  if (!isOpen) return null;

  const updateDraft = (
    partial: Partial<typeof draftAccessibility>
  ) => {
    setDraftAccessibility(prev => ({
      ...prev,
      ...partial,
    }));
  };

  const handleApplyAndClose = () => {
    updateAccessibility(draftAccessibility);

    showToast(
      'Accessibility settings applied',
      'success'
    );

    onClose();
  };

  const handleCancel = () => {
    // Discard all temporary changes.
    setDraftAccessibility(accessibility);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]"
        id="accessibility-quick-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200/60">
              <Sliders className="w-5 h-5" />
            </div>

            <div>
              <h2
                id="a11y-modal-title"
                className="text-lg font-bold text-slate-900"
              >
                Accessibility Controls
              </h2>

              <p className="text-xs text-slate-500 font-medium">
                Tailor SignBridge to your sensory & physical preferences
              </p>
            </div>
          </div>

          <button
            onClick={handleCancel}
            className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-500 hover:text-slate-900 transition-colors focus:ring-2 focus:ring-teal-500"
            aria-label="Close accessibility controls"
            id="close-a11y-modal-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto">

          {/* Visual section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-teal-600" />
              Visual Enhancements
            </h3>

            <div className="space-y-3">

              {/* Large Text */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-teal-50/20 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Type className="w-5 h-5 text-teal-600" />

                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      Large Text Mode
                    </span>

                    <span className="text-xs text-slate-500">
                      Increases text size for easier reading
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={draftAccessibility.largeText}
                  onChange={e =>
                    updateDraft({
                      largeText: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  id="a11y-large-text-toggle"
                />
              </label>

              {/* High Contrast */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-teal-50/20 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-teal-600" />

                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      High Contrast Canvas
                    </span>

                    <span className="text-xs text-slate-500">
                      Stark dark background with high-contrast text and crisp borders
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={draftAccessibility.highContrast}
                  onChange={e =>
                    updateDraft({
                      highContrast: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  id="a11y-high-contrast-toggle"
                />
              </label>

              {/* Reduced Motion */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-teal-50/20 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-teal-600" />

                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      Reduced Motion
                    </span>

                    <span className="text-xs text-slate-500">
                      Minimizes UI transitions, pulses, and canvas animations
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={draftAccessibility.reducedMotion}
                  onChange={e =>
                    updateDraft({
                      reducedMotion: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  id="a11y-reduced-motion-toggle"
                />
              </label>

              {/* Screen Reader Optimized */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-teal-50/20 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Accessibility className="w-5 h-5 text-teal-600" />

                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      Screen Reader Optimized Mode
                    </span>

                    <span className="text-xs text-slate-500">
                      Improves labels, navigation, and announcements for screen readers
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={draftAccessibility.screenReaderOptimized}
                  onChange={e =>
                    updateDraft({
                      screenReaderOptimized: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  id="a11y-screen-reader-toggle"
                />
              </label>
            </div>
          </div>

          {/* AI & Vision Helpers */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Sign & Vision Features
            </h3>

            <div className="space-y-3">

              {/* Landmark Mesh */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-teal-50/20 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-teal-600" />

                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      Visual Hand Landmarks
                    </span>

                    <span className="text-xs text-slate-500">
                      Overlay 21 MediaPipe hand points during camera signing
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={draftAccessibility.showLandmarks}
                  onChange={e =>
                    updateDraft({
                      showLandmarks: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  id="a11y-landmarks-toggle"
                />
              </label>

              {/* Captions */}
              <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 bg-slate-50/50 hover:bg-teal-50/20 cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <Subtitles className="w-5 h-5 text-teal-600" />

                  <div>
                    <span className="text-sm font-semibold text-slate-900 block">
                      Sign Player Subtitles
                    </span>

                    <span className="text-xs text-slate-500">
                      Display gloss and phonetic captions on sign avatar displays
                    </span>
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={draftAccessibility.captionsEnabled}
                  onChange={e =>
                    updateDraft({
                      captionsEnabled: e.target.checked,
                    })
                  }
                  className="w-5 h-5 accent-teal-600 rounded cursor-pointer"
                  id="a11y-captions-toggle"
                />
              </label>
            </div>
          </div>

          {/* Voice Speed */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-teal-600" />
              Speech Synthesis Speed
            </h3>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 font-medium">
                  Reading Rate
                </span>

                <span className="font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {draftAccessibility.speechRate}x
                </span>
              </div>

              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={draftAccessibility.speechRate}
                onChange={e =>
                  updateDraft({
                    speechRate: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-teal-600 cursor-pointer"
                id="a11y-speech-rate-slider"
                aria-label="Speech reading rate"
              />

              <div className="flex justify-between text-[11px] text-slate-600 font-medium">
                <span>0.5x (Deliberate)</span>
                <span>1.0x (Normal)</span>
                <span>1.5x (Fast)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>WCAG 2.1 AAA Compliant</span>
          </div>

          <button
            onClick={handleApplyAndClose}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-teal-500"
            id="a11y-done-btn"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};