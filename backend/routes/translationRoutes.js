const express = require("express");

const router = express.Router();

const SUPPORTED_LANGUAGES = [
  "en",
  "ta",
  "hi",
  "ml",
  "te",
  "kn",
];

const TRANSLATIONS = {
  hello: {
    en: "Hello",
    ta: "வணக்கம்",
    hi: "नमस्ते",
    ml: "നമസ്കാരം",
    te: "నమస్కారం",
    kn: "ನಮಸ್ಕಾರ",
  },

  how_are_you: {
    en: "How are you?",
    ta: "நீங்கள் எப்படி இருக்கிறீர்கள்?",
    hi: "आप कैसे हैं?",
    ml: "നിങ്ങൾക്ക് സുഖമാണോ?",
    te: "మీరు ఎలా ఉన్నారు?",
    kn: "ನೀವು ಹೇಗಿದ್ದೀರಿ?",
  },

  hello_how_are_you: {
    en: "Hello, how are you?",
    ta: "வணக்கம், நீங்கள் எப்படி இருக்கிறீர்கள்?",
    hi: "नमस्ते, आप कैसे हैं?",
    ml: "നമസ്കാരം, സുഖമാണോ?",
    te: "నమస్కారం, మీరు ఎలా ఉన్నారు?",
    kn: "ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?",
  },

  help: {
    en: "I need assistance, please.",
    ta: "எனக்கு உதவி தேவை, தயவுசெய்து.",
    hi: "मुझे मदद चाहिए, कृपया।",
    ml: "എനിക്ക് സഹായം വേണം, ദയവായി.",
    te: "నాకు సహాయం కావాలి, దయచేసి.",
    kn: "ನನಗೆ ಸಹಾಯ ಬೇಕು, ದಯವಿಟ್ಟು.",
  },

  thank_you: {
    en: "Thank you very much.",
    ta: "மிக்க நன்றி.",
    hi: "बहुत-बहुत धन्यवाद।",
    ml: "വളരെ നന്ദി.",
    te: "చాలా ధన్యవాదాలు.",
    kn: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು.",
  },

  where_going: {
    en: "Where are you going?",
    ta: "நீங்கள் எங்கே செல்கிறீர்கள்?",
    hi: "आप कहाँ जा रहे हैं?",
    ml: "നിങ്ങൾ എങ്ങോട്ടാണ് പോകുന്നത്?",
    te: "మీరు ఎక్కడికి వెళ్తున్నారు?",
    kn: "ನೀವು எங்கே പോകிறீர்கள்?",
  },

  nice_meet: {
    en: "Nice to meet you.",
    ta: "உங்களை சந்தித்ததில் மகிழ்ச்சி.",
    hi: "आपसे मिलकर अच्छा लगा।",
    ml: "കണ്ടതിൽ സന്തോഷം.",
    te: "మిమ్మల్ని కలవడం ఆనందంగా ఉంది.",
    kn: "ನಿಮ್ಮನ್ನು ಭೇಟಿಯಾದதில் ಸಂತೋಷವಾಗಿದೆ.",
  },

  yes: {
    en: "Yes, I understand.",
    ta: "ஆம், எனக்கு புரிகிறது.",
    hi: "हाँ, मैं समझ गया।",
    ml: "അതെ, എനിക്ക് മനസ്സിലായി.",
    te: "అవును, నాకు అర్థమైంది.",
    kn: "ಹೌದು, ನನಗೆ ಅರ್ಥವಾಯಿತು.",
  },

  no: {
    en: "No, thank you.",
    ta: "இல்லை, நன்றி.",
    hi: "नहीं, धन्यवाद।",
    ml: "ഇല്ല, നന്ദി.",
    te: "లేదు, ధన్యవాదాలు.",
    kn: "ಇಲ್ಲ, ಧನ್ಯವಾದಗಳು.",
  },

  good_morning: {
    en: "Good morning!",
    ta: "காலை வணக்கம்!",
    hi: "शुभ प्रभात!",
    ml: "സുപ്രഭാതം!",
    te: "శుభోదయం!",
    kn: "ಶುಭೋದಯ!",
  },

  doctor: {
    en: "I need to see a doctor.",
    ta: "நான் ஒரு மருத்துவரை பார்க்க வேண்டும்.",
    hi: "मुझे डॉक्टर को दिखाना है।",
    ml: "എനിക്ക് ഒരു ഡോക്ടറെ കാണണം.",
    te: "నేను డాక్టర్‌ని సంప్రదించాలి.",
    kn: "ನಾನು ವೈದ್ಯರನ್ನು ಭೇಟಿಯಾಗಬೇಕು.",
  },

  water: {
    en: "Please give me water.",
    ta: "தயவுசெய்து எனக்கு தண்ணீர் கொடுங்கள்.",
    hi: "कृपया मुझे पानी दीजिए।",
    ml: "ദയവായി എനിക്ക് വെള്ളം തരൂ.",
    te: "దయచేసి నాకు మంచి నీళ్లు ఇవ్వండి.",
    kn: "ದಯವಿಟ್ಟು ನನಗೆ ನೀರು ಕೊಡಿ.",
  },
};

const LANGUAGE_NAMES = {
  en: "English",
  ta: "Tamil",
  hi: "Hindi",
  ml: "Malayalam",
  te: "Telugu",
  kn: "Kannada",
};

router.post("/translate", (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({
        success: false,
        message: "Text, sourceLang, and targetLang are required",
      });
    }

    if (
      !SUPPORTED_LANGUAGES.includes(sourceLang) ||
      !SUPPORTED_LANGUAGES.includes(targetLang)
    ) {
      return res.status(400).json({
        success: false,
        message: "Unsupported source or target language",
      });
    }

    const cleanText = text.trim();

    if (!cleanText) {
      return res.status(400).json({
        success: false,
        message: "Text cannot be empty",
      });
    }

    if (sourceLang === targetLang) {
      return res.json({
        success: true,
        translatedText: cleanText,
        confidence: 1.0,
        isExact: true,
      });
    }

    const normalizedText = cleanText
      .toLowerCase()
      .replace(/[.!]+$/, "")
      .replace(/\s+/g, " ")
      .trim();

    /*
     * Specific phrase matching must happen BEFORE
     * individual keyword matching.
     */

    // Hello, how are you?
    if (
      sourceLang === "en" &&
      (normalizedText === "hello, how are you" ||
        normalizedText === "hello how are you")
    ) {
      return res.json({
        success: true,
        translatedText: TRANSLATIONS.hello_how_are_you[targetLang],
        confidence: 0.99,
        isExact: true,
      });
    }

    // How are you?
    if (
      sourceLang === "en" &&
      (normalizedText === "how are you" ||
        normalizedText === "how r you" ||
        normalizedText === "how r u")
    ) {
      return res.json({
        success: true,
        translatedText: TRANSLATIONS.how_are_you[targetLang],
        confidence: 0.99,
        isExact: true,
      });
    }

    // Hello
    if (
      sourceLang === "en" &&
      (normalizedText === "hello" || normalizedText === "hi")
    ) {
      return res.json({
        success: true,
        translatedText: TRANSLATIONS.hello[targetLang],
        confidence: 0.99,
        isExact: true,
      });
    }

    // General exact dictionary matching
    for (const key of Object.keys(TRANSLATIONS)) {
      const entry = TRANSLATIONS[key];
      const sourceText = entry[sourceLang]
        ?.toLowerCase()
        .replace(/[.!]+$/, "")
        .replace(/\s+/g, " ")
        .trim();

      if (sourceText && normalizedText === sourceText) {
        return res.json({
          success: true,
          translatedText: entry[targetLang] || cleanText,
          confidence: 0.96,
          isExact: true,
        });
      }
    }

    // Help
    if (
      normalizedText.includes("help") ||
      normalizedText.includes("உதவி") ||
      normalizedText.includes("मदद") ||
      normalizedText.includes("സഹായം")
    ) {
      return res.json({
        success: true,
        translatedText: TRANSLATIONS.help[targetLang],
        confidence: 0.94,
        isExact: false,
      });
    }

    // Thank you
    if (
      normalizedText.includes("thank") ||
      normalizedText.includes("நன்றி") ||
      normalizedText.includes("धन्यवाद") ||
      normalizedText.includes("നന്ദി")
    ) {
      return res.json({
        success: true,
        translatedText: TRANSLATIONS.thank_you[targetLang],
        confidence: 0.95,
        isExact: false,
      });
    }

    // Doctor
    if (
      normalizedText.includes("doctor") ||
      normalizedText.includes("மருத்துவர்") ||
      normalizedText.includes("डॉक्टर") ||
      normalizedText.includes("ഡോക്ടർ")
    ) {
      return res.json({
        success: true,
        translatedText: TRANSLATIONS.doctor[targetLang],
        confidence: 0.91,
        isExact: false,
      });
    }

    // Water
    if (
      normalizedText.includes("water") ||
      normalizedText.includes("தண்ணீர்") ||
      normalizedText.includes("पानी") ||
      normalizedText.includes("വെള്ളം")
    ) {
      return res.json({
        success: true,
        translatedText: TRANSLATIONS.water[targetLang],
        confidence: 0.93,
        isExact: false,
      });
    }

    // Temporary fallback
    return res.json({
      success: true,
      translatedText: `[${LANGUAGE_NAMES[targetLang]} translation]: ${cleanText}`,
      confidence: 0.88,
      isExact: false,
    });
  } catch (error) {
    console.error("Translation error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to translate text",
    });
  }
});

module.exports = router;