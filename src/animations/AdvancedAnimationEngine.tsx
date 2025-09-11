import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
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

// Advanced Animation Types
interface AdvancedAnimationConfig extends AnimationConfig {
  physics?: {
    damping?: number;
    stiffness?: number;
    mass?: number;
    tension?: number;
    friction?: number;
  };
  easing?: {
    type: 'spring' | 'tween' | 'keyframes' | 'physics';
    config?: any;
  };
  layers?: {
    background?: boolean;
    particles?: boolean;
    effects?: boolean;
    interactions?: boolean;
  };
  performance?: {
    adaptive?: boolean;
    quality?: 'low' | 'medium' | 'high' | 'ultra';
    maxParticles?: number;
    maxEffects?: number;
  };
  intelligence?: {
    contextual?: boolean;
    predictive?: boolean;
    adaptive?: boolean;
    learning?: boolean;
  };
}

interface AnimationContextType {
  state: AnimationState;
  triggerAnimation: (type: AnimationType, config?: Partial<AdvancedAnimationConfig>) => void;
  triggerAdvancedAnimation: (config: AdvancedAnimationConfig) => void;
  stopAnimation: (id: string) => void;
  stopAllAnimations: () => void;
  setGlobalIntensity: (intensity: AnimationIntensity) => void;
  setPerformanceMode: (mode: 'high' | 'medium' | 'low') => void;
  toggleAnimations: () => void;
  getActiveAnimations: () => Map<string, AdvancedAnimationConfig>;
  isAnimationActive: (type: AnimationType) => boolean;
  // Advanced features
  createAnimationSequence: (animations: AdvancedAnimationConfig[]) => void;
  createAnimationLoop: (animation: AdvancedAnimationConfig, iterations?: number) => void;
  createAnimationChain: (animations: AdvancedAnimationConfig[], delays?: number[]) => void;
  optimizePerformance: () => void;
  getPerformanceMetrics: () => any;
  setAdaptiveQuality: (enabled: boolean) => void;
  setContextualAnimations: (enabled: boolean) => void;
  setPredictiveAnimations: (enabled: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useAdvancedAnimations = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAdvancedAnimations must be used within an AdvancedAnimationProvider');
  }
  return context;
};

// Performance monitoring
class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private memoryUsage = 0;
  private renderTime = 0;
  private animationCount = 0;

  update() {
    this.frameCount++;
    const now = performance.now();
    
    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
      
      // Update memory usage if available
      if ((performance as any).memory) {
        this.memoryUsage = (performance as any).memory.usedJSHeapSize;
      }
    }
  }

  getMetrics() {
    return {
      fps: this.fps,
      memoryUsage: this.memoryUsage,
      renderTime: this.renderTime,
      animationCount: this.animationCount,
      performance: this.getPerformanceRating()
    };
  }

  getPerformanceRating(): 'excellent' | 'good' | 'fair' | 'poor' {
    if (this.fps >= 55 && this.memoryUsage < 50 * 1024 * 1024) return 'excellent';
    if (this.fps >= 45 && this.memoryUsage < 100 * 1024 * 1024) return 'good';
    if (this.fps >= 30 && this.memoryUsage < 200 * 1024 * 1024) return 'fair';
    return 'poor';
  }

  setAnimationCount(count: number) {
    this.animationCount = count;
  }
}

// Intelligent Animation System
class IntelligentAnimationSystem {
  private contextHistory: any[] = [];
  private userPreferences: any = {};
  private performanceHistory: any[] = [];
  private learningEnabled = true;

  analyzeContext(context: any): AdvancedAnimationConfig[] {
    const suggestions: AdvancedAnimationConfig[] = [];
    
    // Analyze user behavior patterns
    if (this.contextHistory.length > 0) {
      const lastContext = this.contextHistory[this.contextHistory.length - 1];
      
      // Predict likely next actions
      if (context.type === 'file-upload' && lastContext.type === 'page-load') {
        suggestions.push({
          type: 'wizard-excited',
          intensity: 'moderate',
          duration: 'normal',
          easing: { type: 'spring', config: { damping: 0.8, stiffness: 100 } },
          intelligence: { contextual: true, predictive: true }
        });
      }
      
      // Adaptive quality based on performance
      const performance = this.getCurrentPerformance();
      if (performance === 'poor') {
        suggestions.forEach(s => {
          s.performance = { adaptive: true, quality: 'low', maxParticles: 10 };
        });
      }
    }
    
    this.contextHistory.push(context);
    if (this.contextHistory.length > 50) {
      this.contextHistory.shift();
    }
    
    return suggestions;
  }

  getCurrentPerformance(): 'excellent' | 'good' | 'fair' | 'poor' {
    if (this.performanceHistory.length === 0) return 'good';
    const recent = this.performanceHistory.slice(-10);
    const avgFps = recent.reduce((sum, p) => sum + p.fps, 0) / recent.length;
    
    if (avgFps >= 55) return 'excellent';
    if (avgFps >= 45) return 'good';
    if (avgFps >= 30) return 'fair';
    return 'poor';
  }

  updatePerformance(metrics: any) {
    this.performanceHistory.push(metrics);
    if (this.performanceHistory.length > 100) {
      this.performanceHistory.shift();
    }
  }

  learnFromInteraction(animation: AdvancedAnimationConfig, success: boolean, userSatisfaction: number) {
    if (!this.learningEnabled) return;
    
    // Store user preferences
    if (success && userSatisfaction > 0.8) {
      this.userPreferences[animation.type] = {
        intensity: animation.intensity,
        duration: animation.duration,
        quality: animation.performance?.quality || 'high'
      };
    }
  }
}

// Advanced Animation Reducer
type AdvancedAnimationAction = 
  | { type: 'TRIGGER_ANIMATION'; payload: { id: string; config: AdvancedAnimationConfig } }
  | { type: 'TRIGGER_ADVANCED_ANIMATION'; payload: { id: string; config: AdvancedAnimationConfig } }
  | { type: 'STOP_ANIMATION'; payload: string }
  | { type: 'STOP_ALL_ANIMATIONS' }
  | { type: 'SET_GLOBAL_INTENSITY'; payload: AnimationIntensity }
  | { type: 'SET_PERFORMANCE_MODE'; payload: 'high' | 'medium' | 'low' }
  | { type: 'TOGGLE_ANIMATIONS' }
  | { type: 'CLEANUP_ANIMATIONS' }
  | { type: 'UPDATE_PERFORMANCE'; payload: any }
  | { type: 'SET_ADAPTIVE_QUALITY'; payload: boolean }
  | { type: 'SET_CONTEXTUAL_ANIMATIONS'; payload: boolean }
  | { type: 'SET_PREDICTIVE_ANIMATIONS'; payload: boolean };

const advancedAnimationReducer = (state: AnimationState, action: AdvancedAnimationAction): AnimationState => {
  switch (action.type) {
    case 'TRIGGER_ANIMATION':
    case 'TRIGGER_ADVANCED_ANIMATION':
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
      
    case 'UPDATE_PERFORMANCE':
      return {
        ...state,
        lastPerformanceCheck: Date.now()
      };
      
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

// Advanced Animation Provider
export const AdvancedAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(advancedAnimationReducer, initialState);
  const performanceRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const performanceMonitor = useRef(new PerformanceMonitor());
  const intelligentSystem = useRef(new IntelligentAnimationSystem());
  const [adaptiveQuality, setAdaptiveQuality] = React.useState(true);
  const [contextualAnimations, setContextualAnimations] = React.useState(true);
  const [predictiveAnimations, setPredictiveAnimations] = React.useState(true);

  // Performance monitoring
  const checkPerformance = useCallback(() => {
    const now = Date.now();
    if (now - state.lastPerformanceCheck > 1000) { // Check every second
      performanceMonitor.current.update();
      const metrics = performanceMonitor.current.getMetrics();
      performanceMonitor.current.setAnimationCount(state.activeAnimations.size);
      
      intelligentSystem.current.updatePerformance(metrics);
      
      // Adaptive quality adjustment
      if (adaptiveQuality) {
        const rating = performanceMonitor.current.getPerformanceRating();
        if (rating === 'poor' && state.performanceMode !== 'low') {
          dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'low' });
        } else if (rating === 'excellent' && state.performanceMode !== 'high') {
          dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'high' });
        }
      }
      
      dispatch({ type: 'UPDATE_PERFORMANCE', payload: metrics });
    }
  }, [state.lastPerformanceCheck, state.activeAnimations.size, state.performanceMode, adaptiveQuality]);

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

  // Advanced animation trigger
  const triggerAdvancedAnimation = useCallback((config: AdvancedAnimationConfig) => {
    if (!state.isAnimationsEnabled) return;
    
    const fullConfig: AdvancedAnimationConfig = {
      ...ANIMATION_PRESETS[config.type] || {
        type: config.type,
        intensity: 'moderate',
        duration: 'normal',
        easing: { type: 'spring', config: { damping: 0.8, stiffness: 100 } }
      },
      ...config,
      intensity: config.intensity || state.globalIntensity
    };
    
    const id = `${config.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Check performance limits
    const performanceConfig = PERFORMANCE_ANIMATIONS[state.performanceMode];
    if (state.activeAnimations.size >= performanceConfig.maxConcurrentAnimations) {
      dispatch({ 
        type: 'TRIGGER_ADVANCED_ANIMATION', 
        payload: { id, config: { ...fullConfig, playState: 'paused' } }
      });
      return;
    }
    
    dispatch({ type: 'TRIGGER_ADVANCED_ANIMATION', payload: { id, config: fullConfig } });
    
    // Auto-cleanup after animation duration
    const duration = getAnimationDuration(fullConfig.duration);
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'STOP_ANIMATION', payload: id });
      }, duration);
    }
  }, [state.isAnimationsEnabled, state.globalIntensity, state.activeAnimations.size, state.performanceMode]);

  // Standard animation trigger (backward compatibility)
  const triggerAnimation = useCallback((
    type: AnimationType, 
    config: Partial<AdvancedAnimationConfig> = {}
  ) => {
    triggerAdvancedAnimation({ type, ...config } as AdvancedAnimationConfig);
  }, [triggerAdvancedAnimation]);

  // Animation sequence
  const createAnimationSequence = useCallback((animations: AdvancedAnimationConfig[]) => {
    animations.forEach((animation, index) => {
      setTimeout(() => {
        triggerAdvancedAnimation(animation);
      }, index * 200); // 200ms delay between animations
    });
  }, [triggerAdvancedAnimation]);

  // Animation loop
  const createAnimationLoop = useCallback((animation: AdvancedAnimationConfig, iterations: number = Infinity) => {
    let count = 0;
    const loop = () => {
      if (count < iterations) {
        triggerAdvancedAnimation(animation);
        count++;
        setTimeout(loop, getAnimationDuration(animation.duration) + 100);
      }
    };
    loop();
  }, [triggerAdvancedAnimation]);

  // Animation chain
  const createAnimationChain = useCallback((animations: AdvancedAnimationConfig[], delays: number[] = []) => {
    animations.forEach((animation, index) => {
      const delay = delays[index] || index * 300;
      setTimeout(() => {
        triggerAdvancedAnimation(animation);
      }, delay);
    });
  }, [triggerAdvancedAnimation]);

  // Performance optimization
  const optimizePerformance = useCallback(() => {
    const metrics = performanceMonitor.current.getMetrics();
    if (metrics.fps < 30) {
      dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'low' });
    } else if (metrics.fps < 45) {
      dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'medium' });
    } else {
      dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'high' });
    }
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback(() => {
    return performanceMonitor.current.getMetrics();
  }, []);

  // Contextual animation analysis
  const analyzeContext = useCallback((context: any) => {
    if (contextualAnimations) {
      const suggestions = intelligentSystem.current.analyzeContext(context);
      suggestions.forEach(suggestion => {
        triggerAdvancedAnimation(suggestion);
      });
    }
  }, [contextualAnimations, triggerAdvancedAnimation]);

  // Expose context analysis
  useEffect(() => {
    (window as any).analyzeAnimationContext = analyzeContext;
  }, [analyzeContext]);

  const value: AnimationContextType = {
    state,
    triggerAnimation,
    triggerAdvancedAnimation,
    stopAnimation: useCallback((id: string) => {
      dispatch({ type: 'STOP_ANIMATION', payload: id });
    }, []),
    stopAllAnimations: useCallback(() => {
      dispatch({ type: 'STOP_ALL_ANIMATIONS' });
    }, []),
    setGlobalIntensity: useCallback((intensity: AnimationIntensity) => {
      dispatch({ type: 'SET_GLOBAL_INTENSITY', payload: intensity });
    }, []),
    setPerformanceMode: useCallback((mode: 'high' | 'medium' | 'low') => {
      dispatch({ type: 'SET_PERFORMANCE_MODE', payload: mode });
    }, []),
    toggleAnimations: useCallback(() => {
      dispatch({ type: 'TOGGLE_ANIMATIONS' });
    }, []),
    getActiveAnimations: useCallback(() => {
      return state.activeAnimations;
    }, [state.activeAnimations]),
    isAnimationActive: useCallback((type: AnimationType) => {
      return Array.from(state.activeAnimations.values()).some(config => config.type === type);
    }, [state.activeAnimations]),
    createAnimationSequence,
    createAnimationLoop,
    createAnimationChain,
    optimizePerformance,
    getPerformanceMetrics,
    setAdaptiveQuality,
    setContextualAnimations,
    setPredictiveAnimations
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

export default AdvancedAnimationProvider;
