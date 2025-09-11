import React, { Suspense } from 'react';
import { render, screen } from '@testing-library/react';
import { LazyAnimationWrapper } from '../components/LazyAnimationWrapper';

// Mock a lazy component
const MockLazyComponent = React.lazy(() => 
  Promise.resolve({ 
    default: () => <div data-testid="lazy-component">Lazy Component Loaded</div> 
  })
);

// Mock a component that throws an error
const ErrorLazyComponent = React.lazy(() => 
  Promise.reject(new Error('Failed to load component'))
);

describe('LazyAnimationWrapper', () => {
  it('renders lazy component when loaded successfully', async () => {
    render(
      <LazyAnimationWrapper 
        component={MockLazyComponent}
        fallback={<div data-testid="loading">Loading...</div>}
      />
    );

    // Should show loading initially
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Wait for component to load
    await screen.findByTestId('lazy-component');
    expect(screen.getByTestId('lazy-component')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    const customFallback = <div data-testid="custom-fallback">Custom Loading...</div>;
    
    render(
      <LazyAnimationWrapper 
        component={MockLazyComponent}
        fallback={customFallback}
      />
    );

    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });

  it('renders default fallback when none provided', () => {
    render(
      <LazyAnimationWrapper 
        component={MockLazyComponent}
      />
    );

    expect(screen.getByText('Loading animation...')).toBeInTheDocument();
  });

  it('passes props to lazy component', async () => {
    const TestComponent = React.lazy(() => 
      Promise.resolve({ 
        default: ({ testProp }: { testProp: string }) => 
          <div data-testid="lazy-component">{testProp}</div> 
      })
    );

    render(
      <LazyAnimationWrapper 
        component={TestComponent}
        testProp="Test Value"
      />
    );

    await screen.findByTestId('lazy-component');
    expect(screen.getByTestId('lazy-component')).toHaveTextContent('Test Value');
  });

  it('handles component loading errors gracefully', async () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <LazyAnimationWrapper 
        component={ErrorLazyComponent}
        fallback={<div data-testid="error-fallback">Error loading component</div>}
      />
    );

    // Should show fallback when error occurs
    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
