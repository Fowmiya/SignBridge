import React, { useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';

import { AppProvider, useApp } from './context/AppContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/layout/DemoBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { LiveAnnouncer } from './components/accessibility/LiveAnnouncer';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveSignPage } from './pages/LiveSignPage';
import { VideoUploadPage } from './pages/VideoUploadPage';
import { SpeechToSignPage } from './pages/SpeechToSignPage';
import { TextToSignPage } from './pages/TextToSignPage';
import { ConversationPage } from './pages/ConversationPage';
import { TranslationPage } from './pages/TranslationPage';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  const { accessibility } = useApp();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });

    if (accessibility.screenReaderOptimized) {
      const mainContent = document.getElementById('main-content');

      if (mainContent) {
        window.setTimeout(() => {
          mainContent.focus();
        }, 0);
      }
    }
  }, [pathname, accessibility.screenReaderOptimized]);

  return null;
}

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />

        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:rounded-md focus:bg-teal-700 focus:px-4 focus:py-3 focus:text-white focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-300"
          >
            Skip to main content
          </a>

          <DemoBanner />

          <Navbar />

          <main
            className="flex-1 w-full"
            id="main-content"
            tabIndex={-1}
            aria-label="Main content"
          >
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/live-sign" element={<LiveSignPage />} />
                <Route path="/video-upload" element={<VideoUploadPage />} />
                <Route
                  path="/speech-to-sign"
                  element={<SpeechToSignPage />}
                />
                <Route path="/text-to-sign" element={<TextToSignPage />} />
                <Route
                  path="/conversation"
                  element={<ConversationPage />}
                />
                <Route path="/translate" element={<TranslationPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route
                  path="/how-it-works"
                  element={<HowItWorksPage />}
                />
              </Route>

              {/* Unknown route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          <ToastContainer />
          <LiveAnnouncer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;