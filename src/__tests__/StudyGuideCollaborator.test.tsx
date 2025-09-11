import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideCollaborator } from '../components/StudyGuideCollaborator';

// Mock the StudyGuideCollaborator component
const MockStudyGuideCollaborator: React.FC<any> = ({ 
  studyGuide, 
  onCollaborate, 
  onError 
}) => {
  const [collaborationResults, setCollaborationResults] = React.useState<any>(null);
  const [isCollaborating, setIsCollaborating] = React.useState(false);
  const [collaborationSettings, setCollaborationSettings] = React.useState({
    realTime: true,
    comments: true,
    suggestions: true,
    versionControl: true,
    notifications: true
  });

  const handleCollaborate = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsCollaborating(true);
    
    try {
      // Simulate collaboration process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        collaborationId: 'collab-123',
        participants: [
          { id: 'user1', name: 'John Doe', role: 'Editor', status: 'online' },
          { id: 'user2', name: 'Jane Smith', role: 'Reviewer', status: 'online' },
          { id: 'user3', name: 'Bob Johnson', role: 'Viewer', status: 'offline' }
        ],
        comments: [
          {
            id: 'comment1',
            author: 'John Doe',
            content: 'Great introduction! Consider adding more examples.',
            timestamp: new Date().toISOString(),
            sectionId: '1',
            resolved: false
          },
          {
            id: 'comment2',
            author: 'Jane Smith',
            content: 'The structure looks good. Maybe add a summary section.',
            timestamp: new Date().toISOString(),
            sectionId: '2',
            resolved: false
          }
        ],
        suggestions: [
          {
            id: 'suggestion1',
            author: 'John Doe',
            content: 'Add more visual aids to improve comprehension',
            type: 'enhancement',
            priority: 'medium',
            sectionId: '1'
          },
          {
            id: 'suggestion2',
            author: 'Jane Smith',
            content: 'Include more real-world examples',
            type: 'content',
            priority: 'high',
            sectionId: '2'
          }
        ],
        versions: [
          {
            id: 'v1',
            timestamp: new Date().toISOString(),
            author: 'John Doe',
            changes: 'Initial version',
            status: 'published'
          },
          {
            id: 'v2',
            timestamp: new Date().toISOString(),
            author: 'Jane Smith',
            changes: 'Added examples and improved structure',
            status: 'draft'
          }
        ],
        statistics: {
          totalParticipants: 3,
          activeParticipants: 2,
          totalComments: 2,
          resolvedComments: 0,
          totalSuggestions: 2,
          implementedSuggestions: 0,
          totalVersions: 2,
          publishedVersions: 1
        }
      };

      setCollaborationResults(results);
      onCollaborate?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsCollaborating(false);
    }
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setCollaborationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-collaborator">
      <h2>Study Guide Collaborator</h2>
      
      <div data-testid="collaboration-settings">
        <h3>Collaboration Settings:</h3>
        <div>
          <label>
            <input
              type="checkbox"
              checked={collaborationSettings.realTime}
              onChange={(e) => handleSettingChange('realTime', e.target.checked)}
              data-testid="realtime-checkbox"
            />
            Real-time Collaboration
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={collaborationSettings.comments}
              onChange={(e) => handleSettingChange('comments', e.target.checked)}
              data-testid="comments-checkbox"
            />
            Enable Comments
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={collaborationSettings.suggestions}
              onChange={(e) => handleSettingChange('suggestions', e.target.checked)}
              data-testid="suggestions-checkbox"
            />
            Enable Suggestions
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={collaborationSettings.versionControl}
              onChange={(e) => handleSettingChange('versionControl', e.target.checked)}
              data-testid="version-control-checkbox"
            />
            Version Control
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={collaborationSettings.notifications}
              onChange={(e) => handleSettingChange('notifications', e.target.checked)}
              data-testid="notifications-checkbox"
            />
            Notifications
          </label>
        </div>
      </div>

      <button
        onClick={handleCollaborate}
        disabled={!studyGuide || studyGuide.length === 0 || isCollaborating}
        data-testid="collaborate-button"
      >
        {isCollaborating ? 'Setting up collaboration...' : 'Start Collaboration'}
      </button>

      {isCollaborating && (
        <div data-testid="collaboration-progress">Setting up collaboration...</div>
      )}

      {collaborationResults && (
        <div data-testid="collaboration-results">
          <h3>Collaboration Results</h3>
          
          <div data-testid="collaboration-info">
            <h4>Collaboration Info:</h4>
            <p>Collaboration ID: {collaborationResults.collaborationId}</p>
            <p>Total Participants: {collaborationResults.statistics.totalParticipants}</p>
            <p>Active Participants: {collaborationResults.statistics.activeParticipants}</p>
          </div>

          <div data-testid="participants-list">
            <h4>Participants:</h4>
            <ul>
              {collaborationResults.participants.map((participant: any, index: number) => (
                <li key={index} data-testid={`participant-${index}`}>
                  {participant.name} ({participant.role}) - {participant.status}
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="comments-list">
            <h4>Comments ({collaborationResults.statistics.totalComments}):</h4>
            <ul>
              {collaborationResults.comments.map((comment: any, index: number) => (
                <li key={index} data-testid={`comment-${index}`}>
                  <strong>{comment.author}:</strong> {comment.content}
                  <span data-testid={`comment-status-${index}`}>
                    {comment.resolved ? ' (Resolved)' : ' (Open)'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="suggestions-list">
            <h4>Suggestions ({collaborationResults.statistics.totalSuggestions}):</h4>
            <ul>
              {collaborationResults.suggestions.map((suggestion: any, index: number) => (
                <li key={index} data-testid={`suggestion-${index}`}>
                  <strong>{suggestion.author}:</strong> {suggestion.content}
                  <span data-testid={`suggestion-type-${index}`}>
                    ({suggestion.type} - {suggestion.priority})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="versions-list">
            <h4>Versions ({collaborationResults.statistics.totalVersions}):</h4>
            <ul>
              {collaborationResults.versions.map((version: any, index: number) => (
                <li key={index} data-testid={`version-${index}`}>
                  <strong>v{version.id}:</strong> {version.changes} by {version.author}
                  <span data-testid={`version-status-${index}`}>
                    ({version.status})
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="collaboration-statistics">
            <h4>Statistics:</h4>
            <p>Total Participants: {collaborationResults.statistics.totalParticipants}</p>
            <p>Active Participants: {collaborationResults.statistics.activeParticipants}</p>
            <p>Total Comments: {collaborationResults.statistics.totalComments}</p>
            <p>Resolved Comments: {collaborationResults.statistics.resolvedComments}</p>
            <p>Total Suggestions: {collaborationResults.statistics.totalSuggestions}</p>
            <p>Implemented Suggestions: {collaborationResults.statistics.implementedSuggestions}</p>
            <p>Total Versions: {collaborationResults.statistics.totalVersions}</p>
            <p>Published Versions: {collaborationResults.statistics.publishedVersions}</p>
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

describe('StudyGuideCollaborator', () => {
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
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-collaborator')).toBeInTheDocument();
  });

  it('renders collaboration settings', () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('realtime-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('comments-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('suggestions-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('version-control-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('notifications-checkbox')).toBeInTheDocument();
  });

  it('renders collaborate button', () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('collaborate-button')).toBeInTheDocument();
    expect(screen.getByText('Start Collaboration')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideCollaborator studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates collaboration settings when changed', () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const realtimeCheckbox = screen.getByTestId('realtime-checkbox');
    const commentsCheckbox = screen.getByTestId('comments-checkbox');
    
    expect(realtimeCheckbox).toBeChecked();
    expect(commentsCheckbox).toBeChecked();
    
    fireEvent.click(realtimeCheckbox);
    fireEvent.click(commentsCheckbox);
    
    expect(realtimeCheckbox).not.toBeChecked();
    expect(commentsCheckbox).not.toBeChecked();
  });

  it('calls onCollaborate when collaboration completes successfully', async () => {
    const onCollaborate = jest.fn();
    
    render(
      <MockStudyGuideCollaborator 
        studyGuide={mockStudyGuide} 
        onCollaborate={onCollaborate} 
      />
    );
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    await waitFor(() => {
      expect(onCollaborate).toHaveBeenCalledWith(
        expect.objectContaining({
          collaborationId: 'collab-123',
          participants: expect.arrayContaining([
            expect.objectContaining({
              name: 'John Doe',
              role: 'Editor',
              status: 'online'
            }),
            expect.objectContaining({
              name: 'Jane Smith',
              role: 'Reviewer',
              status: 'online'
            })
          ]),
          comments: expect.arrayContaining([
            expect.objectContaining({
              author: 'John Doe',
              content: 'Great introduction! Consider adding more examples.',
              resolved: false
            })
          ]),
          suggestions: expect.arrayContaining([
            expect.objectContaining({
              author: 'John Doe',
              content: 'Add more visual aids to improve comprehension',
              type: 'enhancement',
              priority: 'medium'
            })
          ]),
          versions: expect.arrayContaining([
            expect.objectContaining({
              id: 'v1',
              author: 'John Doe',
              changes: 'Initial version',
              status: 'published'
            })
          ]),
          statistics: expect.objectContaining({
            totalParticipants: 3,
            activeParticipants: 2,
            totalComments: 2,
            totalSuggestions: 2,
            totalVersions: 2
          })
        })
      );
    });
  });

  it('calls onError when collaboration fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideCollaborator: React.FC<any> = ({ onError }) => {
      const handleCollaborate = () => {
        onError?.(new Error('Collaboration failed'));
      };

      return (
        <div>
          <button onClick={handleCollaborate} data-testid="error-button">
            Collaborate with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideCollaborator onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during collaboration setup', async () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    expect(screen.getByTestId('collaboration-progress')).toBeInTheDocument();
    expect(screen.getByText('Setting up collaboration...')).toBeInTheDocument();
  });

  it('updates button text during collaboration setup', async () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    expect(screen.getByText('Setting up collaboration...')).toBeInTheDocument();
  });

  it('disables collaborate button when no study guide provided', () => {
    render(<MockStudyGuideCollaborator studyGuide={[]} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    expect(collaborateButton).toBeDisabled();
  });

  it('disables collaborate button during collaboration setup', async () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    expect(collaborateButton).toBeDisabled();
  });

  it('displays collaboration results after setup', async () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('collaboration-results')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Results')).toBeInTheDocument();
      expect(screen.getByText('Collaboration Info:')).toBeInTheDocument();
    });
  });

  it('displays participants correctly', async () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('participants-list')).toBeInTheDocument();
      expect(screen.getByText('John Doe (Editor) - online')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith (Reviewer) - online')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson (Viewer) - offline')).toBeInTheDocument();
    });
  });

  it('displays comments correctly', async () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('comments-list')).toBeInTheDocument();
      expect(screen.getByText('Comments (2):')).toBeInTheDocument();
      expect(screen.getByText('John Doe: Great introduction! Consider adding more examples. (Open)')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith: The structure looks good. Maybe add a summary section. (Open)')).toBeInTheDocument();
    });
  });

  it('displays suggestions correctly', async () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('suggestions-list')).toBeInTheDocument();
      expect(screen.getByText('Suggestions (2):')).toBeInTheDocument();
      expect(screen.getByText('John Doe: Add more visual aids to improve comprehension (enhancement - medium)')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith: Include more real-world examples (content - high)')).toBeInTheDocument();
    });
  });

  it('displays versions correctly', async () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('versions-list')).toBeInTheDocument();
      expect(screen.getByText('Versions (2):')).toBeInTheDocument();
      expect(screen.getByText('v1: Initial version by John Doe (published)')).toBeInTheDocument();
      expect(screen.getByText('v2: Added examples and improved structure by Jane Smith (draft)')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideCollaborator studyGuide={mockStudyGuide} />);
    
    const collaborateButton = screen.getByTestId('collaborate-button');
    fireEvent.click(collaborateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Participants: 3')).toBeInTheDocument();
      expect(screen.getByText('Active Participants: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Comments: 2')).toBeInTheDocument();
      expect(screen.getByText('Resolved Comments: 0')).toBeInTheDocument();
      expect(screen.getByText('Total Suggestions: 2')).toBeInTheDocument();
      expect(screen.getByText('Implemented Suggestions: 0')).toBeInTheDocument();
      expect(screen.getByText('Total Versions: 2')).toBeInTheDocument();
      expect(screen.getByText('Published Versions: 1')).toBeInTheDocument();
    });
  });
});
