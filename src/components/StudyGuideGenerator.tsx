/**
 * Study Guide Generator Component
 * AI-powered study guide creation with clean formatting and annotations
 */

import React, { useState } from 'react';
import { BookOpen, Download, Share2, Settings, Eye, Edit3, Save, RefreshCw } from 'lucide-react';

export interface StudyGuideSettings {
  format: 'outline' | 'detailed' | 'summary' | 'flashcards';
  highlightKeywords: boolean;
  boldHeadings: boolean;
  textSizeVariation: boolean;
  includeExamples: boolean;
  includeQuestions: boolean;
  annotationLevel: 'minimal' | 'moderate' | 'comprehensive';
  colorScheme: 'default' | 'academic' | 'colorful' | 'minimal';
}

export interface StudyGuideSection {
  id: string;
  title: string;
  level: 1 | 2 | 3 | 4;
  content: string;
  keywords: string[];
  examples?: string[];
  questions?: string[];
  annotations?: string[];
}

export interface StudyGuideGeneratorProps {
  documents: any[];
  onGenerate?: (studyGuide: StudyGuideSection[]) => void;
  className?: string;
}

const DEFAULT_SETTINGS: StudyGuideSettings = {
  format: 'detailed',
  highlightKeywords: true,
  boldHeadings: true,
  textSizeVariation: true,
  includeExamples: true,
  includeQuestions: true,
  annotationLevel: 'moderate',
  colorScheme: 'academic',
};

export const StudyGuideGenerator: React.FC<StudyGuideGeneratorProps> = ({
  documents,
  onGenerate,
  className = '',
}) => {
  const [settings, setSettings] = useState<StudyGuideSettings>(DEFAULT_SETTINGS);
  const [studyGuide, setStudyGuide] = useState<StudyGuideSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit');

  // Generate study guide based on settings
  const generateStudyGuide = async () => {
    try {
      setIsGenerating(true);
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate sample study guide based on settings
      const generatedGuide: StudyGuideSection[] = [
        {
          id: 'intro',
          title: 'Introduction to Machine Learning',
          level: 1,
          content: 'Machine Learning is a subset of artificial intelligence that focuses on algorithms and statistical models that enable computer systems to improve their performance on a specific task through experience.',
          keywords: ['Machine Learning', 'AI', 'algorithms', 'statistical models', 'computer systems'],
          examples: ['Email spam detection', 'Image recognition', 'Recommendation systems'],
          questions: ['What is the difference between AI and Machine Learning?', 'How do algorithms learn from data?'],
          annotations: ['Key concept that forms the foundation of modern AI systems']
        },
        {
          id: 'types',
          title: 'Types of Machine Learning',
          level: 2,
          content: 'There are three main types of machine learning: supervised learning, unsupervised learning, and reinforcement learning.',
          keywords: ['supervised learning', 'unsupervised learning', 'reinforcement learning'],
          examples: ['Classification problems (supervised)', 'Clustering data (unsupervised)', 'Game playing (reinforcement)'],
          questions: ['When would you use supervised vs unsupervised learning?', 'What are the advantages of reinforcement learning?'],
          annotations: ['Understanding these types helps in choosing the right approach for different problems']
        },
        {
          id: 'supervised',
          title: 'Supervised Learning',
          level: 3,
          content: 'Supervised learning uses labeled training data to learn a mapping function from inputs to outputs. The algorithm learns from examples where the correct answer is provided.',
          keywords: ['labeled training data', 'mapping function', 'inputs to outputs', 'correct answer'],
          examples: ['Predicting house prices', 'Classifying emails as spam/not spam', 'Recognizing handwritten digits'],
          questions: ['What makes training data "labeled"?', 'How does the algorithm know if its predictions are correct?'],
          annotations: ['Most common type of ML, used when you have historical data with known outcomes']
        }
      ];
      
      setStudyGuide(generatedGuide);
      setIsGenerating(false);
      
      if (onGenerate) {
        onGenerate(generatedGuide);
      }
    } catch (error) {
      console.error('Error generating study guide:', error);
      setIsGenerating(false);
      // You could add a toast notification here to show the error to the user
    }
  };

  // Get text size class based on level and settings
  const getTextSizeClass = (level: number) => {
    if (!settings.textSizeVariation) return 'text-base';
    
    switch (level) {
      case 1: return 'text-3xl font-bold';
      case 2: return 'text-2xl font-semibold';
      case 3: return 'text-xl font-medium';
      case 4: return 'text-lg font-medium';
      default: return 'text-base';
    }
  };

  // Get color scheme classes
  const getColorScheme = () => {
    switch (settings.colorScheme) {
      case 'academic':
        return {
          heading: 'text-blue-900',
          content: 'text-gray-800',
          keyword: 'bg-yellow-200 text-yellow-900',
          example: 'bg-green-50 text-green-800 border-l-4 border-green-400',
          question: 'bg-blue-50 text-blue-800 border-l-4 border-blue-400',
          annotation: 'bg-purple-50 text-purple-800 border-l-4 border-purple-400'
        };
      case 'colorful':
        return {
          heading: 'text-purple-700',
          content: 'text-gray-700',
          keyword: 'bg-pink-200 text-pink-900',
          example: 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-400',
          question: 'bg-cyan-50 text-cyan-800 border-l-4 border-cyan-400',
          annotation: 'bg-orange-50 text-orange-800 border-l-4 border-orange-400'
        };
      case 'minimal':
        return {
          heading: 'text-gray-900',
          content: 'text-gray-600',
          keyword: 'bg-gray-100 text-gray-800',
          example: 'bg-gray-50 text-gray-700 border-l-2 border-gray-300',
          question: 'bg-gray-50 text-gray-700 border-l-2 border-gray-300',
          annotation: 'bg-gray-50 text-gray-700 border-l-2 border-gray-300'
        };
      default:
        return {
          heading: 'text-indigo-900',
          content: 'text-gray-800',
          keyword: 'bg-yellow-200 text-yellow-900',
          example: 'bg-green-50 text-green-800 border-l-4 border-green-400',
          question: 'bg-blue-50 text-blue-800 border-l-4 border-blue-400',
          annotation: 'bg-purple-50 text-purple-800 border-l-4 border-purple-400'
        };
    }
  };

  const colors = getColorScheme();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-wizard text-purple-200 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            AI Study Guide Generator
          </h2>
          <p className="text-purple-300/70 text-sm mt-1">
            Create impeccably formatted study guides with AI assistance
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-purple-600/50 hover:bg-purple-500/50 rounded-lg text-purple-200 transition-colors flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          
          <button
            onClick={() => setPreviewMode(previewMode === 'edit' ? 'preview' : 'edit')}
            className="px-4 py-2 bg-cyan-600/50 hover:bg-cyan-500/50 rounded-lg text-cyan-200 transition-colors flex items-center gap-2"
          >
            {previewMode === 'edit' ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
            {previewMode === 'edit' ? 'Preview' : 'Edit'}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30 mb-6">
            <h3 className="text-lg font-wizard text-purple-200 mb-4">Study Guide Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Format Selection */}
              <div>
                <label className="block text-purple-300 text-sm font-medium mb-2">Format</label>
                <select
                  value={settings.format}
                  onChange={(e) => setSettings(prev => ({ ...prev, format: e.target.value as any }))}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-200"
                >
                  <option value="outline">Outline</option>
                  <option value="detailed">Detailed</option>
                  <option value="summary">Summary</option>
                  <option value="flashcards">Flashcards</option>
                </select>
              </div>

              {/* Color Scheme */}
              <div>
                <label className="block text-purple-300 text-sm font-medium mb-2">Color Scheme</label>
                <select
                  value={settings.colorScheme}
                  onChange={(e) => setSettings(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-200"
                >
                  <option value="default">Default</option>
                  <option value="academic">Academic</option>
                  <option value="colorful">Colorful</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              {/* Annotation Level */}
              <div>
                <label className="block text-purple-300 text-sm font-medium mb-2">Annotation Level</label>
                <select
                  value={settings.annotationLevel}
                  onChange={(e) => setSettings(prev => ({ ...prev, annotationLevel: e.target.value as any }))}
                  className="w-full bg-black/50 border border-purple-500/30 rounded-lg px-3 py-2 text-purple-200"
                >
                  <option value="minimal">Minimal</option>
                  <option value="moderate">Moderate</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>

              {/* Toggle Options */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-purple-300 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.highlightKeywords}
                    onChange={(e) => setSettings(prev => ({ ...prev, highlightKeywords: e.target.checked }))}
                    className="rounded border-purple-500/30 bg-black/50 text-purple-500"
                  />
                  Highlight Keywords
                </label>
                
                <label className="flex items-center gap-2 text-purple-300 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.boldHeadings}
                    onChange={(e) => setSettings(prev => ({ ...prev, boldHeadings: e.target.checked }))}
                    className="rounded border-purple-500/30 bg-black/50 text-purple-500"
                  />
                  Bold Headings
                </label>
                
                <label className="flex items-center gap-2 text-purple-300 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.textSizeVariation}
                    onChange={(e) => setSettings(prev => ({ ...prev, textSizeVariation: e.target.checked }))}
                    className="rounded border-purple-500/30 bg-black/50 text-purple-500"
                  />
                  Vary Text Sizes
                </label>
                
                <label className="flex items-center gap-2 text-purple-300 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.includeExamples}
                    onChange={(e) => setSettings(prev => ({ ...prev, includeExamples: e.target.checked }))}
                    className="rounded border-purple-500/30 bg-black/50 text-purple-500"
                  />
                  Include Examples
                </label>
                
                <label className="flex items-center gap-2 text-purple-300 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.includeQuestions}
                    onChange={(e) => setSettings(prev => ({ ...prev, includeQuestions: e.target.checked }))}
                    className="rounded border-purple-500/30 bg-black/50 text-purple-500"
                  />
                  Include Questions
                </label>
              </div>
            </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={generateStudyGuide}
          disabled={isGenerating}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Generating Study Guide...
            </>
          ) : (
            <>
              <BookOpen className="w-5 h-5" />
              Generate Study Guide
            </>
          )}
        </button>
      </div>

      {/* Study Guide Display */}
      {studyGuide.length > 0 && (
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          {/* Study Guide Header */}
          <div className="border-b-2 border-gray-200 pb-4 mb-6">
            <h1 className={`${getTextSizeClass(1)} ${colors.heading} mb-2`}>
              AI-Generated Study Guide
            </h1>
            <p className="text-gray-600">
              Generated with {settings.format} format • {settings.annotationLevel} annotations
            </p>
          </div>

          {/* Study Guide Content */}
          <div className="space-y-6">
            {studyGuide.map((section, index) => (
              <div key={section.id} className="space-y-3">
                {/* Section Title */}
                <h2 className={`${getTextSizeClass(section.level)} ${colors.heading} ${settings.boldHeadings ? 'font-bold' : 'font-semibold'}`}>
                  {section.title}
                </h2>

                {/* Section Content */}
                <p className={`text-base ${colors.content} leading-relaxed`}>
                  {section.content.split(' ').map((word, wordIndex) => {
                    // Clean word for comparison (remove punctuation)
                    const cleanWord = word.replace(/[^\w]/g, '').toLowerCase();
                    const isKeyword = settings.highlightKeywords && section.keywords.some(keyword => 
                      cleanWord === keyword.toLowerCase() || cleanWord.includes(keyword.toLowerCase())
                    );
                    
                    return (
                      <span
                        key={wordIndex}
                        className={isKeyword ? `px-1 rounded ${colors.keyword}` : ''}
                      >
                        {word}{' '}
                      </span>
                    );
                  })}
                </p>

                {/* Examples */}
                {settings.includeExamples && section.examples && section.examples.length > 0 && (
                  <div className={`p-4 rounded ${colors.example}`}>
                    <h4 className="font-semibold mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {section.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-sm">
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Questions */}
                {settings.includeQuestions && section.questions && section.questions.length > 0 && (
                  <div className={`p-4 rounded ${colors.question}`}>
                    <h4 className="font-semibold mb-2">Study Questions:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {section.questions.map((question, questionIndex) => (
                        <li key={questionIndex} className="text-sm">
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Annotations */}
                {section.annotations && section.annotations.length > 0 && (
                  <div className={`p-4 rounded ${colors.annotation}`}>
                    <h4 className="font-semibold mb-2">Annotations:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {section.annotations.map((annotation, annotationIndex) => (
                        <li key={annotationIndex} className="text-sm">
                          {annotation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGuideGenerator;
