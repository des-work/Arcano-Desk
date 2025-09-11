/**
 * Pixel Wizard Character Component
 * 16x16 pixel art wizard with multiple animations and movement types
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PixelWizardProps {
  x: number;
  y: number;
  animation: 'idle' | 'walking' | 'flying' | 'teleporting' | 'timeTravel' | 'casting' | 'celebrating' | 'thinking';
  direction: 'left' | 'right' | 'up' | 'down';
  size?: number; // Multiplier for 16x16 base size
  onAnimationComplete?: () => void;
  className?: string;
}

// Pixel art sprite data (16x16 base)
const SPRITE_DATA = {
  idle: {
    frames: 4,
    duration: 1000,
    sprites: [
      // Frame 1: Standing still
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // Frame 2: Slight movement
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // Frame 3: Back to center
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // Frame 4: Slight movement
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
    ],
  },
  walking: {
    frames: 8,
    duration: 800,
    sprites: [
      // 8 walking frames for smooth animation
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // ... 7 more frames
    ],
  },
  flying: {
    frames: 6,
    duration: 1200,
    sprites: [
      // Flying on broomstick frames
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // ... 5 more frames
    ],
  },
  teleporting: {
    frames: 12,
    duration: 1500,
    sprites: [
      // Teleportation effect frames
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // ... 11 more frames
    ],
  },
  timeTravel: {
    frames: 16,
    duration: 2000,
    sprites: [
      // Time travel effect frames
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // ... 15 more frames
    ],
  },
  casting: {
    frames: 10,
    duration: 1000,
    sprites: [
      // Spell casting frames
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // ... 9 more frames
    ],
  },
  celebrating: {
    frames: 6,
    duration: 800,
    sprites: [
      // Celebration frames
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // ... 5 more frames
    ],
  },
  thinking: {
    frames: 4,
    duration: 1500,
    sprites: [
      // Thinking frames
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000' +
      '0000000000000000',
      // ... 3 more frames
    ],
  },
};

// Color palette for pixel art
const COLOR_PALETTE = {
  skin: '#FDBCB4',
  hair: '#8B4513',
  hat: '#4B0082',
  robe: '#6A0DAD',
  staff: '#8B4513',
  magic: '#FFD700',
  shadow: '#2F2F2F',
  background: 'transparent',
};

export const PixelWizard: React.FC<PixelWizardProps> = ({
  x,
  y,
  animation,
  direction,
  size = 4, // 64x64 pixels (16x16 * 4)
  onAnimationComplete,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get animation data
  const animData = SPRITE_DATA[animation];
  const frameDuration = animData.duration / animData.frames;

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => {
        const nextFrame = (prev + 1) % animData.frames;
        if (nextFrame === 0 && onAnimationComplete) {
          onAnimationComplete();
        }
        return nextFrame;
      });
    }, frameDuration);

    return () => clearInterval(interval);
  }, [isAnimating, animData.frames, frameDuration, onAnimationComplete]);

  // Start animation when animation prop changes
  useEffect(() => {
    setIsAnimating(true);
    setCurrentFrame(0);
  }, [animation]);

  // Render pixel art
  const renderPixelArt = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size * 16;
    canvas.height = size * 16;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Get current frame sprite data
    const spriteData = animData.sprites[currentFrame];
    
    // Render pixel art
    for (let row = 0; row < 16; row++) {
      for (let col = 0; col < 16; col++) {
        const pixelIndex = row * 16 + col;
        const pixelValue = spriteData[pixelIndex];
        
        if (pixelValue !== '0') {
          // Set color based on pixel value
          let color = COLOR_PALETTE.background;
          switch (pixelValue) {
            case '1': color = COLOR_PALETTE.skin; break;
            case '2': color = COLOR_PALETTE.hair; break;
            case '3': color = COLOR_PALETTE.hat; break;
            case '4': color = COLOR_PALETTE.robe; break;
            case '5': color = COLOR_PALETTE.staff; break;
            case '6': color = COLOR_PALETTE.magic; break;
            case '7': color = COLOR_PALETTE.shadow; break;
          }
          
          if (color !== COLOR_PALETTE.background) {
            ctx.fillStyle = color;
            ctx.fillRect(col * size, row * size, size, size);
          }
        }
      }
    }
  }, [currentFrame, animData.sprites, size]);

  // Render on frame change
  useEffect(() => {
    renderPixelArt();
  }, [renderPixelArt]);

  // Get transform based on direction
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
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          width: size * 16,
          height: size * 16,
          imageRendering: 'pixelated', // Crisp pixel art
        }}
      />
    </motion.div>
  );
};

/**
 * Hook for managing pixel wizard animations
 */
export function usePixelWizard() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [animation, setAnimation] = useState<PixelWizardProps['animation']>('idle');
  const [direction, setDirection] = useState<PixelWizardProps['direction']>('right');

  const moveTo = (x: number, y: number, anim: PixelWizardProps['animation'] = 'walking') => {
    setPosition({ x, y });
    setAnimation(anim);
  };

  const playAnimation = (anim: PixelWizardProps['animation']) => {
    setAnimation(anim);
  };

  const setDirection = (dir: PixelWizardProps['direction']) => {
    setDirection(dir);
  };

  return {
    position,
    animation,
    direction,
    moveTo,
    playAnimation,
    setDirection,
  };
}

export default PixelWizard;
