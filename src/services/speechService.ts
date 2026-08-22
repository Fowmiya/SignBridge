/**
 * Client-Side Browser Speech Recognition Service
 * Wraps Web Speech API (webkitSpeechRecognition / SpeechRecognition)
 */

type SpeechCallback = (text: string, isFinal: boolean) => void;
type ErrorCallback = (error: string) => void;
type StateCallback = (isListening: boolean) => void;

interface IWindowWithSpeech extends Window {
  webkitSpeechRecognition?: any;
  SpeechRecognition?: any;
}

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private onResultCallback: SpeechCallback | null = null;
  private onErrorCallback: ErrorCallback | null = null;
  private onStateChangeCallback: StateCallback | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindowWithSpeech;
      const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        this.recognition = new SpeechRecognitionConstructor();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        this.recognition.onstart = () => {
          this.isListening = true;
          this.onStateChangeCallback?.(true);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.onStateChangeCallback?.(false);
        };

        this.recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            this.onResultCallback?.(finalTranscript.trim(), true);
          } else if (interimTranscript) {
            this.onResultCallback?.(interimTranscript.trim(), false);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
          this.isListening = false;
          this.onStateChangeCallback?.(false);
          let message = 'Speech recognition error';
          if (event.error === 'not-allowed') {
            message = 'Microphone access was denied. Please allow microphone access in your browser settings.';
          } else if (event.error === 'no-speech') {
            message = 'No speech detected. Please try speaking again.';
          } else if (event.error === 'network') {
            message = 'Network issue with speech service.';
          }
          this.onErrorCallback?.(message);
        };
      }
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(
    lang: string = 'en-US',
    onResult: SpeechCallback,
    onError?: ErrorCallback,
    onStateChange?: StateCallback
  ): boolean {
    if (!this.isSupported()) {
      onError?.('Speech recognition is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return false;
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    this.onStateChangeCallback = onStateChange || null;

    try {
      this.recognition.lang = lang;
      this.recognition.start();
      return true;
    } catch (e) {
      console.warn('Failed to start speech recognition:', e);
      onError?.('Could not start microphone recording. It may already be in use.');
      return false;
    }
  }

  public stop() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    this.isListening = false;
    this.onStateChangeCallback?.(false);
  }

  public getListeningState(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
