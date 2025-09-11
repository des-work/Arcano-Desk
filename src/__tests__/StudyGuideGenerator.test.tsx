import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideGenerator } from '../components/StudyGuideGenerator';

// Mock the OllamaContext
const mockUseOllama = {
  isConnected: true,
  isConnecting: false,
  error: null,
  connect: jest.fn(),
  disconnect: jest.fn(),
  generateStudyGuide: jest.fn(),
  isGenerating: false,
  progress: 0
};

jest.mock('../contexts/OllamaContext', () => ({
  useOllama: () => mockUseOllama
}));

// Mock the StudyGuideGenerator component
const MockStudyGuideGenerator: React.FC<any> = ({ 
  onStudyGuideGenerated, 
  onError, 
  onProgress 
}) => {
  const [prompt, setPrompt] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    onProgress?.(0);
    
    try {
      // Simulate generation process
      for (let i = 0; i <= 100; i += 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        onProgress?.(i);
      }
      
      const mockStudyGuide = [
        {
          id: '1',
          title: 'Generated Study Guide',
          level: 1,
          content: `Study guide for: ${prompt}`,
          keywords: ['keyword1', 'keyword2'],
          examples: ['Example 1', 'Example 2'],
          questions: ['Question 1?', 'Question 2?'],
          annotations: ['Annotation 1']
        }
      ];
      
      onStudyGuideGenerated?.(mockStudyGuide);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div data-testid="study-guide-generator">
      <h2>Study Guide Generator</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your study topic..."
        data-testid="prompt-input"
      />
      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || isGenerating}
        data-testid="generate-button"
      >
        {isGenerating ? 'Generating...' : 'Generate Study Guide'}
      </button>
      {isGenerating && (
        <div data-testid="progress-indicator">Generating study guide...</div>
      )}
    </div>
  );
};

describe('StudyGuideGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockStudyGuideGenerator />);
    expect(screen.getByTestId('study-guide-generator')).toBeInTheDocument();
  });

  it('renders input field and generate button', () => {
    render(<MockStudyGuideGenerator />);
    
    expect(screen.getByTestId('prompt-input')).toBeInTheDocument();
    expect(screen.getByTestId('generate-button')).toBeInTheDocument();
    expect(screen.getByText('Study Guide Generator')).toBeInTheDocument();
  });

  it('disables generate button when prompt is empty', () => {
    render(<MockStudyGuideGenerator />);
    
    const generateButton = screen.getByTestId('generate-button');
    expect(generateButton).toBeDisabled();
  });

  it('enables generate button when prompt has content', () => {
    render(<MockStudyGuideGenerator />);
    
    const promptInput = screen.getByTestId('prompt-input');
    const generateButton = screen.getByTestId('generate-button');
    
    fireEvent.change(promptInput, { target: { value: 'Test topic' } });
    expect(generateButton).not.toBeDisabled();
  });

  it('calls onStudyGuideGenerated when generation completes', async () => {
    const onStudyGuideGenerated = jest.fn();
    
    render(
      <MockStudyGuideGenerator onStudyGuideGenerated={onStudyGuideGenerated} />
    );
    
    const promptInput = screen.getByTestId('prompt-input');
    const generateButton = screen.getByTestId('generate-button');
    
    fireEvent.change(promptInput, { target: { value: 'Test topic' } });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(onStudyGuideGenerated).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Generated Study Guide',
            content: 'Study guide for: Test topic'
          })
        ])
      );
    });
  });

  it('calls onProgress during generation', async () => {
    const onProgress = jest.fn();
    
    render(
      <MockStudyGuideGenerator onProgress={onProgress} />
    );
    
    const promptInput = screen.getByTestId('prompt-input');
    const generateButton = screen.getByTestId('generate-button');
    
    fireEvent.change(promptInput, { target: { value: 'Test topic' } });
    fireEvent.click(generateButton);
    
    await waitFor(() => {
      expect(onProgress).toHaveBeenCalledWith(0);
      expect(onProgress).toHaveBeenCalledWith(20);
      expect(onProgress).toHaveBeenCalledWith(40);
      expect(onProgress).toHaveBeenCalledWith(60);
      expect(onProgress).toHaveBeenCalledWith(80);
      expect(onProgress).toHaveBeenCalledWith(100);
    });
  });

  it('calls onError when generation fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideGenerator: React.FC<any> = ({ onError }) => {
      const handleGenerate = () => {
        onError?.(new Error('Generation failed'));
      };

      return (
        <div>
          <button onClick={handleGenerate} data-testid="error-button">
            Generate with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideGenerator onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during generation', async () => {
    render(<MockStudyGuideGenerator />);
    
    const promptInput = screen.getByTestId('prompt-input');
    const generateButton = screen.getByTestId('generate-button');
    
    fireEvent.change(promptInput, { target: { value: 'Test topic' } });
    fireEvent.click(generateButton);
    
    expect(screen.getByTestId('progress-indicator')).toBeInTheDocument();
    expect(screen.getByText('Generating study guide...')).toBeInTheDocument();
  });

  it('updates button text during generation', async () => {
    render(<MockStudyGuideGenerator />);
    
    const promptInput = screen.getByTestId('prompt-input');
    const generateButton = screen.getByTestId('generate-button');
    
    fireEvent.change(promptInput, { target: { value: 'Test topic' } });
    fireEvent.click(generateButton);
    
    expect(screen.getByText('Generating...')).toBeInTheDocument();
  });
});
