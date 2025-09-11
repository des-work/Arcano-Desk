/**
 * Document Processing Demo Component
 * Comprehensive demonstration of the enhanced document processing system
 */

import React, { useState } from 'react';
import { BookOpen, FileText, Image, File, Download, Eye, EyeOff, Zap, Brain, Target } from 'lucide-react';
import { DocumentUploadProcessor } from './DocumentUploadProcessor';
import { EnhancedStudyGuideGenerator } from './EnhancedStudyGuideGenerator';
import { ProcessedDocument, StudyGuideEnhancementOptions } from '../utils/DocumentProcessor';

export const DocumentProcessingDemo: React.FC = () => {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [enhancementOptions, setEnhancementOptions] = useState<StudyGuideEnhancementOptions | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [currentView, setCurrentView] = useState<'upload' | 'processing' | 'results'>('upload');

  const handleDocumentsProcessed = (newDocuments: ProcessedDocument[]) => {
    setDocuments(prev => [...prev, ...newDocuments]);
    setCurrentView('processing');
  };

  const handleGenerateStudyGuide = (processedDocs: ProcessedDocument[], options: StudyGuideEnhancementOptions) => {
    setDocuments(processedDocs);
    setEnhancementOptions(options);
    setCurrentView('results');
  };

  const resetDemo = () => {
    setDocuments([]);
    setEnhancementOptions(null);
    setCurrentView('upload');
  };

  if (!showDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto p-8">
          <div className="text-8xl mb-8">🧙‍♂️</div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-6">
            Enhanced Document Processing
          </h1>
          <p className="text-purple-200 text-xl mb-8 leading-relaxed">
            Experience the power of AI-enhanced document processing with real-time analysis, 
            intelligent content extraction, and comprehensive study guide generation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-purple-200 mb-2">Smart Upload</h3>
              <p className="text-purple-300/70 text-sm">
                Drag & drop PDF, Word, Text, and Image files with real-time processing
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-blue-200 mb-2">AI Analysis</h3>
              <p className="text-blue-300/70 text-sm">
                Extract key concepts, vocabulary, and important sections automatically
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-green-200 mb-2">Enhanced Guides</h3>
              <p className="text-green-300/70 text-sm">
                Generate comprehensive study guides with annotations and content
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setShowDemo(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            >
              🚀 Start Demo
            </button>
            
            <div className="text-purple-300/70 text-sm">
              <p>Supported formats: PDF, Word (.doc/.docx), Text (.txt), Images (.png/.jpg/.jpeg/.gif)</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🧙‍♂️</div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Enhanced Document Processing Demo
            </h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={resetDemo}
              className="px-4 py-2 bg-gray-600/50 hover:bg-gray-500/50 text-gray-200 rounded-lg transition-colors text-sm"
            >
              Reset Demo
            </button>
            <button
              onClick={() => setShowDemo(false)}
              className="px-4 py-2 bg-purple-600/50 hover:bg-purple-500/50 text-purple-200 rounded-lg transition-colors text-sm"
            >
              Back to Overview
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-purple-500/10 p-4">
        <div className="max-w-7xl mx-auto flex justify-center gap-4">
          {[
            { id: 'upload', label: '📁 Upload Documents', icon: FileText },
            { id: 'processing', label: '🧠 AI Analysis', icon: Brain },
            { id: 'results', label: '✨ Study Guide', icon: Target },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setCurrentView(id as any)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                currentView === id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white hover:bg-purple-500/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {currentView === 'upload' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                Upload Your Documents
              </h2>
              <p className="text-purple-200/70 text-lg">
                Drag and drop your files to begin the enhanced processing experience
              </p>
            </div>
            
            <DocumentUploadProcessor
              onDocumentsProcessed={handleDocumentsProcessed}
              onGenerateStudyGuide={handleGenerateStudyGuide}
            />
          </div>
        )}

        {currentView === 'processing' && documents.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                Document Analysis Results
              </h2>
              <p className="text-purple-200/70 text-lg">
                Your documents have been analyzed and enhanced with AI insights
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-start gap-3 mb-4">
                    {doc.type.includes('pdf') ? <FileText className="w-6 h-6 text-red-500" /> :
                     doc.type.includes('image') ? <Image className="w-6 h-6 text-green-500" /> :
                     doc.type.includes('word') ? <File className="w-6 h-6 text-blue-500" /> :
                     <File className="w-6 h-6 text-gray-500" />}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-purple-200 truncate">{doc.name}</h3>
                      <p className="text-purple-300/70 text-sm">
                        {doc.type} • {(doc.metadata.size / 1024).toFixed(1)} KB • {doc.wordCount} words
                      </p>
                    </div>
                  </div>
                  
                  {doc.keyConcepts && doc.keyConcepts.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-purple-300 mb-2">Key Concepts:</h4>
                      <div className="flex flex-wrap gap-1">
                        {doc.keyConcepts.slice(0, 5).map((concept, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded-full"
                          >
                            {concept}
                          </span>
                        ))}
                        {doc.keyConcepts.length > 5 && (
                          <span className="px-2 py-1 bg-gray-600/30 text-gray-300 text-xs rounded-full">
                            +{doc.keyConcepts.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {doc.vocabulary && doc.vocabulary.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-purple-300 mb-2">Vocabulary:</h4>
                      <div className="flex flex-wrap gap-1">
                        {doc.vocabulary.slice(0, 3).map((term, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-600/30 text-blue-200 text-xs rounded-full"
                          >
                            {term}
                          </span>
                        ))}
                        {doc.vocabulary.length > 3 && (
                          <span className="px-2 py-1 bg-gray-600/30 text-gray-300 text-xs rounded-full">
                            +{doc.vocabulary.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="text-purple-200/80 text-xs">
                    <p className="line-clamp-3">{doc.extractedText.substring(0, 150)}...</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setCurrentView('results')}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
              >
                ✨ Generate Study Guide
              </button>
            </div>
          </div>
        )}

        {currentView === 'results' && enhancementOptions && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                Enhanced Study Guide
              </h2>
              <p className="text-purple-200/70 text-lg">
                Your personalized study guide with AI-enhanced content and annotations
              </p>
            </div>
            
            <EnhancedStudyGuideGenerator
              documents={documents}
              enhancementOptions={enhancementOptions}
              onComplete={(studyGuide) => {
                console.log('Study guide generated:', studyGuide);
              }}
              onError={(error) => {
                console.error('Study guide generation error:', error);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentProcessingDemo;
