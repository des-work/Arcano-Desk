/**
 * Enhanced Upload Phase Component
 * Bulletproof file upload with seamless transitions to summary generation
 */

import React, { useState, useCallback, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, RefreshCw, Sparkles } from 'lucide-react';
import { DocumentProcessor, ProcessedDocument } from '../utils/DocumentProcessor.ts';

export interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  processedDoc?: ProcessedDocument;
  error?: string;
}

export interface EnhancedUploadPhaseProps {
  onDocumentsProcessed: (documents: ProcessedDocument[]) => void;
  onGenerateStudyGuide: () => void;
  className?: string;
}

export const EnhancedUploadPhase: React.FC<EnhancedUploadPhaseProps> = ({
  onDocumentsProcessed,
  onGenerateStudyGuide,
  className = '',
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    setUploadError(null);
    setIsProcessing(true);

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Process files one by one with progress tracking
    const processedDocuments: ProcessedDocument[] = [];

    for (let i = 0; i < newFiles.length; i++) {
      const fileItem = newFiles[i];
      
      try {
        // Update status to processing
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileItem.id 
              ? { ...f, status: 'processing', progress: 50 }
              : f
          )
        );

        // Process the file
        const processedDoc = await DocumentProcessor.processFile(fileItem.file);
        
        // Update status to completed
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileItem.id 
              ? { 
                  ...f, 
                  status: 'completed', 
                  progress: 100, 
                  processedDoc 
                }
              : f
          )
        );

        processedDocuments.push(processedDoc);

        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300));

      } catch (error) {
        console.error(`Error processing ${fileItem.file.name}:`, error);
        
        // Update status to error
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === fileItem.id 
              ? { 
                  ...f, 
                  status: 'error', 
                  progress: 0,
                  error: error instanceof Error ? error.message : 'Unknown error'
                }
              : f
          )
        );
      }
    }

    setIsProcessing(false);
    
    if (processedDocuments.length > 0) {
      onDocumentsProcessed(processedDocuments);
    }
  }, [onDocumentsProcessed]);

  // Handle drag and drop
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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileSelect(e.target.files);
    }
  }, [handleFileSelect]);

  // Remove file
  const removeFile = useCallback((fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Retry failed file
  const retryFile = useCallback(async (fileId: string) => {
    const fileItem = uploadedFiles.find(f => f.id === fileId);
    if (!fileItem) return;

    setUploadedFiles(prev => 
      prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'processing', progress: 0, error: undefined }
          : f
      )
    );

    try {
      const processedDoc = await DocumentProcessor.processFile(fileItem.file);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'completed', progress: 100, processedDoc }
            : f
        )
      );
    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Unknown error'
              }
            : f
        )
      );
    }
  }, [uploadedFiles]);

  // Get completed documents
  const completedDocuments = uploadedFiles.filter(f => f.status === 'completed' && f.processedDoc);
  const hasCompletedFiles = completedDocuments.length > 0;
  const hasErrors = uploadedFiles.some(f => f.status === 'error');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
          📁 Upload Your Study Materials
        </h2>
        <p className="text-purple-200/80 text-lg mb-6">
          Upload your documents for AI-powered study guide generation
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          isDragOver
            ? 'border-purple-400 bg-purple-900/20 scale-105'
            : 'border-purple-400/50 hover:border-purple-400/80'
        } ${isProcessing ? 'opacity-75 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isProcessing}
        />
        
        <div className="text-center">
          <div className="text-6xl mb-4">
            {isProcessing ? (
              <RefreshCw className="w-16 h-16 mx-auto animate-spin text-purple-400" />
            ) : (
              <Upload className="w-16 h-16 mx-auto text-purple-400" />
            )}
          </div>
          
          <h3 className="text-xl font-semibold text-purple-200 mb-2">
            {isProcessing ? 'Processing Documents...' : 'Drag & Drop Files Here'}
          </h3>
          
          <p className="text-purple-300/70 mb-4">
            {isProcessing 
              ? 'AI is analyzing your documents...' 
              : 'or click to browse files'
            }
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Choose Files'}
          </button>
          
          <p className="text-purple-400/60 text-sm mt-3">
            Supports PDF, Word, images, and text files (Max 50MB each)
          </p>
        </div>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div>
            <p className="text-red-200 font-medium">Upload Error</p>
            <p className="text-red-300/70 text-sm">{uploadError}</p>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-purple-200 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Uploaded Files ({completedDocuments.length}/{uploadedFiles.length})
          </h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {uploadedFiles.map((fileItem) => (
              <div
                key={fileItem.id}
                className={`bg-black/20 rounded-lg p-3 flex items-center gap-3 transition-all duration-300 ${
                  fileItem.status === 'completed' ? 'border border-green-500/30' : ''
                } ${fileItem.status === 'error' ? 'border border-red-500/30' : ''}`}
              >
                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {fileItem.status === 'uploading' && (
                    <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />
                  )}
                  {fileItem.status === 'processing' && (
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                  )}
                  {fileItem.status === 'completed' && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                  {fileItem.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-purple-200 font-medium truncate">
                    {fileItem.file.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-purple-400/70">
                    <span>{(fileItem.file.size / 1024).toFixed(1)} KB</span>
                    {fileItem.processedDoc && (
                      <>
                        <span>•</span>
                        <span>{fileItem.processedDoc.wordCount} words</span>
                      </>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  {fileItem.status === 'uploading' || fileItem.status === 'processing' ? (
                    <div className="mt-2 w-full bg-purple-900/30 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${fileItem.progress}%` }}
                      />
                    </div>
                  ) : null}
                  
                  {/* Error Message */}
                  {fileItem.status === 'error' && fileItem.error && (
                    <p className="text-red-300 text-sm mt-1">{fileItem.error}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {fileItem.status === 'error' && (
                    <button
                      onClick={() => retryFile(fileItem.id)}
                      className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                      title="Retry"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(fileItem.id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    title="Remove"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Message & Generate Button */}
      {hasCompletedFiles && (
        <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6">
          <div className="text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-xl font-semibold text-green-200 mb-2">
              Documents Ready for AI Analysis!
            </h3>
            <p className="text-green-300/70 mb-4">
              {completedDocuments.length} document{completedDocuments.length > 1 ? 's' : ''} successfully processed. 
              Ready to generate your personalized study guide.
            </p>
            
            <button
              onClick={onGenerateStudyGuide}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-wizard rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30 flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-5 h-5" />
              🧙‍♂️ Generate AI Study Guide
            </button>
          </div>
        </div>
      )}

      {/* Error Summary */}
      {hasErrors && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-200">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Some files failed to process</span>
          </div>
          <p className="text-yellow-300/70 text-sm mt-1">
            You can retry failed files or continue with successfully processed documents.
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedUploadPhase;
