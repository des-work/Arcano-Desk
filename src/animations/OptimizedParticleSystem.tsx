import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

// Optimized Particle Types
interface OptimizedParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'sparkle' | 'fire' | 'lightning' | 'ice' | 'magic' | 'energy' | 'dust' | 'orb';
  intensity: number;
  opacity: number;
  rotation: number;
  scale: number;
}

interface OptimizedParticleSystemConfig {
  type: 'sparkle-rain' | 'fire-storm' | 'lightning-burst' | 'ice-crystals' | 'magic-dust' | 'energy-flow' | 'orb-field';
  intensity: 'low' | 'medium' | 'high' | 'ultra';
  duration: number;
  maxParticles: number;
  performance: {
    quality: 'low' | 'medium' | 'high';
    adaptive: boolean;
    maxConcurrent: number;
  };
  colors: string[];
  size: { min: number; max: number };
  speed: { min: number; max: number };
  life: { min: number; max: number };
}

// Performance-optimized particle system
class OptimizedParticleSystem {
  private particles: OptimizedParticle[] = [];
  private config: OptimizedParticleSystemConfig;
  private animationId: number | null = null;
  private lastTime = 0;
  private performanceMetrics = {
    fps: 60,
    particleCount: 0,
    renderTime: 0
  };

  constructor(config: OptimizedParticleSystemConfig) {
    this.config = config;
  }

  // Create particles with performance optimization
  createParticles(count: number): OptimizedParticle[] {
    const particles: OptimizedParticle[] = [];
    const maxParticles = Math.min(count, this.config.maxParticles);
    
    for (let i = 0; i < maxParticles; i++) {
      particles.push(this.createParticle());
    }
    
    return particles;
  }

  private createParticle(): OptimizedParticle {
    const { size, speed, life, colors } = this.config;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * (speed.max - speed.min) + speed.min,
      vy: (Math.random() - 0.5) * (speed.max - speed.min) + speed.min,
      life: Math.random() * (life.max - life.min) + life.min,
      maxLife: Math.random() * (life.max - life.min) + life.min,
      size: Math.random() * (size.max - size.min) + size.min,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: this.getParticleType(),
      intensity: Math.random(),
      opacity: 1,
      rotation: Math.random() * 360,
      scale: 1
    };
  }

  private getParticleType(): OptimizedParticle['type'] {
    const types: OptimizedParticle['type'][] = ['sparkle', 'fire', 'lightning', 'ice', 'magic', 'energy', 'dust', 'orb'];
    return types[Math.floor(Math.random() * types.length)];
  }

  // Update particles with performance optimization
  updateParticles(deltaTime: number): void {
    const startTime = performance.now();
    
    // Adaptive particle count based on performance
    if (this.config.performance.adaptive) {
      this.adaptParticleCount();
    }
    
    // Update existing particles
    this.particles = this.particles.filter(particle => {
      particle.life -= deltaTime;
      
      if (particle.life <= 0) {
        return false; // Remove dead particles
      }
      
      // Update position
      particle.x += particle.vx * deltaTime * 0.016; // Normalize to 60fps
      particle.y += particle.vy * deltaTime * 0.016;
      
      // Update properties
      particle.opacity = particle.life / particle.maxLife;
      particle.rotation += deltaTime * 0.1;
      particle.scale = particle.opacity;
      
      // Apply physics based on type
      this.applyParticlePhysics(particle, deltaTime);
      
      return true;
    });
    
    // Create new particles if needed
    if (this.particles.length < this.config.maxParticles) {
      const newParticles = this.createParticles(
        Math.min(5, this.config.maxParticles - this.particles.length)
      );
      this.particles.push(...newParticles);
    }
    
    // Update performance metrics
    this.performanceMetrics.renderTime = performance.now() - startTime;
    this.performanceMetrics.particleCount = this.particles.length;
  }

  private adaptParticleCount(): void {
    const targetFPS = 60;
    const currentFPS = this.performanceMetrics.fps;
    
    if (currentFPS < 30) {
      // Reduce particles if performance is poor
      this.config.maxParticles = Math.max(10, this.config.maxParticles * 0.8);
    } else if (currentFPS > 55 && this.config.maxParticles < 100) {
      // Increase particles if performance is good
      this.config.maxParticles = Math.min(100, this.config.maxParticles * 1.1);
    }
  }

  private applyParticlePhysics(particle: OptimizedParticle, deltaTime: number): void {
    switch (particle.type) {
      case 'fire':
        particle.vy -= deltaTime * 0.01; // Fire rises
        particle.vx += (Math.random() - 0.5) * 0.01; // Flicker
        break;
      case 'lightning':
        particle.vx *= 0.99; // Slow down
        particle.vy *= 0.99;
        break;
      case 'ice':
        particle.vy += deltaTime * 0.005; // Ice falls
        particle.rotation += deltaTime * 0.05;
        break;
      case 'magic':
        particle.vx += Math.sin(particle.life * 0.01) * 0.01;
        particle.vy += Math.cos(particle.life * 0.01) * 0.01;
        break;
      case 'energy':
        particle.scale = 1 + Math.sin(particle.life * 0.02) * 0.2;
        break;
    }
  }

  getParticles(): OptimizedParticle[] {
    return this.particles;
  }

  getPerformanceMetrics() {
    return this.performanceMetrics;
  }

  destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.particles = [];
  }
}

// Optimized Particle System Component
export const OptimizedParticleSystem: React.FC<{
  config: OptimizedParticleSystemConfig;
  isActive: boolean;
  onComplete?: () => void;
}> = ({ config, isActive, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystemRef = useRef<OptimizedParticleSystem | null>(null);
  const animationRef = useRef<number>();

  // Initialize particle system
  useEffect(() => {
    if (isActive && !particleSystemRef.current) {
      particleSystemRef.current = new OptimizedParticleSystem(config);
    }
    
    return () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.destroy();
        particleSystemRef.current = null;
      }
    };
  }, [isActive, config]);

  // Animation loop
  useEffect(() => {
    if (!isActive || !particleSystemRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let lastTime = 0;
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Update particles
      particleSystemRef.current?.updateParticles(deltaTime);
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Render particles
      const particles = particleSystemRef.current?.getParticles() || [];
      particles.forEach(particle => {
        this.renderParticle(ctx, particle);
      });

      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive]);

  // Render individual particle with optimization
  const renderParticle = useCallback((ctx: CanvasRenderingContext2D, particle: OptimizedParticle) => {
    ctx.save();
    
    // Set particle properties
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.translate(particle.x, particle.y);
    ctx.rotate(particle.rotation * Math.PI / 180);
    ctx.scale(particle.scale, particle.scale);
    
    // Render based on type
    switch (particle.type) {
      case 'sparkle':
        this.renderSparkle(ctx, particle);
        break;
      case 'fire':
        this.renderFire(ctx, particle);
        break;
      case 'lightning':
        this.renderLightning(ctx, particle);
        break;
      case 'ice':
        this.renderIce(ctx, particle);
        break;
      case 'magic':
        this.renderMagic(ctx, particle);
        break;
      case 'energy':
        this.renderEnergy(ctx, particle);
        break;
      default:
        this.renderDefault(ctx, particle);
    }
    
    ctx.restore();
  }, []);

  // Optimized particle rendering methods
  const renderSparkle = (ctx: CanvasRenderingContext2D, particle: OptimizedParticle) => {
    ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
  };

  const renderFire = (ctx: CanvasRenderingContext2D, particle: OptimizedParticle) => {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
    ctx.fill();
  };

  const renderLightning = (ctx: CanvasRenderingContext2D, particle: OptimizedParticle) => {
    ctx.strokeStyle = particle.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-particle.size/2, -particle.size/2);
    ctx.lineTo(particle.size/2, particle.size/2);
    ctx.stroke();
  };

  const renderIce = (ctx: CanvasRenderingContext2D, particle: OptimizedParticle) => {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.moveTo(0, -particle.size/2);
    ctx.lineTo(particle.size/2, particle.size/2);
    ctx.lineTo(-particle.size/2, particle.size/2);
    ctx.closePath();
    ctx.fill();
  };

  const renderMagic = (ctx: CanvasRenderingContext2D, particle: OptimizedParticle) => {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(0, 0, particle.size/2, 0, Math.PI * 2);
    ctx.fill();
  };

  const renderEnergy = (ctx: CanvasRenderingContext2D, particle: OptimizedParticle) => {
    const gradient = ctx.createLinearGradient(-particle.size/2, 0, particle.size/2, 0);
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.5, particle.color);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(-particle.size/2, -particle.size/4, particle.size, particle.size/2);
  };

  const renderDefault = (ctx: CanvasRenderingContext2D, particle: OptimizedParticle) => {
    ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
  };

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
};

// Predefined particle system configurations
export const OPTIMIZED_PARTICLE_CONFIGS: Record<string, OptimizedParticleSystemConfig> = {
  'sparkle-rain': {
    type: 'sparkle-rain',
    intensity: 'medium',
    duration: 5000,
    maxParticles: 50,
    performance: { quality: 'high', adaptive: true, maxConcurrent: 3 },
    colors: ['#FFD700', '#FFA500', '#FF69B4', '#00BFFF'],
    size: { min: 2, max: 6 },
    speed: { min: 1, max: 3 },
    life: { min: 2000, max: 5000 }
  },
  'fire-storm': {
    type: 'fire-storm',
    intensity: 'high',
    duration: 8000,
    maxParticles: 80,
    performance: { quality: 'high', adaptive: true, maxConcurrent: 2 },
    colors: ['#FF4500', '#FF6347', '#FFD700', '#FF0000'],
    size: { min: 3, max: 8 },
    speed: { min: 2, max: 5 },
    life: { min: 3000, max: 6000 }
  },
  'magic-dust': {
    type: 'magic-dust',
    intensity: 'medium',
    duration: 6000,
    maxParticles: 60,
    performance: { quality: 'medium', adaptive: true, maxConcurrent: 4 },
    colors: ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981'],
    size: { min: 1, max: 4 },
    speed: { min: 0.5, max: 2 },
    life: { min: 4000, max: 8000 }
  },
  'energy-flow': {
    type: 'energy-flow',
    intensity: 'ultra',
    duration: 10000,
    maxParticles: 100,
    performance: { quality: 'high', adaptive: true, maxConcurrent: 1 },
    colors: ['#00FFFF', '#0080FF', '#8000FF', '#FF0080'],
    size: { min: 2, max: 10 },
    speed: { min: 1, max: 4 },
    life: { min: 5000, max: 10000 }
  }
};

export default OptimizedParticleSystem;
