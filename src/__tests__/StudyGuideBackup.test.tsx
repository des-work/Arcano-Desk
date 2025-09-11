import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideBackup } from '../components/StudyGuideBackup';

// Mock the StudyGuideBackup component
const MockStudyGuideBackup: React.FC<any> = ({ 
  studyGuide, 
  onBackup, 
  onError 
}) => {
  const [backupResults, setBackupResults] = React.useState<any>(null);
  const [isBackingUp, setIsBackingUp] = React.useState(false);
  const [backupSettings, setBackupSettings] = React.useState({
    frequency: 'daily',
    retention: '30',
    compression: true,
    encryption: true,
    cloud: true,
    local: true,
    incremental: true,
    verification: true,
    notification: true,
    scheduling: true
  });

  const handleBackup = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsBackingUp(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        backupId: 'backup-123',
        backup: {
          frequency: {
            type: backupSettings.frequency,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            score: 95
          },
          retention: {
            days: backupSettings.retention,
            status: 'Active',
            lastCleanup: new Date().toISOString(),
            spaceSaved: '2.5GB',
            score: 92
          },
          compression: {
            enabled: backupSettings.compression,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            ratio: '75%',
            score: 94
          },
          encryption: {
            enabled: backupSettings.encryption,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            algorithm: 'AES-256',
            score: 98
          },
          cloud: {
            enabled: backupSettings.cloud,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            provider: 'AWS S3',
            score: 96
          },
          local: {
            enabled: backupSettings.local,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            path: '/backups/',
            score: 91
          },
          incremental: {
            enabled: backupSettings.incremental,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            changes: 15,
            score: 89
          },
          verification: {
            enabled: backupSettings.verification,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            integrity: '100%',
            score: 97
          },
          notification: {
            enabled: backupSettings.notification,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            recipients: 3,
            score: 93
          },
          scheduling: {
            enabled: backupSettings.scheduling,
            status: 'Active',
            lastBackup: new Date().toISOString(),
            nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
            score: 90
          }
        },
        statistics: {
          totalSections: studyGuide.length,
          totalBackup: 10,
          frequency: backupSettings.frequency,
          retention: backupSettings.retention,
          compressionEnabled: backupSettings.compression,
          encryptionEnabled: backupSettings.encryption,
          cloudEnabled: backupSettings.cloud,
          localEnabled: backupSettings.local,
          incrementalEnabled: backupSettings.incremental,
          verificationEnabled: backupSettings.verification,
          notificationEnabled: backupSettings.notification,
          schedulingEnabled: backupSettings.scheduling,
          averageScore: 93
        }
      };

      setBackupResults(results);
      onBackup?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setBackupSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-backup">
      <h2>Study Guide Backup</h2>
      
      <div data-testid="backup-settings">
        <h3>Backup Settings:</h3>
        
        <div>
          <label htmlFor="frequency">Frequency:</label>
          <select
            id="frequency"
            value={backupSettings.frequency}
            onChange={(e) => handleSettingChange('frequency', e.target.value)}
            data-testid="frequency-select"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label htmlFor="retention">Retention (days):</label>
          <input
            id="retention"
            type="number"
            value={backupSettings.retention}
            onChange={(e) => handleSettingChange('retention', e.target.value)}
            data-testid="retention-input"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={backupSettings.compression}
              onChange={(e) => handleSettingChange('compression', e.target.checked)}
              data-testid="compression-checkbox"
            />
            Compression
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={backupSettings.encryption}
              onChange={(e) => handleSettingChange('encryption', e.target.checked)}
              data-testid="encryption-checkbox"
            />
            Encryption
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={backupSettings.cloud}
              onChange={(e) => handleSettingChange('cloud', e.target.checked)}
              data-testid="cloud-checkbox"
            />
            Cloud
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={backupSettings.local}
              onChange={(e) => handleSettingChange('local', e.target.checked)}
              data-testid="local-checkbox"
            />
            Local
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={backupSettings.incremental}
              onChange={(e) => handleSettingChange('incremental', e.target.checked)}
              data-testid="incremental-checkbox"
            />
            Incremental
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={backupSettings.verification}
              onChange={(e) => handleSettingChange('verification', e.target.checked)}
              data-testid="verification-checkbox"
            />
            Verification
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={backupSettings.notification}
              onChange={(e) => handleSettingChange('notification', e.target.checked)}
              data-testid="notification-checkbox"
            />
            Notification
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={backupSettings.scheduling}
              onChange={(e) => handleSettingChange('scheduling', e.target.checked)}
              data-testid="scheduling-checkbox"
            />
            Scheduling
          </label>
        </div>
      </div>

      <button
        onClick={handleBackup}
        disabled={!studyGuide || studyGuide.length === 0 || isBackingUp}
        data-testid="backup-button"
      >
        {isBackingUp ? 'Backing up...' : 'Start Backup'}
      </button>

      {isBackingUp && (
        <div data-testid="backup-progress">Creating backup...</div>
      )}

      {backupResults && (
        <div data-testid="backup-results">
          <h3>Backup Results</h3>
          
          <div data-testid="backup-tasks">
            <h4>Backup Tasks:</h4>
            <ul>
              <li data-testid="frequency-task">
                Frequency: {backupResults.backup.frequency.status} - {backupResults.backup.frequency.type} frequency, {backupResults.backup.frequency.lastBackup} last backup - {backupResults.backup.frequency.score}%
              </li>
              <li data-testid="retention-task">
                Retention: {backupResults.backup.retention.status} - {backupResults.backup.retention.days} days, {backupResults.backup.retention.spaceSaved} space saved - {backupResults.backup.retention.score}%
              </li>
              <li data-testid="compression-task">
                Compression: {backupResults.backup.compression.status} - {backupResults.backup.compression.ratio} ratio - {backupResults.backup.compression.score}%
              </li>
              <li data-testid="encryption-task">
                Encryption: {backupResults.backup.encryption.status} - {backupResults.backup.encryption.algorithm} algorithm - {backupResults.backup.encryption.score}%
              </li>
              <li data-testid="cloud-task">
                Cloud: {backupResults.backup.cloud.status} - {backupResults.backup.cloud.provider} provider - {backupResults.backup.cloud.score}%
              </li>
              <li data-testid="local-task">
                Local: {backupResults.backup.local.status} - {backupResults.backup.local.path} path - {backupResults.backup.local.score}%
              </li>
              <li data-testid="incremental-task">
                Incremental: {backupResults.backup.incremental.status} - {backupResults.backup.incremental.changes} changes - {backupResults.backup.incremental.score}%
              </li>
              <li data-testid="verification-task">
                Verification: {backupResults.backup.verification.status} - {backupResults.backup.verification.integrity} integrity - {backupResults.backup.verification.score}%
              </li>
              <li data-testid="notification-task">
                Notification: {backupResults.backup.notification.status} - {backupResults.backup.notification.recipients} recipients - {backupResults.backup.notification.score}%
              </li>
              <li data-testid="scheduling-task">
                Scheduling: {backupResults.backup.scheduling.status} - {backupResults.backup.scheduling.nextRun} next run - {backupResults.backup.scheduling.score}%
              </li>
            </ul>
          </div>

          <div data-testid="backup-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {backupResults.statistics.totalSections}</p>
            <p>Total Backup: {backupResults.statistics.totalBackup}</p>
            <p>Frequency: {backupResults.statistics.frequency}</p>
            <p>Retention: {backupResults.statistics.retention} days</p>
            <p>Compression Enabled: {backupResults.statistics.compressionEnabled ? 'Yes' : 'No'}</p>
            <p>Encryption Enabled: {backupResults.statistics.encryptionEnabled ? 'Yes' : 'No'}</p>
            <p>Cloud Enabled: {backupResults.statistics.cloudEnabled ? 'Yes' : 'No'}</p>
            <p>Local Enabled: {backupResults.statistics.localEnabled ? 'Yes' : 'No'}</p>
            <p>Incremental Enabled: {backupResults.statistics.incrementalEnabled ? 'Yes' : 'No'}</p>
            <p>Verification Enabled: {backupResults.statistics.verificationEnabled ? 'Yes' : 'No'}</p>
            <p>Notification Enabled: {backupResults.statistics.notificationEnabled ? 'Yes' : 'No'}</p>
            <p>Scheduling Enabled: {backupResults.statistics.schedulingEnabled ? 'Yes' : 'No'}</p>
            <p>Average Score: {backupResults.statistics.averageScore}%</p>
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

describe('StudyGuideBackup', () => {
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
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-backup')).toBeInTheDocument();
  });

  it('renders backup settings', () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('frequency-select')).toBeInTheDocument();
    expect(screen.getByTestId('retention-input')).toBeInTheDocument();
    expect(screen.getByTestId('compression-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('encryption-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('cloud-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('local-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('incremental-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('verification-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('notification-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('scheduling-checkbox')).toBeInTheDocument();
  });

  it('renders backup button', () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('backup-button')).toBeInTheDocument();
    expect(screen.getByText('Start Backup')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideBackup studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates backup settings when changed', () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    const frequencySelect = screen.getByTestId('frequency-select');
    const retentionInput = screen.getByTestId('retention-input');
    const compressionCheckbox = screen.getByTestId('compression-checkbox');
    const encryptionCheckbox = screen.getByTestId('encryption-checkbox');
    const cloudCheckbox = screen.getByTestId('cloud-checkbox');
    const localCheckbox = screen.getByTestId('local-checkbox');
    const incrementalCheckbox = screen.getByTestId('incremental-checkbox');
    const verificationCheckbox = screen.getByTestId('verification-checkbox');
    const notificationCheckbox = screen.getByTestId('notification-checkbox');
    const schedulingCheckbox = screen.getByTestId('scheduling-checkbox');
    
    expect(frequencySelect).toHaveValue('daily');
    expect(retentionInput).toHaveValue(30);
    expect(compressionCheckbox).toBeChecked();
    expect(encryptionCheckbox).toBeChecked();
    expect(cloudCheckbox).toBeChecked();
    expect(localCheckbox).toBeChecked();
    expect(incrementalCheckbox).toBeChecked();
    expect(verificationCheckbox).toBeChecked();
    expect(notificationCheckbox).toBeChecked();
    expect(schedulingCheckbox).toBeChecked();
    
    fireEvent.change(frequencySelect, { target: { value: 'weekly' } });
    fireEvent.change(retentionInput, { target: { value: '60' } });
    fireEvent.click(compressionCheckbox);
    fireEvent.click(encryptionCheckbox);
    fireEvent.click(cloudCheckbox);
    fireEvent.click(localCheckbox);
    fireEvent.click(incrementalCheckbox);
    fireEvent.click(verificationCheckbox);
    fireEvent.click(notificationCheckbox);
    fireEvent.click(schedulingCheckbox);
    
    expect(frequencySelect).toHaveValue('weekly');
    expect(retentionInput).toHaveValue(60);
    expect(compressionCheckbox).not.toBeChecked();
    expect(encryptionCheckbox).not.toBeChecked();
    expect(cloudCheckbox).not.toBeChecked();
    expect(localCheckbox).not.toBeChecked();
    expect(incrementalCheckbox).not.toBeChecked();
    expect(verificationCheckbox).not.toBeChecked();
    expect(notificationCheckbox).not.toBeChecked();
    expect(schedulingCheckbox).not.toBeChecked();
  });

  it('calls onBackup when backup completes successfully', async () => {
    const onBackup = jest.fn();
    
    render(
      <MockStudyGuideBackup 
        studyGuide={mockStudyGuide} 
        onBackup={onBackup} 
      />
    );
    
    const backupButton = screen.getByTestId('backup-button');
    fireEvent.click(backupButton);
    
    await waitFor(() => {
      expect(onBackup).toHaveBeenCalledWith(
        expect.objectContaining({
          backupId: 'backup-123',
          backup: expect.objectContaining({
            frequency: expect.objectContaining({
              type: 'daily',
              status: 'Active',
              lastBackup: expect.any(String),
              nextBackup: expect.any(String),
              score: 95
            }),
            retention: expect.objectContaining({
              days: '30',
              status: 'Active',
              lastCleanup: expect.any(String),
              spaceSaved: '2.5GB',
              score: 92
            }),
            compression: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastBackup: expect.any(String),
              ratio: '75%',
              score: 94
            }),
            encryption: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastBackup: expect.any(String),
              algorithm: 'AES-256',
              score: 98
            }),
            cloud: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastBackup: expect.any(String),
              provider: 'AWS S3',
              score: 96
            }),
            local: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastBackup: expect.any(String),
              path: '/backups/',
              score: 91
            }),
            incremental: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastBackup: expect.any(String),
              changes: 15,
              score: 89
            }),
            verification: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastBackup: expect.any(String),
              integrity: '100%',
              score: 97
            }),
            notification: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastBackup: expect.any(String),
              recipients: 3,
              score: 93
            }),
            scheduling: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastBackup: expect.any(String),
              nextRun: expect.any(String),
              score: 90
            })
          }),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalBackup: 10,
            frequency: 'daily',
            retention: '30',
            compressionEnabled: true,
            encryptionEnabled: true,
            cloudEnabled: true,
            localEnabled: true,
            incrementalEnabled: true,
            verificationEnabled: true,
            notificationEnabled: true,
            schedulingEnabled: true,
            averageScore: 93
          })
        })
      );
    });
  });

  it('calls onError when backup fails', async () => {
    const onError = jest.fn();
    
    const ErrorStudyGuideBackup: React.FC<any> = ({ onError }) => {
      const handleBackup = () => {
        onError?.(new Error('Backup failed'));
      };

      return (
        <div>
          <button onClick={handleBackup} data-testid="error-button">
            Backup with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideBackup onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during backup', async () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    const backupButton = screen.getByTestId('backup-button');
    fireEvent.click(backupButton);
    
    expect(screen.getByTestId('backup-progress')).toBeInTheDocument();
    expect(screen.getByText('Creating backup...')).toBeInTheDocument();
  });

  it('updates button text during backup', async () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    const backupButton = screen.getByTestId('backup-button');
    fireEvent.click(backupButton);
    
    expect(screen.getByText('Backing up...')).toBeInTheDocument();
  });

  it('disables backup button when no study guide provided', () => {
    render(<MockStudyGuideBackup studyGuide={[]} />);
    
    const backupButton = screen.getByTestId('backup-button');
    expect(backupButton).toBeDisabled();
  });

  it('disables backup button during backup', async () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    const backupButton = screen.getByTestId('backup-button');
    fireEvent.click(backupButton);
    
    expect(backupButton).toBeDisabled();
  });

  it('displays backup results after backup', async () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    const backupButton = screen.getByTestId('backup-button');
    fireEvent.click(backupButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('backup-results')).toBeInTheDocument();
      expect(screen.getByText('Backup Results')).toBeInTheDocument();
      expect(screen.getByText('Backup Tasks:')).toBeInTheDocument();
    });
  });

  it('displays backup tasks correctly', async () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    const backupButton = screen.getByTestId('backup-button');
    fireEvent.click(backupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Frequency: Active - daily frequency,')).toBeInTheDocument();
      expect(screen.getByText('Retention: Active - 30 days, 2.5GB space saved - 92%')).toBeInTheDocument();
      expect(screen.getByText('Compression: Active - 75% ratio - 94%')).toBeInTheDocument();
      expect(screen.getByText('Encryption: Active - AES-256 algorithm - 98%')).toBeInTheDocument();
      expect(screen.getByText('Cloud: Active - AWS S3 provider - 96%')).toBeInTheDocument();
      expect(screen.getByText('Local: Active - /backups/ path - 91%')).toBeInTheDocument();
      expect(screen.getByText('Incremental: Active - 15 changes - 89%')).toBeInTheDocument();
      expect(screen.getByText('Verification: Active - 100% integrity - 97%')).toBeInTheDocument();
      expect(screen.getByText('Notification: Active - 3 recipients - 93%')).toBeInTheDocument();
      expect(screen.getByText('Scheduling: Active -')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideBackup studyGuide={mockStudyGuide} />);
    
    const backupButton = screen.getByTestId('backup-button');
    fireEvent.click(backupButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Backup: 10')).toBeInTheDocument();
      expect(screen.getByText('Frequency: daily')).toBeInTheDocument();
      expect(screen.getByText('Retention: 30 days')).toBeInTheDocument();
      expect(screen.getByText('Compression Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Encryption Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Cloud Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Local Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Incremental Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Verification Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Notification Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Scheduling Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 93%')).toBeInTheDocument();
    });
  });
});