/**
 * Time-based Theme Management
 * Handles theme transitions and session-based theming
 */

import { create } from 'zustand';
import { getCurrentTheme, ThemePalette, getSessionSeededPalette } from '../tokens/palette';

interface TimeThemeState {
  currentTheme: ThemePalette;
  sessionSeed: number;
  isTransitioning: boolean;
  transitionProgress: number;
  lastUpdateTime: number;
  
  // Actions
  updateTheme: () => void;
  setSessionSeed: (seed: number) => void;
  startTransition: () => void;
  completeTransition: () => void;
}

/**
 * Time theme store for managing dynamic theming
 */
export const useTimeTheme = create<TimeThemeState>((set, get) => ({
  currentTheme: getCurrentTheme(),
  sessionSeed: Math.floor(Math.random() * 1000000),
  isTransitioning: false,
  transitionProgress: 0,
  lastUpdateTime: Date.now(),
  
  updateTheme: () => {
    const state = get();
    const now = Date.now();
    const timeSinceLastUpdate = now - state.lastUpdateTime;
    
    // Only update if enough time has passed (avoid excessive updates)
    if (timeSinceLastUpdate < 1000) return;
    
    const newTheme = getCurrentTheme(state.sessionSeed);
    const currentTheme = state.currentTheme;
    
    // Check if theme has changed significantly
    const hasChanged = 
      Math.abs(newTheme.baseHue - currentTheme.baseHue) > 10 ||
      Math.abs(newTheme.accentHue - currentTheme.accentHue) > 10 ||
      newTheme.tint !== currentTheme.tint;
    
    if (hasChanged) {
      set({
        currentTheme: newTheme,
        lastUpdateTime: now,
        isTransitioning: true,
        transitionProgress: 0,
      });
      
      // Start smooth transition
      get().startTransition();
    } else {
      set({
        currentTheme: newTheme,
        lastUpdateTime: now,
      });
    }
  },
  
  setSessionSeed: (seed: number) => {
    set({ sessionSeed: seed });
    get().updateTheme();
  },
  
  startTransition: () => {
    const state = get();
    if (state.isTransitioning) return;
    
    set({ isTransitioning: true, transitionProgress: 0 });
    
    // Animate transition over 30 seconds
    const transitionDuration = 30000; // 30 seconds
    const startTime = Date.now();
    
    const animateTransition = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / transitionDuration, 1);
      
      set({ transitionProgress: progress });
      
      if (progress < 1) {
        requestAnimationFrame(animateTransition);
      } else {
        get().completeTransition();
      }
    };
    
    requestAnimationFrame(animateTransition);
  },
  
  completeTransition: () => {
    set({ isTransitioning: false, transitionProgress: 1 });
  },
}));

/**
 * Hook to get current theme with smooth transitions
 */
export function useCurrentTheme(): ThemePalette {
  const { currentTheme, isTransitioning, transitionProgress } = useTimeTheme();
  
  // Return current theme (transitions are handled by the store)
  return currentTheme;
}

/**
 * Hook to get theme with transition interpolation
 */
export function useInterpolatedTheme(): ThemePalette {
  const { currentTheme, isTransitioning, transitionProgress } = useTimeTheme();
  
  if (!isTransitioning) {
    return currentTheme;
  }
  
  // Interpolate between themes during transition
  // This would be used for smooth color transitions
  return currentTheme;
}

/**
 * Initialize time theme system
 * Call this once when the app starts
 */
export function initializeTimeTheme(): void {
  const store = useTimeTheme.getState();
  
  // Update theme immediately
  store.updateTheme();
  
  // Set up periodic theme updates (every 5 minutes)
  const updateInterval = setInterval(() => {
    store.updateTheme();
  }, 5 * 60 * 1000);
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(updateInterval);
  });
}

/**
 * Get theme for specific time of day (for testing/preview)
 */
export function getThemeForTime(hour: number): ThemePalette {
  const testDate = new Date();
  testDate.setHours(hour, 0, 0, 0);
  return getCurrentTheme();
}

/**
 * Force theme update (useful for testing)
 */
export function forceThemeUpdate(): void {
  const store = useTimeTheme.getState();
  store.updateTheme();
}

/**
 * Get theme transition status
 */
export function getThemeTransitionStatus(): {
  isTransitioning: boolean;
  progress: number;
} {
  const { isTransitioning, transitionProgress } = useTimeTheme.getState();
  return { isTransitioning, progress: transitionProgress };
}
