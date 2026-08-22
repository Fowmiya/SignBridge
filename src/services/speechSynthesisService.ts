/**
 * Client-Side Browser Speech Synthesis Service
 * Uses window.speechSynthesis to provide accessible voice output
 */

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  onEnd?: () => void;
  onError?: (err: Error) => void;
}

class SpeechSynthesisService {
  private isSupported: boolean = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isSupported = true;
      this.loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  }

  public checkSupport(): boolean {
    return this.isSupported;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0) {
      this.loadVoices();
    }
    return this.voices;
  }

  public speak(text: string, options: SpeechOptions = {}): boolean {
    if (!this.isSupported || !text.trim()) {
      return false;
    }

    try {
      window.speechSynthesis.cancel(); // Stop current speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 1.0;
      utterance.pitch = options.pitch || 1.0;

      // Select matching voice for language if available
      const langCode = options.lang || 'en-US';
      utterance.lang = langCode;

      const matchingVoice = this.voices.find(v => v.lang.startsWith(langCode.slice(0, 2)));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      if (options.onEnd) {
        utterance.onend = () => options.onEnd?.();
      }
      if (options.onError) {
        utterance.onerror = (e) => options.onError?.(new Error(e.error));
      }

      window.speechSynthesis.speak(utterance);
      return true;
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      return false;
    }
  }

  public pause() {
    if (this.isSupported && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    if (this.isSupported && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public stop() {
    if (this.isSupported) {
      window.speechSynthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    return this.isSupported ? window.speechSynthesis.speaking : false;
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
