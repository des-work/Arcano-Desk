/**
 * Progress Ribbon Component
 * Natural flowing ribbon with confidence-based thickness and wizard tier harmonics
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useWizardTier } from '../../state/wizardProgress';
import { useCurrentTheme } from '../../utils/timeTheme';
import { camera } from '../../tokens/motion';

interface RibbonPoint {
  x: number;
  y: number;
  confidence: number;
  timestamp: number;
}

interface ProgressRibbonProps {
  points: RibbonPoint[];
  width?: number;
  height?: number;
  className?: string;
  onPointComplete?: (point: RibbonPoint) => void;
  onRibbonComplete?: () => void;
}

export const ProgressRibbon: React.FC<ProgressRibbonProps> = ({
  points,
  width = 800,
  height = 200,
  className = '',
  onPointComplete,
  onRibbonComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  
  const wizardTier = useWizardTier();
  const theme = useCurrentTheme();

  // Calculate ribbon path using natural spline
  const calculateRibbonPath = useCallback((points: RibbonPoint[]) => {
    if (points.length < 2) return [];
    
    const path: { x: number; y: number; thickness: number; confidence: number }[] = [];
    
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      // Calculate control points for smooth curve
      const dx = next.x - current.x;
      const dy = next.y - current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Create smooth curve with multiple segments
      const segments = Math.max(3, Math.floor(distance / 20));
      
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const x = current.x + dx * t;
        const y = current.y + dy * t;
        
        // Interpolate confidence
        const confidence = current.confidence + (next.confidence - current.confidence) * t;
        
        // Calculate thickness based on confidence
        const baseThickness = 8;
        const confidenceThickness = confidence * 12;
        const thickness = baseThickness + confidenceThickness;
        
        path.push({ x, y, thickness, confidence });
      }
    }
    
    return path;
  }, []);

  // Add secondary harmonics for higher wizard tiers
  const addHarmonics = useCallback((path: any[]) => {
    if (wizardTier.level < 2) return path;
    
    return path.map((point, index) => {
      const harmonicAmplitude = 2 + (wizardTier.level - 2) * 0.5;
      const harmonicFrequency = 0.1;
      const harmonicPhase = index * harmonicFrequency;
      
      const harmonicX = Math.sin(harmonicPhase) * harmonicAmplitude;
      const harmonicY = Math.cos(harmonicPhase * 1.3) * harmonicAmplitude * 0.5;
      
      return {
        ...point,
        x: point.x + harmonicX,
        y: point.y + harmonicY,
      };
    });
  }, [wizardTier.level]);

  // Render ribbon
  const renderRibbon = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    if (points.length < 2) return;
    
    // Calculate ribbon path
    let ribbonPath = calculateRibbonPath(points);
    ribbonPath = addHarmonics(ribbonPath);
    
    // Apply camera offset
    ribbonPath = ribbonPath.map(point => ({
      ...point,
      x: point.x + cameraOffset.x,
      y: point.y + cameraOffset.y,
    }));
    
    // Draw ribbon
    ctx.save();
    
    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, theme.particles.primary);
    gradient.addColorStop(0.5, theme.particles.secondary);
    gradient.addColorStop(1, theme.particles.glow);
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = theme.particles.primary;
    ctx.lineWidth = 2;
    
    // Draw ribbon segments
    for (let i = 0; i < ribbonPath.length - 1; i++) {
      const current = ribbonPath[i];
      const next = ribbonPath[i + 1];
      
      // Calculate ribbon width
      const width = Math.max(2, current.thickness);
      
      // Draw ribbon segment
      ctx.beginPath();
      ctx.moveTo(current.x - width / 2, current.y);
      ctx.lineTo(next.x - width / 2, next.y);
      ctx.lineTo(next.x + width / 2, next.y);
      ctx.lineTo(current.x + width / 2, current.y);
      ctx.closePath();
      ctx.fill();
      
      // Add glow effect for higher tiers
      if (wizardTier.level >= 4) {
        ctx.shadowColor = theme.particles.glow;
        ctx.shadowBlur = width * 0.5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
    
    // Draw points
    points.forEach((point, index) => {
      if (index > currentPointIndex) return;
      
      const pathPoint = ribbonPath[Math.floor((index / points.length) * ribbonPath.length)];
      if (!pathPoint) return;
      
      const x = pathPoint.x + cameraOffset.x;
      const y = pathPoint.y + cameraOffset.y;
      const radius = 6 + point.confidence * 4;
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = theme.particles.primary;
      ctx.fill();
      
      // Add pulse effect for completed points
      if (index === currentPointIndex) {
        ctx.beginPath();
        ctx.arc(x, y, radius * 1.5, 0, Math.PI * 2);
        ctx.strokeStyle = theme.particles.glow;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
    
    ctx.restore();
  }, [points, width, height, calculateRibbonPath, addHarmonics, cameraOffset, theme, wizardTier.level, currentPointIndex]);

  // Animate ribbon progression
  const animateRibbon = useCallback(() => {
    if (currentPointIndex < points.length) {
      setCurrentPointIndex(prev => prev + 1);
      
      // Trigger point completion callback
      if (onPointComplete) {
        onPointComplete(points[currentPointIndex]);
      }
      
      // Add camera movement for higher tiers
      if (wizardTier.level >= 3) {
        const point = points[currentPointIndex];
        const targetX = (width / 2) - point.x;
        const targetY = (height / 2) - point.y;
        
        setCameraOffset(prev => ({
          x: prev.x + targetX * 0.1,
          y: prev.y + targetY * 0.1,
        }));
      }
      
      // Continue animation
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animateRibbon);
      }, 500); // 500ms between points
    } else {
      // Ribbon complete
      setIsAnimating(false);
      if (onRibbonComplete) {
        onRibbonComplete();
      }
    }
  }, [points, currentPointIndex, onPointComplete, onRibbonComplete, wizardTier.level, width, height]);

  // Start animation
  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCurrentPointIndex(0);
    setCameraOffset({ x: 0, y: 0 });
    
    // Start animation loop
    animationRef.current = requestAnimationFrame(animateRibbon);
  }, [isAnimating, animateRibbon]);

  // Render loop
  useEffect(() => {
    const render = () => {
      renderRibbon();
      animationRef.current = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [renderRibbon]);

  // Auto-start animation when points change
  useEffect(() => {
    if (points.length > 0) {
      startAnimation();
    }
  }, [points, startAnimation]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: 'transparent',
        }}
      />
      
      {/* Progress indicator */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-mono">
        {currentPointIndex} / {points.length}
      </div>
      
      {/* Confidence indicator */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Confidence: {points[currentPointIndex]?.confidence?.toFixed(2) || '0.00'}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for managing progress ribbon
 */
export function useProgressRibbon() {
  const [points, setPoints] = useState<RibbonPoint[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const addPoint = (point: RibbonPoint) => {
    setPoints(prev => [...prev, point]);
  };

  const updatePoint = (index: number, updates: Partial<RibbonPoint>) => {
    setPoints(prev => prev.map((point, i) => 
      i === index ? { ...point, ...updates } : point
    ));
  };

  const clearPoints = () => {
    setPoints([]);
    setIsComplete(false);
  };

  const completeRibbon = () => {
    setIsComplete(true);
  };

  return {
    points,
    isComplete,
    addPoint,
    updatePoint,
    clearPoints,
    completeRibbon,
  };
}

/**
 * Topic Nodes Component
 * Interactive nodes that connect to form the ribbon
 */
export const TopicNodes: React.FC<{
  topics: string[];
  onTopicSelect?: (topic: string, index: number) => void;
  className?: string;
}> = ({ topics, onTopicSelect, className = '' }) => {
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const handleTopicClick = (topic: string, index: number) => {
    setSelectedTopic(index);
    if (onTopicSelect) {
      onTopicSelect(topic, index);
    }
  };

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {topics.map((topic, index) => (
        <motion.button
          key={index}
          onClick={() => handleTopicClick(topic, index)}
          className={`px-4 py-2 rounded-lg font-wizard transition-all duration-300 ${
            selectedTopic === index
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
              : 'bg-purple-700/50 text-purple-300 hover:bg-purple-600/50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{
            boxShadow: selectedTopic === index 
              ? ['0 4px 15px rgba(147, 51, 234, 0.3)', '0 8px 25px rgba(147, 51, 234, 0.4)', '0 4px 15px rgba(147, 51, 234, 0.3)']
              : '0 4px 15px rgba(0, 0, 0, 0.1)',
          }}
          transition={{
            duration: 2,
            repeat: selectedTopic === index ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          {topic}
        </motion.button>
      ))}
    </div>
  );
};

export default ProgressRibbon;
