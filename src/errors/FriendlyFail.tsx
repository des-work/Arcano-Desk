/**
 * Friendly Fail Component
 * Funny error animations for when things go wrong
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Zap, CloudRain, Snowflake, Leaf, PawPrint } from 'lucide-react';

interface FriendlyFailProps {
  error: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
  show?: boolean;
  duration?: number; // How long to show the animation (default: 1.2s)
}

const FAIL_ANIMATIONS = [
  {
    name: 'sneeze',
    description: 'Particles sneeze apart',
    icon: '🤧',
    color: 'text-yellow-400',
    particles: 20,
  },
  {
    name: 'explosion',
    description: 'Magical explosion',
    icon: '💥',
    color: 'text-red-400',
    particles: 30,
  },
  {
    name: 'fizzle',
    description: 'Spell fizzles out',
    icon: '💨',
    color: 'text-gray-400',
    particles: 15,
  },
  {
    name: 'bounce',
    description: 'Bouncy retry',
    icon: '⚡',
    color: 'text-blue-400',
    particles: 25,
  },
];

const MAGIC_ICONS = [Zap, CloudRain, Snowflake, Leaf, PawPrint];

export const FriendlyFail: React.FC<FriendlyFailProps> = ({
  error,
  onRetry,
  onDismiss,
  show = true,
  duration = 1200,
}) => {
  const [animation, setAnimation] = useState(FAIL_ANIMATIONS[0]);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; life: number }>>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Select random animation
  useEffect(() => {
    if (show) {
      const randomAnim = FAIL_ANIMATIONS[Math.floor(Math.random() * FAIL_ANIMATIONS.length)];
      setAnimation(randomAnim);
      setIsAnimating(true);
      
      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
        if (onDismiss) onDismiss();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onDismiss]);

  // Generate particles for animation
  useEffect(() => {
    if (isAnimating) {
      const newParticles = Array.from({ length: animation.particles }, (_, i) => ({
        id: i,
        x: 50, // Start from center
        y: 50,
        vx: (Math.random() - 0.5) * 200, // Random velocity
        vy: (Math.random() - 0.5) * 200,
        life: 1,
      }));
      setParticles(newParticles);
      
      // Animate particles
      const animateParticles = () => {
        setParticles(prev => 
          prev.map(particle => ({
            ...particle,
            x: particle.x + particle.vx * 0.016, // 60fps
            y: particle.y + particle.vy * 0.016,
            vx: particle.vx * 0.98, // Friction
            vy: particle.vy * 0.98,
            life: particle.life - 0.02, // Fade out
          })).filter(particle => particle.life > 0)
        );
      };
      
      const interval = setInterval(animateParticles, 16);
      return () => clearInterval(interval);
    }
  }, [isAnimating, animation.particles]);

  if (!show || !isAnimating) return null;

  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative bg-gradient-to-br from-red-900/90 to-purple-900/90 backdrop-blur-md rounded-2xl p-8 border border-red-500/30 shadow-2xl max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Particle Animation */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className={`absolute w-2 h-2 rounded-full ${animation.color} opacity-${Math.floor(particle.life * 100)}`}
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  transform: `scale(${particle.life})`,
                }}
                animate={{
                  x: [0, particle.vx * 0.1],
                  y: [0, particle.vy * 0.1],
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            ))}
          </div>

          {/* Error Content */}
          <div className="relative z-10 text-center">
            {/* Animated Icon */}
            <motion.div
              className="text-6xl mb-4"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                repeat: 2,
              }}
            >
              {animation.icon}
            </motion.div>

            {/* Error Title */}
            <motion.h2
              className="text-2xl font-wizard text-red-200 mb-2"
              animate={{
                color: ['#FCA5A5', '#F87171', '#FCA5A5'],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Oops! Spell Gone Wrong
            </motion.h2>

            {/* Error Description */}
            <motion.p
              className="text-red-300/80 mb-4"
              animate={{
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {animation.description}
            </motion.p>

            {/* Error Message */}
            <div className="bg-red-800/30 rounded-lg p-3 mb-6 border border-red-500/20">
              <p className="text-red-200 text-sm font-mono">
                {errorMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              {onRetry && (
                <motion.button
                  onClick={onRetry}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-wizard rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 4px 15px rgba(59, 130, 246, 0.3)',
                      '0 8px 25px rgba(147, 51, 234, 0.4)',
                      '0 4px 15px rgba(59, 130, 246, 0.3)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <RefreshCw size={16} />
                  Try Again
                </motion.button>
              )}

              {onDismiss && (
                <motion.button
                  onClick={onDismiss}
                  className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-wizard rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dismiss
                </motion.button>
              )}
            </div>

            {/* Magic Icons */}
            <div className="flex justify-center gap-2 mt-4">
              {MAGIC_ICONS.map((Icon, index) => (
                <motion.div
                  key={index}
                  className="text-gray-400"
                  animate={{
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: index * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Icon size={20} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Error Boundary Component
 * Catches errors and displays FriendlyFail
 */
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error; retry: () => void }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback || FriendlyFail;
      return (
        <FallbackComponent
          error={this.state.error}
          onRetry={() => this.setState({ hasError: false, error: null })}
          onDismiss={() => this.setState({ hasError: false, error: null })}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for triggering friendly fail animations
 */
export function useFriendlyFail() {
  const [error, setError] = useState<Error | string | null>(null);
  const [show, setShow] = useState(false);

  const triggerFail = (error: Error | string) => {
    setError(error);
    setShow(true);
  };

  const dismiss = () => {
    setShow(false);
    setError(null);
  };

  const retry = () => {
    setShow(false);
    setError(null);
    // Retry logic would go here
  };

  return {
    error,
    show,
    triggerFail,
    dismiss,
    retry,
  };
}

export default FriendlyFail;
