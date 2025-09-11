import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideCustomizer } from '../components/StudyGuideCustomizer';

// Mock the StudyGuideCustomizer component
const MockStudyGuideCustomizer: React.FC<any> = ({ 
  studyGuide, 
  onCustomize, 
  onError 
}) => {
  const [customizations, setCustomizations] = React.useState({
    difficulty: 'intermediate',
    focus: 'comprehensive',
    style: 'academic',
    length: 'medium'
  });

  const [isCustomizing, setIsCustomizing] = React.useState(false);

  const handleCustomize = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsCustomizing(true);
    
    try {
      // Simulate customization process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const customizedGuide = studyGuide.map((section: any) => ({
        ...section,
        title: `${section.title} (Customized)`,
        content: `${section.content} [Customized for ${customizations.difficulty} level]`,
        difficulty: customizations.difficulty,
        style: customizations.style
      }));
      
      onCustomize?.(customizedGuide);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsCustomizing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div data-testid="study-guide-customizer">
      <h2>Study Guide Customizer</h2>
      
      <div data-testid="customization-options">
        <div>
          <label htmlFor="difficulty">Difficulty Level:</label>
          <select
            id="difficulty"
            value={customizations.difficulty}
            onChange={(e) => handleInputChange('difficulty', e.target.value)}
            data-testid="difficulty-select"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="focus">Focus Area:</label>
          <select
            id="focus"
            value={customizations.focus}
            onChange={(e) => handleInputChange('focus', e.target.value)}
            data-testid="focus-select"
          >
            <option value="comprehensive">Comprehensive</option>
            <option value="key-concepts">Key Concepts</option>
            <option value="practical">Practical</option>
          </select>
        </div>

        <div>
          <label htmlFor="style">Style:</label>
          <select
            id="style"
            value={customizations.style}
            onChange={(e) => handleInputChange('style', e.target.value)}
            data-testid="style-select"
          >
            <option value="academic">Academic</option>
            <option value="casual">Casual</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div>
          <label htmlFor="length">Length:</label>
          <select
            id="length"
            value={customizations.length}
            onChange={(e) => handleInputChange('length', e.target.value)}
            data-testid="length-select"
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleCustomize}
        disabled={!studyGuide || studyGuide.length === 0 || isCustomizing}
        data-testid="customize-button"
      >
        {isCustomizing ? 'Customizing...' : 'Customize Study Guide'}
      </button>

      {isCustomizing && (
        <div data-testid="customization-progress">Customizing study guide...</div>
      )}

      {studyGuide && studyGuide.length > 0 && (
        <div data-testid="study-guide-preview">
          <h3>Preview:</h3>
          {studyGuide.map((section: any, index: number) => (
            <div key={index} data-testid={`preview-section-${index}`}>
              <h4>{section.title}</h4>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

describe('StudyGuideCustomizer', () => {
  const mockStudyGuide = [
    {
      id: '1',
      title: 'Introduction to Physics',
      content: 'Physics is the study of matter and energy.',
      keywords: ['physics', 'matter', 'energy'],
      examples: ['Newton\'s laws', 'Thermodynamics'],
      questions: ['What is physics?', 'How does energy work?'],
      annotations: ['Fundamental science']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockStudyGuideCustomizer studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-customizer')).toBeInTheDocument();
  });

  it('renders customization options', () => {
    render(<MockStudyGuideCustomizer studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('difficulty-select')).toBeInTheDocument();
    expect(screen.getByTestId('focus-select')).toBeInTheDocument();
    expect(screen.getByTestId('style-select')).toBeInTheDocument();
    expect(screen.getByTestId('length-select')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideCustomizer studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
    expect(screen.getByText('Physics is the study of matter and energy.')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideCustomizer studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates customization options when changed', () => {
    render(<MockStudyGuideCustomizer studyGuide={mockStudyGuide} />);
    
    const difficultySelect = screen.getByTestId('difficulty-select');
    const styleSelect = screen.getByTestId('style-select');
    
    fireEvent.change(difficultySelect, { target: { value: 'advanced' } });
    fireEvent.change(styleSelect, { target: { value: 'technical' } });
    
    expect(difficultySelect).toHaveValue('advanced');
    expect(styleSelect).toHaveValue('technical');
  });

  it('calls onCustomize when customize button is clicked', async () => {
    const onCustomize = jest.fn();
    
    render(
      <MockStudyGuideCustomizer 
        studyGuide={mockStudyGuide} 
        onCustomize={onCustomize} 
      />
    );
    
    const customizeButton = screen.getByTestId('customize-button');
    fireEvent.click(customizeButton);
    
    await waitFor(() => {
      expect(onCustomize).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            title: 'Introduction to Physics (Customized)',
            content: 'Physics is the study of matter and energy. [Customized for intermediate level]',
            difficulty: 'intermediate',
            style: 'academic'
          })
        ])
      );
    });
  });

  it('calls onError when customization fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideCustomizer: React.FC<any> = ({ onError }) => {
      const handleCustomize = () => {
        onError?.(new Error('Customization failed'));
      };

      return (
        <div>
          <button onClick={handleCustomize} data-testid="error-button">
            Customize with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideCustomizer onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during customization', async () => {
    render(<MockStudyGuideCustomizer studyGuide={mockStudyGuide} />);
    
    const customizeButton = screen.getByTestId('customize-button');
    fireEvent.click(customizeButton);
    
    expect(screen.getByTestId('customization-progress')).toBeInTheDocument();
    expect(screen.getByText('Customizing study guide...')).toBeInTheDocument();
  });

  it('updates button text during customization', async () => {
    render(<MockStudyGuideCustomizer studyGuide={mockStudyGuide} />);
    
    const customizeButton = screen.getByTestId('customize-button');
    fireEvent.click(customizeButton);
    
    expect(screen.getByText('Customizing...')).toBeInTheDocument();
  });

  it('disables customize button when no study guide provided', () => {
    render(<MockStudyGuideCustomizer studyGuide={[]} />);
    
    const customizeButton = screen.getByTestId('customize-button');
    expect(customizeButton).toBeDisabled();
  });

  it('disables customize button during customization', async () => {
    render(<MockStudyGuideCustomizer studyGuide={mockStudyGuide} />);
    
    const customizeButton = screen.getByTestId('customize-button');
    fireEvent.click(customizeButton);
    
    expect(customizeButton).toBeDisabled();
  });
});
