// Animation System Exports
export { AnimationProvider, useAnimations, AnimatedComponent, EpicAnimation } from './AnimationEngine';
export { WizardAnimations, LoadingAnimation } from './WizardAnimations';
export { 
  ParticleSystem, 
  MagicalDust, 
  SparkleRain, 
  FireAndLightning, 
  EnergyFlow, 
  IceCrystals 
} from './ParticleEffects';
export { 
  InteractiveButton, 
  InteractiveCard, 
  InteractiveInput 
} from './InteractiveAnimations';
export { EpicAnimation as EpicAnimationComponent } from './EpicAnimations';

// Types and Constants
export type {
  AnimationType,
  AnimationConfig,
  AnimationTrigger,
  AnimationState,
  AnimationIntensity,
  AnimationDuration,
  AnimationEasing,
  AnimationCondition
} from './AnimationTypes';

export {
  ANIMATION_PRESETS,
  ANIMATION_TRIGGERS,
  PERFORMANCE_ANIMATIONS,
  getAnimationDuration,
  getAnimationIntensity,
  shouldTriggerAnimation
} from './AnimationTypes';

// Animation Hooks
export { useAnimations } from './AnimationEngine';

// Utility Functions
export const createAnimationTrigger = (
  id: string,
  type: string,
  conditions: any[],
  priority: number = 5
) => ({
  id,
  config: { type, intensity: 'moderate', duration: 'normal', easing: 'ease-in-out' },
  conditions,
  priority
});

export const triggerContextAnimation = (context: any) => {
  if (typeof window !== 'undefined' && (window as any).triggerAnimationContext) {
    (window as any).triggerAnimationContext(context);
  }
};

// Animation Presets for Common Use Cases
export const COMMON_ANIMATIONS = {
  // Loading States
  loading: {
    summary: 'loading-magic',
    studyMaterial: 'loading-sparkles',
    question: 'loading-orb',
    topic: 'loading-wave'
  },
  
  // User Interactions
  interaction: {
    buttonHover: 'button-hover',
    buttonClick: 'button-click',
    cardHover: 'card-glow',
    inputFocus: 'input-focus',
    fileUpload: 'file-upload'
  },
  
  // Wizard States
  wizard: {
    thinking: 'wizard-think',
    learning: 'wizard-learn',
    excited: 'wizard-excited',
    casting: 'wizard-cast',
    sleeping: 'wizard-sleep'
  },
  
  // Epic Moments
  epic: {
    dragonBattle: 'dragon-battle',
    epicSummary: 'epic-summary',
    massiveSpell: 'massive-spell',
    realityBend: 'reality-bend'
  },
  
  // Ambient Effects
  ambient: {
    sparkles: 'sparkle-rain',
    magicDust: 'floating-particles',
    energyFlow: 'energy-flow',
    backgroundShimmer: 'background-shimmer'
  }
};

// Performance Optimization
export const optimizeAnimations = () => {
  // Reduce animation intensity based on performance
  const performance = navigator.performance;
  if (performance && performance.memory) {
    const memoryUsage = (performance as any).memory.usedJSHeapSize;
    const memoryLimit = (performance as any).memory.jsHeapSizeLimit;
    
    if (memoryUsage / memoryLimit > 0.8) {
      return 'low';
    } else if (memoryUsage / memoryLimit > 0.6) {
      return 'medium';
    }
  }
  
  return 'high';
};

// Animation Context Provider
export const AnimationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AnimationProvider>
      {children}
    </AnimationProvider>
  );
};

export default AnimationContextProvider;
