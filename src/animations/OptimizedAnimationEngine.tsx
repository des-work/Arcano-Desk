import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AnimationType, 
  AnimationConfig, 
  AnimationState, 
  AnimationIntensity,
  ANIMATION_PRESETS,
  getAnimationDuration
} from './AnimationTypes';

// Optimized Animation Types
interface OptimizedAnimationConfig extends AnimationConfig {
  priority?: 'low' | 'medium' | 'high' | 'critical';
  lazy?: boolean; // Load animation only when needed
  cacheable?: boolean; // Can be cached for reuse
  performance?: {
    maxParticles?: number;
    quality?: 'low' | 'medium' | 'high';
    adaptive?: boolean;
  };
}

interface AnimationContextType {
  state: AnimationState;
  triggerAnimation: (type: AnimationType, config?: Partial<OptimizedAnimationConfig>) => void;
  stopAnimation: (id: string) => void;
  stopAllAnimations: () => void;
  setGlobalIntensity: (intensity: AnimationIntensity) => void;
  setPerformanceMode: (mode: 'high' | 'medium' | 'low') => void;
  toggleAnimations: () => void;
  getActiveAnimations: () => Map<string, OptimizedAnimationConfig>;
  isAnimationActive: (type: AnimationType) => boolean;
  // Performance optimization methods
  optimizeForPerformance: () => void;
  getPerformanceMetrics: () => PerformanceMetrics;
  preloadAnimation: (type: AnimationType) => void;
  clearAnimationCache: () => void;
}

interface PerformanceMetrics {
  fps: number;
  activeAnimations: number;
  memoryUsage: number;
  performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export const useOptimizedAnimations = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useOptimizedAnimations must be used within an OptimizedAnimationProvider');
  }
  return context;
};

// Performance Monitor Class
class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private fps = 60;
  private memoryUsage = 0;
  private animationCount = 0;
  private performanceHistory: number[] = [];

  update() {
    this.frameCount++;
    const now = performance.now();
    
    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = now;
      
      // Track performance history
      this.performanceHistory.push(this.fps);
      if (this.performanceHistory.length > 10) {
        this.performanceHistory.shift();
      }
      
      // Update memory usage if available
      if ((performance as any).memory) {
        this.memoryUsage = (performance as any).memory.usedJSHeapSize;
      }
    }
  }

  getMetrics(): PerformanceMetrics {
    const avgFps = this.performanceHistory.length > 0 
      ? this.performanceHistory.reduce((sum, fps) => sum + fps, 0) / this.performanceHistory.length 
      : this.fps;

    const performanceRating = this.getPerformanceRating(avgFps);
    const recommendations = this.getRecommendations(avgFps);

    return {
      fps: avgFps,
      activeAnimations: this.animationCount,
      memoryUsage: this.memoryUsage,
      performanceRating,
      recommendations
    };
  }

  private getPerformanceRating(fps: number): 'excellent' | 'good' | 'fair' | 'poor' {
    if (fps >= 55 && this.memoryUsage < 50 * 1024 * 1024) return 'excellent';
    if (fps >= 45 && this.memoryUsage < 100 * 1024 * 1024) return 'good';
    if (fps >= 30 && this.memoryUsage < 200 * 1024 * 1024) return 'fair';
    return 'poor';
  }

  private getRecommendations(fps: number): string[] {
    const recommendations: string[] = [];
    
    if (fps < 30) {
      recommendations.push('Reduce animation intensity');
      recommendations.push('Disable particle effects');
      recommendations.push('Lower animation quality');
    } else if (fps < 45) {
      recommendations.push('Consider reducing concurrent animations');
      recommendations.push('Optimize particle count');
    } else if (fps >= 55) {
      recommendations.push('Performance is excellent - all animations enabled');
    }
    
    if (this.memoryUsage > 100 * 1024 * 1024) {
      recommendations.push('High memory usage - clear animation cache');
    }
    
    return recommendations;
  }

  setAnimationCount(count: number) {
    this.animationCount = count;
  }
}

// Animation Cache for lazy loading
class AnimationCache {
  private cache = new Map<string, any>();
  private preloadedAnimations = new Set<string>();

  preload(type: AnimationType) {
    if (this.preloadedAnimations.has(type)) return;
    
    // Preload animation components
    this.preloadedAnimations.add(type);
    console.log(`🎬 Preloaded animation: ${type}`);
  }

  get(type: AnimationType) {
    return this.cache.get(type);
  }

  set(type: AnimationType, animation: any) {
    this.cache.set(type, animation);
  }

  clear() {
    this.cache.clear();
    this.preloadedAnimations.clear();
    console.log('🧹 Animation cache cleared');
  }

  isPreloaded(type: AnimationType): boolean {
    return this.preloadedAnimations.has(type);
  }
}

// Optimized Animation Reducer
type OptimizedAnimationAction = 
  | { type: 'TRIGGER_ANIMATION'; payload: { id: string; config: OptimizedAnimationConfig } }
  | { type: 'STOP_ANIMATION'; payload: string }
  | { type: 'STOP_ALL_ANIMATIONS' }
  | { type: 'SET_GLOBAL_INTENSITY'; payload: AnimationIntensity }
  | { type: 'SET_PERFORMANCE_MODE'; payload: 'high' | 'medium' | 'low' }
  | { type: 'TOGGLE_ANIMATIONS' }
  | { type: 'CLEANUP_ANIMATIONS' }
  | { type: 'UPDATE_PERFORMANCE' };

const optimizedAnimationReducer = (state: AnimationState, action: OptimizedAnimationAction): AnimationState => {
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
      // Remove completed animations and optimize memory
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

// Performance-based animation limits
const PERFORMANCE_LIMITS = {
  high: { maxConcurrent: 15, maxParticles: 100, quality: 'high' },
  medium: { maxConcurrent: 10, maxParticles: 50, quality: 'medium' },
  low: { maxConcurrent: 5, maxParticles: 20, quality: 'low' }
};

// Optimized Animation Provider
export const OptimizedAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(optimizedAnimationReducer, initialState);
  const performanceRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const performanceMonitor = useRef(new PerformanceMonitor());
  const animationCache = useRef(new AnimationCache());

  // Performance monitoring with throttling
  const checkPerformance = useCallback(() => {
    const now = Date.now();
    if (now - state.lastPerformanceCheck > 2000) { // Check every 2 seconds
      performanceMonitor.current.update();
      performanceMonitor.current.setAnimationCount(state.activeAnimations.size);
      
      const metrics = performanceMonitor.current.getMetrics();
      
      // Auto-optimize based on performance
      if (metrics.performanceRating === 'poor' && state.performanceMode !== 'low') {
        dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'low' });
        console.warn('🚨 Performance poor - switching to low animation mode');
      } else if (metrics.performanceRating === 'excellent' && state.performanceMode !== 'high') {
        dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'high' });
        console.log('✨ Performance excellent - enabling high animation mode');
      }
      
      dispatch({ type: 'UPDATE_PERFORMANCE' });
    }
  }, [state.lastPerformanceCheck, state.activeAnimations.size, state.performanceMode]);

  // Optimized animation loop
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

  // Optimized animation trigger with performance checks
  const triggerAnimation = useCallback((
    type: AnimationType, 
    config: Partial<OptimizedAnimationConfig> = {}
  ) => {
    if (!state.isAnimationsEnabled) return;
    
    const fullConfig: OptimizedAnimationConfig = {
      ...ANIMATION_PRESETS[type] || {
        type,
        intensity: 'moderate',
        duration: 'normal',
        easing: 'ease-in-out'
      },
      ...config,
      intensity: config.intensity || state.globalIntensity,
      priority: config.priority || 'medium',
      lazy: config.lazy ?? true,
      cacheable: config.cacheable ?? true,
      performance: {
        maxParticles: config.performance?.maxParticles || PERFORMANCE_LIMITS[state.performanceMode].maxParticles,
        quality: config.performance?.quality || PERFORMANCE_LIMITS[state.performanceMode].quality,
        adaptive: config.performance?.adaptive ?? true
      }
    };
    
    // Check performance limits
    const limits = PERFORMANCE_LIMITS[state.performanceMode];
    if (state.activeAnimations.size >= limits.maxConcurrent) {
      console.warn(`🚫 Animation limit reached (${limits.maxConcurrent}) - skipping ${type}`);
      return;
    }
    
    // Preload if lazy and not cached
    if (fullConfig.lazy && !animationCache.current.isPreloaded(type)) {
      animationCache.current.preload(type);
    }
    
    const id = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    dispatch({ type: 'TRIGGER_ANIMATION', payload: { id, config: fullConfig } });
    
    // Auto-cleanup after animation duration
    const duration = getAnimationDuration(fullConfig.duration);
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'STOP_ANIMATION', payload: id });
      }, duration);
    }
  }, [state.isAnimationsEnabled, state.globalIntensity, state.activeAnimations.size, state.performanceMode]);

  // Performance optimization
  const optimizeForPerformance = useCallback(() => {
    const metrics = performanceMonitor.current.getMetrics();
    
    if (metrics.performanceRating === 'poor') {
      dispatch({ type: 'SET_PERFORMANCE_MODE', payload: 'low' });
      animationCache.current.clear();
      console.log('🔧 Performance optimization applied');
    }
  }, []);

  // Get performance metrics
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    return performanceMonitor.current.getMetrics();
  }, []);

  // Preload animation
  const preloadAnimation = useCallback((type: AnimationType) => {
    animationCache.current.preload(type);
  }, []);

  // Clear animation cache
  const clearAnimationCache = useCallback(() => {
    animationCache.current.clear();
  }, []);

  const value: AnimationContextType = {
    state,
    triggerAnimation,
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
    optimizeForPerformance,
    getPerformanceMetrics,
    preloadAnimation,
    clearAnimationCache
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
};

// Optimized Animated Component with lazy loading
export const OptimizedAnimatedComponent: React.FC<{
  type: AnimationType;
  config?: Partial<OptimizedAnimationConfig>;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  lazy?: boolean;
}> = ({ type, config, children, className, style, lazy = true }) => {
  const { triggerAnimation, isAnimationActive, preloadAnimation } = useOptimizedAnimations();
  const [isLoaded, setIsLoaded] = React.useState(!lazy);
  const [isHovered, setIsHovered] = React.useState(false);

  // Lazy load animation on first interaction
  useEffect(() => {
    if (lazy && !isLoaded) {
      preloadAnimation(type);
    }
  }, [lazy, isLoaded, type, preloadAnimation]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isLoaded) {
      setIsLoaded(true);
    }
    triggerAnimation('button-hover', { intensity: 'gentle', priority: 'low' });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = () => {
    triggerAnimation('button-click', { intensity: 'moderate', priority: 'medium' });
  };

  const isActive = isAnimationActive(type);

  // Don't render animation until loaded (for lazy loading)
  if (lazy && !isLoaded) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

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

export default OptimizedAnimationProvider;
