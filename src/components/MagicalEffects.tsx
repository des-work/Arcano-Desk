import React, { useState, useEffect } from 'react';
import { Zap, CloudRain, Snowflake, Leaf, PawPrint, Sparkles } from 'lucide-react';

interface MagicalEffectsProps {
  activeEffect?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const MagicalEffects: React.FC<MagicalEffectsProps> = ({
  activeEffect = '',
  intensity = 'medium'
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  const particleCount = {
    low: 5,
    medium: 15,
    high: 30
  };

  useEffect(() => {
    if (activeEffect) {
      const count = particleCount[intensity];
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3
      }));
      setParticles(newParticles);

      // Clear particles after effect ends
      const timer = setTimeout(() => setParticles([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [activeEffect, intensity]);

  const renderEffect = () => {
    switch (activeEffect) {
      case 'lightning':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map(particle => (
              <Zap
                key={particle.id}
                className="absolute text-yellow-400 animate-lightning"
                size={Math.random() * 30 + 20}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`
                }}
              />
            ))}
          </div>
        );

      case 'rain':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(particle => (
              <CloudRain
                key={particle.id}
                className="absolute text-blue-400 animate-rain-drop"
                size={16}
                style={{
                  left: `${particle.x}%`,
                  top: `-10px`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${Math.random() * 2 + 1}s`
                }}
              />
            ))}
          </div>
        );

      case 'snow':
        return (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {particles.map(particle => (
              <Snowflake
                key={particle.id}
                className="absolute text-white animate-snow-fall"
                size={Math.random() * 20 + 10}
                style={{
                  left: `${particle.x}%`,
                  top: `-10px`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))}
          </div>
        );

      case 'plants':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map(particle => (
              <Leaf
                key={particle.id}
                className="absolute text-green-400 animate-grow-plant"
                size={Math.random() * 24 + 16}
                style={{
                  left: `${particle.x}%`,
                  bottom: `0px`,
                  animationDelay: `${particle.delay}s`
                }}
              />
            ))}
          </div>
        );

      case 'creatures':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map(particle => (
              <PawPrint
                key={particle.id}
                className="absolute text-purple-400 animate-creature-appear"
                size={Math.random() * 20 + 15}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`
                }}
              />
            ))}
          </div>
        );

      case 'sparkles':
        return (
          <div className="absolute inset-0 pointer-events-none">
            {particles.map(particle => (
              <Sparkles
                key={particle.id}
                className="absolute text-yellow-300 animate-sparkle"
                size={Math.random() * 16 + 8}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  animationDelay: `${particle.delay}s`
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {renderEffect()}

      {/* Ambient magical particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }, (_, i) => (
          <Sparkles
            key={`ambient-${i}`}
            className="absolute text-purple-300/30 animate-float"
            size={4}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${Math.random() * 5 + 5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MagicalEffects;
