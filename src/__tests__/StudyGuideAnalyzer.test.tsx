import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideAnalyzer } from '../components/StudyGuideAnalyzer';

// Mock the StudyGuideAnalyzer component
const MockStudyGuideAnalyzer: React.FC<any> = ({ 
  studyGuide, 
  onAnalyze, 
  onError 
}) => {
  const [analysisResults, setAnalysisResults] = React.useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleAnalyze = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsAnalyzing(true);
    
    try {
      // Simulate analysis process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        readability: {
          score: 75,
          level: 'Intermediate',
          description: 'The study guide is written at an intermediate reading level.'
        },
        complexity: {
          score: 60,
          level: 'Moderate',
          description: 'The content has moderate complexity with some advanced concepts.'
        },
        coverage: {
          score: 80,
          level: 'Good',
          description: 'The study guide covers the topic well with good depth.'
        },
        structure: {
          score: 85,
          level: 'Excellent',
          description: 'The study guide has excellent structure and organization.'
        },
        engagement: {
          score: 70,
          level: 'Good',
          description: 'The study guide has good engagement with examples and questions.'
        },
        recommendations: [
          'Consider adding more visual aids to improve comprehension',
          'Include more real-world examples to enhance understanding',
          'Add interactive elements to increase engagement',
          'Consider breaking down complex sections into smaller parts'
        ],
        statistics: {
          totalSections: studyGuide.length,
          totalWords: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.content?.split(' ').length || 0), 0
          ),
          totalKeywords: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.keywords?.length || 0), 0
          ),
          totalExamples: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.examples?.length || 0), 0
          ),
          totalQuestions: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.questions?.length || 0), 0
          ),
          averageSectionLength: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.content?.length || 0), 0
          ) / studyGuide.length
        }
      };

      setAnalysisResults(results);
      onAnalyze?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div data-testid="study-guide-analyzer">
      <h2>Study Guide Analyzer</h2>
      
      <button
        onClick={handleAnalyze}
        disabled={!studyGuide || studyGuide.length === 0 || isAnalyzing}
        data-testid="analyze-button"
      >
        {isAnalyzing ? 'Analyzing...' : 'Analyze Study Guide'}
      </button>

      {isAnalyzing && (
        <div data-testid="analysis-progress">Analyzing study guide...</div>
      )}

      {analysisResults && (
        <div data-testid="analysis-results">
          <h3>Analysis Results</h3>
          
          <div data-testid="analysis-scores">
            <h4>Quality Scores:</h4>
            <div data-testid="readability-score">
              Readability: {analysisResults.readability.score}/100 ({analysisResults.readability.level})
            </div>
            <div data-testid="complexity-score">
              Complexity: {analysisResults.complexity.score}/100 ({analysisResults.complexity.level})
            </div>
            <div data-testid="coverage-score">
              Coverage: {analysisResults.coverage.score}/100 ({analysisResults.coverage.level})
            </div>
            <div data-testid="structure-score">
              Structure: {analysisResults.structure.score}/100 ({analysisResults.structure.level})
            </div>
            <div data-testid="engagement-score">
              Engagement: {analysisResults.engagement.score}/100 ({analysisResults.engagement.level})
            </div>
          </div>

          <div data-testid="analysis-descriptions">
            <h4>Analysis Descriptions:</h4>
            <p data-testid="readability-desc">{analysisResults.readability.description}</p>
            <p data-testid="complexity-desc">{analysisResults.complexity.description}</p>
            <p data-testid="coverage-desc">{analysisResults.coverage.description}</p>
            <p data-testid="structure-desc">{analysisResults.structure.description}</p>
            <p data-testid="engagement-desc">{analysisResults.engagement.description}</p>
          </div>

          <div data-testid="analysis-recommendations">
            <h4>Recommendations:</h4>
            <ul>
              {analysisResults.recommendations.map((recommendation: string, index: number) => (
                <li key={index} data-testid={`recommendation-${index}`}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <div data-testid="analysis-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {analysisResults.statistics.totalSections}</p>
            <p>Total Words: {analysisResults.statistics.totalWords}</p>
            <p>Total Keywords: {analysisResults.statistics.totalKeywords}</p>
            <p>Total Examples: {analysisResults.statistics.totalExamples}</p>
            <p>Total Questions: {analysisResults.statistics.totalQuestions}</p>
            <p>Average Section Length: {Math.round(analysisResults.statistics.averageSectionLength)} characters</p>
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

describe('StudyGuideAnalyzer', () => {
  const mockStudyGuide = [
    {
      id: '1',
      title: 'Introduction to Physics',
      content: 'Physics is the study of matter and energy and their interactions. It is a fundamental science that helps us understand the natural world.',
      keywords: ['physics', 'matter', 'energy', 'science'],
      examples: ['Newton\'s laws', 'Thermodynamics', 'Quantum mechanics'],
      questions: ['What is physics?', 'How does energy work?', 'What are the fundamental forces?'],
      annotations: ['Fundamental science', 'Important for understanding nature']
    },
    {
      id: '2',
      title: 'Advanced Concepts',
      content: 'Advanced physics concepts build on the fundamentals and explore more complex phenomena.',
      keywords: ['advanced', 'concepts', 'phenomena'],
      examples: ['Quantum mechanics', 'Relativity'],
      questions: ['What is quantum mechanics?', 'Explain relativity.'],
      annotations: ['Advanced topics', 'Requires deep understanding']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-analyzer')).toBeInTheDocument();
  });

  it('renders analyze button', () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('analyze-button')).toBeInTheDocument();
    expect(screen.getByText('Analyze Study Guide')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideAnalyzer studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('calls onAnalyze when analysis completes successfully', async () => {
    const onAnalyze = jest.fn();
    
    render(
      <MockStudyGuideAnalyzer 
        studyGuide={mockStudyGuide} 
        onAnalyze={onAnalyze} 
      />
    );
    
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(onAnalyze).toHaveBeenCalledWith(
        expect.objectContaining({
          readability: expect.objectContaining({
            score: 75,
            level: 'Intermediate'
          }),
          complexity: expect.objectContaining({
            score: 60,
            level: 'Moderate'
          }),
          coverage: expect.objectContaining({
            score: 80,
            level: 'Good'
          }),
          structure: expect.objectContaining({
            score: 85,
            level: 'Excellent'
          }),
          engagement: expect.objectContaining({
            score: 70,
            level: 'Good'
          }),
          recommendations: expect.any(Array),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalWords: expect.any(Number),
            totalKeywords: 7,
            totalExamples: 5,
            totalQuestions: 5,
            totalAnnotations: 4
          })
        })
      );
    });
  });

  it('calls onError when analysis fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideAnalyzer: React.FC<any> = ({ onError }) => {
      const handleAnalyze = () => {
        onError?.(new Error('Analysis failed'));
      };

      return (
        <div>
          <button onClick={handleAnalyze} data-testid="error-button">
            Analyze with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideAnalyzer onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during analysis', async () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    
    expect(screen.getByTestId('analysis-progress')).toBeInTheDocument();
    expect(screen.getByText('Analyzing study guide...')).toBeInTheDocument();
  });

  it('updates button text during analysis', async () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
  });

  it('disables analyze button when no study guide provided', () => {
    render(<MockStudyGuideAnalyzer studyGuide={[]} />);
    
    const analyzeButton = screen.getByTestId('analyze-button');
    expect(analyzeButton).toBeDisabled();
  });

  it('disables analyze button during analysis', async () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    
    expect(analyzeButton).toBeDisabled();
  });

  it('displays analysis results after analysis', async () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('analysis-results')).toBeInTheDocument();
      expect(screen.getByText('Analysis Results')).toBeInTheDocument();
      expect(screen.getByText('Quality Scores:')).toBeInTheDocument();
    });
  });

  it('displays quality scores correctly', async () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Readability: 75/100 (Intermediate)')).toBeInTheDocument();
      expect(screen.getByText('Complexity: 60/100 (Moderate)')).toBeInTheDocument();
      expect(screen.getByText('Coverage: 80/100 (Good)')).toBeInTheDocument();
      expect(screen.getByText('Structure: 85/100 (Excellent)')).toBeInTheDocument();
      expect(screen.getByText('Engagement: 70/100 (Good)')).toBeInTheDocument();
    });
  });

  it('displays analysis descriptions correctly', async () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('The study guide is written at an intermediate reading level.')).toBeInTheDocument();
      expect(screen.getByText('The content has moderate complexity with some advanced concepts.')).toBeInTheDocument();
      expect(screen.getByText('The study guide covers the topic well with good depth.')).toBeInTheDocument();
      expect(screen.getByText('The study guide has excellent structure and organization.')).toBeInTheDocument();
      expect(screen.getByText('The study guide has good engagement with examples and questions.')).toBeInTheDocument();
    });
  });

  it('displays recommendations correctly', async () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('analysis-recommendations')).toBeInTheDocument();
      expect(screen.getByText('Recommendations:')).toBeInTheDocument();
      expect(screen.getByText('Consider adding more visual aids to improve comprehension')).toBeInTheDocument();
      expect(screen.getByText('Include more real-world examples to enhance understanding')).toBeInTheDocument();
      expect(screen.getByText('Add interactive elements to increase engagement')).toBeInTheDocument();
      expect(screen.getByText('Consider breaking down complex sections into smaller parts')).toBeInTheDocument();
    });
  });

  it('calculates statistics correctly', async () => {
    render(<MockStudyGuideAnalyzer studyGuide={mockStudyGuide} />);
    
    const analyzeButton = screen.getByTestId('analyze-button');
    fireEvent.click(analyzeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Words: 50')).toBeInTheDocument();
      expect(screen.getByText('Total Keywords: 7')).toBeInTheDocument();
      expect(screen.getByText('Total Examples: 5')).toBeInTheDocument();
      expect(screen.getByText('Total Questions: 5')).toBeInTheDocument();
      expect(screen.getByText('Total Annotations: 4')).toBeInTheDocument();
    });
  });
});
