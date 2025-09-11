/**
 * Enhanced Document Upload and Processing Component
 * Handles file uploads with real-time processing and analysis
 */

import React, { useState, useCallback } from 'react';
import { Upload, FileText, Image, File, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { ProcessedDocument, DocumentProcessor, StudyGuideEnhancementOptions } from '../utils/DocumentProcessor';
import { DocumentProcessingProgress, ProcessingStep } from './DocumentProcessingProgress';

export interface DocumentUploadProcessorProps {
  onDocumentsProcessed: (documents: ProcessedDocument[]) => void;
  onGenerateStudyGuide: (documents: ProcessedDocument[], options: StudyGuideEnhancementOptions) => void;
  className?: string;
}

export const DocumentUploadProcessor: React.FC<DocumentUploadProcessorProps> = ({
  onDocumentsProcessed,
  onGenerateStudyGuide,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocuments, setProcessedDocuments] = useState<ProcessedDocument[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const [overallProgress, setOverallProgress] = useState(0);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [enhancementOptions, setEnhancementOptions] = useState<StudyGuideEnhancementOptions>({
    includeAnnotations: true,
    includeContent: true,
    annotationTypes: {
      explanatory: true,
      crossReferences: true,
      historicalContext: true,
      studyTips: true,
      memoryAids: true,
    },
    contentTypes: {
      expandedExplanations: true,
      examples: true,
      caseStudies: true,
      practiceQuestions: true,
      summaries: true,
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setProcessingError(null);
    setOverallProgress(0);
    
    // Initialize processing steps
    const steps: ProcessingStep[] = files.map((file, index) => ({
      id: `file-${index}`,
      name: file.name,
      status: 'pending',
      progress: 0,
    }));
    setProcessingSteps(steps);

    const newDocuments: ProcessedDocument[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const stepId = `file-${i}`;
        
        // Update current step
        setCurrentStep(`Processing ${file.name}...`);
        
        // Update step status to processing
        setProcessingSteps(prev => prev.map(step => 
          step.id === stepId 
            ? { ...step, status: 'processing', progress: 0, message: 'Starting processing...' }
            : step
        ));

        try {
          const processedDoc = await DocumentProcessor.processFile(file);
          newDocuments.push(processedDoc);
          
          // Update step status to completed
          setProcessingSteps(prev => prev.map(step => 
            step.id === stepId 
              ? { ...step, status: 'completed', progress: 100, message: 'Processing complete' }
              : step
          ));
        } catch (fileError) {
          console.error(`Error processing ${file.name}:`, fileError);
          
          // Update step status to error
          setProcessingSteps(prev => prev.map(step => 
            step.id === stepId 
              ? { ...step, status: 'error', message: `Error: ${fileError instanceof Error ? fileError.message : 'Unknown error'}` }
              : step
          ));
        }

        // Update overall progress
        const progress = ((i + 1) / files.length) * 100;
        setOverallProgress(progress);
      }

      setProcessedDocuments(prev => [...prev, ...newDocuments]);
      onDocumentsProcessed(newDocuments);
      setCurrentStep('All documents processed successfully!');
    } catch (error) {
      console.error('Error processing files:', error);
      setProcessingError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('');
      }, 2000);
    }
  };

  const handleGenerateStudyGuide = () => {
    if (processedDocuments.length > 0) {
      onGenerateStudyGuide(processedDocuments, enhancementOptions);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="w-6 h-6 text-red-500" />;
    if (type.includes('image')) return <Image className="w-6 h-6 text-green-500" />;
    if (type.includes('word') || type.includes('document')) return <File className="w-6 h-6 text-blue-500" />;
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Processing Progress */}
      {isProcessing && (
        <DocumentProcessingProgress
          steps={processingSteps}
          currentStep={currentStep}
          overallProgress={overallProgress}
          isProcessing={isProcessing}
          error={processingError}
          className="mb-6"
        />
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-purple-400 bg-purple-50/20'
            : 'border-purple-300 bg-purple-50/10 hover:border-purple-400 hover:bg-purple-50/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          <div className="text-6xl">📁</div>
          <div>
            <h3 className="text-2xl font-bold text-purple-200 mb-2">
              {isProcessing ? 'Processing Documents...' : 'Upload Documents'}
            </h3>
            <p className="text-purple-300/70">
              Drag and drop files here or click to browse
            </p>
            <p className="text-purple-300/50 text-sm mt-2">
              Supports PDF, Word, Text, and Image files
            </p>
          </div>
          
          {isProcessing && (
            <div className="flex items-center justify-center gap-2 text-purple-300">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing content...</span>
            </div>
          )}
        </div>
      </div>

      {/* Processed Documents */}
      {processedDocuments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-purple-200">
              Processed Documents ({processedDocuments.length})
            </h3>
            <button
              onClick={() => setShowAnalysis(!showAnalysis)}
              className="px-3 py-2 bg-purple-600/50 hover:bg-purple-500/50 rounded-lg text-purple-200 transition-colors flex items-center gap-2 text-sm"
            >
              {showAnalysis ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showAnalysis ? 'Hide' : 'Show'} Analysis
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {processedDocuments.map((doc) => (
              <div key={doc.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-purple-500/20">
                <div className="flex items-start gap-3">
                  {getFileIcon(doc.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-purple-200 truncate">{doc.name}</h4>
                    <p className="text-purple-300/70 text-sm">
                      {doc.type} • {formatFileSize(doc.metadata.size)} • {doc.wordCount} words
                    </p>
                    <p className="text-purple-300/50 text-xs mt-1">
                      Uploaded: {doc.metadata.uploadDate.toLocaleString()}
                    </p>
                    
                    {showAnalysis && (
                      <div className="mt-3 space-y-2">
                        {doc.keyConcepts && doc.keyConcepts.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-purple-300">Key Concepts:</p>
                            <p className="text-xs text-purple-300/70">
                              {doc.keyConcepts.slice(0, 5).join(', ')}
                              {doc.keyConcepts.length > 5 && ` +${doc.keyConcepts.length - 5} more`}
                            </p>
                          </div>
                        )}
                        {doc.vocabulary && doc.vocabulary.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-purple-300">Vocabulary:</p>
                            <p className="text-xs text-purple-300/70">
                              {doc.vocabulary.slice(0, 3).join(', ')}
                              {doc.vocabulary.length > 3 && ` +${doc.vocabulary.length - 3} more`}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Enhancement Options */}
      {processedDocuments.length > 0 && (
        <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-purple-200 mb-4">
            Study Guide Enhancement Options
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Annotations */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeAnnotations"
                  checked={enhancementOptions.includeAnnotations}
                  onChange={(e) => setEnhancementOptions(prev => ({
                    ...prev,
                    includeAnnotations: e.target.checked
                  }))}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="includeAnnotations" className="text-purple-200 font-medium">
                  Include Annotations
                </label>
              </div>
              
              {enhancementOptions.includeAnnotations && (
                <div className="ml-6 space-y-2">
                  {Object.entries(enhancementOptions.annotationTypes).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`annotation-${key}`}
                        checked={value}
                        onChange={(e) => setEnhancementOptions(prev => ({
                          ...prev,
                          annotationTypes: {
                            ...prev.annotationTypes,
                            [key]: e.target.checked
                          }
                        }))}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`annotation-${key}`} className="text-purple-300 text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeContent"
                  checked={enhancementOptions.includeContent}
                  onChange={(e) => setEnhancementOptions(prev => ({
                    ...prev,
                    includeContent: e.target.checked
                  }))}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="includeContent" className="text-purple-200 font-medium">
                  Include Additional Content
                </label>
              </div>
              
              {enhancementOptions.includeContent && (
                <div className="ml-6 space-y-2">
                  {Object.entries(enhancementOptions.contentTypes).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`content-${key}`}
                        checked={value}
                        onChange={(e) => setEnhancementOptions(prev => ({
                          ...prev,
                          contentTypes: {
                            ...prev.contentTypes,
                            [key]: e.target.checked
                          }
                        }))}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <label htmlFor={`content-${key}`} className="text-purple-300 text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleGenerateStudyGuide}
              disabled={isProcessing}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  ✨ Generate Enhanced Study Guide
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUploadProcessor;
