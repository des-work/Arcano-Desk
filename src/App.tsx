import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
// import { PixelArtUploadModal } from './components/PixelArtUploadModal';
// import { EnhancedCharacterScene } from './components/EnhancedCharacterScene';

function AppContent() {
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'upload' | 'library' | 'summary'>('welcome');
  const [aiStatus, setAiStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [showPixelArtUpload, setShowPixelArtUpload] = useState(false);

  // Simulate AI connection
  useEffect(() => {
    setAiStatus('connecting');
    const timer = setTimeout(() => {
      setAiStatus('connected');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle phase changes
  const handlePhaseChange = (phase: 'welcome' | 'upload' | 'library' | 'summary') => {
    setCurrentPhase(phase);
  };

  return (
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

      {/* Magical Effects - Temporarily disabled */}

        {/* Launch Screen */}
        {showLaunchScreen && (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className="text-6xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-4">
              🧙‍♂️ Arcano Desk
            </h1>
            <p className="text-2xl text-purple-200/80 font-arcane mb-8">
              Loading your magical study companion...
            </p>
            <button
              onClick={() => setShowLaunchScreen(false)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            >
              Enter the Realm
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!showLaunchScreen && (
        <div className="relative w-full h-full">
          {/* Phase Navigation - Moved to bottom right */}
          <div className="absolute bottom-4 right-4 z-20">
            <div className="flex space-x-2 bg-black/80 backdrop-blur-sm rounded-full p-2 border border-purple-500/30">
              {/* AI Status Indicator */}
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-black/30 border border-cyan-500/30">
                <div className={`w-2 h-2 rounded-full ${
                  aiStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                  aiStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                  'bg-red-400'
                }`}></div>
                <span className="text-xs text-cyan-300 font-arcane">
                  {aiStatus === 'connected' ? 'AI Ready' :
                   aiStatus === 'connecting' ? 'Connecting...' :
                   'AI Offline'}
                </span>
              </div>
              {(['upload', 'library', 'summary'] as const).map((phase) => (
                <button
                  key={phase}
                  onClick={() => handlePhaseChange(phase)}
                  className={`px-4 py-2 rounded-full text-sm font-wizard transition-all duration-300 ${
                    currentPhase === phase
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'text-purple-300 hover:text-white hover:bg-purple-500/30'
                  }`}
                >
                  {phase === 'upload' && '📁 Upload'}
                  {phase === 'library' && '📚 Library'}
                  {phase === 'summary' && '✨ Summary'}
                </button>
              ))}
              
              {/* Pixel Art Upload Button */}
              <button
                onClick={() => setShowPixelArtUpload(!showPixelArtUpload)}
                className="px-4 py-2 rounded-full text-sm font-wizard transition-all duration-300 text-cyan-300 hover:text-white hover:bg-cyan-500/30"
              >
                🎨 Pixel Art
              </button>
            </div>
          </div>

          {/* Character Scene Display - Black Screen */}
          <div className="absolute top-20 left-4 right-4 z-20">
            <div className="relative w-full h-80 overflow-hidden rounded-lg bg-black border-2 border-purple-500/30 shadow-2xl">
              {/* Scene Title */}
              <div className="absolute top-2 left-2 bg-purple-900/80 backdrop-blur-sm rounded px-2 py-1 text-purple-200 text-xs font-mono border border-purple-500/30">
                Pixel Art Scene
              </div>
              {/* Black background for pixel art to pop */}
              <div className="absolute inset-0 bg-black">
                {/* Zone Markers - Subtle in black background */}
                <div className="absolute w-16 h-16 border border-purple-400/20 rounded-lg bg-purple-500/5" style={{ left: 68, top: 100 }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-400/60 font-wizard whitespace-nowrap">
                    {currentPhase === 'welcome' && 'Entrance'}
                    {currentPhase === 'upload' && 'Preparation'}
                    {currentPhase === 'library' && 'Studying'}
                    {currentPhase === 'summary' && 'Gathering'}
                  </div>
                </div>
                
                <div className="absolute w-16 h-16 border border-purple-400/20 rounded-lg bg-purple-500/5" style={{ left: 168, top: 100 }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-400/60 font-wizard whitespace-nowrap">
                    {currentPhase === 'welcome' && 'Greeting'}
                    {currentPhase === 'upload' && 'Scanning'}
                    {currentPhase === 'library' && 'Thinking'}
                    {currentPhase === 'summary' && 'Synthesizing'}
                  </div>
                </div>
                
                <div className="absolute w-16 h-16 border border-purple-400/20 rounded-lg bg-purple-500/5" style={{ left: 268, top: 100 }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-400/60 font-wizard whitespace-nowrap">
                    {currentPhase === 'welcome' && 'Explanation'}
                    {currentPhase === 'upload' && 'Processing'}
                    {currentPhase === 'library' && 'Organizing'}
                    {currentPhase === 'summary' && 'Polishing'}
                  </div>
                </div>
                
                <div className="absolute w-16 h-16 border border-purple-400/20 rounded-lg bg-purple-500/5" style={{ left: 368, top: 100 }}>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-400/60 font-wizard whitespace-nowrap">
                    {currentPhase === 'welcome' && 'Invitation'}
                    {currentPhase === 'upload' && 'Completion'}
                    {currentPhase === 'library' && 'Insights'}
                    {currentPhase === 'summary' && 'Presentation'}
                  </div>
                </div>

                {/* Enhanced Animated Wizard - Larger for black background */}
                <motion.div
                  className="absolute text-8xl"
                  style={{ left: 100, top: 120 }}
                  animate={{
                    x: [0, 100, 200, 300, 0],
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🧙‍♂️
                </motion.div>

                {/* Enhanced Magical Effects - More visible on black */}
                <motion.div
                  className="absolute w-40 h-40 border-2 border-yellow-400/60 rounded-full"
                  style={{ left: 60, top: 100 }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.8, 0.4],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Particle Effects - More visible on black */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                      style={{
                        left: 100 + (i * 25) - 100,
                        top: 120 + (i * 15) - 60,
                      }}
                      animate={{
                        y: [0, -60, -120],
                        opacity: [1, 0.6, 0],
                        scale: [0.5, 1.2, 0],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        delay: i * 0.3,
                        ease: "easeOut",
                      }}
                    />
                  ))}
                </div>

                {/* Progress Indicator - Top right */}
                <div className="absolute top-4 right-4 bg-purple-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-purple-200 text-xs font-mono border border-purple-500/30">
                  Phase: {currentPhase}
                </div>
              </div>
            </div>
          </div>

          {/* Scene Info Panel - Moved away from black screen */}
          <div className="absolute top-4 left-4 z-30 max-w-sm">
            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
              <div className="text-purple-200 font-wizard text-sm leading-relaxed">
                {currentPhase === 'welcome' && 'The wizard materializes and begins to explain the magical study system...'}
                {currentPhase === 'upload' && 'The wizard prepares to scan and process your documents with magical precision...'}
                {currentPhase === 'library' && 'The wizard studies your documents carefully, gaining new insights...'}
                {currentPhase === 'summary' && 'The wizard synthesizes all knowledge into a magical summary...'}
              </div>
            </div>
          </div>

          {/* Pixel Art Upload Area - Separate from scene */}
          {showPixelArtUpload && (
            <div className="absolute top-4 right-4 z-30 max-w-sm">
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-cyan-200 font-wizard text-sm">🎨 Pixel Art Upload</h3>
                  <button
                    onClick={() => setShowPixelArtUpload(false)}
                    className="text-cyan-400 hover:text-cyan-300 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="border border-cyan-400/30 rounded p-2 text-center">
                    <div className="text-cyan-300 text-xs mb-1">Upload 16x16 pixel art</div>
                    <input
                      type="file"
                      accept="image/*"
                      className="text-xs text-cyan-200"
                      onChange={(e) => {
                        console.log('File selected:', e.target.files?.[0]);
                      }}
                    />
                  </div>
                  <div className="text-cyan-400/70 text-xs">
                    PNG recommended for transparency
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main Content - Moved down to avoid overlap */}
          <div className="relative z-10 min-h-screen flex items-center justify-center p-8 pt-96">
        {currentPhase === 'welcome' && (
          <div className="text-center max-w-4xl">
            <div className="mb-8">
              <h1 className="text-6xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-4">
                🧙‍♂️ Arcano Desk
              </h1>
              <p className="text-2xl text-purple-200/80 font-arcane mb-8">
                Your Magical Study Companion
              </p>
              <p className="text-lg text-purple-300/70 font-arcane max-w-2xl mx-auto">
                Transform your documents into magical study materials with the power of AI. 
                Upload your files and let the wizard help you learn!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-wizard text-purple-200 mb-2">Document Processing</h3>
                <p className="text-purple-300/70 text-sm">Upload PDFs, Word docs, and more for AI analysis</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-800/30 to-blue-800/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
                <div className="text-4xl mb-4">🤖</div>
                <h3 className="text-xl font-wizard text-cyan-200 mb-2">AI Assistant</h3>
                <p className="text-cyan-300/70 text-sm">Get summaries, Q&A, and study materials</p>
              </div>
              <div className="bg-gradient-to-br from-pink-800/30 to-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-wizard text-pink-200 mb-2">Magical Experience</h3>
                <p className="text-pink-300/70 text-sm">Beautiful animations and wizard interactions</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentPhase('upload')}
              className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard text-xl rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 transform hover:scale-105"
            >
              🚀 Start Your Magical Journey
            </button>
          </div>
        )}

        {currentPhase === 'upload' && (
          <div className="text-center max-w-2xl">
            <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-8">
              📁 Upload Your Documents
            </h2>
            <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 mb-8">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-purple-200/80 font-arcane mb-6">
                Drag and drop your files here or click to browse
              </p>
              <div className="border-2 border-dashed border-purple-400/50 rounded-lg p-8 hover:border-purple-400/80 transition-colors cursor-pointer">
                <p className="text-purple-300/70">Supported formats: PDF, DOCX, TXT</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentPhase('library')}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-wizard rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/30"
            >
              Continue to Library
            </button>
          </div>
        )}

            {currentPhase === 'library' && (
          <div className="text-center max-w-4xl">
            <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-8">
              📚 Your Magical Library
            </h2>
            <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 mb-8">
              <div className="text-6xl mb-4">📖</div>
              <p className="text-purple-200/80 font-arcane mb-6">
                Your documents are being processed by the wizard...
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-green-800/30 to-emerald-800/30 rounded-lg p-4 border border-green-500/20">
                  <h4 className="font-wizard text-green-200 mb-2">✅ Document 1</h4>
                  <p className="text-green-300/70 text-sm">Ready for analysis</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-800/30 to-orange-800/30 rounded-lg p-4 border border-yellow-500/20">
                  <h4 className="font-wizard text-yellow-200 mb-2">⏳ Document 2</h4>
                  <p className="text-yellow-300/70 text-sm">Processing...</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setCurrentPhase('summary')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-wizard rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
            >
              Generate Summary
            </button>
          </div>
        )}

            {currentPhase === 'summary' && (
          <div className="text-center max-w-4xl">
            <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-8">
              ✨ AI Summary Generated
                  </h2>
            <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-purple-200/80 font-arcane mb-6">
                The wizard has analyzed your documents and created a magical summary!
              </p>
              <div className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 rounded-lg p-6 border border-indigo-500/20 text-left">
                <h4 className="font-wizard text-indigo-200 mb-4">📋 Summary Preview:</h4>
                <p className="text-indigo-300/80 text-sm leading-relaxed">
                  This is a placeholder summary that would be generated by the AI wizard. 
                  In the full version, this would contain actual analysis of your uploaded documents, 
                  including key concepts, important points, and study recommendations.
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setCurrentPhase('library')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-wizard rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
                Ask Questions
              </button>
                  <button
                onClick={() => setCurrentPhase('welcome')}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
                  >
                Start Over
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* RPG Cutscene - Temporarily disabled */}
      {/* {showCutscene && (
        <RPGCutscene
          sequence={CUTSCENE_SEQUENCES[currentPhase]}
          onComplete={handleCutsceneComplete}
        />
      )} */}

      {/* Pixel Art Upload Modal - Temporarily disabled */}
      {/* <PixelArtUploadModal
        isOpen={showPixelArtUpload}
        onClose={() => setShowPixelArtUpload(false)}
        onSpriteUploaded={(sprite) => {
          console.log('Sprite uploaded:', sprite);
        }}
      /> */}

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
  );
}

function App() {
  return <AppContent />;
}

export default App;