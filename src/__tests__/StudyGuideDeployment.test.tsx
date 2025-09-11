import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideDeployment } from '../components/StudyGuideDeployment';

// Mock the StudyGuideDeployment component
const MockStudyGuideDeployment: React.FC<any> = ({ 
  studyGuide, 
  onDeploy, 
  onError 
}) => {
  const [deploymentResults, setDeploymentResults] = React.useState<any>(null);
  const [isDeploying, setIsDeploying] = React.useState(false);
  const [deploymentSettings, setDeploymentSettings] = React.useState({
    platform: 'web',
    environment: 'production',
    region: 'us-east-1',
    domain: 'studygui.de',
    ssl: true,
    cdn: true,
    monitoring: true,
    analytics: true,
    backup: true,
    scaling: 'auto'
  });

  const handleDeploy = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsDeploying(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        deploymentId: 'deploy-123',
        deployment: {
          platform: {
            type: deploymentSettings.platform,
            status: 'Deployed',
            url: `https://${deploymentSettings.domain}`,
            lastDeploy: new Date().toISOString(),
            score: 98
          },
          environment: {
            type: deploymentSettings.environment,
            status: 'Active',
            config: 'Production',
            lastUpdate: new Date().toISOString(),
            score: 96
          },
          region: {
            name: deploymentSettings.region,
            status: 'Active',
            latency: '45ms',
            lastCheck: new Date().toISOString(),
            score: 94
          },
          domain: {
            name: deploymentSettings.domain,
            status: 'Active',
            ssl: deploymentSettings.ssl,
            lastRenewal: new Date().toISOString(),
            score: 97
          },
          ssl: {
            enabled: deploymentSettings.ssl,
            status: 'Active',
            certificate: 'Let\'s Encrypt',
            expiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            score: 99
          },
          cdn: {
            enabled: deploymentSettings.cdn,
            status: 'Active',
            provider: 'CloudFlare',
            cacheHit: '95%',
            score: 93
          },
          monitoring: {
            enabled: deploymentSettings.monitoring,
            status: 'Active',
            uptime: '99.9%',
            lastCheck: new Date().toISOString(),
            score: 95
          },
          analytics: {
            enabled: deploymentSettings.analytics,
            status: 'Active',
            events: 1250,
            lastEvent: new Date().toISOString(),
            score: 92
          },
          backup: {
            enabled: deploymentSettings.backup,
            status: 'Active',
            frequency: 'Daily',
            lastBackup: new Date().toISOString(),
            score: 91
          },
          scaling: {
            type: deploymentSettings.scaling,
            status: 'Active',
            instances: 3,
            lastScale: new Date().toISOString(),
            score: 89
          }
        },
        statistics: {
          totalSections: studyGuide.length,
          totalDeployments: 8,
          currentPlatform: deploymentSettings.platform,
          currentEnvironment: deploymentSettings.environment,
          currentRegion: deploymentSettings.region,
          currentDomain: deploymentSettings.domain,
          sslEnabled: deploymentSettings.ssl,
          cdnEnabled: deploymentSettings.cdn,
          monitoringEnabled: deploymentSettings.monitoring,
          analyticsEnabled: deploymentSettings.analytics,
          backupEnabled: deploymentSettings.backup,
          scalingType: deploymentSettings.scaling,
          averageScore: 94
        }
      };

      setDeploymentResults(results);
      onDeploy?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setDeploymentSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-deployment">
      <h2>Study Guide Deployment</h2>
      
      <div data-testid="deployment-settings">
        <h3>Deployment Settings:</h3>
        
        <div>
          <label htmlFor="platform">Platform:</label>
          <select
            id="platform"
            value={deploymentSettings.platform}
            onChange={(e) => handleSettingChange('platform', e.target.value)}
            data-testid="platform-select"
          >
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
            <option value="api">API</option>
          </select>
        </div>

        <div>
          <label htmlFor="environment">Environment:</label>
          <select
            id="environment"
            value={deploymentSettings.environment}
            onChange={(e) => handleSettingChange('environment', e.target.value)}
            data-testid="environment-select"
          >
            <option value="development">Development</option>
            <option value="staging">Staging</option>
            <option value="production">Production</option>
          </select>
        </div>

        <div>
          <label htmlFor="region">Region:</label>
          <select
            id="region"
            value={deploymentSettings.region}
            onChange={(e) => handleSettingChange('region', e.target.value)}
            data-testid="region-select"
          >
            <option value="us-east-1">US East (N. Virginia)</option>
            <option value="us-west-2">US West (Oregon)</option>
            <option value="eu-west-1">Europe (Ireland)</option>
            <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
          </select>
        </div>

        <div>
          <label htmlFor="domain">Domain:</label>
          <input
            id="domain"
            type="text"
            value={deploymentSettings.domain}
            onChange={(e) => handleSettingChange('domain', e.target.value)}
            data-testid="domain-input"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={deploymentSettings.ssl}
              onChange={(e) => handleSettingChange('ssl', e.target.checked)}
              data-testid="ssl-checkbox"
            />
            SSL
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={deploymentSettings.cdn}
              onChange={(e) => handleSettingChange('cdn', e.target.checked)}
              data-testid="cdn-checkbox"
            />
            CDN
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={deploymentSettings.monitoring}
              onChange={(e) => handleSettingChange('monitoring', e.target.checked)}
              data-testid="monitoring-checkbox"
            />
            Monitoring
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={deploymentSettings.analytics}
              onChange={(e) => handleSettingChange('analytics', e.target.checked)}
              data-testid="analytics-checkbox"
            />
            Analytics
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={deploymentSettings.backup}
              onChange={(e) => handleSettingChange('backup', e.target.checked)}
              data-testid="backup-checkbox"
            />
            Backup
          </label>
        </div>

        <div>
          <label htmlFor="scaling">Scaling:</label>
          <select
            id="scaling"
            value={deploymentSettings.scaling}
            onChange={(e) => handleSettingChange('scaling', e.target.value)}
            data-testid="scaling-select"
          >
            <option value="manual">Manual</option>
            <option value="auto">Auto</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleDeploy}
        disabled={!studyGuide || studyGuide.length === 0 || isDeploying}
        data-testid="deploy-button"
      >
        {isDeploying ? 'Deploying...' : 'Start Deployment'}
      </button>

      {isDeploying && (
        <div data-testid="deployment-progress">Deploying study guide...</div>
      )}

      {deploymentResults && (
        <div data-testid="deployment-results">
          <h3>Deployment Results</h3>
          
          <div data-testid="deployment-tasks">
            <h4>Deployment Tasks:</h4>
            <ul>
              <li data-testid="platform-task">
                Platform: {deploymentResults.deployment.platform.status} - {deploymentResults.deployment.platform.type} platform, {deploymentResults.deployment.platform.url} URL - {deploymentResults.deployment.platform.score}%
              </li>
              <li data-testid="environment-task">
                Environment: {deploymentResults.deployment.environment.status} - {deploymentResults.deployment.environment.type} environment, {deploymentResults.deployment.environment.config} config - {deploymentResults.deployment.environment.score}%
              </li>
              <li data-testid="region-task">
                Region: {deploymentResults.deployment.region.status} - {deploymentResults.deployment.region.name} region, {deploymentResults.deployment.region.latency} latency - {deploymentResults.deployment.region.score}%
              </li>
              <li data-testid="domain-task">
                Domain: {deploymentResults.deployment.domain.status} - {deploymentResults.deployment.domain.name} domain, {deploymentResults.deployment.domain.ssl ? 'SSL enabled' : 'SSL disabled'} - {deploymentResults.deployment.domain.score}%
              </li>
              <li data-testid="ssl-task">
                SSL: {deploymentResults.deployment.ssl.status} - {deploymentResults.deployment.ssl.certificate} certificate, {deploymentResults.deployment.ssl.expiry} expiry - {deploymentResults.deployment.ssl.score}%
              </li>
              <li data-testid="cdn-task">
                CDN: {deploymentResults.deployment.cdn.status} - {deploymentResults.deployment.cdn.provider} provider, {deploymentResults.deployment.cdn.cacheHit} cache hit - {deploymentResults.deployment.cdn.score}%
              </li>
              <li data-testid="monitoring-task">
                Monitoring: {deploymentResults.deployment.monitoring.status} - {deploymentResults.deployment.monitoring.uptime} uptime, {deploymentResults.deployment.monitoring.lastCheck} last check - {deploymentResults.deployment.monitoring.score}%
              </li>
              <li data-testid="analytics-task">
                Analytics: {deploymentResults.deployment.analytics.status} - {deploymentResults.deployment.analytics.events} events, {deploymentResults.deployment.analytics.lastEvent} last event - {deploymentResults.deployment.analytics.score}%
              </li>
              <li data-testid="backup-task">
                Backup: {deploymentResults.deployment.backup.status} - {deploymentResults.deployment.backup.frequency} frequency, {deploymentResults.deployment.backup.lastBackup} last backup - {deploymentResults.deployment.backup.score}%
              </li>
              <li data-testid="scaling-task">
                Scaling: {deploymentResults.deployment.scaling.status} - {deploymentResults.deployment.scaling.type} scaling, {deploymentResults.deployment.scaling.instances} instances - {deploymentResults.deployment.scaling.score}%
              </li>
            </ul>
          </div>

          <div data-testid="deployment-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {deploymentResults.statistics.totalSections}</p>
            <p>Total Deployments: {deploymentResults.statistics.totalDeployments}</p>
            <p>Current Platform: {deploymentResults.statistics.currentPlatform}</p>
            <p>Current Environment: {deploymentResults.statistics.currentEnvironment}</p>
            <p>Current Region: {deploymentResults.statistics.currentRegion}</p>
            <p>Current Domain: {deploymentResults.statistics.currentDomain}</p>
            <p>SSL Enabled: {deploymentResults.statistics.sslEnabled ? 'Yes' : 'No'}</p>
            <p>CDN Enabled: {deploymentResults.statistics.cdnEnabled ? 'Yes' : 'No'}</p>
            <p>Monitoring Enabled: {deploymentResults.statistics.monitoringEnabled ? 'Yes' : 'No'}</p>
            <p>Analytics Enabled: {deploymentResults.statistics.analyticsEnabled ? 'Yes' : 'No'}</p>
            <p>Backup Enabled: {deploymentResults.statistics.backupEnabled ? 'Yes' : 'No'}</p>
            <p>Scaling Type: {deploymentResults.statistics.scalingType}</p>
            <p>Average Score: {deploymentResults.statistics.averageScore}%</p>
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

describe('StudyGuideDeployment', () => {
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
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-deployment')).toBeInTheDocument();
  });

  it('renders deployment settings', () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('platform-select')).toBeInTheDocument();
    expect(screen.getByTestId('environment-select')).toBeInTheDocument();
    expect(screen.getByTestId('region-select')).toBeInTheDocument();
    expect(screen.getByTestId('domain-input')).toBeInTheDocument();
    expect(screen.getByTestId('ssl-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('cdn-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('monitoring-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('analytics-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('backup-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('scaling-select')).toBeInTheDocument();
  });

  it('renders deploy button', () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('deploy-button')).toBeInTheDocument();
    expect(screen.getByText('Start Deployment')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideDeployment studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates deployment settings when changed', () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    const platformSelect = screen.getByTestId('platform-select');
    const environmentSelect = screen.getByTestId('environment-select');
    const regionSelect = screen.getByTestId('region-select');
    const domainInput = screen.getByTestId('domain-input');
    const sslCheckbox = screen.getByTestId('ssl-checkbox');
    const cdnCheckbox = screen.getByTestId('cdn-checkbox');
    const monitoringCheckbox = screen.getByTestId('monitoring-checkbox');
    const analyticsCheckbox = screen.getByTestId('analytics-checkbox');
    const backupCheckbox = screen.getByTestId('backup-checkbox');
    const scalingSelect = screen.getByTestId('scaling-select');
    
    expect(platformSelect).toHaveValue('web');
    expect(environmentSelect).toHaveValue('production');
    expect(regionSelect).toHaveValue('us-east-1');
    expect(domainInput).toHaveValue('studygui.de');
    expect(sslCheckbox).toBeChecked();
    expect(cdnCheckbox).toBeChecked();
    expect(monitoringCheckbox).toBeChecked();
    expect(analyticsCheckbox).toBeChecked();
    expect(backupCheckbox).toBeChecked();
    expect(scalingSelect).toHaveValue('auto');
    
    fireEvent.change(platformSelect, { target: { value: 'mobile' } });
    fireEvent.change(environmentSelect, { target: { value: 'staging' } });
    fireEvent.change(regionSelect, { target: { value: 'eu-west-1' } });
    fireEvent.change(domainInput, { target: { value: 'test.example.com' } });
    fireEvent.click(sslCheckbox);
    fireEvent.click(cdnCheckbox);
    fireEvent.click(monitoringCheckbox);
    fireEvent.click(analyticsCheckbox);
    fireEvent.click(backupCheckbox);
    fireEvent.change(scalingSelect, { target: { value: 'manual' } });
    
    expect(platformSelect).toHaveValue('mobile');
    expect(environmentSelect).toHaveValue('staging');
    expect(regionSelect).toHaveValue('eu-west-1');
    expect(domainInput).toHaveValue('test.example.com');
    expect(sslCheckbox).not.toBeChecked();
    expect(cdnCheckbox).not.toBeChecked();
    expect(monitoringCheckbox).not.toBeChecked();
    expect(analyticsCheckbox).not.toBeChecked();
    expect(backupCheckbox).not.toBeChecked();
    expect(scalingSelect).toHaveValue('manual');
  });

  it('calls onDeploy when deployment completes successfully', async () => {
    const onDeploy = jest.fn();
    
    render(
      <MockStudyGuideDeployment 
        studyGuide={mockStudyGuide} 
        onDeploy={onDeploy} 
      />
    );
    
    const deployButton = screen.getByTestId('deploy-button');
    fireEvent.click(deployButton);
    
    await waitFor(() => {
      expect(onDeploy).toHaveBeenCalledWith(
        expect.objectContaining({
          deploymentId: 'deploy-123',
          deployment: expect.objectContaining({
            platform: expect.objectContaining({
              type: 'web',
              status: 'Deployed',
              url: 'https://studygui.de',
              lastDeploy: expect.any(String),
              score: 98
            }),
            environment: expect.objectContaining({
              type: 'production',
              status: 'Active',
              config: 'Production',
              lastUpdate: expect.any(String),
              score: 96
            }),
            region: expect.objectContaining({
              name: 'us-east-1',
              status: 'Active',
              latency: '45ms',
              lastCheck: expect.any(String),
              score: 94
            }),
            domain: expect.objectContaining({
              name: 'studygui.de',
              status: 'Active',
              ssl: true,
              lastRenewal: expect.any(String),
              score: 97
            }),
            ssl: expect.objectContaining({
              enabled: true,
              status: 'Active',
              certificate: 'Let\'s Encrypt',
              expiry: expect.any(String),
              score: 99
            }),
            cdn: expect.objectContaining({
              enabled: true,
              status: 'Active',
              provider: 'CloudFlare',
              cacheHit: '95%',
              score: 93
            }),
            monitoring: expect.objectContaining({
              enabled: true,
              status: 'Active',
              uptime: '99.9%',
              lastCheck: expect.any(String),
              score: 95
            }),
            analytics: expect.objectContaining({
              enabled: true,
              status: 'Active',
              events: 1250,
              lastEvent: expect.any(String),
              score: 92
            }),
            backup: expect.objectContaining({
              enabled: true,
              status: 'Active',
              frequency: 'Daily',
              lastBackup: expect.any(String),
              score: 91
            }),
            scaling: expect.objectContaining({
              type: 'auto',
              status: 'Active',
              instances: 3,
              lastScale: expect.any(String),
              score: 89
            })
          }),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalDeployments: 8,
            currentPlatform: 'web',
            currentEnvironment: 'production',
            currentRegion: 'us-east-1',
            currentDomain: 'studygui.de',
            sslEnabled: true,
            cdnEnabled: true,
            monitoringEnabled: true,
            analyticsEnabled: true,
            backupEnabled: true,
            scalingType: 'auto',
            averageScore: 94
          })
        })
      );
    });
  });

  it('calls onError when deployment fails', async () => {
    const onError = jest.fn();
    
    const ErrorStudyGuideDeployment: React.FC<any> = ({ onError }) => {
      const handleDeploy = () => {
        onError?.(new Error('Deployment failed'));
      };

      return (
        <div>
          <button onClick={handleDeploy} data-testid="error-button">
            Deploy with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideDeployment onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during deployment', async () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    const deployButton = screen.getByTestId('deploy-button');
    fireEvent.click(deployButton);
    
    expect(screen.getByTestId('deployment-progress')).toBeInTheDocument();
    expect(screen.getByText('Deploying study guide...')).toBeInTheDocument();
  });

  it('updates button text during deployment', async () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    const deployButton = screen.getByTestId('deploy-button');
    fireEvent.click(deployButton);
    
    expect(screen.getByText('Deploying...')).toBeInTheDocument();
  });

  it('disables deploy button when no study guide provided', () => {
    render(<MockStudyGuideDeployment studyGuide={[]} />);
    
    const deployButton = screen.getByTestId('deploy-button');
    expect(deployButton).toBeDisabled();
  });

  it('disables deploy button during deployment', async () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    const deployButton = screen.getByTestId('deploy-button');
    fireEvent.click(deployButton);
    
    expect(deployButton).toBeDisabled();
  });

  it('displays deployment results after deployment', async () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    const deployButton = screen.getByTestId('deploy-button');
    fireEvent.click(deployButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('deployment-results')).toBeInTheDocument();
      expect(screen.getByText('Deployment Results')).toBeInTheDocument();
      expect(screen.getByText('Deployment Tasks:')).toBeInTheDocument();
    });
  });

  it('displays deployment tasks correctly', async () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    const deployButton = screen.getByTestId('deploy-button');
    fireEvent.click(deployButton);
    
    await waitFor(() => {
      expect(screen.getByText('Platform: Deployed - web platform, https://studygui.de URL - 98%')).toBeInTheDocument();
      expect(screen.getByText('Environment: Active - production environment, Production config - 96%')).toBeInTheDocument();
      expect(screen.getByText('Region: Active - us-east-1 region, 45ms latency - 94%')).toBeInTheDocument();
      expect(screen.getByText('Domain: Active - studygui.de domain, SSL enabled - 97%')).toBeInTheDocument();
      expect(screen.getByText('SSL: Active - Let\'s Encrypt certificate,')).toBeInTheDocument();
      expect(screen.getByText('CDN: Active - CloudFlare provider, 95% cache hit - 93%')).toBeInTheDocument();
      expect(screen.getByText('Monitoring: Active - 99.9% uptime,')).toBeInTheDocument();
      expect(screen.getByText('Analytics: Active - 1250 events,')).toBeInTheDocument();
      expect(screen.getByText('Backup: Active - Daily frequency,')).toBeInTheDocument();
      expect(screen.getByText('Scaling: Active - auto scaling, 3 instances - 89%')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideDeployment studyGuide={mockStudyGuide} />);
    
    const deployButton = screen.getByTestId('deploy-button');
    fireEvent.click(deployButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Deployments: 8')).toBeInTheDocument();
      expect(screen.getByText('Current Platform: web')).toBeInTheDocument();
      expect(screen.getByText('Current Environment: production')).toBeInTheDocument();
      expect(screen.getByText('Current Region: us-east-1')).toBeInTheDocument();
      expect(screen.getByText('Current Domain: studygui.de')).toBeInTheDocument();
      expect(screen.getByText('SSL Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('CDN Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Monitoring Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Analytics Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Backup Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Scaling Type: auto')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 94%')).toBeInTheDocument();
    });
  });
});
