/**
 * Session Mode Management
 * Tracks focus time and manages fade mode for long sessions
 */

import { create } from 'zustand';

interface SessionModeState {
  // Focus tracking
  focusStartTime: number | null;
  totalFocusTime: number;
  isFocused: boolean;
  
  // Fade mode
  fadeMode: boolean;
  fadeModeThreshold: number; // 12 minutes in milliseconds
  
  // Performance tracking
  particleCount: number;
  maxParticles: number;
  qualityLevel: number;
  
  // Actions
  startFocus: () => void;
  stopFocus: () => void;
  resetSession: () => void;
  enableFadeMode: () => void;
  disableFadeMode: () => void;
  updatePerformanceSettings: (settings: PerformanceSettings) => void;
}

interface PerformanceSettings {
  particleCount: number;
  maxParticles: number;
  qualityLevel: number;
}

/**
 * Session mode store for managing focus and performance
 */
export const useSessionMode = create<SessionModeState>((set, get) => ({
  focusStartTime: null,
  totalFocusTime: 0,
  isFocused: false,
  fadeMode: false,
  fadeModeThreshold: 12 * 60 * 1000, // 12 minutes
  particleCount: 150,
  maxParticles: 300,
  qualityLevel: 0.75,
  
  startFocus: () => {
    const state = get();
    if (state.isFocused) return;
    
    set({
      isFocused: true,
      focusStartTime: Date.now(),
    });
    
    // Start focus monitoring
    get().monitorFocusTime();
  },
  
  stopFocus: () => {
    const state = get();
    if (!state.isFocused || !state.focusStartTime) return;
    
    const sessionTime = Date.now() - state.focusStartTime;
    const newTotalTime = state.totalFocusTime + sessionTime;
    
    set({
      isFocused: false,
      focusStartTime: null,
      totalFocusTime: newTotalTime,
    });
    
    // Check if we should enable fade mode
    if (newTotalTime >= state.fadeModeThreshold && !state.fadeMode) {
      get().enableFadeMode();
    }
  },
  
  resetSession: () => {
    set({
      focusStartTime: null,
      totalFocusTime: 0,
      isFocused: false,
      fadeMode: false,
      particleCount: 150,
      maxParticles: 300,
      qualityLevel: 0.75,
    });
  },
  
  enableFadeMode: () => {
    const state = get();
    if (state.fadeMode) return;
    
    set({
      fadeMode: true,
      particleCount: Math.floor(state.particleCount * 0.7), // Reduce by 30%
      maxParticles: Math.floor(state.maxParticles * 0.7),
      qualityLevel: Math.max(0.5, state.qualityLevel * 0.7), // Reduce quality by 30%
    });
  },
  
  disableFadeMode: () => {
    const state = get();
    if (!state.fadeMode) return;
    
    set({
      fadeMode: false,
      particleCount: 150,
      maxParticles: 300,
      qualityLevel: 0.75,
    });
  },
  
  updatePerformanceSettings: (settings: PerformanceSettings) => {
    set({
      particleCount: settings.particleCount,
      maxParticles: settings.maxParticles,
      qualityLevel: settings.qualityLevel,
    });
  },
  
  // Internal method to monitor focus time
  monitorFocusTime: () => {
    const state = get();
    if (!state.isFocused || !state.focusStartTime) return;
    
    const currentSessionTime = Date.now() - state.focusStartTime;
    const totalTime = state.totalFocusTime + currentSessionTime;
    
    // Check if we should enable fade mode
    if (totalTime >= state.fadeModeThreshold && !state.fadeMode) {
      get().enableFadeMode();
    }
    
    // Continue monitoring if still focused
    if (state.isFocused) {
      setTimeout(() => get().monitorFocusTime(), 1000); // Check every second
    }
  },
}));

/**
 * Hook to get current session mode state
 */
export function useSessionModeState() {
  return useSessionMode();
}

/**
 * Hook to get fade mode status
 */
export function useFadeMode(): boolean {
  return useSessionMode(state => state.fadeMode);
}

/**
 * Hook to get performance settings
 */
export function usePerformanceSettings(): PerformanceSettings {
  const { particleCount, maxParticles, qualityLevel } = useSessionMode();
  return { particleCount, maxParticles, qualityLevel };
}

/**
 * Hook to get focus time information
 */
export function useFocusTime(): {
  isFocused: boolean;
  currentSessionTime: number;
  totalFocusTime: number;
  timeUntilFadeMode: number;
} {
  const { isFocused, focusStartTime, totalFocusTime, fadeModeThreshold } = useSessionMode();
  
  const currentSessionTime = isFocused && focusStartTime 
    ? Date.now() - focusStartTime 
    : 0;
  
  const timeUntilFadeMode = Math.max(0, fadeModeThreshold - (totalFocusTime + currentSessionTime));
  
  return {
    isFocused,
    currentSessionTime,
    totalFocusTime,
    timeUntilFadeMode,
  };
}

/**
 * Initialize session mode system
 * Call this once when the app starts
 */
export function initializeSessionMode(): void {
  const store = useSessionMode.getState();
  
  // Auto-start focus when app loads
  store.startFocus();
  
  // Handle page visibility changes
  const handleVisibilityChange = () => {
    if (document.hidden) {
      store.stopFocus();
    } else {
      store.startFocus();
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Handle page unload
  const handleBeforeUnload = () => {
    store.stopFocus();
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  // Clean up listeners
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}

/**
 * Get current focus status
 */
export function getFocusStatus(): {
  isFocused: boolean;
  sessionTime: number;
  totalTime: number;
  fadeMode: boolean;
} {
  const state = useSessionMode.getState();
  const sessionTime = state.isFocused && state.focusStartTime 
    ? Date.now() - state.focusStartTime 
    : 0;
  
  return {
    isFocused: state.isFocused,
    sessionTime,
    totalTime: state.totalFocusTime,
    fadeMode: state.fadeMode,
  };
}

/**
 * Force enable/disable fade mode (for testing)
 */
export function toggleFadeMode(): void {
  const store = useSessionMode.getState();
  if (store.fadeMode) {
    store.disableFadeMode();
  } else {
    store.enableFadeMode();
  }
}

/**
 * Reset session data
 */
export function resetSession(): void {
  const store = useSessionMode.getState();
  store.resetSession();
}
