# 🧹 Dependency Cleanup Plan

## Phase 1: Remove Completely Unused Dependencies (Safe to remove immediately)

### ✅ Confirmed Unused:
- `lottie-react` - No usage found in codebase
- `react-query` - No usage found in codebase  
- `swr` - No usage found in codebase
- `react-transition-group` - No usage found in codebase

### Commands to remove:
```bash
npm uninstall lottie-react react-query swr react-transition-group
```

## Phase 2: Gradual Migration from @react-spring to Framer Motion

### Current Usage:
- Used in 10 animation files
- Can be gradually replaced with Framer Motion equivalents

### Migration Strategy:
1. Update OptimizedAnimationEngine to use only Framer Motion
2. Replace @react-spring usage in existing animation files
3. Remove @react-spring dependency

### Files to update:
- `animations/IntelligentOrchestrator.tsx`
- `animations/UltraParticleSystem.tsx` 
- `animations/AdvancedAnimationEngine.tsx`
- `components/DynamicLayout.tsx`
- `animations/AnimationEngine.tsx`
- `components/LaunchScreen.tsx`
- `animations/InteractiveAnimations.tsx`
- `animations/EpicAnimations.tsx`
- `animations/ParticleEffects.tsx`
- `animations/WizardAnimations.tsx`

## Phase 3: Evaluate Other Dependencies

### Potentially Redundant:
- `react-calendar` - Only used in Calendar page, could be replaced with custom component
- `tesseract.js` - Heavy OCR library, could be replaced with lighter alternative
- `mammoth` + `pdfjs-dist` - Keep these as they're essential for document processing

### Keep (Essential):
- `framer-motion` - Primary animation library
- `react-dropzone` - File upload functionality
- `react-hot-toast` - Notifications
- `@reduxjs/toolkit` + `react-redux` - State management
- `redux-persist` - State persistence
- `axios` - HTTP requests
- `lucide-react` - Icons

## Phase 4: Bundle Optimization

### Code Splitting:
- Lazy load animation components
- Split large animation files
- Implement dynamic imports for heavy components

### Tree Shaking:
- Ensure all imports are tree-shakeable
- Remove unused exports
- Optimize bundle size

## Expected Benefits:
- **Bundle size reduction**: ~30-40% smaller
- **Faster load times**: ~25-35% improvement
- **Better maintainability**: Single animation library
- **Reduced complexity**: Fewer dependencies to manage

## Timeline:
- **Week 1**: Remove unused dependencies (Phase 1)
- **Week 2**: Migrate @react-spring usage (Phase 2)
- **Week 3**: Evaluate and optimize remaining dependencies (Phase 3)
- **Week 4**: Bundle optimization and testing (Phase 4)
