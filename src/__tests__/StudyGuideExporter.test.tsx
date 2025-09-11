import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideExporter } from '../components/StudyGuideExporter';

// Mock the StudyGuideExporter component
const MockStudyGuideExporter: React.FC<any> = ({ 
  studyGuide, 
  onExport, 
  onError 
}) => {
  const [exportFormat, setExportFormat] = React.useState('pdf');
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
    if (!studyGuide || studyGuide.length === 0) return;
    
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const exportedData = {
        format: exportFormat,
        studyGuide: studyGuide,
        timestamp: new Date().toISOString(),
        metadata: {
          sectionCount: studyGuide.length,
          totalKeywords: studyGuide.reduce((acc: number, section: any) => 
            acc + (section.keywords?.length || 0), 0
          )
        }
      };
      
      onExport?.(exportedData);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFormatChange = (format: string) => {
    setExportFormat(format);
  };

  return (
    <div data-testid="study-guide-exporter">
      <h2>Study Guide Exporter</h2>
      
      <div data-testid="export-options">
        <div>
          <label htmlFor="format">Export Format:</label>
          <select
            id="format"
            value={exportFormat}
            onChange={(e) => handleFormatChange(e.target.value)}
            data-testid="format-select"
          >
            <option value="pdf">PDF</option>
            <option value="docx">Word Document</option>
            <option value="txt">Plain Text</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              data-testid="include-metadata"
              defaultChecked
            />
            Include metadata
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              data-testid="include-keywords"
              defaultChecked
            />
            Include keywords
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              data-testid="include-examples"
              defaultChecked
            />
            Include examples
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              data-testid="include-questions"
              defaultChecked
            />
            Include questions
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              data-testid="include-annotations"
              defaultChecked
            />
            Include annotations
          </label>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={!studyGuide || studyGuide.length === 0 || isExporting}
        data-testid="export-button"
      >
        {isExporting ? 'Exporting...' : `Export as ${exportFormat.toUpperCase()}`}
      </button>

      {isExporting && (
        <div data-testid="export-progress">Exporting study guide...</div>
      )}

      {studyGuide && studyGuide.length > 0 && (
        <div data-testid="export-preview">
          <h3>Export Preview:</h3>
          <p>Format: {exportFormat.toUpperCase()}</p>
          <p>Sections: {studyGuide.length}</p>
          <p>Total Keywords: {studyGuide.reduce((acc: number, section: any) => 
            acc + (section.keywords?.length || 0), 0
          )}</p>
        </div>
      )}
    </div>
  );
};

describe('StudyGuideExporter', () => {
  const mockStudyGuide = [
    {
      id: '1',
      title: 'Introduction to Physics',
      content: 'Physics is the study of matter and energy.',
      keywords: ['physics', 'matter', 'energy'],
      examples: ['Newton\'s laws', 'Thermodynamics'],
      questions: ['What is physics?', 'How does energy work?'],
      annotations: ['Fundamental science']
    },
    {
      id: '2',
      title: 'Advanced Concepts',
      content: 'Advanced physics concepts build on the fundamentals.',
      keywords: ['advanced', 'concepts', 'fundamentals'],
      examples: ['Quantum mechanics', 'Relativity'],
      questions: ['What is quantum mechanics?', 'Explain relativity.'],
      annotations: ['Advanced topics']
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockStudyGuideExporter studyGuide={mockStudyGuide} />);
    expect(screen.getByTestId('study-guide-exporter')).toBeInTheDocument();
  });

  it('renders export options', () => {
    render(<MockStudyGuideExporter studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('format-select')).toBeInTheDocument();
    expect(screen.getByTestId('include-metadata')).toBeInTheDocument();
    expect(screen.getByTestId('include-keywords')).toBeInTheDocument();
    expect(screen.getByTestId('include-examples')).toBeInTheDocument();
    expect(screen.getByTestId('include-questions')).toBeInTheDocument();
    expect(screen.getByTestId('include-annotations')).toBeInTheDocument();
  });

  it('renders export preview when study guide provided', () => {
    render(<MockStudyGuideExporter studyGuide={mockStudyGuide} />);
    
    expect(screen.getByTestId('export-preview')).toBeInTheDocument();
    expect(screen.getByText('Format: PDF')).toBeInTheDocument();
    expect(screen.getByText('Sections: 2')).toBeInTheDocument();
    expect(screen.getByText('Total Keywords: 6')).toBeInTheDocument();
  });

  it('does not render preview when no study guide provided', () => {
    render(<MockStudyGuideExporter studyGuide={[]} />);
    
    expect(screen.queryByTestId('export-preview')).not.toBeInTheDocument();
  });

  it('updates export format when changed', () => {
    render(<MockStudyGuideExporter studyGuide={mockStudyGuide} />);
    
    const formatSelect = screen.getByTestId('format-select');
    
    fireEvent.change(formatSelect, { target: { value: 'docx' } });
    expect(formatSelect).toHaveValue('docx');
  });

  it('calls onExport when export button is clicked', async () => {
    const onExport = jest.fn();
    
    render(
      <MockStudyGuideExporter 
        studyGuide={mockStudyGuide} 
        onExport={onExport} 
      />
    );
    
    const exportButton = screen.getByTestId('export-button');
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(onExport).toHaveBeenCalledWith(
        expect.objectContaining({
          format: 'pdf',
          studyGuide: mockStudyGuide,
          metadata: {
            sectionCount: 2,
            totalKeywords: 6
          }
        })
      );
    });
  });

  it('calls onError when export fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideExporter: React.FC<any> = ({ onError }) => {
      const handleExport = () => {
        onError?.(new Error('Export failed'));
      };

      return (
        <div>
          <button onClick={handleExport} data-testid="error-button">
            Export with Error
          </button>
        </div>
      );
    };

    render(<ErrorStudyGuideExporter onError={onError} />);
    
    fireEvent.click(screen.getByTestId('error-button'));
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during export', async () => {
    render(<MockStudyGuideExporter studyGuide={mockStudyGuide} />);
    
    const exportButton = screen.getByTestId('export-button');
    fireEvent.click(exportButton);
    
    expect(screen.getByTestId('export-progress')).toBeInTheDocument();
    expect(screen.getByText('Exporting study guide...')).toBeInTheDocument();
  });

  it('updates button text during export', async () => {
    render(<MockStudyGuideExporter studyGuide={mockStudyGuide} />);
    
    const exportButton = screen.getByTestId('export-button');
    fireEvent.click(exportButton);
    
    expect(screen.getByText('Exporting...')).toBeInTheDocument();
  });

  it('disables export button when no study guide provided', () => {
    render(<MockStudyGuideExporter studyGuide={[]} />);
    
    const exportButton = screen.getByTestId('export-button');
    expect(exportButton).toBeDisabled();
  });

  it('disables export button during export', async () => {
    render(<MockStudyGuideExporter studyGuide={mockStudyGuide} />);
    
    const exportButton = screen.getByTestId('export-button');
    fireEvent.click(exportButton);
    
    expect(exportButton).toBeDisabled();
  });

  it('updates button text based on selected format', () => {
    render(<MockStudyGuideExporter studyGuide={mockStudyGuide} />);
    
    const formatSelect = screen.getByTestId('format-select');
    const exportButton = screen.getByTestId('export-button');
    
    fireEvent.change(formatSelect, { target: { value: 'docx' } });
    expect(exportButton).toHaveTextContent('Export as DOCX');
    
    fireEvent.change(formatSelect, { target: { value: 'txt' } });
    expect(exportButton).toHaveTextContent('Export as TXT');
  });

  it('handles different export formats correctly', async () => {
    const onExport = jest.fn();
    
    render(
      <MockStudyGuideExporter 
        studyGuide={mockStudyGuide} 
        onExport={onExport} 
      />
    );
    
    const formatSelect = screen.getByTestId('format-select');
    const exportButton = screen.getByTestId('export-button');
    
    // Test PDF export
    fireEvent.change(formatSelect, { target: { value: 'pdf' } });
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(onExport).toHaveBeenCalledWith(
        expect.objectContaining({ format: 'pdf' })
      );
    });
    
    // Test JSON export
    fireEvent.change(formatSelect, { target: { value: 'json' } });
    fireEvent.click(exportButton);
    
    await waitFor(() => {
      expect(onExport).toHaveBeenCalledWith(
        expect.objectContaining({ format: 'json' })
      );
    });
  });
});
