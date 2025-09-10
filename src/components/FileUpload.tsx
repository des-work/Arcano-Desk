import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, Loader2, Sparkles } from 'lucide-react';
import { processFile, ProcessedFile } from '../utils/fileProcessor';
import { useFiles } from '../contexts/FileContext';
import { useOllama } from '../contexts/OllamaContext';
import toast from 'react-hot-toast';

interface FileUploadProps {
  courseId?: string;
  onUploadComplete?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ courseId, onUploadComplete }) => {
  const { addFile } = useFiles();
  const { generateSummary, isLoading } = useOllama();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!courseId) {
      toast.error('Please select a course first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        setUploadProgress((i / acceptedFiles.length) * 100);

        try {
          const processedFile = await processFile(file);
          
          // Generate summary using AI
          const summary = await generateSummary(
            processedFile.content, 
            'medium', 
            'paragraph'
          );

          const fileData = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: processedFile.name,
            type: processedFile.type,
            content: processedFile.content,
            courseId,
            uploadedAt: new Date(),
            lastProcessed: new Date(),
            summary,
          };

          addFile(fileData);
          toast.success(`Successfully processed ${file.name}`);
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          toast.error(`Failed to process ${file.name}`);
        }
      }

      setUploadProgress(100);
      onUploadComplete?.();
      toast.success('All files processed successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [courseId, addFile, generateSummary, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
    },
    multiple: true,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-neon-purple bg-neon-purple/10 neon-glow' 
            : 'border-neon-cyan/50 hover:border-neon-cyan hover:bg-neon-cyan/5'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-neon-purple animate-spin mx-auto" />
            <div className="space-y-2">
              <p className="text-neon-purple font-arcade">Processing files...</p>
              <div className="w-full bg-arcade-bg rounded-full h-2">
                <div 
                  className="bg-gradient-arcade h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400">{Math.round(uploadProgress)}% complete</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Upload className="w-16 h-16 text-neon-cyan mx-auto animate-float" />
              <Sparkles className="w-6 h-6 text-neon-yellow absolute -top-2 -right-2 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-pixel text-neon-purple neon-glow">
                {isDragActive ? 'Drop your files here!' : 'Upload Study Materials'}
              </h3>
              <p className="text-gray-400 font-arcade">
                Drag & drop files here, or click to select
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, Word, PowerPoint, and Text files
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple rounded border border-neon-purple/50">
                PDF
              </span>
              <span className="px-2 py-1 bg-neon-pink/20 text-neon-pink rounded border border-neon-pink/50">
                DOCX
              </span>
              <span className="px-2 py-1 bg-neon-cyan/20 text-neon-cyan rounded border border-neon-cyan/50">
                PPTX
              </span>
              <span className="px-2 py-1 bg-neon-green/20 text-neon-green rounded border border-neon-green/50">
                TXT
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
