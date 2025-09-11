/**
 * Victory Reveal Component
 * Cutscene-style reveals for completed tasks and achievements
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Sparkles, Zap, Crown, Trophy, Gem } from 'lucide-react';

interface VictoryCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  delay: number;
}

interface VictoryRevealProps {
  cards: VictoryCard[];
  onComplete?: () => void;
  duration?: number; // Total duration in seconds (4-9 seconds)
  show?: boolean;
  title?: string;
  subtitle?: string;
}

export const VictoryReveal: React.FC<VictoryRevealProps> = ({
  cards,
  onComplete,
  duration = 6,
  show = true,
  title = "Achievement Unlocked!",
  subtitle = "The wizard has completed a magical task",
}) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Calculate timing
  const cardDuration = duration / cards.length;
  const totalDuration = duration * 1000; // Convert to milliseconds

  useEffect(() => {
    if (show && !isRevealing) {
      setIsRevealing(true);
      startReveal();
    }
  }, [show]);

  const startReveal = () => {
    let cardIndex = 0;
    const startTime = Date.now();

    const revealNextCard = () => {
      if (cardIndex < cards.length) {
        setCurrentCard(cardIndex);
        cardIndex++;
        setTimeout(revealNextCard, cardDuration * 1000);
      } else {
        // All cards revealed, show completion
        setTimeout(() => {
          setIsComplete(true);
          if (onComplete) onComplete();
        }, 1000);
      }
    };

    // Start particle effects
    startParticleEffects();
    
    // Start card reveals
    setTimeout(revealNextCard, 500);
  };

  const startParticleEffects = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
    }> = [];

    const createParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 1,
        color: `hsl(${Math.random() * 60 + 40}, 100%, 70%)`,
        size: Math.random() * 3 + 1,
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.vx *= 0.98;
        particle.vy *= 0.98;

        if (particle.life > 0) {
          ctx.save();
          ctx.globalAlpha = particle.life;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          particles.splice(i, 1);
        }
      }

      // Create new particles occasionally
      if (Math.random() < 0.3) {
        createParticle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        );
      }

      if (isRevealing || particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const stopParticleEffects = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  useEffect(() => {
    return () => stopParticleEffects();
  }, []);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        {/* Particle Canvas */}
        <canvas
          ref={canvasRef}
          width={window.innerWidth}
          height={window.innerHeight}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-4">
          {/* Title */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <motion.h1
              className="text-5xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 mb-4"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {title}
            </motion.h1>
            <motion.p
              className="text-xl text-purple-200/80 font-arcane"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {subtitle}
            </motion.p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ scale: 0, opacity: 0, rotateY: -90 }}
                animate={{
                  scale: currentCard >= index ? 1 : 0,
                  opacity: currentCard >= index ? 1 : 0,
                  rotateY: currentCard >= index ? 0 : -90,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut",
                  delay: currentCard >= index ? 0 : 0.5,
                }}
                className={`relative bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 overflow-hidden ${
                  currentCard === index ? 'ring-2 ring-yellow-400/50' : ''
                }`}
              >
                {/* Glow Effect */}
                {currentCard === index && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-xl"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Card Content */}
                <div className="relative z-10 text-center">
                  <motion.div
                    className="text-4xl mb-4"
                    animate={{
                      scale: currentCard === index ? [1, 1.2, 1] : 1,
                      rotate: currentCard === index ? [0, 5, -5, 0] : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      ease: "easeInOut",
                    }}
                  >
                    {card.icon}
                  </motion.div>

                  <h3 className="text-xl font-wizard text-purple-200 mb-2">
                    {card.title}
                  </h3>

                  <p className="text-purple-300/70 text-sm">
                    {card.description}
                  </p>

                  {/* Sparkle Effect */}
                  {currentCard === index && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                          }}
                          animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1,
                            delay: i * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Completion Message */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center"
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🎉
                </motion.div>

                <motion.h2
                  className="text-3xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 mb-4"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  All Tasks Complete!
                </motion.h2>

                <motion.p
                  className="text-purple-200/80 text-lg"
                  animate={{
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  The wizard has successfully completed all magical tasks!
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * Hook for triggering victory reveals
 */
export function useVictoryReveal() {
  const [show, setShow] = useState(false);
  const [cards, setCards] = useState<VictoryCard[]>([]);

  const triggerReveal = (newCards: VictoryCard[]) => {
    setCards(newCards);
    setShow(true);
  };

  const dismiss = () => {
    setShow(false);
    setCards([]);
  };

  return {
    show,
    cards,
    triggerReveal,
    dismiss,
  };
}

/**
 * Predefined victory card templates
 */
export const VICTORY_CARDS = {
  documentProcessed: {
    id: 'document-processed',
    title: 'Document Processed',
    description: 'Successfully analyzed and processed document',
    icon: <Gem className="w-8 h-8 text-purple-400" />,
    color: 'text-purple-400',
    glowColor: 'bg-purple-400/20',
    delay: 0,
  },
  summaryGenerated: {
    id: 'summary-generated',
    title: 'Summary Generated',
    description: 'AI-powered summary created successfully',
    icon: <Sparkles className="w-8 h-8 text-yellow-400" />,
    color: 'text-yellow-400',
    glowColor: 'bg-yellow-400/20',
    delay: 0.5,
  },
  wizardLevelUp: {
    id: 'wizard-level-up',
    title: 'Wizard Level Up!',
    description: 'Wizard has gained new magical abilities',
    icon: <Crown className="w-8 h-8 text-pink-400" />,
    color: 'text-pink-400',
    glowColor: 'bg-pink-400/20',
    delay: 1,
  },
  achievementUnlocked: {
    id: 'achievement-unlocked',
    title: 'Achievement Unlocked',
    description: 'New achievement has been unlocked',
    icon: <Trophy className="w-8 h-8 text-blue-400" />,
    color: 'text-blue-400',
    glowColor: 'bg-blue-400/20',
    delay: 1.5,
  },
};

export default VictoryReveal;
