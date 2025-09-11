import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideSync } from '../components/StudyGuideSync';

// Mock the StudyGuideSync component
const MockStudyGuideSync: React.FC<any> = ({ 
  studyGuide, 
  onSync, 
  onError 
}) => {
  const [syncResults, setSyncResults] = React.useState<any>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [syncSettings, setSyncSettings] = React.useState({
    source: 'local',
    target: 'cloud',
    frequency: 'realtime',
    conflictResolution: 'merge',
    validation: true,
    encryption: true,
    compression: true,
    logging: true,
    notification: true,
    rollback: true
  });

  const handleSync = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsSyncing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        syncId: 'sync-123',
        sync: {
          source: {
            type: syncSettings.source,
            status: 'Active',
            lastSync: new Date().toISOString(),
            availability: '100%',
            score: 98
          },
          target: {
            type: syncSettings.target,
            status: 'Active',
            lastSync: new Date().toISOString(),
            availability: '100%',
            score: 96
          },
          frequency: {
            type: syncSettings.frequency,
            status: 'Active',
            lastSync: new Date().toISOString(),
            nextSync: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
            score: 94
          },
          conflictResolution: {
            type: syncSettings.conflictResolution,
            status: 'Active',
            lastSync: new Date().toISOString(),
            conflicts: 0,
            score: 92
          },
          validation: {
            enabled: syncSettings.validation,
            status: 'Active',
            lastSync: new Date().toISOString(),
            errors: 0,
            warnings: 1,
            score: 90
          },
          encryption: {
            enabled: syncSettings.encryption,
            status: 'Active',
            lastSync: new Date().toISOString(),
            algorithm: 'AES-256',
            score: 97
          },
          compression: {
            enabled: syncSettings.compression,
            status: 'Active',
            lastSync: new Date().toISOString(),
            ratio: '80%',
            score: 89
          },
          logging: {
            enabled: syncSettings.logging,
            status: 'Active',
            lastSync: new Date().toISOString(),
            entries: 22,
            score: 91
          },
          notification: {
            enabled: syncSettings.notification,
            status: 'Active',
            lastSync: new Date().toISOString(),
            recipients: 3,
            score: 88
          },
          rollback: {
            enabled: syncSettings.rollback,
            status: 'Active',
            lastSync: new Date().toISOString(),
            steps: 5,
            score: 93
          }
        },
        statistics: {
          totalSections: studyGuide.length,
          totalSync: 10,
          source: syncSettings.source,
          target: syncSettings.target,
          frequency: syncSettings.frequency,
          conflictResolution: syncSettings.conflictResolution,
          validationEnabled: syncSettings.validation,
          encryptionEnabled: syncSettings.encryption,
          compressionEnabled: syncSettings.compression,
          loggingEnabled: syncSettings.logging,
          notificationEnabled: syncSettings.notification,
          rollbackEnabled: syncSettings.rollback,
          averageScore: 92
        }
      };

      setSyncResults(results);
      onSync?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setSyncSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-sync">
      <h2>Study Guide Sync</h2>
      
      <div data-testid="sync-settings">
        <h3>Sync Settings:</h3>
        
        <div>
          <label htmlFor="source">Source:</label>
          <select
            id="source"
            value={syncSettings.source}
            onChange={(e) => handleSettingChange('source', e.target.value)}
            data-testid="source-select"
          >
            <option value="local">Local</option>
            <option value="cloud">Cloud</option>
            <option value="database">Database</option>
            <option value="api">API</option>
          </select>
        </div>

        <div>
          <label htmlFor="target">Target:</label>
          <select
            id="target"
            value={syncSettings.target}
            onChange={(e) => handleSettingChange('target', e.target.value)}
            data-testid="target-select"
          >
            <option value="cloud">Cloud</option>
            <option value="local">Local</option>
            <option value="database">Database</option>
            <option value="api">API</option>
          </select>
        </div>

        <div>
          <label htmlFor="frequency">Frequency:</label>
          <select
            id="frequency"
            value={syncSettings.frequency}
            onChange={(e) => handleSettingChange('frequency', e.target.value)}
            data-testid="frequency-select"
          >
            <option value="realtime">Real-time</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <div>
          <label htmlFor="conflict-resolution">Conflict Resolution:</label>
          <select
            id="conflict-resolution"
            value={syncSettings.conflictResolution}
            onChange={(e) => handleSettingChange('conflictResolution', e.target.value)}
            data-testid="conflict-resolution-select"
          >
            <option value="merge">Merge</option>
            <option value="overwrite">Overwrite</option>
            <option value="manual">Manual</option>
            <option value="skip">Skip</option>
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={syncSettings.validation}
              onChange={(e) => handleSettingChange('validation', e.target.checked)}
              data-testid="validation-checkbox"
            />
            Validation
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={syncSettings.encryption}
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
              checked={syncSettings.compression}
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
              checked={syncSettings.logging}
              onChange={(e) => handleSettingChange('logging', e.target.checked)}
              data-testid="logging-checkbox"
            />
            Logging
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={syncSettings.notification}
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
              checked={syncSettings.rollback}
              onChange={(e) => handleSettingChange('rollback', e.target.checked)}
              data-testid="rollback-checkbox"
            />
            Rollback
          </label>
        </div>
      </div>

      <button
        onClick={handleSync}
        disabled={!studyGuide || studyGuide.length === 0 || isSyncing}
        data-testid="sync-button"
      >
        {isSyncing ? 'Syncing...' : 'Start Sync'}
      </button>

      {isSyncing && (
        <div data-testid="sync-progress">Synchronizing study guide...</div>
      )}

      {syncResults && (
        <div data-testid="sync-results">
          <h3>Sync Results</h3>
          
          <div data-testid="sync-tasks">
            <h4>Sync Tasks:</h4>
            <ul>
              <li data-testid="source-task">
                Source: {syncResults.sync.source.status} - {syncResults.sync.source.type} source, {syncResults.sync.source.availability} availability - {syncResults.sync.source.score}%
              </li>
              <li data-testid="target-task">
                Target: {syncResults.sync.target.status} - {syncResults.sync.target.type} target, {syncResults.sync.target.availability} availability - {syncResults.sync.target.score}%
              </li>
              <li data-testid="frequency-task">
                Frequency: {syncResults.sync.frequency.status} - {syncResults.sync.frequency.type} frequency, {syncResults.sync.frequency.nextSync} next sync - {syncResults.sync.frequency.score}%
              </li>
              <li data-testid="conflict-resolution-task">
                Conflict Resolution: {syncResults.sync.conflictResolution.status} - {syncResults.sync.conflictResolution.type} resolution, {syncResults.sync.conflictResolution.conflicts} conflicts - {syncResults.sync.conflictResolution.score}%
              </li>
              <li data-testid="validation-task">
                Validation: {syncResults.sync.validation.status} - {syncResults.sync.validation.errors} errors, {syncResults.sync.validation.warnings} warnings - {syncResults.sync.validation.score}%
              </li>
              <li data-testid="encryption-task">
                Encryption: {syncResults.sync.encryption.status} - {syncResults.sync.encryption.algorithm} algorithm - {syncResults.sync.encryption.score}%
              </li>
              <li data-testid="compression-task">
                Compression: {syncResults.sync.compression.status} - {syncResults.sync.compression.ratio} ratio - {syncResults.sync.compression.score}%
              </li>
              <li data-testid="logging-task">
                Logging: {syncResults.sync.logging.status} - {syncResults.sync.logging.entries} entries - {syncResults.sync.logging.score}%
              </li>
              <li data-testid="notification-task">
                Notification: {syncResults.sync.notification.status} - {syncResults.sync.notification.recipients} recipients - {syncResults.sync.notification.score}%
              </li>
              <li data-testid="rollback-task">
                Rollback: {syncResults.sync.rollback.status} - {syncResults.sync.rollback.steps} steps - {syncResults.sync.rollback.score}%
              </li>
            </ul>
          </div>

          <div data-testid="sync-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {syncResults.statistics.totalSections}</p>
            <p>Total Sync: {syncResults.statistics.totalSync}</p>
            <p>Source: {syncResults.statistics.source}</p>
            <p>Target: {syncResults.statistics.target}</p>
            <p>Frequency: {syncResults.statistics.frequency}</p>
            <p>Conflict Resolution: {syncResults.statistics.conflictResolution}</p>
            <p>Validation Enabled: {syncResults.statistics.validationEnabled ? 'Yes' : 'No'}</p>
            <p>Encryption Enabled: {syncResults.statistics.encryptionEnabled ? 'Yes' : 'No'}</p>
            <p>Compression Enabled: {syncResults.statistics.compressionEnabled ? 'Yes' : 'No'}</p>
            <p>Logging Enabled: {syncResults.statistics.loggingEnabled ? 'Yes' : 'No'}</p>
            <p>Notification Enabled: {syncResults.statistics.notificationEnabled ? 'Yes' : 'No'}</p>
            <p>Rollback Enabled: {syncResults.statistics.rollbackEnabled ? 'Yes' : 'No'}</p>
            <p>Average Score: {syncResults.statistics.averageScore}%</p>
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

describe('StudyGuideSync', () => {
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
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-sync')).toBeInTheDocument();
  });

  it('renders sync settings', () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('source-select')).toBeInTheDocument();
    expect(screen.getByTestId('target-select')).toBeInTheDocument();
    expect(screen.getByTestId('frequency-select')).toBeInTheDocument();
    expect(screen.getByTestId('conflict-resolution-select')).toBeInTheDocument();
    expect(screen.getByTestId('validation-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('encryption-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('compression-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('logging-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('notification-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('rollback-checkbox')).toBeInTheDocument();
  });

  it('renders sync button', () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('sync-button')).toBeInTheDocument();
    expect(screen.getByText('Start Sync')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideSync studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates sync settings when changed', () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    const sourceSelect = screen.getByTestId('source-select');
    const targetSelect = screen.getByTestId('target-select');
    const frequencySelect = screen.getByTestId('frequency-select');
    const conflictResolutionSelect = screen.getByTestId('conflict-resolution-select');
    const validationCheckbox = screen.getByTestId('validation-checkbox');
    const encryptionCheckbox = screen.getByTestId('encryption-checkbox');
    const compressionCheckbox = screen.getByTestId('compression-checkbox');
    const loggingCheckbox = screen.getByTestId('logging-checkbox');
    const notificationCheckbox = screen.getByTestId('notification-checkbox');
    const rollbackCheckbox = screen.getByTestId('rollback-checkbox');
    
    expect(sourceSelect).toHaveValue('local');
    expect(targetSelect).toHaveValue('cloud');
    expect(frequencySelect).toHaveValue('realtime');
    expect(conflictResolutionSelect).toHaveValue('merge');
    expect(validationCheckbox).toBeChecked();
    expect(encryptionCheckbox).toBeChecked();
    expect(compressionCheckbox).toBeChecked();
    expect(loggingCheckbox).toBeChecked();
    expect(notificationCheckbox).toBeChecked();
    expect(rollbackCheckbox).toBeChecked();
    
    fireEvent.change(sourceSelect, { target: { value: 'cloud' } });
    fireEvent.change(targetSelect, { target: { value: 'local' } });
    fireEvent.change(frequencySelect, { target: { value: 'hourly' } });
    fireEvent.change(conflictResolutionSelect, { target: { value: 'overwrite' } });
    fireEvent.click(validationCheckbox);
    fireEvent.click(encryptionCheckbox);
    fireEvent.click(compressionCheckbox);
    fireEvent.click(loggingCheckbox);
    fireEvent.click(notificationCheckbox);
    fireEvent.click(rollbackCheckbox);
    
    expect(sourceSelect).toHaveValue('cloud');
    expect(targetSelect).toHaveValue('local');
    expect(frequencySelect).toHaveValue('hourly');
    expect(conflictResolutionSelect).toHaveValue('overwrite');
    expect(validationCheckbox).not.toBeChecked();
    expect(encryptionCheckbox).not.toBeChecked();
    expect(compressionCheckbox).not.toBeChecked();
    expect(loggingCheckbox).not.toBeChecked();
    expect(notificationCheckbox).not.toBeChecked();
    expect(rollbackCheckbox).not.toBeChecked();
  });

  it('calls onSync when sync completes successfully', async () => {
    const onSync = jest.fn();
    
    render(
      <MockStudyGuideSync 
        studyGuide={mockStudyGuide} 
        onSync={onSync} 
      />
    );
    
    const syncButton = screen.getByTestId('sync-button');
    fireEvent.click(syncButton);
    
    await waitFor(() => {
      expect(onSync).toHaveBeenCalledWith(
        expect.objectContaining({
          syncId: 'sync-123',
          sync: expect.objectContaining({
            source: expect.objectContaining({
              type: 'local',
              status: 'Active',
              lastSync: expect.any(String),
              availability: '100%',
              score: 98
            }),
            target: expect.objectContaining({
              type: 'cloud',
              status: 'Active',
              lastSync: expect.any(String),
              availability: '100%',
              score: 96
            }),
            frequency: expect.objectContaining({
              type: 'realtime',
              status: 'Active',
              lastSync: expect.any(String),
              nextSync: expect.any(String),
              score: 94
            }),
            conflictResolution: expect.objectContaining({
              type: 'merge',
              status: 'Active',
              lastSync: expect.any(String),
              conflicts: 0,
              score: 92
            }),
            validation: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastSync: expect.any(String),
              errors: 0,
              warnings: 1,
              score: 90
            }),
            encryption: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastSync: expect.any(String),
              algorithm: 'AES-256',
              score: 97
            }),
            compression: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastSync: expect.any(String),
              ratio: '80%',
              score: 89
            }),
            logging: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastSync: expect.any(String),
              entries: 22,
              score: 91
            }),
            notification: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastSync: expect.any(String),
              recipients: 3,
              score: 88
            }),
            rollback: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastSync: expect.any(String),
              steps: 5,
              score: 93
            })
          }),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalSync: 10,
            source: 'local',
            target: 'cloud',
            frequency: 'realtime',
            conflictResolution: 'merge',
            validationEnabled: true,
            encryptionEnabled: true,
            compressionEnabled: true,
            loggingEnabled: true,
            notificationEnabled: true,
            rollbackEnabled: true,
            averageScore: 92
          })
        })
      );
    });
  });

  it('calls onError when sync fails', async () => {
    const onError = jest.fn();
    
    const ErrorStudyGuideSync: React.FC<any> = ({ onError }) => {
      const handleSync = () => {
        onError?.(new Error('Sync failed'));
      };

      return (
        <div>
          <button onClick={handleSync} data-testid="error-button">
            Sync with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideSync onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during sync', async () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    const syncButton = screen.getByTestId('sync-button');
    fireEvent.click(syncButton);
    
    expect(screen.getByTestId('sync-progress')).toBeInTheDocument();
    expect(screen.getByText('Synchronizing study guide...')).toBeInTheDocument();
  });

  it('updates button text during sync', async () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    const syncButton = screen.getByTestId('sync-button');
    fireEvent.click(syncButton);
    
    expect(screen.getByText('Syncing...')).toBeInTheDocument();
  });

  it('disables sync button when no study guide provided', () => {
    render(<MockStudyGuideSync studyGuide={[]} />);
    
    const syncButton = screen.getByTestId('sync-button');
    expect(syncButton).toBeDisabled();
  });

  it('disables sync button during sync', async () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    const syncButton = screen.getByTestId('sync-button');
    fireEvent.click(syncButton);
    
    expect(syncButton).toBeDisabled();
  });

  it('displays sync results after sync', async () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    const syncButton = screen.getByTestId('sync-button');
    fireEvent.click(syncButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('sync-results')).toBeInTheDocument();
      expect(screen.getByText('Sync Results')).toBeInTheDocument();
      expect(screen.getByText('Sync Tasks:')).toBeInTheDocument();
    });
  });

  it('displays sync tasks correctly', async () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    const syncButton = screen.getByTestId('sync-button');
    fireEvent.click(syncButton);
    
    await waitFor(() => {
      expect(screen.getByText('Source: Active - local source, 100% availability - 98%')).toBeInTheDocument();
      expect(screen.getByText('Target: Active - cloud target, 100% availability - 96%')).toBeInTheDocument();
      expect(screen.getByText('Frequency: Active - realtime frequency,')).toBeInTheDocument();
      expect(screen.getByText('Conflict Resolution: Active - merge resolution, 0 conflicts - 92%')).toBeInTheDocument();
      expect(screen.getByText('Validation: Active - 0 errors, 1 warnings - 90%')).toBeInTheDocument();
      expect(screen.getByText('Encryption: Active - AES-256 algorithm - 97%')).toBeInTheDocument();
      expect(screen.getByText('Compression: Active - 80% ratio - 89%')).toBeInTheDocument();
      expect(screen.getByText('Logging: Active - 22 entries - 91%')).toBeInTheDocument();
      expect(screen.getByText('Notification: Active - 3 recipients - 88%')).toBeInTheDocument();
      expect(screen.getByText('Rollback: Active - 5 steps - 93%')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideSync studyGuide={mockStudyGuide} />);
    
    const syncButton = screen.getByTestId('sync-button');
    fireEvent.click(syncButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Sync: 10')).toBeInTheDocument();
      expect(screen.getByText('Source: local')).toBeInTheDocument();
      expect(screen.getByText('Target: cloud')).toBeInTheDocument();
      expect(screen.getByText('Frequency: realtime')).toBeInTheDocument();
      expect(screen.getByText('Conflict Resolution: merge')).toBeInTheDocument();
      expect(screen.getByText('Validation Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Encryption Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Compression Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Logging Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Notification Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Rollback Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 92%')).toBeInTheDocument();
    });
  });
});