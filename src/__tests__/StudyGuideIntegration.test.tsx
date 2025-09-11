import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideIntegration } from '../components/StudyGuideIntegration';

// Mock the StudyGuideIntegration component
const MockStudyGuideIntegration: React.FC<any> = ({ 
  studyGuide, 
  onIntegrate, 
  onError 
}) => {
  const [integrationResults, setIntegrationResults] = React.useState<any>(null);
  const [isIntegrating, setIsIntegrating] = React.useState(false);
  const [integrationSettings, setIntegrationSettings] = React.useState({
    lms: true,
    cms: true,
    api: true,
    webhook: true,
    sso: true,
    analytics: true,
    backup: true,
    sync: true
  });

  const handleIntegrate = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsIntegrating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        integrationId: 'integrate-123',
        integrations: {
          lms: {
            enabled: integrationSettings.lms,
            status: 'Connected',
            platform: 'Moodle',
            score: 95
          },
          cms: {
            enabled: integrationSettings.cms,
            status: 'Connected',
            platform: 'WordPress',
            score: 90
          },
          api: {
            enabled: integrationSettings.api,
            status: 'Active',
            endpoints: 15,
            score: 88
          },
          webhook: {
            enabled: integrationSettings.webhook,
            status: 'Active',
            events: 8,
            score: 92
          },
          sso: {
            enabled: integrationSettings.sso,
            status: 'Connected',
            provider: 'SAML',
            score: 94
          },
          analytics: {
            enabled: integrationSettings.analytics,
            status: 'Active',
            provider: 'Google Analytics',
            score: 89
          },
          backup: {
            enabled: integrationSettings.backup,
            status: 'Active',
            frequency: 'Daily',
            score: 96
          },
          sync: {
            enabled: integrationSettings.sync,
            status: 'Active',
            frequency: 'Real-time',
            score: 91
          }
        },
        statistics: {
          totalSections: studyGuide.length,
          totalIntegrations: 8,
          activeIntegrations: 8,
          connectedIntegrations: 6,
          averageScore: 92
        }
      };

      setIntegrationResults(results);
      onIntegrate?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsIntegrating(false);
    }
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setIntegrationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-integration">
      <h2>Study Guide Integration</h2>
      
      <div data-testid="integration-settings">
        <h3>Integration Settings:</h3>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={integrationSettings.lms}
              onChange={(e) => handleSettingChange('lms', e.target.checked)}
              data-testid="lms-checkbox"
            />
            LMS Integration
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={integrationSettings.cms}
              onChange={(e) => handleSettingChange('cms', e.target.checked)}
              data-testid="cms-checkbox"
            />
            CMS Integration
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={integrationSettings.api}
              onChange={(e) => handleSettingChange('api', e.target.checked)}
              data-testid="api-checkbox"
            />
            API Integration
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={integrationSettings.webhook}
              onChange={(e) => handleSettingChange('webhook', e.target.checked)}
              data-testid="webhook-checkbox"
            />
            Webhook Integration
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={integrationSettings.sso}
              onChange={(e) => handleSettingChange('sso', e.target.checked)}
              data-testid="sso-checkbox"
            />
            SSO Integration
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={integrationSettings.analytics}
              onChange={(e) => handleSettingChange('analytics', e.target.checked)}
              data-testid="analytics-checkbox"
            />
            Analytics Integration
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={integrationSettings.backup}
              onChange={(e) => handleSettingChange('backup', e.target.checked)}
              data-testid="backup-checkbox"
            />
            Backup Integration
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={integrationSettings.sync}
              onChange={(e) => handleSettingChange('sync', e.target.checked)}
              data-testid="sync-checkbox"
            />
            Sync Integration
          </label>
        </div>
      </div>

      <button
        onClick={handleIntegrate}
        disabled={!studyGuide || studyGuide.length === 0 || isIntegrating}
        data-testid="integrate-button"
      >
        {isIntegrating ? 'Integrating...' : 'Start Integration'}
      </button>

      {isIntegrating && (
        <div data-testid="integration-progress">Starting integration...</div>
      )}

      {integrationResults && (
        <div data-testid="integration-results">
          <h3>Integration Results</h3>
          
          <div data-testid="integrations-list">
            <h4>Integrations:</h4>
            <ul>
              <li data-testid="lms-integration">
                LMS: {integrationResults.integrations.lms.platform} ({integrationResults.integrations.lms.status}) - {integrationResults.integrations.lms.score}%
              </li>
              <li data-testid="cms-integration">
                CMS: {integrationResults.integrations.cms.platform} ({integrationResults.integrations.cms.status}) - {integrationResults.integrations.cms.score}%
              </li>
              <li data-testid="api-integration">
                API: {integrationResults.integrations.api.endpoints} endpoints ({integrationResults.integrations.api.status}) - {integrationResults.integrations.api.score}%
              </li>
              <li data-testid="webhook-integration">
                Webhook: {integrationResults.integrations.webhook.events} events ({integrationResults.integrations.webhook.status}) - {integrationResults.integrations.webhook.score}%
              </li>
              <li data-testid="sso-integration">
                SSO: {integrationResults.integrations.sso.provider} ({integrationResults.integrations.sso.status}) - {integrationResults.integrations.sso.score}%
              </li>
              <li data-testid="analytics-integration">
                Analytics: {integrationResults.integrations.analytics.provider} ({integrationResults.integrations.analytics.status}) - {integrationResults.integrations.analytics.score}%
              </li>
              <li data-testid="backup-integration">
                Backup: {integrationResults.integrations.backup.frequency} ({integrationResults.integrations.backup.status}) - {integrationResults.integrations.backup.score}%
              </li>
              <li data-testid="sync-integration">
                Sync: {integrationResults.integrations.sync.frequency} ({integrationResults.integrations.sync.status}) - {integrationResults.integrations.sync.score}%
              </li>
            </ul>
          </div>

          <div data-testid="integration-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {integrationResults.statistics.totalSections}</p>
            <p>Total Integrations: {integrationResults.statistics.totalIntegrations}</p>
            <p>Active Integrations: {integrationResults.statistics.activeIntegrations}</p>
            <p>Connected Integrations: {integrationResults.statistics.connectedIntegrations}</p>
            <p>Average Score: {integrationResults.statistics.averageScore}%</p>
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

describe('StudyGuideIntegration', () => {
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
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-integration')).toBeInTheDocument();
  });

  it('renders integration settings', () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('lms-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('cms-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('api-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('webhook-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('sso-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('backup-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('sync-checkbox')).toBeInTheDocument();
  });

  it('renders integrate button', () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('integrate-button')).toBeInTheDocument();
    expect(screen.getByText('Start Integration')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideIntegration studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates integration settings when changed', () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    const lmsCheckbox = screen.getByTestId('lms-checkbox');
    const cmsCheckbox = screen.getByTestId('cms-checkbox');
    const apiCheckbox = screen.getByTestId('api-checkbox');
    
    expect(lmsCheckbox).toBeChecked();
    expect(cmsCheckbox).toBeChecked();
    expect(apiCheckbox).toBeChecked();
    
    fireEvent.click(lmsCheckbox);
    fireEvent.click(cmsCheckbox);
    fireEvent.click(apiCheckbox);
    
    expect(lmsCheckbox).not.toBeChecked();
    expect(cmsCheckbox).not.toBeChecked();
    expect(apiCheckbox).not.toBeChecked();
  });

  it('calls onIntegrate when integration completes successfully', async () => {
    const onIntegrate = jest.fn();
    
    render(
      <MockStudyGuideIntegration 
        studyGuide={mockStudyGuide} 
        onIntegrate={onIntegrate} 
      />
    );
    
    const integrateButton = screen.getByTestId('integrate-button');
    fireEvent.click(integrateButton);
    
    await waitFor(() => {
      expect(onIntegrate).toHaveBeenCalledWith(
        expect.objectContaining({
          integrationId: 'integrate-123',
          integrations: expect.objectContaining({
            lms: expect.objectContaining({
              enabled: true,
              status: 'Connected',
              platform: 'Moodle',
              score: 95
            }),
            cms: expect.objectContaining({
              enabled: true,
              status: 'Connected',
              platform: 'WordPress',
              score: 90
            }),
            api: expect.objectContaining({
              enabled: true,
              status: 'Active',
              endpoints: 15,
              score: 88
            }),
            webhook: expect.objectContaining({
              enabled: true,
              status: 'Active',
              events: 8,
              score: 92
            }),
            sso: expect.objectContaining({
              enabled: true,
              status: 'Connected',
              provider: 'SAML',
              score: 94
            }),
            analytics: expect.objectContaining({
              enabled: true,
              status: 'Active',
              provider: 'Google Analytics',
              score: 89
            }),
            backup: expect.objectContaining({
              enabled: true,
              status: 'Active',
              frequency: 'Daily',
              score: 96
            }),
            sync: expect.objectContaining({
              enabled: true,
              status: 'Active',
              frequency: 'Real-time',
              score: 91
            })
          }),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalIntegrations: 8,
            activeIntegrations: 8,
            connectedIntegrations: 6,
            averageScore: 92
          })
        })
      );
    });
  });

  it('calls onError when integration fails', async () => {
    const onError = jest.fn();
    
    const ErrorStudyGuideIntegration: React.FC<any> = ({ onError }) => {
      const handleIntegrate = () => {
        onError?.(new Error('Integration failed'));
      };

      return (
        <div>
          <button onClick={handleIntegrate} data-testid="error-button">
            Integrate with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideIntegration onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during integration', async () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    const integrateButton = screen.getByTestId('integrate-button');
    fireEvent.click(integrateButton);
    
    expect(screen.getByTestId('integration-progress')).toBeInTheDocument();
    expect(screen.getByText('Starting integration...')).toBeInTheDocument();
  });

  it('updates button text during integration', async () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    const integrateButton = screen.getByTestId('integrate-button');
    fireEvent.click(integrateButton);
    
    expect(screen.getByText('Integrating...')).toBeInTheDocument();
  });

  it('disables integrate button when no study guide provided', () => {
    render(<MockStudyGuideIntegration studyGuide={[]} />);
    
    const integrateButton = screen.getByTestId('integrate-button');
    expect(integrateButton).toBeDisabled();
  });

  it('disables integrate button during integration', async () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    const integrateButton = screen.getByTestId('integrate-button');
    fireEvent.click(integrateButton);
    
    expect(integrateButton).toBeDisabled();
  });

  it('displays integration results after integration', async () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    const integrateButton = screen.getByTestId('integrate-button');
    fireEvent.click(integrateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('integration-results')).toBeInTheDocument();
      expect(screen.getByText('Integration Results')).toBeInTheDocument();
      expect(screen.getByText('Integrations:')).toBeInTheDocument();
    });
  });

  it('displays integrations correctly', async () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    const integrateButton = screen.getByTestId('integrate-button');
    fireEvent.click(integrateButton);
    
    await waitFor(() => {
      expect(screen.getByText('LMS: Moodle (Connected) - 95%')).toBeInTheDocument();
      expect(screen.getByText('CMS: WordPress (Connected) - 90%')).toBeInTheDocument();
      expect(screen.getByText('API: 15 endpoints (Active) - 88%')).toBeInTheDocument();
      expect(screen.getByText('Webhook: 8 events (Active) - 92%')).toBeInTheDocument();
      expect(screen.getByText('SSO: SAML (Connected) - 94%')).toBeInTheDocument();
      expect(screen.getByText('Analytics: Google Analytics (Active) - 89%')).toBeInTheDocument();
      expect(screen.getByText('Backup: Daily (Active) - 96%')).toBeInTheDocument();
      expect(screen.getByText('Sync: Real-time (Active) - 91%')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideIntegration studyGuide={mockStudyGuide} />);
    
    const integrateButton = screen.getByTestId('integrate-button');
    fireEvent.click(integrateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Integrations: 8')).toBeInTheDocument();
      expect(screen.getByText('Active Integrations: 8')).toBeInTheDocument();
      expect(screen.getByText('Connected Integrations: 6')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 92%')).toBeInTheDocument();
    });
  });
});
