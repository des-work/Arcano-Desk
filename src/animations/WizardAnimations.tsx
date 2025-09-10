import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useAnimations } from './AnimationEngine';
import { AnimationType, AnimationIntensity } from './AnimationTypes';

interface WizardAnimationsProps {
  isLearning?: boolean;
  hasNewKnowledge?: boolean;
  currentSpell?: string;
  mood?: 'happy' | 'focused' | 'excited' | 'thinking' | 'sleeping' | 'confused' | 'proud';
  onSpellComplete?: () => void;
}

export const WizardAnimations: React.FC<WizardAnimationsProps> = ({
  isLearning = false,
  hasNewKnowledge = false,
  currentSpell = '',
  mood = 'happy',
  onSpellComplete
}) => {
  const { triggerAnimation, isAnimationActive } = useAnimations();
  const [spellProgress, setSpellProgress] = useState(0);
  const [isCasting, setIsCasting] = useState(false);

  // Mood-based animations
  useEffect(() => {
    const moodAnimations: Record<string, AnimationType> = {
      happy: 'wizard-glow',
      focused: 'wizard-think',
      excited: 'wizard-excited',
      thinking: 'wizard-think',
      sleeping: 'wizard-sleep',
      confused: 'wizard-wiggle',
      proud: 'wizard-glow'
    };

    const animation = moodAnimations[mood];
    if (animation) {
      triggerAnimation(animation, { intensity: 'gentle' });
    }
  }, [mood, triggerAnimation]);

  // Learning animation
  useEffect(() => {
    if (isLearning) {
      triggerAnimation('wizard-learn', { 
        intensity: 'moderate',
        repeat: 'infinite'
      });
    }
  }, [isLearning, triggerAnimation]);

  // New knowledge celebration
  useEffect(() => {
    if (hasNewKnowledge) {
      triggerAnimation('wizard-excited', { 
        intensity: 'intense',
        repeat: 3
      });
      
      // Trigger sparkle effects
      setTimeout(() => {
        triggerAnimation('sparkle-rain', { intensity: 'moderate' });
      }, 500);
    }
  }, [hasNewKnowledge, triggerAnimation]);

  // Spell casting animation
  useEffect(() => {
    if (currentSpell) {
      setIsCasting(true);
      setSpellProgress(0);
      
      // Animate spell progress
      const progressInterval = setInterval(() => {
        setSpellProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsCasting(false);
            onSpellComplete?.();
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      
      return () => clearInterval(progressInterval);
    }
  }, [currentSpell, onSpellComplete]);

  // Spring animations for smooth motion
  const wizardSpring = useSpring({
    scale: isLearning ? 1.1 : 1,
    rotate: isLearning ? [0, 5, -5, 0] : 0,
    config: { tension: 300, friction: 30 }
  });

  const glowSpring = useSpring({
    opacity: hasNewKnowledge ? [0.5, 1, 0.5] : 0.3,
    scale: hasNewKnowledge ? [1, 1.2, 1] : 1,
    config: { tension: 200, friction: 20 }
  });

  const spellSpring = useSpring({
    scale: isCasting ? [1, 1.2, 1] : 1,
    rotate: isCasting ? [0, 360] : 0,
    config: { tension: 400, friction: 25 }
  });

  return (
    <div className="relative">
      {/* Wizard Character */}
      <animated.div
        style={{
          transform: `scale(${wizardSpring.scale}) rotate(${wizardSpring.rotate}deg)`
        }}
        className="relative"
      >
        {/* Glow Effect */}
        <animated.div
          style={{
            opacity: glowSpring.opacity,
            transform: `scale(${glowSpring.scale})`
          }}
          className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-xl"
        />
        
        {/* Wizard Emoji */}
        <motion.div
          className="text-6xl"
          animate={{
            y: isLearning ? [0, -10, 0] : 0,
            rotate: isLearning ? [0, 2, -2, 0] : 0
          }}
          transition={{
            duration: 2,
            repeat: isLearning ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          🧙‍♂️
        </motion.div>
        
        {/* Spell Casting Effects */}
        <AnimatePresence>
          {isCasting && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {/* Magic Circle */}
              <animated.div
                style={{
                  transform: `scale(${spellSpring.scale}) rotate(${spellSpring.rotate}deg)`
                }}
                className="absolute inset-0 border-4 border-purple-400/50 rounded-full"
              />
              
              {/* Spell Progress Ring */}
              <div className="absolute inset-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#spellGradient)"
                    strokeWidth="3"
                    strokeDasharray={`${2 * Math.PI * 45}`}
                    strokeDashoffset={`${2 * Math.PI * 45 * (1 - spellProgress / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="spellGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              {/* Floating Particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-purple-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 0'
                  }}
                  animate={{
                    x: [0, Math.cos(i * 45 * Math.PI / 180) * 60],
                    y: [0, Math.sin(i * 45 * Math.PI / 180) * 60],
                    opacity: [1, 0],
                    scale: [1, 0]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Learning Sparkles */}
        <AnimatePresence>
          {isLearning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-yellow-400"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`
                  }}
                  animate={{
                    y: [0, -30, -60],
                    opacity: [1, 0.5, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Knowledge Celebration */}
        <AnimatePresence>
          {hasNewKnowledge && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 to-orange-400/50 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{
                  duration: 1,
                  repeat: 3,
                  ease: "easeInOut"
                }}
              />
              
              {/* Celebration Text */}
              <motion.div
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300"
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut"
                }}
              >
                + Knowledge!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </animated.div>
      
      {/* Spell Name Display */}
      <AnimatePresence>
        {currentSpell && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-sm font-arcane text-purple-300"
          >
            {currentSpell}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Loading Animation Component
export const LoadingAnimation: React.FC<{
  type: 'summary' | 'study-material' | 'question' | 'topic';
  progress?: number;
  message?: string;
}> = ({ type, progress = 0, message }) => {
  const { triggerAnimation } = useAnimations();
  const [phase, setPhase] = useState<'preparing' | 'processing' | 'finalizing' | 'complete'>('preparing');

  useEffect(() => {
    const phases = [
      { phase: 'preparing', delay: 0 },
      { phase: 'processing', delay: 1000 },
      { phase: 'finalizing', delay: 3000 },
      { phase: 'complete', delay: 5000 }
    ];

    phases.forEach(({ phase, delay }) => {
      setTimeout(() => setPhase(phase as any), delay);
    });
  }, []);

  const getLoadingMessage = () => {
    if (message) return message;
    
    const messages = {
      summary: {
        preparing: '🧙‍♂️ Gathering magical insights...',
        processing: '✨ Weaving knowledge into wisdom...',
        finalizing: '🌟 Polishing the final enchantment...',
        complete: '✨ Summary complete!'
      },
      'study-material': {
        preparing: '📚 Preparing study materials...',
        processing: '🎯 Crafting perfect learning tools...',
        finalizing: '✨ Adding magical touches...',
        complete: '📖 Study materials ready!'
      },
      question: {
        preparing: '🤔 Consulting the oracle...',
        processing: '💭 Delving into ancient knowledge...',
        finalizing: '✨ Formulating the perfect answer...',
        complete: '💡 Answer revealed!'
      },
      topic: {
        preparing: '🔍 Exploring the topic...',
        processing: '📖 Gathering comprehensive information...',
        finalizing: '✨ Organizing knowledge...',
        complete: '📚 Topic knowledge complete!'
      }
    };

    return messages[type]?.[phase] || 'Processing...';
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Main Loading Animation */}
      <div className="relative mb-6">
        {/* Orb Animation */}
        <motion.div
          className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            boxShadow: [
              '0 0 20px rgba(139, 92, 246, 0.5)',
              '0 0 40px rgba(236, 72, 153, 0.8)',
              '0 0 20px rgba(139, 92, 246, 0.5)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Rotating Ring */}
        <motion.div
          className="absolute inset-0 border-4 border-purple-400/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Progress Ring */}
        <div className="absolute inset-0">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="rgba(139, 92, 246, 0.3)"
              strokeWidth="2"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#loadingGradient)"
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#EC4899" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      {/* Loading Message */}
      <motion.div
        key={phase}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-center"
      >
        <p className="text-lg font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
          {getLoadingMessage()}
        </p>
        <p className="text-sm text-purple-200/80 font-arcane">
          {progress}% complete
        </p>
      </motion.div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default WizardAnimations;
