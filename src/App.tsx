import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { StudyGuideGenerator } from './components/StudyGuideGenerator.tsx';
import { StudyGuideDisplay } from './components/StudyGuideDisplay.tsx';
import { EnhancedStudyGuideGenerator } from './components/EnhancedStudyGuideGenerator.tsx';
import { EnhancedUploadPhase } from './components/EnhancedUploadPhase.tsx';
import { StreamlinedStudyGuideGenerator } from './components/StreamlinedStudyGuideGenerator.tsx';
import { StudyGuideCustomizer } from './components/StudyGuideCustomizer.tsx';
import { ProcessedDocument } from './utils/DocumentProcessor.ts';
import { OllamaProvider } from './contexts/OllamaContext.tsx';
import { OptimizedOllamaProvider } from './contexts/OptimizedOllamaContext.tsx';
import { RobustOllamaProvider } from './contexts/RobustOllamaContext.tsx';

function AppContent() {
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'upload' | 'library' | 'summary' | 'customize' | 'generating'>('welcome');
  const [aiStatus, setAiStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [studyGuide, setStudyGuide] = useState<any[]>([]);
  const [showStudyGuide, setShowStudyGuide] = useState(false);
  const [showEnhancedStudyGuide, setShowEnhancedStudyGuide] = useState(false);
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [generatedStudyGuide, setGeneratedStudyGuide] = useState<any[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  // Simulate AI connection
  useEffect(() => {
    setAiStatus('connecting');
    const timer = setTimeout(() => {
      setAiStatus('connected');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handlePhaseChange = (phase: 'upload' | 'library' | 'summary') => {
    setCurrentPhase(phase);
  };

  // Handle documents processed from enhanced upload
  const handleDocumentsProcessed = (processedDocs: ProcessedDocument[]) => {
    setDocuments(prev => [...prev, ...processedDocs]);
    setUploadComplete(true);
    
    // Show success animation
    setShowSuccessAnimation(true);
    setTimeout(() => setShowSuccessAnimation(false), 3000);
  };

  // Handle direct summary generation
  const handleGenerateStudyGuide = () => {
    if (documents.length > 0) {
      setCurrentPhase('generating');
    }
  };

  // Handle study guide completion
  const handleStudyGuideComplete = (studyGuide: any[]) => {
    setGeneratedStudyGuide(studyGuide);
    setCurrentPhase('customize');
    setIsCustomizing(true);
  };

  // Handle customization completion
  const handleCustomizationComplete = (finalGuide: any[]) => {
    setStudyGuide(finalGuide);
    setCurrentPhase('summary');
    setIsCustomizing(false);
  };

  // Reset upload state
  const resetUploadState = () => {
    setDocuments([]);
    setUploadComplete(false);
    setShowStudyGuide(false);
    setCurrentPhase('upload');
  };

  if (showLaunchScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl mb-8">🧙‍♂️</div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-4">
            Arcano Desk
          </h1>
          <p className="text-purple-200 text-xl mb-8">
            AI-Powered Study Assistant
          </p>
          <button
            onClick={() => setShowLaunchScreen(false)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          >
            Enter Study Realm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Toaster position="top-right" />

      {/* Success Animation Overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="text-8xl animate-bounce">
            ✨
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧙‍♂️</div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Arcano Desk
            </h1>
          </div>
          
          {/* AI Status */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-cyan-500/30">
            <div className={`w-2 h-2 rounded-full ${
              aiStatus === 'connected' ? 'bg-green-400 animate-pulse' :
              aiStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
              'bg-red-400'
            }`}></div>
            <span className="text-xs text-cyan-300">
              {aiStatus === 'connected' ? 'AI Ready' :
               aiStatus === 'connecting' ? 'Connecting...' :
               'AI Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-purple-500/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-4">
          {(['upload', 'library', 'summary'] as const).map((phase) => (
            <button
              key={phase}
              onClick={() => handlePhaseChange(phase)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                currentPhase === phase
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white hover:bg-purple-500/30'
              }`}
            >
              {phase === 'upload' && '📁 Upload Documents'}
              {phase === 'library' && '📚 Document Library'}
              {phase === 'summary' && '✨ Generate Study Guide'}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Study Guide Button */}
      <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border-b border-green-500/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-center">
          <button
            onClick={() => setShowEnhancedStudyGuide(!showEnhancedStudyGuide)}
            className={`px-8 py-4 rounded-xl font-bold transition-all duration-300 ${
              showEnhancedStudyGuide
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 hover:from-green-500/30 hover:to-emerald-500/30'
            }`}
          >
            ✨ Enhanced Note Generator
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* Streamlined Study Guide Generator */}
        {currentPhase === 'generating' && (
          <div className="mb-8">
            <StreamlinedStudyGuideGenerator
              documents={documents}
              onComplete={handleStudyGuideComplete}
              onCustomize={handleStudyGuideComplete}
            />
          </div>
        )}

        {/* Study Guide Customizer */}
        {currentPhase === 'customize' && isCustomizing && (
          <div className="mb-8">
            <StudyGuideCustomizer
              studyGuide={generatedStudyGuide}
              onCustomize={(guide, settings) => {
                // Update settings in real-time
                console.log('Settings updated:', settings);
              }}
              onGenerate={handleCustomizationComplete}
            />
          </div>
        )}

        {/* Legacy Study Guide Generator */}
        {showStudyGuide && currentPhase === 'summary' && (
          <div className="mb-8">
            <StudyGuideGenerator
              documents={documents}
              onGenerate={(generatedGuide) => {
                setStudyGuide(generatedGuide);
                setShowStudyGuide(false);
              }}
            />
          </div>
        )}

        {/* Enhanced Study Guide Generator */}
        {showEnhancedStudyGuide && (
          <div className="mb-8">
            <EnhancedStudyGuideGenerator
              documents={documents}
              onGenerate={(generatedGuide) => {
                setStudyGuide(generatedGuide);
                setShowEnhancedStudyGuide(false);
              }}
            />
          </div>
        )}

        {/* Study Guide Display */}
        {studyGuide.length > 0 && !showStudyGuide && !showEnhancedStudyGuide && (
          <div className="mb-8">
            <StudyGuideDisplay
              studyGuide={studyGuide}
              onEdit={() => setShowStudyGuide(true)}
              onExport={() => console.log('Exporting study guide...')}
            />
          </div>
        )}

        {/* Phase Content */}
        {currentPhase === 'welcome' && (
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                Welcome to Arcano Desk
              </h2>
              <p className="text-purple-200 text-lg mb-8">
                Your AI-powered study assistant for enhanced note-making and learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="text-4xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-purple-200 mb-2">Upload Documents</h3>
                <p className="text-purple-300/70 text-sm">
                  Upload PDFs, Word docs, and images for AI analysis
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-blue-200 mb-2">Document Library</h3>
                <p className="text-blue-300/70 text-sm">
                  View and manage your uploaded documents
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold text-green-200 mb-2">AI Study Guide</h3>
                <p className="text-green-300/70 text-sm">
                  Generate comprehensive study guides with AI
                </p>
              </div>
            </div>
            
            <button
              onClick={() => handlePhaseChange('upload')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            >
              Start Your Study Journey
            </button>
          </div>
        )}

        {currentPhase === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <EnhancedUploadPhase
              onDocumentsProcessed={handleDocumentsProcessed}
              onGenerateStudyGuide={handleGenerateStudyGuide}
            />
            
            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => handlePhaseChange('library')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
                View Library
              </button>
              {uploadComplete && (
                <button
                  onClick={resetUploadState}
                  className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
                >
                  Upload More Files
                </button>
              )}
            </div>
          </div>
        )}

        {currentPhase === 'library' && (
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-8">
              📚 Document Library
            </h2>
            
            <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 backdrop-blur-sm rounded-xl p-8 border border-blue-500/20 mb-8">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-blue-200/80 text-lg mb-6">
                Your uploaded documents and study materials
              </p>
              
              {documents.length === 0 ? (
                <div className="text-blue-300/70">
                  <p className="text-lg mb-4">No documents uploaded yet</p>
                  <p className="text-sm">Upload some documents to get started!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div key={doc.id} className="bg-black/20 rounded-lg p-4 text-left">
                      <h3 className="text-blue-200 font-semibold mb-2">{doc.name}</h3>
                      <p className="text-blue-300/70 text-sm mb-2">
                        Type: {doc.type} • Size: {(doc.metadata.size / 1024).toFixed(1)} KB • Words: {doc.wordCount}
                      </p>
                      <p className="text-blue-400/70 text-xs mb-3">
                        Uploaded: {doc.metadata.uploadDate.toLocaleDateString()}
                      </p>
                      <div className="text-blue-200/80 text-xs mb-3">
                        <p className="line-clamp-3">{doc.extractedText.substring(0, 150)}...</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowStudyGuide(true);
                        }}
                        className="w-full px-3 py-2 bg-blue-600/50 hover:bg-blue-500/50 text-blue-200 text-sm rounded-lg transition-colors"
                      >
                        Generate Study Guide
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePhaseChange('upload')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
              >
                Upload More
              </button>
              <button
                onClick={() => handlePhaseChange('summary')}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
              >
                Generate Study Guide
              </button>
            </div>
          </div>
        )}

        {currentPhase === 'summary' && (
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-8">
              ✨ AI Study Guide Generator
            </h2>
            
            <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 backdrop-blur-sm rounded-xl p-8 border border-green-500/20 mb-8">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-green-200/80 text-lg mb-6">
                Generate comprehensive study guides with AI assistance
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-purple-800/30 to-pink-800/30 rounded-lg p-4 border border-purple-500/20">
                  <h4 className="font-semibold text-purple-200 mb-2">📚 Smart Formatting</h4>
                  <p className="text-purple-300/70 text-sm">Highlighted keywords, bold headings, annotations</p>
                </div>
                <div className="bg-gradient-to-r from-blue-800/30 to-cyan-800/30 rounded-lg p-4 border border-blue-500/20">
                  <h4 className="font-semibold text-blue-200 mb-2">🎨 Customizable</h4>
                  <p className="text-blue-300/70 text-sm">Multiple formats and color schemes</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowStudyGuide(true)}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
              >
                📚 Generate Study Guide
              </button>
              <button
                onClick={() => handlePhaseChange('library')}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
              >
                View Library
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <OllamaProvider>
      <OptimizedOllamaProvider>
        <RobustOllamaProvider>
          <AppContent />
        </RobustOllamaProvider>
      </OptimizedOllamaProvider>
    </OllamaProvider>
  );
}

export default App;