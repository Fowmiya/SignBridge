import { SignLanguageCode } from '../types';

export type SignMotionProfile =
  | 'hello-salute'
  | 'help-lift'
  | 'thank-you-forward'
  | 'where-side-to-side'
  | 'you-point'
  | 'go-forward'
  | 'water-mouth-tap'
  | 'doctor-wrist-tap'
  | 'please-chest-circle'
  | 'fingerspell';

export type SignHandPosition =
  | 'neutral'
  | 'temple'
  | 'chin'
  | 'chest'
  | 'mouth'
  | 'wrist'
  | 'center'
  | 'forward'
  | 'left'
  | 'right'
  | 'palm';

export interface SignKeyframe {
  id: string;
  signGloss: string;
  handShape: string;
  motionDescription: string;
  bodyOrientation: string;
  facialExpression: string;
  svgHandPose:
    | 'open-palm'
    | 'fist'
    | 'pointing'
    | 'two-hands-crossed'
    | 'thumbs-up'
    | 'peace';

  motionProfile: SignMotionProfile;
  dominantHandStart: SignHandPosition;
  dominantHandEnd: SignHandPosition;
  nonDominantHandPosition: SignHandPosition;
  repeatCount: number;

  durationMs: number;
}

export interface GeneratedSignSequence {
  originalText: string;
  signLanguage: SignLanguageCode;
  glosses: string[];
  keyframes: SignKeyframe[];
  totalDurationMs: number;
}

const GESTURE_DATABASE: Record<string, SignKeyframe> = {
  HELLO: {
    id: 'kf-hello',
    signGloss: 'HELLO',
    handShape: 'Open B-hand',
    motionDescription:
      'Raise the dominant open hand near the temple and move it outward in a friendly salute.',
    bodyOrientation: 'Frontal upright',
    facialExpression: 'Warm smile, direct eye gaze',
    svgHandPose: 'open-palm',
    motionProfile: 'hello-salute',
    dominantHandStart: 'temple',
    dominantHandEnd: 'right',
    nonDominantHandPosition: 'neutral',
    repeatCount: 1,
    durationMs: 900,
  },

  HELP: {
    id: 'kf-help',
    signGloss: 'HELP',
    handShape: 'Closed fist on flat palm',
    motionDescription:
      'Place the dominant thumbs-up hand on the open non-dominant palm and lift both hands upward.',
    bodyOrientation: 'Slight forward lean',
    facialExpression: 'Inquiring/urgent eyebrow raise',
    svgHandPose: 'thumbs-up',
    motionProfile: 'help-lift',
    dominantHandStart: 'center',
    dominantHandEnd: 'forward',
    nonDominantHandPosition: 'palm',
    repeatCount: 1,
    durationMs: 1100,
  },

  'THANK-YOU': {
    id: 'kf-thank-you',
    signGloss: 'THANK-YOU',
    handShape: 'Flat hand touching chin',
    motionDescription:
      'Start with the flat dominant hand near the chin and move it forward and slightly downward toward the conversational partner.',
    bodyOrientation: 'Frontal slight nod',
    facialExpression: 'Appreciative smile',
    svgHandPose: 'open-palm',
    motionProfile: 'thank-you-forward',
    dominantHandStart: 'chin',
    dominantHandEnd: 'forward',
    nonDominantHandPosition: 'neutral',
    repeatCount: 1,
    durationMs: 950,
  },

  WHERE: {
    id: 'kf-where',
    signGloss: 'WHERE',
    handShape: 'Index finger pointing upward',
    motionDescription:
      'Hold the pointing hand in signing space and move it gently from side to side.',
    bodyOrientation: 'Head tilted slightly',
    facialExpression: 'Furrowed brow (wh-question non-manual marker)',
    svgHandPose: 'pointing',
    motionProfile: 'where-side-to-side',
    dominantHandStart: 'center',
    dominantHandEnd: 'left',
    nonDominantHandPosition: 'neutral',
    repeatCount: 2,
    durationMs: 1200,
  },

  YOU: {
    id: 'kf-you',
    signGloss: 'YOU',
    handShape: 'Index finger pointing forward',
    motionDescription:
      'Extend the pointing hand directly forward toward the conversational partner.',
    bodyOrientation: 'Direct',
    facialExpression: 'Neutral attentive',
    svgHandPose: 'pointing',
    motionProfile: 'you-point',
    dominantHandStart: 'center',
    dominantHandEnd: 'forward',
    nonDominantHandPosition: 'neutral',
    repeatCount: 1,
    durationMs: 750,
  },

  GO: {
    id: 'kf-go',
    signGloss: 'GO',
    handShape: 'Dual index fingers',
    motionDescription:
      'Use both hands in a directional forward movement, creating a clear sense of moving away.',
    bodyOrientation: 'Directional shift',
    facialExpression: 'Neutral',
    svgHandPose: 'pointing',
    motionProfile: 'go-forward',
    dominantHandStart: 'center',
    dominantHandEnd: 'forward',
    nonDominantHandPosition: 'center',
    repeatCount: 1,
    durationMs: 850,
  },

  WATER: {
    id: 'kf-water',
    signGloss: 'WATER',
    handShape: 'W-hand shape / 3 fingers',
    motionDescription:
      'Bring the three-finger hand shape toward the lower lip and perform two small tapping motions.',
    bodyOrientation: 'Frontal',
    facialExpression: 'Attentive',
    svgHandPose: 'peace',
    motionProfile: 'water-mouth-tap',
    dominantHandStart: 'center',
    dominantHandEnd: 'mouth',
    nonDominantHandPosition: 'neutral',
    repeatCount: 2,
    durationMs: 950,
  },

  DOCTOR: {
    id: 'kf-doctor',
    signGloss: 'DOCTOR',
    handShape: 'M-hand / fingertips on wrist pulse',
    motionDescription:
      'Bring the dominant fingertips to the non-dominant wrist and make two small tapping motions.',
    bodyOrientation: 'Frontal',
    facialExpression: 'Focused',
    svgHandPose: 'two-hands-crossed',
    motionProfile: 'doctor-wrist-tap',
    dominantHandStart: 'center',
    dominantHandEnd: 'wrist',
    nonDominantHandPosition: 'wrist',
    repeatCount: 2,
    durationMs: 1050,
  },

  PLEASE: {
    id: 'kf-please',
    signGloss: 'PLEASE',
    handShape: 'Flat palm circular chest motion',
    motionDescription:
      'Place the flat dominant palm over the chest and make a gentle circular rubbing motion.',
    bodyOrientation: 'Slight polite bow',
    facialExpression: 'Soft polite smile',
    svgHandPose: 'open-palm',
    motionProfile: 'please-chest-circle',
    dominantHandStart: 'chest',
    dominantHandEnd: 'chest',
    nonDominantHandPosition: 'neutral',
    repeatCount: 1,
    durationMs: 1000,
  },
};

export class SignGenerationService {
  public generateSignSequence(
    text: string,
    signLanguage: SignLanguageCode = 'ISL'
  ): GeneratedSignSequence {
    const words = text
      .toUpperCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"]/g, '')
      .split(/\s+/)
      .filter(Boolean);

    const glosses: string[] = [];
    const keyframes: SignKeyframe[] = [];

    for (const word of words) {
      let matchedKey = Object.keys(GESTURE_DATABASE).find(
        key => key === word || word.includes(key)
      );

      if (!matchedKey) {
        if (word === 'NEED' || word === 'ASSISTANCE') {
          matchedKey = 'HELP';
        } else if (word === 'THANKS' || word === 'THANK') {
          matchedKey = 'THANK-YOU';
        } else if (
          word === 'HI' ||
          word === 'HEY' ||
          word === 'GREETINGS'
        ) {
          matchedKey = 'HELLO';
        } else if (word === 'DRINK') {
          matchedKey = 'WATER';
        } else if (word === 'HOSPITAL') {
          matchedKey = 'DOCTOR';
        }
      }

      if (matchedKey && GESTURE_DATABASE[matchedKey]) {
        glosses.push(matchedKey);
        keyframes.push(GESTURE_DATABASE[matchedKey]);
      } else {
        glosses.push(word);

        keyframes.push({
          id: `kf-word-${word}`,
          signGloss: word,
          handShape: `${signLanguage} Fingerspelling: [${word}]`,
          motionDescription: `Sequential manual alphabet spelling for "${word}"`,
          bodyOrientation: 'Frontal stable signing window',
          facialExpression: 'Focused visual mouthing',
          svgHandPose: 'open-palm',
          motionProfile: 'fingerspell',
          dominantHandStart: 'center',
          dominantHandEnd: 'forward',
          nonDominantHandPosition: 'neutral',
          repeatCount: 1,
          durationMs: 900,
        });
      }
    }

    if (keyframes.length === 0) {
      glosses.push('HELLO');
      keyframes.push(GESTURE_DATABASE.HELLO);
    }

    const totalDurationMs = keyframes.reduce(
      (acc, keyframe) => acc + keyframe.durationMs,
      0
    );

    return {
      originalText: text,
      signLanguage,
      glosses,
      keyframes,
      totalDurationMs,
    };
  }
}

export const signGenerationService = new SignGenerationService();