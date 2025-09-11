import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DocumentUploadProcessor } from '../components/DocumentUploadProcessor';

// Mock the DocumentProcessor
jest.mock('../utils/DocumentProcessor', () => ({
  DocumentProcessor: {
    processFile: jest.fn().mockImplementation(async (file: File) => ({
      id: 'test-id',
      name: file.name,
      type: file.type,
      content: 'Test content',
      wordCount: 2,
      extractedText: 'Test content',
      metadata: {
        size: file.size,
        uploadDate: new Date(),
        lastProcessed: new Date(),
      },
      keyConcepts: ['concept1', 'concept2'],
      vocabulary: ['term1', 'term2'],
      importantSections: ['section1'],
      structure: {
        headings: ['heading1'],
        paragraphs: ['paragraph1'],
        lists: ['list1'],
      },
    })),
  },
}));

describe('DocumentUploadProcessor', () => {
  const mockOnDocumentsProcessed = jest.fn();
  const mockOnGenerateStudyGuide = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    expect(screen.getByText('Upload Documents')).toBeInTheDocument();
  });

  it('renders upload area with drag and drop functionality', () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    expect(screen.getByText('Drag and drop files here or click to browse')).toBeInTheDocument();
    expect(screen.getByText('Supports PDF, Word, Text, and Image files')).toBeInTheDocument();
  });

  it('handles file input change', async () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Documents');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockOnDocumentsProcessed).toHaveBeenCalled();
    });
  });

  it('handles drag and drop', async () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const uploadArea = screen.getByText('Upload Documents').closest('div');
    
    fireEvent.dragOver(uploadArea!);
    fireEvent.drop(uploadArea!, { dataTransfer: { files: [file] } });
    
    await waitFor(() => {
      expect(mockOnDocumentsProcessed).toHaveBeenCalled();
    });
  });

  it('shows processing state during file processing', async () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Documents');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText('Processing Documents...')).toBeInTheDocument();
    expect(screen.getByText('Analyzing content...')).toBeInTheDocument();
  });

  it('displays processed documents', async () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Documents');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText('Processed Documents (1)')).toBeInTheDocument();
      expect(screen.getByText('test.txt')).toBeInTheDocument();
    });
  });

  it('shows enhancement options when documents are processed', async () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Documents');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText('Study Guide Enhancement Options')).toBeInTheDocument();
      expect(screen.getByText('Include Annotations')).toBeInTheDocument();
      expect(screen.getByText('Include Additional Content')).toBeInTheDocument();
    });
  });

  it('allows toggling enhancement options', async () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Documents');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      const annotationsCheckbox = screen.getByLabelText('Include Annotations');
      const contentCheckbox = screen.getByLabelText('Include Additional Content');
      
      expect(annotationsCheckbox).toBeChecked();
      expect(contentCheckbox).toBeChecked();
      
      fireEvent.click(annotationsCheckbox);
      fireEvent.click(contentCheckbox);
      
      expect(annotationsCheckbox).not.toBeChecked();
      expect(contentCheckbox).not.toBeChecked();
    });
  });

  it('calls onGenerateStudyGuide when generate button is clicked', async () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Documents');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      const generateButton = screen.getByText('Generate Enhanced Study Guide');
      fireEvent.click(generateButton);
      
      expect(mockOnGenerateStudyGuide).toHaveBeenCalled();
    });
  });

  it('shows analysis details when toggle is clicked', async () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Documents');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      const toggleButton = screen.getByText('Show Analysis');
      fireEvent.click(toggleButton);
      
      expect(screen.getByText('Key Concepts:')).toBeInTheDocument();
      expect(screen.getByText('Vocabulary:')).toBeInTheDocument();
    });
  });

  it('disables input during processing', async () => {
    render(
      <DocumentUploadProcessor
        onDocumentsProcessed={mockOnDocumentsProcessed}
        onGenerateStudyGuide={mockOnGenerateStudyGuide}
      />
    );
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('Upload Documents');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(input).toBeDisabled();
  });
});
