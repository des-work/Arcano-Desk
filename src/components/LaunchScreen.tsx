import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useAnimations } from '../animations';
import { AnimatedWizard } from './AnimatedWizard';
import { SparkleRain, MagicalDust } from '../animations';

interface LaunchScreenProps {
  onComplete: () => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onComplete }) => {
  const { triggerAnimation } = useAnimations();
  const [phase, setPhase] = useState<'loading' | 'title' | 'wizard' | 'complete'>('loading');
  const [showParticles, setShowParticles] = useState(false);
  const [wizardMessage, setWizardMessage] = useState('');

  // Launch sequence
  useEffect(() => {
    const sequence = [
      { phase: 'loading', delay: 0 },
      { phase: 'title', delay: 2000 },
      { phase: 'wizard', delay: 4000 },
      { phase: 'complete', delay: 8000 }
    ];

    sequence.forEach(({ phase, delay }) => {
      setTimeout(() => {
        setPhase(phase as any);
        
        if (phase === 'title') {
          triggerAnimation('epic-summary', { intensity: 'epic' });
          setShowParticles(true);
        } else if (phase === 'wizard') {
          triggerAnimation('wizard-excited', { intensity: 'intense' });
          setWizardMessage('Welcome to your magical study companion!');
        } else if (phase === 'complete') {
          onComplete();
        }
      }, delay);
    });
  }, [triggerAnimation, onComplete]);

  // Wizard messages
  const wizardMessages = [
    'Welcome to your magical study companion!',
    'I am your wizard, ready to help you learn!',
    'Let\'s begin your magical journey!',
    'Prepare for an epic learning adventure!'
  ];

  useEffect(() => {
    if (phase === 'wizard') {
      const messageInterval = setInterval(() => {
        const randomMessage = wizardMessages[Math.floor(Math.random() * wizardMessages.length)];
        setWizardMessage(randomMessage);
      }, 3000);

      return () => clearInterval(messageInterval);
    }
  }, [phase, wizardMessages]);

  // Title animation spring
  const titleSpring = useSpring(0, { stiffness: 300, damping: 30 });
  const titleOpacity = useTransform(titleSpring, [0, 1], [0, phase === 'title' || phase === 'wizard' || phase === 'complete' ? 1 : 0]);
  const titleY = useTransform(titleSpring, [0, 1], [100, phase === 'title' || phase === 'wizard' || phase === 'complete' ? 0 : 100]);
  const titleScale = useTransform(titleSpring, [0, 1], [0.5, phase === 'title' || phase === 'wizard' || phase === 'complete' ? 1 : 0.5]);

  // Wizard animation spring
  const wizardSpring = useSpring(0, { stiffness: 200, damping: 25 });
  const wizardOpacity = useTransform(wizardSpring, [0, 1], [0, phase === 'wizard' || phase === 'complete' ? 1 : 0]);
  const wizardScale = useTransform(wizardSpring, [0, 1], [0, phase === 'wizard' || phase === 'complete' ? 1 : 0]);
  const wizardRotate = useTransform(wizardSpring, [0, 1], [-180, phase === 'wizard' || phase === 'complete' ? 0 : -180]);

  // Update springs based on phase changes
  useEffect(() => {
    titleSpring.set(phase === 'title' || phase === 'wizard' || phase === 'complete' ? 1 : 0);
  }, [phase, titleSpring]);

  useEffect(() => {
    wizardSpring.set(phase === 'wizard' || phase === 'complete' ? 1 : 0);
  }, [phase, wizardSpring]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-900 to-indigo-900 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Particles */}
      <AnimatePresence>
        {showParticles && (
          <>
            <SparkleRain isActive={true} intensity="moderate" duration={6000} />
            <MagicalDust isActive={true} intensity="gentle" duration={8000} />
          </>
        )}
      </AnimatePresence>

      {/* Floating Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Title Card */}
      <motion.div
        style={{
          opacity: titleOpacity,
          y: titleY,
          scale: titleScale
        }}
        className="text-center mb-16 relative z-10"
      >
        <motion.div
          className="relative"
          animate={{
            rotate: [0, 2, -2, 0],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Title Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          {/* Main Title */}
          <h1 className="text-8xl md:text-9xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-4 relative z-10">
            ARCANO DESK
          </h1>
          
          {/* Subtitle */}
          <motion.p
            className="text-2xl md:text-3xl font-arcane text-purple-200/80"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            Your Magical Study Companion
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Wizard Character */}
      <motion.div
        style={{
          opacity: wizardOpacity,
          scale: wizardScale,
          rotate: wizardRotate
        }}
        className="relative z-10"
      >
        <div className="text-center">
          <AnimatedWizard
            className="mb-8"
            onSpellComplete={() => {
              triggerAnimation('sparkle-rain', { intensity: 'intense' });
            }}
          />
          
          {/* Wizard Message */}
          <AnimatePresence mode="wait">
            {wizardMessage && (
              <motion.div
                key={wizardMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 max-w-md mx-auto"
              >
                <p className="text-lg font-arcane text-purple-200">
                  {wizardMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Loading Indicator */}
      <AnimatePresence>
        {phase === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              <span className="text-purple-200 font-arcane">Preparing magical environment...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magical Runes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl text-purple-400/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 8,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LaunchScreen;
