/**
 * Character Scene Component
 * Dedicated scenes for pixel wizard with 8 zones and RPG-style cutscenes
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelWizard, usePixelWizard } from '../characters/PixelWizard';

export interface CharacterSceneProps {
  phase: 'welcome' | 'upload' | 'library' | 'summary';
  onSceneComplete?: () => void;
  className?: string;
}

// 8 dedicated zones for different activities
const SCENE_ZONES = {
  welcome: {
    zones: [
      { id: 'entrance', x: 50, y: 200, name: 'Entrance', description: 'Wizard arrives' },
      { id: 'greeting', x: 200, y: 150, name: 'Greeting', description: 'Welcome message' },
      { id: 'explanation', x: 350, y: 100, name: 'Explanation', description: 'App overview' },
      { id: 'invitation', x: 500, y: 150, name: 'Invitation', description: 'Start journey' },
    ],
    background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #16213e 100%)',
  },
  upload: {
    zones: [
      { id: 'preparation', x: 100, y: 150, name: 'Preparation', description: 'Getting ready' },
      { id: 'scanning', x: 250, y: 200, name: 'Scanning', description: 'Looking for files' },
      { id: 'processing', x: 400, y: 180, name: 'Processing', description: 'Analyzing documents' },
      { id: 'completion', x: 550, y: 120, name: 'Completion', description: 'Files ready' },
    ],
    background: 'linear-gradient(135deg, #0f3460 0%, #16537e 50%, #0a1929 100%)',
  },
  library: {
    zones: [
      { id: 'studying', x: 80, y: 180, name: 'Studying', description: 'Reading documents' },
      { id: 'thinking', x: 200, y: 120, name: 'Thinking', description: 'Processing knowledge' },
      { id: 'organizing', x: 350, y: 200, name: 'Organizing', description: 'Categorizing info' },
      { id: 'insights', x: 500, y: 140, name: 'Insights', description: 'Gaining wisdom' },
    ],
    background: 'linear-gradient(135deg, #2d1b4e 0%, #4a148c 50%, #1a0a2e 100%)',
  },
  summary: {
    zones: [
      { id: 'gathering', x: 120, y: 160, name: 'Gathering', description: 'Collecting insights' },
      { id: 'synthesizing', x: 280, y: 140, name: 'Synthesizing', description: 'Creating summary' },
      { id: 'polishing', x: 420, y: 180, name: 'Polishing', description: 'Refining output' },
      { id: 'presentation', x: 560, y: 120, name: 'Presentation', description: 'Sharing results' },
    ],
    background: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #2d1b4e 100%)',
  },
};

// Cutscene sequences for each phase
const CUTSCENE_SEQUENCES = {
  welcome: [
    { zone: 'entrance', animation: 'teleporting', duration: 2000, text: 'The wizard materializes in a burst of magical energy!' },
    { zone: 'greeting', animation: 'walking', duration: 1500, text: 'Welcome, seeker of knowledge!' },
    { zone: 'explanation', animation: 'thinking', duration: 3000, text: 'I am here to help you transform documents into magical study materials.' },
    { zone: 'invitation', animation: 'celebrating', duration: 2000, text: 'Shall we begin your magical journey?' },
  ],
  upload: [
    { zone: 'preparation', animation: 'walking', duration: 1500, text: 'Let me prepare my magical scanning abilities...' },
    { zone: 'scanning', animation: 'casting', duration: 2000, text: 'Scanning for documents to process...' },
    { zone: 'processing', animation: 'thinking', duration: 3000, text: 'Analyzing the magical properties of your files...' },
    { zone: 'completion', animation: 'celebrating', duration: 2000, text: 'Your documents are ready for the library!' },
  ],
  library: [
    { zone: 'studying', animation: 'walking', duration: 1500, text: 'Let me study these documents carefully...' },
    { zone: 'thinking', animation: 'thinking', duration: 2500, text: 'Processing the knowledge within...' },
    { zone: 'organizing', animation: 'casting', duration: 2000, text: 'Organizing the information into categories...' },
    { zone: 'insights', animation: 'celebrating', duration: 2000, text: 'I have gained new insights! Ready for summary.' },
  ],
  summary: [
    { zone: 'gathering', animation: 'walking', duration: 1500, text: 'Gathering all the insights I have collected...' },
    { zone: 'synthesizing', animation: 'casting', duration: 3000, text: 'Synthesizing the knowledge into a magical summary...' },
    { zone: 'polishing', animation: 'thinking', duration: 2000, text: 'Polishing the final presentation...' },
    { zone: 'presentation', animation: 'celebrating', duration: 2500, text: 'Behold! Your magical summary is complete!' },
  ],
};

export const CharacterScene: React.FC<CharacterSceneProps> = ({
  phase,
  onSceneComplete,
  className = '',
}) => {
  const [currentSequence, setCurrentSequence] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showText, setShowText] = useState(false);
  const [currentText, setCurrentText] = useState('');
  
  const { position, animation, direction, moveTo, playAnimation, setDirection } = usePixelWizard();
  
  const sceneData = SCENE_ZONES[phase];
  const cutscene = CUTSCENE_SEQUENCES[phase];

  // Play cutscene sequence
  const playCutscene = useCallback(() => {
    if (currentSequence >= cutscene.length) {
      setIsPlaying(false);
      if (onSceneComplete) onSceneComplete();
      return;
    }

    const sequence = cutscene[currentSequence];
    const zone = sceneData.zones.find(z => z.id === sequence.zone);
    
    if (zone) {
      // Move wizard to zone
      moveTo(zone.x, zone.y, sequence.animation as any);
      
      // Show text
      setCurrentText(sequence.text);
      setShowText(true);
      
      // Hide text after duration
      setTimeout(() => {
        setShowText(false);
        setCurrentSequence(prev => prev + 1);
      }, sequence.duration);
    }
  }, [currentSequence, cutscene, sceneData.zones, moveTo, onSceneComplete]);

  // Start cutscene when phase changes
  useEffect(() => {
    setCurrentSequence(0);
    setIsPlaying(true);
    setShowText(false);
  }, [phase]);

  // Play next sequence
  useEffect(() => {
    if (isPlaying) {
      playCutscene();
    }
  }, [isPlaying, playCutscene]);

  return (
    <div className={`relative w-full h-64 overflow-hidden rounded-lg ${className}`}>
      {/* Scene Background */}
      <div 
        className="absolute inset-0"
        style={{ background: sceneData.background }}
      >
        {/* Zone Markers */}
        {sceneData.zones.map((zone, index) => (
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

        {/* Pixel Wizard */}
        <PixelWizard
          x={position.x}
          y={position.y}
          animation={animation}
          direction={direction}
          size={4}
        />

        {/* Magical Effects */}
        {animation === 'casting' && (
          <motion.div
            className="absolute w-32 h-32 border-2 border-yellow-400/50 rounded-full"
            style={{ left: position.x - 64, top: position.y - 64 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {animation === 'teleporting' && (
          <motion.div
            className="absolute w-24 h-24 border-2 border-purple-400/70 rounded-full"
            style={{ left: position.x - 48, top: position.y - 48 }}
            animate={{
              rotate: [0, 360],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {/* Text Display */}
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
        {currentSequence + 1} / {cutscene.length}
      </div>
    </div>
  );
};

/**
 * Hook for managing character scenes
 */
export function useCharacterScene() {
  const [currentPhase, setCurrentPhase] = useState<CharacterSceneProps['phase']>('welcome');
  const [isSceneActive, setIsSceneActive] = useState(false);

  const startScene = (phase: CharacterSceneProps['phase']) => {
    setCurrentPhase(phase);
    setIsSceneActive(true);
  };

  const endScene = () => {
    setIsSceneActive(false);
  };

  return {
    currentPhase,
    isSceneActive,
    startScene,
    endScene,
  };
}

export default CharacterScene;
