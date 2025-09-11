import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  CloudRain, 
  Snowflake, 
  Leaf, 
  PawPrint, 
  Brain, 
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Settings,
  Wand2,
  Crown,
  Star
} from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import { useOllama } from '../contexts/OllamaContext';
import { useAnimations } from '../animations';

interface EnhancedWizardProps {
  isLearning?: boolean;
  hasNewKnowledge?: boolean;
  onCastSpell?: () => void;
  showNavigation?: boolean;
  size?: 'small' | 'medium' | 'large';
  position?: 'fixed' | 'relative' | 'absolute';
}

interface WizardState {
  mood: 'happy' | 'excited' | 'focused' | 'sleepy' | 'curious' | 'proud';
  energy: number;
  wisdom: number;
  currentSpell: string | null;
  isCasting: boolean;
  lastAction: string | null;
  interactionCount: number;
}

const EnhancedWizard: React.FC<EnhancedWizardProps> = ({
  isLearning = false,
  hasNewKnowledge = false,
  onCastSpell,
  showNavigation = true,
  size = 'medium',
  position = 'relative'
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { files, courses, studyMaterials } = useFiles();
  const { isConnected, isLoading } = useOllama();
  const { triggerAnimation } = useAnimations();

  // Enhanced wizard state
  const [wizardState, setWizardState] = useState<WizardState>({
    mood: 'happy',
    energy: 100,
    wisdom: 500,
    currentSpell: null,
    isCasting: false,
    lastAction: null,
    interactionCount: 0
  });

  const [currentEffect, setCurrentEffect] = useState<string>('');
  const [showMessage, setShowMessage] = useState(false);
  const [wizardMessage, setWizardMessage] = useState('');

  // Navigation items based on current route
  const navigationItems = useMemo(() => [
    { 
      path: '/', 
      icon: BookOpen, 
      label: 'Dashboard', 
      description: 'Your magical study hub',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      path: '/library', 
      icon: FileText, 
      label: 'Library', 
      description: 'Manage your scrolls',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      path: '/assistant', 
      icon: MessageSquare, 
      label: 'Oracle', 
      description: 'Ask me anything',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      path: '/calendar', 
      icon: Calendar, 
      label: 'Calendar', 
      description: 'Track your quests',
      color: 'from-orange-500 to-red-500'
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings', 
      description: 'Configure your realm',
      color: 'from-amber-500 to-yellow-500'
    }
  ], []);

  // Spell effects with enhanced visuals
  const spellEffects = useMemo(() => [
    { 
      name: 'lightning', 
      icon: Zap, 
      color: 'text-yellow-400', 
      animation: 'animate-lightning',
      description: 'Lightning strikes!',
      mood: 'excited'
    },
    { 
      name: 'rain', 
      icon: CloudRain, 
      color: 'text-blue-400', 
      animation: 'animate-rain-drop',
      description: 'Gentle rain falls...',
      mood: 'focused'
    },
    { 
      name: 'snow', 
      icon: Snowflake, 
      color: 'text-white', 
      animation: 'animate-snow-fall',
      description: 'Snowflakes dance!',
      mood: 'happy'
    },
    { 
      name: 'plants', 
      icon: Leaf, 
      color: 'text-green-400', 
      animation: 'animate-grow-plant',
      description: 'Nature blooms!',
      mood: 'curious'
    },
    { 
      name: 'creatures', 
      icon: PawPrint, 
      color: 'text-purple-400', 
      animation: 'animate-creature-appear',
      description: 'Magical creatures appear!',
      mood: 'proud'
    },
    { 
      name: 'wisdom', 
      icon: Brain, 
      color: 'text-cyan-400', 
      animation: 'animate-wisdom-glow',
      description: 'Wisdom flows!',
      mood: 'focused'
    }
  ], []);

  // Update wizard state based on app context
  useEffect(() => {
    const updateWizardContext = () => {
      const newState = { ...wizardState };
      
      // Update based on current page
      switch (location.pathname) {
        case '/':
          newState.mood = 'happy';
          newState.energy = Math.min(100, newState.energy + 5);
          break;
        case '/library':
          newState.mood = 'focused';
          newState.energy = Math.max(50, newState.energy - 2);
          break;
        case '/assistant':
          newState.mood = 'excited';
          newState.energy = Math.max(30, newState.energy - 5);
          break;
        case '/calendar':
          newState.mood = 'curious';
          break;
        case '/settings':
          newState.mood = 'focused';
          break;
      }

      // Update based on app state
      if (isLearning) {
        newState.mood = 'focused';
        newState.energy = Math.max(20, newState.energy - 3);
        newState.wisdom += 10;
      }

      if (hasNewKnowledge) {
        newState.mood = 'proud';
        newState.wisdom += 25;
        newState.energy = Math.min(100, newState.energy + 10);
      }

      if (isLoading) {
        newState.mood = 'focused';
        newState.energy = Math.max(10, newState.energy - 1);
      }

      // Update based on file count
      if (files.length > 0) {
        newState.wisdom += files.length * 2;
      }

      setWizardState(newState);
    };

    updateWizardContext();
  }, [location.pathname, isLearning, hasNewKnowledge, isLoading, files.length, wizardState]);

  // Cast random spell with enhanced effects
  const castRandomSpell = useCallback(() => {
    const randomEffect = spellEffects[Math.floor(Math.random() * spellEffects.length)];
    setCurrentEffect(randomEffect.name);
    setWizardState(prev => ({
      ...prev,
      currentSpell: randomEffect.name,
      isCasting: true,
      mood: randomEffect.mood as any,
      interactionCount: prev.interactionCount + 1
    }));

    // Show spell message
    setWizardMessage(randomEffect.description);
    setShowMessage(true);

    // Trigger animation
    triggerAnimation('wizard-cast', { intensity: 'moderate', priority: 'high' });

    setTimeout(() => {
      setWizardState(prev => ({ ...prev, isCasting: false, currentSpell: null }));
      setShowMessage(false);
    }, 3000);

    if (onCastSpell) {
      onCastSpell();
    }
  }, [spellEffects, triggerAnimation, onCastSpell]);

  // Auto-cast spells based on context
  useEffect(() => {
    const autoCastInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        castRandomSpell();
      }
    }, 10000);

    return () => clearInterval(autoCastInterval);
  }, [castRandomSpell]);

  // Cast spell on learning or new knowledge
  useEffect(() => {
    if (isLearning || hasNewKnowledge) {
      setTimeout(castRandomSpell, 500);
    }
  }, [isLearning, hasNewKnowledge, castRandomSpell]);

  // Get wizard appearance based on state
  const getWizardAppearance = () => {
    const { mood, energy, wisdom } = wizardState;
    
    let hatColor = 'border-b-purple-600';
    let robeColor = 'from-purple-900 to-purple-700';
    let auraColor = 'border-purple-500/50';

    if (mood === 'excited') {
      hatColor = 'border-b-yellow-600';
      robeColor = 'from-yellow-900 to-orange-700';
      auraColor = 'border-yellow-500/50';
    } else if (mood === 'focused') {
      hatColor = 'border-b-blue-600';
      robeColor = 'from-blue-900 to-indigo-700';
      auraColor = 'border-blue-500/50';
    } else if (mood === 'proud') {
      hatColor = 'border-b-green-600';
      robeColor = 'from-green-900 to-emerald-700';
      auraColor = 'border-green-500/50';
    }

    return { hatColor, robeColor, auraColor };
  };

  const { hatColor, robeColor, auraColor } = getWizardAppearance();

  // Size classes
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const positionClasses = {
    fixed: 'fixed bottom-4 right-4 z-50',
    relative: 'relative',
    absolute: 'absolute'
  };

  return (
    <div className={`${positionClasses[position]} flex flex-col items-center space-y-4`}>
      {/* Wizard Character */}
      <div className="relative">
        {/* Magical Aura */}
        <div className={`absolute inset-0 rounded-full border-4 ${auraColor} animate-magic-circle ${wizardState.isCasting ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`} />

        {/* Wizard Body */}
        <motion.div 
          className={`relative bg-gradient-to-b ${robeColor} rounded-lg p-6 shadow-2xl border border-purple-400/30 ${sizeClasses[size]}`}
          animate={{
            scale: wizardState.isCasting ? [1, 1.1, 1] : 1,
            rotate: wizardState.mood === 'excited' ? [0, 5, -5, 0] : 0
          }}
          transition={{ duration: 0.5 }}
        >
          {/* Wizard Hat */}
          <div className="relative mb-4">
            <div className={`w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent ${hatColor} mx-auto`}></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-6 h-3 bg-yellow-400 rounded-t-full"></div>
            <Sparkles className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-sparkle" size={16} />
          </div>

          {/* Wizard Face */}
          <div className="text-center mb-4">
            <motion.div 
              className="text-4xl mb-2"
              animate={{
                rotate: wizardState.mood === 'excited' ? [0, 10, -10, 0] : 0,
                scale: wizardState.isCasting ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.3 }}
            >
              🧙‍♂️
            </motion.div>
            <div className="text-xs font-rune text-purple-200 tracking-wider">
              {wizardState.isCasting ? 'CASTING...' : 
               isLearning ? 'LEARNING...' : 
               hasNewKnowledge ? 'INSIGHT!' : 
               wizardState.mood.toUpperCase()}
            </div>
          </div>

          {/* Wizard Robe */}
          <div className="text-center">
            <div className="text-2xl">👘</div>
            <div className="flex justify-center space-x-2 mt-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </motion.div>

        {/* Active Spell Effect */}
        <AnimatePresence>
          {wizardState.isCasting && currentEffect && (
            <motion.div 
              className={`absolute -top-8 left-1/2 transform -translate-x-1/2`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
            >
              {spellEffects.find(e => e.name === currentEffect)?.icon && (() => {
                const IconComponent = spellEffects.find(e => e.name === currentEffect)!.icon;
                return (
                  <IconComponent 
                    size={32} 
                    className={spellEffects.find(e => e.name === currentEffect)!.color} 
                  />
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Spell Book */}
      <motion.div 
        className="bg-gradient-to-b from-amber-900 to-amber-800 rounded-lg p-4 shadow-lg border border-amber-600/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-center font-rune text-amber-200 text-sm mb-2">SPELL BOOK</div>
        <div className="grid grid-cols-3 gap-2">
          {spellEffects.slice(0, 6).map((effect, index) => (
            <motion.button
              key={effect.name}
              onClick={() => {
                setCurrentEffect(effect.name);
                setWizardState(prev => ({
                  ...prev,
                  currentSpell: effect.name,
                  isCasting: true,
                  mood: effect.mood as any,
                  interactionCount: prev.interactionCount + 1
                }));
                setWizardMessage(effect.description);
                setShowMessage(true);
                triggerAnimation('wizard-cast', { intensity: 'moderate', priority: 'high' });
                
                setTimeout(() => {
                  setWizardState(prev => ({ ...prev, isCasting: false, currentSpell: null }));
                  setShowMessage(false);
                }, 3000);
                
                if (onCastSpell) onCastSpell();
              }}
              className={`p-2 rounded border-2 transition-all duration-200 hover:scale-110 ${
                currentEffect === effect.name && wizardState.isCasting
                  ? 'border-yellow-400 bg-yellow-400/20 animate-pulse'
                  : 'border-amber-600/50 bg-amber-800/50 hover:border-amber-400'
              }`}
              title={`Cast ${effect.name} spell`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <effect.icon size={16} className={effect.color} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation Menu */}
      {showNavigation && (
        <motion.div 
          className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-full px-4 py-2 border border-purple-400/30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-2">
            <Brain size={16} className="text-purple-300" />
            <span className="font-arcane text-purple-200 text-sm">
              Wisdom: {wizardState.wisdom}
            </span>
            <span className="text-purple-300/60">•</span>
            <span className="font-arcane text-purple-200 text-sm">
              Energy: {wizardState.energy}%
            </span>
          </div>
        </motion.div>
      )}

      {/* Navigation Items */}
      {showNavigation && (
        <motion.div 
          className="bg-gradient-to-b from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center font-rune text-slate-200 text-sm mb-3">NAVIGATION</div>
          <div className="grid grid-cols-2 gap-2">
            {navigationItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`p-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  location.pathname === item.path
                    ? 'border-purple-400 bg-purple-400/20'
                    : 'border-slate-600/50 bg-slate-700/50 hover:border-slate-500'
                }`}
                title={item.description}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon size={16} className="text-slate-300 mx-auto mb-1" />
                <div className="text-xs font-arcane text-slate-300">{item.label}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Wizard Message */}
      <AnimatePresence>
        {showMessage && wizardMessage && (
          <motion.div
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-900/90 to-pink-900/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-400/30"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-purple-200 font-arcane text-sm text-center">
              {wizardMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedWizard;
