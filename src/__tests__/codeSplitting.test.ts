import { 
  preloadCriticalComponents,
  preloadAnimationComponents,
  preloadAllComponents,
  getBundleInfo,
  getLoadingStrategy,
  safeLazyImport
} from '../utils/codeSplitting';

// Mock dynamic imports
jest.mock('../components/StudyGuideDisplay', () => ({
  StudyGuideDisplay: () => <div>StudyGuideDisplay</div>
}));

jest.mock('../components/EnhancedUploadPhase', () => ({
  EnhancedUploadPhase: () => <div>EnhancedUploadPhase</div>
}));

jest.mock('../components/Header', () => ({
  Header: () => <div>Header</div>
}));

jest.mock('../components/AnimatedWizard', () => ({
  AnimatedWizard: () => <div>AnimatedWizard</div>
}));

jest.mock('../animations/WizardAnimations', () => ({
  WizardAnimations: () => <div>WizardAnimations</div>
}));

jest.mock('../animations/ParticleEffects', () => ({
  ParticleEffects: () => <div>ParticleEffects</div>
}));

jest.mock('../animations/InteractiveAnimations', () => ({
  InteractiveAnimations: () => <div>InteractiveAnimations</div>
}));

describe('codeSplitting', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('preloadCriticalComponents', () => {
    it('should be a function', () => {
      expect(typeof preloadCriticalComponents).toBe('function');
    });

    it('should not throw when called', () => {
      expect(() => preloadCriticalComponents()).not.toThrow();
    });
  });

  describe('preloadAnimationComponents', () => {
    it('should be a function', () => {
      expect(typeof preloadAnimationComponents).toBe('function');
    });

    it('should not throw when called', () => {
      expect(() => preloadAnimationComponents()).not.toThrow();
    });
  });

  describe('preloadAllComponents', () => {
    it('should be a function', () => {
      expect(typeof preloadAllComponents).toBe('function');
    });

    it('should not throw when called', () => {
      expect(() => preloadAllComponents()).not.toThrow();
    });
  });

  describe('getBundleInfo', () => {
    it('should return null when webpack is not available', () => {
      const result = getBundleInfo();
      expect(result).toBeNull();
    });

    it('should return bundle info when webpack is available', () => {
      // Mock webpack require
      (window as any).__webpack_require__ = {
        cache: {
          'module1': { loaded: true, children: [] },
          'module2': { loaded: false, children: ['module1'] }
        }
      };

      const result = getBundleInfo();
      expect(result).toEqual({
        moduleCount: 2,
        modules: [
          { id: 'module1', loaded: true, children: 0 },
          { id: 'module2', loaded: false, children: 1 }
        ]
      });
    });
  });

  describe('getLoadingStrategy', () => {
    it('should return minimal for slow connections', () => {
      expect(getLoadingStrategy('slow-2g')).toBe('minimal');
      expect(getLoadingStrategy('2g')).toBe('minimal');
    });

    it('should return conservative for low memory devices', () => {
      expect(getLoadingStrategy('3g', 1)).toBe('conservative');
      expect(getLoadingStrategy('4g', 1.5)).toBe('conservative');
    });

    it('should return aggressive for high memory devices', () => {
      expect(getLoadingStrategy('4g', 8)).toBe('aggressive');
      expect(getLoadingStrategy('4g', 16)).toBe('aggressive');
    });

    it('should return balanced for normal conditions', () => {
      expect(getLoadingStrategy('4g', 4)).toBe('balanced');
      expect(getLoadingStrategy()).toBe('balanced');
    });
  });

  describe('safeLazyImport', () => {
    it('should return a lazy component', () => {
      const MockComponent = () => <div>Mock Component</div>;
      const importFn = jest.fn().mockResolvedValue({ default: MockComponent });
      
      const LazyComponent = safeLazyImport(importFn);
      expect(LazyComponent).toBeDefined();
    });

    it('should handle import errors gracefully', async () => {
      const importFn = jest.fn().mockRejectedValue(new Error('Import failed'));
      
      const LazyComponent = safeLazyImport(importFn);
      
      // The component should still be defined even if import fails
      expect(LazyComponent).toBeDefined();
    });
  });
});
