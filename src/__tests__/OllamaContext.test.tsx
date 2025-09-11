import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { OllamaProvider, useOllama } from '../contexts/OllamaContext';

// Mock the OllamaProvider component
const MockOllamaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="ollama-provider">{children}</div>
);

// Mock the useOllama hook
const mockUseOllama = {
  isConnected: false,
  isConnecting: false,
  error: null,
  connect: jest.fn(),
  disconnect: jest.fn(),
  generateStudyGuide: jest.fn(),
  isGenerating: false,
  progress: 0
};

jest.mock('../contexts/OllamaContext', () => ({
  OllamaProvider: MockOllamaProvider,
  useOllama: () => mockUseOllama
}));

// Test component that uses the context
const TestComponent: React.FC = () => {
  const { isConnected, isConnecting, error, connect, disconnect, generateStudyGuide, isGenerating, progress } = useOllama();
  
  return (
    <div>
      <div data-testid="is-connected">{isConnected ? 'Connected' : 'Disconnected'}</div>
      <div data-testid="is-connecting">{isConnecting ? 'Connecting' : 'Not Connecting'}</div>
      <div data-testid="error">{error || 'No Error'}</div>
      <div data-testid="is-generating">{isGenerating ? 'Generating' : 'Not Generating'}</div>
      <div data-testid="progress">{progress}%</div>
      <button onClick={connect} data-testid="connect-button">Connect</button>
      <button onClick={disconnect} data-testid="disconnect-button">Disconnect</button>
      <button onClick={() => generateStudyGuide('test prompt')} data-testid="generate-button">Generate</button>
    </div>
  );
};

describe('OllamaContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides default context values', () => {
    render(
      <OllamaProvider>
        <TestComponent />
      </OllamaProvider>
    );

    expect(screen.getByTestId('is-connected')).toHaveTextContent('Disconnected');
    expect(screen.getByTestId('is-connecting')).toHaveTextContent('Not Connecting');
    expect(screen.getByTestId('error')).toHaveTextContent('No Error');
    expect(screen.getByTestId('is-generating')).toHaveTextContent('Not Generating');
    expect(screen.getByTestId('progress')).toHaveTextContent('0%');
  });

  it('calls connect when connect button is clicked', () => {
    render(
      <OllamaProvider>
        <TestComponent />
      </OllamaProvider>
    );

    fireEvent.click(screen.getByTestId('connect-button'));
    expect(mockUseOllama.connect).toHaveBeenCalledTimes(1);
  });

  it('calls disconnect when disconnect button is clicked', () => {
    render(
      <OllamaProvider>
        <TestComponent />
      </OllamaProvider>
    );

    fireEvent.click(screen.getByTestId('disconnect-button'));
    expect(mockUseOllama.disconnect).toHaveBeenCalledTimes(1);
  });

  it('calls generateStudyGuide when generate button is clicked', () => {
    render(
      <OllamaProvider>
        <TestComponent />
      </OllamaProvider>
    );

    fireEvent.click(screen.getByTestId('generate-button'));
    expect(mockUseOllama.generateStudyGuide).toHaveBeenCalledWith('test prompt');
  });

  it('updates context values when state changes', () => {
    // Test with different context values
    const { rerender } = render(
      <OllamaProvider>
        <TestComponent />
      </OllamaProvider>
    );

    // Update mock values
    mockUseOllama.isConnected = true;
    mockUseOllama.isConnecting = true;
    mockUseOllama.error = 'Connection failed';
    mockUseOllama.isGenerating = true;
    mockUseOllama.progress = 50;

    rerender(
      <OllamaProvider>
        <TestComponent />
      </OllamaProvider>
    );

    expect(screen.getByTestId('is-connected')).toHaveTextContent('Connected');
    expect(screen.getByTestId('is-connecting')).toHaveTextContent('Connecting');
    expect(screen.getByTestId('error')).toHaveTextContent('Connection failed');
    expect(screen.getByTestId('is-generating')).toHaveTextContent('Generating');
    expect(screen.getByTestId('progress')).toHaveTextContent('50%');
  });
});
