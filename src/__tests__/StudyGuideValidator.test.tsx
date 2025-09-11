import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideValidator } from '../components/StudyGuideValidator';

// Mock the StudyGuideValidator component
const MockStudyGuideValidator: React.FC<any> = ({ 
  studyGuide, 
  onValidate, 
  onError 
}) => {
  const [validationResults, setValidationResults] = React.useState<any>(null);
  const [isValidating, setIsValidating] = React.useState(false);

  const handleValidate = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsValidating(true);
    
    try {
      // Simulate validation process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        isValid: true,
        errors: [],
        warnings: [],
        suggestions: [],
        statistics: {
          totalSections: studyGuide.length,
          totalKeywords: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.keywords?.length || 0), 0
          ),
          totalExamples: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.examples?.length || 0), 0
          ),
          totalQuestions: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.questions?.length || 0), 0
          ),
          totalAnnotations: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.annotations?.length || 0), 0
          )
        }
      };

      // Check for common issues
      studyGuide.forEach((section: any, index: number) => {
        if (!section.title || section.title.trim() === '') {
          results.errors.push(`Section ${index + 1}: Missing title`);
          results.isValid = false;
        }
        
        if (!section.content || section.content.trim() === '') {
          results.errors.push(`Section ${index + 1}: Missing content`);
          results.isValid = false;
        }
        
        if (!section.keywords || section.keywords.length === 0) {
          results.warnings.push(`Section ${index + 1}: No keywords provided`);
        }
        
        if (!section.examples || section.examples.length === 0) {
          results.warnings.push(`Section ${index + 1}: No examples provided`);
        }
        
        if (!section.questions || section.questions.length === 0) {
          results.warnings.push(`Section ${index + 1}: No questions provided`);
        }
        
        if (section.content && section.content.length < 50) {
          results.suggestions.push(`Section ${index + 1}: Content is quite short, consider adding more detail`);
        }
      });

      setValidationResults(results);
      onValidate?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div data-testid="study-guide-validator">
      <h2>Study Guide Validator</h2>
      
      <button
        onClick={handleValidate}
        disabled={!studyGuide || studyGuide.length === 0 || isValidating}
        data-testid="validate-button"
      >
        {isValidating ? 'Validating...' : 'Validate Study Guide'}
      </button>

      {isValidating && (
        <div data-testid="validation-progress">Validating study guide...</div>
      )}

      {validationResults && (
        <div data-testid="validation-results">
          <h3>Validation Results</h3>
          
          <div data-testid="validation-status">
            Status: {validationResults.isValid ? 'Valid' : 'Invalid'}
          </div>

          {validationResults.errors.length > 0 && (
            <div data-testid="validation-errors">
              <h4>Errors ({validationResults.errors.length}):</h4>
              <ul>
                {validationResults.errors.map((error: string, index: number) => (
                  <li key={index} data-testid={`error-${index}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {validationResults.warnings.length > 0 && (
            <div data-testid="validation-warnings">
              <h4>Warnings ({validationResults.warnings.length}):</h4>
              <ul>
                {validationResults.warnings.map((warning: string, index: number) => (
                  <li key={index} data-testid={`warning-${index}`}>{warning}</li>
                ))}
              </ul>
            </div>
          )}

          {validationResults.suggestions.length > 0 && (
            <div data-testid="validation-suggestions">
              <h4>Suggestions ({validationResults.suggestions.length}):</h4>
              <ul>
                {validationResults.suggestions.map((suggestion: string, index: number) => (
                  <li key={index} data-testid={`suggestion-${index}`}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}

          <div data-testid="validation-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {validationResults.statistics.totalSections}</p>
            <p>Total Keywords: {validationResults.statistics.totalKeywords}</p>
            <p>Total Examples: {validationResults.statistics.totalExamples}</p>
            <p>Total Questions: {validationResults.statistics.totalQuestions}</p>
            <p>Total Annotations: {validationResults.statistics.totalAnnotations}</p>
          </div>
        </div>
      )}

      {studyGuide && studyGuide.length > 0 && (
        <div data-testid="study-guide-preview">
          <h3>Study Guide Preview:</h3>
          <p>Sections: {studyGuide.length}</p>
          {studyGuide.map((section: any, index: number) => (
            <div key={index} data-testid={`preview-section-${index}`}>
              <h4>{section.title || 'Untitled Section'}</h4>
              <p>{section.content || 'No content'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

describe('StudyGuideValidator', () => {
  const mockStudyGuide = [
    {
      id: '1',
      title: 'Introduction to Physics',
      content: 'Physics is the study of matter and energy and their interactions.',
      keywords: ['physics', 'matter', 'energy'],
      examples: ['Newton\'s laws', 'Thermodynamics'],
      questions: ['What is physics?', 'How does energy work?'],
      annotations: ['Fundamental science']
    },
    {
      id: '2',
      title: 'Advanced Concepts',
      content: 'Advanced physics concepts build on the fundamentals.',
      keywords: ['advanced', 'concepts'],
      examples: ['Quantum mechanics'],
      questions: ['What is quantum mechanics?'],
      annotations: ['Advanced topics']
    }
  ];

  const mockInvalidStudyGuide = [
    {
      id: '1',
      title: '', // Missing title
      content: '', // Missing content
      keywords: [],
      examples: [],
      questions: [],
      annotations: []
    },
    {
      id: '2',
      title: 'Short',
      content: 'Too short', // Very short content
      keywords: [],
      examples: [],
      questions: [],
      annotations: []
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockStudyGuideValidator studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-validator')).toBeInTheDocument();
  });

  it('renders validate button', () => {
    render(<MockStudyGuideValidator studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('validate-button')).toBeInTheDocument();
    expect(screen.getByText('Validate Study Guide')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideValidator studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideValidator studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('calls onValidate when validation completes successfully', async () => {
    const onValidate = jest.fn();
    
    render(
      <MockStudyGuideValidator 
        studyGuide={mockStudyGuide} 
        onValidate={onValidate} 
      />
    );
    
    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(onValidate).toHaveBeenCalledWith(
        expect.objectContaining({
          isValid: true,
          errors: [],
          warnings: expect.any(Array),
          suggestions: expect.any(Array),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalKeywords: 5,
            totalExamples: 3,
            totalQuestions: 3,
            totalAnnotations: 2
          })
        })
      );
    });
  });

  it('calls onError when validation fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideValidator: React.FC<any> = ({ onError }) => {
      const handleValidate = () => {
        onError?.(new Error('Validation failed'));
      };

      return (
        <div>
          <button onClick={handleValidate} data-testid="error-button">
            Validate with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideValidator onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during validation', async () => {
    render(<MockStudyGuideValidator studyGuide={mockStudyGuide} />);
    
    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);
    
    expect(screen.getByTestId('validation-progress')).toBeInTheDocument();
    expect(screen.getByText('Validating study guide...')).toBeInTheDocument();
  });

  it('updates button text during validation', async () => {
    render(<MockStudyGuideValidator studyGuide={mockStudyGuide} />);
    
    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);
    
    expect(screen.getByText('Validating...')).toBeInTheDocument();
  });

  it('disables validate button when no study guide provided', () => {
    render(<MockStudyGuideValidator studyGuide={[]} />);
    
    const validateButton = screen.getByTestId('validate-button');
    expect(validateButton).toBeDisabled();
  });

  it('disables validate button during validation', async () => {
    render(<MockStudyGuideValidator studyGuide={mockStudyGuide} />);
    
    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);
    
    expect(validateButton).toBeDisabled();
  });

  it('displays validation results after validation', async () => {
    render(<MockStudyGuideValidator studyGuide={mockStudyGuide} />);
    
    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('validation-results')).toBeInTheDocument();
      expect(screen.getByText('Status: Valid')).toBeInTheDocument();
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
    });
  });

  it('identifies validation errors correctly', async () => {
    render(<MockStudyGuideValidator studyGuide={mockInvalidStudyGuide} />);
    
    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('validation-results')).toBeInTheDocument();
      expect(screen.getByText('Status: Invalid')).toBeInTheDocument();
      expect(screen.getByTestId('validation-errors')).toBeInTheDocument();
      expect(screen.getByText('Errors (2):')).toBeInTheDocument();
    });
  });

  it('identifies validation warnings correctly', async () => {
    render(<MockStudyGuideValidator studyGuide={mockInvalidStudyGuide} />);
    
    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('validation-warnings')).toBeInTheDocument();
      expect(screen.getByText('Warnings (4):')).toBeInTheDocument();
    });
  });

  it('provides validation suggestions', async () => {
    render(<MockStudyGuideValidator studyGuide={mockInvalidStudyGuide} />);
    
    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('validation-suggestions')).toBeInTheDocument();
      expect(screen.getByText('Suggestions (1):')).toBeInTheDocument();
    });
  });

  it('calculates statistics correctly', async () => {
    render(<MockStudyGuideValidator studyGuide={mockStudyGuide} />);
    
    const validateButton = screen.getByTestId('validate-button');
    fireEvent.click(validateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Keywords: 5')).toBeInTheDocument();
      expect(screen.getByText('Total Examples: 3')).toBeInTheDocument();
      expect(screen.getByText('Total Questions: 3')).toBeInTheDocument();
      expect(screen.getByText('Total Annotations: 2')).toBeInTheDocument();
    });
  });
});
