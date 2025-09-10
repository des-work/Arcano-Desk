import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { updatePerformance, optimizePerformance } from '../store/slices/uiSlice';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  lastOptimization: number;
}

interface PerformanceOptions {
  enableMonitoring: boolean;
  optimizationThreshold: number;
  memoryWarningThreshold: number;
  autoOptimize: boolean;
}

export const usePerformance = (options: Partial<PerformanceOptions> = {}) => {
  const dispatch = useAppDispatch();
  const { performance } = useAppSelector((state) => state.ui);
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    componentCount: 0,
    lastOptimization: Date.now(),
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const renderStartTime = useRef<number>(0);
  const componentCountRef = useRef<number>(0);
  const optimizationTimeoutRef = useRef<NodeJS.Timeout>();

  const defaultOptions: PerformanceOptions = {
    enableMonitoring: true,
    optimizationThreshold: 100, // ms
    memoryWarningThreshold: 50 * 1024 * 1024, // 50MB
    autoOptimize: true,
    ...options,
  };

  // Measure render time
  const startRenderTimer = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRenderTimer = useCallback(() => {
    if (renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current;
      setMetrics(prev => ({ ...prev, renderTime }));
      
      // Check if optimization is needed
      if (defaultOptions.autoOptimize && renderTime > defaultOptions.optimizationThreshold) {
        scheduleOptimization();
      }
    }
  }, [defaultOptions.autoOptimize, defaultOptions.optimizationThreshold]);

  // Memory monitoring
  const updateMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const memoryUsage = memory.usedJSHeapSize;
      setMetrics(prev => ({ ...prev, memoryUsage }));
      
      // Check for memory warnings
      if (memoryUsage > defaultOptions.memoryWarningThreshold) {
        console.warn('🧙‍♂️ High memory usage detected:', {
          used: Math.round(memoryUsage / 1024 / 1024) + 'MB',
          total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB',
          limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + 'MB',
        });
        
        if (defaultOptions.autoOptimize) {
          scheduleOptimization();
        }
      }
    }
  }, [defaultOptions.memoryWarningThreshold, defaultOptions.autoOptimize]);

  // Component counting
  const incrementComponentCount = useCallback(() => {
    componentCountRef.current += 1;
    setMetrics(prev => ({ ...prev, componentCount: componentCountRef.current }));
  }, []);

  const decrementComponentCount = useCallback(() => {
    componentCountRef.current = Math.max(0, componentCountRef.current - 1);
    setMetrics(prev => ({ ...prev, componentCount: componentCountRef.current }));
  }, []);

  // Optimization scheduling
  const scheduleOptimization = useCallback(() => {
    if (optimizationTimeoutRef.current) {
      clearTimeout(optimizationTimeoutRef.current);
    }
    
    optimizationTimeoutRef.current = setTimeout(() => {
      performOptimization();
    }, 1000); // Delay optimization by 1 second
  }, []);

  // Performance optimization
  const performOptimization = useCallback(async () => {
    if (isOptimizing) return;
    
    setIsOptimizing(true);
    console.log('🧙‍♂️ Performing performance optimization...');
    
    try {
      // Update Redux state
      dispatch(optimizePerformance());
      
      // Clear unused caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          if (cacheName.includes('old-') || cacheName.includes('temp-')) {
            await caches.delete(cacheName);
          }
        }
      }
      
      // Force garbage collection if available
      if ('gc' in window && typeof (window as any).gc === 'function') {
        (window as any).gc();
      }
      
      // Update metrics
      setMetrics(prev => ({
        ...prev,
        lastOptimization: Date.now(),
        renderTime: 0,
      }));
      
      console.log('✨ Performance optimization completed');
    } catch (error) {
      console.error('Failed to perform optimization:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [dispatch, isOptimizing]);

  // Manual optimization trigger
  const optimize = useCallback(() => {
    performOptimization();
  }, [performOptimization]);

  // Performance monitoring
  useEffect(() => {
    if (!defaultOptions.enableMonitoring) return;

    const interval = setInterval(() => {
      updateMemoryUsage();
    }, 5000); // Check memory every 5 seconds

    return () => clearInterval(interval);
  }, [defaultOptions.enableMonitoring, updateMemoryUsage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (optimizationTimeoutRef.current) {
        clearTimeout(optimizationTimeoutRef.current);
      }
    };
  }, []);

  // Memoization helper
  const memoize = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    deps: React.DependencyList
  ): T => {
    const cache = new Map();
    
    return ((...args: Parameters<T>) => {
      const key = JSON.stringify(args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const result = fn(...args);
      cache.set(key, result);
      
      // Limit cache size
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
      
      return result;
    }) as T;
  }, []);

  // Debounce helper
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): T => {
    let timeoutId: NodeJS.Timeout;
    
    return ((...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    }) as T;
  }, []);

  // Throttle helper
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): T => {
    let lastCall = 0;
    
    return ((...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        fn(...args);
      }
    }) as T;
  }, []);

  // Performance report
  const getPerformanceReport = useCallback(() => {
    const report = {
      metrics,
      performance: {
        ...performance,
        isOptimizing,
      },
      recommendations: [] as string[],
    };

    // Add recommendations based on metrics
    if (metrics.renderTime > 100) {
      report.recommendations.push('Consider optimizing component rendering');
    }
    
    if (metrics.memoryUsage > defaultOptions.memoryWarningThreshold) {
      report.recommendations.push('High memory usage detected - consider cleanup');
    }
    
    if (metrics.componentCount > 100) {
      report.recommendations.push('Large number of components - consider lazy loading');
    }

    return report;
  }, [metrics, performance, isOptimizing, defaultOptions.memoryWarningThreshold]);

  return {
    // Metrics
    metrics,
    isOptimizing,
    
    // Methods
    startRenderTimer,
    endRenderTimer,
    incrementComponentCount,
    decrementComponentCount,
    optimize,
    
    // Utilities
    memoize,
    debounce,
    throttle,
    
    // Reports
    getPerformanceReport,
  };
};
