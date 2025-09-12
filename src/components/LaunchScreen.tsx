import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

interface LaunchScreenProps {
  onComplete: () => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'loading' | 'book' | 'title' | 'wizard' | 'complete'>('loading');
  const [showElements, setShowElements] = useState(false);
  const [wizardMessage, setWizardMessage] = useState('');
  const [bookOpen, setBookOpen] = useState(false);

  // Launch sequence
  useEffect(() => {
    const sequence = [
      { phase: 'loading', delay: 0 },
      { phase: 'book', delay: 2000 },
      { action: 'openBook', delay: 4000 },
      { phase: 'title', delay: 6000 },
      { phase: 'wizard', delay: 9000 }
    ];

    sequence.forEach(({ phase, action, delay }) => {
      setTimeout(() => {
        if (phase) {
          setPhase(phase as any);
        }
        
        if (phase === 'book') {
          setShowElements(true);
        } else if (action === 'openBook') {
          setBookOpen(true);
        } else if (phase === 'title') {
          setWizardMessage('The ancient tomes await your knowledge...');
        } else if (phase === 'wizard') {
          setWizardMessage('Welcome, seeker of wisdom!');
        }
      }, delay);
    });
  }, [onComplete]);

  // Wizard messages
  const wizardMessages = [
    'The ancient tomes await your knowledge...',
    'Welcome, seeker of wisdom!',
    'Magic flows through every page...',
    'Your journey into the arcane begins...',
    'The library of infinite knowledge calls...'
  ];

  useEffect(() => {
    if (phase === 'wizard') {
      const messageInterval = setInterval(() => {
        const randomMessage = wizardMessages[Math.floor(Math.random() * wizardMessages.length)];
        setWizardMessage(randomMessage);
      }, 4000);

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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center overflow-hidden p-4">
      {/* Storm Clouds Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-32 bg-gradient-to-br from-slate-800/40 to-slate-900/60 rounded-full blur-xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -20, 10, 0],
              opacity: [0.3, 0.6, 0.4, 0.3]
            }}
            transition={{
              duration: 8,
              delay: i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Lightning Effects */}
      <AnimatePresence>
        {showElements && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-32 lightning-bolt opacity-0"
                style={{
                  left: `${20 + i * 30}%`,
                  top: '10%'
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scaleY: [0, 1, 0]
                }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.5,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Stars and Constellations */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full star-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Short Comets */}
      <AnimatePresence>
        {showElements && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 comet-trail rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  x: [0, 200],
                  y: [0, -100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.8,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Ancient Runes */}
      <div className="absolute inset-0 pointer-events-none">
        {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ', 'ᚺ', 'ᚾ', 'ᛁ', 'ᛃ'].map((rune, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl magical-runes rune-glow text-purple-400/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 12,
              delay: i * 0.8,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {rune}
          </motion.div>
        ))}
      </div>

      {/* Closed Book - Initial State */}
      <AnimatePresence>
        {phase === 'book' && !bookOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative z-20 mb-6"
          >
            <div className="relative">
              {/* Book Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              
              {/* Closed Book */}
              <div className="relative w-72 h-48 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 rounded-lg shadow-2xl border-4 border-amber-600">
                {/* Book Cover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-amber-900 rounded-lg shadow-inner">
                  <div className="p-4 h-full flex flex-col justify-center items-center">
                    {/* Artistic Book Icon */}
                    <div className="relative mb-3">
                      <div className="w-12 h-16 bg-gradient-to-br from-amber-200 to-amber-300 rounded-sm shadow-lg border-2 border-amber-400">
                        <div className="absolute inset-1 bg-gradient-to-br from-amber-100 to-amber-200 rounded-sm">
                          <div className="h-full flex flex-col justify-center items-center">
                            <div className="w-6 h-0.5 bg-amber-600 mb-1"></div>
                            <div className="w-6 h-0.5 bg-amber-600 mb-1"></div>
                            <div className="w-6 h-0.5 bg-amber-600 mb-1"></div>
                            <div className="w-6 h-0.5 bg-amber-600"></div>
                          </div>
                        </div>
                      </div>
                      {/* Book Binding */}
                      <div className="absolute -left-1 top-0 w-1 h-full bg-gradient-to-b from-amber-700 to-amber-900 rounded-l-sm"></div>
                    </div>
                    <div className="text-lg font-bold magical-title text-amber-200 mb-1">Ancient Tome</div>
                    <div className="text-xs magical-subtitle text-amber-300">Tap to open...</div>
                  </div>
                </div>
                
                {/* Book Binding */}
                <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-b from-amber-700 to-amber-900 rounded-l-lg"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opening Book Animation */}
      <AnimatePresence>
        {bookOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-20 mb-6"
          >
            <div className="relative">
              {/* Enhanced Book Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-blue-500/50 blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              
              {/* Opening Book with Pages */}
              <motion.div 
                className="relative w-72 h-48"
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -15 }}
                transition={{ duration: 2, ease: "easeOut" }}
              >
                {/* Left Page (Cover) */}
                <div className="absolute left-0 top-0 w-36 h-48 bg-gradient-to-br from-amber-800 to-amber-900 rounded-l-lg shadow-2xl border-4 border-amber-600">
                  <div className="p-3 h-full flex flex-col justify-center items-center">
                    {/* Artistic Book Icon */}
                    <div className="relative mb-2">
                      <div className="w-8 h-10 bg-gradient-to-br from-amber-200 to-amber-300 rounded-sm shadow-lg border border-amber-400">
                        <div className="absolute inset-0.5 bg-gradient-to-br from-amber-100 to-amber-200 rounded-sm">
                          <div className="h-full flex flex-col justify-center items-center">
                            <div className="w-4 h-0.5 bg-amber-600 mb-0.5"></div>
                            <div className="w-4 h-0.5 bg-amber-600 mb-0.5"></div>
                            <div className="w-4 h-0.5 bg-amber-600 mb-0.5"></div>
                            <div className="w-4 h-0.5 bg-amber-600"></div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute -left-0.5 top-0 w-0.5 h-full bg-gradient-to-b from-amber-700 to-amber-900 rounded-l-sm"></div>
                    </div>
                    <div className="text-sm font-bold magical-title text-amber-200">ARCANO</div>
                  </div>
                </div>
                
                {/* Right Page (Reveals Title) */}
                <motion.div 
                  className="absolute right-0 top-0 w-36 h-48 book-page rounded-r-lg shadow-2xl border-4 border-amber-600"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 15 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                >
                  <div className="p-3 h-full flex flex-col justify-center items-center">
                    {/* Artistic Open Book Icon */}
                    <div className="relative mb-2">
                      <div className="w-8 h-10 bg-gradient-to-br from-amber-200 to-amber-300 rounded-sm shadow-lg border border-amber-400">
                        <div className="absolute inset-0.5 bg-gradient-to-br from-amber-100 to-amber-200 rounded-sm">
                          <div className="h-full flex flex-col justify-center items-center">
                            <div className="w-3 h-0.5 bg-amber-600 mb-0.5"></div>
                            <div className="w-3 h-0.5 bg-amber-600 mb-0.5"></div>
                            <div className="w-3 h-0.5 bg-amber-600 mb-0.5"></div>
                            <div className="w-3 h-0.5 bg-amber-600"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-bold magical-title text-amber-900">DESK</div>
                  </div>
                </motion.div>
                
                {/* Book Binding */}
                <div className="absolute left-1/2 top-0 w-1 h-full bg-gradient-to-b from-amber-700 to-amber-900 transform -translate-x-1/2"></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grand Title Card */}
      <motion.div
        style={{
          opacity: titleOpacity,
          y: titleY,
          scale: titleScale
        }}
        className="text-center mb-8 relative z-10"
      >
        <motion.div
          className="relative"
          animate={{
            rotate: [0, 1, -1, 0],
            scale: [1, 1.01, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          {/* Title Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-blue-500/40 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl magical-title text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-blue-300 to-emerald-300 mb-4 relative z-10">
            ARCANO DESK
          </h1>
          
          {/* Subtitle */}
          <motion.p
            className="text-xl md:text-2xl magical-subtitle text-purple-200/90"
            animate={{
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            The Ancient Library of Knowledge
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Wizard Message */}
      <AnimatePresence mode="wait">
        {wizardMessage && phase === 'wizard' && (
          <motion.div
            key={wizardMessage}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-2xl p-6 border-2 border-purple-500/40 max-w-2xl mx-auto mb-6 relative z-10"
          >
            <div className="text-center">
              <div className="text-3xl mb-3">🧙‍♂️</div>
              <p className="text-lg font-serif text-purple-200 italic">
                {wizardMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: phase === 'wizard' ? 1 : 0,
          scale: phase === 'wizard' ? 1 : 0.8
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 0 40px rgba(168, 85, 247, 0.8)"
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onComplete}
        className="magical-button text-white font-bold text-xl px-12 py-4 rounded-2xl transition-all duration-300 relative z-10"
      >
        <span className="text-2xl mr-2">📚</span>
        Enter the Library
      </motion.button>

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
              <div className="w-10 h-10 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
              <span className="text-purple-200 font-serif text-lg">Summoning the ancient magic...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LaunchScreen;
