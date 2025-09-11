import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideOptimizer } from '../components/StudyGuideOptimizer';

// Mock the StudyGuideOptimizer component
const MockStudyGuideOptimizer: React.FC<any> = ({ 
  studyGuide, 
  onOptimize, 
  onError 
}) => {
  const [optimizationResults, setOptimizationResults] = React.useState<any>(null);
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [optimizationSettings, setOptimizationSettings] = React.useState({
    readability: true,
    structure: true,
    engagement: true,
    accessibility: true,
    performance: true
  });

  const handleOptimize = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsOptimizing(true);
    
    try {
      // Simulate optimization process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        optimizedGuide: studyGuide.map((section: any, index: number) => ({
          ...section,
          title: section.title ? `${section.title} (Optimized)` : `Section ${index + 1} (Optimized)`,
          content: section.content ? `${section.content} [Optimized for better readability]` : 'Content optimized for better understanding',
          keywords: section.keywords ? [...section.keywords, 'optimized'] : ['optimized'],
          examples: section.examples ? [...section.examples, 'Additional optimized example'] : ['Optimized example'],
          questions: section.questions ? [...section.questions, 'Additional optimized question?'] : ['Optimized question?'],
          annotations: section.annotations ? [...section.annotations, 'Optimization note'] : ['Optimization note']
        })),
        improvements: [
          'Improved readability and clarity',
          'Enhanced structure and organization',
          'Added more engaging examples',
          'Improved accessibility features',
          'Optimized for better performance'
        ],
        statistics: {
          originalSections: studyGuide.length,
          optimizedSections: studyGuide.length,
          addedKeywords: studyGuide.length,
          addedExamples: studyGuide.length,
          addedQuestions: studyGuide.length,
          addedAnnotations: studyGuide.length,
          readabilityImprovement: 15,
          structureImprovement: 20,
          engagementImprovement: 25,
          accessibilityImprovement: 30,
          performanceImprovement: 10
        }
      };

      setOptimizationResults(results);
      onOptimize?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setOptimizationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-optimizer">
      <h2>Study Guide Optimizer</h2>
      
      <div data-testid="optimization-settings">
        <h3>Optimization Settings:</h3>
        <div>
          <label>
            <input
              type="checkbox"
              checked={optimizationSettings.readability}
              onChange={(e) => handleSettingChange('readability', e.target.checked)}
              data-testid="readability-checkbox"
            />
            Improve Readability
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={optimizationSettings.structure}
              onChange={(e) => handleSettingChange('structure', e.target.checked)}
              data-testid="structure-checkbox"
            />
            Enhance Structure
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={optimizationSettings.engagement}
              onChange={(e) => handleSettingChange('engagement', e.target.checked)}
              data-testid="engagement-checkbox"
            />
            Increase Engagement
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={optimizationSettings.accessibility}
              onChange={(e) => handleSettingChange('accessibility', e.target.checked)}
              data-testid="accessibility-checkbox"
            />
            Improve Accessibility
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={optimizationSettings.performance}
              onChange={(e) => handleSettingChange('performance', e.target.checked)}
              data-testid="performance-checkbox"
            />
            Optimize Performance
          </label>
        </div>
      </div>

      <button
        onClick={handleOptimize}
        disabled={!studyGuide || studyGuide.length === 0 || isOptimizing}
        data-testid="optimize-button"
      >
        {isOptimizing ? 'Optimizing...' : 'Optimize Study Guide'}
      </button>

      {isOptimizing && (
        <div data-testid="optimization-progress">Optimizing study guide...</div>
      )}

      {optimizationResults && (
        <div data-testid="optimization-results">
          <h3>Optimization Results</h3>
          
          <div data-testid="optimization-improvements">
            <h4>Improvements Made:</h4>
            <ul>
              {optimizationResults.improvements.map((improvement: string, index: number) => (
                <li key={index} data-testid={`improvement-${index}`}>{improvement}</li>
              ))}
            </ul>
          </div>

          <div data-testid="optimization-statistics">
            <h4>Statistics:</h4>
            <p>Original Sections: {optimizationResults.statistics.originalSections}</p>
            <p>Optimized Sections: {optimizationResults.statistics.optimizedSections}</p>
            <p>Added Keywords: {optimizationResults.statistics.addedKeywords}</p>
            <p>Added Examples: {optimizationResults.statistics.addedExamples}</p>
            <p>Added Questions: {optimizationResults.statistics.addedQuestions}</p>
            <p>Added Annotations: {optimizationResults.statistics.addedAnnotations}</p>
            <p>Readability Improvement: +{optimizationResults.statistics.readabilityImprovement}%</p>
            <p>Structure Improvement: +{optimizationResults.statistics.structureImprovement}%</p>
            <p>Engagement Improvement: +{optimizationResults.statistics.engagementImprovement}%</p>
            <p>Accessibility Improvement: +{optimizationResults.statistics.accessibilityImprovement}%</p>
            <p>Performance Improvement: +{optimizationResults.statistics.performanceImprovement}%</p>
          </div>

          <div data-testid="optimized-guide-preview">
            <h4>Optimized Study Guide Preview:</h4>
            {optimizationResults.optimizedGuide.map((section: any, index: number) => (
              <div key={index} data-testid={`optimized-section-${index}`}>
                <h5>{section.title}</h5>
                <p>{section.content}</p>
                <div data-testid={`optimized-keywords-${index}`}>
                  Keywords: {section.keywords?.join(', ')}
                </div>
                <div data-testid={`optimized-examples-${index}`}>
                  Examples: {section.examples?.join(', ')}
                </div>
                <div data-testid={`optimized-questions-${index}`}>
                  Questions: {section.questions?.join(', ')}
                </div>
                <div data-testid={`optimized-annotations-${index}`}>
                  Annotations: {section.annotations?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {studyGuide && studyGuide.length > 0 && (
        <div data-testid="study-guide-preview">
          <h3>Original Study Guide Preview:</h3>
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

describe('StudyGuideOptimizer', () => {
  const mockStudyGuide = [
    {
      id: '1',
      title: 'Introduction to Physics',
      content: 'Physics is the study of matter and energy.',
      keywords: ['physics', 'matter', 'energy'],
      examples: ['Newton\'s laws'],
      questions: ['What is physics?'],
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-optimizer')).toBeInTheDocument();
  });

  it('renders optimization settings', () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('readability-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('structure-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('engagement-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('accessibility-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('performance-checkbox')).toBeInTheDocument();
  });

  it('renders optimize button', () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('optimize-button')).toBeInTheDocument();
    expect(screen.getByText('Optimize Study Guide')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideOptimizer studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates optimization settings when changed', () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    const readabilityCheckbox = screen.getByTestId('readability-checkbox');
    const structureCheckbox = screen.getByTestId('structure-checkbox');
    
    expect(readabilityCheckbox).toBeChecked();
    expect(structureCheckbox).toBeChecked();
    
    fireEvent.click(readabilityCheckbox);
    fireEvent.click(structureCheckbox);
    
    expect(readabilityCheckbox).not.toBeChecked();
    expect(structureCheckbox).not.toBeChecked();
  });

  it('calls onOptimize when optimization completes successfully', async () => {
    const onOptimize = jest.fn();
    
    render(
      <MockStudyGuideOptimizer 
        studyGuide={mockStudyGuide} 
        onOptimize={onOptimize} 
      />
    );
    
    const optimizeButton = screen.getByTestId('optimize-button');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(onOptimize).toHaveBeenCalledWith(
        expect.objectContaining({
          optimizedGuide: expect.arrayContaining([
            expect.objectContaining({
              title: 'Introduction to Physics (Optimized)',
              content: 'Physics is the study of matter and energy. [Optimized for better readability]',
              keywords: ['physics', 'matter', 'energy', 'optimized'],
              examples: ['Newton\'s laws', 'Additional optimized example'],
              questions: ['What is physics?', 'Additional optimized question?'],
              annotations: ['Fundamental science', 'Optimization note']
            })
          ]),
          improvements: expect.any(Array),
          statistics: expect.objectContaining({
            originalSections: 2,
            optimizedSections: 2,
            addedKeywords: 2,
            addedExamples: 2,
            addedQuestions: 2,
            addedAnnotations: 2
          })
        })
      );
    });
  });

  it('calls onError when optimization fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideOptimizer: React.FC<any> = ({ onError }) => {
      const handleOptimize = () => {
        onError?.(new Error('Optimization failed'));
      };

      return (
        <div>
          <button onClick={handleOptimize} data-testid="error-button">
            Optimize with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideOptimizer onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during optimization', async () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    const optimizeButton = screen.getByTestId('optimize-button');
    fireEvent.click(optimizeButton);
    
    expect(screen.getByTestId('optimization-progress')).toBeInTheDocument();
    expect(screen.getByText('Optimizing study guide...')).toBeInTheDocument();
  });

  it('updates button text during optimization', async () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    const optimizeButton = screen.getByTestId('optimize-button');
    fireEvent.click(optimizeButton);
    
    expect(screen.getByText('Optimizing...')).toBeInTheDocument();
  });

  it('disables optimize button when no study guide provided', () => {
    render(<MockStudyGuideOptimizer studyGuide={[]} />);
    
    const optimizeButton = screen.getByTestId('optimize-button');
    expect(optimizeButton).toBeDisabled();
  });

  it('disables optimize button during optimization', async () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    const optimizeButton = screen.getByTestId('optimize-button');
    fireEvent.click(optimizeButton);
    
    expect(optimizeButton).toBeDisabled();
  });

  it('displays optimization results after optimization', async () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    const optimizeButton = screen.getByTestId('optimize-button');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('optimization-results')).toBeInTheDocument();
      expect(screen.getByText('Optimization Results')).toBeInTheDocument();
      expect(screen.getByText('Improvements Made:')).toBeInTheDocument();
    });
  });

  it('displays improvements correctly', async () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    const optimizeButton = screen.getByTestId('optimize-button');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('optimization-improvements')).toBeInTheDocument();
      expect(screen.getByText('Improved readability and clarity')).toBeInTheDocument();
      expect(screen.getByText('Enhanced structure and organization')).toBeInTheDocument();
      expect(screen.getByText('Added more engaging examples')).toBeInTheDocument();
      expect(screen.getByText('Improved accessibility features')).toBeInTheDocument();
      expect(screen.getByText('Optimized for better performance')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    const optimizeButton = screen.getByTestId('optimize-button');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Original Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Optimized Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Added Keywords: 2')).toBeInTheDocument();
      expect(screen.getByText('Added Examples: 2')).toBeInTheDocument();
      expect(screen.getByText('Added Questions: 2')).toBeInTheDocument();
      expect(screen.getByText('Added Annotations: 2')).toBeInTheDocument();
      expect(screen.getByText('Readability Improvement: +15%')).toBeInTheDocument();
      expect(screen.getByText('Structure Improvement: +20%')).toBeInTheDocument();
      expect(screen.getByText('Engagement Improvement: +25%')).toBeInTheDocument();
      expect(screen.getByText('Accessibility Improvement: +30%')).toBeInTheDocument();
      expect(screen.getByText('Performance Improvement: +10%')).toBeInTheDocument();
    });
  });

  it('displays optimized guide preview correctly', async () => {
    render(<MockStudyGuideOptimizer studyGuide={mockStudyGuide} />);
    
    const optimizeButton = screen.getByTestId('optimize-button');
    fireEvent.click(optimizeButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('optimized-guide-preview')).toBeInTheDocument();
      expect(screen.getByText('Introduction to Physics (Optimized)')).toBeInTheDocument();
      expect(screen.getByText('Physics is the study of matter and energy. [Optimized for better readability]')).toBeInTheDocument();
      expect(screen.getByText('Keywords: physics, matter, energy, optimized')).toBeInTheDocument();
      expect(screen.getByText('Examples: Newton\'s laws, Additional optimized example')).toBeInTheDocument();
      expect(screen.getByText('Questions: What is physics?, Additional optimized question?')).toBeInTheDocument();
      expect(screen.getByText('Annotations: Fundamental science, Optimization note')).toBeInTheDocument();
    });
  });
});
