import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DemoBanner } from './components/layout/DemoBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { AccessibilityModal } from './components/accessibility/AccessibilityModal';
import { LiveAnnouncer } from './components/accessibility/LiveAnnouncer';

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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
          {/* Top Demo Disclaimer */}
          <DemoBanner />

          {/* Navigation Bar */}
          <Navbar />

          {/* Main Content Viewport */}
          <main className="flex-1 w-full" id="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/live-sign" element={<LiveSignPage />} />
              <Route path="/video-upload" element={<VideoUploadPage />} />
              <Route path="/speech-to-sign" element={<SpeechToSignPage />} />
              <Route path="/text-to-sign" element={<TextToSignPage />} />
              <Route path="/conversation" element={<ConversationPage />} />
              <Route path="/translate" element={<TranslationPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer />

          {/* Global Utilities */}
          <ToastContainer />
          <AccessibilityModal />
          <LiveAnnouncer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
