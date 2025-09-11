/**
 * Palette Design Tokens
 * Dynamic color theming based on time of day and session context
 */

export interface ThemePalette {
  baseHue: number;        // Primary color hue (0-360)
  accentHue: number;      // Secondary color hue (0-360)
  tint: string;           // Overall color tint
  bloomThreshold: number; // Post-processing bloom threshold
  fog: {
    density: number;      // Atmospheric fog density
    color: string;        // Fog color
  };
  particles: {
    primary: string;      // Main particle color
    secondary: string;    // Accent particle color
    glow: string;         // Glow effect color
  };
  background: {
    primary: string;      // Main background color
    secondary: string;    // Secondary background color
    gradient: string[];   // Background gradient stops
  };
}

/**
 * Generate theme palette based on time of day
 * @param now - Current date/time
 * @returns Theme palette configuration
 */
export function themeForTimeOfDay(now: Date): ThemePalette {
  const hour = now.getHours();
  
  // Morning: 6-11 AM - Warm oranges and pinks
  if (hour >= 6 && hour < 12) {
    return {
      baseHue: 30,        // Orange
      accentHue: 330,      // Pink
      tint: '#FFE4B5',    // Warm cream
      bloomThreshold: 0.8,
      fog: {
        density: 0.3,
        color: '#FFB6C1', // Light pink fog
      },
      particles: {
        primary: '#FF8C00', // Dark orange
        secondary: '#FF69B4', // Hot pink
        glow: '#FFD700',   // Gold glow
      },
      background: {
        primary: '#1A0A2E',
        secondary: '#2D1B4E',
        gradient: ['#FFE4B5', '#FFB6C1', '#FF69B4', '#8B008B'],
      },
    };
  }
  
  // Day: 12-17 PM - Bright and energetic
  if (hour >= 12 && hour < 18) {
    return {
      baseHue: 200,       // Blue
      accentHue: 60,       // Yellow
      tint: '#E6F3FF',    // Light blue
      bloomThreshold: 0.9,
      fog: {
        density: 0.2,
        color: '#87CEEB', // Sky blue fog
      },
      particles: {
        primary: '#00BFFF', // Deep sky blue
        secondary: '#FFD700', // Gold
        glow: '#FFFFFF',   // White glow
      },
      background: {
        primary: '#1A0A2E',
        secondary: '#2D1B4E',
        gradient: ['#E6F3FF', '#87CEEB', '#00BFFF', '#4169E1'],
      },
    };
  }
  
  // Evening: 18-21 PM - Amber and light pink
  if (hour >= 18 && hour < 22) {
    return {
      baseHue: 45,         // Amber
      accentHue: 320,      // Light pink
      tint: '#FFF8DC',     // Cornsilk
      bloomThreshold: 0.85,
      fog: {
        density: 0.4,
        color: '#DDA0DD', // Plum fog
      },
      particles: {
        primary: '#FF8C00', // Dark orange
        secondary: '#FFB6C1', // Light pink
        glow: '#FFD700',   // Gold glow
      },
      background: {
        primary: '#1A0A2E',
        secondary: '#2D1B4E',
        gradient: ['#FFF8DC', '#DDA0DD', '#FFB6C1', '#DA70D6'],
      },
    };
  }
  
  // Night: 22-5 AM - Dark purples and deep colors
  if (hour >= 22 || hour < 6) {
    return {
      baseHue: 270,        // Purple
      accentHue: 300,      // Magenta
      tint: '#2F1B4E',     // Dark purple
      bloomThreshold: 0.7,
      fog: {
        density: 0.6,
        color: '#4B0082', // Indigo fog
      },
      particles: {
        primary: '#8B008B', // Dark magenta
        secondary: '#9370DB', // Medium purple
        glow: '#FF69B4',   // Hot pink glow
      },
      background: {
        primary: '#1A0A2E',
        secondary: '#2D1B4E',
        gradient: ['#2F1B4E', '#4B0082', '#8B008B', '#FF69B4'],
      },
    };
  }
  
  // Fallback to night theme
  return themeForTimeOfDay(new Date(2024, 0, 1, 23, 0, 0));
}

/**
 * Generate session-seeded palette for minor variance within the same time block
 * @param seed - Random seed for consistent variation
 * @param baseTheme - Base theme to vary from
 * @returns Varied theme palette
 */
export function getSessionSeededPalette(seed: number, baseTheme: ThemePalette): ThemePalette {
  const variation = (seed % 100) / 100; // 0-1 variation factor
  
  return {
    ...baseTheme,
    baseHue: (baseTheme.baseHue + (variation - 0.5) * 20) % 360,
    accentHue: (baseTheme.accentHue + (variation - 0.5) * 15) % 360,
    bloomThreshold: Math.max(0.5, Math.min(1.0, baseTheme.bloomThreshold + (variation - 0.5) * 0.2)),
    fog: {
      ...baseTheme.fog,
      density: Math.max(0.1, Math.min(0.8, baseTheme.fog.density + (variation - 0.5) * 0.2)),
    },
  };
}

/**
 * Get current theme palette with session variation
 * @param sessionSeed - Optional session seed for consistency
 * @returns Current theme palette
 */
export function getCurrentTheme(sessionSeed?: number): ThemePalette {
  const now = new Date();
  const baseTheme = themeForTimeOfDay(now);
  
  if (sessionSeed !== undefined) {
    return getSessionSeededPalette(sessionSeed, baseTheme);
  }
  
  return baseTheme;
}

/**
 * Predefined theme variants for special occasions
 */
export const specialThemes = {
  // Magical storm theme
  storm: {
    baseHue: 240,
    accentHue: 120,
    tint: '#E0E0E0',
    bloomThreshold: 0.95,
    fog: {
      density: 0.8,
      color: '#B0C4DE',
    },
    particles: {
      primary: '#00FFFF',
      secondary: '#00FF00',
      glow: '#FFFFFF',
    },
    background: {
      primary: '#0A0A0A',
      secondary: '#1A1A2E',
      gradient: ['#E0E0E0', '#B0C4DE', '#00FFFF', '#0000FF'],
    },
  } as ThemePalette,
  
  // Cosmic theme
  cosmic: {
    baseHue: 280,
    accentHue: 200,
    tint: '#F0F8FF',
    bloomThreshold: 0.9,
    fog: {
      density: 0.5,
      color: '#9370DB',
    },
    particles: {
      primary: '#FF69B4',
      secondary: '#00BFFF',
      glow: '#FFD700',
    },
    background: {
      primary: '#0A0A0A',
      secondary: '#1A0A2E',
      gradient: ['#F0F8FF', '#9370DB', '#FF69B4', '#8B008B'],
    },
  } as ThemePalette,
};
