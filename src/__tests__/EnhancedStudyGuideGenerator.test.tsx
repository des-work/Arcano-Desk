import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EnhancedStudyGuideGenerator } from '../components/EnhancedStudyGuideGenerator';
import { ProcessedDocument, StudyGuideEnhancementOptions } from '../utils/DocumentProcessor';

// Mock the useOllama hook
const mockAskQuestion = jest.fn();
jest.mock('../contexts/OllamaContext', () => ({
  useOllama: () => ({
    askQuestion: mockAskQuestion,
    isLoading: false,
  }),
}));

// Mock the DocumentProcessor
jest.mock('../utils/DocumentProcessor', () => ({
  DocumentProcessor: {
    generateEnhancedStudyContent: jest.fn().mockReturnValue('Enhanced study content'),
  },
}));

describe('EnhancedStudyGuideGenerator', () => {
  const mockDocuments: ProcessedDocument[] = [
    {
      id: '1',
      name: 'test.txt',
      type: 'text/plain',
      content: 'Test content',
      wordCount: 2,
      extractedText: 'Test content',
      metadata: {
        size: 100,
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
    },
  ];

  const mockOptions: StudyGuideEnhancementOptions = {
    includeAnnotations: true,
    includeContent: true,
    annotationTypes: {
      explanatory: true,
      crossReferences: true,
      historicalContext: true,
      studyTips: true,
      memoryAids: true,
    },
    contentTypes: {
      expandedExplanations: true,
      examples: true,
      caseStudies: true,
      practiceQuestions: true,
      summaries: true,
    },
  };

  const mockOnComplete = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockAskQuestion.mockResolvedValue('# Study Guide\n\nThis is a comprehensive study guide with enhanced content.');
  });

  it('renders without crashing', () => {
    render(
      <EnhancedStudyGuideGenerator
        documents={[]}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    expect(screen.getByText('Enhanced Study Guide Generator')).toBeInTheDocument();
  });

  it('shows generation progress when generating', async () => {
    render(
      <EnhancedStudyGuideGenerator
        documents={mockDocuments}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    // Wait for generation to start
    await waitFor(() => {
      expect(screen.getByText('Generating Enhanced Study Guide')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Analyzing documents...')).toBeInTheDocument();
    expect(screen.getByText('0% Complete')).toBeInTheDocument();
  });

  it('calls onComplete when generation is successful', async () => {
    render(
      <EnhancedStudyGuideGenerator
        documents={mockDocuments}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('calls onError when generation fails', async () => {
    const error = new Error('Generation failed');
    mockAskQuestion.mockRejectedValue(error);
    
    render(
      <EnhancedStudyGuideGenerator
        documents={mockDocuments}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith(error);
    });
  });

  it('shows error message when generation fails', async () => {
    const error = new Error('Generation failed');
    mockAskQuestion.mockRejectedValue(error);
    
    render(
      <EnhancedStudyGuideGenerator
        documents={mockDocuments}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Error Generating Study Guide')).toBeInTheDocument();
      expect(screen.getByText('Generation failed')).toBeInTheDocument();
    });
  });

  it('shows retry button when generation fails', async () => {
    const error = new Error('Generation failed');
    mockAskQuestion.mockRejectedValue(error);
    
    render(
      <EnhancedStudyGuideGenerator
        documents={mockDocuments}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('shows study guide display when generation is complete', async () => {
    render(
      <EnhancedStudyGuideGenerator
        documents={mockDocuments}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('AI Study Guide')).toBeInTheDocument();
    });
  });

  it('handles empty documents array', () => {
    render(
      <EnhancedStudyGuideGenerator
        documents={[]}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    expect(screen.getByText('Enhanced Study Guide Generator')).toBeInTheDocument();
  });

  it('shows generation steps during processing', async () => {
    render(
      <EnhancedStudyGuideGenerator
        documents={mockDocuments}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Analyzing documents...')).toBeInTheDocument();
    });
  });

  it('updates progress during generation', async () => {
    render(
      <EnhancedStudyGuideGenerator
        documents={mockDocuments}
        enhancementOptions={mockOptions}
        onComplete={mockOnComplete}
        onError={mockOnError}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Generating Enhanced Study Guide')).toBeInTheDocument();
    });
  });
});
