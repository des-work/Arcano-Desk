import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from './AnimationEngine';

interface EpicAnimationProps {
  type: 'dragon-battle' | 'epic-summary' | 'massive-spell' | 'reality-bend';
  isActive: boolean;
  onComplete?: () => void;
  intensity?: 'moderate' | 'intense' | 'epic';
}

export const EpicAnimation: React.FC<EpicAnimationProps> = ({
  type,
  isActive,
  onComplete,
  intensity = 'epic'
}) => {
  const { triggerAnimation } = useAnimations();
  const [phase, setPhase] = useState<'preparation' | 'battle' | 'victory' | 'complete'>('preparation');
  const [dragonHealth, setDragonHealth] = useState(100);
  const [wizardMana, setWizardMana] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive) return;

    const phases = [
      { phase: 'preparation', delay: 0 },
      { phase: 'battle', delay: 2000 },
      { phase: 'victory', delay: 8000 },
      { phase: 'complete', delay: 12000 }
    ];

    phases.forEach(({ phase, delay }) => {
      setTimeout(() => {
        setPhase(phase as any);
        if (phase === 'complete') {
          onComplete?.();
        }
      }, delay);
    });

    // Battle simulation
    const battleInterval = setInterval(() => {
      if (phase === 'battle') {
        setDragonHealth(prev => Math.max(0, prev - Math.random() * 5));
        setWizardMana(prev => Math.max(0, prev - Math.random() * 3));
      }
    }, 200);

    return () => clearInterval(battleInterval);
  }, [isActive, phase, onComplete]);

  // Dragon Battle Animation
  const DragonBattle = () => (
    <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Fire Particles */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-red-500 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}
        
        {/* Lightning Strikes */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-32 bg-blue-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: '0%'
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0]
            }}
            transition={{
              duration: 0.5,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Dragon */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-40 h-40"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          rotate: [0, -15, 15, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div className="text-9xl">🐉</div>
        
        {/* Dragon Health Bar */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-red-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 to-orange-500"
            initial={{ width: '100%' }}
            animate={{ width: `${dragonHealth}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Wizard */}
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-32 h-32"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div className="text-7xl">🧙‍♂️</div>
        
        {/* Wizard Mana Bar */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-24 h-3 bg-blue-900/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: '100%' }}
            animate={{ width: `${wizardMana}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Spell Effects */}
      <div className="absolute inset-0">
        {/* Fireballs */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-orange-500 rounded-full"
            style={{
              left: '25%',
              top: '60%'
            }}
            animate={{
              x: [0, 300],
              y: [0, -100, -200],
              opacity: [1, 0.8, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}
        
        {/* Lightning Bolts */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-20 bg-yellow-400"
            style={{
              left: '75%',
              top: '20%'
            }}
            animate={{
              opacity: [0, 1, 0],
              scaleY: [0, 1, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 1,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}
      </div>

      {/* Victory Screen */}
      <AnimatePresence>
        {phase === 'victory' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="text-center">
              <motion.div
                className="text-8xl mb-4"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                🏆
              </motion.div>
              <motion.h2
                className="text-6xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300 mb-4"
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                EPIC VICTORY!
              </motion.h2>
              <motion.p
                className="text-2xl font-arcane text-yellow-200"
                animate={{
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                The wizard has conquered the dragon!
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Epic Summary Animation
  const EpicSummary = () => (
    <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-indigo-900/30">
      {/* Magical Orbs */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: 4,
            delay: i * 0.2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Central Magic Circle */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div className="w-full h-full border-4 border-purple-400/50 rounded-full relative">
          {/* Inner Circle */}
          <div className="absolute inset-4 border-2 border-pink-400/50 rounded-full" />
          
          {/* Runes */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl text-purple-300"
              style={{
                left: '50%',
                top: '50%',
                transformOrigin: '0 0',
                transform: `rotate(${i * 45}deg) translateY(-120px)`
              }}
              animate={{
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Summary Text */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <motion.h2
          className="text-5xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4"
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          EPIC SUMMARY CREATED!
        </motion.h2>
        <motion.p
          className="text-xl font-arcane text-purple-200"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          The wizard has woven a masterpiece of knowledge!
        </motion.p>
      </motion.div>
    </div>
  );

  // Massive Spell Animation
  const MassiveSpell = () => (
    <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-pink-900/40">
      {/* Spell Circle */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96"
        animate={{
          rotate: 360,
          scale: [1, 1.5, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <div className="w-full h-full border-8 border-cyan-400/70 rounded-full relative">
          {/* Inner Circles */}
          <div className="absolute inset-8 border-4 border-purple-400/50 rounded-full" />
          <div className="absolute inset-16 border-2 border-pink-400/50 rounded-full" />
          
          {/* Central Power Source */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </div>
      </motion.div>

      {/* Energy Beams */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-32 bg-gradient-to-t from-cyan-400 to-purple-400"
          style={{
            left: '50%',
            top: '50%',
            transformOrigin: '50% 100%',
            transform: `rotate(${i * 30}deg) translateY(-200px)`
          }}
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            delay: i * 0.2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
        />
      ))}

      {/* Spell Text */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 1 }}
      >
        <motion.h2
          className="text-6xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 mb-4"
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          MASSIVE SPELL CAST!
        </motion.h2>
        <motion.p
          className="text-2xl font-arcane text-cyan-200"
          animate={{
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          Reality bends to the wizard's will!
        </motion.p>
      </motion.div>
    </div>
  );

  // Reality Bend Animation
  const RealityBend = () => (
    <div className="fixed inset-0 z-50 pointer-events-none bg-gradient-to-br from-violet-900/50 via-purple-900/50 to-fuchsia-900/50">
      {/* Reality Distortion */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale: [1, 1.1, 0.9, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        {/* Fractal Patterns */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 border border-purple-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              rotate: [0, 360],
              scale: [0, 1, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: i * 0.1,
              repeat: Infinity,
              ease: 'easeOut'
            }}
          />
        ))}
      </motion.div>

      {/* Central Reality Core */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80"
        animate={{
          rotate: [0, 360, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 rounded-full relative">
          {/* Inner Reality */}
          <motion.div
            className="absolute inset-8 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full"
            animate={{
              rotate: [0, -360],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        </div>
      </motion.div>

      {/* Reality Text */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 3, delay: 1 }}
      >
        <motion.h2
          className="text-7xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-fuchsia-300 mb-4"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 1, -1, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          REALITY BEND!
        </motion.h2>
        <motion.p
          className="text-3xl font-arcane text-violet-200"
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          The very fabric of space-time trembles!
        </motion.p>
      </motion.div>
    </div>
  );

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {type === 'dragon-battle' && <DragonBattle />}
          {type === 'epic-summary' && <EpicSummary />}
          {type === 'massive-spell' && <MassiveSpell />}
          {type === 'reality-bend' && <RealityBend />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EpicAnimation;
