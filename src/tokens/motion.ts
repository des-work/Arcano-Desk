/**
 * Motion Design Tokens
 * Centralized timing, easing, and camera configuration for consistent animations
 */

// Duration tokens for consistent timing across the app
export const durations = {
  XS: 160,    // Quick micro-interactions
  S: 260,     // Fast transitions
  M: 420,     // Standard animations
  L: 700,     // Longer sequences
  XL: 1100,   // Extended cutscenes
} as const;

// Easing functions for natural motion
export const easings = {
  // Anticipate: Slight overshoot for playful feel
  anticipate: "cubic-bezier(.2,.9,.1,1)",
  
  // Standard: Smooth, professional motion
  standard: "cubic-bezier(.2,.7,0,1)",
  
  // Snap: Quick, responsive feel
  snap: "cubic-bezier(.1,.9,.2,1)",
} as const;

// Camera movement configuration
export const camera = {
  // Maximum tilt angle in degrees for gentle camera movements
  maxTiltDeg: 12,
  
  // Dolly range for zoom effects (0.5 = zoomed out, 1.0 = normal)
  dollyRange: [0.5, 1.0] as [number, number],
  
  // Rail movement duration range in seconds
  railsDur: [1.2, 2.4] as [number, number],
} as const;

// Animation quality presets
export const qualityPresets = {
  low: {
    particleCount: 50,
    maxParticles: 100,
    quality: 0.5,
  },
  medium: {
    particleCount: 150,
    maxParticles: 300,
    quality: 0.75,
  },
  high: {
    particleCount: 300,
    maxParticles: 500,
    quality: 1.0,
  },
} as const;

// Performance thresholds
export const performanceThresholds = {
  targetFPS: 60,
  minFPS: 30,
  adaptiveQuality: true,
} as const;
