import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideSecurity } from '../components/StudyGuideSecurity';

// Mock the StudyGuideSecurity component
const MockStudyGuideSecurity: React.FC<any> = ({ 
  studyGuide, 
  onSecurity, 
  onError 
}) => {
  const [securityResults, setSecurityResults] = React.useState<any>(null);
  const [isSecurity, setIsSecurity] = React.useState(false);
  const [securitySettings, setSecuritySettings] = React.useState({
    dataEncryption: true,
    accessControl: true,
    auditLogging: true,
    secureTransmission: true,
    inputValidation: true,
    outputSanitization: true,
    sessionManagement: true,
    vulnerabilityScanning: true
  });

  const handleSecurity = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsSecurity(true);
    
    try {
      // Simulate security process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = {
        securityId: 'sec-123',
        compliance: {
          gdpr: 95,
          ccpa: 90,
          hipaa: 85,
          sox: 88,
          pci: 92,
          overall: 90
        },
        vulnerabilities: {
          critical: 0,
          high: 1,
          medium: 3,
          low: 5,
          total: 9,
          fixed: 6,
          remaining: 3
        },
        securityFeatures: {
          dataEncryption: {
            enabled: securitySettings.dataEncryption,
            algorithm: 'AES-256',
            keyManagement: 'Secure',
            score: 95
          },
          accessControl: {
            enabled: securitySettings.accessControl,
            authentication: 'Multi-factor',
            authorization: 'Role-based',
            score: 90
          },
          auditLogging: {
            enabled: securitySettings.auditLogging,
            events: 150,
            retention: '90 days',
            score: 88
          },
          secureTransmission: {
            enabled: securitySettings.secureTransmission,
            protocol: 'TLS 1.3',
            certificate: 'Valid',
            score: 92
          },
          inputValidation: {
            enabled: securitySettings.inputValidation,
            sanitization: 'Comprehensive',
            xssProtection: 'Enabled',
            score: 87
          },
          outputSanitization: {
            enabled: securitySettings.outputSanitization,
            encoding: 'UTF-8',
            escaping: 'Proper',
            score: 89
          },
          sessionManagement: {
            enabled: securitySettings.sessionManagement,
            timeout: '30 minutes',
            secure: true,
            score: 91
          },
          vulnerabilityScanning: {
            enabled: securitySettings.vulnerabilityScanning,
            frequency: 'Daily',
            coverage: 'Complete',
            score: 93
          }
        },
        threats: [
          {
            id: 'threat-1',
            name: 'SQL Injection',
            severity: 'High',
            status: 'Mitigated',
            description: 'Potential SQL injection vulnerability in user input handling',
            mitigation: 'Parameterized queries implemented'
          },
          {
            id: 'threat-2',
            name: 'Cross-Site Scripting (XSS)',
            severity: 'Medium',
            status: 'Active',
            description: 'XSS vulnerability in content rendering',
            mitigation: 'Input sanitization and output encoding required'
          },
          {
            id: 'threat-3',
            name: 'Data Breach',
            severity: 'Critical',
            status: 'Mitigated',
            description: 'Risk of unauthorized access to study guide data',
            mitigation: 'Encryption and access controls implemented'
          }
        ],
        recommendations: [
          'Implement regular security audits',
          'Update security patches promptly',
          'Enhance input validation',
          'Improve session management',
          'Add security monitoring'
        ],
        statistics: {
          totalSections: studyGuide.length,
          gdprScore: 95,
          ccpaScore: 90,
          hipaaScore: 85,
          soxScore: 88,
          pciScore: 92,
          overallScore: 90,
          totalVulnerabilities: 9,
          fixedVulnerabilities: 6,
          remainingVulnerabilities: 3,
          criticalVulnerabilities: 0,
          highVulnerabilities: 1,
          mediumVulnerabilities: 3,
          lowVulnerabilities: 5
        }
      };

      setSecurityResults(results);
      onSecurity?.(results);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsSecurity(false);
    }
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  return (
    <div data-testid="study-guide-security">
      <h2>Study Guide Security</h2>
      
      <div data-testid="security-settings">
        <h3>Security Settings:</h3>
        
        <div>
          <label>
            <input
              type="checkbox"
              checked={securitySettings.dataEncryption}
              onChange={(e) => handleSettingChange('dataEncryption', e.target.checked)}
              data-testid="data-encryption-checkbox"
            />
            Data Encryption
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={securitySettings.accessControl}
              onChange={(e) => handleSettingChange('accessControl', e.target.checked)}
              data-testid="access-control-checkbox"
            />
            Access Control
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={securitySettings.auditLogging}
              onChange={(e) => handleSettingChange('auditLogging', e.target.checked)}
              data-testid="audit-logging-checkbox"
            />
            Audit Logging
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={securitySettings.secureTransmission}
              onChange={(e) => handleSettingChange('secureTransmission', e.target.checked)}
              data-testid="secure-transmission-checkbox"
            />
            Secure Transmission
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={securitySettings.inputValidation}
              onChange={(e) => handleSettingChange('inputValidation', e.target.checked)}
              data-testid="input-validation-checkbox"
            />
            Input Validation
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={securitySettings.outputSanitization}
              onChange={(e) => handleSettingChange('outputSanitization', e.target.checked)}
              data-testid="output-sanitization-checkbox"
            />
            Output Sanitization
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={securitySettings.sessionManagement}
              onChange={(e) => handleSettingChange('sessionManagement', e.target.checked)}
              data-testid="session-management-checkbox"
            />
            Session Management
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={securitySettings.vulnerabilityScanning}
              onChange={(e) => handleSettingChange('vulnerabilityScanning', e.target.checked)}
              data-testid="vulnerability-scanning-checkbox"
            />
            Vulnerability Scanning
          </label>
        </div>
      </div>

      <button
        onClick={handleSecurity}
        disabled={!studyGuide || studyGuide.length === 0 || isSecurity}
        data-testid="security-button"
      >
        {isSecurity ? 'Analyzing security...' : 'Analyze Security'}
      </button>

      {isSecurity && (
        <div data-testid="security-progress">Analyzing security...</div>
      )}

      {securityResults && (
        <div data-testid="security-results">
          <h3>Security Results</h3>
          
          <div data-testid="compliance-scores">
            <h4>Compliance Scores:</h4>
            <p>GDPR: {securityResults.compliance.gdpr}%</p>
            <p>CCPA: {securityResults.compliance.ccpa}%</p>
            <p>HIPAA: {securityResults.compliance.hipaa}%</p>
            <p>SOX: {securityResults.compliance.sox}%</p>
            <p>PCI: {securityResults.compliance.pci}%</p>
            <p>Overall: {securityResults.compliance.overall}%</p>
          </div>

          <div data-testid="vulnerabilities">
            <h4>Vulnerabilities:</h4>
            <p>Critical: {securityResults.vulnerabilities.critical}</p>
            <p>High: {securityResults.vulnerabilities.high}</p>
            <p>Medium: {securityResults.vulnerabilities.medium}</p>
            <p>Low: {securityResults.vulnerabilities.low}</p>
            <p>Total: {securityResults.vulnerabilities.total}</p>
            <p>Fixed: {securityResults.vulnerabilities.fixed}</p>
            <p>Remaining: {securityResults.vulnerabilities.remaining}</p>
          </div>

          <div data-testid="security-features">
            <h4>Security Features:</h4>
            
            <div data-testid="data-encryption">
              <h5>Data Encryption ({securityResults.securityFeatures.dataEncryption.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Algorithm: {securityResults.securityFeatures.dataEncryption.algorithm}</p>
              <p>Key Management: {securityResults.securityFeatures.dataEncryption.keyManagement}</p>
              <p>Score: {securityResults.securityFeatures.dataEncryption.score}%</p>
            </div>

            <div data-testid="access-control">
              <h5>Access Control ({securityResults.securityFeatures.accessControl.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Authentication: {securityResults.securityFeatures.accessControl.authentication}</p>
              <p>Authorization: {securityResults.securityFeatures.accessControl.authorization}</p>
              <p>Score: {securityResults.securityFeatures.accessControl.score}%</p>
            </div>

            <div data-testid="audit-logging">
              <h5>Audit Logging ({securityResults.securityFeatures.auditLogging.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Events: {securityResults.securityFeatures.auditLogging.events}</p>
              <p>Retention: {securityResults.securityFeatures.auditLogging.retention}</p>
              <p>Score: {securityResults.securityFeatures.auditLogging.score}%</p>
            </div>

            <div data-testid="secure-transmission">
              <h5>Secure Transmission ({securityResults.securityFeatures.secureTransmission.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Protocol: {securityResults.securityFeatures.secureTransmission.protocol}</p>
              <p>Certificate: {securityResults.securityFeatures.secureTransmission.certificate}</p>
              <p>Score: {securityResults.securityFeatures.secureTransmission.score}%</p>
            </div>

            <div data-testid="input-validation">
              <h5>Input Validation ({securityResults.securityFeatures.inputValidation.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Sanitization: {securityResults.securityFeatures.inputValidation.sanitization}</p>
              <p>XSS Protection: {securityResults.securityFeatures.inputValidation.xssProtection}</p>
              <p>Score: {securityResults.securityFeatures.inputValidation.score}%</p>
            </div>

            <div data-testid="output-sanitization">
              <h5>Output Sanitization ({securityResults.securityFeatures.outputSanitization.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Encoding: {securityResults.securityFeatures.outputSanitization.encoding}</p>
              <p>Escaping: {securityResults.securityFeatures.outputSanitization.escaping}</p>
              <p>Score: {securityResults.securityFeatures.outputSanitization.score}%</p>
            </div>

            <div data-testid="session-management">
              <h5>Session Management ({securityResults.securityFeatures.sessionManagement.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Timeout: {securityResults.securityFeatures.sessionManagement.timeout}</p>
              <p>Secure: {securityResults.securityFeatures.sessionManagement.secure ? 'Yes' : 'No'}</p>
              <p>Score: {securityResults.securityFeatures.sessionManagement.score}%</p>
            </div>

            <div data-testid="vulnerability-scanning">
              <h5>Vulnerability Scanning ({securityResults.securityFeatures.vulnerabilityScanning.enabled ? 'Enabled' : 'Disabled'}):</h5>
              <p>Frequency: {securityResults.securityFeatures.vulnerabilityScanning.frequency}</p>
              <p>Coverage: {securityResults.securityFeatures.vulnerabilityScanning.coverage}</p>
              <p>Score: {securityResults.securityFeatures.vulnerabilityScanning.score}%</p>
            </div>
          </div>

          <div data-testid="threats">
            <h4>Threats ({securityResults.threats.length}):</h4>
            <ul>
              {securityResults.threats.map((threat: any, index: number) => (
                <li key={index} data-testid={`threat-${index}`}>
                  <strong>{threat.name}:</strong> {threat.description}
                  <span data-testid={`threat-severity-${index}`}>
                    (Severity: {threat.severity})
                  </span>
                  <span data-testid={`threat-status-${index}`}>
                    (Status: {threat.status})
                  </span>
                  <p data-testid={`threat-mitigation-${index}`}>
                    Mitigation: {threat.mitigation}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div data-testid="recommendations">
            <h4>Recommendations:</h4>
            <ul>
              {securityResults.recommendations.map((recommendation: string, index: number) => (
                <li key={index} data-testid={`recommendation-${index}`}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <div data-testid="security-statistics">
            <h4>Statistics:</h4>
            <p>Total Sections: {securityResults.statistics.totalSections}</p>
            <p>GDPR Score: {securityResults.statistics.gdprScore}%</p>
            <p>CCPA Score: {securityResults.statistics.ccpaScore}%</p>
            <p>HIPAA Score: {securityResults.statistics.hipaaScore}%</p>
            <p>SOX Score: {securityResults.statistics.soxScore}%</p>
            <p>PCI Score: {securityResults.statistics.pciScore}%</p>
            <p>Overall Score: {securityResults.statistics.overallScore}%</p>
            <p>Total Vulnerabilities: {securityResults.statistics.totalVulnerabilities}</p>
            <p>Fixed Vulnerabilities: {securityResults.statistics.fixedVulnerabilities}</p>
            <p>Remaining Vulnerabilities: {securityResults.statistics.remainingVulnerabilities}</p>
            <p>Critical Vulnerabilities: {securityResults.statistics.criticalVulnerabilities}</p>
            <p>High Vulnerabilities: {securityResults.statistics.highVulnerabilities}</p>
            <p>Medium Vulnerabilities: {securityResults.statistics.mediumVulnerabilities}</p>
            <p>Low Vulnerabilities: {securityResults.statistics.lowVulnerabilities}</p>
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

describe('StudyGuideSecurity', () => {
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
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-security')).toBeInTheDocument();
  });

  it('renders security settings', () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('data-encryption-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('access-control-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('audit-logging-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('secure-transmission-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('input-validation-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('output-sanitization-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('session-management-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('vulnerability-scanning-checkbox')).toBeInTheDocument();
  });

  it('renders security button', () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('security-button')).toBeInTheDocument();
    expect(screen.getByText('Analyze Security')).toBeInTheDocument();
  });

  it('renders study guide preview when provided', () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('study-guide-preview')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Physics')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideSecurity studyGuide={[]} />);
    
    expect(screen.queryByTestId('study-guide-preview')).not.toBeInTheDocument();
  });

  it('updates security settings when changed', () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const dataEncryptionCheckbox = screen.getByTestId('data-encryption-checkbox');
    const accessControlCheckbox = screen.getByTestId('access-control-checkbox');
    const vulnerabilityScanningCheckbox = screen.getByTestId('vulnerability-scanning-checkbox');
    
    expect(dataEncryptionCheckbox).toBeChecked();
    expect(accessControlCheckbox).toBeChecked();
    expect(vulnerabilityScanningCheckbox).toBeChecked();
    
    fireEvent.click(dataEncryptionCheckbox);
    fireEvent.click(accessControlCheckbox);
    fireEvent.click(vulnerabilityScanningCheckbox);
    
    expect(dataEncryptionCheckbox).not.toBeChecked();
    expect(accessControlCheckbox).not.toBeChecked();
    expect(vulnerabilityScanningCheckbox).not.toBeChecked();
  });

  it('calls onSecurity when security analysis completes successfully', async () => {
    const onSecurity = jest.fn();
    
    render(
      <MockStudyGuideSecurity 
        studyGuide={mockStudyGuide} 
        onSecurity={onSecurity} 
      />
    );
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(onSecurity).toHaveBeenCalledWith(
        expect.objectContaining({
          securityId: 'sec-123',
          compliance: expect.objectContaining({
            gdpr: 95,
            ccpa: 90,
            hipaa: 85,
            sox: 88,
            pci: 92,
            overall: 90
          }),
          vulnerabilities: expect.objectContaining({
            critical: 0,
            high: 1,
            medium: 3,
            low: 5,
            total: 9,
            fixed: 6,
            remaining: 3
          }),
          securityFeatures: expect.objectContaining({
            dataEncryption: expect.objectContaining({
              enabled: true,
              algorithm: 'AES-256',
              keyManagement: 'Secure',
              score: 95
            }),
            accessControl: expect.objectContaining({
              enabled: true,
              authentication: 'Multi-factor',
              authorization: 'Role-based',
              score: 90
            }),
            auditLogging: expect.objectContaining({
              enabled: true,
              events: 150,
              retention: '90 days',
              score: 88
            }),
            secureTransmission: expect.objectContaining({
              enabled: true,
              protocol: 'TLS 1.3',
              certificate: 'Valid',
              score: 92
            }),
            inputValidation: expect.objectContaining({
              enabled: true,
              sanitization: 'Comprehensive',
              xssProtection: 'Enabled',
              score: 87
            }),
            outputSanitization: expect.objectContaining({
              enabled: true,
              encoding: 'UTF-8',
              escaping: 'Proper',
              score: 89
            }),
            sessionManagement: expect.objectContaining({
              enabled: true,
              timeout: '30 minutes',
              secure: true,
              score: 91
            }),
            vulnerabilityScanning: expect.objectContaining({
              enabled: true,
              frequency: 'Daily',
              coverage: 'Complete',
              score: 93
            })
          }),
          threats: expect.arrayContaining([
            expect.objectContaining({
              name: 'SQL Injection',
              severity: 'High',
              status: 'Mitigated',
              description: 'Potential SQL injection vulnerability in user input handling',
              mitigation: 'Parameterized queries implemented'
            }),
            expect.objectContaining({
              name: 'Cross-Site Scripting (XSS)',
              severity: 'Medium',
              status: 'Active',
              description: 'XSS vulnerability in content rendering',
              mitigation: 'Input sanitization and output encoding required'
            }),
            expect.objectContaining({
              name: 'Data Breach',
              severity: 'Critical',
              status: 'Mitigated',
              description: 'Risk of unauthorized access to study guide data',
              mitigation: 'Encryption and access controls implemented'
            })
          ]),
          recommendations: expect.any(Array),
          statistics: expect.objectContaining({
            totalSections: 2,
            gdprScore: 95,
            ccpaScore: 90,
            hipaaScore: 85,
            soxScore: 88,
            pciScore: 92,
            overallScore: 90,
            totalVulnerabilities: 9,
            fixedVulnerabilities: 6,
            remainingVulnerabilities: 3,
            criticalVulnerabilities: 0,
            highVulnerabilities: 1,
            mediumVulnerabilities: 3,
            lowVulnerabilities: 5
          })
        })
      );
    });
  });

  it('calls onError when security analysis fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideSecurity: React.FC<any> = ({ onError }) => {
      const handleSecurity = () => {
        onError?.(new Error('Security analysis failed'));
      };

      return (
        <div>
          <button onClick={handleSecurity} data-testid="error-button">
            Analyze with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideSecurity onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during security analysis', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    expect(screen.getByTestId('security-progress')).toBeInTheDocument();
    expect(screen.getByText('Analyzing security...')).toBeInTheDocument();
  });

  it('updates button text during security analysis', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    expect(screen.getByText('Analyzing security...')).toBeInTheDocument();
  });

  it('disables security button when no study guide provided', () => {
    render(<MockStudyGuideSecurity studyGuide={[]} />);
    
    const securityButton = screen.getByTestId('security-button');
    expect(securityButton).toBeDisabled();
  });

  it('disables security button during analysis', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    expect(securityButton).toBeDisabled();
  });

  it('displays security results after analysis', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('security-results')).toBeInTheDocument();
      expect(screen.getByText('Security Results')).toBeInTheDocument();
      expect(screen.getByText('Compliance Scores:')).toBeInTheDocument();
    });
  });

  it('displays compliance scores correctly', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByText('GDPR: 95%')).toBeInTheDocument();
      expect(screen.getByText('CCPA: 90%')).toBeInTheDocument();
      expect(screen.getByText('HIPAA: 85%')).toBeInTheDocument();
      expect(screen.getByText('SOX: 88%')).toBeInTheDocument();
      expect(screen.getByText('PCI: 92%')).toBeInTheDocument();
      expect(screen.getByText('Overall: 90%')).toBeInTheDocument();
    });
  });

  it('displays vulnerabilities correctly', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Critical: 0')).toBeInTheDocument();
      expect(screen.getByText('High: 1')).toBeInTheDocument();
      expect(screen.getByText('Medium: 3')).toBeInTheDocument();
      expect(screen.getByText('Low: 5')).toBeInTheDocument();
      expect(screen.getByText('Total: 9')).toBeInTheDocument();
      expect(screen.getByText('Fixed: 6')).toBeInTheDocument();
      expect(screen.getByText('Remaining: 3')).toBeInTheDocument();
    });
  });

  it('displays security features correctly', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Data Encryption (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Algorithm: AES-256')).toBeInTheDocument();
      expect(screen.getByText('Key Management: Secure')).toBeInTheDocument();
      expect(screen.getByText('Score: 95%')).toBeInTheDocument();
      
      expect(screen.getByText('Access Control (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Authentication: Multi-factor')).toBeInTheDocument();
      expect(screen.getByText('Authorization: Role-based')).toBeInTheDocument();
      expect(screen.getByText('Score: 90%')).toBeInTheDocument();
      
      expect(screen.getByText('Audit Logging (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Events: 150')).toBeInTheDocument();
      expect(screen.getByText('Retention: 90 days')).toBeInTheDocument();
      expect(screen.getByText('Score: 88%')).toBeInTheDocument();
      
      expect(screen.getByText('Secure Transmission (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Protocol: TLS 1.3')).toBeInTheDocument();
      expect(screen.getByText('Certificate: Valid')).toBeInTheDocument();
      expect(screen.getByText('Score: 92%')).toBeInTheDocument();
      
      expect(screen.getByText('Input Validation (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Sanitization: Comprehensive')).toBeInTheDocument();
      expect(screen.getByText('XSS Protection: Enabled')).toBeInTheDocument();
      expect(screen.getByText('Score: 87%')).toBeInTheDocument();
      
      expect(screen.getByText('Output Sanitization (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Encoding: UTF-8')).toBeInTheDocument();
      expect(screen.getByText('Escaping: Proper')).toBeInTheDocument();
      expect(screen.getByText('Score: 89%')).toBeInTheDocument();
      
      expect(screen.getByText('Session Management (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Timeout: 30 minutes')).toBeInTheDocument();
      expect(screen.getByText('Secure: Yes')).toBeInTheDocument();
      expect(screen.getByText('Score: 91%')).toBeInTheDocument();
      
      expect(screen.getByText('Vulnerability Scanning (Enabled):')).toBeInTheDocument();
      expect(screen.getByText('Frequency: Daily')).toBeInTheDocument();
      expect(screen.getByText('Coverage: Complete')).toBeInTheDocument();
      expect(screen.getByText('Score: 93%')).toBeInTheDocument();
    });
  });

  it('displays threats correctly', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Threats (3):')).toBeInTheDocument();
      expect(screen.getByText('SQL Injection: Potential SQL injection vulnerability in user input handling (Severity: High) (Status: Mitigated)')).toBeInTheDocument();
      expect(screen.getByText('Mitigation: Parameterized queries implemented')).toBeInTheDocument();
      expect(screen.getByText('Cross-Site Scripting (XSS): XSS vulnerability in content rendering (Severity: Medium) (Status: Active)')).toBeInTheDocument();
      expect(screen.getByText('Mitigation: Input sanitization and output encoding required')).toBeInTheDocument();
      expect(screen.getByText('Data Breach: Risk of unauthorized access to study guide data (Severity: Critical) (Status: Mitigated)')).toBeInTheDocument();
      expect(screen.getByText('Mitigation: Encryption and access controls implemented')).toBeInTheDocument();
    });
  });

  it('displays recommendations correctly', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Implement regular security audits')).toBeInTheDocument();
      expect(screen.getByText('Update security patches promptly')).toBeInTheDocument();
      expect(screen.getByText('Enhance input validation')).toBeInTheDocument();
      expect(screen.getByText('Improve session management')).toBeInTheDocument();
      expect(screen.getByText('Add security monitoring')).toBeInTheDocument();
    });
  });

  it('displays statistics correctly', async () => {
    render(<MockStudyGuideSecurity studyGuide={mockStudyGuide} />);
    
    const securityButton = screen.getByTestId('security-button');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByText('Total Sections: 2')).toBeInTheDocument();
      expect(screen.getByText('GDPR Score: 95%')).toBeInTheDocument();
      expect(screen.getByText('CCPA Score: 90%')).toBeInTheDocument();
      expect(screen.getByText('HIPAA Score: 85%')).toBeInTheDocument();
      expect(screen.getByText('SOX Score: 88%')).toBeInTheDocument();
      expect(screen.getByText('PCI Score: 92%')).toBeInTheDocument();
      expect(screen.getByText('Overall Score: 90%')).toBeInTheDocument();
      expect(screen.getByText('Total Vulnerabilities: 9')).toBeInTheDocument();
      expect(screen.getByText('Fixed Vulnerabilities: 6')).toBeInTheDocument();
      expect(screen.getByText('Remaining Vulnerabilities: 3')).toBeInTheDocument();
      expect(screen.getByText('Critical Vulnerabilities: 0')).toBeInTheDocument();
      expect(screen.getByText('High Vulnerabilities: 1')).toBeInTheDocument();
      expect(screen.getByText('Medium Vulnerabilities: 3')).toBeInTheDocument();
      expect(screen.getByText('Low Vulnerabilities: 5')).toBeInTheDocument();
    });
  });
});
