import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, Loader2, Sparkles, Wand2, BookOpen, ScrollText, Flame, Zap } from 'lucide-react';
import { processFile, ProcessedFile } from '../utils/fileProcessor.ts';
import { useFiles } from '../contexts/FileContext.tsx';
import { useOllama } from '../contexts/OllamaContext.tsx';
import toast from 'react-hot-toast';
import MagicalEffects from './MagicalEffects.tsx';

interface FileUploadProps {
  courseId?: string;
  onUploadComplete?: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ courseId, onUploadComplete }) => {
  const { addFile } = useFiles();
  const { generateSummary, isLoading } = useOllama();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeEffect, setActiveEffect] = useState<string>('');
  const [currentSpell, setCurrentSpell] = useState<string>('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!courseId) {
      toast.error('🧙‍♂️ The wizard needs to know which course to enchant!');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setActiveEffect('sparkles');
    setCurrentSpell('summoning');

    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        setUploadProgress((i / acceptedFiles.length) * 100);

        // Cast different spells during processing
        const spells = ['lightning', 'sparkles', 'magic-circle'];
        const randomSpell = spells[Math.floor(Math.random() * spells.length)];
        setActiveEffect(randomSpell);

        try {
          setCurrentSpell('processing');
          const processedFile = await processFile(file);

          setCurrentSpell('analyzing');
          // Generate summary using AI
          const summary = await generateSummary(
            processedFile.content,
            'medium',
            'paragraph'
          );

          setCurrentSpell('enchanting');
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

          // Success celebration
          setActiveEffect('sparkles');
          setTimeout(() => setActiveEffect(''), 2000);

          toast.success(`✨ ${file.name} has been enchanted!`, {
            icon: '🧙‍♂️',
            style: {
              background: 'linear-gradient(135deg, #1A0A2E 0%, #2D1B4E 100%)',
              color: '#8B5CF6',
              border: '2px solid #8B5CF6',
              borderRadius: '12px',
              fontFamily: 'Merriweather, serif',
            },
          });
        } catch (error) {
          console.error(`Error processing ${file.name}:`, error);
          toast.error(`💥 Failed to enchant ${file.name}`, {
            icon: '💔',
            style: {
              background: 'linear-gradient(135deg, #2D1B1B 0%, #4A1B1B 100%)',
              color: '#EF4444',
              border: '2px solid #EF4444',
              borderRadius: '12px',
              fontFamily: 'Merriweather, serif',
            },
          });
        }
      }

      setUploadProgress(100);
      setActiveEffect('magic-circle');
      setCurrentSpell('complete');
      setTimeout(() => {
        setActiveEffect('');
        setCurrentSpell('');
      }, 3000);

      onUploadComplete?.();
      toast.success('🎉 All scrolls have been successfully enchanted!', {
        icon: '🎊',
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #1A2E1A 0%, #2E4A1A 100%)',
          color: '#10B981',
          border: '2px solid #10B981',
          borderRadius: '12px',
          fontFamily: 'Merriweather, serif',
        },
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('💥 Magical ritual failed!', {
        icon: '💥',
        style: {
          background: 'linear-gradient(135deg, #2D1B1B 0%, #4A1B1B 100%)',
          color: '#EF4444',
          border: '2px solid #EF4444',
          borderRadius: '12px',
          fontFamily: 'Merriweather, serif',
        },
      });
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
    <div className="w-full relative">
      {/* Magical Effects Layer */}
      <MagicalEffects activeEffect={activeEffect} intensity="medium" />

      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-500 overflow-hidden
          ${isDragActive
            ? 'border-purple-400 bg-gradient-to-br from-purple-900/30 to-pink-900/30 shadow-2xl shadow-purple-500/30 scale-105'
            : 'border-purple-500/50 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-900/20 hover:to-pink-900/20 hover:shadow-xl hover:shadow-purple-500/20'
          }
          ${uploading ? 'pointer-events-none' : ''}
          backdrop-blur-sm
        `}
      >
        <input {...getInputProps()} />

        {/* Background Magical Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-4 animate-float">
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <div className="absolute top-8 right-8 animate-float" style={{ animationDelay: '1s' }}>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>
          <div className="absolute bottom-8 left-8 animate-float" style={{ animationDelay: '2s' }}>
            <Wand2 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="absolute bottom-4 right-4 animate-float" style={{ animationDelay: '0.5s' }}>
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
        </div>

        {uploading ? (
          <div className="space-y-8 relative z-10">
            {/* Wizard Casting Animation */}
            <div className="relative">
              <div className="w-24 h-24 mx-auto relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-magic-circle"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Wand2 className="w-12 h-12 text-white animate-wizard-wiggle" />
                </div>
                {/* Spell particles */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-sparkle" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300">
                {currentSpell === 'summoning' && '🧙‍♂️ Summoning Ancient Scrolls...'}
                {currentSpell === 'processing' && '📜 Processing Mystical Texts...'}
                {currentSpell === 'analyzing' && '🔮 Analyzing Arcane Knowledge...'}
                {currentSpell === 'enchanting' && '✨ Enchanting with Wisdom...'}
                {currentSpell === 'complete' && '🎉 Ritual Complete!'}
              </h3>

              <div className="max-w-md mx-auto">
                <div className="w-full bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-full h-4 border border-purple-500/30">
                  <div
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 h-4 rounded-full transition-all duration-1000 shadow-lg"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-purple-300/80 font-arcane mt-2 text-lg">
                  {Math.round(uploadProgress)}% enchanted
                </p>
              </div>

              {/* Progress indicators */}
              <div className="flex justify-center space-x-4">
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${uploadProgress > 25 ? 'bg-purple-400' : 'bg-purple-600'}`}></div>
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${uploadProgress > 50 ? 'bg-pink-400' : 'bg-pink-600'}`}></div>
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${uploadProgress > 75 ? 'bg-cyan-400' : 'bg-cyan-600'}`}></div>
                <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${uploadProgress > 95 ? 'bg-green-400' : 'bg-green-600'}`}></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
            {/* Magical Portal */}
            <div className="relative">
              <div className="w-32 h-32 mx-auto relative">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-purple-400/50 rounded-full animate-magic-circle"></div>
                {/* Inner ring */}
                <div className="absolute inset-4 border-2 border-pink-400/50 rounded-full animate-magic-circle" style={{ animationDirection: 'reverse', animationDuration: '4s' }}></div>
                {/* Center portal */}
                <div className="absolute inset-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center border border-cyan-400/30">
                  <BookOpen className="w-12 h-12 text-purple-300 animate-float" />
                </div>
                {/* Floating runes */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-purple-400 font-rune text-lg animate-pulse">A</div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-pink-400 font-rune text-lg animate-pulse" style={{ animationDelay: '0.5s' }}>L</div>
                <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-cyan-400 font-rune text-lg animate-pulse" style={{ animationDelay: '1s' }}>M</div>
                <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-green-400 font-rune text-lg animate-pulse" style={{ animationDelay: '1.5s' }}>G</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-2">
                  {isDragActive ? '✨ Release the Ancient Scrolls!' : '🧙‍♂️ Summon Study Materials'}
                </h3>
                <p className="text-purple-200/80 font-arcane text-lg max-w-md mx-auto">
                  {isDragActive
                    ? 'The portal is ready to receive your knowledge!'
                    : 'Drag & drop your scrolls here, or click to open the arcane portal'
                  }
                </p>
              </div>

              {/* File type badges */}
              <div className="flex flex-wrap justify-center gap-3">
                <div className="px-4 py-2 bg-gradient-to-r from-red-900/50 to-red-800/50 rounded-full border border-red-500/30 backdrop-blur-sm hover:scale-110 transition-transform duration-300">
                  <span className="text-red-300 font-rune text-sm">📜 PDF Scrolls</span>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-blue-900/50 to-blue-800/50 rounded-full border border-blue-500/30 backdrop-blur-sm hover:scale-110 transition-transform duration-300">
                  <span className="text-blue-300 font-rune text-sm">📝 Word Tomes</span>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-green-900/50 to-green-800/50 rounded-full border border-green-500/30 backdrop-blur-sm hover:scale-110 transition-transform duration-300">
                  <span className="text-green-300 font-rune text-sm">📊 Power Spells</span>
                </div>
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 rounded-full border border-yellow-500/30 backdrop-blur-sm hover:scale-110 transition-transform duration-300">
                  <span className="text-yellow-300 font-rune text-sm">📄 Text Runes</span>
                </div>
              </div>

              {/* Wizard hint */}
              <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-4 border border-purple-500/30 backdrop-blur-sm max-w-lg mx-auto">
                <p className="text-purple-200/90 font-arcane text-sm text-center">
                  💡 <strong>Wizard's Wisdom:</strong> Each scroll will be analyzed by ancient AI magic and transformed into study materials!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
