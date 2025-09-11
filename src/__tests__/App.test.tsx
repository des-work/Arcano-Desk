import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock the lazy components
jest.mock('../utils/codeSplitting', () => ({
  LazyStudyGuideGenerator: React.lazy(() => 
    Promise.resolve({ default: () => <div data-testid="study-guide-generator">Study Guide Generator</div> })
  ),
  LazyEnhancedStudyGuideGenerator: React.lazy(() => 
    Promise.resolve({ default: () => <div data-testid="enhanced-study-guide-generator">Enhanced Study Guide Generator</div> })
  ),
  LazyStreamlinedStudyGuideGenerator: React.lazy(() => 
    Promise.resolve({ default: () => <div data-testid="streamlined-study-guide-generator">Streamlined Study Guide Generator</div> })
  ),
  LazyStudyGuideCustomizer: React.lazy(() => 
    Promise.resolve({ default: () => <div data-testid="study-guide-customizer">Study Guide Customizer</div> })
  ),
  LazyStudyGuideDisplay: React.lazy(() => 
    Promise.resolve({ default: () => <div data-testid="study-guide-display">Study Guide Display</div> })
  ),
  LazyEnhancedUploadPhase: React.lazy(() => 
    Promise.resolve({ default: () => <div data-testid="enhanced-upload-phase">Enhanced Upload Phase</div> })
  ),
  preloadCriticalComponents: jest.fn()
}));

// Mock the PerformanceMonitor
jest.mock('../components/PerformanceMonitor', () => ({
  PerformanceMonitor: ({ showDebug }: { showDebug: boolean }) => 
    showDebug ? <div data-testid="performance-monitor">Performance Monitor</div> : null
}));

// Mock the OllamaProvider
jest.mock('../contexts/OllamaContext', () => ({
  OllamaProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ollama-provider">{children}</div>
  )
}));

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('ollama-provider')).toBeInTheDocument();
  });

  it('calls preloadCriticalComponents on mount', () => {
    const { preloadCriticalComponents } = require('../utils/codeSplitting');
    render(<App />);
    expect(preloadCriticalComponents).toHaveBeenCalledTimes(1);
  });

  it('renders PerformanceMonitor with showDebug false by default', () => {
    render(<App />);
    expect(screen.queryByTestId('performance-monitor')).not.toBeInTheDocument();
  });

  it('renders PerformanceMonitor with showDebug true when enabled', () => {
    // Mock environment variable or prop to enable debug mode
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    render(<App />);
    expect(screen.getByTestId('performance-monitor')).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });

  it('renders lazy components with Suspense fallbacks', async () => {
    render(<App />);
    
    // Check that Suspense fallbacks are rendered initially
    expect(screen.getByText('Loading Study Guide Generator...')).toBeInTheDocument();
    expect(screen.getByText('Loading Enhanced Study Guide Generator...')).toBeInTheDocument();
    expect(screen.getByText('Loading Streamlined Study Guide Generator...')).toBeInTheDocument();
    expect(screen.getByText('Loading Study Guide Customizer...')).toBeInTheDocument();
    expect(screen.getByText('Loading Study Guide Display...')).toBeInTheDocument();
    expect(screen.getByText('Loading Enhanced Upload Phase...')).toBeInTheDocument();
  });

  it('handles component loading errors gracefully', async () => {
    // Mock a component that fails to load
    const { LazyStudyGuideGenerator } = require('../utils/codeSplitting');
    LazyStudyGuideGenerator.mockImplementation(() => 
      React.lazy(() => Promise.reject(new Error('Failed to load')))
    );

    render(<App />);
    
    // Should still render the app without crashing
    expect(screen.getByTestId('ollama-provider')).toBeInTheDocument();
  });

  it('renders all main sections', () => {
    render(<App />);
    
    // Check for main sections that should be present
    expect(screen.getByText('Arcano Desk')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Study Guide Generator')).toBeInTheDocument();
  });
});
