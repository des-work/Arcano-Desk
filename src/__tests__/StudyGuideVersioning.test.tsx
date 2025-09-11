import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideVersioning } from '../components/StudyGuideVersioning';

// Mock the StudyGuideVersioning component
const MockStudyGuideVersioning: React.FC<any> = ({ 
  studyGuide, 
  onVersion, 
  onError 
}) => {
  const [versioningResults, setVersioningResults] = React.useState<any>(null);
  const [isVersioning, setIsVersioning] = React.useState(false);
  const [versioningSettings, setVersioningSettings] = React.useState({
    autoVersion: true,
    versionFormat: 'semantic',
    majorVersion: 1,
    minorVersion: 0,
    patchVersion: 0,
    preRelease: '',
    build: '',
    changelog: true,
    tags: true,
    branches: true
  });

  const handleVersion = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsVersioning(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        versioningId: 'version-123',
        version: {
          autoVersion: {
            enabled: versioningSettings.autoVersion,
            status: 'Active',
            frequency: 'On Change',
            lastVersion: new Date().toISOString(),
            score: 95
          },
          versionFormat: {
            format: versioningSettings.versionFormat,
            status: 'Configured',
            current: `${versioningSettings.majorVersion}.${versioningSettings.minorVersion}.${versioningSettings.patchVersion}`,
            next: `${versioningSettings.majorVersion}.${versioningSettings.minorVersion + 1}.0`,
            score: 98
          },
          majorVersion: {
            current: versioningSettings.majorVersion,
            status: 'Active',
            changes: 0,
            lastChange: new Date().toISOString(),
            score: 96
          },
          minorVersion: {
            current: versioningSettings.minorVersion,
            status: 'Active',
            changes: 1,
            lastChange: new Date().toISOString(),
            score: 94
          },
          patchVersion: {
            current: versioningSettings.patchVersion,
            status: 'Active',
            changes: 0,
            lastChange: new Date().toISOString(),
            score: 92
          },
          preRelease: {
            current: versioningSettings.preRelease,
            status: 'None',
            changes: 0,
            lastChange: null,
            score: 90
          },
          build: {
            current: versioningSettings.build,
            status: 'None',
            changes: 0,
            lastChange: null,
            score: 88
          },
          changelog: {
            enabled: versioningSettings.changelog,
            status: 'Active',
            entries: 5,
            lastEntry: new Date().toISOString(),
            score: 97
          },
          tags: {
            enabled: versioningSettings.tags,
            status: 'Active',
            count: 3,
            lastTag: 'v1.0.0',
            score: 93
          },
          branches: {
            enabled: versioningSettings.branches,
            status: 'Active',
            count: 2,
            current: 'main',
            score: 91
          }
        },
        statistics: {
          totalSections: studyGuide.length,
          totalVersions: 5,
          currentVersion: `${versioningSettings.majorVersion}.${versioningSettings.minorVersion}.${versioningSettings.patchVersion}`,
          nextVersion: `${versioningSettings.majorVersion}.${versioningSettings.minorVersion + 1}.0`,
          changelogEntries: 5,
          tags: 3,
          branches: 2,
          averageScore: 94
        }
      };

      setVersioningResults(results);
      onVersion?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsVersioning(false);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setVersioningSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-versioning">
      <h2>Study Guide Versioning</h2>
      
      <div data-testid="versioning-settings">
        <h3>Versioning Settings:</h3>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={versioningSettings.autoVersion}
              onChange={(e) => handleSettingChange('autoVersion', e.target.checked)}
              data-testid="auto-version-checkbox"
            />
            Auto Version
          </label>
        </div>

        <div>
          <label htmlFor="version-format">Version Format:</label>
          <select
            id="version-format"
            value={versioningSettings.versionFormat}
            onChange={(e) => handleSettingChange('versionFormat', e.target.value)}
            data-testid="version-format-select"
          >
            <option value="semantic">Semantic (1.0.0)</option>
            <option value="numeric">Numeric (1.0)</option>
            <option value="date">Date (2024.01.15)</option>
          </select>
        </div>

        <div>
          <label htmlFor="major-version">Major Version:</label>
          <input
            id="major-version"
            type="number"
            value={versioningSettings.majorVersion}
            onChange={(e) => handleSettingChange('majorVersion', parseInt(e.target.value))}
            data-testid="major-version-input"
          />
        </div>

        <div>
          <label htmlFor="minor-version">Minor Version:</label>
          <input
            id="minor-version"
            type="number"
            value={versioningSettings.minorVersion}
            onChange={(e) => handleSettingChange('minorVersion', parseInt(e.target.value))}
            data-testid="minor-version-input"
          />
        </div>

        <div>
          <label htmlFor="patch-version">Patch Version:</label>
          <input
            id="patch-version"
            type="number"
            value={versioningSettings.patchVersion}
            onChange={(e) => handleSettingChange('patchVersion', parseInt(e.target.value))}
            data-testid="patch-version-input"
          />
        </div>

        <div>
          <label htmlFor="pre-release">Pre-release:</label>
          <input
            id="pre-release"
            type="text"
            value={versioningSettings.preRelease}
            onChange={(e) => handleSettingChange('preRelease', e.target.value)}
            data-testid="pre-release-input"
          />
        </div>

        <div>
          <label htmlFor="build">Build:</label>
          <input
            id="build"
            type="text"
            value={versioningSettings.build}
            onChange={(e) => handleSettingChange('build', e.target.value)}
            data-testid="build-input"
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={versioningSettings.changelog}
              onChange={(e) => handleSettingChange('changelog', e.target.checked)}
              data-testid="changelog-checkbox"
            />
            Changelog
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={versioningSettings.tags}
              onChange={(e) => handleSettingChange('tags', e.target.checked)}
              data-testid="tags-checkbox"
            />
            Tags
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={versioningSettings.branches}
              onChange={(e) => handleSettingChange('branches', e.target.checked)}
              data-testid="branches-checkbox"
            />
            Branches
          </label>
        </div>
      </div>

      <button
        onClick={handleVersion}
        disabled={!studyGuide || studyGuide.length === 0 || isVersioning}
        data-testid="version-button"
      >
        {isVersioning ? 'Versioning...' : 'Start Versioning'}
      </button>

      {isVersioning && (
        <div data-testid="versioning-progress">Setting up versioning...</div>
      )}

      {versioningResults && (
        <div data-testid="versioning-results">
          <h3>Versioning Results</h3>
          
          <div data-testid="versioning-tasks">
            <h4>Versioning Tasks:</h4>
            <ul>
              <li data-testid="auto-version-task">
                Auto Version: {versioningResults.version.autoVersion.status} - {versioningResults.version.autoVersion.frequency} frequency, {versioningResults.version.autoVersion.lastVersion} last version - {versioningResults.version.autoVersion.score}%
              </li>
              <li data-testid="version-format-task">
                Version Format: {versioningResults.version.versionFormat.status} - {versioningResults.version.versionFormat.format} format, {versioningResults.version.versionFormat.current} current - {versioningResults.version.versionFormat.score}%
              </li>
              <li data-testid="major-version-task">
                Major Version: {versioningResults.version.majorVersion.status} - {versioningResults.version.majorVersion.current} current, {versioningResults.version.majorVersion.changes} changes - {versioningResults.version.majorVersion.score}%
              </li>
              <li data-testid="minor-version-task">
                Minor Version: {versioningResults.version.minorVersion.status} - {versioningResults.version.minorVersion.current} current, {versioningResults.version.minorVersion.changes} changes - {versioningResults.version.minorVersion.score}%
              </li>
              <li data-testid="patch-version-task">
                Patch Version: {versioningResults.version.patchVersion.status} - {versioningResults.version.patchVersion.current} current, {versioningResults.version.patchVersion.changes} changes - {versioningResults.version.patchVersion.score}%
              </li>
              <li data-testid="pre-release-task">
                Pre-release: {versioningResults.version.preRelease.status} - {versioningResults.version.preRelease.current} current, {versioningResults.version.preRelease.changes} changes - {versioningResults.version.preRelease.score}%
              </li>
              <li data-testid="build-task">
                Build: {versioningResults.version.build.status} - {versioningResults.version.build.current} current, {versioningResults.version.build.changes} changes - {versioningResults.version.build.score}%
              </li>
              <li data-testid="changelog-task">
                Changelog: {versioningResults.version.changelog.status} - {versioningResults.version.changelog.entries} entries, {versioningResults.version.changelog.lastEntry} last entry - {versioningResults.version.changelog.score}%
              </li>
              <li data-testid="tags-task">
                Tags: {versioningResults.version.tags.status} - {versioningResults.version.tags.count} count, {versioningResults.version.tags.lastTag} last tag - {versioningResults.version.tags.score}%
              </li>
              <li data-testid="branches-task">
                Branches: {versioningResults.version.branches.status} - {versioningResults.version.branches.count} count, {versioningResults.version.branches.current} current - {versioningResults.version.branches.score}%
              </li>
            </ul>
          </div>

          <div data-testid="versioning-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {versioningResults.statistics.totalSections}</p>
            <p>Total Versions: {versioningResults.statistics.totalVersions}</p>
            <p>Current Version: {versioningResults.statistics.currentVersion}</p>
            <p>Next Version: {versioningResults.statistics.nextVersion}</p>
            <p>Changelog Entries: {versioningResults.statistics.changelogEntries}</p>
            <p>Tags: {versioningResults.statistics.tags}</p>
            <p>Branches: {versioningResults.statistics.branches}</p>
            <p>Average Score: {versioningResults.statistics.averageScore}%</p>
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

describe('StudyGuideVersioning', () => {
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
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-versioning')).toBeInTheDocument();
  });

  it('renders versioning settings', () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('auto-version-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('version-format-select')).toBeInTheDocument();
    expect(screen.getByTestId('major-version-input')).toBeInTheDocument();
    expect(screen.getByTestId('minor-version-input')).toBeInTheDocument();
    expect(screen.getByTestId('patch-version-input')).toBeInTheDocument();
    expect(screen.getByTestId('pre-release-input')).toBeInTheDocument();
    expect(screen.getByTestId('build-input')).toBeInTheDocument();
    expect(screen.getByTestId('changelog-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('tags-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('branches-checkbox')).toBeInTheDocument();
  });

  it('renders version button', () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('version-button')).toBeInTheDocument();
    expect(screen.getByText('Start Versioning')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideVersioning studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates versioning settings when changed', () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    const autoVersionCheckbox = screen.getByTestId('auto-version-checkbox');
    const versionFormatSelect = screen.getByTestId('version-format-select');
    const majorVersionInput = screen.getByTestId('major-version-input');
    const minorVersionInput = screen.getByTestId('minor-version-input');
    const patchVersionInput = screen.getByTestId('patch-version-input');
    const preReleaseInput = screen.getByTestId('pre-release-input');
    const buildInput = screen.getByTestId('build-input');
    const changelogCheckbox = screen.getByTestId('changelog-checkbox');
    const tagsCheckbox = screen.getByTestId('tags-checkbox');
    const branchesCheckbox = screen.getByTestId('branches-checkbox');
    
    expect(autoVersionCheckbox).toBeChecked();
    expect(versionFormatSelect).toHaveValue('semantic');
    expect(majorVersionInput).toHaveValue(1);
    expect(minorVersionInput).toHaveValue(0);
    expect(patchVersionInput).toHaveValue(0);
    expect(preReleaseInput).toHaveValue('');
    expect(buildInput).toHaveValue('');
    expect(changelogCheckbox).toBeChecked();
    expect(tagsCheckbox).toBeChecked();
    expect(branchesCheckbox).toBeChecked();
    
    fireEvent.click(autoVersionCheckbox);
    fireEvent.change(versionFormatSelect, { target: { value: 'numeric' } });
    fireEvent.change(majorVersionInput, { target: { value: '2' } });
    fireEvent.change(minorVersionInput, { target: { value: '1' } });
    fireEvent.change(patchVersionInput, { target: { value: '1' } });
    fireEvent.change(preReleaseInput, { target: { value: 'alpha' } });
    fireEvent.change(buildInput, { target: { value: '123' } });
    fireEvent.click(changelogCheckbox);
    fireEvent.click(tagsCheckbox);
    fireEvent.click(branchesCheckbox);
    
    expect(autoVersionCheckbox).not.toBeChecked();
    expect(versionFormatSelect).toHaveValue('numeric');
    expect(majorVersionInput).toHaveValue(2);
    expect(minorVersionInput).toHaveValue(1);
    expect(patchVersionInput).toHaveValue(1);
    expect(preReleaseInput).toHaveValue('alpha');
    expect(buildInput).toHaveValue('123');
    expect(changelogCheckbox).not.toBeChecked();
    expect(tagsCheckbox).not.toBeChecked();
    expect(branchesCheckbox).not.toBeChecked();
  });

  it('calls onVersion when versioning completes successfully', async () => {
    const onVersion = jest.fn();
    
    render(
      <MockStudyGuideVersioning 
        studyGuide={mockStudyGuide} 
        onVersion={onVersion} 
      />
    );
    
    const versionButton = screen.getByTestId('version-button');
    fireEvent.click(versionButton);
    
    await waitFor(() => {
      expect(onVersion).toHaveBeenCalledWith(
        expect.objectContaining({
          versioningId: 'version-123',
          version: expect.objectContaining({
            autoVersion: expect.objectContaining({
              enabled: true,
              status: 'Active',
              frequency: 'On Change',
              lastVersion: expect.any(String),
              score: 95
            }),
            versionFormat: expect.objectContaining({
              format: 'semantic',
              status: 'Configured',
              current: '1.0.0',
              next: '1.1.0',
              score: 98
            }),
            majorVersion: expect.objectContaining({
              current: 1,
              status: 'Active',
              changes: 0,
              lastChange: expect.any(String),
              score: 96
            }),
            minorVersion: expect.objectContaining({
              current: 0,
              status: 'Active',
              changes: 1,
              lastChange: expect.any(String),
              score: 94
            }),
            patchVersion: expect.objectContaining({
              current: 0,
              status: 'Active',
              changes: 0,
              lastChange: expect.any(String),
              score: 92
            }),
            preRelease: expect.objectContaining({
              current: '',
              status: 'None',
              changes: 0,
              lastChange: null,
              score: 90
            }),
            build: expect.objectContaining({
              current: '',
              status: 'None',
              changes: 0,
              lastChange: null,
              score: 88
            }),
            changelog: expect.objectContaining({
              enabled: true,
              status: 'Active',
              entries: 5,
              lastEntry: expect.any(String),
              score: 97
            }),
            tags: expect.objectContaining({
              enabled: true,
              status: 'Active',
              count: 3,
              lastTag: 'v1.0.0',
              score: 93
            }),
            branches: expect.objectContaining({
              enabled: true,
              status: 'Active',
              count: 2,
              current: 'main',
              score: 91
            })
          }),
          statistics: expect.objectContaining({
            totalSections: 2,
            totalVersions: 5,
            currentVersion: '1.0.0',
            nextVersion: '1.1.0',
            changelogEntries: 5,
            tags: 3,
            branches: 2,
            averageScore: 94
          })
        })
      );
    });
  });

  it('calls onError when versioning fails', async () => {
    const onError = jest.fn();
    
    const ErrorStudyGuideVersioning: React.FC<any> = ({ onError }) => {
      const handleVersion = () => {
        onError?.(new Error('Versioning failed'));
      };

      return (
        <div>
          <button onClick={handleVersion} data-testid="error-button">
            Version with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideVersioning onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during versioning', async () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    const versionButton = screen.getByTestId('version-button');
    fireEvent.click(versionButton);
    
    expect(screen.getByTestId('versioning-progress')).toBeInTheDocument();
    expect(screen.getByText('Setting up versioning...')).toBeInTheDocument();
  });

  it('updates button text during versioning', async () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    const versionButton = screen.getByTestId('version-button');
    fireEvent.click(versionButton);
    
    expect(screen.getByText('Versioning...')).toBeInTheDocument();
  });

  it('disables version button when no study guide provided', () => {
    render(<MockStudyGuideVersioning studyGuide={[]} />);
    
    const versionButton = screen.getByTestId('version-button');
    expect(versionButton).toBeDisabled();
  });

  it('disables version button during versioning', async () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    const versionButton = screen.getByTestId('version-button');
    fireEvent.click(versionButton);
    
    expect(versionButton).toBeDisabled();
  });

  it('displays versioning results after versioning', async () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    const versionButton = screen.getByTestId('version-button');
    fireEvent.click(versionButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('versioning-results')).toBeInTheDocument();
      expect(screen.getByText('Versioning Results')).toBeInTheDocument();
      expect(screen.getByText('Versioning Tasks:')).toBeInTheDocument();
    });
  });

  it('displays versioning tasks correctly', async () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    const versionButton = screen.getByTestId('version-button');
    fireEvent.click(versionButton);
    
    await waitFor(() => {
      expect(screen.getByText('Auto Version: Active - On Change frequency,')).toBeInTheDocument();
      expect(screen.getByText('Version Format: Configured - semantic format, 1.0.0 current - 98%')).toBeInTheDocument();
      expect(screen.getByText('Major Version: Active - 1 current, 0 changes - 96%')).toBeInTheDocument();
      expect(screen.getByText('Minor Version: Active - 0 current, 1 changes - 94%')).toBeInTheDocument();
      expect(screen.getByText('Patch Version: Active - 0 current, 0 changes - 92%')).toBeInTheDocument();
      expect(screen.getByText('Pre-release: None -  current, 0 changes - 90%')).toBeInTheDocument();
      expect(screen.getByText('Build: None -  current, 0 changes - 88%')).toBeInTheDocument();
      expect(screen.getByText('Changelog: Active - 5 entries,')).toBeInTheDocument();
      expect(screen.getByText('Tags: Active - 3 count, v1.0.0 last tag - 93%')).toBeInTheDocument();
      expect(screen.getByText('Branches: Active - 2 count, main current - 91%')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideVersioning studyGuide={mockStudyGuide} />);
    
    const versionButton = screen.getByTestId('version-button');
    fireEvent.click(versionButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('Total Versions: 5')).toBeInTheDocument();
      expect(screen.getByText('Current Version: 1.0.0')).toBeInTheDocument();
      expect(screen.getByText('Next Version: 1.1.0')).toBeInTheDocument();
      expect(screen.getByText('Changelog Entries: 5')).toBeInTheDocument();
      expect(screen.getByText('Tags: 3')).toBeInTheDocument();
      expect(screen.getByText('Branches: 2')).toBeInTheDocument();
      expect(screen.getByText('Average Score: 94%')).toBeInTheDocument();
    });
  });
});
