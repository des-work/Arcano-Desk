/**
 * Simple Document Upload Component
 * Minimal version for testing
 */

import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export interface SimpleDocumentUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

export const SimpleDocumentUpload: React.FC<SimpleDocumentUploadProps> = ({
  onFileSelect,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
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
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="text-6xl">📁</div>
          <div>
            <h3 className="text-2xl font-bold text-purple-200 mb-2">
              Upload Documents
            </h3>
            <p className="text-purple-300/70">
              Drag and drop files here or click to browse
            </p>
            <p className="text-purple-300/50 text-sm mt-2">
              Supports PDF, Word, Text, and Image files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleDocumentUpload;