import React, { lazy, ComponentType } from 'react';

// Lazy load main components
export const LazyStudyGuideGenerator = lazy(() => import('../components/StudyGuideGenerator'));
export const LazyEnhancedStudyGuideGenerator = lazy(() => import('../components/EnhancedStudyGuideGenerator'));
export const LazyStreamlinedStudyGuideGenerator = lazy(() => import('../components/StreamlinedStudyGuideGenerator'));
export const LazyStudyGuideCustomizer = lazy(() => import('../components/StudyGuideCustomizer'));
export const LazyStudyGuideDisplay = lazy(() => import('../components/StudyGuideDisplay'));
export const LazyEnhancedUploadPhase = lazy(() => import('../components/EnhancedUploadPhase'));
export const LazyDocumentUploadProcessor = lazy(() => import('../components/DocumentUploadProcessor'));
export const LazyDocumentProcessingDemo = lazy(() => import('../components/DocumentProcessingDemo'));
// export const LazyLibraryPhase = lazy(() => import('../components/LibraryPhase'));
// export const LazySummaryPhase = lazy(() => import('../components/SummaryPhase'));

// Lazy load animation components (commented out for now)
// export const LazyEpicAnimations = lazy(() => import('../animations/EpicAnimations'));
// export const LazyWizardAnimations = lazy(() => import('../animations/WizardAnimations'));
// export const LazyParticleEffects = lazy(() => import('../animations/ParticleEffects'));
// export const LazyInteractiveAnimations = lazy(() => import('../animations/InteractiveAnimations'));
// export const LazyUltraParticleSystem = lazy(() => import('../animations/UltraParticleSystem'));
// export const LazyIntelligentOrchestrator = lazy(() => import('../animations/IntelligentOrchestrator'));

// Lazy load pages (commented out for now)
// export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
// export const LazyLibrary = lazy(() => import('../pages/Library'));
// export const LazyStudyAssistant = lazy(() => import('../pages/StudyAssistant'));
// export const LazyCalendar = lazy(() => import('../pages/Calendar'));
// export const LazySettings = lazy(() => import('../pages/Settings'));

// Preload critical components (commented out for now)
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used immediately
  // import('../components/StudyGuideDisplay');
  // import('../components/EnhancedUploadPhase');
  // import('../components/Header');
  // import('../components/AnimatedWizard');
};

// Preload animation components (commented out for now)
export const preloadAnimationComponents = () => {
  // import('../animations/WizardAnimations');
  // import('../animations/ParticleEffects');
  // import('../animations/InteractiveAnimations');
};

// Preload all components (for when user is idle)
export const preloadAllComponents = () => {
  preloadCriticalComponents();
  preloadAnimationComponents();
  
  // Preload other components (commented out for now to avoid build issues)
  // import('../components/StudyGuideGenerator');
  // import('../components/EnhancedStudyGuideGenerator');
  // import('../components/StreamlinedStudyGuideGenerator');
  // import('../components/StudyGuideCustomizer');
  // import('../components/LibraryPhase');
  // import('../components/SummaryPhase');
  
  // Preload pages (commented out for now)
  // import('../pages/Dashboard');
  // import('../pages/Library');
  // import('../pages/StudyAssistant');
  // import('../pages/Calendar');
  // import('../pages/Settings');
};

// Bundle analyzer utility
export const getBundleInfo = () => {
  if (typeof window !== 'undefined' && (window as any).__webpack_require__) {
    const webpackRequire = (window as any).__webpack_require__;
    const modules = webpackRequire.cache || {};
    
    return {
      moduleCount: Object.keys(modules).length,
      modules: Object.keys(modules).map(key => ({
        id: key,
        loaded: modules[key].loaded,
        children: modules[key].children?.length || 0
      }))
    };
  }
  
  return null;
};

// Performance-based loading strategy
export const getLoadingStrategy = (connectionType?: string, deviceMemory?: number) => {
  // Check for slow connection
  if (connectionType === 'slow-2g' || connectionType === '2g') {
    return 'minimal';
  }
  
  // Check for low memory device
  if (deviceMemory && deviceMemory < 2) {
    return 'conservative';
  }
  
  // Check for high-end device
  if (deviceMemory && deviceMemory >= 8) {
    return 'aggressive';
  }
  
  return 'balanced';
};

// Dynamic import with error handling
export const safeLazyImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return lazy(() => 
    importFn().catch(error => {
      console.error('Failed to load component:', error);
      // Return a fallback component
      return {
        default: () => React.createElement('div', { className: 'flex items-center justify-center p-8' },
          React.createElement('div', { className: 'text-center' },
            React.createElement('div', { className: 'text-red-400 text-4xl mb-4' }, '⚠️'),
            React.createElement('h3', { className: 'text-lg font-semibold text-red-300 mb-2' }, 'Component Load Error'),
            React.createElement('p', { className: 'text-sm text-gray-400' }, 'Failed to load component. Please refresh the page.')
          )
        )
      };
    })
  );
};

// Route-based code splitting
export const createRouteChunk = (routeName: string) => {
  return lazy(() => {
    console.log(`Loading route chunk: ${routeName}`);
    return import(`../pages/${routeName}`);
  });
};

// Animation-based code splitting
export const createAnimationChunk = (animationName: string) => {
  return lazy(() => {
    console.log(`Loading animation chunk: ${animationName}`);
    return import(`../animations/${animationName}`);
  });
};

// Component-based code splitting
export const createComponentChunk = (componentName: string) => {
  return lazy(() => {
    console.log(`Loading component chunk: ${componentName}`);
    return import(`../components/${componentName}`);
  });
};

export default {
  preloadCriticalComponents,
  preloadAnimationComponents,
  preloadAllComponents,
  getBundleInfo,
  getLoadingStrategy,
  safeLazyImport,
  createRouteChunk,
  createAnimationChunk,
  createComponentChunk
};
