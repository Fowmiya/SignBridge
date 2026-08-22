export type SpokenLanguageCode = 'en' | 'ta' | 'hi' | 'ml' | 'te' | 'kn';

export interface SpokenLanguage {
  code: SpokenLanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
}

export type SignLanguageCode = 'ISL' | 'ASL' | 'BSL';

export interface SignLanguage {
  code: SignLanguageCode;
  name: string;
  region: string;
  description: string;
}

export type InputMode = 'sign-camera' | 'sign-video' | 'speech' | 'text';

export interface TranslationRecord {
  id: string;
  timestamp: number;
  inputType: InputMode;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  signLang: SignLanguageCode;
  confidence: number;
  status: 'completed' | 'processing' | 'flagged';
  notes?: string;
}

export interface ConversationMessage {
  id: string;
  sender: 'sign_user' | 'hearing_user';
  senderName: string;
  inputType: InputMode;
  text: string;
  translatedText?: string;
  signGloss?: string[];
  timestamp: number;
  confidence?: number;
  videoUrl?: string;
}

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  showLandmarks: boolean;
  captionsEnabled: boolean;
  soundEffects: boolean;
  speechRate: number; // 0.5 to 1.5
  speechPitch: number; // 0.5 to 1.5
}

export interface RecognitionResult {
  detectedSign: string;
  gloss: string;
  recognizedText: string;
  confidence: number;
  alternatives: { sign: string; confidence: number }[];
  landmarksDetected: number;
  latencyMs: number;
}

export interface VideoProcessingStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}
