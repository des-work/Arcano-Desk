/**
 * Enhanced Character Scene Component
 * Advanced pixel art character system with multiple animations and effects
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EnhancedCharacterSceneProps {
  phase: 'welcome' | 'upload' | 'library' | 'summary';
  onSceneComplete?: () => void;
  className?: string;
}

// Enhanced zones with more detailed animations
const PHASE_ZONES = {
  welcome: [
    { 
      id: 'entrance', 
      x: 100, 
      y: 120, 
      name: 'Entrance', 
      animation: 'teleporting' as const,
      text: 'The wizard materializes in a burst of magical energy!',
      duration: 2000
    },
    { 
      id: 'greeting', 
      x: 200, 
      y: 120, 
      name: 'Greeting', 
      animation: 'walking' as const,
      text: 'Welcome, seeker of knowledge!',
      duration: 1500
    },
    { 
      id: 'explanation', 
      x: 300, 
      y: 120, 
      name: 'Explanation', 
      animation: 'thinking' as const,
      text: 'I am here to help you transform documents into magical study materials.',
      duration: 3000
    },
    { 
      id: 'invitation', 
      x: 400, 
      y: 120, 
      name: 'Invitation', 
      animation: 'celebrating' as const,
      text: 'Shall we begin your magical journey?',
      duration: 2000
    },
  ],
  upload: [
    { 
      id: 'preparation', 
      x: 100, 
      y: 120, 
      name: 'Preparation', 
      animation: 'walking' as const,
      text: 'Let me prepare my magical scanning abilities...',
      duration: 1500
    },
    { 
      id: 'scanning', 
      x: 200, 
      y: 120, 
      name: 'Scanning', 
      animation: 'casting' as const,
      text: 'Scanning for documents to process...',
      duration: 2000
    },
    { 
      id: 'processing', 
      x: 300, 
      y: 120, 
      name: 'Processing', 
      animation: 'thinking' as const,
      text: 'Analyzing the magical properties of your files...',
      duration: 3000
    },
    { 
      id: 'completion', 
      x: 400, 
      y: 120, 
      name: 'Completion', 
      animation: 'celebrating' as const,
      text: 'Your documents are ready for the library!',
      duration: 2000
    },
  ],
  library: [
    { 
      id: 'studying', 
      x: 100, 
      y: 120, 
      name: 'Studying', 
      animation: 'walking' as const,
      text: 'Let me study these documents carefully...',
      duration: 1500
    },
    { 
      id: 'thinking', 
      x: 200, 
      y: 120, 
      name: 'Thinking', 
      animation: 'thinking' as const,
      text: 'Processing the knowledge within...',
      duration: 2500
    },
    { 
      id: 'organizing', 
      x: 300, 
      y: 120, 
      name: 'Organizing', 
      animation: 'casting' as const,
      text: 'Organizing the information into categories...',
      duration: 2000
    },
    { 
      id: 'insights', 
      x: 400, 
      y: 120, 
      name: 'Insights', 
      animation: 'celebrating' as const,
      text: 'I have gained new insights! Ready for summary.',
      duration: 2000
    },
  ],
  summary: [
    { 
      id: 'gathering', 
      x: 100, 
      y: 120, 
      name: 'Gathering', 
      animation: 'walking' as const,
      text: 'Gathering all the insights I have collected...',
      duration: 1500
    },
    { 
      id: 'synthesizing', 
      x: 200, 
      y: 120, 
      name: 'Synthesizing', 
      animation: 'casting' as const,
      text: 'Synthesizing the knowledge into a magical summary...',
      duration: 3000
    },
    { 
      id: 'polishing', 
      x: 300, 
      y: 120, 
      name: 'Polishing', 
      animation: 'thinking' as const,
      text: 'Polishing the final presentation...',
      duration: 2000
    },
    { 
      id: 'presentation', 
      x: 400, 
      y: 120, 
      name: 'Presentation', 
      animation: 'celebrating' as const,
      text: 'Behold! Your magical summary is complete!',
      duration: 2500
    },
  ],
};

const PHASE_BACKGROUNDS = {
  welcome: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #16213e 100%)',
  upload: 'linear-gradient(135deg, #0f3460 0%, #16537e 50%, #0a1929 100%)',
  library: 'linear-gradient(135deg, #2d1b4e 0%, #4a148c 50%, #1a0a2e 100%)',
  summary: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #2d1b4e 100%)',
};

// Animation emojis for different states
const ANIMATION_EMOJIS = {
  idle: ['🧙‍♂️'],
  walking: ['🧙‍♂️', '🚶‍♂️', '🧙‍♂️', '🚶‍♂️'],
  flying: ['🧙‍♂️', '🪄', '🧙‍♂️', '🪄'],
  teleporting: ['✨', '🧙‍♂️', '✨', '🧙‍♂️'],
  casting: ['🧙‍♂️', '🔮', '🧙‍♂️', '🔮'],
  celebrating: ['🎉', '🧙‍♂️', '🎉', '🧙‍♂️'],
  thinking: ['🤔', '🧙‍♂️', '🤔', '🧙‍♂️'],
};

export const EnhancedCharacterScene: React.FC<EnhancedCharacterSceneProps> = ({
  phase,
  onSceneComplete,
  className = '',
}) => {
  const [currentZone, setCurrentZone] = useState(0);
  const [wizardPosition, setWizardPosition] = useState({ x: 50, y: 120 });
  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'walking' | 'flying' | 'teleporting' | 'casting' | 'celebrating' | 'thinking'>('idle');
  const [showText, setShowText] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const zones = PHASE_ZONES[phase];
  const background = PHASE_BACKGROUNDS[phase];

  // Animation frame cycling
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => prev + 1);
    }, 500);

    return () => clearInterval(interval);
  }, [currentAnimation]);

  // Move wizard through zones
  useEffect(() => {
    if (currentZone >= zones.length) {
      if (onSceneComplete) onSceneComplete();
      return;
    }

    const zone = zones[currentZone];
    setCurrentAnimation(zone.animation);
    setShowText(true);
    setCurrentText(zone.text);
    setIsMoving(true);

    // Animate movement to zone
    const moveTimer = setTimeout(() => {
      setWizardPosition({ x: zone.x, y: zone.y });
      setIsMoving(false);
    }, 500);

    // Move to next zone after duration
    const nextTimer = setTimeout(() => {
      setShowText(false);
      setCurrentZone(prev => prev + 1);
    }, zone.duration);

    return () => {
      clearTimeout(moveTimer);
      clearTimeout(nextTimer);
    };
  }, [currentZone, zones, onSceneComplete]);

  // Get current emoji based on animation and frame
  const getCurrentEmoji = () => {
    const emojis = ANIMATION_EMOJIS[currentAnimation];
    return emojis[animationFrame % emojis.length];
  };

  return (
    <div className={`relative w-full h-64 overflow-hidden rounded-lg ${className}`}>
      {/* Scene Background */}
      <div 
        className="absolute inset-0"
        style={{ background }}
      >
        {/* Zone Markers */}
        {zones.map((zone, index) => (
          <motion.div
            key={zone.id}
            className="absolute w-16 h-16 border-2 border-purple-400/30 rounded-lg bg-purple-500/10 backdrop-blur-sm"
            style={{ left: zone.x - 32, top: zone.y - 32 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-purple-300 font-wizard whitespace-nowrap">
              {zone.name}
            </div>
          </motion.div>
        ))}

        {/* Enhanced Pixel Wizard */}
        <motion.div
          className="absolute text-6xl"
          style={{ 
            left: wizardPosition.x - 30, 
            top: wizardPosition.y - 30,
            imageRendering: 'pixelated'
          }}
          animate={{
            x: isMoving ? [wizardPosition.x - 30, wizardPosition.x - 30] : [0, 0],
            y: isMoving ? [wizardPosition.y - 30, wizardPosition.y - 30] : [0, 0],
            rotate: currentAnimation === 'walking' ? [0, 5, -5, 0] : 0,
            scale: currentAnimation === 'celebrating' ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: isMoving ? 0.5 : 0.3,
            ease: "easeInOut",
          }}
        >
          {getCurrentEmoji()}
        </motion.div>

        {/* Enhanced Magical Effects */}
        {currentAnimation === 'casting' && (
          <motion.div
            className="absolute w-32 h-32 border-2 border-yellow-400/50 rounded-full"
            style={{ left: wizardPosition.x - 64, top: wizardPosition.y - 64 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {currentAnimation === 'teleporting' && (
          <motion.div
            className="absolute w-24 h-24 border-2 border-purple-400/70 rounded-full"
            style={{ left: wizardPosition.x - 48, top: wizardPosition.y - 48 }}
            animate={{
              rotate: [0, 360],
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {currentAnimation === 'celebrating' && (
          <motion.div
            className="absolute w-20 h-20 border-2 border-green-400/50 rounded-full"
            style={{ left: wizardPosition.x - 40, top: wizardPosition.y - 40 }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.9, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Particle Effects */}
        {currentAnimation === 'casting' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: wizardPosition.x + (i * 20) - 60,
                  top: wizardPosition.y + (i * 10) - 30,
                }}
                animate={{
                  y: [0, -50, -100],
                  opacity: [1, 0.5, 0],
                  scale: [0.5, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Text Display */}
      <AnimatePresence>
        {showText && (
          <motion.div
            className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-purple-200 font-wizard text-sm leading-relaxed">
              {currentText}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs font-mono">
        {currentZone + 1} / {zones.length}
      </div>

      {/* Phase Indicator */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs font-mono">
        Phase: {phase}
      </div>
    </div>
  );
};

export default EnhancedCharacterScene;
