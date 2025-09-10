import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useAnimations } from '../animations';
import { AnimatedWizard } from './AnimatedWizard';
import { InteractiveButton } from '../animations';
import { useWizard } from '../hooks/useWizard';

type LayoutPhase = 'upload' | 'library' | 'summary' | 'idle';

interface DynamicLayoutProps {
  children: React.ReactNode;
  currentPhase: LayoutPhase;
  onPhaseChange: (phase: LayoutPhase) => void;
}

export const DynamicLayout: React.FC<DynamicLayoutProps> = ({
  children,
  currentPhase,
  onPhaseChange
}) => {
  const { triggerAnimation } = useAnimations();
  const { 
    mood, 
    isLearning, 
    hasNewKnowledge, 
    currentSpell,
    castSpell,
    gainKnowledge,
    changeMood
  } = useWizard();

  const [wizardMessage, setWizardMessage] = useState('');
  const [showWizard, setShowWizard] = useState(true);

  // Phase-specific configurations
  const phaseConfig = {
    upload: {
      wizardPosition: 'right',
      wizardSize: 'large',
      message: 'Drop your files here, and I\'ll work my magic!',
      spell: 'file-enchantment',
      mood: 'focused'
    },
    library: {
      wizardPosition: 'bottom',
      wizardSize: 'medium',
      message: 'Your knowledge library awaits!',
      spell: 'library-reveal',
      mood: 'excited'
    },
    summary: {
      wizardPosition: 'left',
      wizardSize: 'large',
      message: 'Behold! Your magical summary is ready!',
      spell: 'summary-creation',
      mood: 'proud'
    },
    idle: {
      wizardPosition: 'center',
      wizardSize: 'medium',
      message: 'What would you like to learn today?',
      spell: 'idle-magic',
      mood: 'happy'
    }
  };

  const config = phaseConfig[currentPhase];

  // Update wizard state based on phase
  useEffect(() => {
    changeMood(config.mood as any);
    castSpell(config.spell);
    setWizardMessage(config.message);
    
    // Trigger phase-specific animation
    triggerAnimation(`wizard-${config.mood}`, { intensity: 'moderate' });
  }, [currentPhase, changeMood, castSpell, triggerAnimation, config]);

  // Wizard positioning springs
  const wizardPositionSpring = useSpring({
    from: { x: 0, y: 0, scale: 1 },
    to: {
      x: config.wizardPosition === 'right' ? 200 : 
         config.wizardPosition === 'left' ? -200 : 0,
      y: config.wizardPosition === 'bottom' ? 100 : 0,
      scale: config.wizardSize === 'large' ? 1.2 : 
             config.wizardSize === 'medium' ? 1 : 0.8
    },
    config: { tension: 300, friction: 30 }
  });

  // Content positioning spring
  const contentPositionSpring = useSpring({
    from: { x: 0, y: 0 },
    to: {
      x: config.wizardPosition === 'right' ? -100 : 
         config.wizardPosition === 'left' ? 100 : 0,
      y: config.wizardPosition === 'bottom' ? -50 : 0
    },
    config: { tension: 200, friction: 25 }
  });

  // Wizard messages based on interactions
  const getWizardMessage = () => {
    if (isLearning) {
      return 'I\'m learning from your documents...';
    }
    if (hasNewKnowledge) {
      return 'New knowledge acquired! My power grows!';
    }
    if (currentSpell) {
      return `Casting ${currentSpell}...`;
    }
    return config.message;
  };

  useEffect(() => {
    const message = getWizardMessage();
    setWizardMessage(message);
  }, [isLearning, hasNewKnowledge, currentSpell, config.message]);

  // Render wizard based on position
  const renderWizard = () => {
    if (!showWizard) return null;

    return (
      <animated.div
        style={wizardPositionSpring}
        className="absolute z-20"
      >
        <div className="relative">
          <AnimatedWizard
            className="mb-4"
            onSpellComplete={() => {
              triggerAnimation('sparkle-rain', { intensity: 'moderate' });
            }}
          />
          
          {/* Wizard Message Bubble */}
          <motion.div
            className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-lg rounded-2xl p-4 border border-purple-500/30 max-w-xs"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <p className="text-sm font-arcane text-purple-200 text-center">
              {wizardMessage}
            </p>
          </motion.div>
        </div>
      </animated.div>
    );
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900" />
      
      {/* Content Area */}
      <animated.div
        style={contentPositionSpring}
        className="relative z-10 w-full h-full"
      >
        {children}
      </animated.div>

      {/* Wizard Character */}
      {renderWizard()}

      {/* Phase Navigation */}
      <div className="absolute top-4 left-4 z-30">
        <div className="flex space-x-2">
          {Object.keys(phaseConfig).map((phase) => (
            <InteractiveButton
              key={phase}
              variant={currentPhase === phase ? 'magic' : 'secondary'}
              size="sm"
              onClick={() => onPhaseChange(phase as LayoutPhase)}
              className="capitalize"
            >
              {phase}
            </InteractiveButton>
          ))}
        </div>
      </div>

      {/* Wizard Toggle */}
      <div className="absolute top-4 right-4 z-30">
        <InteractiveButton
          variant="secondary"
          size="sm"
          onClick={() => setShowWizard(!showWizard)}
        >
          {showWizard ? '👁️' : '👁️‍🗨️'}
        </InteractiveButton>
      </div>

      {/* Phase-specific Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {currentPhase === 'upload' && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5" />
        )}
        {currentPhase === 'library' && (
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-emerald-500/5" />
        )}
        {currentPhase === 'summary' && (
          <div className="absolute inset-0 bg-gradient-to-l from-purple-500/5 to-pink-500/5" />
        )}
        {currentPhase === 'idle' && (
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
        )}
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 4,
              delay: i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DynamicLayout;
