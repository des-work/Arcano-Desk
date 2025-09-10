import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Library from './pages/Library.tsx';
import Calendar from './pages/Calendar.tsx';
import StudyAssistant from './pages/StudyAssistant.tsx';
import Settings from './pages/Settings.tsx';
import MagicalEffects from './components/MagicalEffects.tsx';
import { FileProvider } from './contexts/FileContext.tsx';
import { OllamaProvider } from './contexts/OllamaContext.tsx';

function App() {
  const [activeEffect, setActiveEffect] = useState<string>('');

  // Random magical effects to keep the app "alive"
  useEffect(() => {
    const effects = ['sparkles'];
    const randomEffect = () => {
      const effect = effects[Math.floor(Math.random() * effects.length)];
      setActiveEffect(effect);
      setTimeout(() => setActiveEffect(''), 3000);
    };

    // Trigger random effects occasionally
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        randomEffect();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <FileProvider>
      <OllamaProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
            {/* Mystical Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>

            {/* Magical Effects */}
            <MagicalEffects activeEffect={activeEffect} intensity="low" />

            {/* Floating Mystical Orbs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/30 rounded-full animate-float"></div>
              <div className="absolute top-40 right-20 w-3 h-3 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
              <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-yellow-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/3 right-10 w-2 h-2 bg-green-400/30 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            <Header />
            <main className="relative z-10 container mx-auto px-6 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/library" element={<Library />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/assistant" element={<StudyAssistant />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>

            {/* Enchanted Toaster */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'linear-gradient(135deg, #1A0A2E 0%, #2D1B4E 100%)',
                  color: '#8B5CF6',
                  border: '2px solid #8B5CF6',
                  borderRadius: '12px',
                  fontFamily: 'Merriweather, serif',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                },
              }}
            />
          </div>
        </Router>
      </OllamaProvider>
    </FileProvider>
  );
}

export default App;
