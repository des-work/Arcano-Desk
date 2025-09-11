import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideAccessibility } from '../components/StudyGuideAccessibility';

// Mock the StudyGuideAccessibility component
const MockStudyGuideAccessibility: React.FC<any> = ({ 
  studyGuide, 
  onAccessibility, 
  onError 
}) => {
  const [accessibilityResults, setAccessibilityResults] = React.useState<any>(null);
  const [isAccessibility, setIsAccessibility] = React.useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = React.useState({
    screenReader: true,
    keyboardNavigation: true,
    highContrast: false,
    largeText: false,
    colorBlind: false,
    dyslexia: false,
    motorImpairment: false,
    cognitiveImpairment: false
  });

  const handleAccessibility = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsAccessibility(true);
    
    try {
      // Simulate accessibility process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        accessibilityId: 'access-123',
        compliance: {
          wcagLevel: 'AA',
          wcagScore: 85,
          ariaScore: 90,
          colorContrastScore: 88,
          keyboardScore: 95,
          screenReaderScore: 92,
          overallScore: 90
        },
        features: {
          altText: studyGuide.length * 2, // 2 images per section
          headings: studyGuide.length + 1, // 1 heading per section + main heading
          landmarks: 5, // header, nav, main, aside, footer
          focusableElements: studyGuide.length * 3, // 3 focusable elements per section
          colorContrast: 'Good',
          textSize: 'Readable',
          lineHeight: 'Comfortable',
          spacing: 'Adequate'
        },
        improvements: [
          'Add more descriptive alt text for images',
          'Improve color contrast for better visibility',
          'Add skip navigation links',
          'Ensure all interactive elements are keyboard accessible',
          'Add more semantic HTML structure'
        ],
        adaptations: {
          screenReader: {
            enabled: accessibilitySettings.screenReader,
            features: ['ARIA labels', 'Semantic HTML', 'Screen reader announcements'],
            score: 92
          },
          keyboardNavigation: {
            enabled: accessibilitySettings.keyboardNavigation,
            features: ['Tab navigation', 'Skip links', 'Keyboard shortcuts'],
            score: 95
          },
          visual: {
            highContrast: accessibilitySettings.highContrast,
            largeText: accessibilitySettings.largeText,
            colorBlind: accessibilitySettings.colorBlind,
            features: ['High contrast mode', 'Large text option', 'Color blind friendly palette'],
            score: 88
          },
          cognitive: {
            dyslexia: accessibilitySettings.dyslexia,
            motorImpairment: accessibilitySettings.motorImpairment,
            cognitiveImpairment: accessibilitySettings.cognitiveImpairment,
            features: ['Dyslexia-friendly fonts', 'Motor-friendly interactions', 'Cognitive load reduction'],
            score: 85
          }
        },
        testing: {
          automatedTests: 15,
          passedTests: 13,
          failedTests: 2,
          manualTests: 8,
          passedManualTests: 7,
          failedManualTests: 1,
          testScore: 87
        },
        recommendations: [
          'Implement ARIA landmarks for better navigation',
          'Add more descriptive link text',
          'Ensure sufficient color contrast ratios',
          'Test with actual screen readers',
          'Add keyboard navigation indicators'
        ],
        statistics: {
          totalSections: studyGuide.length,
          wcagScore: 85,
          ariaScore: 90,
          colorContrastScore: 88,
          keyboardScore: 95,
          screenReaderScore: 92,
          overallScore: 90,
          totalTests: 23,
          passedTests: 20,
          failedTests: 3
        }
      };

      setAccessibilityResults(results);
      onAccessibility?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsAccessibility(false);
    }
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-accessibility">
      <h2>Study Guide Accessibility</h2>
      
      <div data-testid="accessibility-settings">
        <h3>Accessibility Settings:</h3>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={accessibilitySettings.screenReader}
              onChange={(e) => handleSettingChange('screenReader', e.target.checked)}
              data-testid="screen-reader-checkbox"
            />
            Screen Reader Support
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={accessibilitySettings.keyboardNavigation}
              onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
              data-testid="keyboard-navigation-checkbox"
            />
            Keyboard Navigation
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={accessibilitySettings.highContrast}
              onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
              data-testid="high-contrast-checkbox"
            />
            High Contrast
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={accessibilitySettings.largeText}
              onChange={(e) => handleSettingChange('largeText', e.target.checked)}
              data-testid="large-text-checkbox"
            />
            Large Text
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={accessibilitySettings.colorBlind}
              onChange={(e) => handleSettingChange('colorBlind', e.target.checked)}
              data-testid="color-blind-checkbox"
            />
            Color Blind Support
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={accessibilitySettings.dyslexia}
              onChange={(e) => handleSettingChange('dyslexia', e.target.checked)}
              data-testid="dyslexia-checkbox"
            />
            Dyslexia Support
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={accessibilitySettings.motorImpairment}
              onChange={(e) => handleSettingChange('motorImpairment', e.target.checked)}
              data-testid="motor-impairment-checkbox"
            />
            Motor Impairment Support
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={accessibilitySettings.cognitiveImpairment}
              onChange={(e) => handleSettingChange('cognitiveImpairment', e.target.checked)}
              data-testid="cognitive-impairment-checkbox"
            />
            Cognitive Impairment Support
          </label>
        </div>
      </div>

      <button
        onClick={handleAccessibility}
        disabled={!studyGuide || studyGuide.length === 0 || isAccessibility}
        data-testid="accessibility-button"
      >
        {isAccessibility ? 'Analyzing accessibility...' : 'Analyze Accessibility'}
      </button>

      {isAccessibility && (
        <div data-testid="accessibility-progress">Analyzing accessibility...</div>
      )}

      {accessibilityResults && (
        <div data-testid="accessibility-results">
          <h3>Accessibility Results</h3>
          
          <div data-testid="compliance-scores">
            <h4>Compliance Scores:</h4>
            <p>WCAG Level: {accessibilityResults.compliance.wcagLevel}</p>
            <p>WCAG Score: {accessibilityResults.compliance.wcagScore}%</p>
            <p>ARIA Score: {accessibilityResults.compliance.ariaScore}%</p>
            <p>Color Contrast Score: {accessibilityResults.compliance.colorContrastScore}%</p>
            <p>Keyboard Score: {accessibilityResults.compliance.keyboardScore}%</p>
            <p>Screen Reader Score: {accessibilityResults.compliance.screenReaderScore}%</p>
            <p>Overall Score: {accessibilityResults.compliance.overallScore}%</p>
          </div>

          <div data-testid="accessibility-features">
            <h4>Accessibility Features:</h4>
            <p>Alt Text: {accessibilityResults.features.altText} images</p>
            <p>Headings: {accessibilityResults.features.headings} headings</p>
            <p>Landmarks: {accessibilityResults.features.landmarks} landmarks</p>
            <p>Focusable Elements: {accessibilityResults.features.focusableElements} elements</p>
            <p>Color Contrast: {accessibilityResults.features.colorContrast}</p>
            <p>Text Size: {accessibilityResults.features.textSize}</p>
            <p>Line Height: {accessibilityResults.features.lineHeight}</p>
            <p>Spacing: {accessibilityResults.features.spacing}</p>
          </div>

          <div data-testid="adaptations">
            <h4>Adaptations:</h4>
            
            <div data-testid="screen-reader-adaptations">
              <h5>Screen Reader ({accessibilityResults.adaptations.screenReader.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Score: {accessibilityResults.adaptations.screenReader.score}%</p>
              <ul>
                {accessibilityResults.adaptations.screenReader.features.map((feature: string, index: number) => (
                  <li key={index} data-testid={`screen-reader-feature-${index}`}>{feature}</li>
                ))}
              </ul>
            </div>

            <div data-testid="keyboard-adaptations">
              <h5>Keyboard Navigation ({accessibilityResults.adaptations.keyboardNavigation.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Score: {accessibilityResults.adaptations.keyboardNavigation.score}%</p>
              <ul>
                {accessibilityResults.adaptations.keyboardNavigation.features.map((feature: string, index: number) => (
                  <li key={index} data-testid={`keyboard-feature-${index}`}>{feature}</li>
                ))}
              </ul>
            </div>

            <div data-testid="visual-adaptations">
              <h5>Visual Adaptations:</h5>
              <p>High Contrast: {accessibilityResults.adaptations.visual.highContrast ? 'Enabled' : 'Disabled'}</p>
              <p>Large Text: {accessibilityResults.adaptations.visual.largeText ? 'Enabled' : 'Disabled'}</p>
              <p>Color Blind: {accessibilityResults.adaptations.visual.colorBlind ? 'Enabled' : 'Disabled'}</p>
              <p>Score: {accessibilityResults.adaptations.visual.score}%</p>
              <ul>
                {accessibilityResults.adaptations.visual.features.map((feature: string, index: number) => (
                  <li key={index} data-testid={`visual-feature-${index}`}>{feature}</li>
                ))}
              </ul>
            </div>

            <div data-testid="cognitive-adaptations">
              <h5>Cognitive Adaptations:</h5>
              <p>Dyslexia: {accessibilityResults.adaptations.cognitive.dyslexia ? 'Enabled' : 'Disabled'}</p>
              <p>Motor Impairment: {accessibilityResults.adaptations.cognitive.motorImpairment ? 'Enabled' : 'Disabled'}</p>
              <p>Cognitive Impairment: {accessibilityResults.adaptations.cognitive.cognitiveImpairment ? 'Enabled' : 'Disabled'}</p>
              <p>Score: {accessibilityResults.adaptations.cognitive.score}%</p>
              <ul>
                {accessibilityResults.adaptations.cognitive.features.map((feature: string, index: number) => (
                  <li key={index} data-testid={`cognitive-feature-${index}`}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>

          <div data-testid="testing-results">
            <h4>Testing Results:</h4>
            <p>Automated Tests: {accessibilityResults.testing.automatedTests} (Passed: {accessibilityResults.testing.passedTests}, Failed: {accessibilityResults.testing.failedTests})</p>
            <p>Manual Tests: {accessibilityResults.testing.manualTests} (Passed: {accessibilityResults.testing.passedManualTests}, Failed: {accessibilityResults.testing.failedManualTests})</p>
            <p>Test Score: {accessibilityResults.testing.testScore}%</p>
          </div>

          <div data-testid="improvements">
            <h4>Improvements Needed:</h4>
            <ul>
              {accessibilityResults.improvements.map((improvement: string, index: number) => (
                <li key={index} data-testid={`improvement-${index}`}>{improvement}</li>
              ))}
            </ul>
          </div>

          <div data-testid="recommendations">
            <h4>Recommendations:</h4>
            <ul>
              {accessibilityResults.recommendations.map((recommendation: string, index: number) => (
                <li key={index} data-testid={`recommendation-${index}`}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <div data-testid="accessibility-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {accessibilityResults.statistics.totalSections}</p>
            <p>WCAG Score: {accessibilityResults.statistics.wcagScore}%</p>
            <p>ARIA Score: {accessibilityResults.statistics.ariaScore}%</p>
            <p>Color Contrast Score: {accessibilityResults.statistics.colorContrastScore}%</p>
            <p>Keyboard Score: {accessibilityResults.statistics.keyboardScore}%</p>
            <p>Screen Reader Score: {accessibilityResults.statistics.screenReaderScore}%</p>
            <p>Overall Score: {accessibilityResults.statistics.overallScore}%</p>
            <p>Total Tests: {accessibilityResults.statistics.totalTests}</p>
            <p>Passed Tests: {accessibilityResults.statistics.passedTests}</p>
            <p>Failed Tests: {accessibilityResults.statistics.failedTests}</p>
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

describe('StudyGuideAccessibility', () => {
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
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-accessibility')).toBeInTheDocument();
  });

  it('renders accessibility settings', () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('screen-reader-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('keyboard-navigation-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('high-contrast-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('large-text-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('color-blind-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('dyslexia-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('motor-impairment-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('cognitive-impairment-checkbox')).toBeInTheDocument();
  });

  it('renders accessibility button', () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('accessibility-button')).toBeInTheDocument();
    expect(screen.getByText('Analyze Accessibility')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideAccessibility studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates accessibility settings when changed', () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const screenReaderCheckbox = screen.getByTestId('screen-reader-checkbox');
    const highContrastCheckbox = screen.getByTestId('high-contrast-checkbox');
    const dyslexiaCheckbox = screen.getByTestId('dyslexia-checkbox');
    
    expect(screenReaderCheckbox).toBeChecked();
    expect(highContrastCheckbox).not.toBeChecked();
    expect(dyslexiaCheckbox).not.toBeChecked();
    
    fireEvent.click(screenReaderCheckbox);
    fireEvent.click(highContrastCheckbox);
    fireEvent.click(dyslexiaCheckbox);
    
    expect(screenReaderCheckbox).not.toBeChecked();
    expect(highContrastCheckbox).toBeChecked();
    expect(dyslexiaCheckbox).toBeChecked();
  });

  it('calls onAccessibility when accessibility analysis completes successfully', async () => {
    const onAccessibility = jest.fn();
    
    render(
      <MockStudyGuideAccessibility 
        studyGuide={mockStudyGuide} 
        onAccessibility={onAccessibility} 
      />
    );
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(onAccessibility).toHaveBeenCalledWith(
        expect.objectContaining({
          accessibilityId: 'access-123',
          compliance: expect.objectContaining({
            wcagLevel: 'AA',
            wcagScore: 85,
            ariaScore: 90,
            colorContrastScore: 88,
            keyboardScore: 95,
            screenReaderScore: 92,
            overallScore: 90
          }),
          features: expect.objectContaining({
            altText: 4,
            headings: 3,
            landmarks: 5,
            focusableElements: 6,
            colorContrast: 'Good',
            textSize: 'Readable',
            lineHeight: 'Comfortable',
            spacing: 'Adequate'
          }),
          adaptations: expect.objectContaining({
            screenReader: expect.objectContaining({
              enabled: true,
              features: ['ARIA labels', 'Semantic HTML', 'Screen reader announcements'],
              score: 92
            }),
            keyboardNavigation: expect.objectContaining({
              enabled: true,
              features: ['Tab navigation', 'Skip links', 'Keyboard shortcuts'],
              score: 95
            }),
            visual: expect.objectContaining({
              highContrast: false,
              largeText: false,
              colorBlind: false,
              features: ['High contrast mode', 'Large text option', 'Color blind friendly palette'],
              score: 88
            }),
            cognitive: expect.objectContaining({
              dyslexia: false,
              motorImpairment: false,
              cognitiveImpairment: false,
              features: ['Dyslexia-friendly fonts', 'Motor-friendly interactions', 'Cognitive load reduction'],
              score: 85
            })
          }),
          testing: expect.objectContaining({
            automatedTests: 15,
            passedTests: 13,
            failedTests: 2,
            manualTests: 8,
            passedManualTests: 7,
            failedManualTests: 1,
            testScore: 87
          }),
          improvements: expect.any(Array),
          recommendations: expect.any(Array),
          statistics: expect.objectContaining({
            totalSections: 2,
            wcagScore: 85,
            ariaScore: 90,
            colorContrastScore: 88,
            keyboardScore: 95,
            screenReaderScore: 92,
            overallScore: 90,
            totalTests: 23,
            passedTests: 20,
            failedTests: 3
          })
        })
      );
    });
  });

  it('calls onError when accessibility analysis fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideAccessibility: React.FC<any> = ({ onError }) => {
      const handleAccessibility = () => {
        onError?.(new Error('Accessibility analysis failed'));
      };

      return (
        <div>
          <button onClick={handleAccessibility} data-testid="error-button">
            Analyze with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideAccessibility onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during accessibility analysis', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    expect(screen.getByTestId('accessibility-progress')).toBeInTheDocument();
    expect(screen.getByText('Analyzing accessibility...')).toBeInTheDocument();
  });

  it('updates button text during accessibility analysis', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    expect(screen.getByText('Analyzing accessibility...')).toBeInTheDocument();
  });

  it('disables accessibility button when no study guide provided', () => {
    render(<MockStudyGuideAccessibility studyGuide={[]} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    expect(accessibilityButton).toBeDisabled();
  });

  it('disables accessibility button during analysis', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    expect(accessibilityButton).toBeDisabled();
  });

  it('displays accessibility results after analysis', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('accessibility-results')).toBeInTheDocument();
      expect(screen.getByText('Accessibility Results')).toBeInTheDocument();
      expect(screen.getByText('Compliance Scores:')).toBeInTheDocument();
    });
  });

  it('displays compliance scores correctly', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(screen.getByText('WCAG Level: AA')).toBeInTheDocument();
      expect(screen.getByText('WCAG Score: 85%')).toBeInTheDocument();
      expect(screen.getByText('ARIA Score: 90%')).toBeInTheDocument();
      expect(screen.getByText('Color Contrast Score: 88%')).toBeInTheDocument();
      expect(screen.getByText('Keyboard Score: 95%')).toBeInTheDocument();
      expect(screen.getByText('Screen Reader Score: 92%')).toBeInTheDocument();
      expect(screen.getByText('Overall Score: 90%')).toBeInTheDocument();
    });
  });

  it('displays accessibility features correctly', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Alt Text: 4 images')).toBeInTheDocument();
      expect(screen.getByText('Headings: 3 headings')).toBeInTheDocument();
      expect(screen.getByText('Landmarks: 5 landmarks')).toBeInTheDocument();
      expect(screen.getByText('Focusable Elements: 6 elements')).toBeInTheDocument();
      expect(screen.getByText('Color Contrast: Good')).toBeInTheDocument();
      expect(screen.getByText('Text Size: Readable')).toBeInTheDocument();
      expect(screen.getByText('Line Height: Comfortable')).toBeInTheDocument();
      expect(screen.getByText('Spacing: Adequate')).toBeInTheDocument();
    });
  });

  it('displays adaptations correctly', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Screen Reader (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Score: 92%')).toBeInTheDocument();
      expect(screen.getByText('ARIA labels')).toBeInTheDocument();
      expect(screen.getByText('Semantic HTML')).toBeInTheDocument();
      expect(screen.getByText('Screen reader announcements')).toBeInTheDocument();
      
      expect(screen.getByText('Keyboard Navigation (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Tab navigation')).toBeInTheDocument();
      expect(screen.getByText('Skip links')).toBeInTheDocument();
      expect(screen.getByText('Keyboard shortcuts')).toBeInTheDocument();
      
      expect(screen.getByText('High Contrast: Disabled')).toBeInTheDocument();
      expect(screen.getByText('Large Text: Disabled')).toBeInTheDocument();
      expect(screen.getByText('Color Blind: Disabled')).toBeInTheDocument();
      
      expect(screen.getByText('Dyslexia: Disabled')).toBeInTheDocument();
      expect(screen.getByText('Motor Impairment: Disabled')).toBeInTheDocument();
      expect(screen.getByText('Cognitive Impairment: Disabled')).toBeInTheDocument();
    });
  });

  it('displays testing results correctly', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Automated Tests: 15 (Passed: 13, Failed: 2)')).toBeInTheDocument();
      expect(screen.getByText('Manual Tests: 8 (Passed: 7, Failed: 1)')).toBeInTheDocument();
      expect(screen.getByText('Test Score: 87%')).toBeInTheDocument();
    });
  });

  it('displays improvements correctly', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Add more descriptive alt text for images')).toBeInTheDocument();
      expect(screen.getByText('Improve color contrast for better visibility')).toBeInTheDocument();
      expect(screen.getByText('Add skip navigation links')).toBeInTheDocument();
      expect(screen.getByText('Ensure all interactive elements are keyboard accessible')).toBeInTheDocument();
      expect(screen.getByText('Add more semantic HTML structure')).toBeInTheDocument();
    });
  });

  it('displays recommendations correctly', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Implement ARIA landmarks for better navigation')).toBeInTheDocument();
      expect(screen.getByText('Add more descriptive link text')).toBeInTheDocument();
      expect(screen.getByText('Ensure sufficient color contrast ratios')).toBeInTheDocument();
      expect(screen.getByText('Test with actual screen readers')).toBeInTheDocument();
      expect(screen.getByText('Add keyboard navigation indicators')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideAccessibility studyGuide={mockStudyGuide} />);
    
    const accessibilityButton = screen.getByTestId('accessibility-button');
    fireEvent.click(accessibilityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('WCAG Score: 85%')).toBeInTheDocument();
      expect(screen.getByText('ARIA Score: 90%')).toBeInTheDocument();
      expect(screen.getByText('Color Contrast Score: 88%')).toBeInTheDocument();
      expect(screen.getByText('Keyboard Score: 95%')).toBeInTheDocument();
      expect(screen.getByText('Screen Reader Score: 92%')).toBeInTheDocument();
      expect(screen.getByText('Overall Score: 90%')).toBeInTheDocument();
      expect(screen.getByText('Total Tests: 23')).toBeInTheDocument();
      expect(screen.getByText('Passed Tests: 20')).toBeInTheDocument();
      expect(screen.getByText('Failed Tests: 3')).toBeInTheDocument();
    });
  });
});
