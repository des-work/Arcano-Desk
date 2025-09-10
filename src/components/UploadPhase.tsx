import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useAnimations } from '../animations';
import { InteractiveButton, InteractiveCard } from '../animations';
import { useFiles } from '../hooks/useFiles';
import { useWizard } from '../hooks/useWizard';
import { FileUpload, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface UploadPhaseProps {
  onComplete: () => void;
}

export const UploadPhase: React.FC<UploadPhaseProps> = ({ onComplete }) => {
  const { triggerAnimation } = useAnimations();
  const { addFile } = useFiles();
  const { castSpell, gainKnowledge, changeMood } = useWizard();
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadedFiles([]);
    
    // Wizard starts working
    changeMood('focused');
    castSpell('file-enchantment');

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        setCurrentFile(file);
        
        // Update progress
        const progress = ((i + 1) / acceptedFiles.length) * 100;
        setUploadProgress(progress);

        // Simulate file processing
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add file to store
        const fileData = {
          id: Date.now().toString() + i,
          name: file.name,
          type: file.type,
          size: file.size,
          content: `Content of ${file.name}`,
          courseId: '1',
          uploadedAt: new Date(),
          lastProcessed: new Date()
        };

        addFile(fileData);
        setUploadedFiles(prev => [...prev, file]);

        // Wizard gains knowledge
        gainKnowledge(file.name);
        
        // Trigger animation
        triggerAnimation('file-upload', { intensity: 'moderate' });
      }

      // Upload complete
      changeMood('excited');
      castSpell('upload-complete');
      triggerAnimation('notification-success', { intensity: 'intense' });
      
      toast.success(`Successfully uploaded ${acceptedFiles.length} file(s)!`);
      
      // Auto-advance after 2 seconds
      setTimeout(() => {
        onComplete();
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      changeMood('confused');
      triggerAnimation('notification-error', { intensity: 'moderate' });
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setCurrentFile(null);
    }
  }, [addFile, castSpell, gainKnowledge, changeMood, triggerAnimation, onComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt']
    },
    multiple: true,
    disabled: uploading
  });

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <InteractiveCard
            hoverEffect="magic"
            className="p-8 border-2 border-dashed border-purple-400/50"
          >
            <div
              {...getRootProps()}
              className={`text-center cursor-pointer transition-all duration-300 ${
                isDragActive ? 'scale-105' : ''
              } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <input {...getInputProps()} />
              
              <motion.div
                animate={{
                  scale: isDragActive ? 1.1 : 1,
                  rotate: isDragActive ? 5 : 0
                }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              </motion.div>
              
              <h2 className="text-2xl font-wizard text-white mb-2">
                {isDragActive ? 'Drop your files here!' : 'Drag & drop your files here'}
              </h2>
              
              <p className="text-purple-200/80 font-arcane mb-4">
                or click to select files
              </p>
              
              <p className="text-sm text-purple-300/60">
                Supports PDF, DOCX, PPTX, and TXT files
              </p>
            </div>
          </InteractiveCard>
        </motion.div>

        {/* Upload Progress */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <InteractiveCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-wizard text-white">
                    Processing Files...
                  </h3>
                  <span className="text-purple-300 font-arcane">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-700 rounded-full h-3 mb-4 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                {/* Current File */}
                {currentFile && (
                  <div className="flex items-center space-x-3">
                    <FileUpload className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-200 font-arcane truncate">
                      {currentFile.name}
                    </span>
                  </div>
                )}
              </InteractiveCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Uploaded Files */}
        <AnimatePresence>
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <InteractiveCard className="p-6">
                <h3 className="text-lg font-wizard text-white mb-4">
                  Uploaded Files
                </h3>
                
                <div className="space-y-3">
                  {uploadedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="text-purple-200 font-arcane">
                          {file.name}
                        </span>
                      </div>
                      
                      <span className="text-sm text-purple-300/60">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </motion.div>
                  ))}
                </div>
              </InteractiveCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <InteractiveButton
            variant="primary"
            onClick={() => {
              triggerAnimation('button-click', { intensity: 'moderate' });
              onComplete();
            }}
            disabled={uploading}
          >
            Continue to Library
          </InteractiveButton>
          
          <InteractiveButton
            variant="secondary"
            onClick={() => {
              triggerAnimation('button-click', { intensity: 'gentle' });
              setUploadedFiles([]);
              setUploadProgress(0);
            }}
            disabled={uploading}
          >
            Clear Files
          </InteractiveButton>
        </div>
      </div>
    </div>
  );
};

export default UploadPhase;
