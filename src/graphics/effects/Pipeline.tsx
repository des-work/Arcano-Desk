/**
 * Graphics Pipeline Effects
 * Post-processing pipeline with ACES tonemapping, bloom, and fade mode
 */

import React, { useRef, useEffect, useState } from 'react';
import { useCurrentTheme } from '../../utils/timeTheme';
import { useFadeMode } from '../../utils/sessionMode';

interface PipelineProps {
  children: React.ReactNode;
  className?: string;
  enableBloom?: boolean;
  enableFog?: boolean;
  enableTonemapping?: boolean;
}

export const Pipeline: React.FC<PipelineProps> = ({
  children,
  className = '',
  enableBloom = true,
  enableFog = true,
  enableTonemapping = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const theme = useCurrentTheme();
  const fadeMode = useFadeMode();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    setIsInitialized(true);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Apply post-processing effects
  useEffect(() => {
    if (!isInitialized) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply fade mode intensity multiplier
    const fadeIntensity = fadeMode ? 0.65 : 1.0;

    // Apply theme-based effects
    if (enableTonemapping) {
      applyACESTonemapping(ctx, canvas, theme, fadeIntensity);
    }

    if (enableBloom) {
      applyBloomEffect(ctx, canvas, theme, fadeIntensity);
    }

    if (enableFog) {
      applyFogEffect(ctx, canvas, theme, fadeIntensity);
    }

  }, [isInitialized, theme, fadeMode, enableBloom, enableFog, enableTonemapping]);

  const applyACESTonemapping = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    theme: any,
    fadeIntensity: number
  ) => {
    // ACES tonemapping implementation
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;

      // ACES tone mapping
      const aces = [
        r * 0.59719 + g * 0.35458 + b * 0.04823,
        r * 0.07600 + g * 0.90834 + b * 0.01566,
        r * 0.02840 + g * 0.13383 + b * 0.83777,
      ];

      // Apply fade intensity
      const fadedAces = aces.map(v => v * fadeIntensity);

      // Convert back to RGB
      const newR = Math.min(255, Math.max(0, fadedAces[0] * 255));
      const newG = Math.min(255, Math.max(0, fadedAces[1] * 255));
      const newB = Math.min(255, Math.max(0, fadedAces[2] * 255));

      data[i] = newR;
      data[i + 1] = newG;
      data[i + 2] = newB;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyBloomEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    theme: any,
    fadeIntensity: number
  ) => {
    // Create bloom effect using theme bloom threshold
    const bloomThreshold = theme.bloomThreshold * fadeIntensity;
    
    // Create a temporary canvas for bloom
    const bloomCanvas = document.createElement('canvas');
    bloomCanvas.width = canvas.width;
    bloomCanvas.height = canvas.height;
    const bloomCtx = bloomCanvas.getContext('2d');
    
    if (!bloomCtx) return;

    // Get current canvas content
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const bloomData = bloomCtx.createImageData(canvas.width, canvas.height);
    
    // Apply bloom threshold
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i] / 255;
      const g = imageData.data[i + 1] / 255;
      const b = imageData.data[i + 2] / 255;
      const a = imageData.data[i + 3] / 255;
      
      // Calculate luminance
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      
      if (luminance > bloomThreshold) {
        // Apply bloom with theme colors
        bloomData.data[i] = theme.particles.primary[1] === 'F' ? 255 : 0; // R
        bloomData.data[i + 1] = theme.particles.primary[3] === 'F' ? 255 : 0; // G
        bloomData.data[i + 2] = theme.particles.primary[5] === 'F' ? 255 : 0; // B
        bloomData.data[i + 3] = a * 255;
      } else {
        bloomData.data[i] = 0;
        bloomData.data[i + 1] = 0;
        bloomData.data[i + 2] = 0;
        bloomData.data[i + 3] = 0;
      }
    }
    
    bloomCtx.putImageData(bloomData, 0, 0);
    
    // Apply blur to bloom
    ctx.filter = 'blur(2px)';
    ctx.globalAlpha = 0.3 * fadeIntensity;
    ctx.drawImage(bloomCanvas, 0, 0);
    ctx.filter = 'none';
    ctx.globalAlpha = 1;
  };

  const applyFogEffect = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    theme: any,
    fadeIntensity: number
  ) => {
    // Apply atmospheric fog
    const fogDensity = theme.fog.density * fadeIntensity;
    
    if (fogDensity > 0) {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 2
      );
      
      gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
      gradient.addColorStop(1, `${theme.fog.color}${Math.floor(fogDensity * 255).toString(16).padStart(2, '0')}`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Post-processing canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          mixBlendMode: 'screen',
          opacity: fadeMode ? 0.7 : 1,
        }}
      />
      
      {/* UI text exclusion mask */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="w-full h-full" style={{
          background: 'linear-gradient(transparent, transparent)',
          WebkitMask: 'linear-gradient(black, black)',
          mask: 'linear-gradient(black, black)',
        }} />
      </div>
    </div>
  );
};

/**
 * Hook for managing pipeline effects
 */
export function usePipelineEffects() {
  const [effects, setEffects] = useState({
    bloom: true,
    fog: true,
    tonemapping: true,
    fadeMode: false,
  });

  const toggleEffect = (effect: keyof typeof effects) => {
    setEffects(prev => ({
      ...prev,
      [effect]: !prev[effect],
    }));
  };

  const setFadeMode = (enabled: boolean) => {
    setEffects(prev => ({
      ...prev,
      fadeMode: enabled,
    }));
  };

  return {
    effects,
    toggleEffect,
    setFadeMode,
  };
}

/**
 * Performance monitoring for pipeline effects
 */
export function usePipelinePerformance() {
  const [fps, setFps] = useState(60);
  const [frameTime, setFrameTime] = useState(16.67);
  const [qualityLevel, setQualityLevel] = useState(1.0);

  useEffect(() => {
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsSum = 0;

    const measurePerformance = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      frameCount++;
      fpsSum += 1000 / deltaTime;
      
      if (frameCount % 60 === 0) {
        const avgFps = fpsSum / 60;
        setFps(avgFps);
        setFrameTime(1000 / avgFps);
        
        // Adjust quality based on performance
        if (avgFps < 30) {
          setQualityLevel(prev => Math.max(0.5, prev * 0.9));
        } else if (avgFps > 55) {
          setQualityLevel(prev => Math.min(1.0, prev * 1.1));
        }
        
        fpsSum = 0;
      }
      
      lastTime = currentTime;
      requestAnimationFrame(measurePerformance);
    };

    requestAnimationFrame(measurePerformance);
  }, []);

  return {
    fps,
    frameTime,
    qualityLevel,
  };
}

export default Pipeline;
