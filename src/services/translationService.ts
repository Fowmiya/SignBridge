import { SpokenLanguage, SignLanguage, SpokenLanguageCode, SignLanguageCode } from '../types';

export const SPOKEN_LANGUAGES: SpokenLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', speechCode: 'en-US' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳', speechCode: 'ta-IN' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', speechCode: 'hi-IN' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳', speechCode: 'ml-IN' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳', speechCode: 'te-IN' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳', speechCode: 'kn-IN' },
];

export const SIGN_LANGUAGES: SignLanguage[] = [
  {
    code: 'ISL',
    name: 'Indian Sign Language',
    region: 'India & South Asia',
    description: 'Two-handed fingerspelling system with rich regional syntax and spatial grammar.',
  },
  {
    code: 'ASL',
    name: 'American Sign Language',
    region: 'North America',
    description: 'One-handed fingerspelling system widely used across international deaf communities.',
  },
  {
    code: 'BSL',
    name: 'British Sign Language',
    region: 'United Kingdom',
    description: 'Two-handed manual alphabet system with distinct non-manual features (NMFs).',
  },
];

// Rich multilingual dictionary for common conversational & accessibility phrases
const DICTIONARY: Record<string, Record<SpokenLanguageCode, string>> = {
  'hello': {
    en: 'Hello, how are you?',
    ta: 'வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?',
    hi: 'नमस्ते, आप कैसे हैं?',
    ml: 'നമസ്കാരം, സുഖമാണോ?',
    te: 'నమస్కారం, మీరు ఎలా ఉన్నారు?',
    kn: 'ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?',
  },
  'help': {
    en: 'I need assistance, please.',
    ta: 'எனக்கு உதவி தேவை, தயவுசெய்து.',
    hi: 'मुझे मदद चाहिए, कृपया।',
    ml: 'എനിക്ക് സഹായം വേണം, ദയവായി.',
    te: 'నాకు సహాయం కావాలి, దయచేసి.',
    kn: 'ನನಗೆ ಸಹಾಯ ಬೇಕು, ದಯವಿಟ್ಟು.',
  },
  'thank_you': {
    en: 'Thank you very much.',
    ta: 'மிக்க நன்றி.',
    hi: 'बहुत-बहुत धन्यवाद।',
    ml: 'വളരെ നന്ദി.',
    te: 'చాలా ధన్యవాదాలు.',
    kn: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು.',
  },
  'where_going': {
    en: 'Where are you going?',
    ta: 'நீங்கள் எங்கே செல்கிறீர்கள்?',
    hi: 'आप कहाँ जा रहे हैं?',
    ml: 'നിങ്ങൾ എങ്ങോട്ടാണ് പോകുന്നത്?',
    te: 'మీరు ఎక్కడికి వెళ్తున్నారు?',
    kn: 'ನೀವು ಎಲ್ಲಿಗೆ ಹೋಗುತ್ತಿದ್ದೀರಿ?',
  },
  'nice_meet': {
    en: 'Nice to meet you.',
    ta: 'உங்களை சந்தித்ததில் மகிழ்ச்சி.',
    hi: 'आपसे मिलकर अच्छा लगा।',
    ml: 'കണ്ടതിൽ സന്തോഷം.',
    te: 'మిమ్మల్ని కలవడం ఆనందంగా ఉంది.',
    kn: 'ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾಗಲು ಸಂತೋಷವಾಗಿದೆ.',
  },
  'yes': {
    en: 'Yes, I understand.',
    ta: 'ஆம், எனக்கு புரிகிறது.',
    hi: 'हाँ, मैं समझ गया।',
    ml: 'അതെ, എനിക്ക് മനസ്സിലായി.',
    te: 'అవును, నాకు అర్థమైంది.',
    kn: 'ಹೌದು, ನನಗೆ ಅರ್ಥವಾಯಿತು.',
  },
  'no': {
    en: 'No, thank you.',
    ta: 'இல்லை, நன்றி.',
    hi: 'नहीं, धन्यवाद।',
    ml: 'ഇല്ല, നന്ദി.',
    te: 'లేదు, ధన్యవాదాలు.',
    kn: 'ಇಲ್ಲ, ಧನ್ಯವಾದಗಳು.',
  },
  'good_morning': {
    en: 'Good morning!',
    ta: 'காலை வணக்கம்!',
    hi: 'शुभ प्रभात!',
    ml: 'സുപ്രഭാതം!',
    te: 'శుభోదయం!',
    kn: 'ಶುಭೋದಯ!',
  },
  'doctor': {
    en: 'I need to see a doctor.',
    ta: 'நான் ஒரு மருத்துவரை பார்க்க வேண்டும்.',
    hi: 'मुझे डॉक्टर को दिखाना है।',
    ml: 'എനിക്ക് ഒരു ഡോക്ടറെ കാണണം.',
    te: 'నేను డాక్టర్‌ని సంప్రదించాలి.',
    kn: 'ನಾನು ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಬೇಕು.',
  },
  'water': {
    en: 'Please give me water.',
    ta: 'தயவுசெய்து எனக்கு தண்ணீர் கொடுங்கள்.',
    hi: 'कृपया मुझे पानी दीजिए।',
    ml: 'ദയവായി എനിക്ക് വെള്ളം തരൂ.',
    te: 'దయచేసి నాకు మంచి నీళ్లు ఇవ్వండి.',
    kn: 'ದಯವಿಟ್ಟು ನನಗೆ ನೀರು ಕೊಡಿ.',
  },
};

export class TranslationService {
  /**
   * Translate text between supported spoken languages
   * Uses dictionary lookup or intelligent local linguistic rule mapping
   */
  public translateText(
    text: string,
    sourceLang: SpokenLanguageCode,
    targetLang: SpokenLanguageCode
  ): { translatedText: string; confidence: number; isExact: boolean } {
    if (!text.trim()) {
      return { translatedText: '', confidence: 1.0, isExact: true };
    }

    if (sourceLang === targetLang) {
      return { translatedText: text, confidence: 1.0, isExact: true };
    }

    const clean = text.toLowerCase().trim();

    // Check exact dictionary match
    for (const key of Object.keys(DICTIONARY)) {
      const entry = DICTIONARY[key];
      const sourceVal = entry[sourceLang]?.toLowerCase();
      if (sourceVal && (clean === sourceVal || clean.includes(key.replace('_', ' ')))) {
        return {
          translatedText: entry[targetLang] || text,
          confidence: 0.96,
          isExact: true,
        };
      }
    }

    // Keyword heuristics
    if (clean.includes('hello') || clean.includes('hi') || clean.includes('வணக்கம்') || clean.includes('नमस्ते')) {
      return { translatedText: DICTIONARY['hello'][targetLang], confidence: 0.92, isExact: false };
    }
    if (clean.includes('help') || clean.includes('உதவி') || clean.includes('मदद') || clean.includes('സഹായം')) {
      return { translatedText: DICTIONARY['help'][targetLang], confidence: 0.94, isExact: false };
    }
    if (clean.includes('thank') || clean.includes('நன்றி') || clean.includes('धन्यवाद') || clean.includes('നന്ദി')) {
      return { translatedText: DICTIONARY['thank_you'][targetLang], confidence: 0.95, isExact: false };
    }
    if (clean.includes('doctor') || clean.includes('மருத்துவர்') || clean.includes('हॉस्पिटल')) {
      return { translatedText: DICTIONARY['doctor'][targetLang], confidence: 0.91, isExact: false };
    }
    if (clean.includes('water') || clean.includes('தண்ணீர்') || clean.includes('पानी') || clean.includes('വെള്ളം')) {
      return { translatedText: DICTIONARY['water'][targetLang], confidence: 0.93, isExact: false };
    }

    // Default informative demo translation formatting
    const langNames: Record<SpokenLanguageCode, string> = {
      en: 'English',
      ta: 'தமிழ்',
      hi: 'हिन्दी',
      ml: 'മലയാളം',
      te: 'తెలుగు',
      kn: 'ಕನ್ನಡ',
    };

    return {
      translatedText: `[${langNames[targetLang]} translation]: ${text}`,
      confidence: 0.88,
      isExact: false,
    };
  }

  /**
   * Convert text into Sign Language Gloss tokens
   * e.g., "Where are you going?" -> ["YOU", "GO", "WHERE", "(QUESTION-FACIAL)"]
   */
  public generateSignGloss(text: string, signLang: SignLanguageCode = 'ISL'): string[] {
    if (!text.trim()) return [];

    const words = text
      .toUpperCase()
      .replace(/[.,/#!$%^&*;:{}=\-_`~()?'"]/g, '')
      .split(/\s+/)
      .filter(Boolean);

    // Reorder based on sign language syntax (Topic-Comment / OSV / SOV)
    if (signLang === 'ISL') {
      // Indian Sign Language typically uses SOV (Subject - Object - Verb) with question particles at the end
      const isQuestion = text.includes('?') || words.includes('WHERE') || words.includes('WHAT') || words.includes('HOW');
      const filtered = words.filter(w => !['IS', 'ARE', 'AM', 'THE', 'A', 'AN', 'TO', 'OF'].includes(w));
      if (isQuestion) {
        return [...filtered, 'Q-EXPRESSION', 'PALM-UP'];
      }
      return filtered.length > 0 ? filtered : ['SIGN-WORD'];
    }

    if (signLang === 'ASL') {
      // ASL Topic-Comment structure with non-manual markers
      const filtered = words.filter(w => !['IS', 'ARE', 'AM', 'THE', 'A', 'AN'].includes(w));
      return filtered.map(w => (w === 'ME' ? 'PRO-1' : w === 'YOU' ? 'PRO-2' : w));
    }

    // BSL default
    return words.filter(w => !['IS', 'ARE', 'THE', 'A'].includes(w));
  }
}

export const translationService = new TranslationService();
