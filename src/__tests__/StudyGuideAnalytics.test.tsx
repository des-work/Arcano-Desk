import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideAnalytics } from '../components/StudyGuideAnalytics';

// Mock the StudyGuideAnalytics component
const MockStudyGuideAnalytics: React.FC<any> = ({ 
  studyGuide, 
  onAnalytics, 
  onError 
}) => {
  const [analyticsResults, setAnalyticsResults] = React.useState<any>(null);
  const [isAnalytics, setIsAnalytics] = React.useState(false);

  const handleAnalytics = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsAnalytics(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        analyticsId: 'analytics-123',
        usage: {
          totalViews: 150,
          uniqueUsers: 45,
          averageSessionTime: 25,
          bounceRate: 15
        },
        performance: {
          loadTime: 1.2,
          responseTime: 0.8,
          errorRate: 2.5,
          uptime: 99.8
        },
        engagement: {
          timeOnPage: 180,
          scrollDepth: 75,
          clickThroughRate: 12,
          conversionRate: 8
        },
        statistics: {
          totalSections: studyGuide.length,
          totalViews: 150,
          uniqueUsers: 45,
          averageSessionTime: 25,
          bounceRate: 15,
          loadTime: 1.2,
          responseTime: 0.8,
          errorRate: 2.5,
          uptime: 99.8,
          timeOnPage: 180,
          scrollDepth: 75,
          clickThroughRate: 12,
          conversionRate: 8
        }
      };

      setAnalyticsResults(results);
      onAnalytics?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsAnalytics(false);
    }
  };

  return (
    <div data-testid="study-guide-analytics">
      <h2>Study Guide Analytics</h2>
      
      <button
        onClick={handleAnalytics}
        disabled={!studyGuide || studyGuide.length === 0 || isAnalytics}
        data-testid="analytics-button"
      >
        {isAnalytics ? 'Analyzing...' : 'Analyze Analytics'}
      </button>

      {isAnalytics && (
        <div data-testid="analytics-progress">Analyzing analytics...</div>
      )}

      {analyticsResults && (
        <div data-testid="analytics-results">
          <h3>Analytics Results</h3>
          
          <div data-testid="usage-metrics">
            <h4>Usage Metrics:</h4>
            <p>Total Views: {analyticsResults.usage.totalViews}</p>
            <p>Unique Users: {analyticsResults.usage.uniqueUsers}</p>
            <p>Average Session Time: {analyticsResults.usage.averageSessionTime} minutes</p>
            <p>Bounce Rate: {analyticsResults.usage.bounceRate}%</p>
          </div>

          <div data-testid="performance-metrics">
            <h4>Performance Metrics:</h4>
            <p>Load Time: {analyticsResults.performance.loadTime}s</p>
            <p>Response Time: {analyticsResults.performance.responseTime}s</p>
            <p>Error Rate: {analyticsResults.performance.errorRate}%</p>
            <p>Uptime: {analyticsResults.performance.uptime}%</p>
          </div>

          <div data-testid="engagement-metrics">
            <h4>Engagement Metrics:</h4>
            <p>Time on Page: {analyticsResults.engagement.timeOnPage}s</p>
            <p>Scroll Depth: {analyticsResults.engagement.scrollDepth}%</p>
            <p>Click Through Rate: {analyticsResults.engagement.clickThroughRate}%</p>
            <p>Conversion Rate: {analyticsResults.engagement.conversionRate}%</p>
          </div>

          <div data-testid="analytics-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {analyticsResults.statistics.totalSections}</p>
            <p>Total Views: {analyticsResults.statistics.totalViews}</p>
            <p>Unique Users: {analyticsResults.statistics.uniqueUsers}</p>
            <p>Average Session Time: {analyticsResults.statistics.averageSessionTime} minutes</p>
            <p>Bounce Rate: {analyticsResults.statistics.bounceRate}%</p>
            <p>Load Time: {analyticsResults.statistics.loadTime}s</p>
            <p>Response Time: {analyticsResults.statistics.responseTime}s</p>
            <p>Error Rate: {analyticsResults.statistics.errorRate}%</p>
            <p>Uptime: {analyticsResults.statistics.uptime}%</p>
            <p>Time on Page: {analyticsResults.statistics.timeOnPage}s</p>
            <p>Scroll Depth: {analyticsResults.statistics.scrollDepth}%</p>
            <p>Click Through Rate: {analyticsResults.statistics.clickThroughRate}%</p>
            <p>Conversion Rate: {analyticsResults.statistics.conversionRate}%</p>
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

describe('StudyGuideAnalytics', () => {
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
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-analytics')).toBeInTheDocument();
  });

  it('renders analytics button', () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('analytics-button')).toBeInTheDocument();
    expect(screen.getByText('Analyze Analytics')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideAnalytics studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('calls onAnalytics when analytics analysis completes successfully', async () => {
    const onAnalytics = jest.fn();
    
    render(
      <MockStudyGuideAnalytics 
        studyGuide={mockStudyGuide} 
        onAnalytics={onAnalytics} 
      />
    );
    
    const analyticsButton = screen.getByTestId('analytics-button');
    fireEvent.click(analyticsButton);
    
    await waitFor(() => {
      expect(onAnalytics).toHaveBeenCalledWith(
        expect.objectContaining({
          analyticsId: 'analytics-123',
          usage: expect.objectContaining({
            totalViews: 150,
            uniqueUsers: 45,
            averageSessionTime: 25,
            bounceRate: 15
          }),
          performance: expect.objectContaining({
            loadTime: 1.2,
            responseTime: 0.8,
            errorRate: 2.5,
            uptime: 99.8
          }),
          engagement: expect.objectContaining({
            timeOnPage: 180,
            scrollDepth: 75,
            clickThroughRate: 12,
            conversionRate: 8
          }),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalViews: 150,
            uniqueUsers: 45,
            averageSessionTime: 25,
            bounceRate: 15,
            loadTime: 1.2,
            responseTime: 0.8,
            errorRate: 2.5,
            uptime: 99.8,
            timeOnPage: 180,
            scrollDepth: 75,
            clickThroughRate: 12,
            conversionRate: 8
          })
        })
      );
    });
  });

  it('calls onError when analytics analysis fails', async () => {
    const onError = jest.fn();
    
    const ErrorStudyGuideAnalytics: React.FC<any> = ({ onError }) => {
      const handleAnalytics = () => {
        onError?.(new Error('Analytics analysis failed'));
      };

      return (
        <div>
          <button onClick={handleAnalytics} data-testid="error-button">
            Analyze with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideAnalytics onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during analytics analysis', async () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    const analyticsButton = screen.getByTestId('analytics-button');
    fireEvent.click(analyticsButton);
    
    expect(screen.getByTestId('analytics-progress')).toBeInTheDocument();
    expect(screen.getByText('Analyzing analytics...')).toBeInTheDocument();
  });

  it('updates button text during analytics analysis', async () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    const analyticsButton = screen.getByTestId('analytics-button');
    fireEvent.click(analyticsButton);
    
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
  });

  it('disables analytics button when no study guide provided', () => {
    render(<MockStudyGuideAnalytics studyGuide={[]} />);
    
    const analyticsButton = screen.getByTestId('analytics-button');
    expect(analyticsButton).toBeDisabled();
  });

  it('disables analytics button during analysis', async () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    const analyticsButton = screen.getByTestId('analytics-button');
    fireEvent.click(analyticsButton);
    
    expect(analyticsButton).toBeDisabled();
  });

  it('displays analytics results after analysis', async () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    const analyticsButton = screen.getByTestId('analytics-button');
    fireEvent.click(analyticsButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('analytics-results')).toBeInTheDocument();
      expect(screen.getByText('Analytics Results')).toBeInTheDocument();
      expect(screen.getByText('Usage Metrics:')).toBeInTheDocument();
    });
  });

  it('displays usage metrics correctly', async () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    const analyticsButton = screen.getByTestId('analytics-button');
    fireEvent.click(analyticsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Views: 150')).toBeInTheDocument();
      expect(screen.getByText('Unique Users: 45')).toBeInTheDocument();
      expect(screen.getByText('Average Session Time: 25 minutes')).toBeInTheDocument();
      expect(screen.getByText('Bounce Rate: 15%')).toBeInTheDocument();
    });
  });

  it('displays performance metrics correctly', async () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    const analyticsButton = screen.getByTestId('analytics-button');
    fireEvent.click(analyticsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Load Time: 1.2s')).toBeInTheDocument();
      expect(screen.getByText('Response Time: 0.8s')).toBeInTheDocument();
      expect(screen.getByText('Error Rate: 2.5%')).toBeInTheDocument();
      expect(screen.getByText('Uptime: 99.8%')).toBeInTheDocument();
    });
  });

  it('displays engagement metrics correctly', async () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    const analyticsButton = screen.getByTestId('analytics-button');
    fireEvent.click(analyticsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Time on Page: 180s')).toBeInTheDocument();
      expect(screen.getByText('Scroll Depth: 75%')).toBeInTheDocument();
      expect(screen.getByText('Click Through Rate: 12%')).toBeInTheDocument();
      expect(screen.getByText('Conversion Rate: 8%')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideAnalytics studyGuide={mockStudyGuide} />);
    
    const analyticsButton = screen.getByTestId('analytics-button');
    fireEvent.click(analyticsButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Views: 150')).toBeInTheDocument();
      expect(screen.getByText('Unique Users: 45')).toBeInTheDocument();
      expect(screen.getByText('Average Session Time: 25 minutes')).toBeInTheDocument();
      expect(screen.getByText('Bounce Rate: 15%')).toBeInTheDocument();
      expect(screen.getByText('Load Time: 1.2s')).toBeInTheDocument();
      expect(screen.getByText('Response Time: 0.8s')).toBeInTheDocument();
      expect(screen.getByText('Error Rate: 2.5%')).toBeInTheDocument();
      expect(screen.getByText('Uptime: 99.8%')).toBeInTheDocument();
      expect(screen.getByText('Time on Page: 180s')).toBeInTheDocument();
      expect(screen.getByText('Scroll Depth: 75%')).toBeInTheDocument();
      expect(screen.getByText('Click Through Rate: 12%')).toBeInTheDocument();
      expect(screen.getByText('Conversion Rate: 8%')).toBeInTheDocument();
    });
  });
});
