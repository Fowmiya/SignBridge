# SignBridge

> An accessible full-stack application for sign language translation and communication.

SignBridge is a full-stack web application designed to support communication between sign language users and non-sign language users.

The application combines multilingual translation, animated sign visualization, accessibility features, authentication, and conversation history into a single user-friendly platform.

## ✨ Features

### Multilingual Translation

- Translation between multiple supported languages
- Language selection through the application interface
- Sign-aware translation for commonly used phrases
- Animated sign visualization for supported signs
- Text-to-speech support
- Support for commonly used phrases such as:
  - Hello
  - How are you?
  - Thank you
  - Help

### Sign Visualization

- Animated sign avatar
- Distinct hand movements for supported signs
- Facial expressions and blinking
- Captions for sign demonstrations
- Reduced-motion support
- Visual hand landmarks

### Accessibility

- Large text mode
- High-contrast canvas
- Reduced motion
- Screen-reader optimized mode
- Visual hand landmarks
- Captions
- Adjustable speech rate
- Accessible buttons, labels, and navigation

### User Accounts

- User registration
- Secure login
- JWT-based authentication
- Protected application routes
- Current-user session handling

### Conversation History

- Save translated conversations
- Retrieve previous messages
- Clear conversation history
- User-specific conversation storage

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- SQLite
- JWT Authentication
- REST API

### Development

- npm
- Git
- GitHub

## 📁 Project Structure

```text
SignBridge/
├── backend/
│   ├── database/
│   │   ├── db.js
│   │   └── initDb.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── conversationRoutes.js
│   │   ├── signRoutes.js
│   │   └── translationRoutes.js
│   ├── package.json
│   └── server.js
│
├── src/
│   ├── components/
│   │   ├── accessibility/
│   │   ├── auth/
│   │   ├── common/
│   │   ├── conversation/
│   │   └── layout/
│   ├── context/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── TranslationPage.tsx
│   ├── services/
│   │   ├── apiService.ts
│   │   ├── signGenerationService.ts
│   │   └── translationService.ts
│   ├── App.tsx
│   └── index.css
│
├── assets/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts