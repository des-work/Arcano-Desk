# 🧙‍♂️ Arcano Desk - Source Code Documentation

## 📁 Project Structure

```
src/
├── animations/           # Animation system components
│   ├── OptimizedAnimationEngine.tsx    # Main animation engine (NEW)
│   ├── OptimizedParticleSystem.tsx     # Performance-optimized particles (NEW)
│   ├── AnimationEngine.tsx             # Legacy animation engine
│   ├── AdvancedAnimationEngine.tsx     # Advanced animation features
│   ├── EpicAnimations.tsx              # Epic animation effects
│   ├── IntelligentOrchestrator.tsx     # Smart animation orchestration
│   ├── ParticleEffects.tsx             # Particle effect components
│   ├── WizardAnimations.tsx            # Wizard-specific animations
│   ├── InteractiveAnimations.tsx       # Interactive animation components
│   ├── UltraParticleSystem.tsx         # Ultra particle system
│   ├── AnimationTypes.ts               # Animation type definitions
│   └── index.ts                        # Animation exports
├── components/          # React components
│   ├── AppRouter.tsx                   # Main app routing (NEW)
│   ├── EnhancedWizard.tsx              # Enhanced wizard component (NEW)
│   ├── AnimatedWizard.tsx              # Animated wizard component
│   ├── DynamicLayout.tsx               # Dynamic layout component
│   ├── ErrorBoundary.tsx               # Error boundary component
│   ├── FileUpload.tsx                  # File upload component
│   ├── Header.tsx                      # Header component
│   ├── LaunchScreen.tsx                # Launch screen component
│   ├── LazyComponent.tsx               # Lazy loading component
│   ├── LibraryPhase.tsx                # Library phase component
│   ├── MagicalEffects.tsx              # Magical effects component
│   ├── ModelSelector.tsx               # Model selector component
│   ├── ReduxProvider.tsx               # Redux provider component
│   ├── SummaryPhase.tsx                # Summary phase component
│   ├── TopicGenerator.tsx              # Topic generator component
│   ├── UploadPhase.tsx                 # Upload phase component
│   └── Wizard.tsx                      # Original wizard component
├── contexts/            # React contexts
│   ├── FileContext.tsx                 # File management context
│   └── OllamaContext.tsx               # Ollama integration context
├── hooks/               # Custom React hooks
│   ├── useFiles.ts                     # File management hook
│   ├── useMemoization.ts               # Memoization utilities
│   ├── useOllama.ts                    # Ollama integration hook
│   ├── usePerformance.ts               # Performance monitoring hook
│   ├── useRedux.ts                     # Redux utilities hook
│   ├── useUI.ts                        # UI state management hook
│   ├── useWebSocket.ts                 # WebSocket hook
│   └── useWizard.ts                    # Wizard state management hook
├── pages/               # Page components
│   ├── Calendar.tsx                    # Calendar page
│   ├── Dashboard.tsx                   # Dashboard page
│   ├── Library.tsx                     # Library page
│   ├── Settings.tsx                    # Settings page
│   └── StudyAssistant.tsx              # Study assistant page
├── services/            # Service layer
│   ├── fileService.ts                  # File processing service
│   └── ollamaService.ts                # Ollama API service
├── store/               # Redux store
│   ├── index.ts                        # Store configuration
│   └── slices/                         # Redux slices
│       ├── filesSlice.ts               # File state slice
│       ├── ollamaSlice.ts              # Ollama state slice
│       ├── settingsSlice.ts            # Settings state slice
│       ├── uiSlice.ts                  # UI state slice
│       └── wizardSlice.ts              # Wizard state slice
├── types/               # TypeScript type definitions
│   └── index.ts                        # Main type definitions
├── utils/               # Utility functions
│   ├── contentAnalyzer.ts              # Content analysis utilities
│   ├── fileProcessor.ts                # File processing utilities
│   └── topicGenerator.ts               # Topic generation utilities
├── App.tsx              # Main app component
├── index.tsx            # App entry point
├── index.css            # Global styles
└── react-app-env.d.ts   # React app environment types
```

## 🎯 Key Components

### Animation System
- **OptimizedAnimationEngine**: New performance-optimized animation system
- **OptimizedParticleSystem**: Efficient particle effects with adaptive performance
- **Legacy Animation Files**: Original animation system (to be gradually migrated)

### Routing System
- **AppRouter**: New React Router-based navigation system
- **ProtectedRoute**: Route protection with file requirements
- **Phase Migration**: Converting phase-based navigation to proper routing

### Wizard System
- **EnhancedWizard**: Improved wizard with better integration and performance
- **Wizard State Management**: Comprehensive wizard state tracking
- **Interactive Features**: Spell casting, mood tracking, navigation

### File Management
- **FileContext**: Centralized file state management
- **File Processing**: Multi-format document processing (PDF, Word, PowerPoint, Text)
- **Content Analysis**: Intelligent content analysis for model selection

### AI Integration
- **OllamaContext**: Ollama API integration
- **Model Selection**: Automatic model selection based on content complexity
- **Content Generation**: Summaries, study materials, Q&A

## 🔧 Architecture Patterns

### State Management
- **Redux Toolkit**: Global state management
- **React Context**: Component-level state sharing
- **Local State**: Component-specific state with useState/useReducer

### Performance Optimization
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Expensive calculations cached
- **Animation Optimization**: Performance-based animation quality adjustment
- **Bundle Splitting**: Code splitting for better load times

### Error Handling
- **Error Boundaries**: Graceful error handling
- **Service Layer**: Centralized error handling in services
- **User Feedback**: Toast notifications for user actions

## 🚀 Recent Improvements

### ✅ Completed
1. **Optimized Animation System**: New performance-focused animation engine
2. **Router Migration**: Converted phase-based navigation to React Router
3. **Enhanced Wizard**: Improved wizard with better integration
4. **Dependency Cleanup**: Removed unused dependencies (lottie-react, react-query, swr, react-transition-group)

### 🔄 In Progress
1. **Code Organization**: Better file structure and documentation
2. **Type Safety**: Improved TypeScript usage
3. **Testing Infrastructure**: Adding test coverage

### 📋 Planned
1. **@react-spring Migration**: Replace with Framer Motion equivalents
2. **Bundle Optimization**: Further bundle size reduction
3. **Performance Monitoring**: Real-time performance metrics
4. **Accessibility**: WCAG compliance improvements

## 🎨 Design Principles

### Magic Theme
- **Wizard Persona**: Central character with personality and mood
- **Magical Effects**: Over-the-top animations and visual effects
- **Fantasy UI**: Medieval/magical design language
- **Interactive Elements**: Engaging user interactions

### Performance First
- **Adaptive Quality**: Animation quality adjusts based on performance
- **Lazy Loading**: Components loaded when needed
- **Memory Management**: Efficient memory usage and cleanup
- **Bundle Optimization**: Minimal bundle size

### User Experience
- **Intuitive Navigation**: Clear navigation structure
- **Visual Feedback**: Immediate feedback for user actions
- **Error Recovery**: Graceful error handling and recovery
- **Accessibility**: Inclusive design for all users

## 🛠️ Development Guidelines

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Component Structure**: Functional components with hooks

### Performance
- **Bundle Analysis**: Regular bundle size monitoring
- **Performance Metrics**: FPS and memory usage tracking
- **Optimization**: Continuous performance optimization
- **Testing**: Performance regression testing

### Documentation
- **Code Comments**: Clear, helpful comments
- **Type Definitions**: Comprehensive type coverage
- **README Files**: Component and feature documentation
- **Architecture Docs**: System architecture documentation
