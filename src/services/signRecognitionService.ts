import { RecognitionResult, SignLanguageCode } from '../types';

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface HandPoseData {
  leftHand: LandmarkPoint[];
  rightHand: LandmarkPoint[];
  poseUpper: LandmarkPoint[];
}

export const SAMPLE_SIGNS_DATA: Array<{
  sign: string;
  gloss: string;
  phrase: string;
  category: 'Greeting' | 'Emergency' | 'Daily' | 'Question' | 'Polite';
}> = [
  { sign: 'HELLO', gloss: 'HELLO', phrase: 'Hello, glad to meet you!', category: 'Greeting' },
  { sign: 'HELP', gloss: 'NEED-HELP', phrase: 'I need assistance, please.', category: 'Emergency' },
  { sign: 'THANK YOU', gloss: 'THANK-YOU', phrase: 'Thank you very much.', category: 'Polite' },
  { sign: 'WHERE', gloss: 'WHERE-GO', phrase: 'Where are you going?', category: 'Question' },
  { sign: 'DOCTOR', gloss: 'DOCTOR-HOSPITAL', phrase: 'I need to visit the hospital/doctor.', category: 'Emergency' },
  { sign: 'WATER', gloss: 'DRINK-WATER', phrase: 'Could I please get some water?', category: 'Daily' },
  { sign: 'YES', gloss: 'AGREE-YES', phrase: 'Yes, that is correct.', category: 'Daily' },
  { sign: 'NO', gloss: 'DECLINE-NO', phrase: 'No, thank you.', category: 'Daily' },
  { sign: 'NAME', gloss: 'MY-NAME-WHAT', phrase: 'What is your name?', category: 'Question' },
  { sign: 'FRIEND', gloss: 'FRIEND-ME', phrase: 'You are my friend.', category: 'Polite' },
];

export class SignRecognitionService {
  private isProcessing: boolean = false;

  /**
   * Generates a simulated realistic MediaPipe 21-point hand landmark skeleton
   * with natural hand positions & jitter
   */
  public generateHandSkeleton(seed: number = 0): HandPoseData {
    const time = Date.now() / 800;
    const wave = Math.sin(time + seed);
    const wave2 = Math.cos(time + seed);

    // Left hand points (21 landmarks)
    const leftHand: LandmarkPoint[] = [];
    const lx = 0.35 + wave * 0.04;
    const ly = 0.58 + wave2 * 0.03;
    leftHand.push({ x: lx, y: ly }); // 0: Wrist

    // Thumb, Index, Middle, Ring, Pinky
    for (let f = 0; f < 5; f++) {
      const angle = -0.6 + f * 0.3 + wave * 0.1;
      let px = lx;
      let py = ly;
      for (let j = 1; j <= 4; j++) {
        px += Math.cos(angle) * (0.022 + j * 0.005);
        py -= Math.sin(angle) * (0.025 + j * 0.004);
        leftHand.push({ x: Math.max(0.05, Math.min(0.95, px)), y: Math.max(0.05, Math.min(0.95, py)) });
      }
    }

    // Right hand points (21 landmarks)
    const rightHand: LandmarkPoint[] = [];
    const rx = 0.65 - wave * 0.04;
    const ry = 0.54 - wave2 * 0.03;
    rightHand.push({ x: rx, y: ry }); // 0: Wrist

    for (let f = 0; f < 5; f++) {
      const angle = 3.8 - f * 0.3 - wave * 0.1;
      let px = rx;
      let py = ry;
      for (let j = 1; j <= 4; j++) {
        px += Math.cos(angle) * (0.022 + j * 0.005);
        py -= Math.sin(angle) * (0.025 + j * 0.004);
        rightHand.push({ x: Math.max(0.05, Math.min(0.95, px)), y: Math.max(0.05, Math.min(0.95, py)) });
      }
    }

    // Pose upper torso (shoulders, elbows, nose)
    const poseUpper: LandmarkPoint[] = [
      { x: 0.5, y: 0.28 }, // Nose
      { x: 0.38, y: 0.42 }, // Left shoulder
      { x: 0.62, y: 0.42 }, // Right shoulder
      { x: 0.32, y: 0.52 }, // Left elbow
      { x: 0.68, y: 0.52 }, // Right elbow
    ];

    return { leftHand, rightHand, poseUpper };
  }

  /**
   * Recognizes signs from a frame (Demo Prototype Simulation)
   */
  public async recognizeFrame(
    signLang: SignLanguageCode = 'ISL',
    presetIndex?: number
  ): Promise<RecognitionResult> {
    // Simulate lightweight frame computation latency (35-65ms)
    await new Promise(r => setTimeout(r, 45));

    const item =
      presetIndex !== undefined && SAMPLE_SIGNS_DATA[presetIndex]
        ? SAMPLE_SIGNS_DATA[presetIndex]
        : SAMPLE_SIGNS_DATA[Math.floor(Math.random() * SAMPLE_SIGNS_DATA.length)];

    const baseConfidence = 0.91 + Math.random() * 0.07;

    return {
      detectedSign: item.sign,
      gloss: `${signLang}:${item.gloss}`,
      recognizedText: item.phrase,
      confidence: parseFloat(baseConfidence.toFixed(2)),
      alternatives: [
        { sign: SAMPLE_SIGNS_DATA[(presetIndex || 0) + 1 % SAMPLE_SIGNS_DATA.length]?.sign || 'HELLO', confidence: 0.74 },
        { sign: 'THANK YOU', confidence: 0.61 },
      ],
      landmarksDetected: 47, // 21 left + 21 right + 5 pose
      latencyMs: 38 + Math.floor(Math.random() * 15),
    };
  }
}

export const signRecognitionService = new SignRecognitionService();
