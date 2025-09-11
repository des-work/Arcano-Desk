/**
 * RPG Cutscene System
 * Video game-style cutscenes with dialogue boxes and character interactions
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelWizard } from '../characters/PixelWizard';

export interface CutsceneDialogue {
  id: string;
  character: 'wizard' | 'narrator' | 'system';
  text: string;
  emotion?: 'happy' | 'sad' | 'excited' | 'thinking' | 'surprised';
  animation?: 'idle' | 'walking' | 'casting' | 'celebrating' | 'thinking';
  duration?: number;
}

export interface CutsceneSequence {
  id: string;
  title: string;
  dialogues: CutsceneDialogue[];
  background: string;
  music?: string;
  onComplete?: () => void;
}

export interface RPGCutsceneProps {
  sequence: CutsceneSequence;
  onComplete?: () => void;
  className?: string;
}

export const RPGCutscene: React.FC<RPGCutsceneProps> = ({
  sequence,
  onComplete,
  className = '',
}) => {
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const dialogue = sequence.dialogues[currentDialogue];

  // Typewriter effect
  const typeText = useCallback((text: string, speed: number = 50) => {
    setIsTyping(true);
    setDisplayText('');
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(interval);
  }, []);

  // Next dialogue
  const nextDialogue = useCallback(() => {
    if (currentDialogue < sequence.dialogues.length - 1) {
      setCurrentDialogue(prev => prev + 1);
    } else {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentDialogue, sequence.dialogues.length, onComplete]);

  // Start typing when dialogue changes
  useEffect(() => {
    if (dialogue) {
      const speed = dialogue.character === 'wizard' ? 30 : 50;
      const cleanup = typeText(dialogue.text, speed);
      return cleanup;
    }
  }, [dialogue, typeText]);

  // Auto-advance after duration
  useEffect(() => {
    if (dialogue && !isTyping) {
      const duration = dialogue.duration || 3000;
      const timer = setTimeout(nextDialogue, duration);
      return () => clearTimeout(timer);
    }
  }, [dialogue, isTyping, nextDialogue]);

  if (isComplete) return null;

  return (
    <motion.div
      className={`fixed inset-0 z-50 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0"
        style={{ background: sequence.background }}
      >
        {/* Scene Elements */}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Wizard Character */}
        {dialogue?.character === 'wizard' && (
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <PixelWizard
              x={200}
              y={100}
              animation={dialogue.animation || 'idle'}
              direction="right"
              size={6}
            />
          </div>
        )}

        {/* Magical Effects */}
        {dialogue?.animation === 'casting' && (
          <motion.div
            className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-64 h-64 border-2 border-yellow-400/50 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Dialogue Box */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/70 backdrop-blur-sm border-t-2 border-purple-500/50"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-4xl mx-auto p-6">
          {/* Character Name */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              {dialogue?.character === 'wizard' ? '🧙‍♂️' : '📖'}
            </div>
            <div>
              <div className="text-purple-300 font-wizard text-lg">
                {dialogue?.character === 'wizard' ? 'Wizard' : 
                 dialogue?.character === 'narrator' ? 'Narrator' : 'System'}
              </div>
              {dialogue?.emotion && (
                <div className="text-purple-400/70 text-sm">
                  {dialogue.emotion}
                </div>
              )}
            </div>
          </div>

          {/* Dialogue Text */}
          <div className="text-white text-lg leading-relaxed mb-4 min-h-[3rem]">
            {displayText}
            {isTyping && (
              <motion.span
                className="inline-block w-2 h-6 bg-white ml-1"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            <div className="text-purple-300/70 text-sm">
              {currentDialogue + 1} / {sequence.dialogues.length}
            </div>
            
            <button
              onClick={nextDialogue}
              disabled={isTyping}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isTyping ? '...' : 'Next'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Predefined cutscene sequences
 */
export const CUTSCENE_SEQUENCES = {
  welcome: {
    id: 'welcome',
    title: 'The Wizard\'s Arrival',
    background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #16213e 100%)',
    dialogues: [
      {
        id: 'intro',
        character: 'narrator' as const,
        text: 'In a realm where knowledge meets magic, a wise wizard appears...',
        duration: 3000,
      },
      {
        id: 'greeting',
        character: 'wizard' as const,
        text: 'Greetings, seeker of knowledge! I am the Arcano Wizard, guardian of ancient wisdom.',
        emotion: 'happy' as const,
        animation: 'walking' as const,
        duration: 4000,
      },
      {
        id: 'explanation',
        character: 'wizard' as const,
        text: 'I have been summoned to help you transform ordinary documents into magical study materials.',
        emotion: 'thinking' as const,
        animation: 'thinking' as const,
        duration: 4000,
      },
      {
        id: 'invitation',
        character: 'wizard' as const,
        text: 'Are you ready to begin this magical journey of learning?',
        emotion: 'excited' as const,
        animation: 'celebrating' as const,
        duration: 3000,
      },
    ],
  },
  
  upload: {
    id: 'upload',
    title: 'The Document Ritual',
    background: 'linear-gradient(135deg, #0f3460 0%, #16537e 50%, #0a1929 100%)',
    dialogues: [
      {
        id: 'preparation',
        character: 'wizard' as const,
        text: 'Ah, I sense documents approaching! Let me prepare my magical scanning abilities.',
        emotion: 'excited' as const,
        animation: 'walking' as const,
        duration: 3000,
      },
      {
        id: 'scanning',
        character: 'wizard' as const,
        text: 'Behold! I shall scan these documents with my mystical vision...',
        emotion: 'thinking' as const,
        animation: 'casting' as const,
        duration: 4000,
      },
      {
        id: 'processing',
        character: 'wizard' as const,
        text: 'The magical properties of your files are being analyzed...',
        emotion: 'thinking' as const,
        animation: 'thinking' as const,
        duration: 3000,
      },
      {
        id: 'completion',
        character: 'wizard' as const,
        text: 'Excellent! Your documents are now ready for the magical library!',
        emotion: 'happy' as const,
        animation: 'celebrating' as const,
        duration: 3000,
      },
    ],
  },
  
  library: {
    id: 'library',
    title: 'The Study Sanctum',
    background: 'linear-gradient(135deg, #2d1b4e 0%, #4a148c 50%, #1a0a2e 100%)',
    dialogues: [
      {
        id: 'entrance',
        character: 'wizard' as const,
        text: 'Welcome to my study sanctum! Here, knowledge becomes power.',
        emotion: 'happy' as const,
        animation: 'walking' as const,
        duration: 3000,
      },
      {
        id: 'studying',
        character: 'wizard' as const,
        text: 'Let me study these documents carefully to unlock their secrets...',
        emotion: 'thinking' as const,
        animation: 'thinking' as const,
        duration: 4000,
      },
      {
        id: 'insights',
        character: 'wizard' as const,
        text: 'Magnificent! I have gained new insights from your documents!',
        emotion: 'excited' as const,
        animation: 'celebrating' as const,
        duration: 3000,
      },
    ],
  },
  
  summary: {
    id: 'summary',
    title: 'The Knowledge Synthesis',
    background: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #2d1b4e 100%)',
    dialogues: [
      {
        id: 'gathering',
        character: 'wizard' as const,
        text: 'Now, let me gather all the insights I have collected...',
        emotion: 'thinking' as const,
        animation: 'walking' as const,
        duration: 3000,
      },
      {
        id: 'synthesizing',
        character: 'wizard' as const,
        text: 'Behold the power of magical synthesis! I shall create your summary...',
        emotion: 'excited' as const,
        animation: 'casting' as const,
        duration: 4000,
      },
      {
        id: 'completion',
        character: 'wizard' as const,
        text: 'Behold! Your magical summary is complete! Knowledge has been transformed!',
        emotion: 'happy' as const,
        animation: 'celebrating' as const,
        duration: 4000,
      },
    ],
  },
};

/**
 * Hook for managing cutscenes
 */
export function useCutscenes() {
  const [currentCutscene, setCurrentCutscene] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playCutscene = (cutsceneId: keyof typeof CUTSCENE_SEQUENCES) => {
    setCurrentCutscene(cutsceneId);
    setIsPlaying(true);
  };

  const stopCutscene = () => {
    setCurrentCutscene(null);
    setIsPlaying(false);
  };

  return {
    currentCutscene,
    isPlaying,
    playCutscene,
    stopCutscene,
  };
}

export default RPGCutscene;
