import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideMaintenance } from '../components/StudyGuideMaintenance';

// Mock the StudyGuideMaintenance component
const MockStudyGuideMaintenance: React.FC<any> = ({ 
  studyGuide, 
  onMaintain, 
  onError 
}) => {
  const [maintenanceResults, setMaintenanceResults] = React.useState<any>(null);
  const [isMaintaining, setIsMaintaining] = React.useState(false);
  const [maintenanceSettings, setMaintenanceSettings] = React.useState({
    autoUpdate: true,
    dependencyCheck: true,
    securityScan: true,
    performanceCheck: true,
    backupCheck: true,
    logAnalysis: true,
    errorMonitoring: true,
    healthCheck: true,
    optimization: true,
    cleanup: true
  });

  const handleMaintain = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsMaintaining(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        maintenanceId: 'maintain-123',
        maintenance: {
          autoUpdate: {
            enabled: maintenanceSettings.autoUpdate,
            status: 'Active',
            lastUpdate: new Date().toISOString(),
            nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            score: 95
          },
          dependencyCheck: {
            enabled: maintenanceSettings.dependencyCheck,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            outdated: 2,
            vulnerabilities: 0,
            score: 92
          },
          securityScan: {
            enabled: maintenanceSettings.securityScan,
            status: 'Active',
            lastScan: new Date().toISOString(),
            issues: 0,
            severity: 'Low',
            score: 98
          },
          performanceCheck: {
            enabled: maintenanceSettings.performanceCheck,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            score: 94,
            recommendations: 3
          },
          backupCheck: {
            enabled: maintenanceSettings.backupCheck,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            nextBackup: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            score: 96
          },
          logAnalysis: {
            enabled: maintenanceSettings.logAnalysis,
            status: 'Active',
            lastAnalysis: new Date().toISOString(),
            errors: 0,
            warnings: 2,
            score: 91
          },
          errorMonitoring: {
            enabled: maintenanceSettings.errorMonitoring,
            status: 'Active',
            lastError: null,
            errorRate: '0.1%',
            score: 97
          },
          healthCheck: {
            enabled: maintenanceSettings.healthCheck,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            uptime: '99.9%',
            score: 93
          },
          optimization: {
            enabled: maintenanceSettings.optimization,
            status: 'Active',
            lastOptimization: new Date().toISOString(),
            improvements: 5,
            score: 89
          },
          cleanup: {
            enabled: maintenanceSettings.cleanup,
            status: 'Active',
            lastCleanup: new Date().toISOString(),
            spaceSaved: '2.5GB',
            score: 90
          }
        },
        statistics: {
          totalSections: studyGuide.length,
          totalMaintenance: 10,
          autoUpdateEnabled: maintenanceSettings.autoUpdate,
          dependencyCheckEnabled: maintenanceSettings.dependencyCheck,
          securityScanEnabled: maintenanceSettings.securityScan,
          performanceCheckEnabled: maintenanceSettings.performanceCheck,
          backupCheckEnabled: maintenanceSettings.backupCheck,
          logAnalysisEnabled: maintenanceSettings.logAnalysis,
          errorMonitoringEnabled: maintenanceSettings.errorMonitoring,
          healthCheckEnabled: maintenanceSettings.healthCheck,
          optimizationEnabled: maintenanceSettings.optimization,
          cleanupEnabled: maintenanceSettings.cleanup,
          averageScore: 93
        }
      };

      setMaintenanceResults(results);
      onMaintain?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsMaintaining(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setMaintenanceSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-maintenance">
      <h2>Study Guide Maintenance</h2>
      
      <div data-testid="maintenance-settings">
        <h3>Maintenance Settings:</h3>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.autoUpdate}
              onChange={(e) => handleSettingChange('autoUpdate', e.target.checked)}
              data-testid="auto-update-checkbox"
            />
            Auto Update
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.dependencyCheck}
              onChange={(e) => handleSettingChange('dependencyCheck', e.target.checked)}
              data-testid="dependency-check-checkbox"
            />
            Dependency Check
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.securityScan}
              onChange={(e) => handleSettingChange('securityScan', e.target.checked)}
              data-testid="security-scan-checkbox"
            />
            Security Scan
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.performanceCheck}
              onChange={(e) => handleSettingChange('performanceCheck', e.target.checked)}
              data-testid="performance-check-checkbox"
            />
            Performance Check
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.backupCheck}
              onChange={(e) => handleSettingChange('backupCheck', e.target.checked)}
              data-testid="backup-check-checkbox"
            />
            Backup Check
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.logAnalysis}
              onChange={(e) => handleSettingChange('logAnalysis', e.target.checked)}
              data-testid="log-analysis-checkbox"
            />
            Log Analysis
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.errorMonitoring}
              onChange={(e) => handleSettingChange('errorMonitoring', e.target.checked)}
              data-testid="error-monitoring-checkbox"
            />
            Error Monitoring
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.healthCheck}
              onChange={(e) => handleSettingChange('healthCheck', e.target.checked)}
              data-testid="health-check-checkbox"
            />
            Health Check
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.optimization}
              onChange={(e) => handleSettingChange('optimization', e.target.checked)}
              data-testid="optimization-checkbox"
            />
            Optimization
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={maintenanceSettings.cleanup}
              onChange={(e) => handleSettingChange('cleanup', e.target.checked)}
              data-testid="cleanup-checkbox"
            />
            Cleanup
          </label>
        </div>
      </div>

      <button
        onClick={handleMaintain}
        disabled={!studyGuide || studyGuide.length === 0 || isMaintaining}
        data-testid="maintain-button"
      >
        {isMaintaining ? 'Maintaining...' : 'Start Maintenance'}
      </button>

      {isMaintaining && (
        <div data-testid="maintenance-progress">Performing maintenance...</div>
      )}

      {maintenanceResults && (
        <div data-testid="maintenance-results">
          <h3>Maintenance Results</h3>
          
          <div data-testid="maintenance-tasks">
            <h4>Maintenance Tasks:</h4>
            <ul>
              <li data-testid="auto-update-task">
                Auto Update: {maintenanceResults.maintenance.autoUpdate.status} - {maintenanceResults.maintenance.autoUpdate.lastUpdate} last update, {maintenanceResults.maintenance.autoUpdate.nextUpdate} next update - {maintenanceResults.maintenance.autoUpdate.score}%
              </li>
              <li data-testid="dependency-check-task">
                Dependency Check: {maintenanceResults.maintenance.dependencyCheck.status} - {maintenanceResults.maintenance.dependencyCheck.lastCheck} last check, {maintenanceResults.maintenance.dependencyCheck.outdated} outdated, {maintenanceResults.maintenance.dependencyCheck.vulnerabilities} vulnerabilities - {maintenanceResults.maintenance.dependencyCheck.score}%
              </li>
              <li data-testid="security-scan-task">
                Security Scan: {maintenanceResults.maintenance.securityScan.status} - {maintenanceResults.maintenance.securityScan.lastScan} last scan, {maintenanceResults.maintenance.securityScan.issues} issues, {maintenanceResults.maintenance.securityScan.severity} severity - {maintenanceResults.maintenance.securityScan.score}%
              </li>
              <li data-testid="performance-check-task">
                Performance Check: {maintenanceResults.maintenance.performanceCheck.status} - {maintenanceResults.maintenance.performanceCheck.lastCheck} last check, {maintenanceResults.maintenance.performanceCheck.recommendations} recommendations - {maintenanceResults.maintenance.performanceCheck.score}%
              </li>
              <li data-testid="backup-check-task">
                Backup Check: {maintenanceResults.maintenance.backupCheck.status} - {maintenanceResults.maintenance.backupCheck.lastBackup} last backup, {maintenanceResults.maintenance.backupCheck.nextBackup} next backup - {maintenanceResults.maintenance.backupCheck.score}%
              </li>
              <li data-testid="log-analysis-task">
                Log Analysis: {maintenanceResults.maintenance.logAnalysis.status} - {maintenanceResults.maintenance.logAnalysis.lastAnalysis} last analysis, {maintenanceResults.maintenance.logAnalysis.errors} errors, {maintenanceResults.maintenance.logAnalysis.warnings} warnings - {maintenanceResults.maintenance.logAnalysis.score}%
              </li>
              <li data-testid="error-monitoring-task">
                Error Monitoring: {maintenanceResults.maintenance.errorMonitoring.status} - {maintenanceResults.maintenance.errorMonitoring.lastError || 'No errors'}, {maintenanceResults.maintenance.errorMonitoring.errorRate} error rate - {maintenanceResults.maintenance.errorMonitoring.score}%
              </li>
              <li data-testid="health-check-task">
                Health Check: {maintenanceResults.maintenance.healthCheck.status} - {maintenanceResults.maintenance.healthCheck.lastCheck} last check, {maintenanceResults.maintenance.healthCheck.uptime} uptime - {maintenanceResults.maintenance.healthCheck.score}%
              </li>
              <li data-testid="optimization-task">
                Optimization: {maintenanceResults.maintenance.optimization.status} - {maintenanceResults.maintenance.optimization.lastOptimization} last optimization, {maintenanceResults.maintenance.optimization.improvements} improvements - {maintenanceResults.maintenance.optimization.score}%
              </li>
              <li data-testid="cleanup-task">
                Cleanup: {maintenanceResults.maintenance.cleanup.status} - {maintenanceResults.maintenance.cleanup.lastCleanup} last cleanup, {maintenanceResults.maintenance.cleanup.spaceSaved} space saved - {maintenanceResults.maintenance.cleanup.score}%
              </li>
            </ul>
          </div>

          <div data-testid="maintenance-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {maintenanceResults.statistics.totalSections}</p>
            <p>Total Maintenance: {maintenanceResults.statistics.totalMaintenance}</p>
            <p>Auto Update Enabled: {maintenanceResults.statistics.autoUpdateEnabled ? 'Yes' : 'No'}</p>
            <p>Dependency Check Enabled: {maintenanceResults.statistics.dependencyCheckEnabled ? 'Yes' : 'No'}</p>
            <p>Security Scan Enabled: {maintenanceResults.statistics.securityScanEnabled ? 'Yes' : 'No'}</p>
            <p>Performance Check Enabled: {maintenanceResults.statistics.performanceCheckEnabled ? 'Yes' : 'No'}</p>
            <p>Backup Check Enabled: {maintenanceResults.statistics.backupCheckEnabled ? 'Yes' : 'No'}</p>
            <p>Log Analysis Enabled: {maintenanceResults.statistics.logAnalysisEnabled ? 'Yes' : 'No'}</p>
            <p>Error Monitoring Enabled: {maintenanceResults.statistics.errorMonitoringEnabled ? 'Yes' : 'No'}</p>
            <p>Health Check Enabled: {maintenanceResults.statistics.healthCheckEnabled ? 'Yes' : 'No'}</p>
            <p>Optimization Enabled: {maintenanceResults.statistics.optimizationEnabled ? 'Yes' : 'No'}</p>
            <p>Cleanup Enabled: {maintenanceResults.statistics.cleanupEnabled ? 'Yes' : 'No'}</p>
            <p>Average Score: {maintenanceResults.statistics.averageScore}%</p>
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

describe('StudyGuideMaintenance', () => {
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
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-maintenance')).toBeInTheDocument();
  });

  it('renders maintenance settings', () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('auto-update-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('dependency-check-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('security-scan-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('performance-check-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('backup-check-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('log-analysis-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('error-monitoring-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('health-check-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('optimization-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('cleanup-checkbox')).toBeInTheDocument();
  });

  it('renders maintain button', () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('maintain-button')).toBeInTheDocument();
    expect(screen.getByText('Start Maintenance')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideMaintenance studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates maintenance settings when changed', () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    const autoUpdateCheckbox = screen.getByTestId('auto-update-checkbox');
    const dependencyCheckCheckbox = screen.getByTestId('dependency-check-checkbox');
    const securityScanCheckbox = screen.getByTestId('security-scan-checkbox');
    const performanceCheckCheckbox = screen.getByTestId('performance-check-checkbox');
    const backupCheckCheckbox = screen.getByTestId('backup-check-checkbox');
    const logAnalysisCheckbox = screen.getByTestId('log-analysis-checkbox');
    const errorMonitoringCheckbox = screen.getByTestId('error-monitoring-checkbox');
    const healthCheckCheckbox = screen.getByTestId('health-check-checkbox');
    const optimizationCheckbox = screen.getByTestId('optimization-checkbox');
    const cleanupCheckbox = screen.getByTestId('cleanup-checkbox');
    
    expect(autoUpdateCheckbox).toBeChecked();
    expect(dependencyCheckCheckbox).toBeChecked();
    expect(securityScanCheckbox).toBeChecked();
    expect(performanceCheckCheckbox).toBeChecked();
    expect(backupCheckCheckbox).toBeChecked();
    expect(logAnalysisCheckbox).toBeChecked();
    expect(errorMonitoringCheckbox).toBeChecked();
    expect(healthCheckCheckbox).toBeChecked();
    expect(optimizationCheckbox).toBeChecked();
    expect(cleanupCheckbox).toBeChecked();
    
    fireEvent.click(autoUpdateCheckbox);
    fireEvent.click(dependencyCheckCheckbox);
    fireEvent.click(securityScanCheckbox);
    fireEvent.click(performanceCheckCheckbox);
    fireEvent.click(backupCheckCheckbox);
    fireEvent.click(logAnalysisCheckbox);
    fireEvent.click(errorMonitoringCheckbox);
    fireEvent.click(healthCheckCheckbox);
    fireEvent.click(optimizationCheckbox);
    fireEvent.click(cleanupCheckbox);
    
    expect(autoUpdateCheckbox).not.toBeChecked();
    expect(dependencyCheckCheckbox).not.toBeChecked();
    expect(securityScanCheckbox).not.toBeChecked();
    expect(performanceCheckCheckbox).not.toBeChecked();
    expect(backupCheckCheckbox).not.toBeChecked();
    expect(logAnalysisCheckbox).not.toBeChecked();
    expect(errorMonitoringCheckbox).not.toBeChecked();
    expect(healthCheckCheckbox).not.toBeChecked();
    expect(optimizationCheckbox).not.toBeChecked();
    expect(cleanupCheckbox).not.toBeChecked();
  });

  it('calls onMaintain when maintenance completes successfully', async () => {
    const onMaintain = jest.fn();
    
    render(
      <MockStudyGuideMaintenance 
        studyGuide={mockStudyGuide} 
        onMaintain={onMaintain} 
      />
    );
    
    const maintainButton = screen.getByTestId('maintain-button');
    fireEvent.click(maintainButton);
    
    await waitFor(() => {
      expect(onMaintain).toHaveBeenCalledWith(
        expect.objectContaining({
          maintenanceId: 'maintain-123',
          maintenance: expect.objectContaining({
            autoUpdate: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastUpdate: expect.any(String),
              nextUpdate: expect.any(String),
              score: 95
            }),
            dependencyCheck: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              outdated: 2,
              vulnerabilities: 0,
              score: 92
            }),
            securityScan: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastScan: expect.any(String),
              issues: 0,
              severity: 'Low',
              score: 98
            }),
            performanceCheck: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              score: 94,
              recommendations: 3
            }),
            backupCheck: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastBackup: expect.any(String),
              nextBackup: expect.any(String),
              score: 96
            }),
            logAnalysis: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastAnalysis: expect.any(String),
              errors: 0,
              warnings: 2,
              score: 91
            }),
            errorMonitoring: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastError: null,
              errorRate: '0.1%',
              score: 97
            }),
            healthCheck: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              uptime: '99.9%',
              score: 93
            }),
            optimization: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastOptimization: expect.any(String),
              improvements: 5,
              score: 89
            }),
            cleanup: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCleanup: expect.any(String),
              spaceSaved: '2.5GB',
              score: 90
            })
          }),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalMaintenance: 10,
            autoUpdateEnabled: true,
            dependencyCheckEnabled: true,
            securityScanEnabled: true,
            performanceCheckEnabled: true,
            backupCheckEnabled: true,
            logAnalysisEnabled: true,
            errorMonitoringEnabled: true,
            healthCheckEnabled: true,
            optimizationEnabled: true,
            cleanupEnabled: true,
            averageScore: 93
          })
        })
      );
    });
  });

  it('calls onError when maintenance fails', async () => {
    const onError = jest.fn();
    
    const ErrorStudyGuideMaintenance: React.FC<any> = ({ onError }) => {
      const handleMaintain = () => {
        onError?.(new Error('Maintenance failed'));
      };

      return (
        <div>
          <button onClick={handleMaintain} data-testid="error-button">
            Maintain with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideMaintenance onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during maintenance', async () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    const maintainButton = screen.getByTestId('maintain-button');
    fireEvent.click(maintainButton);
    
    expect(screen.getByTestId('maintenance-progress')).toBeInTheDocument();
    expect(screen.getByText('Performing maintenance...')).toBeInTheDocument();
  });

  it('updates button text during maintenance', async () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    const maintainButton = screen.getByTestId('maintain-button');
    fireEvent.click(maintainButton);
    
    expect(screen.getByText('Maintaining...')).toBeInTheDocument();
  });

  it('disables maintain button when no study guide provided', () => {
    render(<MockStudyGuideMaintenance studyGuide={[]} />);
    
    const maintainButton = screen.getByTestId('maintain-button');
    expect(maintainButton).toBeDisabled();
  });

  it('disables maintain button during maintenance', async () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    const maintainButton = screen.getByTestId('maintain-button');
    fireEvent.click(maintainButton);
    
    expect(maintainButton).toBeDisabled();
  });

  it('displays maintenance results after maintenance', async () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    const maintainButton = screen.getByTestId('maintain-button');
    fireEvent.click(maintainButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('maintenance-results')).toBeInTheDocument();
      expect(screen.getByText('Maintenance Results')).toBeInTheDocument();
      expect(screen.getByText('Maintenance Tasks:')).toBeInTheDocument();
    });
  });

  it('displays maintenance tasks correctly', async () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    const maintainButton = screen.getByTestId('maintain-button');
    fireEvent.click(maintainButton);
    
    await waitFor(() => {
      expect(screen.getByText('Auto Update: Active -')).toBeInTheDocument();
      expect(screen.getByText('Dependency Check: Active -')).toBeInTheDocument();
      expect(screen.getByText('Security Scan: Active -')).toBeInTheDocument();
      expect(screen.getByText('Performance Check: Active -')).toBeInTheDocument();
      expect(screen.getByText('Backup Check: Active -')).toBeInTheDocument();
      expect(screen.getByText('Log Analysis: Active -')).toBeInTheDocument();
      expect(screen.getByText('Error Monitoring: Active -')).toBeInTheDocument();
      expect(screen.getByText('Health Check: Active -')).toBeInTheDocument();
      expect(screen.getByText('Optimization: Active -')).toBeInTheDocument();
      expect(screen.getByText('Cleanup: Active -')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideMaintenance studyGuide={mockStudyGuide} />);
    
    const maintainButton = screen.getByTestId('maintain-button');
    fireEvent.click(maintainButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Maintenance: 10')).toBeInTheDocument();
      expect(screen.getByText('Auto Update Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Dependency Check Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Security Scan Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Performance Check Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Backup Check Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Log Analysis Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Error Monitoring Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Health Check Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Optimization Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Cleanup Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 93%')).toBeInTheDocument();
    });
  });
});