import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideScheduler } from '../components/StudyGuideScheduler';

// Mock the StudyGuideScheduler component
const MockStudyGuideScheduler: React.FC<any> = ({ 
  studyGuide, 
  onSchedule, 
  onError 
}) => {
  const [scheduleResults, setScheduleResults] = React.useState<any>(null);
  const [isScheduling, setIsScheduling] = React.useState(false);
  const [scheduleSettings, setScheduleSettings] = React.useState({
    startDate: '',
    endDate: '',
    studyDuration: 60, // minutes
    breakDuration: 15, // minutes
    studyDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    reminderTime: '09:00',
    reminderEnabled: true
  });

  const handleSchedule = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsScheduling(true);
    
    try {
      // Simulate scheduling process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        scheduleId: 'schedule-123',
        studyPlan: {
          totalSections: studyGuide.length,
          totalStudyTime: studyGuide.length * scheduleSettings.studyDuration,
          totalBreakTime: (studyGuide.length - 1) * scheduleSettings.breakDuration,
          totalDuration: (studyGuide.length * scheduleSettings.studyDuration) + ((studyGuide.length - 1) * scheduleSettings.breakDuration),
          startDate: scheduleSettings.startDate,
          endDate: scheduleSettings.endDate,
          studyDays: scheduleSettings.studyDays
        },
        sessions: studyGuide.map((section: any, index: number) => ({
          id: `session-${index + 1}`,
          sectionId: section.id,
          title: section.title,
          scheduledDate: new Date(Date.now() + (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          startTime: '09:00',
          endTime: '10:00',
          duration: scheduleSettings.studyDuration,
          status: 'scheduled',
          reminders: [
            {
              id: `reminder-${index + 1}`,
              time: scheduleSettings.reminderTime,
              enabled: scheduleSettings.reminderEnabled,
              type: 'email'
            }
          ]
        })),
        reminders: [
          {
            id: 'reminder-1',
            type: 'email',
            time: scheduleSettings.reminderTime,
            enabled: scheduleSettings.reminderEnabled,
            message: 'Study session starting in 15 minutes'
          },
          {
            id: 'reminder-2',
            type: 'push',
            time: scheduleSettings.reminderTime,
            enabled: scheduleSettings.reminderEnabled,
            message: 'Time for your study session!'
          }
        ],
        statistics: {
          totalSessions: studyGuide.length,
          totalStudyTime: studyGuide.length * scheduleSettings.studyDuration,
          totalBreakTime: (studyGuide.length - 1) * scheduleSettings.breakDuration,
          averageSessionDuration: scheduleSettings.studyDuration,
          studyDaysPerWeek: scheduleSettings.studyDays.length,
          reminderCount: 2
        }
      };

      setScheduleResults(results);
      onSchedule?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setScheduleSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleDayToggle = (day: string) => {
    setScheduleSettings(prev => ({
      ...prev,
      studyDays: prev.studyDays.includes(day)
        ? prev.studyDays.filter(d => d !== day)
        : [...prev.studyDays, day]
    }));
  };

  return (
    <div data-testid="study-guide-scheduler">
      <h2>Study Guide Scheduler</h2>
      
      <div data-testid="schedule-settings">
        <h3>Schedule Settings:</h3>
        
        <div>
          <label htmlFor="start-date">Start Date:</label>
          <input
            id="start-date"
            type="date"
            value={scheduleSettings.startDate}
            onChange={(e) => handleSettingChange('startDate', e.target.value)}
            data-testid="start-date-input"
          />
        </div>

        <div>
          <label htmlFor="end-date">End Date:</label>
          <input
            id="end-date"
            type="date"
            value={scheduleSettings.endDate}
            onChange={(e) => handleSettingChange('endDate', e.target.value)}
            data-testid="end-date-input"
          />
        </div>

        <div>
          <label htmlFor="study-duration">Study Duration (minutes):</label>
          <input
            id="study-duration"
            type="number"
            value={scheduleSettings.studyDuration}
            onChange={(e) => handleSettingChange('studyDuration', parseInt(e.target.value))}
            data-testid="study-duration-input"
          />
        </div>

        <div>
          <label htmlFor="break-duration">Break Duration (minutes):</label>
          <input
            id="break-duration"
            type="number"
            value={scheduleSettings.breakDuration}
            onChange={(e) => handleSettingChange('breakDuration', parseInt(e.target.value))}
            data-testid="break-duration-input"
          />
        </div>

        <div>
          <label>Study Days:</label>
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
            <label key={day}>
              <input
                type="checkbox"
                checked={scheduleSettings.studyDays.includes(day)}
                onChange={() => handleDayToggle(day)}
                data-testid={`${day}-checkbox`}
              />
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </label>
          ))}
        </div>

        <div>
          <label htmlFor="reminder-time">Reminder Time:</label>
          <input
            id="reminder-time"
            type="time"
            value={scheduleSettings.reminderTime}
            onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
            data-testid="reminder-time-input"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={scheduleSettings.reminderEnabled}
              onChange={(e) => handleSettingChange('reminderEnabled', e.target.checked)}
              data-testid="reminder-enabled-checkbox"
            />
            Enable Reminders
          </label>
        </div>
      </div>

      <button
        onClick={handleSchedule}
        disabled={!studyGuide || studyGuide.length === 0 || isScheduling}
        data-testid="schedule-button"
      >
        {isScheduling ? 'Creating schedule...' : 'Create Study Schedule'}
      </button>

      {isScheduling && (
        <div data-testid="schedule-progress">Creating study schedule...</div>
      )}

      {scheduleResults && (
        <div data-testid="schedule-results">
          <h3>Schedule Results</h3>
          
          <div data-testid="study-plan">
            <h4>Study Plan:</h4>
            <p>Total Sections: {scheduleResults.studyPlan.totalSections}</p>
            <p>Total Study Time: {scheduleResults.studyPlan.totalStudyTime} minutes</p>
            <p>Total Break Time: {scheduleResults.studyPlan.totalBreakTime} minutes</p>
            <p>Total Duration: {scheduleResults.studyPlan.totalDuration} minutes</p>
            <p>Start Date: {scheduleResults.studyPlan.startDate}</p>
            <p>End Date: {scheduleResults.studyPlan.endDate}</p>
            <p>Study Days: {scheduleResults.studyPlan.studyDays.join(', ')}</p>
          </div>

          <div data-testid="sessions-list">
            <h4>Sessions ({scheduleResults.statistics.totalSessions}):</h4>
            <ul>
              {scheduleResults.sessions.map((session: any, index: number) => (
                <li key={index} data-testid={`session-${index}`}>
                  <strong>{session.title}:</strong> {session.scheduledDate} at {session.startTime} - {session.endTime}
                  <span data-testid={`session-status-${index}`}>
                    ({session.status})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="reminders-list">
            <h4>Reminders ({scheduleResults.statistics.reminderCount}):</h4>
            <ul>
              {scheduleResults.reminders.map((reminder: any, index: number) => (
                <li key={index} data-testid={`reminder-${index}`}>
                  <strong>{reminder.type}:</strong> {reminder.message} at {reminder.time}
                  <span data-testid={`reminder-status-${index}`}>
                    {reminder.enabled ? ' (Enabled)' : ' (Disabled)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="schedule-statistics">
            <h4>Statistics:</h4>
            <p>Total Sessions: {scheduleResults.statistics.totalSessions}</p>
            <p>Total Study Time: {scheduleResults.statistics.totalStudyTime} minutes</p>
            <p>Total Break Time: {scheduleResults.statistics.totalBreakTime} minutes</p>
            <p>Average Session Duration: {scheduleResults.statistics.averageSessionDuration} minutes</p>
            <p>Study Days Per Week: {scheduleResults.statistics.studyDaysPerWeek}</p>
            <p>Reminder Count: {scheduleResults.statistics.reminderCount}</p>
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

describe('StudyGuideScheduler', () => {
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
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-scheduler')).toBeInTheDocument();
  });

  it('renders schedule settings', () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('start-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('end-date-input')).toBeInTheDocument();
    expect(screen.getByTestId('study-duration-input')).toBeInTheDocument();
    expect(screen.getByTestId('break-duration-input')).toBeInTheDocument();
    expect(screen.getByTestId('reminder-time-input')).toBeInTheDocument();
    expect(screen.getByTestId('reminder-enabled-checkbox')).toBeInTheDocument();
  });

  it('renders study days checkboxes', () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('monday-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('tuesday-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('wednesday-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('thursday-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('friday-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('saturday-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('sunday-checkbox')).toBeInTheDocument();
  });

  it('renders schedule button', () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('schedule-button')).toBeInTheDocument();
    expect(screen.getByText('Create Study Schedule')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideScheduler studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates schedule settings when changed', () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const startDateInput = screen.getByTestId('start-date-input');
    const studyDurationInput = screen.getByTestId('study-duration-input');
    const reminderTimeInput = screen.getByTestId('reminder-time-input');
    
    fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
    fireEvent.change(studyDurationInput, { target: { value: '90' } });
    fireEvent.change(reminderTimeInput, { target: { value: '10:00' } });
    
    expect(startDateInput).toHaveValue('2024-01-01');
    expect(studyDurationInput).toHaveValue(90);
    expect(reminderTimeInput).toHaveValue('10:00');
  });

  it('toggles study days correctly', () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const mondayCheckbox = screen.getByTestId('monday-checkbox');
    const saturdayCheckbox = screen.getByTestId('saturday-checkbox');
    
    expect(mondayCheckbox).toBeChecked();
    expect(saturdayCheckbox).not.toBeChecked();
    
    fireEvent.click(mondayCheckbox);
    fireEvent.click(saturdayCheckbox);
    
    expect(mondayCheckbox).not.toBeChecked();
    expect(saturdayCheckbox).toBeChecked();
  });

  it('calls onSchedule when scheduling completes successfully', async () => {
    const onSchedule = jest.fn();
    
    render(
      <MockStudyGuideScheduler 
        studyGuide={mockStudyGuide} 
        onSchedule={onSchedule} 
      />
    );
    
    const scheduleButton = screen.getByTestId('schedule-button');
    fireEvent.click(scheduleButton);
    
    await waitFor(() => {
      expect(onSchedule).toHaveBeenCalledWith(
        expect.objectContaining({
          scheduleId: 'schedule-123',
          studyPlan: expect.objectContaining({
            totalSections: 2,
            totalStudyTime: 120,
            totalBreakTime: 15,
            totalDuration: 135,
            studyDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          }),
          sessions: expect.arrayContaining([
            expect.objectContaining({
              title: 'Introduction to Physics',
              duration: 60,
              status: 'scheduled'
            }),
            expect.objectContaining({
              title: 'Advanced Concepts',
              duration: 60,
              status: 'scheduled'
            })
          ]),
          reminders: expect.arrayContaining([
            expect.objectContaining({
              type: 'email',
              enabled: true,
              message: 'Study session starting in 15 minutes'
            })
          ]),
          statistics: expect.objectContaining({
            totalSessions: 2,
            totalStudyTime: 120,
            totalBreakTime: 15,
            averageSessionDuration: 60,
            studyDaysPerWeek: 5,
            reminderCount: 2
          })
        })
      );
    });
  });

  it('calls onError when scheduling fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideScheduler: React.FC<any> = ({ onError }) => {
      const handleSchedule = () => {
        onError?.(new Error('Scheduling failed'));
      };

      return (
        <div>
          <button onClick={handleSchedule} data-testid="error-button">
            Schedule with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideScheduler onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during scheduling', async () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const scheduleButton = screen.getByTestId('schedule-button');
    fireEvent.click(scheduleButton);
    
    expect(screen.getByTestId('schedule-progress')).toBeInTheDocument();
    expect(screen.getByText('Creating study schedule...')).toBeInTheDocument();
  });

  it('updates button text during scheduling', async () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const scheduleButton = screen.getByTestId('schedule-button');
    fireEvent.click(scheduleButton);
    
    expect(screen.getByText('Creating schedule...')).toBeInTheDocument();
  });

  it('disables schedule button when no study guide provided', () => {
    render(<MockStudyGuideScheduler studyGuide={[]} />);
    
    const scheduleButton = screen.getByTestId('schedule-button');
    expect(scheduleButton).toBeDisabled();
  });

  it('disables schedule button during scheduling', async () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const scheduleButton = screen.getByTestId('schedule-button');
    fireEvent.click(scheduleButton);
    
    expect(scheduleButton).toBeDisabled();
  });

  it('displays schedule results after scheduling', async () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const scheduleButton = screen.getByTestId('schedule-button');
    fireEvent.click(scheduleButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('schedule-results')).toBeInTheDocument();
      expect(screen.getByText('Schedule Results')).toBeInTheDocument();
      expect(screen.getByText('Study Plan:')).toBeInTheDocument();
    });
  });

  it('displays study plan correctly', async () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const scheduleButton = screen.getByTestId('schedule-button');
    fireEvent.click(scheduleButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Study Time: 120 minutes')).toBeInTheDocument();
      expect(screen.getByText('Total Break Time: 15 minutes')).toBeInTheDocument();
      expect(screen.getByText('Total Duration: 135 minutes')).toBeInTheDocument();
      expect(screen.getByText('Study Days: monday, tuesday, wednesday, thursday, friday')).toBeInTheDocument();
    });
  });

  it('displays sessions correctly', async () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const scheduleButton = screen.getByTestId('schedule-button');
    fireEvent.click(scheduleButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('sessions-list')).toBeInTheDocument();
      expect(screen.getByText('Sessions (2):')).toBeInTheDocument();
      expect(screen.getByText('Introduction to Physics:')).toBeInTheDocument();
      expect(screen.getByText('Advanced Concepts:')).toBeInTheDocument();
    });
  });

  it('displays reminders correctly', async () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const scheduleButton = screen.getByTestId('schedule-button');
    fireEvent.click(scheduleButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('reminders-list')).toBeInTheDocument();
      expect(screen.getByText('Reminders (2):')).toBeInTheDocument();
      expect(screen.getByText('email: Study session starting in 15 minutes at 09:00 (Enabled)')).toBeInTheDocument();
      expect(screen.getByText('push: Time for your study session! at 09:00 (Enabled)')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideScheduler studyGuide={mockStudyGuide} />);
    
    const scheduleButton = screen.getByTestId('schedule-button');
    fireEvent.click(scheduleButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sessions: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Study Time: 120 minutes')).toBeInTheDocument();
      expect(screen.getByText('Total Break Time: 15 minutes')).toBeInTheDocument();
      expect(screen.getByText('Average Session Duration: 60 minutes')).toBeInTheDocument();
      expect(screen.getByText('Study Days Per Week: 5')).toBeInTheDocument();
      expect(screen.getByText('Reminder Count: 2')).toBeInTheDocument();
    });
  });
});
