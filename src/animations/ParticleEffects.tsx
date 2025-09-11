import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'sparkle' | 'fire' | 'lightning' | 'ice' | 'magic' | 'dust';
}

interface ParticleSystemProps {
  type: 'sparkles' | 'fire' | 'lightning' | 'ice' | 'magic-dust' | 'energy-flow';
  intensity: 'subtle' | 'gentle' | 'moderate' | 'intense' | 'epic';
  duration?: number;
  count?: number;
  isActive: boolean;
  onComplete?: () => void;
}

export const ParticleSystem: React.FC<ParticleSystemProps> = ({
  type,
  intensity,
  duration = 3000,
  count = 50,
  isActive,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const getIntensityMultiplier = (intensity: string): number => {
    const multipliers = {
      subtle: 0.3,
      gentle: 0.5,
      moderate: 0.7,
      intense: 0.9,
      epic: 1.0
    };
    return multipliers[intensity as keyof typeof multipliers] || 0.7;
  };

  const createParticle = (): Particle => {
    const intensityMultiplier = getIntensityMultiplier(intensity);
    const baseCount = Math.floor(count * intensityMultiplier);
    const actualCount = Math.max(1, baseCount);

    const particleTypes = {
      sparkles: {
        colors: ['#FBBF24', '#F59E0B', '#D97706', '#FDE047'],
        sizes: [1, 3],
        speeds: [0.5, 2],
        life: [1000, 3000]
      },
      fire: {
        colors: ['#EF4444', '#F97316', '#F59E0B', '#FBBF24'],
        sizes: [2, 6],
        speeds: [1, 3],
        life: [800, 2000]
      },
      lightning: {
        colors: ['#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'],
        sizes: [1, 4],
        speeds: [2, 5],
        life: [200, 800]
      },
      ice: {
        colors: ['#06B6D4', '#22D3EE', '#67E8F9', '#A5F3FC'],
        sizes: [1, 4],
        speeds: [0.3, 1.5],
        life: [1500, 4000]
      },
      'magic-dust': {
        colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE'],
        sizes: [1, 3],
        speeds: [0.2, 1],
        life: [2000, 5000]
      },
      'energy-flow': {
        colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
        sizes: [2, 5],
        speeds: [0.5, 2],
        life: [1000, 3000]
      }
    };

    const config = particleTypes[type as keyof typeof particleTypes] || particleTypes.sparkles;
    const color = config.colors[Math.floor(Math.random() * config.colors.length)];
    const size = config.sizes[0] + Math.random() * (config.sizes[1] - config.sizes[0]);
    const speed = config.speeds[0] + Math.random() * (config.speeds[1] - config.speeds[0]);
    const life = config.life[0] + Math.random() * (config.life[1] - config.life[0]);

    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (canvasRef.current?.width || 800),
      y: Math.random() * (canvasRef.current?.height || 600),
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed - 0.5, // Slight upward bias
      life: life,
      maxLife: life,
      size: size,
      color: color,
      type: type.split('-')[0] as any
    };
  };

  const updateParticles = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 16; // Assuming 60fps

      // Apply gravity for fire particles
      if (type === 'fire') {
        particle.vy += 0.02;
      }

      // Apply wind for magic dust
      if (type === 'magic-dust') {
        particle.vx += (Math.random() - 0.5) * 0.1;
      }

      // Draw particle
      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      
      if (particle.type === 'sparkle') {
        // Draw sparkle as a star
        drawSparkle(ctx, particle.x, particle.y, particle.size);
      } else if (particle.type === 'fire') {
        // Draw fire as a flame
        drawFlame(ctx, particle.x, particle.y, particle.size);
      } else if (particle.type === 'lightning') {
        // Draw lightning as a jagged line
        drawLightning(ctx, particle.x, particle.y, particle.size);
      } else {
        // Draw as circle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();

      return particle.life > 0;
    });

    // Add new particles
    if (particlesRef.current.length < count * getIntensityMultiplier(intensity)) {
      particlesRef.current.push(createParticle());
    }
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI * 2);
    
    // Draw star shape
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const radius = i % 2 === 0 ? size : size * 0.5;
      const px = Math.cos(angle) * radius;
      const py = Math.sin(angle) * radius;
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };

  const drawFlame = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    
    // Draw flame shape
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.quadraticCurveTo(-size * 0.5, -size * 0.5, 0, -size);
    ctx.quadraticCurveTo(size * 0.5, -size * 0.5, 0, size);
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
  };

  const drawLightning = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.save();
    ctx.translate(x, y);
    
    // Draw jagged lightning
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size * 0.3, -size * 0.5);
    ctx.lineTo(size * 0.3, -size * 0.2);
    ctx.lineTo(-size * 0.2, size * 0.2);
    ctx.lineTo(size * 0.4, size * 0.5);
    ctx.lineTo(0, size);
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.restore();
  };

  const animate = () => {
    updateParticles();
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isActive && !isRunning) {
      setIsRunning(true);
      particlesRef.current = [];
      
      // Initialize particles
      for (let i = 0; i < count * getIntensityMultiplier(intensity); i++) {
        particlesRef.current.push(createParticle());
      }
      
      animate();
      
      // Auto-stop after duration
      const timeout = setTimeout(() => {
        setIsRunning(false);
        onComplete?.();
      }, duration);
      
      return () => clearTimeout(timeout);
    } else if (!isActive && isRunning) {
      setIsRunning(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isActive, isRunning, duration, count, intensity, onComplete]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
};

// Magical Dust Effect
export const MagicalDust: React.FC<{
  isActive: boolean;
  intensity?: 'subtle' | 'gentle' | 'moderate' | 'intense' | 'epic';
  duration?: number;
}> = ({ isActive, intensity = 'moderate', duration = 3000 }) => {
  return (
    <ParticleSystem
      type="magic-dust"
      intensity={intensity}
      duration={duration}
      count={30}
      isActive={isActive}
    />
  );
};

// Sparkle Rain Effect
export const SparkleRain: React.FC<{
  isActive: boolean;
  intensity?: 'subtle' | 'gentle' | 'moderate' | 'intense' | 'epic';
  duration?: number;
}> = ({ isActive, intensity = 'moderate', duration = 2000 }) => {
  return (
    <ParticleSystem
      type="sparkles"
      intensity={intensity}
      duration={duration}
      count={40}
      isActive={isActive}
    />
  );
};

// Fire and Lightning Effect
export const FireAndLightning: React.FC<{
  isActive: boolean;
  intensity?: 'subtle' | 'gentle' | 'moderate' | 'intense' | 'epic';
  duration?: number;
}> = ({ isActive, intensity = 'intense', duration = 4000 }) => {
  const [showFire, setShowFire] = useState(false);
  const [showLightning, setShowLightning] = useState(false);

  useEffect(() => {
    if (isActive) {
      setShowFire(true);
      setTimeout(() => setShowLightning(true), 1000);
    } else {
      setShowFire(false);
      setShowLightning(false);
    }
  }, [isActive]);

  return (
    <>
      <ParticleSystem
        type="fire"
        intensity={intensity}
        duration={duration}
        count={25}
        isActive={showFire}
      />
      <ParticleSystem
        type="lightning"
        intensity={intensity}
        duration={duration - 1000}
        count={15}
        isActive={showLightning}
      />
    </>
  );
};

// Energy Flow Effect
export const EnergyFlow: React.FC<{
  isActive: boolean;
  intensity?: 'subtle' | 'gentle' | 'moderate' | 'intense' | 'epic';
  duration?: number;
}> = ({ isActive, intensity = 'moderate', duration = 5000 }) => {
  return (
    <ParticleSystem
      type="energy-flow"
      intensity={intensity}
      duration={duration}
      count={35}
      isActive={isActive}
    />
  );
};

// Ice Crystals Effect
export const IceCrystals: React.FC<{
  isActive: boolean;
  intensity?: 'subtle' | 'gentle' | 'moderate' | 'intense' | 'epic';
  duration?: number;
}> = ({ isActive, intensity = 'moderate', duration = 3000 }) => {
  return (
    <ParticleSystem
      type="ice"
      intensity={intensity}
      duration={duration}
      count={20}
      isActive={isActive}
    />
  );
};

export default ParticleSystem;
