/**
 * Simple Character Scene Component
 * Working version with basic character movement
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PixelWizardSimple } from './PixelWizardSimple';

export interface CharacterSceneSimpleProps {
  phase: 'welcome' | 'upload' | 'library' | 'summary';
  onSceneComplete?: () => void;
  className?: string;
}

// Simple zones for each phase
const PHASE_ZONES = {
  welcome: [
    { id: 'entrance', x: 100, y: 100, name: 'Entrance', animation: 'teleporting' as const },
    { id: 'greeting', x: 200, y: 100, name: 'Greeting', animation: 'walking' as const },
    { id: 'explanation', x: 300, y: 100, name: 'Explanation', animation: 'thinking' as const },
    { id: 'invitation', x: 400, y: 100, name: 'Invitation', animation: 'celebrating' as const },
  ],
  upload: [
    { id: 'preparation', x: 100, y: 100, name: 'Preparation', animation: 'walking' as const },
    { id: 'scanning', x: 200, y: 100, name: 'Scanning', animation: 'casting' as const },
    { id: 'processing', x: 300, y: 100, name: 'Processing', animation: 'thinking' as const },
    { id: 'completion', x: 400, y: 100, name: 'Completion', animation: 'celebrating' as const },
  ],
  library: [
    { id: 'studying', x: 100, y: 100, name: 'Studying', animation: 'walking' as const },
    { id: 'thinking', x: 200, y: 100, name: 'Thinking', animation: 'thinking' as const },
    { id: 'organizing', x: 300, y: 100, name: 'Organizing', animation: 'casting' as const },
    { id: 'insights', x: 400, y: 100, name: 'Insights', animation: 'celebrating' as const },
  ],
  summary: [
    { id: 'gathering', x: 100, y: 100, name: 'Gathering', animation: 'walking' as const },
    { id: 'synthesizing', x: 200, y: 100, name: 'Synthesizing', animation: 'casting' as const },
    { id: 'polishing', x: 300, y: 100, name: 'Polishing', animation: 'thinking' as const },
    { id: 'presentation', x: 400, y: 100, name: 'Presentation', animation: 'celebrating' as const },
  ],
};

const PHASE_BACKGROUNDS = {
  welcome: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #16213e 100%)',
  upload: 'linear-gradient(135deg, #0f3460 0%, #16537e 50%, #0a1929 100%)',
  library: 'linear-gradient(135deg, #2d1b4e 0%, #4a148c 50%, #1a0a2e 100%)',
  summary: 'linear-gradient(135deg, #4a148c 0%, #7b1fa2 50%, #2d1b4e 100%)',
};

export const CharacterSceneSimple: React.FC<CharacterSceneSimpleProps> = ({
  phase,
  onSceneComplete,
  className = '',
}) => {
  const [currentZone, setCurrentZone] = useState(0);
  const [wizardPosition, setWizardPosition] = useState({ x: 50, y: 100 });
  const [currentAnimation, setCurrentAnimation] = useState<'idle' | 'walking' | 'flying' | 'teleporting' | 'casting' | 'celebrating' | 'thinking'>('idle');
  const [showText, setShowText] = useState(false);
  const [currentText, setCurrentText] = useState('');

  const zones = PHASE_ZONES[phase];
  const background = PHASE_BACKGROUNDS[phase];

  // Move wizard through zones
  useEffect(() => {
    if (currentZone >= zones.length) {
      if (onSceneComplete) onSceneComplete();
      return;
    }

    const zone = zones[currentZone];
    setWizardPosition({ x: zone.x, y: zone.y });
    setCurrentAnimation(zone.animation);

    // Show text for this zone
    setCurrentText(`${zone.name}: The wizard is ${zone.animation}...`);
    setShowText(true);

    // Move to next zone after delay
    const timer = setTimeout(() => {
      setShowText(false);
      setCurrentZone(prev => prev + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentZone, zones, onSceneComplete]);

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

        {/* Pixel Wizard */}
        <PixelWizardSimple
          x={wizardPosition.x}
          y={wizardPosition.y}
          animation={currentAnimation}
          direction="right"
          size={4}
        />

        {/* Magical Effects */}
        {currentAnimation === 'casting' && (
          <motion.div
            className="absolute w-32 h-32 border-2 border-yellow-400/50 rounded-full"
            style={{ left: wizardPosition.x - 64, top: wizardPosition.y - 64 }}
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

        {currentAnimation === 'teleporting' && (
          <motion.div
            className="absolute w-24 h-24 border-2 border-purple-400/70 rounded-full"
            style={{ left: wizardPosition.x - 48, top: wizardPosition.y - 48 }}
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

      {/* Progress Indicator */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-xs font-mono">
        {currentZone + 1} / {zones.length}
      </div>
    </div>
  );
};

export default CharacterSceneSimple;
