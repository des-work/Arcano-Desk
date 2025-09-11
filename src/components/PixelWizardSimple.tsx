/**
 * Simple Pixel Wizard Component
 * Working version with basic pixel art display
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface PixelWizardSimpleProps {
  x: number;
  y: number;
  animation: 'idle' | 'walking' | 'flying' | 'teleporting' | 'casting' | 'celebrating' | 'thinking';
  direction: 'left' | 'right' | 'up' | 'down';
  size?: number;
  className?: string;
}

export const PixelWizardSimple: React.FC<PixelWizardSimpleProps> = ({
  x,
  y,
  animation,
  direction,
  size = 4,
  className = '',
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  // Simple animation frames
  const getAnimationFrames = () => {
    switch (animation) {
      case 'idle':
        return ['🧙‍♂️', '🧙‍♂️', '🧙‍♂️', '🧙‍♂️'];
      case 'walking':
        return ['🧙‍♂️', '🚶‍♂️', '🧙‍♂️', '🚶‍♂️'];
      case 'flying':
        return ['🧙‍♂️', '🪄', '🧙‍♂️', '🪄'];
      case 'teleporting':
        return ['✨', '🧙‍♂️', '✨', '🧙‍♂️'];
      case 'casting':
        return ['🧙‍♂️', '🔮', '🧙‍♂️', '🔮'];
      case 'celebrating':
        return ['🎉', '🧙‍♂️', '🎉', '🧙‍♂️'];
      case 'thinking':
        return ['🤔', '🧙‍♂️', '🤔', '🧙‍♂️'];
      default:
        return ['🧙‍♂️'];
    }
  };

  const frames = getAnimationFrames();
  const currentEmoji = frames[currentFrame % frames.length];

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFrame(prev => prev + 1);
    }, 500); // Change frame every 500ms

    return () => clearInterval(interval);
  }, [animation]);

  const getTransform = () => {
    const scaleX = direction === 'left' ? -1 : 1;
    return {
      scaleX,
      x: x - (size * 16) / 2,
      y: y - (size * 16) / 2,
    };
  };

  const transform = getTransform();

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{
        left: transform.x,
        top: transform.y,
        transform: `scaleX(${transform.scaleX})`,
        fontSize: `${size * 16}px`,
        lineHeight: 1,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        {currentEmoji}
      </div>
    </motion.div>
  );
};

export default PixelWizardSimple;
