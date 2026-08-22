import { SignLanguageCode } from '../types';

export interface SignKeyframe {
  id: string;
  signGloss: string;
  handShape: string;
  motionDescription: string;
  bodyOrientation: string;
  facialExpression: string;
  svgHandPose: 'open-palm' | 'fist' | 'pointing' | 'two-hands-crossed' | 'thumbs-up' | 'peace';
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
  'HELLO': {
    id: 'kf-hello',
    signGloss: 'HELLO',
    handShape: 'Open B-hand',
    motionDescription: 'Salute outward from temple with subtle wrist flexion',
    bodyOrientation: 'Frontal upright',
    facialExpression: 'Warm smile, direct eye gaze',
    svgHandPose: 'open-palm',
    durationMs: 900,
  },
  'HELP': {
    id: 'kf-help',
    signGloss: 'HELP',
    handShape: 'Closed fist on flat palm',
    motionDescription: 'Thumbs-up dominant hand rests on open non-dominant palm, lifting upward together',
    bodyOrientation: 'Slight forward lean',
    facialExpression: 'Inquiring/urgent eyebrow raise',
    svgHandPose: 'thumbs-up',
    durationMs: 1100,
  },
  'THANK-YOU': {
    id: 'kf-thank-you',
    signGloss: 'THANK-YOU',
    handShape: 'Flat hand touching chin',
    motionDescription: 'Move flat palm forward and downward toward conversational partner',
    bodyOrientation: 'Frontal slight nod',
    facialExpression: 'Appreciative smile',
    svgHandPose: 'open-palm',
    durationMs: 950,
  },
  'WHERE': {
    id: 'kf-where',
    signGloss: 'WHERE',
    handShape: 'Index finger pointing upward',
    motionDescription: 'Side-to-side gentle oscillation with palms up questioning posture',
    bodyOrientation: 'Head tilted slightly',
    facialExpression: 'Furrowed brow (wh-question non-manual marker)',
    svgHandPose: 'pointing',
    durationMs: 1200,
  },
  'YOU': {
    id: 'kf-you',
    signGloss: 'YOU',
    handShape: 'Index finger pointing forward',
    motionDescription: 'Direct pointing toward partner within signing space',
    bodyOrientation: 'Direct',
    facialExpression: 'Neutral attentive',
    svgHandPose: 'pointing',
    durationMs: 750,
  },
  'GO': {
    id: 'kf-go',
    signGloss: 'GO',
    handShape: 'Dual index fingers',
    motionDescription: 'Simultaneous forward rolling arc movement',
    bodyOrientation: 'Directional shift',
    facialExpression: 'Neutral',
    svgHandPose: 'pointing',
    durationMs: 850,
  },
  'WATER': {
    id: 'kf-water',
    signGloss: 'WATER',
    handShape: 'W-hand shape / 3 fingers',
    motionDescription: 'Index finger taps lower lip twice gently',
    bodyOrientation: 'Frontal',
    facialExpression: 'Attentive',
    svgHandPose: 'peace',
    durationMs: 950,
  },
  'DOCTOR': {
    id: 'kf-doctor',
    signGloss: 'DOCTOR',
    handShape: 'M-hand / fingertips on wrist pulse',
    motionDescription: 'Bent fingertips tap non-dominant wrist pulse location twice',
    bodyOrientation: 'Frontal',
    facialExpression: 'Focused',
    svgHandPose: 'two-hands-crossed',
    durationMs: 1050,
  },
  'PLEASE': {
    id: 'kf-please',
    signGloss: 'PLEASE',
    handShape: 'Flat palm circular chest motion',
    motionDescription: 'Flat palm rubs center of chest in gentle clockwise circles',
    bodyOrientation: 'Slight polite bow',
    facialExpression: 'Soft polite smile',
    svgHandPose: 'open-palm',
    durationMs: 1000,
  },
};

export class SignGenerationService {
  /**
   * Convert text into an animated sign keyframe sequence
   */
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
      let matchedKey = Object.keys(GESTURE_DATABASE).find(k => k === word || word.includes(k));
      if (!matchedKey) {
        if (word === 'NEED' || word === 'ASSISTANCE') matchedKey = 'HELP';
        else if (word === 'THANKS' || word === 'THANK') matchedKey = 'THANK-YOU';
        else if (word === 'HI' || word === 'HEY' || word === 'GREETINGS') matchedKey = 'HELLO';
        else if (word === 'DRINK') matchedKey = 'WATER';
        else if (word === 'HOSPITAL') matchedKey = 'DOCTOR';
      }

      if (matchedKey && GESTURE_DATABASE[matchedKey]) {
        glosses.push(matchedKey);
        keyframes.push(GESTURE_DATABASE[matchedKey]);
      } else {
        // Dynamic generic fallback keyframe for fingerspelling/word
        glosses.push(word);
        keyframes.push({
          id: `kf-word-${word}`,
          signGloss: word,
          handShape: `${signLanguage} Fingerspelling: [${word}]`,
          motionDescription: `Sequential manual alphabet spelling for "${word}"`,
          bodyOrientation: 'Frontal stable signing window',
          facialExpression: 'Focused visual mouthing',
          svgHandPose: 'open-palm',
          durationMs: 900,
        });
      }
    }

    if (keyframes.length === 0) {
      glosses.push('HELLO');
      keyframes.push(GESTURE_DATABASE['HELLO']);
    }

    const totalDurationMs = keyframes.reduce((acc, kf) => acc + kf.durationMs, 0);

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
