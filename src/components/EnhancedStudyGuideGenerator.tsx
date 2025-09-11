/**
 * Enhanced Study Guide Generator Component
 * Creates comprehensive study guides with user-selected enhancements
 */

import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Printer, Share2, Edit3, Eye, EyeOff, MessageCircle, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useOllama } from '../contexts/OllamaContext';
import { ProcessedDocument, StudyGuideEnhancementOptions, DocumentProcessor } from '../utils/DocumentProcessor';
import { StudyGuideDisplay, StudyGuideSection } from './StudyGuideDisplay';

export interface EnhancedStudyGuideGeneratorProps {
  documents: ProcessedDocument[];
  enhancementOptions: StudyGuideEnhancementOptions;
  onComplete?: (studyGuide: StudyGuideSection[]) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export const EnhancedStudyGuideGenerator: React.FC<EnhancedStudyGuideGeneratorProps> = ({
  documents,
  enhancementOptions,
  onComplete,
  onError,
  className = '',
}) => {
  const { askQuestion, isLoading: aiLoading } = useOllama();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedStudyGuide, setGeneratedStudyGuide] = useState<StudyGuideSection[]>([]);
  const [showStudyGuide, setShowStudyGuide] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (documents.length > 0 && enhancementOptions) {
      generateStudyGuide();
    }
  }, [documents, enhancementOptions]);

  const generateStudyGuide = async () => {
    if (documents.length === 0) return;

    setIsGenerating(true);
    setError(null);
    setGenerationProgress(0);
    setCurrentStep('Analyzing documents...');

    try {
      // Step 1: Analyze documents
      setGenerationProgress(20);
      setCurrentStep('Extracting key concepts and vocabulary...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Generate enhanced content
      setGenerationProgress(40);
      setCurrentStep('Generating enhanced content...');
      
      const enhancedContent = DocumentProcessor.generateEnhancedStudyContent(
        documents,
        enhancementOptions,
        'academic'
      );

      // Step 3: Use AI to generate study guide
      setGenerationProgress(60);
      setCurrentStep('Creating study guide with AI...');
      
      const aiResponse = await askQuestion(
        'Generate a comprehensive study guide based on the following documents and requirements:',
        enhancedContent
      );

      // Step 4: Parse AI response into study guide sections
      setGenerationProgress(80);
      setCurrentStep('Formatting study guide...');
      
      const studyGuide = parseAIResponseToStudyGuide(aiResponse, documents);

      // Step 5: Complete
      setGenerationProgress(100);
      setCurrentStep('Study guide generated successfully!');
      
      setGeneratedStudyGuide(studyGuide);
      setShowStudyGuide(true);
      onComplete?.(studyGuide);

      // Reset after a delay
      setTimeout(() => {
    setIsGenerating(false);
        setGenerationProgress(0);
        setCurrentStep('');
      }, 2000);

    } catch (error) {
      console.error('Error generating study guide:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate study guide');
      onError?.(error instanceof Error ? error : new Error('Unknown error'));
      setIsGenerating(false);
    }
  };

  const parseAIResponseToStudyGuide = (aiResponse: string, documents: ProcessedDocument[]): StudyGuideSection[] => {
    // Parse AI response into structured study guide sections
    // This is a simplified parser - in production you'd want more sophisticated parsing
    
    const sections: StudyGuideSection[] = [];
    const lines = aiResponse.split('\n');
    let currentSection: Partial<StudyGuideSection> = {};
    let sectionId = 1;

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        // Main heading
        if (currentSection.title) {
          sections.push({
            id: `section-${sectionId++}`,
            title: currentSection.title,
            level: 1,
            content: currentSection.content || '',
            keywords: currentSection.keywords || [],
            examples: currentSection.examples || [],
            questions: currentSection.questions || [],
            annotations: currentSection.annotations || [],
          });
        }
        currentSection = {
          title: trimmedLine.substring(2),
          content: '',
          keywords: [],
          examples: [],
          questions: [],
          annotations: [],
        };
      } else if (trimmedLine.startsWith('## ')) {
        // Sub heading
        if (currentSection.title) {
          sections.push({
            id: `section-${sectionId++}`,
            title: currentSection.title,
            level: 2,
            content: currentSection.content || '',
            keywords: currentSection.keywords || [],
            examples: currentSection.examples || [],
            questions: currentSection.questions || [],
            annotations: currentSection.annotations || [],
          });
        }
        currentSection = {
          title: trimmedLine.substring(3),
          content: '',
          keywords: [],
          examples: [],
          questions: [],
          annotations: [],
        };
      } else if (trimmedLine.startsWith('### ')) {
        // Sub-sub heading
        if (currentSection.title) {
          sections.push({
            id: `section-${sectionId++}`,
            title: currentSection.title,
            level: 3,
            content: currentSection.content || '',
            keywords: currentSection.keywords || [],
            examples: currentSection.examples || [],
            questions: currentSection.questions || [],
            annotations: currentSection.annotations || [],
          });
        }
        currentSection = {
          title: trimmedLine.substring(4),
          content: '',
          keywords: [],
          examples: [],
          questions: [],
          annotations: [],
        };
      } else if (trimmedLine.startsWith('**Keywords:**') || trimmedLine.startsWith('Keywords:')) {
        // Extract keywords
        const keywords = trimmedLine.split(':')[1]?.split(',').map(k => k.trim()) || [];
        currentSection.keywords = keywords;
      } else if (trimmedLine.startsWith('**Examples:**') || trimmedLine.startsWith('Examples:')) {
        // Extract examples
        const examples = trimmedLine.split(':')[1]?.split(',').map(e => e.trim()) || [];
        currentSection.examples = examples;
      } else if (trimmedLine.startsWith('**Questions:**') || trimmedLine.startsWith('Questions:')) {
        // Extract questions
        const questions = trimmedLine.split(':')[1]?.split(',').map(q => q.trim()) || [];
        currentSection.questions = questions;
      } else if (trimmedLine.startsWith('**Annotations:**') || trimmedLine.startsWith('Annotations:')) {
        // Extract annotations
        const annotations = trimmedLine.split(':')[1]?.split(',').map(a => a.trim()) || [];
        currentSection.annotations = annotations;
      } else if (trimmedLine && !trimmedLine.startsWith('**') && !trimmedLine.startsWith('#')) {
        // Regular content
        if (currentSection.content) {
          currentSection.content += ' ' + trimmedLine;
        } else {
          currentSection.content = trimmedLine;
        }
      }
    }

    // Add the last section
    if (currentSection.title) {
      sections.push({
        id: `section-${sectionId++}`,
        title: currentSection.title,
        level: 1,
        content: currentSection.content || '',
        keywords: currentSection.keywords || [],
        examples: currentSection.examples || [],
        questions: currentSection.questions || [],
        annotations: currentSection.annotations || [],
      });
    }

    // If no sections were parsed, create a default one
    if (sections.length === 0) {
      sections.push({
        id: 'section-1',
        title: 'Study Guide',
        level: 1,
        content: aiResponse,
        keywords: documents.flatMap(doc => doc.keyConcepts || []).slice(0, 10),
        examples: [],
        questions: [],
        annotations: [],
      });
    }

    return sections;
  };

  if (error) {
        return (
      <div className={`bg-red-900/20 border border-red-500/30 rounded-xl p-6 ${className}`}>
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <h3 className="text-lg font-semibold text-red-200">Error Generating Study Guide</h3>
                </div>
        <p className="text-red-300/70 mb-4">{error}</p>
        <button
          onClick={generateStudyGuide}
          className="px-4 py-2 bg-red-600/50 hover:bg-red-500/50 text-red-200 rounded-lg transition-colors"
        >
          Try Again
        </button>
          </div>
        );
    }

  if (isGenerating) {
    return (
      <div className={`bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 ${className}`}>
        <div className="text-center space-y-6">
          <div className="text-6xl">🧙‍♂️</div>
          <h3 className="text-2xl font-bold text-purple-200">Generating Enhanced Study Guide</h3>
          <p className="text-purple-300/70">{currentStep}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-purple-900/30 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${generationProgress}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-2 text-purple-300">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{generationProgress}% Complete</span>
          </div>
        </div>
      </div>
    );
  }

  if (showStudyGuide && generatedStudyGuide.length > 0) {
  return (
      <div className={className}>
        <StudyGuideDisplay
          studyGuide={generatedStudyGuide}
          onEdit={() => setShowStudyGuide(false)}
          onExport={() => console.log('Exporting enhanced study guide...')}
        />
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 ${className}`}>
      <div className="text-center space-y-4">
        <div className="text-6xl">✨</div>
        <h3 className="text-2xl font-bold text-purple-200">Enhanced Study Guide Generator</h3>
        <p className="text-purple-300/70">
          Ready to generate your enhanced study guide with {documents.length} document(s)
        </p>
        <button
          onClick={generateStudyGuide}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
        >
          Generate Study Guide
        </button>
      </div>
    </div>
  );
};

export default EnhancedStudyGuideGenerator;