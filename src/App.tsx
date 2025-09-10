import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from './components/ReduxProvider.tsx';
import LaunchScreen from './components/LaunchScreen.tsx';
import DynamicLayout from './components/DynamicLayout.tsx';
import UploadPhase from './components/UploadPhase.tsx';
import LibraryPhase from './components/LibraryPhase.tsx';
import SummaryPhase from './components/SummaryPhase.tsx';
import MagicalEffects from './components/MagicalEffects.tsx';
import { useUI } from './hooks/useUI.ts';
import { usePerformance } from './hooks/usePerformance.ts';
import { AnimationProvider, EpicAnimation } from './animations';

function AppContent() {
  const { effects, triggerEffect, clearActiveEffect } = useUI();
  const { startRenderTimer, endRenderTimer } = usePerformance();
  const [epicAnimation, setEpicAnimation] = useState<{
    type: 'dragon-battle' | 'epic-summary' | 'massive-spell' | 'reality-bend';
    isActive: boolean;
  }>({ type: 'dragon-battle', isActive: false });

  // App state
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<'upload' | 'library' | 'summary' | 'idle'>('idle');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Performance monitoring
  useEffect(() => {
    startRenderTimer();
    return () => endRenderTimer();
  }, [startRenderTimer, endRenderTimer]);

  // Random magical effects to keep the app "alive"
  useEffect(() => {
    const effects = ['sparkles', 'floating-particles', 'magic-dust'];
    const randomEffect = () => {
      const effect = effects[Math.floor(Math.random() * effects.length)];
      triggerEffect(effect, 'low', 3000);
    };

    // Trigger random effects occasionally
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 30 seconds
        randomEffect();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [triggerEffect]);

  // Epic animation trigger (rare chance)
  useEffect(() => {
    const triggerEpicAnimation = () => {
      if (Math.random() < 0.05) { // 5% chance
        const epicTypes = ['dragon-battle', 'epic-summary', 'massive-spell', 'reality-bend'];
        const randomType = epicTypes[Math.floor(Math.random() * epicTypes.length)] as any;
        setEpicAnimation({ type: randomType, isActive: true });
        
        // Auto-hide after 15 seconds
        setTimeout(() => {
          setEpicAnimation(prev => ({ ...prev, isActive: false }));
        }, 15000);
      }
    };

    // Check for epic animation every 2 minutes
    const epicInterval = setInterval(triggerEpicAnimation, 120000);
    return () => clearInterval(epicInterval);
  }, []);

  // Handle phase changes
  const handlePhaseChange = (phase: 'upload' | 'library' | 'summary' | 'idle') => {
    setCurrentPhase(phase);
    triggerEffect('wizard-cast', 'moderate', 2000);
  };

  // Handle upload completion
  const handleUploadComplete = () => {
    setCurrentPhase('library');
  };

  // Handle library completion
  const handleLibraryComplete = () => {
    setCurrentPhase('summary');
  };

  // Handle summary completion
  const handleSummaryComplete = () => {
    setCurrentPhase('idle');
  };

  return (
    <AnimationProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Mystical Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>

        {/* Magical Effects */}
        <MagicalEffects activeEffect={effects.activeEffect} intensity={effects.intensity} />

        {/* Floating Mystical Orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/30 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-yellow-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/3 right-10 w-2 h-2 bg-green-400/30 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        {/* Launch Screen */}
        {showLaunchScreen && (
          <LaunchScreen onComplete={() => setShowLaunchScreen(false)} />
        )}

        {/* Main App */}
        {!showLaunchScreen && (
          <DynamicLayout
            currentPhase={currentPhase}
            onPhaseChange={handlePhaseChange}
          >
            {currentPhase === 'upload' && (
              <UploadPhase onComplete={handleUploadComplete} />
            )}
            {currentPhase === 'library' && (
              <LibraryPhase onComplete={handleLibraryComplete} />
            )}
            {currentPhase === 'summary' && (
              <SummaryPhase 
                selectedFiles={selectedFiles} 
                onComplete={handleSummaryComplete} 
              />
            )}
            {currentPhase === 'idle' && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                    Welcome to Arcano Desk
                  </h2>
                  <p className="text-purple-200/80 font-arcane text-lg mb-8">
                    Your magical study companion is ready to help!
                  </p>
                  <button
                    onClick={() => setCurrentPhase('upload')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                  >
                    Start Your Journey
                  </button>
                </div>
              </div>
            )}
          </DynamicLayout>
        )}

        {/* Epic Animations */}
        <EpicAnimation
          type={epicAnimation.type}
          isActive={epicAnimation.isActive}
          onComplete={() => setEpicAnimation(prev => ({ ...prev, isActive: false }))}
        />

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
    </AnimationProvider>
  );
}

function App() {
  return (
    <ReduxProvider>
      <AppContent />
    </ReduxProvider>
  );
}

export default App;
