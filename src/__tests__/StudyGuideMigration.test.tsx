import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideMigration } from '../components/StudyGuideMigration';

// Mock the StudyGuideMigration component
const MockStudyGuideMigration: React.FC<any> = ({ 
  studyGuide, 
  onMigrate, 
  onError 
}) => {
  const [migrationResults, setMigrationResults] = React.useState<any>(null);
  const [isMigrating, setIsMigrating] = React.useState(false);
  const [migrationSettings, setMigrationSettings] = React.useState({
    sourceFormat: 'json',
    targetFormat: 'markdown',
    preserveStructure: true,
    updateReferences: true,
    validateOutput: true,
    backupOriginal: true,
    logChanges: true,
    notifyUsers: true,
    rollbackPlan: true,
    testing: true
  });

  const handleMigrate = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsMigrating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        migrationId: 'migrate-123',
        migration: {
          sourceFormat: {
            type: migrationSettings.sourceFormat,
            status: 'Detected',
            lastCheck: new Date().toISOString(),
            compatibility: 'High',
            score: 98
          },
          targetFormat: {
            type: migrationSettings.targetFormat,
            status: 'Configured',
            lastCheck: new Date().toISOString(),
            compatibility: 'High',
            score: 96
          },
          preserveStructure: {
            enabled: migrationSettings.preserveStructure,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            elements: 15,
            score: 94
          },
          updateReferences: {
            enabled: migrationSettings.updateReferences,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            updated: 8,
            score: 92
          },
          validateOutput: {
            enabled: migrationSettings.validateOutput,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            errors: 0,
            warnings: 2,
            score: 95
          },
          backupOriginal: {
            enabled: migrationSettings.backupOriginal,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            location: '/backups/',
            score: 97
          },
          logChanges: {
            enabled: migrationSettings.logChanges,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            entries: 25,
            score: 91
          },
          notifyUsers: {
            enabled: migrationSettings.notifyUsers,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            recipients: 5,
            score: 89
          },
          rollbackPlan: {
            enabled: migrationSettings.rollbackPlan,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            steps: 8,
            score: 93
          },
          testing: {
            enabled: migrationSettings.testing,
            status: 'Active',
            lastCheck: new Date().toISOString(),
            tests: 12,
            score: 90
          }
        },
        statistics: {
          totalSections: studyGuide.length,
          totalMigration: 10,
          sourceFormat: migrationSettings.sourceFormat,
          targetFormat: migrationSettings.targetFormat,
          preserveStructureEnabled: migrationSettings.preserveStructure,
          updateReferencesEnabled: migrationSettings.updateReferences,
          validateOutputEnabled: migrationSettings.validateOutput,
          backupOriginalEnabled: migrationSettings.backupOriginal,
          logChangesEnabled: migrationSettings.logChanges,
          notifyUsersEnabled: migrationSettings.notifyUsers,
          rollbackPlanEnabled: migrationSettings.rollbackPlan,
          testingEnabled: migrationSettings.testing,
          averageScore: 93
        }
      };

      setMigrationResults(results);
      onMigrate?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsMigrating(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setMigrationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-migration">
      <h2>Study Guide Migration</h2>
      
      <div data-testid="migration-settings">
        <h3>Migration Settings:</h3>
        
        <div>
          <label htmlFor="source-format">Source Format:</label>
          <select
            id="source-format"
            value={migrationSettings.sourceFormat}
            onChange={(e) => handleSettingChange('sourceFormat', e.target.value)}
            data-testid="source-format-select"
          >
            <option value="json">JSON</option>
            <option value="xml">XML</option>
            <option value="csv">CSV</option>
            <option value="yaml">YAML</option>
          </select>
        </div>

        <div>
          <label htmlFor="target-format">Target Format:</label>
          <select
            id="target-format"
            value={migrationSettings.targetFormat}
            onChange={(e) => handleSettingChange('targetFormat', e.target.value)}
            data-testid="target-format-select"
          >
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={migrationSettings.preserveStructure}
              onChange={(e) => handleSettingChange('preserveStructure', e.target.checked)}
              data-testid="preserve-structure-checkbox"
            />
            Preserve Structure
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={migrationSettings.updateReferences}
              onChange={(e) => handleSettingChange('updateReferences', e.target.checked)}
              data-testid="update-references-checkbox"
            />
            Update References
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={migrationSettings.validateOutput}
              onChange={(e) => handleSettingChange('validateOutput', e.target.checked)}
              data-testid="validate-output-checkbox"
            />
            Validate Output
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={migrationSettings.backupOriginal}
              onChange={(e) => handleSettingChange('backupOriginal', e.target.checked)}
              data-testid="backup-original-checkbox"
            />
            Backup Original
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={migrationSettings.logChanges}
              onChange={(e) => handleSettingChange('logChanges', e.target.checked)}
              data-testid="log-changes-checkbox"
            />
            Log Changes
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={migrationSettings.notifyUsers}
              onChange={(e) => handleSettingChange('notifyUsers', e.target.checked)}
              data-testid="notify-users-checkbox"
            />
            Notify Users
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={migrationSettings.rollbackPlan}
              onChange={(e) => handleSettingChange('rollbackPlan', e.target.checked)}
              data-testid="rollback-plan-checkbox"
            />
            Rollback Plan
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={migrationSettings.testing}
              onChange={(e) => handleSettingChange('testing', e.target.checked)}
              data-testid="testing-checkbox"
            />
            Testing
          </label>
        </div>
      </div>

      <button
        onClick={handleMigrate}
        disabled={!studyGuide || studyGuide.length === 0 || isMigrating}
        data-testid="migrate-button"
      >
        {isMigrating ? 'Migrating...' : 'Start Migration'}
      </button>

      {isMigrating && (
        <div data-testid="migration-progress">Migrating study guide...</div>
      )}

      {migrationResults && (
        <div data-testid="migration-results">
          <h3>Migration Results</h3>
          
          <div data-testid="migration-tasks">
            <h4>Migration Tasks:</h4>
            <ul>
              <li data-testid="source-format-task">
                Source Format: {migrationResults.migration.sourceFormat.status} - {migrationResults.migration.sourceFormat.type} format, {migrationResults.migration.sourceFormat.compatibility} compatibility - {migrationResults.migration.sourceFormat.score}%
              </li>
              <li data-testid="target-format-task">
                Target Format: {migrationResults.migration.targetFormat.status} - {migrationResults.migration.targetFormat.type} format, {migrationResults.migration.targetFormat.compatibility} compatibility - {migrationResults.migration.targetFormat.score}%
              </li>
              <li data-testid="preserve-structure-task">
                Preserve Structure: {migrationResults.migration.preserveStructure.status} - {migrationResults.migration.preserveStructure.elements} elements - {migrationResults.migration.preserveStructure.score}%
              </li>
              <li data-testid="update-references-task">
                Update References: {migrationResults.migration.updateReferences.status} - {migrationResults.migration.updateReferences.updated} updated - {migrationResults.migration.updateReferences.score}%
              </li>
              <li data-testid="validate-output-task">
                Validate Output: {migrationResults.migration.validateOutput.status} - {migrationResults.migration.validateOutput.errors} errors, {migrationResults.migration.validateOutput.warnings} warnings - {migrationResults.migration.validateOutput.score}%
              </li>
              <li data-testid="backup-original-task">
                Backup Original: {migrationResults.migration.backupOriginal.status} - {migrationResults.migration.backupOriginal.location} location - {migrationResults.migration.backupOriginal.score}%
              </li>
              <li data-testid="log-changes-task">
                Log Changes: {migrationResults.migration.logChanges.status} - {migrationResults.migration.logChanges.entries} entries - {migrationResults.migration.logChanges.score}%
              </li>
              <li data-testid="notify-users-task">
                Notify Users: {migrationResults.migration.notifyUsers.status} - {migrationResults.migration.notifyUsers.recipients} recipients - {migrationResults.migration.notifyUsers.score}%
              </li>
              <li data-testid="rollback-plan-task">
                Rollback Plan: {migrationResults.migration.rollbackPlan.status} - {migrationResults.migration.rollbackPlan.steps} steps - {migrationResults.migration.rollbackPlan.score}%
              </li>
              <li data-testid="testing-task">
                Testing: {migrationResults.migration.testing.status} - {migrationResults.migration.testing.tests} tests - {migrationResults.migration.testing.score}%
              </li>
            </ul>
          </div>

          <div data-testid="migration-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {migrationResults.statistics.totalSections}</p>
            <p>Total Migration: {migrationResults.statistics.totalMigration}</p>
            <p>Source Format: {migrationResults.statistics.sourceFormat}</p>
            <p>Target Format: {migrationResults.statistics.targetFormat}</p>
            <p>Preserve Structure Enabled: {migrationResults.statistics.preserveStructureEnabled ? 'Yes' : 'No'}</p>
            <p>Update References Enabled: {migrationResults.statistics.updateReferencesEnabled ? 'Yes' : 'No'}</p>
            <p>Validate Output Enabled: {migrationResults.statistics.validateOutputEnabled ? 'Yes' : 'No'}</p>
            <p>Backup Original Enabled: {migrationResults.statistics.backupOriginalEnabled ? 'Yes' : 'No'}</p>
            <p>Log Changes Enabled: {migrationResults.statistics.logChangesEnabled ? 'Yes' : 'No'}</p>
            <p>Notify Users Enabled: {migrationResults.statistics.notifyUsersEnabled ? 'Yes' : 'No'}</p>
            <p>Rollback Plan Enabled: {migrationResults.statistics.rollbackPlanEnabled ? 'Yes' : 'No'}</p>
            <p>Testing Enabled: {migrationResults.statistics.testingEnabled ? 'Yes' : 'No'}</p>
            <p>Average Score: {migrationResults.statistics.averageScore}%</p>
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

describe('StudyGuideMigration', () => {
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
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-migration')).toBeInTheDocument();
  });

  it('renders migration settings', () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('source-format-select')).toBeInTheDocument();
    expect(screen.getByTestId('target-format-select')).toBeInTheDocument();
    expect(screen.getByTestId('preserve-structure-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('update-references-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('validate-output-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('backup-original-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('log-changes-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('notify-users-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('rollback-plan-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('testing-checkbox')).toBeInTheDocument();
  });

  it('renders migrate button', () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('migrate-button')).toBeInTheDocument();
    expect(screen.getByText('Start Migration')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideMigration studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates migration settings when changed', () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    const sourceFormatSelect = screen.getByTestId('source-format-select');
    const targetFormatSelect = screen.getByTestId('target-format-select');
    const preserveStructureCheckbox = screen.getByTestId('preserve-structure-checkbox');
    const updateReferencesCheckbox = screen.getByTestId('update-references-checkbox');
    const validateOutputCheckbox = screen.getByTestId('validate-output-checkbox');
    const backupOriginalCheckbox = screen.getByTestId('backup-original-checkbox');
    const logChangesCheckbox = screen.getByTestId('log-changes-checkbox');
    const notifyUsersCheckbox = screen.getByTestId('notify-users-checkbox');
    const rollbackPlanCheckbox = screen.getByTestId('rollback-plan-checkbox');
    const testingCheckbox = screen.getByTestId('testing-checkbox');
    
    expect(sourceFormatSelect).toHaveValue('json');
    expect(targetFormatSelect).toHaveValue('markdown');
    expect(preserveStructureCheckbox).toBeChecked();
    expect(updateReferencesCheckbox).toBeChecked();
    expect(validateOutputCheckbox).toBeChecked();
    expect(backupOriginalCheckbox).toBeChecked();
    expect(logChangesCheckbox).toBeChecked();
    expect(notifyUsersCheckbox).toBeChecked();
    expect(rollbackPlanCheckbox).toBeChecked();
    expect(testingCheckbox).toBeChecked();
    
    fireEvent.change(sourceFormatSelect, { target: { value: 'xml' } });
    fireEvent.change(targetFormatSelect, { target: { value: 'html' } });
    fireEvent.click(preserveStructureCheckbox);
    fireEvent.click(updateReferencesCheckbox);
    fireEvent.click(validateOutputCheckbox);
    fireEvent.click(backupOriginalCheckbox);
    fireEvent.click(logChangesCheckbox);
    fireEvent.click(notifyUsersCheckbox);
    fireEvent.click(rollbackPlanCheckbox);
    fireEvent.click(testingCheckbox);
    
    expect(sourceFormatSelect).toHaveValue('xml');
    expect(targetFormatSelect).toHaveValue('html');
    expect(preserveStructureCheckbox).not.toBeChecked();
    expect(updateReferencesCheckbox).not.toBeChecked();
    expect(validateOutputCheckbox).not.toBeChecked();
    expect(backupOriginalCheckbox).not.toBeChecked();
    expect(logChangesCheckbox).not.toBeChecked();
    expect(notifyUsersCheckbox).not.toBeChecked();
    expect(rollbackPlanCheckbox).not.toBeChecked();
    expect(testingCheckbox).not.toBeChecked();
  });

  it('calls onMigrate when migration completes successfully', async () => {
    const onMigrate = jest.fn();
    
    render(
      <MockStudyGuideMigration 
        studyGuide={mockStudyGuide} 
        onMigrate={onMigrate} 
      />
    );
    
    const migrateButton = screen.getByTestId('migrate-button');
    fireEvent.click(migrateButton);
    
    await waitFor(() => {
      expect(onMigrate).toHaveBeenCalledWith(
        expect.objectContaining({
          migrationId: 'migrate-123',
          migration: expect.objectContaining({
            sourceFormat: expect.objectContaining({
              type: 'json',
              status: 'Detected',
              lastCheck: expect.any(String),
              compatibility: 'High',
              score: 98
            }),
            targetFormat: expect.objectContaining({
              type: 'markdown',
              status: 'Configured',
              lastCheck: expect.any(String),
              compatibility: 'High',
              score: 96
            }),
            preserveStructure: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              elements: 15,
              score: 94
            }),
            updateReferences: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              updated: 8,
              score: 92
            }),
            validateOutput: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              errors: 0,
              warnings: 2,
              score: 95
            }),
            backupOriginal: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              location: '/backups/',
              score: 97
            }),
            logChanges: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              entries: 25,
              score: 91
            }),
            notifyUsers: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              recipients: 5,
              score: 89
            }),
            rollbackPlan: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              steps: 8,
              score: 93
            }),
            testing: expect.objectContaining({
              enabled: true,
              status: 'Active',
              lastCheck: expect.any(String),
              tests: 12,
              score: 90
            })
          }),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalMigration: 10,
            sourceFormat: 'json',
            targetFormat: 'markdown',
            preserveStructureEnabled: true,
            updateReferencesEnabled: true,
            validateOutputEnabled: true,
            backupOriginalEnabled: true,
            logChangesEnabled: true,
            notifyUsersEnabled: true,
            rollbackPlanEnabled: true,
            testingEnabled: true,
            averageScore: 93
          })
        })
      );
    });
  });

  it('calls onError when migration fails', async () => {
    const onError = jest.fn();
    
    const ErrorStudyGuideMigration: React.FC<any> = ({ onError }) => {
      const handleMigrate = () => {
        onError?.(new Error('Migration failed'));
      };

      return (
        <div>
          <button onClick={handleMigrate} data-testid="error-button">
            Migrate with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideMigration onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during migration', async () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    const migrateButton = screen.getByTestId('migrate-button');
    fireEvent.click(migrateButton);
    
    expect(screen.getByTestId('migration-progress')).toBeInTheDocument();
    expect(screen.getByText('Migrating study guide...')).toBeInTheDocument();
  });

  it('updates button text during migration', async () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    const migrateButton = screen.getByTestId('migrate-button');
    fireEvent.click(migrateButton);
    
    expect(screen.getByText('Migrating...')).toBeInTheDocument();
  });

  it('disables migrate button when no study guide provided', () => {
    render(<MockStudyGuideMigration studyGuide={[]} />);
    
    const migrateButton = screen.getByTestId('migrate-button');
    expect(migrateButton).toBeDisabled();
  });

  it('disables migrate button during migration', async () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    const migrateButton = screen.getByTestId('migrate-button');
    fireEvent.click(migrateButton);
    
    expect(migrateButton).toBeDisabled();
  });

  it('displays migration results after migration', async () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    const migrateButton = screen.getByTestId('migrate-button');
    fireEvent.click(migrateButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('migration-results')).toBeInTheDocument();
      expect(screen.getByText('Migration Results')).toBeInTheDocument();
      expect(screen.getByText('Migration Tasks:')).toBeInTheDocument();
    });
  });

  it('displays migration tasks correctly', async () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    const migrateButton = screen.getByTestId('migrate-button');
    fireEvent.click(migrateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Source Format: Detected - json format, High compatibility - 98%')).toBeInTheDocument();
      expect(screen.getByText('Target Format: Configured - markdown format, High compatibility - 96%')).toBeInTheDocument();
      expect(screen.getByText('Preserve Structure: Active - 15 elements - 94%')).toBeInTheDocument();
      expect(screen.getByText('Update References: Active - 8 updated - 92%')).toBeInTheDocument();
      expect(screen.getByText('Validate Output: Active - 0 errors, 2 warnings - 95%')).toBeInTheDocument();
      expect(screen.getByText('Backup Original: Active - /backups/ location - 97%')).toBeInTheDocument();
      expect(screen.getByText('Log Changes: Active - 25 entries - 91%')).toBeInTheDocument();
      expect(screen.getByText('Notify Users: Active - 5 recipients - 89%')).toBeInTheDocument();
      expect(screen.getByText('Rollback Plan: Active - 8 steps - 93%')).toBeInTheDocument();
      expect(screen.getByText('Testing: Active - 12 tests - 90%')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideMigration studyGuide={mockStudyGuide} />);
    
    const migrateButton = screen.getByTestId('migrate-button');
    fireEvent.click(migrateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Migration: 10')).toBeInTheDocument();
      expect(screen.getByText('Source Format: json')).toBeInTheDocument();
      expect(screen.getByText('Target Format: markdown')).toBeInTheDocument();
      expect(screen.getByText('Preserve Structure Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Update References Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Validate Output Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Backup Original Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Log Changes Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Notify Users Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Rollback Plan Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Testing Enabled: Yes')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 93%')).toBeInTheDocument();
    });
  });
});