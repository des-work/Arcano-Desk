import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated, useTransition } from '@react-spring/web';
import { 
  AnimationType, 
  AnimationConfig, 
  AnimationTrigger, 
  AnimationState, 
  AnimationIntensity,
  ANIMATION_PRESETS,
  ANIMATION_TRIGGERS,
  PERFORMANCE_ANIMATIONS,
  getAnimationDuration,
  getAnimationIntensity,
  shouldTriggerAnimation
} from './AnimationTypes';

interface AnimationContextType {
  state: AnimationState;
  triggerAnimation: (type: AnimationType, config?: Partial<AnimationConfig>) => void;
  stopAnimation: (id: string) => void;
  stopAllAnimations: () => void;
  setGlobalIntensity: (intensity: AnimationIntensity) => void;
  setPerformanceMode: (mode: 'high' | 'medium' | 'low') => void;
  toggleAnimations: () => void;
  getActiveAnimations: () => Map<string, AnimationConfig>;
  isAnimationActive: (type: AnimationType) => boolean;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAnimations = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimations must be used within an AnimationProvider');
  }
  return context;
};

// Animation Reducer
type AnimationAction = 
  | { type: 'TRIGGER_ANIMATION'; payload: { id: string; config: AnimationConfig } }
  | { type: 'STOP_ANIMATION'; payload: string }
  | { type: 'STOP_ALL_ANIMATIONS' }
  | { type: 'SET_GLOBAL_INTENSITY'; payload: AnimationIntensity }
  | { type: 'SET_PERFORMANCE_MODE'; payload: 'high' | 'medium' | 'low' }
  | { type: 'TOGGLE_ANIMATIONS' }
  | { type: 'CLEANUP_ANIMATIONS' }
  | { type: 'UPDATE_TRIGGER_COOLDOWN'; payload: { id: string; timestamp: number } };

const animationReducer = (state: AnimationState, action: AnimationAction): AnimationState => {
  switch (action.type) {
    case 'TRIGGER_ANIMATION':
      const newActiveAnimations = new Map(state.activeAnimations);
      newActiveAnimations.set(action.payload.id, action.payload.config);
      
      return {
        ...state,
        activeAnimations: newActiveAnimations,
        queuedAnimations: state.queuedAnimations.filter(anim => anim.type !== action.payload.config.type)
      };
      
    case 'STOP_ANIMATION':
      const updatedActiveAnimations = new Map(state.activeAnimations);
      updatedActiveAnimations.delete(action.payload);
      
      return {
        ...state,
        activeAnimations: updatedActiveAnimations
      };
      
    case 'STOP_ALL_ANIMATIONS':
      return {
        ...state,
        activeAnimations: new Map(),
        queuedAnimations: []
      };
      
    case 'SET_GLOBAL_INTENSITY':
      return {
        ...state,
        globalIntensity: action.payload
      };
      
    case 'SET_PERFORMANCE_MODE':
      return {
        ...state,
        performanceMode: action.payload
      };
      
    case 'TOGGLE_ANIMATIONS':
      return {
        ...state,
        isAnimationsEnabled: !state.isAnimationsEnabled
      };
      
    case 'CLEANUP_ANIMATIONS':
      // Remove completed animations
      const cleanedAnimations = new Map();
      state.activeAnimations.forEach((config, id) => {
        if (config.playState !== 'paused') {
          cleanedAnimations.set(id, config);
        }
      });
      
      return {
        ...state,
        activeAnimations: cleanedAnimations
      };
      
    case 'UPDATE_TRIGGER_COOLDOWN':
      // Update trigger cooldown (handled by triggers)
      return state;
      
    default:
      return state;
  }
};

// Initial State
const initialState: AnimationState = {
  activeAnimations: new Map(),
  queuedAnimations: [],
  globalIntensity: 'moderate',
  isAnimationsEnabled: true,
  performanceMode: 'high',
  lastPerformanceCheck: Date.now()
};

// Animation Provider
export const AnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(animationReducer, initialState);
  const performanceRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();

  // Performance monitoring
  const checkPerformance = useCallback(() => {
    const now = Date.now();
    if (now - state.lastPerformanceCheck > 5000) { // Check every 5 seconds
      const currentPerformance = performance.now();
      const performanceDelta = currentPerformance - performanceRef.current;
      
      if (performanceDelta > 16.67) { // More than 60fps threshold
        dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'medium' });
      } else if (performanceDelta > 33.33) { // More than 30fps threshold
        dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'low' });
      } else {
        dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'high' });
      }
      
      performanceRef.current = currentPerformance;
    }
  }, [state.lastPerformanceCheck]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      checkPerformance();
      dispatch({ type: 'CLEANUP_ANIMATIONS' });
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [checkPerformance]);

  // Trigger animation
  const triggerAnimation = useCallback((
    type: AnimationType, 
    config: Partial<AnimationConfig> = {}
  ) => {
    if (!state.isAnimationsEnabled) return;
    
    const fullConfig: AnimationConfig = {
      ...ANIMATION_PRESETS[type] || {
        type,
        intensity: 'moderate',
        duration: 'normal',
        easing: 'ease-in-out'
      },
      ...config,
      intensity: config.intensity || state.globalIntensity
    };
    
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check performance limits
    const performanceConfig = PERFORMANCE_ANIMATIONS[state.performanceMode];
    if (state.activeAnimations.size >= performanceConfig.maxConcurrentAnimations) {
      // Queue animation if at limit
      dispatch({ 
        type: 'TRIGGER_ANIMATION', 
        payload: { id, config: { ...fullConfig, playState: 'paused' } }
      });
      return;
    }
    
    dispatch({ type: 'TRIGGER_ANIMATION', payload: { id, config: fullConfig } });
    
    // Auto-cleanup after animation duration
    const duration = getAnimationDuration(fullConfig.duration);
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'STOP_ANIMATION', payload: id });
      }, duration);
    }
  }, [state.isAnimationsEnabled, state.globalIntensity, state.activeAnimations.size, state.performanceMode]);

  // Stop animation
  const stopAnimation = useCallback((id: string) => {
    dispatch({ type: 'STOP_ANIMATION', payload: id });
  }, []);

  // Stop all animations
  const stopAllAnimations = useCallback(() => {
    dispatch({ type: 'STOP_ALL_ANIMATIONS' });
  }, []);

  // Set global intensity
  const setGlobalIntensity = useCallback((intensity: AnimationIntensity) => {
    dispatch({ type: 'SET_GLOBAL_INTENSITY', payload: intensity });
  }, []);

  // Set performance mode
  const setPerformanceMode = useCallback((mode: 'high' | 'medium' | 'low') => {
    dispatch({ type: 'SET_PERFORMANCE_MODE', payload: mode });
  }, []);

  // Toggle animations
  const toggleAnimations = useCallback(() => {
    dispatch({ type: 'TOGGLE_ANIMATIONS' });
  }, []);

  // Get active animations
  const getActiveAnimations = useCallback(() => {
    return state.activeAnimations;
  }, [state.activeAnimations]);

  // Check if animation is active
  const isAnimationActive = useCallback((type: AnimationType) => {
    return Array.from(state.activeAnimations.values()).some(config => config.type === type);
  }, [state.activeAnimations]);

  // Auto-trigger animations based on context
  const handleContextChange = useCallback((context: any) => {
    ANIMATION_TRIGGERS.forEach(trigger => {
      if (shouldTriggerAnimation(trigger, context)) {
        triggerAnimation(trigger.config.type, trigger.config);
        
        // Update cooldown
        dispatch({ 
          type: 'UPDATE_TRIGGER_COOLDOWN', 
          payload: { id: trigger.id, timestamp: Date.now() } 
        });
      }
    });
  }, [triggerAnimation]);

  // Expose context change handler
  useEffect(() => {
    (window as any).triggerAnimationContext = handleContextChange;
  }, [handleContextChange]);

  const value: AnimationContextType = {
    state,
    triggerAnimation,
    stopAnimation,
    stopAllAnimations,
    setGlobalIntensity,
    setPerformanceMode,
    toggleAnimations,
    getActiveAnimations,
    isAnimationActive
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

// Animation Component Wrapper
export const AnimatedComponent: React.FC<{
  type: AnimationType;
  config?: Partial<AnimationConfig>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ type, config, children, className, style }) => {
  const { triggerAnimation, isAnimationActive } = useAnimations();
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    triggerAnimation('button-hover', { intensity: 'gentle' });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    triggerAnimation('button-click', { intensity: 'moderate' });
  };

  const isActive = isAnimationActive(type);

  return (
    <motion.div
      className={className}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      animate={isActive ? {
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0],
        transition: {
          duration: 0.5,
          ease: "easeInOut"
        }
      } : {}}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Epic Animation Component for Dragon Battle
export const EpicAnimation: React.FC<{
  type: 'dragon-battle' | 'epic-summary' | 'massive-spell';
  isActive: boolean;
  onComplete?: () => void;
}> = ({ type, isActive, onComplete }) => {
  const [phase, setPhase] = React.useState<'preparation' | 'battle' | 'victory' | 'complete'>('preparation');

  useEffect(() => {
    if (!isActive) return;

    const phases = [
      { phase: 'preparation', delay: 0 },
      { phase: 'battle', delay: 1000 },
      { phase: 'victory', delay: 4000 },
      { phase: 'complete', delay: 6000 }
    ];

    phases.forEach(({ phase, delay }) => {
      setTimeout(() => {
        setPhase(phase as any);
        if (phase === 'complete') {
          onComplete?.();
        }
      }, delay);
    });
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Dragon Battle Animation */}
      {type === 'dragon-battle' && (
        <div className="relative w-full h-full">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-orange-900/20 to-yellow-900/20 animate-pulse" />
          
          {/* Dragon */}
          <motion.div
            className="absolute top-1/4 right-1/4 w-32 h-32"
            animate={{
              x: [0, -50, 0],
              y: [0, -20, 0],
              rotate: [0, -10, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-8xl">🐉</div>
          </motion.div>
          
          {/* Wizard */}
          <motion.div
            className="absolute bottom-1/4 left-1/4 w-24 h-24"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-6xl">🧙‍♂️</div>
          </motion.div>
          
          {/* Fire and Lightning Effects */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-red-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -100, -200]
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
          
          {/* Victory Effects */}
          {phase === 'victory' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <div className="text-6xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                ✨ VICTORY! ✨
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnimationProvider;
