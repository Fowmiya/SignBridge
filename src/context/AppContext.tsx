import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SpokenLanguageCode,
  SignLanguageCode,
  AccessibilitySettings,
  TranslationRecord,
  ConversationMessage,
} from '../types';
import { SPOKEN_LANGUAGES, SIGN_LANGUAGES } from '../services/translationService';

interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  spokenLang: SpokenLanguageCode;
  setSpokenLang: (code: SpokenLanguageCode) => void;
  signLang: SignLanguageCode;
  setSignLang: (code: SignLanguageCode) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (partial: Partial<AccessibilitySettings>) => void;
  history: TranslationRecord[];
  addHistoryItem: (item: Omit<TranslationRecord, 'id' | 'timestamp'>) => void;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
  messages: ConversationMessage[];
  addMessage: (msg: Omit<ConversationMessage, 'id' | 'timestamp'>) => void;
  clearConversation: () => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  screenReaderAnnouncement: string;
  announce: (text: string) => void;
  isDemoBannerVisible: boolean;
  setIsDemoBannerVisible: (visible: boolean) => void;
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  screenReaderOptimized: false,
  showLandmarks: true,
  captionsEnabled: true,
  soundEffects: true,
  speechRate: 1.0,
  speechPitch: 1.0,
};

const INITIAL_HISTORY: TranslationRecord[] = [
  {
    id: 'hist-1',
    timestamp: Date.now() - 1000 * 60 * 18,
    inputType: 'sign-camera',
    sourceText: '🤟 Sign Gesture: NEED-HELP',
    translatedText: 'I need assistance, please.',
    sourceLang: 'ISL',
    targetLang: 'en',
    signLang: 'ISL',
    confidence: 0.96,
    status: 'completed',
    notes: '21 Hand landmarks tracked with MediaPipe simulation',
  },
  {
    id: 'hist-2',
    timestamp: Date.now() - 1000 * 60 * 55,
    inputType: 'sign-video',
    sourceText: '🎥 Recorded Clip: WHERE-HOSPITAL.mp4',
    translatedText: 'Where is the nearest hospital?',
    sourceLang: 'ISL',
    targetLang: 'ta',
    signLang: 'ISL',
    confidence: 0.93,
    status: 'completed',
    notes: 'Temporal sequence analysis over 114 frames',
  },
  {
    id: 'hist-3',
    timestamp: Date.now() - 1000 * 60 * 120,
    inputType: 'speech',
    sourceText: 'Can you please guide me to platform 4?',
    translatedText: '🤟 Sign Gloss: [YOU] [GUIDE] [PLATFORM] [FOUR] [WHERE]',
    sourceLang: 'en',
    targetLang: 'ISL',
    signLang: 'ISL',
    confidence: 0.98,
    status: 'completed',
    notes: 'Web Speech API capture + ISL syntax parsing',
  },
  {
    id: 'hist-4',
    timestamp: Date.now() - 1000 * 60 * 240,
    inputType: 'text',
    sourceText: 'Thank you very much for your kind help.',
    translatedText: 'மிக்க நன்றி.',
    sourceLang: 'en',
    targetLang: 'ta',
    signLang: 'ISL',
    confidence: 0.95,
    status: 'completed',
    notes: 'Multilingual linguistic rule mapping',
  },
];

const INITIAL_MESSAGES: ConversationMessage[] = [
  {
    id: 'msg-1',
    sender: 'sign_user',
    senderName: 'Alex (Signer)',
    inputType: 'sign-camera',
    text: 'Hello, glad to meet you!',
    translatedText: 'வணக்கம், உங்களை சந்தித்ததில் மகிழ்ச்சி!',
    signGloss: ['HELLO', 'MEET', 'GLAD'],
    timestamp: Date.now() - 1000 * 60 * 8,
    confidence: 0.97,
  },
  {
    id: 'msg-2',
    sender: 'hearing_user',
    senderName: 'Sarah (Hearing)',
    inputType: 'speech',
    text: 'Hello Alex! I am happy to communicate with you. How can I help you today?',
    signGloss: ['HELLO', 'ALEX', 'HAPPY', 'COMMUNICATE', 'TODAY', 'HELP', 'HOW'],
    timestamp: Date.now() - 1000 * 60 * 6,
  },
  {
    id: 'msg-3',
    sender: 'sign_user',
    senderName: 'Alex (Signer)',
    inputType: 'sign-video',
    text: 'I am looking for the city library entrance.',
    translatedText: 'நான் நகர நூலக நுழைவாயிலைத் தேடுகிறேன்.',
    signGloss: ['CITY', 'LIBRARY', 'ENTRANCE', 'SEARCH'],
    timestamp: Date.now() - 1000 * 60 * 4,
    confidence: 0.94,
  },
  {
    id: 'msg-4',
    sender: 'hearing_user',
    senderName: 'Sarah (Hearing)',
    inputType: 'text',
    text: 'It is just around the corner on the left side, past the glass building.',
    signGloss: ['CORNER', 'LEFT', 'PASS', 'GLASS', 'BUILDING', 'LOCATED'],
    timestamp: Date.now() - 1000 * 60 * 2,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Languages
  const [spokenLang, setSpokenLangState] = useState<SpokenLanguageCode>(() => {
    return (localStorage.getItem('signbridge_spoken_lang') as SpokenLanguageCode) || 'en';
  });

  const [signLang, setSignLangState] = useState<SignLanguageCode>(() => {
    return (localStorage.getItem('signbridge_sign_lang') as SignLanguageCode) || 'ISL';
  });

  // Accessibility
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('signbridge_accessibility');
    return saved ? { ...DEFAULT_ACCESSIBILITY, ...JSON.parse(saved) } : DEFAULT_ACCESSIBILITY;
  });

  // History
  const [history, setHistory] = useState<TranslationRecord[]>(() => {
    const saved = localStorage.getItem('signbridge_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  // Conversation Messages
  const [messages, setMessages] = useState<ConversationMessage[]>(() => {
    const saved = localStorage.getItem('signbridge_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState<string>('');
  const [isDemoBannerVisible, setIsDemoBannerVisible] = useState<boolean>(true);

  // Sync state to body classes for instant accessibility mode styling
  useEffect(() => {
    const body = document.body;
    if (accessibility.largeText) {
      body.classList.add('accessibility-large-text');
    } else {
      body.classList.remove('accessibility-large-text');
    }

    if (accessibility.highContrast) {
      body.classList.add('accessibility-high-contrast');
    } else {
      body.classList.remove('accessibility-high-contrast');
    }

    if (accessibility.reducedMotion) {
      body.classList.add('accessibility-reduced-motion');
    } else {
      body.classList.remove('accessibility-reduced-motion');
    }

    localStorage.setItem('signbridge_accessibility', JSON.stringify(accessibility));
  }, [accessibility]);

  // Persist languages
  const setSpokenLang = (code: SpokenLanguageCode) => {
    setSpokenLangState(code);
    localStorage.setItem('signbridge_spoken_lang', code);
    const langObj = SPOKEN_LANGUAGES.find(l => l.code === code);
    announce(`Spoken language changed to ${langObj?.name || code}`);
  };

  const setSignLang = (code: SignLanguageCode) => {
    setSignLangState(code);
    localStorage.setItem('signbridge_sign_lang', code);
    const signObj = SIGN_LANGUAGES.find(s => s.code === code);
    announce(`Sign language model set to ${signObj?.name || code}`);
  };

  const updateAccessibility = (partial: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...partial }));
  };

  const addHistoryItem = (item: Omit<TranslationRecord, 'id' | 'timestamp'>) => {
    const newRecord: TranslationRecord = {
      ...item,
      id: 'hist-' + Date.now(),
      timestamp: Date.now(),
    };
    setHistory(prev => {
      const updated = [newRecord, ...prev];
      localStorage.setItem('signbridge_history', JSON.stringify(updated.slice(0, 50)));
      return updated;
    });
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.id !== id);
      localStorage.setItem('signbridge_history', JSON.stringify(updated));
      return updated;
    });
    showToast('Record deleted from history', 'info');
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('signbridge_history');
    showToast('History cleared', 'info');
  };

  const addMessage = (msg: Omit<ConversationMessage, 'id' | 'timestamp'>) => {
    const newMsg: ConversationMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      timestamp: Date.now(),
    };
    setMessages(prev => {
      const updated = [...prev, newMsg];
      localStorage.setItem('signbridge_messages', JSON.stringify(updated.slice(-40)));
      return updated;
    });
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem('signbridge_messages');
    showToast('Conversation reset', 'info');
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    announce(message);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const announce = (text: string) => {
    setScreenReaderAnnouncement(text);
  };

  return (
    <AppContext.Provider
      value={{
        spokenLang,
        setSpokenLang,
        signLang,
        setSignLang,
        accessibility,
        updateAccessibility,
        history,
        addHistoryItem,
        deleteHistoryItem,
        clearHistory,
        messages,
        addMessage,
        clearConversation,
        toasts,
        showToast,
        removeToast,
        screenReaderAnnouncement,
        announce,
        isDemoBannerVisible,
        setIsDemoBannerVisible,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
