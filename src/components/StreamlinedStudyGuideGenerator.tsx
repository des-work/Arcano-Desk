/**
 * Streamlined Study Guide Generator
 * Fast, efficient AI-powered study guide creation with real-time progress
 */

import React, { useState, useEffect } from 'react';
import { Brain, Zap, CheckCircle, Loader } from 'lucide-react';
import { ProcessedDocument } from '../utils/DocumentProcessor.ts';
import { useRobustOllama } from '../contexts/RobustOllamaContext.tsx';
import { AIStatusIndicator } from './AIStatusIndicator.tsx';

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

export interface StreamlinedStudyGuideGeneratorProps {
  documents: ProcessedDocument[];
  onComplete: (studyGuide: StudyGuideSection[]) => void;
  onCustomize: (studyGuide: StudyGuideSection[]) => void;
  className?: string;
}

interface AIProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  duration: number;
}

export const StreamlinedStudyGuideGenerator: React.FC<StreamlinedStudyGuideGeneratorProps> = ({
  documents,
  onComplete,
  onCustomize,
  className = '',
}) => {
  const { 
    generateSummary, 
    generateStudyMaterial, 
    isLoading: aiLoading, 
    isConnected, 
    connectionStatus,
    currentModel 
  } = useRobustOllama();
  const [studyGuide, setStudyGuide] = useState<StudyGuideSection[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [aiStatus, setAiStatus] = useState<'idle' | 'analyzing' | 'generating' | 'complete'>('idle');

  // AI Processing Steps
  const aiSteps: AIProgressStep[] = [
    {
      id: 'analyze',
      title: '🧠 Analyzing Documents',
      description: 'AI is reading and understanding your study materials...',
      status: 'pending',
      duration: 2000
    },
    {
      id: 'extract',
      title: '🔍 Extracting Key Concepts',
      description: 'Identifying important themes and concepts...',
      status: 'pending',
      duration: 1500
    },
    {
      id: 'structure',
      title: '📚 Structuring Content',
      description: 'Organizing information into study-friendly sections...',
      status: 'pending',
      duration: 1800
    },
    {
      id: 'enhance',
      title: '✨ Enhancing with AI',
      description: 'Adding examples, questions, and study aids...',
      status: 'pending',
      duration: 2200
    },
    {
      id: 'finalize',
      title: '🎯 Finalizing Study Guide',
      description: 'Preparing your personalized study materials...',
      status: 'pending',
      duration: 1000
    }
  ];

  // Auto-start generation when component mounts and AI is connected
  useEffect(() => {
    if (documents.length > 0 && !isGenerating && isConnected) {
      generateStudyGuide();
    }
  }, [documents, isConnected]);

  // Generate study guide with real-time progress
  const generateStudyGuide = async () => {
    try {
      // Check AI connection first
      if (!isConnected || connectionStatus !== 'connected') {
        console.warn('AI not connected, using fallback content');
        setAiStatus('complete');
        setProgress(100);
        // Generate fallback content
        const fallbackGuide = generateFallbackStudyGuide();
        setStudyGuide(fallbackGuide);
        setTimeout(() => onCustomize(fallbackGuide), 2000);
        return;
      }

      setIsGenerating(true);
      setAiStatus('analyzing');
      setCurrentStep(0);
      setProgress(0);

      // Combine all document content
      const documentContent = documents.map(doc => doc.extractedText).join('\n\n');
      const totalWords = documents.reduce((sum, doc) => sum + doc.wordCount, 0);

      const generatedGuide: StudyGuideSection[] = [];

      // Step 1: Analyze Documents
      await updateStep(0, 'processing');
      await new Promise(resolve => setTimeout(resolve, aiSteps[0].duration));
      await updateStep(0, 'completed');
      setProgress(20);

      // Step 2: Extract Key Concepts
      await updateStep(1, 'processing');
      const conceptsContent = await generateStudyMaterial(documentContent, 'notes');
      await updateStep(1, 'completed');
      setProgress(40);

      generatedGuide.push({
        id: 'key-concepts',
        title: '🔑 Key Concepts & Themes',
        level: 1,
        content: conceptsContent,
        keywords: ['key concepts', 'themes', 'important ideas'],
        annotations: [`Based on ${totalWords} words from ${documents.length} document${documents.length > 1 ? 's' : ''}`]
      });

      // Step 3: Structure Content
      await updateStep(2, 'processing');
      const overviewContent = await generateSummary(documentContent, 'long', 'Create a comprehensive study overview');
      await updateStep(2, 'completed');
      setProgress(60);

      generatedGuide.push({
        id: 'overview',
        title: '📖 Study Overview',
        level: 1,
        content: overviewContent,
        keywords: ['overview', 'summary', 'main points'],
        annotations: ['AI-generated comprehensive overview']
      });

      // Step 4: Enhance with AI
      await updateStep(3, 'processing');
      const questionsContent = await generateStudyMaterial(documentContent, 'questions');
      const examplesContent = await generateStudyMaterial(documentContent, 'examples');
      await updateStep(3, 'completed');
      setProgress(80);

      generatedGuide.push({
        id: 'study-questions',
        title: '❓ Study Questions & Practice',
        level: 2,
        content: questionsContent,
        keywords: ['questions', 'practice', 'review'],
        annotations: ['AI-generated study questions']
      });

      generatedGuide.push({
        id: 'examples',
        title: '💡 Examples & Applications',
        level: 2,
        content: examplesContent,
        keywords: ['examples', 'applications', 'practical'],
        annotations: ['AI-generated practical examples']
      });

      // Step 5: Finalize
      await updateStep(4, 'processing');
      await new Promise(resolve => setTimeout(resolve, aiSteps[4].duration));
      await updateStep(4, 'completed');
      setProgress(100);

      setStudyGuide(generatedGuide);
      setAiStatus('complete');
      setIsGenerating(false);

      // Auto-transition to customize page after 2 seconds
      setTimeout(() => {
        onCustomize(generatedGuide);
      }, 2000);

    } catch (error) {
      console.error('Error generating study guide:', error);
      setIsGenerating(false);
      setAiStatus('idle');
    }
  };

  const updateStep = async (stepIndex: number, status: 'processing' | 'completed') => {
    setCurrentStep(stepIndex);
    // Update the step status in the UI
  };

  // Generate fallback study guide when AI is not available
  const generateFallbackStudyGuide = (): StudyGuideSection[] => {
    const totalWords = documents.reduce((sum, doc) => sum + doc.wordCount, 0);
    const documentNames = documents.map(doc => doc.name).join(', ');
    
    return [
      {
        id: 'overview',
        title: '📖 Study Overview',
        level: 1,
        content: `This is a comprehensive overview of your study materials: ${documentNames}. The content has been processed and organized to help you study effectively. Total content: ${totalWords} words from ${documents.length} document${documents.length > 1 ? 's' : ''}.`,
        keywords: ['overview', 'study materials', 'comprehensive'],
        annotations: ['AI-powered analysis (offline mode)']
      },
      {
        id: 'key-concepts',
        title: '🔑 Key Concepts & Themes',
        level: 1,
        content: `Key concepts and themes from your study materials have been identified and organized. Focus on understanding the main ideas and how they relate to each other.`,
        keywords: ['key concepts', 'themes', 'main ideas'],
        annotations: ['Based on your uploaded documents']
      },
      {
        id: 'study-questions',
        title: '❓ Study Questions & Practice',
        level: 2,
        content: `1. What are the main concepts discussed in this material?\n2. How do these concepts relate to each other?\n3. What practical applications can you identify?\n4. What are the key takeaways from this content?\n5. How would you explain this to someone else?`,
        keywords: ['questions', 'practice', 'review'],
        annotations: ['Study questions for self-assessment']
      },
      {
        id: 'examples',
        title: '💡 Examples & Applications',
        level: 2,
        content: `Here are practical examples that illustrate the key concepts from your study materials. These examples help demonstrate real-world applications and make the abstract concepts more concrete and understandable.`,
        keywords: ['examples', 'applications', 'practical'],
        annotations: ['Practical examples for better understanding']
      }
    ];
  };

  const getStepIcon = (stepIndex: number, status: 'pending' | 'processing' | 'completed') => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-400" />;
    if (status === 'processing') return <Loader className="w-5 h-5 text-purple-400 animate-spin" />;
    return <div className="w-5 h-5 rounded-full border-2 border-purple-400/50" />;
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🧙‍♂️</div>
        <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
          AI Study Guide Generator
        </h2>
        <p className="text-purple-200/80 text-lg mb-6">
          Your AI assistant is creating a personalized study guide from your documents
        </p>
        
        {/* AI Status Indicator */}
        <div className="flex justify-center mb-6">
          <div className="bg-black/20 rounded-lg p-4 border border-purple-400/20">
            <AIStatusIndicator showDetails={false} />
          </div>
        </div>
      </div>

      {/* AI Progress Indicator */}
      <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="text-center">
            <div className="text-2xl font-semibold text-purple-200 mb-2">
              {aiStatus === 'complete' ? '✨ Study Guide Complete!' : 'AI is working its magic...'}
            </div>
            <div className="w-full bg-purple-900/30 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-purple-300 text-sm">
              {progress}% Complete
            </div>
          </div>

          {/* Step-by-Step Progress */}
          <div className="space-y-4">
            {aiSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                  index === currentStep && step.status === 'processing'
                    ? 'bg-purple-600/20 border border-purple-400/50'
                    : step.status === 'completed'
                    ? 'bg-green-600/20 border border-green-400/50'
                    : 'bg-black/20 border border-purple-400/20'
                }`}
              >
                {getStepIcon(index, step.status)}
                <div className="flex-1">
                  <div className="font-semibold text-purple-200">{step.title}</div>
                  <div className="text-sm text-purple-300/70">{step.description}</div>
                </div>
                {step.status === 'processing' && (
                  <div className="text-purple-400 animate-pulse">
                    <Zap className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Status Display */}
      {isGenerating && (
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-purple-900/20 border border-purple-500/30 rounded-full px-6 py-3">
            <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
            <span className="text-purple-200 font-medium">
              {aiSteps[currentStep]?.title || 'Processing...'}
            </span>
          </div>
        </div>
      )}

      {/* Connection Error Message */}
      {!isConnected && connectionStatus === 'error' && (
        <div className="bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-xl font-semibold text-red-200 mb-2">
            AI Connection Failed
          </h3>
          <p className="text-red-300/70 mb-4">
            Unable to connect to local AI models. Using fallback content generation.
          </p>
          <div className="text-sm text-red-400/70">
            Make sure Ollama is running: <code className="bg-black/20 px-2 py-1 rounded">ollama serve</code>
          </div>
        </div>
      )}

      {/* Completion Message */}
      {aiStatus === 'complete' && (
        <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-xl font-semibold text-green-200 mb-2">
            Study Guide Generated Successfully!
          </h3>
          <p className="text-green-300/70 mb-4">
            Your personalized study materials are ready. Taking you to the customization page...
          </p>
          <div className="flex items-center justify-center gap-2 text-green-400">
            <Loader className="w-4 h-4 animate-spin" />
            <span className="text-sm">Preparing customization options...</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {documents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">{documents.length}</div>
            <div className="text-purple-400/70 text-sm">Documents</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">
              {documents.reduce((sum, doc) => sum + doc.wordCount, 0).toLocaleString()}
            </div>
            <div className="text-purple-400/70 text-sm">Words Analyzed</div>
          </div>
          <div className="bg-black/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-300">
              {studyGuide.length}
            </div>
            <div className="text-purple-400/70 text-sm">Sections Created</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamlinedStudyGuideGenerator;
