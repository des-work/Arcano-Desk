// Animation Types and Constants for Arcano Desk

export type AnimationType = 
  // Wizard Magic Animations
  | 'wizard-cast' | 'wizard-learn' | 'wizard-think' | 'wizard-excited' | 'wizard-sleep'
  | 'wizard-wiggle' | 'wizard-float' | 'wizard-glow' | 'wizard-sparkle'
  
  // Elemental Magic
  | 'fire' | 'lightning' | 'ice' | 'earth' | 'wind' | 'water' | 'shadow' | 'light'
  
  // Epic Animations
  | 'dragon-battle' | 'epic-summary' | 'massive-spell' | 'reality-bend'
  
  // Loading Animations
  | 'loading-sparkles' | 'loading-orb' | 'loading-wave' | 'loading-pulse'
  | 'loading-spiral' | 'loading-dots' | 'loading-bars' | 'loading-magic'
  
  // Interactive Animations
  | 'button-hover' | 'button-click' | 'card-flip' | 'card-glow' | 'input-focus'
  | 'file-upload' | 'file-process' | 'file-complete' | 'notification-pop'
  
  // Ambient Animations
  | 'floating-particles' | 'magic-dust' | 'energy-flow' | 'aura-pulse'
  | 'background-shimmer' | 'gradient-shift' | 'orb-float' | 'sparkle-rain'
  
  // Transition Animations
  | 'fade-in' | 'fade-out' | 'slide-in' | 'slide-out' | 'scale-in' | 'scale-out'
  | 'rotate-in' | 'rotate-out' | 'bounce-in' | 'bounce-out' | 'zoom-in' | 'zoom-out'
  
  // Special Effects
  | 'explosion' | 'implosion' | 'teleport' | 'transformation' | 'revelation'
  | 'enchantment' | 'disenchantment' | 'summoning' | 'banishment';

export type AnimationIntensity = 'subtle' | 'gentle' | 'moderate' | 'intense' | 'epic';

export type AnimationDuration = 'instant' | 'fast' | 'normal' | 'slow' | 'epic';

export type AnimationEasing = 
  | 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  | 'bounce' | 'elastic' | 'back' | 'circ' | 'cubic' | 'expo' | 'quad' | 'quart' | 'quint' | 'sine';

export interface AnimationConfig {
  type: AnimationType;
  intensity: AnimationIntensity;
  duration: AnimationDuration;
  easing: AnimationEasing;
  delay?: number;
  repeat?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  playState?: 'running' | 'paused';
}

export interface AnimationTrigger {
  id: string;
  config: AnimationConfig;
  conditions: AnimationCondition[];
  priority: number;
  cooldown?: number;
  lastTriggered?: number;
}

export interface AnimationCondition {
  type: 'user-action' | 'ai-operation' | 'loading-state' | 'data-change' | 'time-based' | 'random';
  value: any;
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'starts-with' | 'ends-with';
}

export interface AnimationState {
  activeAnimations: Map<string, AnimationConfig>;
  queuedAnimations: AnimationConfig[];
  globalIntensity: AnimationIntensity;
  isAnimationsEnabled: boolean;
  performanceMode: 'high' | 'medium' | 'low';
  lastPerformanceCheck: number;
}

// Animation Presets
export const ANIMATION_PRESETS: Record<string, AnimationConfig> = {
  // Wizard Animations
  'wizard-thinking': {
    type: 'wizard-think',
    intensity: 'gentle',
    duration: 'normal',
    easing: 'ease-in-out',
    repeat: 'infinite',
    direction: 'alternate'
  },
  
  'wizard-casting': {
    type: 'wizard-cast',
    intensity: 'intense',
    duration: 'normal',
    easing: 'ease-out',
    repeat: 1
  },
  
  'wizard-excited': {
    type: 'wizard-excited',
    intensity: 'moderate',
    duration: 'fast',
    easing: 'bounce',
    repeat: 3
  },
  
  // Loading Animations
  'loading-summary': {
    type: 'loading-magic',
    intensity: 'moderate',
    duration: 'normal',
    easing: 'ease-in-out',
    repeat: 'infinite'
  },
  
  'loading-study-material': {
    type: 'loading-sparkles',
    intensity: 'gentle',
    duration: 'normal',
    easing: 'ease-in-out',
    repeat: 'infinite'
  },
  
  'loading-question': {
    type: 'loading-orb',
    intensity: 'moderate',
    duration: 'normal',
    easing: 'ease-in-out',
    repeat: 'infinite'
  },
  
  // Epic Animations
  'epic-summary-creation': {
    type: 'dragon-battle',
    intensity: 'epic',
    duration: 'epic',
    easing: 'ease-out',
    repeat: 1
  },
  
  'massive-spell-cast': {
    type: 'massive-spell',
    intensity: 'epic',
    duration: 'slow',
    easing: 'ease-out',
    repeat: 1
  },
  
  // Interactive Animations
  'button-hover-magic': {
    type: 'button-hover',
    intensity: 'gentle',
    duration: 'fast',
    easing: 'ease-out',
    repeat: 1
  },
  
  'file-upload-magic': {
    type: 'file-upload',
    intensity: 'moderate',
    duration: 'normal',
    easing: 'ease-in-out',
    repeat: 1
  },
  
  'notification-success': {
    type: 'notification-pop',
    intensity: 'moderate',
    duration: 'fast',
    easing: 'bounce',
    repeat: 1
  },
  
  // Ambient Animations
  'ambient-magic': {
    type: 'floating-particles',
    intensity: 'subtle',
    duration: 'slow',
    easing: 'linear',
    repeat: 'infinite'
  },
  
  'background-enchantment': {
    type: 'background-shimmer',
    intensity: 'subtle',
    duration: 'slow',
    easing: 'ease-in-out',
    repeat: 'infinite',
    direction: 'alternate'
  }
};

// Animation Triggers
export const ANIMATION_TRIGGERS: AnimationTrigger[] = [
  {
    id: 'summary-generation-start',
    config: ANIMATION_PRESETS['loading-summary'],
    conditions: [
      { type: 'ai-operation', value: 'generateSummary', operator: 'equals' }
    ],
    priority: 8,
    cooldown: 1000
  },
  
  {
    id: 'epic-summary-trigger',
    config: ANIMATION_PRESETS['epic-summary-creation'],
    conditions: [
      { type: 'ai-operation', value: 'generateSummary', operator: 'equals' },
      { type: 'data-change', value: 'contentLength', operator: 'greater-than' },
      { type: 'random', value: 0.05, operator: 'less-than' } // 5% chance
    ],
    priority: 10,
    cooldown: 30000 // 30 seconds cooldown
  },
  
  {
    id: 'study-material-generation',
    config: ANIMATION_PRESETS['loading-study-material'],
    conditions: [
      { type: 'ai-operation', value: 'generateStudyMaterial', operator: 'equals' }
    ],
    priority: 7,
    cooldown: 1000
  },
  
  {
    id: 'question-answering',
    config: ANIMATION_PRESETS['loading-question'],
    conditions: [
      { type: 'ai-operation', value: 'askQuestion', operator: 'equals' }
    ],
    priority: 6,
    cooldown: 1000
  },
  
  {
    id: 'wizard-learning',
    config: ANIMATION_PRESETS['wizard-thinking'],
    conditions: [
      { type: 'ai-operation', value: 'any', operator: 'equals' }
    ],
    priority: 5,
    cooldown: 500
  },
  
  {
    id: 'file-upload-start',
    config: ANIMATION_PRESETS['file-upload-magic'],
    conditions: [
      { type: 'user-action', value: 'fileUpload', operator: 'equals' }
    ],
    priority: 7,
    cooldown: 2000
  },
  
  {
    id: 'button-hover-effect',
    config: ANIMATION_PRESETS['button-hover-magic'],
    conditions: [
      { type: 'user-action', value: 'buttonHover', operator: 'equals' }
    ],
    priority: 1,
    cooldown: 100
  },
  
  {
    id: 'success-notification',
    config: ANIMATION_PRESETS['notification-success'],
    conditions: [
      { type: 'ai-operation', value: 'success', operator: 'equals' }
    ],
    priority: 9,
    cooldown: 500
  }
];

// Performance-based animation configurations
export const PERFORMANCE_ANIMATIONS = {
  high: {
    maxConcurrentAnimations: 10,
    enableParticles: true,
    enableComplexEffects: true,
    enableEpicAnimations: true,
    frameRate: 60
  },
  medium: {
    maxConcurrentAnimations: 6,
    enableParticles: true,
    enableComplexEffects: true,
    enableEpicAnimations: false,
    frameRate: 30
  },
  low: {
    maxConcurrentAnimations: 3,
    enableParticles: false,
    enableComplexEffects: false,
    enableEpicAnimations: false,
    frameRate: 15
  }
};

// Animation utility functions
export const getAnimationDuration = (duration: AnimationDuration): number => {
  const durations = {
    instant: 0,
    fast: 200,
    normal: 500,
    slow: 1000,
    epic: 5000
  };
  return durations[duration];
};

export const getAnimationIntensity = (intensity: AnimationIntensity): number => {
  const intensities = {
    subtle: 0.3,
    gentle: 0.5,
    moderate: 0.7,
    intense: 0.9,
    epic: 1.0
  };
  return intensities[intensity];
};

export const shouldTriggerAnimation = (
  trigger: AnimationTrigger,
  context: any
): boolean => {
  // Check cooldown
  if (trigger.cooldown && trigger.lastTriggered) {
    const timeSinceLastTrigger = Date.now() - trigger.lastTriggered;
    if (timeSinceLastTrigger < trigger.cooldown) {
      return false;
    }
  }
  
  // Check conditions
  return trigger.conditions.every(condition => {
    switch (condition.type) {
      case 'user-action':
        return context.userAction === condition.value;
      case 'ai-operation':
        return context.aiOperation === condition.value;
      case 'loading-state':
        return context.isLoading === condition.value;
      case 'data-change':
        return context.dataChange?.[condition.value] !== undefined;
      case 'time-based':
        return Date.now() % condition.value === 0;
      case 'random':
        return Math.random() < condition.value;
      default:
        return false;
    }
  });
};
