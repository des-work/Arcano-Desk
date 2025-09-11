import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';

// Advanced Particle Types
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
  type: 'sparkle' | 'fire' | 'lightning' | 'ice' | 'magic' | 'energy' | 'dust' | 'orb';
  intensity: number;
  physics: {
    gravity?: number;
    friction?: number;
    bounce?: number;
    attraction?: { x: number; y: number; strength: number };
  };
  effects: {
    glow?: boolean;
    trail?: boolean;
    pulse?: boolean;
    rotate?: boolean;
    scale?: boolean;
  };
}

interface ParticleSystemConfig {
  type: 'sparkle-rain' | 'fire-storm' | 'lightning-burst' | 'ice-crystals' | 'magic-dust' | 'energy-flow' | 'orb-field';
  intensity: 'low' | 'medium' | 'high' | 'ultra';
  duration: number;
  particleCount: number;
  physics: {
    gravity: number;
    friction: number;
    bounce: number;
    turbulence: number;
  };
  colors: string[];
  size: { min: number; max: number };
  speed: { min: number; max: number };
  life: { min: number; max: number };
  effects: {
    glow: boolean;
    trail: boolean;
    pulse: boolean;
    rotate: boolean;
    scale: boolean;
    attraction: boolean;
  };
  performance: {
    adaptive: boolean;
    maxParticles: number;
    quality: 'low' | 'medium' | 'high' | 'ultra';
  };
}

// Particle Physics Engine
class ParticlePhysicsEngine {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationId: number | null = null;
  private lastTime = 0;
  private deltaTime = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.setupCanvas();
  }

  private setupCanvas() {
    if (!this.canvas || !this.ctx) return;
    
    const resizeCanvas = () => {
      if (!this.canvas) return;
      this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
      this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
      this.ctx?.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  addParticle(particle: Particle) {
    this.particles.push(particle);
  }

  addParticleSystem(config: ParticleSystemConfig, x: number, y: number) {
    const particleCount = config.performance.adaptive 
      ? Math.min(config.particleCount, config.performance.maxParticles)
      : config.particleCount;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
      const life = config.life.min + Math.random() * (config.life.max - config.life.min);
      const size = config.size.min + Math.random() * (config.size.max - config.size.min);
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];

      const particle: Particle = {
        id: `${config.type}_${Date.now()}_${i}`,
        x: x + (Math.random() - 0.5) * 20,
        y: y + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: life,
        maxLife: life,
        size: size,
        color: color,
        type: this.getParticleType(config.type),
        intensity: this.getIntensityValue(config.intensity),
        physics: {
          gravity: config.physics.gravity,
          friction: config.physics.friction,
          bounce: config.physics.bounce
        },
        effects: {
          glow: config.effects.glow,
          trail: config.effects.trail,
          pulse: config.effects.pulse,
          rotate: config.effects.rotate,
          scale: config.effects.scale
        }
      };

      this.addParticle(particle);
    }
  }

  private getParticleType(systemType: string): Particle['type'] {
    const typeMap: Record<string, Particle['type']> = {
      'sparkle-rain': 'sparkle',
      'fire-storm': 'fire',
      'lightning-burst': 'lightning',
      'ice-crystals': 'ice',
      'magic-dust': 'magic',
      'energy-flow': 'energy',
      'orb-field': 'orb'
    };
    return typeMap[systemType] || 'sparkle';
  }

  private getIntensityValue(intensity: string): number {
    const intensityMap: Record<string, number> = {
      'low': 0.3,
      'medium': 0.6,
      'high': 0.8,
      'ultra': 1.0
    };
    return intensityMap[intensity] || 0.6;
  }

  update(deltaTime: number) {
    this.deltaTime = deltaTime;
    
    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update physics
      this.updateParticlePhysics(particle);
      
      // Update life
      particle.life -= deltaTime;
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      
      // Update position
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
    }
  }

  private updateParticlePhysics(particle: Particle) {
    // Apply gravity
    if (particle.physics.gravity) {
      particle.vy += particle.physics.gravity * this.deltaTime;
    }
    
    // Apply friction
    if (particle.physics.friction) {
      particle.vx *= 1 - particle.physics.friction * this.deltaTime;
      particle.vy *= 1 - particle.physics.friction * this.deltaTime;
    }
    
    // Apply attraction
    if (particle.physics.attraction) {
      const dx = particle.physics.attraction.x - particle.x;
      const dy = particle.physics.attraction.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance > 0) {
        const force = particle.physics.attraction.strength / (distance * distance);
        particle.vx += (dx / distance) * force * this.deltaTime;
        particle.vy += (dy / distance) * force * this.deltaTime;
      }
    }
    
    // Apply turbulence
    particle.vx += (Math.random() - 0.5) * 0.1;
    particle.vy += (Math.random() - 0.5) * 0.1;
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      this.renderParticle(particle);
    });
  }

  private renderParticle(particle: Particle) {
    if (!this.ctx) return;
    
    const alpha = particle.life / particle.maxLife;
    const size = particle.size * alpha;
    
    this.ctx.save();
    this.ctx.globalAlpha = alpha * particle.intensity;
    
    // Apply effects
    if (particle.effects.glow) {
      this.ctx.shadowBlur = size * 2;
      this.ctx.shadowColor = particle.color;
    }
    
    if (particle.effects.pulse) {
      const pulseSize = size * (1 + Math.sin(Date.now() * 0.01) * 0.3);
      this.ctx.scale(pulseSize / size, pulseSize / size);
    }
    
    if (particle.effects.rotate) {
      this.ctx.translate(particle.x, particle.y);
      this.ctx.rotate(Date.now() * 0.001);
      this.ctx.translate(-particle.x, -particle.y);
    }
    
    // Render particle based on type
    this.renderParticleType(particle, size);
    
    this.ctx.restore();
  }

  private renderParticleType(particle: Particle, size: number) {
    if (!this.ctx) return;
    
    this.ctx.fillStyle = particle.color;
    
    switch (particle.type) {
      case 'sparkle':
        this.renderSparkle(particle.x, particle.y, size);
        break;
      case 'fire':
        this.renderFire(particle.x, particle.y, size);
        break;
      case 'lightning':
        this.renderLightning(particle.x, particle.y, size);
        break;
      case 'ice':
        this.renderIce(particle.x, particle.y, size);
        break;
      case 'magic':
        this.renderMagic(particle.x, particle.y, size);
        break;
      case 'energy':
        this.renderEnergy(particle.x, particle.y, size);
        break;
      case 'orb':
        this.renderOrb(particle.x, particle.y, size);
        break;
      default:
        this.renderDefault(particle.x, particle.y, size);
    }
  }

  private renderSparkle(x: number, y: number, size: number) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x + size * 0.3, y - size * 0.3);
    this.ctx.lineTo(x + size, y);
    this.ctx.lineTo(x + size * 0.3, y + size * 0.3);
    this.ctx.lineTo(x, y + size);
    this.ctx.lineTo(x - size * 0.3, y + size * 0.3);
    this.ctx.lineTo(x - size, y);
    this.ctx.lineTo(x - size * 0.3, y - size * 0.3);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private renderFire(x: number, y: number, size: number) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add flame effect
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size);
    this.ctx.quadraticCurveTo(x + size * 0.5, y - size * 1.5, x, y - size * 2);
    this.ctx.quadraticCurveTo(x - size * 0.5, y - size * 1.5, x, y - size);
    this.ctx.fill();
  }

  private renderLightning(x: number, y: number, size: number) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x - size, y - size);
    this.ctx.lineTo(x + size, y + size);
    this.ctx.lineWidth = size * 0.3;
    this.ctx.stroke();
    
    this.ctx.beginPath();
    this.ctx.moveTo(x + size, y - size);
    this.ctx.lineTo(x - size, y + size);
    this.ctx.stroke();
  }

  private renderIce(x: number, y: number, size: number) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.moveTo(x, y - size);
    this.ctx.lineTo(x + size * 0.6, y - size * 0.3);
    this.ctx.lineTo(x + size * 0.3, y + size * 0.3);
    this.ctx.lineTo(x, y + size);
    this.ctx.lineTo(x - size * 0.3, y + size * 0.3);
    this.ctx.lineTo(x - size * 0.6, y - size * 0.3);
    this.ctx.closePath();
    this.ctx.fill();
  }

  private renderMagic(x: number, y: number, size: number) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add magical sparkles
    for (let i = 0; i < 3; i++) {
      const angle = (Math.PI * 2 * i) / 3;
      const sparkleX = x + Math.cos(angle) * size * 1.5;
      const sparkleY = y + Math.sin(angle) * size * 1.5;
      
      this.ctx.beginPath();
      this.ctx.arc(sparkleX, sparkleY, size * 0.3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private renderEnergy(x: number, y: number, size: number) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Add energy rings
    for (let i = 1; i <= 2; i++) {
      this.ctx.beginPath();
      this.ctx.arc(x, y, size * i, 0, Math.PI * 2);
      this.ctx.stroke();
    }
  }

  private renderOrb(x: number, y: number, size: number) {
    if (!this.ctx) return;
    
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderDefault(x: number, y: number, size: number) {
    if (!this.ctx) return;
    
    this.ctx.beginPath();
    this.ctx.arc(x, y, size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  start() {
    const animate = (currentTime: number) => {
      if (this.lastTime === 0) this.lastTime = currentTime;
      this.deltaTime = (currentTime - this.lastTime) / 1000;
      this.lastTime = currentTime;
      
      this.update(this.deltaTime);
      this.render();
      
      this.animationId = requestAnimationFrame(animate);
    };
    
    this.animationId = requestAnimationFrame(animate);
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  clear() {
    this.particles = [];
  }

  getParticleCount(): number {
    return this.particles.length;
  }
}

// Ultra Particle System Component
export const UltraParticleSystem: React.FC<{
  config: ParticleSystemConfig;
  isActive: boolean;
  position?: { x: number; y: number };
  onComplete?: () => void;
}> = ({ config, isActive, position = { x: 0.5, y: 0.5 }, onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const physicsEngine = useRef<ParticlePhysicsEngine | null>(null);
  const [particleCount, setParticleCount] = React.useState(0);

  useEffect(() => {
    if (canvasRef.current && !physicsEngine.current) {
      physicsEngine.current = new ParticlePhysicsEngine(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    if (isActive && physicsEngine.current) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const x = position.x * canvas.offsetWidth;
      const y = position.y * canvas.offsetHeight;

      physicsEngine.current.addParticleSystem(config, x, y);
      physicsEngine.current.start();

      // Auto-complete after duration
      const timer = setTimeout(() => {
        if (onComplete) onComplete();
      }, config.duration);

      return () => {
        clearTimeout(timer);
        physicsEngine.current?.stop();
      };
    } else if (!isActive && physicsEngine.current) {
      physicsEngine.current.stop();
      physicsEngine.current.clear();
    }
  }, [isActive, config, position, onComplete]);

  // Update particle count
  useEffect(() => {
    if (!physicsEngine.current) return;

    const interval = setInterval(() => {
      if (physicsEngine.current) {
        setParticleCount(physicsEngine.current.getParticleCount());
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}
      />
      
      {/* Performance indicator */}
      {config.performance.adaptive && (
        <div className="absolute top-4 right-4 text-xs text-purple-300 bg-black/50 px-2 py-1 rounded">
          Particles: {particleCount}
        </div>
      )}
    </div>
  );
};

// Predefined particle system configurations
export const PARTICLE_SYSTEMS: Record<string, ParticleSystemConfig> = {
  'sparkle-rain': {
    type: 'sparkle-rain',
    intensity: 'high',
    duration: 3000,
    particleCount: 50,
    physics: { gravity: 0.1, friction: 0.02, bounce: 0.3, turbulence: 0.05 },
    colors: ['#FFD700', '#FFA500', '#FF69B4', '#00BFFF'],
    size: { min: 2, max: 6 },
    speed: { min: 1, max: 3 },
    life: { min: 2000, max: 4000 },
    effects: { glow: true, trail: false, pulse: true, rotate: true, scale: true, attraction: false },
    performance: { adaptive: true, maxParticles: 100, quality: 'high' }
  },
  'fire-storm': {
    type: 'fire-storm',
    intensity: 'ultra',
    duration: 5000,
    particleCount: 80,
    physics: { gravity: -0.05, friction: 0.01, bounce: 0.1, turbulence: 0.1 },
    colors: ['#FF4500', '#FF6347', '#FFD700', '#FF0000'],
    size: { min: 3, max: 8 },
    speed: { min: 2, max: 5 },
    life: { min: 1500, max: 3000 },
    effects: { glow: true, trail: true, pulse: true, rotate: false, scale: true, attraction: false },
    performance: { adaptive: true, maxParticles: 150, quality: 'ultra' }
  },
  'lightning-burst': {
    type: 'lightning-burst',
    intensity: 'ultra',
    duration: 2000,
    particleCount: 30,
    physics: { gravity: 0, friction: 0.05, bounce: 0.8, turbulence: 0.2 },
    colors: ['#00BFFF', '#FFFFFF', '#87CEEB', '#4169E1'],
    size: { min: 4, max: 10 },
    speed: { min: 5, max: 10 },
    life: { min: 500, max: 1000 },
    effects: { glow: true, trail: true, pulse: true, rotate: false, scale: true, attraction: false },
    performance: { adaptive: true, maxParticles: 50, quality: 'ultra' }
  },
  'magic-dust': {
    type: 'magic-dust',
    intensity: 'medium',
    duration: 4000,
    particleCount: 60,
    physics: { gravity: 0.02, friction: 0.01, bounce: 0.5, turbulence: 0.03 },
    colors: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981'],
    size: { min: 1, max: 4 },
    speed: { min: 0.5, max: 2 },
    life: { min: 3000, max: 6000 },
    effects: { glow: true, trail: false, pulse: true, rotate: true, scale: true, attraction: true },
    performance: { adaptive: true, maxParticles: 120, quality: 'high' }
  }
};

export default UltraParticleSystem;
