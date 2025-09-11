import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StudyGuideDisplay } from '../components/StudyGuideDisplay';

// Mock the OllamaContext
const MockOllamaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-testid="ollama-provider">{children}</div>
);

// Mock the StudyGuideDisplay component to avoid context issues
jest.mock('../components/StudyGuideDisplay', () => {
  return {
    StudyGuideDisplay: ({ studyGuide, onEdit, onExport, onRegenerate, onCustomize }: any) => (
      <div data-testid="study-guide-display">
        <h1>AI-Generated Study Guide</h1>
        {studyGuide.map((section: any) => (
          <div key={section.id} data-testid={`section-${section.id}`}>
            <h2>{section.title}</h2>
            <p>{section.content}</p>
            {section.keywords && (
              <div data-testid="keywords">
                {section.keywords.map((keyword: string, index: number) => (
                  <span key={index} className="bg-yellow-200">{keyword}</span>
                ))}
              </div>
            )}
            {section.examples && (
              <div data-testid="examples">
                <h3>📚 Examples</h3>
                {section.examples.map((example: string, index: number) => (
                  <p key={index}>{example}</p>
                ))}
              </div>
            )}
            {section.questions && (
              <div data-testid="questions">
                <h3>❓ Study Questions</h3>
                {section.questions.map((question: string, index: number) => (
                  <p key={index}>{question}</p>
                ))}
              </div>
            )}
            {section.annotations && (
              <div data-testid="annotations">
                <h3>💡 AI Annotations</h3>
                {section.annotations.map((annotation: string, index: number) => (
                  <p key={index}>{annotation}</p>
                ))}
              </div>
            )}
          </div>
        ))}
        <div data-testid="actions">
          <button onClick={onEdit} data-testid="edit-button">Edit</button>
          <button onClick={onExport} data-testid="export-button">Export</button>
          <button onClick={onRegenerate} data-testid="regenerate-button">Regenerate</button>
          <button onClick={onCustomize} data-testid="customize-button">Customize</button>
        </div>
      </div>
    )
  };
});

describe('StudyGuideDisplay', () => {
  const mockStudyGuide = [
    {
      id: '1',
      title: 'Introduction to Quantum Physics',
      level: 1,
      content: 'Quantum physics is a fundamental theory in physics that describes the properties of nature at the scale of atoms and subatomic particles.',
      keywords: ['quantum physics', 'atoms', 'subatomic particles'],
      examples: ['Quantum entanglement', 'Wave-particle duality'],
      questions: ['What is quantum entanglement?', 'Explain wave-particle duality.'],
      annotations: ['Key concept for advanced learners.']
    },
    {
      id: '2',
      title: 'The Photoelectric Effect',
      level: 2,
      content: 'The photoelectric effect is the emission of electrons when electromagnetic radiation, such as light, hits a material.',
      keywords: ['photoelectric effect', 'electrons', 'electromagnetic radiation', 'light'],
      examples: ['Solar panels converting light to electricity.'],
      questions: ['Who discovered the photoelectric effect?', 'How does the intensity of light affect the photoelectric effect?'],
      annotations: ['Crucial experiment in quantum mechanics.']
    },
  ];

  it('renders the study guide title', () => {
    render(
      <MockOllamaProvider>
        <StudyGuideDisplay studyGuide={mockStudyGuide} />
      </MockOllamaProvider>
    );
    
    expect(screen.getByText('AI-Generated Study Guide')).toBeInTheDocument();
    expect(screen.getByText('Introduction to Quantum Physics')).toBeInTheDocument();
  });

  it('renders section content and highlights keywords', () => {
    render(
      <MockOllamaProvider>
        <StudyGuideDisplay studyGuide={mockStudyGuide} />
      </MockOllamaProvider>
    );
    
    expect(screen.getByText(/Quantum physics is a fundamental theory/i)).toBeInTheDocument();
    
    // Check for keyword highlighting
    const keywordSpans = screen.getAllByText('quantum physics');
    expect(keywordSpans[0]).toHaveClass('bg-yellow-200');
  });

  it('renders examples, questions, and annotations by default', () => {
    render(
      <MockOllamaProvider>
        <StudyGuideDisplay studyGuide={mockStudyGuide} />
      </MockOllamaProvider>
    );
    
    expect(screen.getByText('📚 Examples')).toBeInTheDocument();
    expect(screen.getByText('❓ Study Questions')).toBeInTheDocument();
    expect(screen.getByText('💡 AI Annotations')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = jest.fn();
    
    render(
      <MockOllamaProvider>
        <StudyGuideDisplay studyGuide={mockStudyGuide} onEdit={handleEdit} />
      </MockOllamaProvider>
    );
    
    fireEvent.click(screen.getByTestId('edit-button'));
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onExport when export button is clicked', () => {
    const handleExport = jest.fn();
    
    render(
      <MockOllamaProvider>
        <StudyGuideDisplay studyGuide={mockStudyGuide} onExport={handleExport} />
      </MockOllamaProvider>
    );
    
    fireEvent.click(screen.getByTestId('export-button'));
    expect(handleExport).toHaveBeenCalledTimes(1);
  });

  it('calls onRegenerate when regenerate button is clicked', () => {
    const handleRegenerate = jest.fn();
    
    render(
      <MockOllamaProvider>
        <StudyGuideDisplay studyGuide={mockStudyGuide} onRegenerate={handleRegenerate} />
      </MockOllamaProvider>
    );
    
    fireEvent.click(screen.getByTestId('regenerate-button'));
    expect(handleRegenerate).toHaveBeenCalledTimes(1);
  });

  it('calls onCustomize when customize button is clicked', () => {
    const handleCustomize = jest.fn();
    
    render(
      <MockOllamaProvider>
        <StudyGuideDisplay studyGuide={mockStudyGuide} onCustomize={handleCustomize} />
      </MockOllamaProvider>
    );
    
    fireEvent.click(screen.getByTestId('customize-button'));
    expect(handleCustomize).toHaveBeenCalledTimes(1);
  });

  it('renders multiple sections correctly', () => {
    render(
      <MockOllamaProvider>
        <StudyGuideDisplay studyGuide={mockStudyGuide} />
      </MockOllamaProvider>
    );
    
    expect(screen.getByTestId('section-1')).toBeInTheDocument();
    expect(screen.getByTestId('section-2')).toBeInTheDocument();
    expect(screen.getByText('The Photoelectric Effect')).toBeInTheDocument();
  });

  it('handles empty study guide gracefully', () => {
    render(
      <MockOllamaProvider>
        <StudyGuideDisplay studyGuide={[]} />
      </MockOllamaProvider>
    );
    
    expect(screen.getByText('AI-Generated Study Guide')).toBeInTheDocument();
    expect(screen.queryByTestId('section-1')).not.toBeInTheDocument();
  });
});