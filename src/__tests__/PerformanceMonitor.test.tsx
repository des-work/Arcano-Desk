import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { PerformanceMonitor } from '../components/PerformanceMonitor';

// Mock requestAnimationFrame and cancelAnimationFrame
let animationFrameCallbacks: Function[] = [];
let animationFrameId = 0;

beforeAll(() => {
  global.requestAnimationFrame = jest.fn((cb) => {
    animationFrameCallbacks.push(cb);
    return ++animationFrameId;
  });
  
  global.cancelAnimationFrame = jest.fn((id) => {
    animationFrameCallbacks = animationFrameCallbacks.filter((_, index) => index + 1 !== id);
  });
  
  // Mock performance.now() for consistent time
  global.performance.now = jest.fn(() => 0);
  
  // Mock performance.memory for memory usage
  Object.defineProperty(global.performance, 'memory', {
    value: {
      usedJSHeapSize: 50 * 1024 * 1024, // 50 MB
      totalJSHeapSize: 100 * 1024 * 1024,
      jsHeapSizeLimit: 500 * 1024 * 1024,
    },
    writable: true,
  });
});

afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
  animationFrameCallbacks = [];
  animationFrameId = 0;
  (global.performance.now as jest.Mock).mockReturnValue(0);
});

const runAnimationFrames = (count: number, timeIncrement: number = 16.67) => {
  for (let i = 0; i < count; i++) {
    (global.performance.now as jest.Mock).mockImplementation((prevTime: number) => prevTime + timeIncrement);
    const callbacks = [...animationFrameCallbacks];
    animationFrameCallbacks = [];
    callbacks.forEach(cb => cb(global.performance.now()));
  }
};

describe('PerformanceMonitor', () => {
  it('does not render debug info when showDebug is false', () => {
    render(<PerformanceMonitor showDebug={false} />);
    expect(screen.queryByText(/FPS:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Memory:/i)).not.toBeInTheDocument();
  });

  it('renders debug info when showDebug is true', () => {
    render(<PerformanceMonitor showDebug={true} />);
    expect(screen.getByText(/FPS:/i)).toBeInTheDocument();
    expect(screen.getByText(/Memory:/i)).toBeInTheDocument();
  });

  it('updates FPS correctly after 1 second', () => {
    render(<PerformanceMonitor showDebug={true} />);

    act(() => {
      (global.performance.now as jest.Mock).mockReturnValue(0);
      for (let i = 0; i < 60; i++) {
        runAnimationFrames(1, 1000 / 60);
      }
      (global.performance.now as jest.Mock).mockReturnValue(1000);
      runAnimationFrames(1);
    });

    expect(screen.getByText('FPS: 60')).toBeInTheDocument();
  });

  it('updates Memory correctly', () => {
    render(<PerformanceMonitor showDebug={true} />);

    act(() => {
      (global.performance.now as jest.Mock).mockReturnValue(1000);
      runAnimationFrames(1);
    });

    expect(screen.getByText('Memory: 50 MB')).toBeInTheDocument();
  });

  it('stops animation frame requests on unmount', () => {
    const { unmount } = render(<PerformanceMonitor showDebug={true} />);
    expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);
    unmount();
    expect(global.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });
});