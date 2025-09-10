import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useFiles } from '../contexts/FileContext';
import { useOllama } from '../contexts/OllamaContext';
import toast from 'react-hot-toast';

// Import pages
import Dashboard from '../pages/Dashboard';
import Library from '../pages/Library';
import StudyAssistant from '../pages/StudyAssistant';
import Calendar from '../pages/Calendar';
import Settings from '../pages/Settings';

// Import components
import LaunchScreen from './LaunchScreen';
import ErrorBoundary from './ErrorBoundary';
import { OptimizedAnimationProvider } from '../animations/OptimizedAnimationEngine';

// Route protection component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  requiresFiles?: boolean;
  fallbackPath?: string;
  fallbackMessage?: string;
}> = ({ children, requiresFiles = false, fallbackPath = '/', fallbackMessage }) => {
  const { files } = useFiles();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (requiresFiles && files.length === 0) {
      if (fallbackMessage) {
        toast.error(fallbackMessage);
      }
      navigate(fallbackPath);
    }
  }, [files.length, requiresFiles, fallbackPath, fallbackMessage, navigate]);

  if (requiresFiles && files.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🧙‍♂️</div>
          <h2 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
            No Documents Found
          </h2>
          <p className="text-purple-200/80 font-arcane text-lg mb-8">
            {fallbackMessage || 'Please upload some documents first to use this feature.'}
          </p>
          <button
            onClick={() => navigate('/library')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          >
            📚 Upload Documents
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Main app router component
const AppRouter: React.FC = () => {
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const { isConnected } = useOllama();

  // Handle launch screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLaunchScreen(false);
    }, 3000); // Show launch screen for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (showLaunchScreen) {
    return <LaunchScreen onComplete={() => setShowLaunchScreen(false)} />;
  }

  return (
    <OptimizedAnimationProvider>
      <Router>
        <ErrorBoundary>
          <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
            {/* Mystical Background Layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent"></div>

            {/* Floating Mystical Orbs */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 left-10 w-2 h-2 bg-purple-400/30 rounded-full animate-float"></div>
              <div className="absolute top-40 right-20 w-3 h-3 bg-pink-400/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-cyan-400/30 rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
              <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-yellow-400/30 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/3 right-10 w-2 h-2 bg-green-400/30 rounded-full animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
              <Routes>
                {/* Dashboard - Main landing page */}
                <Route path="/" element={<Dashboard />} />
                
                {/* Library - File management */}
                <Route path="/library" element={<Library />} />
                
                {/* Study Assistant - Q&A with documents */}
                <Route 
                  path="/assistant" 
                  element={
                    <ProtectedRoute 
                      requiresFiles={true}
                      fallbackPath="/library"
                      fallbackMessage="Upload some documents first to ask questions!"
                    >
                      <StudyAssistant />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Calendar - Assignment tracking */}
                <Route path="/calendar" element={<Calendar />} />
                
                {/* Settings - App configuration */}
                <Route path="/settings" element={<Settings />} />
                
                {/* Legacy phase routes - redirect to new structure */}
                <Route path="/upload" element={<Navigate to="/library" replace />} />
                <Route path="/summary" element={<Navigate to="/assistant" replace />} />
                
                {/* 404 - Redirect to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>

            {/* Ollama Connection Status */}
            {!isConnected && (
              <div className="fixed bottom-4 right-4 bg-gradient-to-r from-amber-900/80 to-orange-900/80 backdrop-blur-sm border border-amber-500/50 rounded-xl p-4 animate-pulse z-50">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
                  <div className="text-center">
                    <p className="text-amber-200 font-mystic text-sm">✨ Ollama Disconnected</p>
                    <p className="text-amber-300/80 text-xs font-arcane">Start Ollama for full features</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ErrorBoundary>
      </Router>
    </OptimizedAnimationProvider>
  );
};

export default AppRouter;
