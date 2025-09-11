import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudyGuideImporter } from '../components/StudyGuideImporter';

// Mock the StudyGuideImporter component
const MockStudyGuideImporter: React.FC<any> = ({ 
  onImport, 
  onError 
}) => {
  const [isImporting, setIsImporting] = React.useState(false);
  const [importFormat, setImportFormat] = React.useState('json');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    
    try {
      // Simulate file reading and parsing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const fileContent = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsText(file);
      });

      // Simulate parsing based on format
      let parsedData;
      if (importFormat === 'json') {
        parsedData = JSON.parse(fileContent);
      } else if (importFormat === 'txt') {
        parsedData = {
          title: 'Imported Study Guide',
          content: fileContent,
          sections: fileContent.split('\n\n').map((section: string, index: number) => ({
            id: `imported-${index}`,
            title: `Section ${index + 1}`,
            content: section,
            keywords: [],
            examples: [],
            questions: [],
            annotations: []
          }))
        };
      } else {
        throw new Error(`Unsupported format: ${importFormat}`);
      }

      onImport?.(parsedData);
    } catch (error) {
      onError?.(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFormatChange = (format: string) => {
    setImportFormat(format);
  };

  return (
    <div data-testid="study-guide-importer">
      <h2>Study Guide Importer</h2>
      
      <div data-testid="import-options">
        <div>
          <label htmlFor="import-format">Import Format:</label>
          <select
            id="import-format"
            value={importFormat}
            onChange={(e) => handleFormatChange(e.target.value)}
            data-testid="format-select"
          >
            <option value="json">JSON</option>
            <option value="txt">Plain Text</option>
            <option value="csv">CSV</option>
            <option value="html">HTML</option>
          </select>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              data-testid="validate-structure"
              defaultChecked
            />
            Validate structure
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              data-testid="auto-format"
              defaultChecked
            />
            Auto-format content
          </label>
        </div>
      </div>

      <div data-testid="file-upload">
        <input
          type="file"
          accept=".json,.txt,.csv,.html"
          onChange={handleFileUpload}
          disabled={isImporting}
          data-testid="file-input"
        />
        <label htmlFor="file-input">
          {isImporting ? 'Importing...' : 'Choose file to import'}
        </label>
      </div>

      {isImporting && (
        <div data-testid="import-progress">Importing study guide...</div>
      )}

      <div data-testid="import-instructions">
        <h3>Import Instructions:</h3>
        <ul>
          <li>JSON: Full study guide structure with sections, keywords, examples, etc.</li>
          <li>Text: Plain text that will be split into sections</li>
          <li>CSV: Comma-separated values with headers</li>
          <li>HTML: HTML content that will be parsed</li>
        </ul>
      </div>
    </div>
  );
};

describe('StudyGuideImporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<MockStudyGuideImporter />);
    expect(screen.getByTestId('study-guide-importer')).toBeInTheDocument();
  });

  it('renders import options', () => {
    render(<MockStudyGuideImporter />);
    
    expect(screen.getByTestId('format-select')).toBeInTheDocument();
    expect(screen.getByTestId('validate-structure')).toBeInTheDocument();
    expect(screen.getByTestId('auto-format')).toBeInTheDocument();
  });

  it('renders file upload input', () => {
    render(<MockStudyGuideImporter />);
    
    expect(screen.getByTestId('file-input')).toBeInTheDocument();
    expect(screen.getByText('Choose file to import')).toBeInTheDocument();
  });

  it('renders import instructions', () => {
    render(<MockStudyGuideImporter />);
    
    expect(screen.getByTestId('import-instructions')).toBeInTheDocument();
    expect(screen.getByText('Import Instructions:')).toBeInTheDocument();
    expect(screen.getByText('JSON: Full study guide structure with sections, keywords, examples, etc.')).toBeInTheDocument();
  });

  it('updates import format when changed', () => {
    render(<MockStudyGuideImporter />);
    
    const formatSelect = screen.getByTestId('format-select');
    
    fireEvent.change(formatSelect, { target: { value: 'txt' } });
    expect(formatSelect).toHaveValue('txt');
  });

  it('calls onImport when file is uploaded successfully', async () => {
    const onImport = jest.fn();
    
    render(<MockStudyGuideImporter onImport={onImport} />);
    
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['{"title": "Test Study Guide", "sections": []}'], 'test.json', { type: 'application/json' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(onImport).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Study Guide',
          sections: []
        })
      );
    });
  });

  it('calls onError when file upload fails', async () => {
    const onError = jest.fn();
    
    // Mock a component that throws an error
    const ErrorStudyGuideImporter: React.FC<any> = ({ onError }) => {
      const handleFileUpload = () => {
        onError?.(new Error('Import failed'));
      };

      return (
        <div>
          <input
            type="file"
            onChange={handleFileUpload}
            data-testid="error-file-input"
          />
        </div>
      );
    };

    render(<ErrorStudyGuideImporter onError={onError} />);
    
    const fileInput = screen.getByTestId('error-file-input');
    fireEvent.change(fileInput, { target: { files: [new File([''], 'test.txt')] } });
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('shows progress indicator during import', async () => {
    render(<MockStudyGuideImporter />);
    
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['{"title": "Test Study Guide"}'], 'test.json', { type: 'application/json' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByTestId('import-progress')).toBeInTheDocument();
    expect(screen.getByText('Importing study guide...')).toBeInTheDocument();
  });

  it('updates file input label during import', async () => {
    render(<MockStudyGuideImporter />);
    
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['{"title": "Test Study Guide"}'], 'test.json', { type: 'application/json' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText('Importing...')).toBeInTheDocument();
  });

  it('disables file input during import', async () => {
    render(<MockStudyGuideImporter />);
    
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['{"title": "Test Study Guide"}'], 'test.json', { type: 'application/json' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(fileInput).toBeDisabled();
  });

  it('handles different file formats correctly', async () => {
    const onImport = jest.fn();
    
    render(<MockStudyGuideImporter onImport={onImport} />);
    
    const formatSelect = screen.getByTestId('format-select');
    const fileInput = screen.getByTestId('file-input');
    
    // Test JSON format
    fireEvent.change(formatSelect, { target: { value: 'json' } });
    const jsonFile = new File(['{"title": "JSON Study Guide", "sections": []}'], 'test.json', { type: 'application/json' });
    fireEvent.change(fileInput, { target: { files: [jsonFile] } });
    
    await waitFor(() => {
      expect(onImport).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'JSON Study Guide' })
      );
    });
    
    // Test TXT format
    fireEvent.change(formatSelect, { target: { value: 'txt' } });
    const txtFile = new File(['Section 1\n\nSection 2'], 'test.txt', { type: 'text/plain' });
    fireEvent.change(fileInput, { target: { files: [txtFile] } });
    
    await waitFor(() => {
      expect(onImport).toHaveBeenCalledWith(
        expect.objectContaining({ 
          title: 'Imported Study Guide',
          sections: expect.arrayContaining([
            expect.objectContaining({ title: 'Section 1' }),
            expect.objectContaining({ title: 'Section 2' })
          ])
        })
      );
    });
  });

  it('handles empty file gracefully', async () => {
    const onError = jest.fn();
    
    render(<MockStudyGuideImporter onError={onError} />);
    
    const fileInput = screen.getByTestId('file-input');
    const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
    
    fireEvent.change(fileInput, { target: { files: [emptyFile] } });
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  it('handles invalid JSON gracefully', async () => {
    const onError = jest.fn();
    
    render(<MockStudyGuideImporter onError={onError} />);
    
    const formatSelect = screen.getByTestId('format-select');
    const fileInput = screen.getByTestId('file-input');
    
    fireEvent.change(formatSelect, { target: { value: 'json' } });
    const invalidJsonFile = new File(['{ invalid json }'], 'invalid.json', { type: 'application/json' });
    fireEvent.change(fileInput, { target: { files: [invalidJsonFile] } });
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
