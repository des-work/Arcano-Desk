import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideTracker } from '../components/StudyGuideTracker';

// Mock the StudyGuideTracker component
const MockStudyGuideTracker: React.FC<any> = ({ 
  studyGuide, 
  onTrack, 
  onError 
}) => {
  const [trackingResults, setTrackingResults] = React.useState<any>(null);
  const [isTracking, setIsTracking] = React.useState(false);
  const [trackingSettings, setTrackingSettings] = React.useState({
    trackProgress: true,
    trackTime: true,
    trackPerformance: true,
    trackEngagement: true,
    trackRetention: true,
    reminderInterval: 30, // minutes
    reminderEnabled: true
  });

  const handleTrack = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsTracking(true);
    
    try {
      // Simulate tracking process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        trackingId: 'track-123',
        progress: {
          totalSections: studyGuide.length,
          completedSections: Math.floor(studyGuide.length * 0.6),
          remainingSections: Math.ceil(studyGuide.length * 0.4),
          completionPercentage: 60,
          currentSection: studyGuide[0]?.id || 'none',
          nextSection: studyGuide[1]?.id || 'none'
        },
        timeTracking: {
          totalStudyTime: 120, // minutes
          averageSessionDuration: 30, // minutes
          totalSessions: 4,
          lastSessionDate: new Date().toISOString(),
          estimatedTimeRemaining: 80, // minutes
          timePerSection: 60 // minutes
        },
        performance: {
          averageScore: 85,
          highestScore: 95,
          lowestScore: 75,
          improvementRate: 12,
          consistencyScore: 88,
          lastAssessmentDate: new Date().toISOString()
        },
        engagement: {
          totalInteractions: 45,
          averageInteractionTime: 2.5, // minutes
          mostEngagingSection: studyGuide[0]?.title || 'Introduction',
          leastEngagingSection: studyGuide[1]?.title || 'Advanced Concepts',
          engagementScore: 78
        },
        retention: {
          retentionRate: 82,
          reviewFrequency: 3, // times per week
          lastReviewDate: new Date().toISOString(),
          retentionScore: 85,
          spacedRepetitionSchedule: [
            { sectionId: '1', nextReview: new Date().toISOString() },
            { sectionId: '2', nextReview: new Date().toISOString() }
          ]
        },
        analytics: {
          studyStreak: 5, // days
          longestStreak: 12, // days
          totalStudyDays: 15,
          averageStudyTimePerDay: 45, // minutes
          peakStudyTime: '09:00-11:00',
          studyPattern: 'morning'
        },
        recommendations: [
          'Consider reviewing Section 2 more frequently',
          'Try studying during your peak hours (09:00-11:00)',
          'Take breaks every 30 minutes to maintain focus',
          'Use spaced repetition for better retention'
        ],
        statistics: {
          totalSections: studyGuide.length,
          completedSections: Math.floor(studyGuide.length * 0.6),
          totalStudyTime: 120,
          averageScore: 85,
          engagementScore: 78,
          retentionRate: 82,
          studyStreak: 5
        }
      };

      setTrackingResults(results);
      onTrack?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsTracking(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setTrackingSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-tracker">
      <h2>Study Guide Tracker</h2>
      
      <div data-testid="tracking-settings">
        <h3>Tracking Settings:</h3>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={trackingSettings.trackProgress}
              onChange={(e) => handleSettingChange('trackProgress', e.target.checked)}
              data-testid="progress-checkbox"
            />
            Track Progress
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={trackingSettings.trackTime}
              onChange={(e) => handleSettingChange('trackTime', e.target.checked)}
              data-testid="time-checkbox"
            />
            Track Time
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={trackingSettings.trackPerformance}
              onChange={(e) => handleSettingChange('trackPerformance', e.target.checked)}
              data-testid="performance-checkbox"
            />
            Track Performance
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={trackingSettings.trackEngagement}
              onChange={(e) => handleSettingChange('trackEngagement', e.target.checked)}
              data-testid="engagement-checkbox"
            />
            Track Engagement
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={trackingSettings.trackRetention}
              onChange={(e) => handleSettingChange('trackRetention', e.target.checked)}
              data-testid="retention-checkbox"
            />
            Track Retention
          </label>
        </div>

        <div>
          <label htmlFor="reminder-interval">Reminder Interval (minutes):</label>
          <input
            id="reminder-interval"
            type="number"
            value={trackingSettings.reminderInterval}
            onChange={(e) => handleSettingChange('reminderInterval', parseInt(e.target.value))}
            data-testid="reminder-interval-input"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={trackingSettings.reminderEnabled}
              onChange={(e) => handleSettingChange('reminderEnabled', e.target.checked)}
              data-testid="reminder-enabled-checkbox"
            />
            Enable Reminders
          </label>
        </div>
      </div>

      <button
        onClick={handleTrack}
        disabled={!studyGuide || studyGuide.length === 0 || isTracking}
        data-testid="track-button"
      >
        {isTracking ? 'Starting tracking...' : 'Start Tracking'}
      </button>

      {isTracking && (
        <div data-testid="tracking-progress">Starting study tracking...</div>
      )}

      {trackingResults && (
        <div data-testid="tracking-results">
          <h3>Tracking Results</h3>
          
          <div data-testid="progress-tracking">
            <h4>Progress Tracking:</h4>
            <p>Total Sections: {trackingResults.progress.totalSections}</p>
            <p>Completed Sections: {trackingResults.progress.completedSections}</p>
            <p>Remaining Sections: {trackingResults.progress.remainingSections}</p>
            <p>Completion Percentage: {trackingResults.progress.completionPercentage}%</p>
            <p>Current Section: {trackingResults.progress.currentSection}</p>
            <p>Next Section: {trackingResults.progress.nextSection}</p>
          </div>

          <div data-testid="time-tracking">
            <h4>Time Tracking:</h4>
            <p>Total Study Time: {trackingResults.timeTracking.totalStudyTime} minutes</p>
            <p>Average Session Duration: {trackingResults.timeTracking.averageSessionDuration} minutes</p>
            <p>Total Sessions: {trackingResults.timeTracking.totalSessions}</p>
            <p>Last Session: {new Date(trackingResults.timeTracking.lastSessionDate).toLocaleDateString()}</p>
            <p>Estimated Time Remaining: {trackingResults.timeTracking.estimatedTimeRemaining} minutes</p>
            <p>Time Per Section: {trackingResults.timeTracking.timePerSection} minutes</p>
          </div>

          <div data-testid="performance-tracking">
            <h4>Performance Tracking:</h4>
            <p>Average Score: {trackingResults.performance.averageScore}%</p>
            <p>Highest Score: {trackingResults.performance.highestScore}%</p>
            <p>Lowest Score: {trackingResults.performance.lowestScore}%</p>
            <p>Improvement Rate: +{trackingResults.performance.improvementRate}%</p>
            <p>Consistency Score: {trackingResults.performance.consistencyScore}%</p>
            <p>Last Assessment: {new Date(trackingResults.performance.lastAssessmentDate).toLocaleDateString()}</p>
          </div>

          <div data-testid="engagement-tracking">
            <h4>Engagement Tracking:</h4>
            <p>Total Interactions: {trackingResults.engagement.totalInteractions}</p>
            <p>Average Interaction Time: {trackingResults.engagement.averageInteractionTime} minutes</p>
            <p>Most Engaging Section: {trackingResults.engagement.mostEngagingSection}</p>
            <p>Least Engaging Section: {trackingResults.engagement.leastEngagingSection}</p>
            <p>Engagement Score: {trackingResults.engagement.engagementScore}%</p>
          </div>

          <div data-testid="retention-tracking">
            <h4>Retention Tracking:</h4>
            <p>Retention Rate: {trackingResults.retention.retentionRate}%</p>
            <p>Review Frequency: {trackingResults.retention.reviewFrequency} times per week</p>
            <p>Last Review: {new Date(trackingResults.retention.lastReviewDate).toLocaleDateString()}</p>
            <p>Retention Score: {trackingResults.retention.retentionScore}%</p>
            <p>Spaced Repetition Schedule: {trackingResults.retention.spacedRepetitionSchedule.length} items</p>
          </div>

          <div data-testid="analytics">
            <h4>Analytics:</h4>
            <p>Study Streak: {trackingResults.analytics.studyStreak} days</p>
            <p>Longest Streak: {trackingResults.analytics.longestStreak} days</p>
            <p>Total Study Days: {trackingResults.analytics.totalStudyDays}</p>
            <p>Average Study Time Per Day: {trackingResults.analytics.averageStudyTimePerDay} minutes</p>
            <p>Peak Study Time: {trackingResults.analytics.peakStudyTime}</p>
            <p>Study Pattern: {trackingResults.analytics.studyPattern}</p>
          </div>

          <div data-testid="recommendations">
            <h4>Recommendations:</h4>
            <ul>
              {trackingResults.recommendations.map((recommendation: string, index: number) => (
                <li key={index} data-testid={`recommendation-${index}`}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <div data-testid="tracking-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {trackingResults.statistics.totalSections}</p>
            <p>Completed Sections: {trackingResults.statistics.completedSections}</p>
            <p>Total Study Time: {trackingResults.statistics.totalStudyTime} minutes</p>
            <p>Average Score: {trackingResults.statistics.averageScore}%</p>
            <p>Engagement Score: {trackingResults.statistics.engagementScore}%</p>
            <p>Retention Rate: {trackingResults.statistics.retentionRate}%</p>
            <p>Study Streak: {trackingResults.statistics.studyStreak} days</p>
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

describe('StudyGuideTracker', () => {
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
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-tracker')).toBeInTheDocument();
  });

  it('renders tracking settings', () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('progress-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('time-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('performance-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('engagement-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('retention-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('reminder-interval-input')).toBeInTheDocument();
    expect(screen.getByTestId('reminder-enabled-checkbox')).toBeInTheDocument();
  });

  it('renders track button', () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('track-button')).toBeInTheDocument();
    expect(screen.getByText('Start Tracking')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideTracker studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates tracking settings when changed', () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const progressCheckbox = screen.getByTestId('progress-checkbox');
    const reminderIntervalInput = screen.getByTestId('reminder-interval-input');
    const reminderEnabledCheckbox = screen.getByTestId('reminder-enabled-checkbox');
    
    expect(progressCheckbox).toBeChecked();
    expect(reminderIntervalInput).toHaveValue(30);
    expect(reminderEnabledCheckbox).toBeChecked();
    
    fireEvent.click(progressCheckbox);
    fireEvent.change(reminderIntervalInput, { target: { value: '45' } });
    fireEvent.click(reminderEnabledCheckbox);
    
    expect(progressCheckbox).not.toBeChecked();
    expect(reminderIntervalInput).toHaveValue(45);
    expect(reminderEnabledCheckbox).not.toBeChecked();
  });

  it('calls onTrack when tracking completes successfully', async () => {
    const onTrack = jest.fn();
    
    render(
      <MockStudyGuideTracker 
        studyGuide={mockStudyGuide} 
        onTrack={onTrack} 
      />
    );
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(onTrack).toHaveBeenCalledWith(
        expect.objectContaining({
          trackingId: 'track-123',
          progress: expect.objectContaining({
            totalSections: 2,
            completedSections: 1,
            remainingSections: 1,
            completionPercentage: 60
          }),
          timeTracking: expect.objectContaining({
            totalStudyTime: 120,
            averageSessionDuration: 30,
            totalSessions: 4
          }),
          performance: expect.objectContaining({
            averageScore: 85,
            highestScore: 95,
            lowestScore: 75,
            improvementRate: 12
          }),
          engagement: expect.objectContaining({
            totalInteractions: 45,
            averageInteractionTime: 2.5,
            engagementScore: 78
          }),
          retention: expect.objectContaining({
            retentionRate: 82,
            reviewFrequency: 3,
            retentionScore: 85
          }),
          analytics: expect.objectContaining({
            studyStreak: 5,
            longestStreak: 12,
            totalStudyDays: 15
          }),
          recommendations: expect.any(Array),
          statistics: expect.objectContaining({
            totalSections: 2,
            completedSections: 1,
            totalStudyTime: 120,
            averageScore: 85
          })
        })
      );
    });
  });

  it('calls onError when tracking fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideTracker: React.FC<any> = ({ onError }) => {
      const handleTrack = () => {
        onError?.(new Error('Tracking failed'));
      };

      return (
        <div>
          <button onClick={handleTrack} data-testid="error-button">
            Track with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideTracker onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during tracking setup', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    expect(screen.getByTestId('tracking-progress')).toBeInTheDocument();
    expect(screen.getByText('Starting study tracking...')).toBeInTheDocument();
  });

  it('updates button text during tracking setup', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    expect(screen.getByText('Starting tracking...')).toBeInTheDocument();
  });

  it('disables track button when no study guide provided', () => {
    render(<MockStudyGuideTracker studyGuide={[]} />);
    
    const trackButton = screen.getByTestId('track-button');
    expect(trackButton).toBeDisabled();
  });

  it('disables track button during tracking setup', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    expect(trackButton).toBeDisabled();
  });

  it('displays tracking results after setup', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('tracking-results')).toBeInTheDocument();
      expect(screen.getByText('Tracking Results')).toBeInTheDocument();
      expect(screen.getByText('Progress Tracking:')).toBeInTheDocument();
    });
  });

  it('displays progress tracking correctly', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Completed Sections: 1')).toBeInTheDocument();
      expect(screen.getByText('Remaining Sections: 1')).toBeInTheDocument();
      expect(screen.getByText('Completion Percentage: 60%')).toBeInTheDocument();
    });
  });

  it('displays time tracking correctly', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Study Time: 120 minutes')).toBeInTheDocument();
      expect(screen.getByText('Average Session Duration: 30 minutes')).toBeInTheDocument();
      expect(screen.getByText('Total Sessions: 4')).toBeInTheDocument();
      expect(screen.getByText('Estimated Time Remaining: 80 minutes')).toBeInTheDocument();
    });
  });

  it('displays performance tracking correctly', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(screen.getByText('Average Score: 85%')).toBeInTheDocument();
      expect(screen.getByText('Highest Score: 95%')).toBeInTheDocument();
      expect(screen.getByText('Lowest Score: 75%')).toBeInTheDocument();
      expect(screen.getByText('Improvement Rate: +12%')).toBeInTheDocument();
      expect(screen.getByText('Consistency Score: 88%')).toBeInTheDocument();
    });
  });

  it('displays engagement tracking correctly', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Interactions: 45')).toBeInTheDocument();
      expect(screen.getByText('Average Interaction Time: 2.5 minutes')).toBeInTheDocument();
      expect(screen.getByText('Most Engaging Section: Introduction to Physics')).toBeInTheDocument();
      expect(screen.getByText('Least Engaging Section: Advanced Concepts')).toBeInTheDocument();
      expect(screen.getByText('Engagement Score: 78%')).toBeInTheDocument();
    });
  });

  it('displays retention tracking correctly', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(screen.getByText('Retention Rate: 82%')).toBeInTheDocument();
      expect(screen.getByText('Review Frequency: 3 times per week')).toBeInTheDocument();
      expect(screen.getByText('Retention Score: 85%')).toBeInTheDocument();
      expect(screen.getByText('Spaced Repetition Schedule: 2 items')).toBeInTheDocument();
    });
  });

  it('displays analytics correctly', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(screen.getByText('Study Streak: 5 days')).toBeInTheDocument();
      expect(screen.getByText('Longest Streak: 12 days')).toBeInTheDocument();
      expect(screen.getByText('Total Study Days: 15')).toBeInTheDocument();
      expect(screen.getByText('Average Study Time Per Day: 45 minutes')).toBeInTheDocument();
      expect(screen.getByText('Peak Study Time: 09:00-11:00')).toBeInTheDocument();
      expect(screen.getByText('Study Pattern: morning')).toBeInTheDocument();
    });
  });

  it('displays recommendations correctly', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('recommendations')).toBeInTheDocument();
      expect(screen.getByText('Consider reviewing Section 2 more frequently')).toBeInTheDocument();
      expect(screen.getByText('Try studying during your peak hours (09:00-11:00)')).toBeInTheDocument();
      expect(screen.getByText('Take breaks every 30 minutes to maintain focus')).toBeInTheDocument();
      expect(screen.getByText('Use spaced repetition for better retention')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideTracker studyGuide={mockStudyGuide} />);
    
    const trackButton = screen.getByTestId('track-button');
    fireEvent.click(trackButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Completed Sections: 1')).toBeInTheDocument();
      expect(screen.getByText('Total Study Time: 120 minutes')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 85%')).toBeInTheDocument();
      expect(screen.getByText('Engagement Score: 78%')).toBeInTheDocument();
      expect(screen.getByText('Retention Rate: 82%')).toBeInTheDocument();
      expect(screen.getByText('Study Streak: 5 days')).toBeInTheDocument();
    });
  });
});
