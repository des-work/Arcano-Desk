import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  animationCount: number;
  performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
}

interface PerformanceMonitorProps {
  showDebug?: boolean;
  onPerformanceChange?: (metrics: PerformanceMetrics) => void;
  adaptiveQuality?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  showDebug = false,
  onPerformanceChange,
  adaptiveQuality = true
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    animationCount: 0,
    performanceRating: 'excellent',
    recommendations: []
  });

  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const animationFrameRef = useRef<number>();
  const performanceHistory = useRef<number[]>([]);

  const calculatePerformanceRating = useCallback((fps: number, memoryUsage: number): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (fps >= 55 && memoryUsage < 50 * 1024 * 1024) return 'excellent';
    if (fps >= 45 && memoryUsage < 100 * 1024 * 1024) return 'good';
    if (fps >= 30 && memoryUsage < 200 * 1024 * 1024) return 'fair';
    return 'poor';
  }, []);

  const generateRecommendations = useCallback((rating: 'excellent' | 'good' | 'fair' | 'poor'): string[] => {
    const recommendations: string[] = [];
    
    switch (rating) {
      case 'poor':
        recommendations.push('Reduce animation intensity');
        recommendations.push('Disable particle effects');
        recommendations.push('Lower animation quality');
        recommendations.push('Close other browser tabs');
        break;
      case 'fair':
        recommendations.push('Consider reducing concurrent animations');
        recommendations.push('Optimize particle count');
        break;
      case 'good':
        recommendations.push('Performance is good');
        break;
      case 'excellent':
        recommendations.push('Performance is excellent - all animations enabled');
        break;
    }
    
    return recommendations;
  }, []);

  const updateMetrics = useCallback(() => {
    const now = performance.now();
    frameCount.current++;

    if (now - lastTime.current >= 1000) {
      const fps = frameCount.current;
      frameCount.current = 0;
      lastTime.current = now;

      // Track performance history
      performanceHistory.current.push(fps);
      if (performanceHistory.current.length > 10) {
        performanceHistory.current.shift();
      }

      // Calculate average FPS
      const avgFps = performanceHistory.current.reduce((sum, f) => sum + f, 0) / performanceHistory.current.length;

      // Get memory usage if available
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

      // Calculate render time (simplified)
      const renderTime = now - lastTime.current;

      const performanceRating = calculatePerformanceRating(avgFps, memoryUsage);
      const recommendations = generateRecommendations(performanceRating);

      const newMetrics: PerformanceMetrics = {
        fps: avgFps,
        memoryUsage,
        renderTime,
        animationCount: 0, // This would be tracked by the animation system
        performanceRating,
        recommendations
      };

      setMetrics(newMetrics);
      onPerformanceChange?.(newMetrics);

      // Adaptive quality adjustment
      if (adaptiveQuality) {
        if (performanceRating === 'poor') {
          // Trigger quality reduction
          window.dispatchEvent(new CustomEvent('performance-optimize', { 
            detail: { action: 'reduce-quality' } 
          }));
        } else if (performanceRating === 'excellent') {
          // Trigger quality increase
          window.dispatchEvent(new CustomEvent('performance-optimize', { 
            detail: { action: 'increase-quality' } 
          }));
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(updateMetrics);
  }, [calculatePerformanceRating, generateRecommendations, onPerformanceChange, adaptiveQuality]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(updateMetrics);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateMetrics]);

  const getPerformanceColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPerformanceIcon = (rating: string) => {
    switch (rating) {
      case 'excellent': return '✨';
      case 'good': return '👍';
      case 'fair': return '⚠️';
      case 'poor': return '🚨';
      default: return '❓';
    }
  };

  if (!showDebug) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-lg rounded-lg p-4 border border-purple-500/30 min-w-[300px]"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-wizard text-purple-300">Performance Monitor</h3>
          <div className={`flex items-center gap-2 ${getPerformanceColor(metrics.performanceRating)}`}>
            <span className="text-lg">{getPerformanceIcon(metrics.performanceRating)}</span>
            <span className="text-sm font-semibold capitalize">{metrics.performanceRating}</span>
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">FPS:</span>
            <span className="text-white">{metrics.fps.toFixed(1)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Memory:</span>
            <span className="text-white">{(metrics.memoryUsage / 1024 / 1024).toFixed(1)} MB</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Render Time:</span>
            <span className="text-white">{metrics.renderTime.toFixed(2)}ms</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Animations:</span>
            <span className="text-white">{metrics.animationCount}</span>
          </div>
        </div>

        {metrics.recommendations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-purple-500/20">
            <h4 className="text-xs font-semibold text-purple-300 mb-2">Recommendations:</h4>
            <ul className="space-y-1">
              {metrics.recommendations.map((rec, index) => (
                <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                  <span className="text-purple-400">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Performance bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                metrics.performanceRating === 'excellent' ? 'bg-green-500' :
                metrics.performanceRating === 'good' ? 'bg-blue-500' :
                metrics.performanceRating === 'fair' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.fps / 60) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Performance optimization hook
export const usePerformanceOptimization = () => {
  const [isOptimized, setIsOptimized] = useState(false);
  const [qualityLevel, setQualityLevel] = useState<'low' | 'medium' | 'high' | 'ultra'>('high');

  useEffect(() => {
    const handleOptimization = (event: CustomEvent) => {
      const { action } = event.detail;
      
      switch (action) {
        case 'reduce-quality':
          setQualityLevel(prev => {
            const levels = ['ultra', 'high', 'medium', 'low'];
            const currentIndex = levels.indexOf(prev);
            return levels[Math.min(currentIndex + 1, levels.length - 1)] as any;
          });
          setIsOptimized(true);
          break;
        case 'increase-quality':
          setQualityLevel(prev => {
            const levels = ['ultra', 'high', 'medium', 'low'];
            const currentIndex = levels.indexOf(prev);
            return levels[Math.max(currentIndex - 1, 0)] as any;
          });
          setIsOptimized(false);
          break;
      }
    };

    window.addEventListener('performance-optimize', handleOptimization as EventListener);
    
    return () => {
      window.removeEventListener('performance-optimize', handleOptimization as EventListener);
    };
  }, []);

  return { isOptimized, qualityLevel };
};

export default PerformanceMonitor;
