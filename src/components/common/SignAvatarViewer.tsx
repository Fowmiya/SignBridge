import React, { useEffect, useRef, useState } from 'react';
import {
  Pause,
  Play,
  RotateCcw,
  Volume2,
  Sparkles,
} from 'lucide-react';

import { useApp } from '../../context/AppContext';
import {
  signGenerationService,
  GeneratedSignSequence,
  SignKeyframe,
} from '../../services/signGenerationService';
import { SignLanguageCode } from '../../types';
import { speechSynthesisService } from '../../services/speechSynthesisService';

interface Props {
  text: string;
  signLanguage?: SignLanguageCode;
  autoPlay?: boolean;
}

export const SignAvatarViewer: React.FC<Props> = ({
  text,
  signLanguage = 'ISL',
  autoPlay = false,
}) => {
  const { accessibility, showToast } = useApp();

  const [sequence, setSequence] =
    useState<GeneratedSignSequence | null>(null);

  const [currentKeyframeIndex, setCurrentKeyframeIndex] =
    useState(0);

  const [isPlaying, setIsPlaying] = useState(false);

  const [speed, setSpeed] = useState(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * Generate the sign sequence whenever the text or
   * selected sign language changes.
   */
  useEffect(() => {
    if (!text.trim()) {
      setSequence(null);
      setCurrentKeyframeIndex(0);
      setIsPlaying(false);
      return;
    }

    const generatedSequence =
      signGenerationService.generateSignSequence(
        text,
        signLanguage
      );

    setSequence(generatedSequence);
    setCurrentKeyframeIndex(0);
    setIsPlaying(autoPlay);
  }, [text, signLanguage, autoPlay]);

  /*
   * Playback timer.
   *
   * This keeps the original sign-sequence playback working.
   * When there is only one keyframe, the avatar animation
   * still continues visually while Play is active.
   */
  useEffect(() => {
    if (
      !isPlaying ||
      !sequence ||
      sequence.keyframes.length === 0
    ) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      return;
    }

    const currentKf =
      sequence.keyframes[currentKeyframeIndex] ||
      sequence.keyframes[0];

    const duration = Math.max(
      700,
      (currentKf.durationMs || 1200) / speed
    );

    timerRef.current = setTimeout(() => {
      setCurrentKeyframeIndex((previousIndex) => {
        if (
          previousIndex + 1 <
          sequence.keyframes.length
        ) {
          return previousIndex + 1;
        }

        // A Play Sign action runs the complete sign once,
        // including signs that contain only one keyframe.
        setIsPlaying(false);
        return 0;
      });
    }, duration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    isPlaying,
    currentKeyframeIndex,
    sequence,
    speed,
  ]);

  const handlePlayToggle = () => {
    setIsPlaying((previous) => !previous);
  };

  const handleReplay = () => {
    setCurrentKeyframeIndex(0);
    setIsPlaying(true);
  };

  const handleSpeakText = () => {
    if (!text.trim()) return;

    speechSynthesisService.speak(text);

    showToast('Speaking original text', 'info');
  };

  if (!text.trim() || !sequence) {
    return (
      <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50">
          <Sparkles className="h-7 w-7 text-teal-600" />
        </div>

        <h3 className="text-base font-bold text-slate-800">
          Sign Language Output
        </h3>

        <p className="mt-1 max-w-sm text-sm text-slate-500">
          Type or speak a message to see the human
          sign-language avatar.
        </p>
      </div>
    );
  }

  const currentKf: SignKeyframe =
    sequence.keyframes[currentKeyframeIndex] ||
    sequence.keyframes[0];

  /*
   * Make the common phrase HOW ARE YOU? use its own visible
   * questioning motion even when the generated metadata is generic.
   */
  const normalizedSignText = `${currentKf.signGloss} ${text}`
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ');

  const visualMotionProfile =
    normalizedSignText.includes('how are you') ||
    (normalizedSignText.includes('how') &&
      normalizedSignText.includes('you'))
      ? 'how-are-you'
      : currentKf.motionProfile;

  return (
    <div
      id="sign-avatar-viewer"
      className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
    >
      {/* Animation styles */}
      <style>
        {`

          @keyframes signbridgeHello {
            0% { transform: rotate(0deg); }
            22% { transform: rotate(-28deg); }
            48% { transform: rotate(-58deg); }
            66% { transform: rotate(-48deg); }
            78% { transform: rotate(-55deg); }
            100% { transform: rotate(0deg); }
          }

          /* THANK-YOU: forward/downward movement from the chin area.
           * The positive rotation makes this visibly different from HELLO,
           * which uses the larger upward salute motion.
           */
          @keyframes signbridgeThankYou {
            0% { transform: rotate(0deg); }
            20% { transform: rotate(8deg); }
            45% { transform: rotate(20deg); }
            65% { transform: rotate(28deg); }
            82% { transform: rotate(18deg); }
            100% { transform: rotate(0deg); }
          }

          /* HOW ARE YOU?: clear side-to-side questioning gesture.
           * This intentionally does NOT copy HELLO's upward raise.
           */
          @keyframes signbridgeHowAreYou {
            0% { transform: rotate(0deg); }
            18% { transform: rotate(24deg); }
            38% { transform: rotate(-22deg); }
            58% { transform: rotate(26deg); }
            76% { transform: rotate(-14deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes signbridgeHelp {
            0% { transform: rotate(0deg); }
            35% { transform: rotate(-10deg); }
            65% { transform: rotate(-24deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes signbridgeWhere {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            50% { transform: rotate(10deg); }
            75% { transform: rotate(-8deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes signbridgeYou {
            0% { transform: rotate(0deg); }
            45% { transform: rotate(-16deg); }
            72% { transform: rotate(-22deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes signbridgeGo {
            0% { transform: rotate(0deg); }
            35% { transform: rotate(-10deg); }
            65% { transform: rotate(-20deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes signbridgeWater {
            0% { transform: rotate(0deg); }
            30% { transform: rotate(-12deg); }
            60% { transform: rotate(-28deg); }
            72% { transform: rotate(-28deg) scale(0.98); }
            84% { transform: rotate(-28deg) scale(1.02); }
            100% { transform: rotate(0deg); }
          }

          @keyframes signbridgeDoctor {
            0% { transform: rotate(0deg); }
            35% { transform: rotate(-12deg); }
            60% { transform: rotate(-24deg); }
            72% { transform: rotate(-24deg) scale(0.98); }
            84% { transform: rotate(-24deg) scale(1.02); }
            100% { transform: rotate(0deg); }
          }

          @keyframes signbridgePlease {
            0% { transform: rotate(0deg); }
            25% { transform: rotate(12deg); }
            50% { transform: rotate(25deg); }
            75% { transform: rotate(12deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes signbridgeFingerspell {
            0% { transform: rotate(0deg); }
            30% { transform: rotate(-8deg); }
            60% { transform: rotate(8deg); }
            100% { transform: rotate(0deg); }
          }

          @keyframes signbridgeBlink {
            0%, 44%, 48%, 100% {
              transform: scaleY(1);
            }
            46% {
              transform: scaleY(0.08);
            }
          }

          @keyframes signbridgeBrows {
            0% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-4px) rotate(-2deg);
            }
            55% {
              transform: translateY(-1px) rotate(1deg);
            }
            80% {
              transform: translateY(-3px) rotate(-1deg);
            }
            100% {
              transform: translateY(0px) rotate(0deg);
            }
          }

          @keyframes signbridgeMouth {
            0% {
              transform: scaleY(1);
            }
            25% {
              transform: scaleY(1.55) scaleX(1.08);
            }
            50% {
              transform: scaleY(1.15) scaleX(0.92);
            }
            75% {
              transform: scaleY(1.45) scaleX(1.06);
            }
            100% {
              transform: scaleY(1);
            }
          }

          @keyframes signbridgeEyes {
            0% {
              transform: translateX(0px);
            }
            30% {
              transform: translateX(-2px);
            }
            55% {
              transform: translateX(2px);
            }
            80% {
              transform: translateX(1px);
            }
            100% {
              transform: translateX(0px);
            }
          }

          @keyframes signbridgeBody {
            0% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-2px);
            }

            100% {
              transform: translateY(0px);
            }
          }

          /*
           * Animate the complete arm + hand as one connected piece.
           * Rotation keeps the wrist attached to the forearm instead of
           * translating the hand independently ("flying hand" effect).
           */
          .signbridge-motion-arm {
            animation-duration: 1s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: 1;
            transform-box: fill-box;
          }

          .signbridge-motion-arm-left {
            transform-origin: 76% 0%;
          }

          .signbridge-motion-arm-right {
            transform-origin: 26% 0%;
          }

          .signbridge-motion-hello-salute {
            animation-name: signbridgeHello;
            animation-duration: 1.25s;
          }

          .signbridge-motion-thank-you-forward {
            animation-name: signbridgeThankYou;
            animation-duration: 1.15s;
          }

          .signbridge-motion-how-are-you {
            animation-name: signbridgeHowAreYou;
            animation-duration: 1.35s;
          }

          .signbridge-motion-help-lift {
            animation-name: signbridgeHelp;
          }

          .signbridge-motion-where-side-to-side {
            animation-name: signbridgeWhere;
          }

          .signbridge-motion-you-point {
            animation-name: signbridgeYou;
          }

          .signbridge-motion-go-forward {
            animation-name: signbridgeGo;
          }

          .signbridge-motion-water-mouth-tap {
            animation-name: signbridgeWater;
          }

          .signbridge-motion-doctor-wrist-tap {
            animation-name: signbridgeDoctor;
          }

          .signbridge-motion-please-chest-circle {
            animation-name: signbridgePlease;
          }

          .signbridge-motion-fingerspell {
            animation-name: signbridgeFingerspell;
          }

          .signbridge-body-playing {
            animation: signbridgeBody 1.4s ease-in-out infinite;
          }

          .signbridge-eye-blink {
            animation: signbridgeBlink 1.35s ease-in-out 1;
            transform-box: fill-box;
            transform-origin: center;
          }

          .signbridge-eye-look {
            animation: signbridgeEyes 1.35s ease-in-out 1;
            transform-box: fill-box;
            transform-origin: center;
          }

          .signbridge-brow-playing {
            animation: signbridgeBrows 1.35s ease-in-out 1;
            transform-box: fill-box;
            transform-origin: center bottom;
          }

          .signbridge-mouth-playing {
            animation: signbridgeMouth 1.35s ease-in-out 1;
            transform-box: fill-box;
            transform-origin: center;
          }

          @media (prefers-reduced-motion: reduce) {
            .signbridge-motion-hand,
            .signbridge-body-playing,
            .signbridge-eye-blink,
            .signbridge-eye-look,
            .signbridge-brow-playing,
            .signbridge-mouth-playing {
              animation: none !important;
            }
          }
        `}
      </style>

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50">
            <Sparkles className="h-5 w-5 text-teal-600" />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              {signLanguage} Sign Language
            </h3>

            <p className="text-xs text-slate-500">
              Human sign-language visual representation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSpeakText}
            aria-label="Speak original text"
            title="Speak original text"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-teal-200 hover:text-teal-600"
          >
            <Volume2 className="h-4 w-4" />
          </button>

          <span className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-500">
            {currentKeyframeIndex + 1} /{' '}
            {sequence.keyframes.length}
          </span>
        </div>
      </div>

      {/* AVATAR STAGE */}
      <div className="relative h-[500px] overflow-hidden bg-gradient-to-b from-slate-50 via-white to-teal-50">

        {/* Ready / Signing status */}
        <div className="absolute left-5 top-5 z-30 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isPlaying
                  ? 'animate-pulse bg-teal-500'
                  : 'bg-slate-300'
              }`}
            />

            <span className="text-xs font-semibold text-slate-600">
              {isPlaying ? 'Signing...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Expression */}
        <div className="absolute right-5 top-5 z-30 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wide text-teal-600">
            {currentKf.facialExpression.split(',')[0]}
          </span>
        </div>

        {/* Soft background glow */}
        <div className="absolute left-1/2 top-[52%] h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-100/50 blur-3xl" />

        {/* HUMAN AVATAR */}
        <div className="absolute bottom-0 left-1/2 h-[475px] w-[455px] -translate-x-1/2">

          <svg
            viewBox="0 0 450 470"
            className="h-full w-full"
            role="img"
            aria-label="Human avatar demonstrating sign language"
          >
            <defs>

              {/* Skin */}
              <linearGradient
                id="avatarSkin"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#f8d0b9"
                />

                <stop
                  offset="100%"
                  stopColor="#e5ae95"
                />
              </linearGradient>

              {/* Shirt */}
              <linearGradient
                id="avatarShirt"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#17877d"
                />

                <stop
                  offset="100%"
                  stopColor="#0d7068"
                />
              </linearGradient>

              {/* Hair */}
              <linearGradient
                id="avatarHair"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#222e44"
                />

                <stop
                  offset="100%"
                  stopColor="#0a1322"
                />
              </linearGradient>

            </defs>

            {/* Ground shadow */}
            <ellipse
              cx="225"
              cy="465"
              rx="145"
              ry="9"
              fill="#172033"
              opacity="0.08"
            />

            {/* BODY */}
            <g
              className={
                isPlaying
                  ? 'signbridge-body-playing'
                  : ''
              }
            >
              <path
                d="
                  M118 470
                  L130 350
                  Q135 319 165 302
                  Q193 287 225 287
                  Q257 287 285 302
                  Q315 319 320 350
                  L332 470
                  Z
                "
                fill="url(#avatarShirt)"
                stroke="#172033"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Shirt detail */}
              <path
                d="M150 350 Q225 326 300 350"
                fill="none"
                stroke="#45c5b8"
                strokeWidth="3"
                opacity="0.35"
              />

              {/* NECK */}
              <path
                d="
                  M188 222
                  L188 282
                  Q188 298 225 308
                  Q262 298 262 282
                  L262 222
                  Z
                "
                fill="url(#avatarSkin)"
                stroke="#172033"
                strokeWidth="4"
              />

              {/* Neck shading */}
              <path
                d="
                  M190 266
                  Q225 280 260 266
                  L260 286
                  Q225 300 190 286
                  Z
                "
                fill="#d79f88"
                opacity="0.28"
              />

              {/* COLLAR */}
              <path
                d="
                  M178 279
                  Q225 310 272 279
                  L286 297
                  Q225 330 164 297
                  Z
                "
                fill="#116f67"
                stroke="#172033"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* LEFT EAR */}
              <ellipse
                cx="161"
                cy="146"
                rx="15"
                ry="23"
                fill="url(#avatarSkin)"
                stroke="#172033"
                strokeWidth="4"
              />

              {/* RIGHT EAR */}
              <ellipse
                cx="289"
                cy="146"
                rx="15"
                ry="23"
                fill="url(#avatarSkin)"
                stroke="#172033"
                strokeWidth="4"
              />

              {/* FACE */}
              <path
                d="
                  M162 130
                  Q162 82 225 76
                  Q288 82 288 130
                  L282 190
                  Q270 226 225 244
                  Q180 226 168 190
                  Z
                "
                fill="url(#avatarSkin)"
                stroke="#172033"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* HAIR */}
              <path
                d="
                  M156 140
                  Q143 99 158 69
                  Q177 36 216 31
                  Q259 27 284 55
                  Q302 76 297 115
                  Q295 133 286 147
                  L274 115
                  Q267 94 245 84
                  Q219 72 193 88
                  Q168 103 156 140
                  Z
                "
                fill="url(#avatarHair)"
              />

              {/* Hair highlight */}
              <path
                d="
                  M168 80
                  Q189 52 217 47
                  Q247 44 272 62
                "
                fill="none"
                stroke="#3a465c"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.8"
              />

              {/* LEFT EYEBROW */}
              <path
                className={isPlaying ? 'signbridge-brow-playing' : ''}
                d="M181 140 Q195 133 208 140"
                fill="none"
                stroke="#253247"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* RIGHT EYEBROW */}
              <path
                className={isPlaying ? 'signbridge-brow-playing' : ''}
                d="M242 140 Q255 133 269 140"
                fill="none"
                stroke="#253247"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* LEFT EYE */}
              <ellipse
                className="signbridge-eye-blink"
                cx="195"
                cy="159"
                rx="9"
                ry="11"
                fill="white"
              />

              <ellipse
                className="signbridge-eye-look signbridge-eye-blink"
                cx="196"
                cy="160"
                rx="4.5"
                ry="5"
                fill="#172033"
              />

              <circle
                cx="197"
                cy="158"
                r="1.5"
                fill="white"
              />

              {/* RIGHT EYE */}
              <ellipse
                className="signbridge-eye-blink"
                cx="255"
                cy="159"
                rx="9"
                ry="11"
                fill="white"
              />

              <ellipse
                className="signbridge-eye-look signbridge-eye-blink"
                cx="254"
                cy="160"
                rx="4.5"
                ry="5"
                fill="#172033"
              />

              <circle
                cx="255"
                cy="158"
                r="1.5"
                fill="white"
              />

              {/* NOSE */}
              <path
                d="M225 164 L219 190 Q225 195 231 190"
                fill="none"
                stroke="#b97965"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* MOUTH */}
              <path
                className={isPlaying ? 'signbridge-mouth-playing' : ''}
                d="M209 211 Q225 220 241 211"
                fill="none"
                stroke="#71433a"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </g>

            {/* LEFT ARM + HAND */}
            <g
              className={
                isPlaying &&
                (
                  currentKf.motionProfile === 'help-lift' ||
                  currentKf.motionProfile === 'go-forward' ||
                  currentKf.motionProfile === 'doctor-wrist-tap'
                )
                  ? `signbridge-motion-arm signbridge-motion-arm-left signbridge-motion-${currentKf.motionProfile}`
                  : ''
              }
            >
              {/* Left arm */}
              <path
                d="
                  M170 303
                  Q145 305 128 323
                  Q114 338 110 360
                  L99 414
                  Q96 429 104 441
                  Q111 452 123 453
                  Q136 454 143 443
                  Q147 437 149 425
                  L158 376
                  Q162 357 179 349
                  Q193 342 198 328
                  Q203 311 190 305
                  Q181 301 170 303
                  Z
                "
                fill="url(#avatarSkin)"
                stroke="#172033"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Left sleeve */}
              <path
                d="
                  M170 303
                  Q145 305 128 323
                  Q116 337 111 357
                  Q109 367 115 375
                  Q121 382 132 379
                  L158 368
                  Q164 356 179 349
                  Q193 342 198 328
                  Q202 314 190 307
                  Q181 301 170 303
                  Z
                "
                fill="url(#avatarShirt)"
                stroke="#172033"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Left sleeve seam */}
              <path
                d="M157 368 Q166 353 180 348"
                fill="none"
                stroke="#0a5c56"
                strokeWidth="3"
              />

              {/* LEFT HAND + FINGERS */}
              <g>
              <path
                d="
                  M103 414
                  L84 406
                  Q77 403 77 396
                  Q77 390 83 388
                  Q88 387 94 390
                  L101 394

                  L100 359
                  Q100 351 107 351
                  Q114 351 115 359
                  L116 392

                  L117 350
                  Q117 342 124 342
                  Q131 342 131 350
                  L131 393

                  L132 348
                  Q132 340 139 340
                  Q146 340 146 348
                  L146 394

                  L148 356
                  Q148 348 155 348
                  Q162 348 162 356
                  L160 402

                  Q159 416 151 428
                  Q142 441 129 444
                  Q115 445 106 435
                  Q101 429 103 414
                  Z
                "
                fill="url(#avatarSkin)"
                stroke="#172033"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Left finger definition */}
              <path
                d="M115 392 L115 359"
                fill="none"
                stroke="#ae725f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M131 393 L131 350"
                fill="none"
                stroke="#ae725f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M146 394 L146 348"
                fill="none"
                stroke="#ae725f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M160 402 L162 356"
                fill="none"
                stroke="#ae725f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Left palm */}
              <path
                d="
                  M91 407
                  Q111 397 137 407
                  Q149 411 157 418
                "
                fill="none"
                stroke="#ae725f"
                strokeWidth="3"
                strokeLinecap="round"
              />
              </g>
            </g>

            {/* RIGHT ARM + HAND */}
            <g
              className={
                isPlaying
                  ? `signbridge-motion-arm signbridge-motion-arm-right signbridge-motion-${visualMotionProfile}`
                  : ''
              }
            >
              {/* Right arm */}
              <path
                d="
                  M280 303
                  Q305 305 322 323
                  Q336 338 340 360
                  L351 414
                  Q354 429 346 441
                  Q339 452 327 453
                  Q314 454 307 443
                  Q303 437 301 425
                  L292 376
                  Q288 357 271 349
                  Q257 342 252 328
                  Q247 311 260 305
                  Q269 301 280 303
                  Z
                "
                fill="url(#avatarSkin)"
                stroke="#172033"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Right sleeve */}
              <path
                d="
                  M280 303
                  Q305 305 322 323
                  Q334 337 339 357
                  Q341 367 335 375
                  Q329 382 318 379
                  L292 368
                  Q286 356 271 349
                  Q257 342 252 328
                  Q248 314 260 307
                  Q269 301 280 303
                  Z
                "
                fill="url(#avatarShirt)"
                stroke="#172033"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Right sleeve seam */}
              <path
                d="M293 368 Q284 353 270 348"
                fill="none"
                stroke="#0a5c56"
                strokeWidth="3"
              />

              {/* RIGHT HAND + FINGERS */}
              <g>
              <path
                d="
                  M347 414
                  L366 406
                  Q373 403 373 396
                  Q373 390 367 388
                  Q362 387 356 390
                  L349 394

                  L350 359
                  Q350 351 343 351
                  Q336 351 335 359
                  L334 392

                  L333 350
                  Q333 342 326 342
                  Q319 342 319 350
                  L319 393

                  L318 348
                  Q318 340 311 340
                  Q304 340 304 348
                  L304 394

                  L302 356
                  Q302 348 295 348
                  Q288 348 288 356
                  L290 402

                  Q291 416 299 428
                  Q308 441 321 444
                  Q335 445 344 435
                  Q349 429 347 414
                  Z
                "
                fill="url(#avatarSkin)"
                stroke="#172033"
                strokeWidth="4"
                strokeLinejoin="round"
              />

              {/* Right finger definition */}
              <path
                d="M335 392 L335 359"
                fill="none"
                stroke="#ae725f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M319 393 L319 350"
                fill="none"
                stroke="#ae725f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M304 394 L304 348"
                fill="none"
                stroke="#ae725f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M290 402 L288 356"
                fill="none"
                stroke="#ae725f"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Right palm */}
              <path
                d="
                  M359 407
                  Q339 397 313 407
                  Q301 411 293 418
                "
                fill="none"
                stroke="#ae725f"
                strokeWidth="3"
                strokeLinecap="round"
              />
              </g>
            </g>
          </svg>
        </div>

        {/* CAPTION */}
        {accessibility.captionsEnabled && (
          <div className="absolute bottom-3 left-1/2 z-40 -translate-x-1/2">
            <div className="whitespace-nowrap rounded-2xl bg-slate-900/95 px-6 py-3 text-center shadow-lg">
              <span className="mr-2 text-xs font-bold uppercase text-teal-400">
                {currentKf.signGloss}
              </span>

              <span className="text-sm text-white">
                "{text}"
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SIGN DETAILS */}
      <div className="grid grid-cols-1 border-t border-slate-100 sm:grid-cols-2">

        <div className="px-5 py-5">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Current Sign
          </p>

          <p className="text-2xl font-black text-teal-600">
            {currentKf.signGloss}
          </p>
        </div>

        <div className="border-t border-slate-100 px-5 py-5 sm:border-l sm:border-t-0">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Hand Shape
          </p>

          <p className="text-sm font-semibold text-slate-700">
            {currentKf.handShape}
          </p>
        </div>
      </div>

      {/* MOVEMENT */}
      <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Movement
        </p>

        <p className="text-sm text-slate-600">
          {currentKf.motionDescription}
        </p>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 px-5 py-4">

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={handlePlayToggle}
            id="play-sign-btn"
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}

            <span>
              {isPlaying ? 'Pause' : 'Play Sign'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleReplay}
            aria-label="Replay sign sequence"
            title="Replay sign sequence"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

        </div>

        {/* SPEED */}
        <div className="flex items-center gap-2">

          <span className="text-xs font-semibold text-slate-400">
            Speed
          </span>

          {[0.5, 1, 1.5].map((value) => (
            <button
              type="button"
              key={value}
              onClick={() => setSpeed(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                speed === value
                  ? 'bg-teal-500 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {value}x
            </button>
          ))}

        </div>
      </div>
    </div>
  );
};