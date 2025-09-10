import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Library from './pages/Library';
import Calendar from './pages/Calendar';
import StudyAssistant from './pages/StudyAssistant';
import Settings from './pages/Settings';
import { FileProvider } from './contexts/FileContext';
import { OllamaProvider } from './contexts/OllamaContext';

function App() {
  return (
    <FileProvider>
      <OllamaProvider>
        <Router>
          <div className="min-h-screen bg-arcade-bg retro-grid">
            <div className="magic-particles">
              <Header />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/library" element={<Library />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/assistant" element={<StudyAssistant />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: '#1A0A2E',
                    color: '#8B5CF6',
                    border: '2px solid #8B5CF6',
                    borderRadius: '8px',
                    fontFamily: 'Courier New, monospace',
                  },
                }}
              />
            </div>
          </div>
        </Router>
      </OllamaProvider>
    </FileProvider>
  );
}

export default App;
