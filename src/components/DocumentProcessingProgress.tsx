/**
 * Document Processing Progress Component
 * Shows real-time progress during document processing
 */

import React from 'react';
import { Loader2, CheckCircle, AlertCircle, FileText, Image, File } from 'lucide-react';

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress?: number;
  message?: string;
}

export interface DocumentProcessingProgressProps {
  steps: ProcessingStep[];
  currentStep: string;
  overallProgress: number;
  isProcessing: boolean;
  error?: string;
  className?: string;
}

export const DocumentProcessingProgress: React.FC<DocumentProcessingProgressProps> = ({
  steps,
  currentStep,
  overallProgress,
  isProcessing,
  error,
  className = '',
}) => {
  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-400" />;
    }
  };

  const getFileIcon = (stepName: string) => {
    if (stepName.toLowerCase().includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (stepName.toLowerCase().includes('image')) return <Image className="w-4 h-4 text-green-500" />;
    if (stepName.toLowerCase().includes('word')) return <File className="w-4 h-4 text-blue-500" />;
    return <File className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className={`bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 ${className}`}>
      <div className="text-center mb-6">
        <div className="text-4xl mb-3">🧙‍♂️</div>
        <h3 className="text-xl font-bold text-purple-200 mb-2">
          {isProcessing ? 'Processing Documents...' : 'Document Processing Complete'}
        </h3>
        <p className="text-purple-300/70 text-sm">
          {currentStep || 'Preparing to process your documents'}
        </p>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-purple-200">Overall Progress</span>
          <span className="text-sm text-purple-300">{Math.round(overallProgress)}%</span>
        </div>
        <div className="w-full bg-purple-900/30 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
      </div>

      {/* Processing Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
              step.status === 'processing'
                ? 'bg-blue-500/20 border border-blue-500/30'
                : step.status === 'completed'
                ? 'bg-green-500/20 border border-green-500/30'
                : step.status === 'error'
                ? 'bg-red-500/20 border border-red-500/30'
                : 'bg-gray-500/20 border border-gray-500/30'
            }`}
          >
            {getStepIcon(step)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {getFileIcon(step.name)}
                <span className="text-sm font-medium text-purple-200 truncate">
                  {step.name}
                </span>
              </div>
              {step.message && (
                <p className="text-xs text-purple-300/70 mt-1">{step.message}</p>
              )}
              {step.progress !== undefined && step.status === 'processing' && (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1">
                    <div
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-purple-300/70 mt-1">
                    {Math.round(step.progress)}% complete
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-200">Processing Error</span>
          </div>
          <p className="text-sm text-red-300/70 mt-1">{error}</p>
        </div>
      )}

      {/* Processing Animation */}
      {isProcessing && (
        <div className="mt-4 flex items-center justify-center gap-2 text-purple-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Processing your documents...</span>
        </div>
      )}
    </div>
  );
};

export default DocumentProcessingProgress;
