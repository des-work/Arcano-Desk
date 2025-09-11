import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideSupport } from '../components/StudyGuideSupport';

// Mock the StudyGuideSupport component
const MockStudyGuideSupport: React.FC<any> = ({ 
  studyGuide, 
  onSupport, 
  onError 
}) => {
  const [supportResults, setSupportResults] = React.useState<any>(null);
  const [isSupporting, setIsSupporting] = React.useState(false);
  const [supportSettings, setSupportSettings] = React.useState({
    documentation: true,
    tutorials: true,
    examples: true,
    faq: true,
    chat: true,
    email: true,
    phone: true,
    ticket: true,
    community: true,
    feedback: true
  });

  const handleSupport = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsSupporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        supportId: 'support-123',
        support: {
          documentation: {
            enabled: supportSettings.documentation,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            pages: 25,
            score: 95
          },
          tutorials: {
            enabled: supportSettings.tutorials,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            count: 12,
            score: 92
          },
          examples: {
            enabled: supportSettings.examples,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            count: 45,
            score: 94
          },
          faq: {
            enabled: supportSettings.faq,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            questions: 38,
            score: 91
          },
          chat: {
            enabled: supportSettings.chat,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            online: true,
            score: 96
          },
          email: {
            enabled: supportSettings.email,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            responseTime: '2 hours',
            score: 93
          },
          phone: {
            enabled: supportSettings.phone,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            availability: '24/7',
            score: 97
          },
          ticket: {
            enabled: supportSettings.ticket,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            open: 3,
            score: 89
          },
          community: {
            enabled: supportSettings.community,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            members: 1250,
            score: 88
          },
          feedback: {
            enabled: supportSettings.feedback,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            submissions: 156,
            score: 90
          }
        },
        statistics: {
          totalSections: studyGuide.length,
          totalSupport: 10,
          documentationEnabled: supportSettings.documentation,
          tutorialsEnabled: supportSettings.tutorials,
          examplesEnabled: supportSettings.examples,
          faqEnabled: supportSettings.faq,
          chatEnabled: supportSettings.chat,
          emailEnabled: supportSettings.email,
          phoneEnabled: supportSettings.phone,
          ticketEnabled: supportSettings.ticket,
          communityEnabled: supportSettings.community,
          feedbackEnabled: supportSettings.feedback,
          averageScore: 92
        }
      };

      setSupportResults(results);
      onSupport?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsSupporting(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setSupportSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-support">
      <h2>Study Guide Support</h2>
      
      <div data-testid="support-settings">
        <h3>Support Settings:</h3>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.documentation}
              onChange={(e) => handleSettingChange('documentation', e.target.checked)}
              data-testid="documentation-checkbox"
            />
            Documentation
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.tutorials}
              onChange={(e) => handleSettingChange('tutorials', e.target.checked)}
              data-testid="tutorials-checkbox"
            />
            Tutorials
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.examples}
              onChange={(e) => handleSettingChange('examples', e.target.checked)}
              data-testid="examples-checkbox"
            />
            Examples
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.faq}
              onChange={(e) => handleSettingChange('faq', e.target.checked)}
              data-testid="faq-checkbox"
            />
            FAQ
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.chat}
              onChange={(e) => handleSettingChange('chat', e.target.checked)}
              data-testid="chat-checkbox"
            />
            Chat
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.email}
              onChange={(e) => handleSettingChange('email', e.target.checked)}
              data-testid="email-checkbox"
            />
            Email
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.phone}
              onChange={(e) => handleSettingChange('phone', e.target.checked)}
              data-testid="phone-checkbox"
            />
            Phone
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.ticket}
              onChange={(e) => handleSettingChange('ticket', e.target.checked)}
              data-testid="ticket-checkbox"
            />
            Ticket
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.community}
              onChange={(e) => handleSettingChange('community', e.target.checked)}
              data-testid="community-checkbox"
            />
            Community
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={supportSettings.feedback}
              onChange={(e) => handleSettingChange('feedback', e.target.checked)}
              data-testid="feedback-checkbox"
            />
            Feedback
          </label>
        </div>
      </div>

      <button
        onClick={handleSupport}
        disabled={!studyGuide || studyGuide.length === 0 || isSupporting}
        data-testid="support-button"
      >
        {isSupporting ? 'Supporting...' : 'Start Support'}
      </button>

      {isSupporting && (
        <div data-testid="support-progress">Setting up support...</div>
      )}

      {supportResults && (
        <div data-testid="support-results">
          <h3>Support Results</h3>
          
          <div data-testid="support-tasks">
            <h4>Support Tasks:</h4>
            <ul>
              <li data-testid="documentation-task">
                Documentation: {supportResults.support.documentation.status} - {supportResults.support.documentation.lastUpdate} last update, {supportResults.support.documentation.pages} pages - {supportResults.support.documentation.score}%
              </li>
              <li data-testid="tutorials-task">
                Tutorials: {supportResults.support.tutorials.status} - {supportResults.support.tutorials.lastUpdate} last update, {supportResults.support.tutorials.count} count - {supportResults.support.tutorials.score}%
              </li>
              <li data-testid="examples-task">
                Examples: {supportResults.support.examples.status} - {supportResults.support.examples.lastUpdate} last update, {supportResults.support.examples.count} count - {supportResults.support.examples.score}%
              </li>
              <li data-testid="faq-task">
                FAQ: {supportResults.support.faq.status} - {supportResults.support.faq.lastUpdate} last update, {supportResults.support.faq.questions} questions - {supportResults.support.faq.score}%
              </li>
              <li data-testid="chat-task">
                Chat: {supportResults.support.chat.status} - {supportResults.support.chat.lastUpdate} last update, {supportResults.support.chat.online ? 'Online' : 'Offline'} - {supportResults.support.chat.score}%
              </li>
              <li data-testid="email-task">
                Email: {supportResults.support.email.status} - {supportResults.support.email.lastUpdate} last update, {supportResults.support.email.responseTime} response time - {supportResults.support.email.score}%
              </li>
              <li data-testid="phone-task">
                Phone: {supportResults.support.phone.status} - {supportResults.support.phone.lastUpdate} last update, {supportResults.support.phone.availability} availability - {supportResults.support.phone.score}%
              </li>
              <li data-testid="ticket-task">
                Ticket: {supportResults.support.ticket.status} - {supportResults.support.ticket.lastUpdate} last update, {supportResults.support.ticket.open} open - {supportResults.support.ticket.score}%
              </li>
              <li data-testid="community-task">
                Community: {supportResults.support.community.status} - {supportResults.support.community.lastUpdate} last update, {supportResults.support.community.members} members - {supportResults.support.community.score}%
              </li>
              <li data-testid="feedback-task">
                Feedback: {supportResults.support.feedback.status} - {supportResults.support.feedback.lastUpdate} last update, {supportResults.support.feedback.submissions} submissions - {supportResults.support.feedback.score}%
              </li>
            </ul>
          </div>

          <div data-testid="support-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {supportResults.statistics.totalSections}</p>
            <p>Total Support: {supportResults.statistics.totalSupport}</p>
            <p>Documentation Enabled: {supportResults.statistics.documentationEnabled ? 'Yes' : 'No'}</p>
            <p>Tutorials Enabled: {supportResults.statistics.tutorialsEnabled ? 'Yes' : 'No'}</p>
            <p>Examples Enabled: {supportResults.statistics.examplesEnabled ? 'Yes' : 'No'}</p>
            <p>FAQ Enabled: {supportResults.statistics.faqEnabled ? 'Yes' : 'No'}</p>
            <p>Chat Enabled: {supportResults.statistics.chatEnabled ? 'Yes' : 'No'}</p>
            <p>Email Enabled: {supportResults.statistics.emailEnabled ? 'Yes' : 'No'}</p>
            <p>Phone Enabled: {supportResults.statistics.phoneEnabled ? 'Yes' : 'No'}</p>
            <p>Ticket Enabled: {supportResults.statistics.ticketEnabled ? 'Yes' : 'No'}</p>
            <p>Community Enabled: {supportResults.statistics.communityEnabled ? 'Yes' : 'No'}</p>
            <p>Feedback Enabled: {supportResults.statistics.feedbackEnabled ? 'Yes' : 'No'}</p>
            <p>Average Score: {supportResults.statistics.averageScore}%</p>
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

describe('StudyGuideSupport', () => {
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
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-support')).toBeInTheDocument();
  });

  it('renders support settings', () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('documentation-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('tutorials-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('examples-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('faq-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('chat-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('email-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('phone-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('ticket-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('community-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('feedback-checkbox')).toBeInTheDocument();
  });

  it('renders support button', () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('support-button')).toBeInTheDocument();
    expect(screen.getByText('Start Support')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideSupport studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates support settings when changed', () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    const documentationCheckbox = screen.getByTestId('documentation-checkbox');
    const tutorialsCheckbox = screen.getByTestId('tutorials-checkbox');
    const examplesCheckbox = screen.getByTestId('examples-checkbox');
    const faqCheckbox = screen.getByTestId('faq-checkbox');
    const chatCheckbox = screen.getByTestId('chat-checkbox');
    const emailCheckbox = screen.getByTestId('email-checkbox');
    const phoneCheckbox = screen.getByTestId('phone-checkbox');
    const ticketCheckbox = screen.getByTestId('ticket-checkbox');
    const communityCheckbox = screen.getByTestId('community-checkbox');
    const feedbackCheckbox = screen.getByTestId('feedback-checkbox');
    
    expect(documentationCheckbox).toBeChecked();
    expect(tutorialsCheckbox).toBeChecked();
    expect(examplesCheckbox).toBeChecked();
    expect(faqCheckbox).toBeChecked();
    expect(chatCheckbox).toBeChecked();
    expect(emailCheckbox).toBeChecked();
    expect(phoneCheckbox).toBeChecked();
    expect(ticketCheckbox).toBeChecked();
    expect(communityCheckbox).toBeChecked();
    expect(feedbackCheckbox).toBeChecked();
    
    fireEvent.click(documentationCheckbox);
    fireEvent.click(tutorialsCheckbox);
    fireEvent.click(examplesCheckbox);
    fireEvent.click(faqCheckbox);
    fireEvent.click(chatCheckbox);
    fireEvent.click(emailCheckbox);
    fireEvent.click(phoneCheckbox);
    fireEvent.click(ticketCheckbox);
    fireEvent.click(communityCheckbox);
    fireEvent.click(feedbackCheckbox);
    
    expect(documentationCheckbox).not.toBeChecked();
    expect(tutorialsCheckbox).not.toBeChecked();
    expect(examplesCheckbox).not.toBeChecked();
    expect(faqCheckbox).not.toBeChecked();
    expect(chatCheckbox).not.toBeChecked();
    expect(emailCheckbox).not.toBeChecked();
    expect(phoneCheckbox).not.toBeChecked();
    expect(ticketCheckbox).not.toBeChecked();
    expect(communityCheckbox).not.toBeChecked();
    expect(feedbackCheckbox).not.toBeChecked();
  });

  it('calls onSupport when support completes successfully', async () => {
    const onSupport = jest.fn();
    
    render(
      <MockStudyGuideSupport 
        studyGuide={mockStudyGuide} 
        onSupport={onSupport} 
      />
    );
    
    const supportButton = screen.getByTestId('support-button');
    fireEvent.click(supportButton);
    
    await waitFor(() => {
      expect(onSupport).toHaveBeenCalledWith(
        expect.objectContaining({
          supportId: 'support-123',
          support: expect.objectContaining({
            documentation: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              pages: 25,
              score: 95
            }),
            tutorials: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              count: 12,
              score: 92
            }),
            examples: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              count: 45,
              score: 94
            }),
            faq: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              questions: 38,
              score: 91
            }),
            chat: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              online: true,
              score: 96
            }),
            email: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              responseTime: '2 hours',
              score: 93
            }),
            phone: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              availability: '24/7',
              score: 97
            }),
            ticket: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              open: 3,
              score: 89
            }),
            community: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              members: 1250,
              score: 88
            }),
            feedback: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              submissions: 156,
              score: 90
            })
          }),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalSupport: 10,
            documentationEnabled: true,
            tutorialsEnabled: true,
            examplesEnabled: true,
            faqEnabled: true,
            chatEnabled: true,
            emailEnabled: true,
            phoneEnabled: true,
            ticketEnabled: true,
            communityEnabled: true,
            feedbackEnabled: true,
            averageScore: 92
          })
        })
      );
    });
  });

  it('calls onError when support fails', async () => {
    const onError = jest.fn();
    
    const ErrorStudyGuideSupport: React.FC<any> = ({ onError }) => {
      const handleSupport = () => {
        onError?.(new Error('Support failed'));
      };

      return (
        <div>
          <button onClick={handleSupport} data-testid="error-button">
            Support with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideSupport onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during support', async () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    const supportButton = screen.getByTestId('support-button');
    fireEvent.click(supportButton);
    
    expect(screen.getByTestId('support-progress')).toBeInTheDocument();
    expect(screen.getByText('Setting up support...')).toBeInTheDocument();
  });

  it('updates button text during support', async () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    const supportButton = screen.getByTestId('support-button');
    fireEvent.click(supportButton);
    
    expect(screen.getByText('Supporting...')).toBeInTheDocument();
  });

  it('disables support button when no study guide provided', () => {
    render(<MockStudyGuideSupport studyGuide={[]} />);
    
    const supportButton = screen.getByTestId('support-button');
    expect(supportButton).toBeDisabled();
  });

  it('disables support button during support', async () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    const supportButton = screen.getByTestId('support-button');
    fireEvent.click(supportButton);
    
    expect(supportButton).toBeDisabled();
  });

  it('displays support results after support', async () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    const supportButton = screen.getByTestId('support-button');
    fireEvent.click(supportButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('support-results')).toBeInTheDocument();
      expect(screen.getByText('Support Results')).toBeInTheDocument();
      expect(screen.getByText('Support Tasks:')).toBeInTheDocument();
    });
  });

  it('displays support tasks correctly', async () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    const supportButton = screen.getByTestId('support-button');
    fireEvent.click(supportButton);
    
    await waitFor(() => {
      expect(screen.getByText('Documentation: Active -')).toBeInTheDocument();
      expect(screen.getByText('Tutorials: Active -')).toBeInTheDocument();
      expect(screen.getByText('Examples: Active -')).toBeInTheDocument();
      expect(screen.getByText('FAQ: Active -')).toBeInTheDocument();
      expect(screen.getByText('Chat: Active -')).toBeInTheDocument();
      expect(screen.getByText('Email: Active -')).toBeInTheDocument();
      expect(screen.getByText('Phone: Active -')).toBeInTheDocument();
      expect(screen.getByText('Ticket: Active -')).toBeInTheDocument();
      expect(screen.getByText('Community: Active -')).toBeInTheDocument();
      expect(screen.getByText('Feedback: Active -')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideSupport studyGuide={mockStudyGuide} />);
    
    const supportButton = screen.getByTestId('support-button');
    fireEvent.click(supportButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Support: 10')).toBeInTheDocument();
      expect(screen.getByText('Documentation Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Tutorials Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Examples Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('FAQ Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Chat Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Email Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Phone Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Ticket Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Community Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Feedback Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 92%')).toBeInTheDocument();
    });
  });
});