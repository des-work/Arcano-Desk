import React, { Suspense, lazy, ComponentType } from 'react';
import { motion } from 'framer-motion';

// Loading component for animations
const AnimationLoader: React.FC = () => (
  <motion.div
    className="flex items-center justify-center p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="text-center">
      <motion.div
        className="w-8 h-8 border-4 border-purple-400/30 border-t-purple-400 rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-purple-300 text-sm font-arcane">Loading magical effects...</p>
    </div>
  </motion.div>
);

// Lazy load animation components
export const LazyEpicAnimations = lazy(() => import('../animations/EpicAnimations'));
export const LazyWizardAnimations = lazy(() => import('../animations/WizardAnimations'));
export const LazyParticleEffects = lazy(() => import('../animations/ParticleEffects'));
export const LazyInteractiveAnimations = lazy(() => import('../animations/InteractiveAnimations'));
export const LazyUltraParticleSystem = lazy(() => import('../animations/UltraParticleSystem'));
export const LazyIntelligentOrchestrator = lazy(() => import('../animations/IntelligentOrchestrator'));

// Generic lazy wrapper for any animation component
export const withLazyLoading = <P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ComponentType
) => {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P) => (
    <Suspense fallback={fallback || <AnimationLoader />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Preload critical animations
export const preloadAnimations = () => {
  // Preload commonly used animations
  import('../animations/WizardAnimations');
  import('../animations/ParticleEffects');
  import('../animations/InteractiveAnimations');
};

// Animation bundle splitter
export const AnimationBundleSplitter: React.FC<{
  children: React.ReactNode;
  preload?: boolean;
}> = ({ children, preload = false }) => {
  React.useEffect(() => {
    if (preload) {
      preloadAnimations();
    }
  }, [preload]);

  return <>{children}</>;
};

export default AnimationLoader;
