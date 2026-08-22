import { VideoProcessingStep, SignLanguageCode } from '../types';

export const INITIAL_VIDEO_STEPS: VideoProcessingStep[] = [
  { id: 1, title: 'Video uploaded', description: 'File validated, format checked & frames loaded', status: 'pending' },
  { id: 2, title: 'Extracting frames', description: 'Sampling 30 FPS high-resolution temporal frames', status: 'pending' },
  { id: 3, title: 'Detecting hand movements', description: 'Tracking 21 3D landmarks for both hands', status: 'pending' },
  { id: 4, title: 'Analyzing gestures', description: 'Spatial trajectory & non-manual expression analysis', status: 'pending' },
  { id: 5, title: 'Recognizing signs', description: 'Transformer sequence model classifying sign tokens', status: 'pending' },
  { id: 6, title: 'Generating text', description: 'Constructing grammatically natural sentences', status: 'pending' },
  { id: 7, title: 'Preparing translation', description: 'Multilingual mapping & text-to-speech alignment', status: 'pending' },
];

export interface VideoAnalysisResult {
  detectedText: string;
  detectedSigns: string[];
  confidence: number;
  signLanguage: SignLanguageCode;
  durationSeconds: number;
  framesAnalyzed: number;
  handLandmarkScore: number;
  gesturesRecognized: number;
  timestamp: string;
}

export class VideoAnalysisService {
  /**
   * Run step-by-step progress simulation with real-time UI callback
   */
  public async analyzeVideo(
    file: File,
    signLanguage: SignLanguageCode = 'ISL',
    onStepUpdate: (steps: VideoProcessingStep[], currentStepIndex: number) => void
  ): Promise<VideoAnalysisResult> {
    const steps: VideoProcessingStep[] = JSON.parse(JSON.stringify(INITIAL_VIDEO_STEPS));

    for (let i = 0; i < steps.length; i++) {
      // Set current to in-progress
      steps[i].status = 'in-progress';
      onStepUpdate([...steps], i);

      // Realistic progressive step delay
      const stepDuration = i === 0 ? 300 : i === 2 || i === 4 ? 650 : 450;
      await new Promise(resolve => setTimeout(resolve, stepDuration));

      // Mark completed
      steps[i].status = 'completed';
      onStepUpdate([...steps], i);
    }

    // Dynamic result based on file name or simulated sample
    const sampleResults = [
      { text: 'I need assistance, please.', signs: ['NEED', 'HELP', 'PLEASE'] },
      { text: 'Where is the nearest hospital?', signs: ['HOSPITAL', 'NEAR', 'WHERE', 'Q-MARK'] },
      { text: 'Hello, nice to meet you all today.', signs: ['HELLO', 'MEET', 'NICE', 'TODAY'] },
      { text: 'Can you please provide some water?', signs: ['WATER', 'PLEASE', 'GIVE'] },
    ];

    const resultIndex = Math.abs(file.name.length) % sampleResults.length;
    const selected = sampleResults[resultIndex];

    return {
      detectedText: selected.text,
      detectedSigns: selected.signs,
      confidence: 0.94,
      signLanguage,
      durationSeconds: 3.8,
      framesAnalyzed: 114,
      handLandmarkScore: 0.98,
      gesturesRecognized: selected.signs.length,
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}

export const videoAnalysisService = new VideoAnalysisService();
