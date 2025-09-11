/**
 * Study Guide Display Component
 * Clean, formatted display of AI-generated study guides
 */

import React, { useState } from 'react';
import { BookOpen, Download, Printer, Share2, Edit3, Eye, EyeOff } from 'lucide-react';

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

export interface StudyGuideDisplayProps {
  studyGuide: StudyGuideSection[];
  onEdit?: () => void;
  onExport?: () => void;
  className?: string;
}

export const StudyGuideDisplay: React.FC<StudyGuideDisplayProps> = ({
  studyGuide,
  onEdit,
  onExport,
  className = '',
}) => {
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showExamples, setShowExamples] = useState(true);
  const [showQuestions, setShowQuestions] = useState(true);

  // Get text size class based on level
  const getTextSizeClass = (level: number) => {
    switch (level) {
      case 1: return 'text-4xl font-bold';
      case 2: return 'text-3xl font-bold';
      case 3: return 'text-2xl font-semibold';
      case 4: return 'text-xl font-semibold';
      default: return 'text-lg font-medium';
    }
  };

  // Get indentation based on level
  const getIndentationClass = (level: number) => {
    switch (level) {
      case 1: return 'ml-0';
      case 2: return 'ml-4';
      case 3: return 'ml-8';
      case 4: return 'ml-12';
      default: return 'ml-0';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-wizard text-purple-200 flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            AI Study Guide
          </h2>
          <p className="text-purple-300/70 text-sm mt-1">
            Impeccably formatted and annotated for optimal learning
          </p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowAnnotations(!showAnnotations)}
            className="px-3 py-2 bg-purple-600/50 hover:bg-purple-500/50 rounded-lg text-purple-200 transition-colors flex items-center gap-2 text-sm"
          >
            {showAnnotations ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showAnnotations ? 'Hide' : 'Show'} Annotations
          </button>
          
          <button
            onClick={onEdit}
            className="px-3 py-2 bg-cyan-600/50 hover:bg-cyan-500/50 rounded-lg text-cyan-200 transition-colors flex items-center gap-2 text-sm"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
          
          <button
            onClick={onExport}
            className="px-3 py-2 bg-green-600/50 hover:bg-green-500/50 rounded-lg text-green-200 transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Study Guide Content */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Study Guide Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <h1 className="text-4xl font-bold mb-2">AI-Generated Study Guide</h1>
          <p className="text-purple-100">
            Created with advanced AI analysis • {studyGuide.length} sections • Optimized for learning
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-8">
            {studyGuide.map((section, index) => (
              <div
                key={section.id}
                className={`${getIndentationClass(section.level)}`}
              >
                {/* Section Title */}
                <h2 className={`${getTextSizeClass(section.level)} text-gray-900 mb-4 border-b-2 border-purple-200 pb-2`}>
                  {section.title}
                </h2>

                {/* Section Content */}
                <div className="prose prose-lg max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {section.content.split(' ').map((word, wordIndex) => {
                      const isKeyword = section.keywords.some(keyword => 
                        word.toLowerCase().includes(keyword.toLowerCase())
                      );
                      
                      return (
                        <span
                          key={wordIndex}
                          className={isKeyword ? 'bg-yellow-200 text-yellow-900 px-1 rounded font-semibold' : ''}
                        >
                          {word}{' '}
                        </span>
                      );
                    })}
                  </p>
                </div>

                {/* Examples */}
                {showExamples && section.examples && section.examples.length > 0 && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-4">
                    <h4 className="text-green-800 font-semibold text-lg mb-3 flex items-center gap-2">
                      📚 Examples
                    </h4>
                    <ul className="space-y-2">
                      {section.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="text-green-700 flex items-start gap-2">
                          <span className="text-green-500 font-bold">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Questions */}
                {showQuestions && section.questions && section.questions.length > 0 && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg mb-4">
                    <h4 className="text-blue-800 font-semibold text-lg mb-3 flex items-center gap-2">
                      ❓ Study Questions
                    </h4>
                    <ul className="space-y-2">
                      {section.questions.map((question, questionIndex) => (
                        <li key={questionIndex} className="text-blue-700 flex items-start gap-2">
                          <span className="text-blue-500 font-bold">{questionIndex + 1}.</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Annotations */}
                {showAnnotations && section.annotations && section.annotations.length > 0 && (
                  <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded-r-lg">
                    <h4 className="text-purple-800 font-semibold text-lg mb-3 flex items-center gap-2">
                      💡 AI Annotations
                    </h4>
                    <ul className="space-y-2">
                      {section.annotations.map((annotation, annotationIndex) => (
                        <li key={annotationIndex} className="text-purple-700 flex items-start gap-2">
                          <span className="text-purple-500 font-bold">💡</span>
                          <span className="text-sm">{annotation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-gray-500 text-sm">
                Generated by AI • {new Date().toLocaleDateString()} • {studyGuide.length} sections
              </div>
              
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyGuideDisplay;
