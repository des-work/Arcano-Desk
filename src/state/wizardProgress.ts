/**
 * Wizard Progress System
 * Tracks wizard advancement and unlocks visual effects based on content processing
 */

import { create } from 'zustand';

export interface WizardTier {
  level: number;
  name: string;
  description: string;
  requiredWords: number;
  requiredPages: number;
  requiredDiversity: number;
  unlockedMagic: MagicType[];
  visualEffects: VisualEffect[];
}

export interface MagicType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
}

export interface VisualEffect {
  id: string;
  name: string;
  description: string;
  tier: number;
  enabled: boolean;
}

export interface WizardProgress {
  // Progress tracking
  totalWordsProcessed: number;
  totalPagesProcessed: number;
  contentDiversity: number;
  currentTier: number;
  experience: number;
  
  // Magic types
  unlockedMagic: MagicType[];
  activeMagic: MagicType[];
  
  // Visual effects
  unlockedEffects: VisualEffect[];
  activeEffects: VisualEffect[];
  
  // Actions
  processContent: (words: number, pages: number, diversity: number) => void;
  unlockMagic: (magicId: string) => void;
  activateMagic: (magicId: string) => void;
  deactivateMagic: (magicId: string) => void;
  unlockEffect: (effectId: string) => void;
  activateEffect: (effectId: string) => void;
  deactivateEffect: (effectId: string) => void;
  resetProgress: () => void;
}

// Define wizard tiers
const WIZARD_TIERS: WizardTier[] = [
  {
    level: 1,
    name: "Apprentice",
    description: "Just beginning the magical journey",
    requiredWords: 0,
    requiredPages: 0,
    requiredDiversity: 0,
    unlockedMagic: [],
    visualEffects: [],
  },
  {
    level: 2,
    name: "Novice",
    description: "Learning the basics of document magic",
    requiredWords: 1000,
    requiredPages: 5,
    requiredDiversity: 0.3,
    unlockedMagic: ["weather", "light"],
    visualEffects: ["basic_glow", "particle_trail"],
  },
  {
    level: 3,
    name: "Scholar",
    description: "Mastering the art of knowledge transformation",
    requiredWords: 5000,
    requiredPages: 20,
    requiredDiversity: 0.5,
    unlockedMagic: ["weather", "light", "space"],
    visualEffects: ["basic_glow", "particle_trail", "ribbon_harmonics"],
  },
  {
    level: 4,
    name: "Mage",
    description: "Commanding powerful magical forces",
    requiredWords: 15000,
    requiredPages: 50,
    requiredDiversity: 0.7,
    unlockedMagic: ["weather", "light", "space", "teleportation"],
    visualEffects: ["basic_glow", "particle_trail", "ribbon_harmonics", "spectral_lens"],
  },
  {
    level: 5,
    name: "Archmage",
    description: "Master of all magical arts",
    requiredWords: 30000,
    requiredPages: 100,
    requiredDiversity: 0.8,
    unlockedMagic: ["weather", "light", "space", "teleportation", "ghost"],
    visualEffects: ["basic_glow", "particle_trail", "ribbon_harmonics", "spectral_lens", "starfield_parallax"],
  },
  {
    level: 6,
    name: "Grand Wizard",
    description: "Legendary master of cosmic magic",
    requiredWords: 50000,
    requiredPages: 200,
    requiredDiversity: 0.9,
    unlockedMagic: ["weather", "light", "space", "teleportation", "ghost", "cosmic"],
    visualEffects: ["basic_glow", "particle_trail", "ribbon_harmonics", "spectral_lens", "starfield_parallax", "cosmic_storm"],
  },
];

// Define magic types
const MAGIC_TYPES: MagicType[] = [
  {
    id: "weather",
    name: "Weather Magic",
    description: "Control atmospheric effects - rain, snow, lightning",
    icon: "🌩️",
    color: "#00BFFF",
    unlocked: false,
  },
  {
    id: "light",
    name: "Light Magic",
    description: "Manipulate illumination and glowing effects",
    icon: "✨",
    color: "#FFD700",
    unlocked: false,
  },
  {
    id: "space",
    name: "Space Magic",
    description: "Bend space and create dimensional effects",
    icon: "🌌",
    color: "#9370DB",
    unlocked: false,
  },
  {
    id: "teleportation",
    name: "Teleportation Magic",
    description: "Instant movement and portal creation",
    icon: "🌀",
    color: "#FF69B4",
    unlocked: false,
  },
  {
    id: "ghost",
    name: "Ghost Magic",
    description: "Communicate with ethereal forces",
    icon: "👻",
    color: "#E6E6FA",
    unlocked: false,
  },
  {
    id: "cosmic",
    name: "Cosmic Magic",
    description: "Harness the power of the universe",
    icon: "🌠",
    color: "#FF1493",
    unlocked: false,
  },
];

// Define visual effects
const VISUAL_EFFECTS: VisualEffect[] = [
  {
    id: "basic_glow",
    name: "Basic Glow",
    description: "Simple magical aura around the wizard",
    tier: 2,
    enabled: false,
  },
  {
    id: "particle_trail",
    name: "Particle Trail",
    description: "Magical particles follow the wizard's movements",
    tier: 2,
    enabled: false,
  },
  {
    id: "ribbon_harmonics",
    name: "Ribbon Harmonics",
    description: "Secondary harmonic effects in progress ribbons",
    tier: 3,
    enabled: false,
  },
  {
    id: "spectral_lens",
    name: "Spectral Lens",
    description: "Micro-detail lens flare effects",
    tier: 4,
    enabled: false,
  },
  {
    id: "starfield_parallax",
    name: "Starfield Parallax",
    description: "Subtle starfield depth effects",
    tier: 5,
    enabled: false,
  },
  {
    id: "cosmic_storm",
    name: "Cosmic Storm",
    description: "Epic cosmic storm effects",
    tier: 6,
    enabled: false,
  },
];

/**
 * Wizard progress store
 */
export const useWizardProgress = create<WizardProgress>((set, get) => ({
  totalWordsProcessed: 0,
  totalPagesProcessed: 0,
  contentDiversity: 0,
  currentTier: 1,
  experience: 0,
  unlockedMagic: [],
  activeMagic: [],
  unlockedEffects: [],
  activeEffects: [],
  
  processContent: (words: number, pages: number, diversity: number) => {
    const state = get();
    const newWords = state.totalWordsProcessed + words;
    const newPages = state.totalPagesProcessed + pages;
    const newDiversity = Math.max(state.contentDiversity, diversity);
    
    // Calculate new tier
    let newTier = state.currentTier;
    for (let i = WIZARD_TIERS.length - 1; i >= 0; i--) {
      const tier = WIZARD_TIERS[i];
      if (newWords >= tier.requiredWords && 
          newPages >= tier.requiredPages && 
          newDiversity >= tier.requiredDiversity) {
        newTier = tier.level;
        break;
      }
    }
    
    // Calculate experience
    const experienceGain = words * 0.1 + pages * 10 + diversity * 100;
    const newExperience = state.experience + experienceGain;
    
    set({
      totalWordsProcessed: newWords,
      totalPagesProcessed: newPages,
      contentDiversity: newDiversity,
      currentTier: newTier,
      experience: newExperience,
    });
    
    // Unlock new magic and effects
    get().unlockNewContent(newTier);
  },
  
  unlockMagic: (magicId: string) => {
    const state = get();
    const magic = MAGIC_TYPES.find(m => m.id === magicId);
    if (!magic || state.unlockedMagic.some(m => m.id === magicId)) return;
    
    const unlockedMagic = [...state.unlockedMagic, { ...magic, unlocked: true }];
    set({ unlockedMagic });
  },
  
  activateMagic: (magicId: string) => {
    const state = get();
    const magic = state.unlockedMagic.find(m => m.id === magicId);
    if (!magic || state.activeMagic.some(m => m.id === magicId)) return;
    
    const activeMagic = [...state.activeMagic, magic];
    set({ activeMagic });
  },
  
  deactivateMagic: (magicId: string) => {
    const state = get();
    const activeMagic = state.activeMagic.filter(m => m.id !== magicId);
    set({ activeMagic });
  },
  
  unlockEffect: (effectId: string) => {
    const state = get();
    const effect = VISUAL_EFFECTS.find(e => e.id === effectId);
    if (!effect || state.unlockedEffects.some(e => e.id === effectId)) return;
    
    const unlockedEffects = [...state.unlockedEffects, { ...effect, enabled: false }];
    set({ unlockedEffects });
  },
  
  activateEffect: (effectId: string) => {
    const state = get();
    const effect = state.unlockedEffects.find(e => e.id === effectId);
    if (!effect || state.activeEffects.some(e => e.id === effectId)) return;
    
    const activeEffects = [...state.activeEffects, { ...effect, enabled: true }];
    set({ activeEffects });
  },
  
  deactivateEffect: (effectId: string) => {
    const state = get();
    const activeEffects = state.activeEffects.filter(e => e.id !== effectId);
    set({ activeEffects });
  },
  
  resetProgress: () => {
    set({
      totalWordsProcessed: 0,
      totalPagesProcessed: 0,
      contentDiversity: 0,
      currentTier: 1,
      experience: 0,
      unlockedMagic: [],
      activeMagic: [],
      unlockedEffects: [],
      activeEffects: [],
    });
  },
  
  // Internal method to unlock new content based on tier
  unlockNewContent: (tier: number) => {
    const state = get();
    const tierData = WIZARD_TIERS.find(t => t.level === tier);
    if (!tierData) return;
    
    // Unlock magic types
    tierData.unlockedMagic.forEach(magicId => {
      get().unlockMagic(magicId);
    });
    
    // Unlock visual effects
    tierData.visualEffects.forEach(effectId => {
      get().unlockEffect(effectId);
    });
  },
}));

/**
 * Hook to get current wizard tier
 */
export function useWizardTier(): WizardTier {
  const { currentTier } = useWizardProgress();
  return WIZARD_TIERS.find(t => t.level === currentTier) || WIZARD_TIERS[0];
}

/**
 * Hook to get unlocked magic types
 */
export function useUnlockedMagic(): MagicType[] {
  return useWizardProgress(state => state.unlockedMagic);
}

/**
 * Hook to get active magic types
 */
export function useActiveMagic(): MagicType[] {
  return useWizardProgress(state => state.activeMagic);
}

/**
 * Hook to get unlocked visual effects
 */
export function useUnlockedEffects(): VisualEffect[] {
  return useWizardProgress(state => state.unlockedEffects);
}

/**
 * Hook to get active visual effects
 */
export function useActiveEffects(): VisualEffect[] {
  return useWizardProgress(state => state.activeEffects);
}

/**
 * Get wizard progress summary
 */
export function getWizardProgressSummary(): {
  tier: WizardTier;
  progress: {
    words: number;
    pages: number;
    diversity: number;
    experience: number;
  };
  nextTier: WizardTier | null;
  progressToNext: number;
} {
  const state = useWizardProgress.getState();
  const currentTier = WIZARD_TIERS.find(t => t.level === state.currentTier) || WIZARD_TIERS[0];
  const nextTier = WIZARD_TIERS.find(t => t.level === state.currentTier + 1) || null;
  
  let progressToNext = 0;
  if (nextTier) {
    const wordsProgress = state.totalWordsProcessed / nextTier.requiredWords;
    const pagesProgress = state.totalPagesProcessed / nextTier.requiredPages;
    const diversityProgress = state.contentDiversity / nextTier.requiredDiversity;
    progressToNext = Math.min(1, (wordsProgress + pagesProgress + diversityProgress) / 3);
  }
  
  return {
    tier: currentTier,
    progress: {
      words: state.totalWordsProcessed,
      pages: state.totalPagesProcessed,
      diversity: state.contentDiversity,
      experience: state.experience,
    },
    nextTier,
    progressToNext,
  };
}

/**
 * Initialize wizard progress system
 */
export function initializeWizardProgress(): void {
  const store = useWizardProgress.getState();
  
  // Load saved progress from localStorage
  const savedProgress = localStorage.getItem('wizardProgress');
  if (savedProgress) {
    try {
      const parsed = JSON.parse(savedProgress);
      store.processContent(parsed.words || 0, parsed.pages || 0, parsed.diversity || 0);
    } catch (error) {
      console.warn('Failed to load wizard progress:', error);
    }
  }
  
  // Save progress periodically
  setInterval(() => {
    const state = store;
    localStorage.setItem('wizardProgress', JSON.stringify({
      words: state.totalWordsProcessed,
      pages: state.totalPagesProcessed,
      diversity: state.contentDiversity,
      experience: state.experience,
    }));
  }, 30000); // Save every 30 seconds
}
