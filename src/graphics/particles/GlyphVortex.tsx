/**
 * Glyph Vortex Particle System
 * Chaotic to ordered timeline with astral/alchemy motifs
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCurrentTheme } from '../../utils/timeTheme';
import { useWizardTier } from '../../state/wizardProgress';

interface GlyphParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  glyph: string;
  color: string;
  phase: 'chaotic' | 'vortex' | 'settle';
  targetX?: number;
  targetY?: number;
  clusterId?: number;
}

interface GlyphVortexProps {
  width?: number;
  height?: number;
  particleCount?: number;
  vibe?: 'playful' | 'serious';
  className?: string;
  onComplete?: () => void;
}

const GLYPHS = ['✦', '✧', '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⚡', '✨', '🌟', '💫', '⭐'];
const RUNES = ['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ', 'ᛇ', 'ᛈ', 'ᛉ', 'ᛊ', 'ᛏ', 'ᛒ', 'ᛖ', 'ᛗ', 'ᛚ', 'ᛜ', 'ᛞ', 'ᛟ'];

export const GlyphVortex: React.FC<GlyphVortexProps> = ({
  width = 800,
  height = 600,
  particleCount = 100,
  vibe = 'playful',
  className = '',
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<GlyphParticle[]>([]);
  const [phase, setPhase] = useState<'chaotic' | 'vortex' | 'settle'>('chaotic');
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const theme = useCurrentTheme();
  const wizardTier = useWizardTier();

  // Initialize particles
  const initializeParticles = useCallback(() => {
    const particles: GlyphParticle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        size: Math.random() * 8 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
        glyph: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        color: theme.particles.primary,
        phase: 'chaotic',
      });
    }
    
    particlesRef.current = particles;
  }, [particleCount, width, height, theme.particles.primary]);

  // Update particles based on current phase
  const updateParticles = useCallback(() => {
    const particles = particlesRef.current;
    const currentTime = Date.now();
    const phaseDuration = 3000; // 3 seconds per phase
    const totalDuration = phaseDuration * 3; // 9 seconds total
    
    // Calculate phase based on time
    const elapsed = (currentTime % totalDuration) / totalDuration;
    let currentPhase: 'chaotic' | 'vortex' | 'settle' = 'chaotic';
    
    if (elapsed < 0.33) {
      currentPhase = 'chaotic';
    } else if (elapsed < 0.66) {
      currentPhase = 'vortex';
    } else {
      currentPhase = 'settle';
    }
    
    setPhase(currentPhase);
    setProgress(elapsed);
    
    // Update particles based on phase
    particles.forEach((particle, index) => {
      particle.phase = currentPhase;
      
      switch (currentPhase) {
        case 'chaotic':
          // Chaotic movement - random velocities
          particle.vx += (Math.random() - 0.5) * 0.5;
          particle.vy += (Math.random() - 0.5) * 0.5;
          particle.vx *= 0.98; // Friction
          particle.vy *= 0.98;
          break;
          
        case 'vortex':
          // Vortex movement - spiral towards center
          const centerX = width / 2;
          const centerY = height / 2;
          const dx = centerX - particle.x;
          const dy = centerY - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx);
          
          // Spiral motion
          const spiralForce = 0.02;
          const vortexForce = 0.01;
          
          particle.vx += Math.cos(angle + Math.PI / 2) * spiralForce;
          particle.vy += Math.sin(angle + Math.PI / 2) * spiralForce;
          particle.vx += dx * vortexForce;
          particle.vy += dy * vortexForce;
          break;
          
        case 'settle':
          // Settle into clusters
          if (!particle.clusterId) {
            particle.clusterId = Math.floor(Math.random() * 5); // 5 clusters
          }
          
          const clusterX = (particle.clusterId % 3) * (width / 3) + width / 6;
          const clusterY = Math.floor(particle.clusterId / 3) * (height / 2) + height / 4;
          
          particle.targetX = clusterX;
          particle.targetY = clusterY;
          
          const targetDx = clusterX - particle.x;
          const targetDy = clusterY - particle.y;
          
          particle.vx += targetDx * 0.01;
          particle.vy += targetDy * 0.01;
          particle.vx *= 0.95;
          particle.vy *= 0.95;
          break;
      }
      
      // Apply vibe-based modifications
      if (vibe === 'playful') {
        particle.rotationSpeed *= 1.5;
        particle.size += Math.sin(currentTime * 0.01 + index) * 0.5;
      } else if (vibe === 'serious') {
        particle.rotationSpeed *= 0.7;
        particle.size *= 0.9;
      }
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;
      
      // Wrap around screen
      if (particle.x < 0) particle.x = width;
      if (particle.x > width) particle.x = 0;
      if (particle.y < 0) particle.y = height;
      if (particle.y > height) particle.y = 0;
      
      // Update life based on phase
      if (currentPhase === 'settle') {
        particle.life = Math.min(1, particle.life + 0.01);
      } else {
        particle.life = Math.max(0.3, particle.life - 0.005);
      }
    });
    
    // Check if animation is complete
    if (elapsed >= 0.95 && !isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [width, height, vibe, onComplete, isComplete]);

  // Render particles
  const renderParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    canvas.width = width;
    canvas.height = height;
    
    const particles = particlesRef.current;
    
    particles.forEach(particle => {
      if (particle.life <= 0) return;
      
      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      // Draw glyph
      ctx.font = `${particle.size}px serif`;
      ctx.fillStyle = particle.color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(particle.glyph, 0, 0);
      
      // Add glow effect for higher wizard tiers
      if (wizardTier.level >= 3) {
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 0.5;
        ctx.fillText(particle.glyph, 0, 0);
      }
      
      ctx.restore();
    });
    
    // Draw rune overlay during settle phase
    if (phase === 'settle' && wizardTier.level >= 4) {
      drawRuneOverlay(ctx);
    }
  }, [width, height, phase, wizardTier.level]);

  // Draw rune overlay for astral/alchemy motif
  const drawRuneOverlay = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.font = '24px serif';
    ctx.fillStyle = theme.particles.secondary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw runes in a circle
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 4;
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(RUNES[i % RUNES.length], 0, 0);
      ctx.restore();
    }
    
    ctx.restore();
  };

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateParticles();
      renderParticles();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateParticles, renderParticles]);

  // Initialize particles on mount
  useEffect(() => {
    initializeParticles();
  }, [initializeParticles]);

  // Reset animation when props change
  useEffect(() => {
    setIsComplete(false);
    setProgress(0);
    initializeParticles();
  }, [particleCount, vibe, initializeParticles]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: 'transparent',
        }}
      />
      
      {/* Phase indicator */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-mono">
        Phase: {phase} ({Math.round(progress * 100)}%)
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Hook for managing glyph vortex
 */
export function useGlyphVortex() {
  const [isActive, setIsActive] = useState(false);
  const [particleCount, setParticleCount] = useState(100);
  const [vibe, setVibe] = useState<'playful' | 'serious'>('playful');

  const startVortex = (count?: number, mood?: 'playful' | 'serious') => {
    if (count) setParticleCount(count);
    if (mood) setVibe(mood);
    setIsActive(true);
  };

  const stopVortex = () => {
    setIsActive(false);
  };

  return {
    isActive,
    particleCount,
    vibe,
    startVortex,
    stopVortex,
  };
}

export default GlyphVortex;
