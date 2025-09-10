import React, { Suspense, lazy, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyComponentProps {
  fallback?: React.ReactNode;
  [key: string]: any;
}

// Loading fallback component
const DefaultFallback: React.FC = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Loader2 className="w-6 h-6 text-white animate-spin" />
      </div>
      <p className="text-purple-200/80 font-arcane text-sm">
        🧙‍♂️ Casting spell...
      </p>
    </div>
  </div>
);

// Higher-order component for lazy loading
export const withLazyLoading = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = lazy(importFunc);
  
  return React.forwardRef<any, P & LazyComponentProps>((props, ref) => (
    <Suspense fallback={fallback || <DefaultFallback />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Lazy-loaded components
export const LazyDashboard = withLazyLoading(
  () => import('../pages/Dashboard'),
  <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <h2 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
        🏰 Loading Wizard Tower...
      </h2>
      <p className="text-purple-200/80 font-arcane">
        Preparing your magical dashboard
      </p>
    </div>
  </div>
);

export const LazyLibrary = withLazyLoading(
  () => import('../pages/Library'),
  <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <h2 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-2">
        📚 Opening Arcane Library...
      </h2>
      <p className="text-blue-200/80 font-arcane">
        Gathering your study materials
      </p>
    </div>
  </div>
);

export const LazyStudyAssistant = withLazyLoading(
  () => import('../pages/StudyAssistant'),
  <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <h2 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
        🧙‍♂️ Awakening the Oracle...
      </h2>
      <p className="text-purple-200/80 font-arcane">
        The wizard is preparing to answer your questions
      </p>
    </div>
  </div>
);

export const LazyCalendar = withLazyLoading(
  () => import('../pages/Calendar'),
  <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <h2 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 mb-2">
        📅 Opening Quest Log...
      </h2>
      <p className="text-green-200/80 font-arcane">
        Loading your assignment tracker
      </p>
    </div>
  </div>
);

export const LazySettings = withLazyLoading(
  () => import('../pages/Settings'),
  <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
      <h2 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 mb-2">
        ⚙️ Accessing Enchanted Forge...
      </h2>
      <p className="text-amber-200/80 font-arcane">
        Preparing your settings panel
      </p>
    </div>
  </div>
);

// Modal components
export const LazyModelSelector = withLazyLoading(
  () => import('./ModelSelector')
);

export const LazyTopicGenerator = withLazyLoading(
  () => import('./TopicGenerator')
);

export const LazyFileUpload = withLazyLoading(
  () => import('./FileUpload')
);

// Utility function to create lazy components with custom fallbacks
export const createLazyComponent = <P extends object>(
  importFunc: () => Promise<{ default: ComponentType<P> }>,
  fallback?: React.ReactNode
) => {
  return withLazyLoading(importFunc, fallback);
};

// Preload function for better performance
export const preloadComponent = (importFunc: () => Promise<any>) => {
  return () => {
    importFunc();
  };
};

// Preload all main components
export const preloadAllComponents = () => {
  const preloaders = [
    () => import('../pages/Dashboard'),
    () => import('../pages/Library'),
    () => import('../pages/StudyAssistant'),
    () => import('../pages/Calendar'),
    () => import('../pages/Settings'),
    () => import('./ModelSelector'),
    () => import('./TopicGenerator'),
    () => import('./FileUpload'),
  ];

  preloaders.forEach(preloader => {
    // Preload after a short delay to not block initial render
    setTimeout(preloader, 100);
  });
};
