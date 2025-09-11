import { DocumentProcessor, StudyGuideEnhancementOptions } from '../utils/DocumentProcessor';

// Mock File object for testing
const createMockFile = (name: string, type: string, content: string): File => {
  const file = new File([content], name, { type });
  return file;
};

describe('DocumentProcessor', () => {
  describe('processFile', () => {
    it('should process a text file and extract content', async () => {
      const mockFile = createMockFile('test.txt', 'text/plain', 'This is a test document with some content for analysis.');
      
      const result = await DocumentProcessor.processFile(mockFile);
      
      expect(result).toBeDefined();
      expect(result.name).toBe('test.txt');
      expect(result.type).toBe('text/plain');
      expect(result.content).toBe('This is a test document with some content for analysis.');
      expect(result.wordCount).toBeGreaterThan(0);
      expect(result.keyConcepts).toBeDefined();
      expect(result.vocabulary).toBeDefined();
      expect(result.importantSections).toBeDefined();
      expect(result.structure).toBeDefined();
    });

    it('should handle PDF files with placeholder content', async () => {
      const mockFile = createMockFile('test.pdf', 'application/pdf', 'PDF content');
      
      const result = await DocumentProcessor.processFile(mockFile);
      
      expect(result).toBeDefined();
      expect(result.name).toBe('test.pdf');
      expect(result.type).toBe('application/pdf');
      expect(result.content).toContain('PDF Document: test.pdf');
    });

    it('should handle Word documents with placeholder content', async () => {
      const mockFile = createMockFile('test.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Word content');
      
      const result = await DocumentProcessor.processFile(mockFile);
      
      expect(result).toBeDefined();
      expect(result.name).toBe('test.docx');
      expect(result.type).toBe('application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      expect(result.content).toContain('Word Document: test.docx');
    });

    it('should handle image files with placeholder content', async () => {
      const mockFile = createMockFile('test.jpg', 'image/jpeg', 'Image content');
      
      const result = await DocumentProcessor.processFile(mockFile);
      
      expect(result).toBeDefined();
      expect(result.name).toBe('test.jpg');
      expect(result.type).toBe('image/jpeg');
      expect(result.content).toContain('Image Document: test.jpg');
    });
  });

  describe('generateEnhancedStudyContent', () => {
    const mockDocuments = [
      {
        id: '1',
        name: 'test1.txt',
        type: 'text/plain',
        content: 'Test content 1',
        wordCount: 2,
        extractedText: 'Test content 1',
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

    it('should generate enhanced study content with all options enabled', () => {
      const result = DocumentProcessor.generateEnhancedStudyContent(mockDocuments, mockOptions, 'academic');
      
      expect(result).toContain('Create a comprehensive academic study guide');
      expect(result).toContain('ANNOTATIONS TO INCLUDE:');
      expect(result).toContain('Explanatory notes for complex terms and concepts');
      expect(result).toContain('Cross-references between related concepts');
      expect(result).toContain('Historical context and background information');
      expect(result).toContain('Study tips and learning strategies');
      expect(result).toContain('Memory aids and mnemonic devices');
      expect(result).toContain('ADDITIONAL CONTENT TO GENERATE:');
      expect(result).toContain('Expanded explanations of key concepts');
      expect(result).toContain('Practical examples and illustrations');
      expect(result).toContain('Case studies and real-world applications');
      expect(result).toContain('Practice questions and exercises');
      expect(result).toContain('Summary sections and key takeaways');
      expect(result).toContain('Key Concepts: concept1, concept2');
      expect(result).toContain('Vocabulary: term1, term2');
    });

    it('should generate content with only annotations enabled', () => {
      const optionsOnlyAnnotations: StudyGuideEnhancementOptions = {
        ...mockOptions,
        includeContent: false,
      };
      
      const result = DocumentProcessor.generateEnhancedStudyContent(mockDocuments, optionsOnlyAnnotations, 'academic');
      
      expect(result).toContain('ANNOTATIONS TO INCLUDE:');
      expect(result).not.toContain('ADDITIONAL CONTENT TO GENERATE:');
    });

    it('should generate content with only additional content enabled', () => {
      const optionsOnlyContent: StudyGuideEnhancementOptions = {
        ...mockOptions,
        includeAnnotations: false,
      };
      
      const result = DocumentProcessor.generateEnhancedStudyContent(mockDocuments, optionsOnlyContent, 'academic');
      
      expect(result).not.toContain('ANNOTATIONS TO INCLUDE:');
      expect(result).toContain('ADDITIONAL CONTENT TO GENERATE:');
    });

    it('should handle empty documents array', () => {
      const result = DocumentProcessor.generateEnhancedStudyContent([], mockOptions, 'academic');
      
      expect(result).toBe('No documents available for study guide generation.');
    });
  });

  describe('generateStudyContent', () => {
    const mockDocuments = [
      {
        id: '1',
        name: 'test1.txt',
        type: 'text/plain',
        content: 'Test content 1',
        wordCount: 2,
        extractedText: 'Test content 1',
        metadata: {
          size: 100,
          uploadDate: new Date(),
          lastProcessed: new Date(),
        },
      },
    ];

    it('should generate study content for academic style', () => {
      const result = DocumentProcessor.generateStudyContent(mockDocuments, 'academic');
      
      expect(result).toContain('Create a comprehensive academic study guide');
      expect(result).toContain('Document: test1.txt');
      expect(result).toContain('Type: text/plain');
      expect(result).toContain('Word Count: 2');
    });

    it('should generate study content for casual style', () => {
      const result = DocumentProcessor.generateStudyContent(mockDocuments, 'casual');
      
      expect(result).toContain('Create a friendly, conversational study guide');
    });

    it('should generate study content for creative style', () => {
      const result = DocumentProcessor.generateStudyContent(mockDocuments, 'creative');
      
      expect(result).toContain('Create an imaginative, engaging study guide');
    });

    it('should generate study content for technical style', () => {
      const result = DocumentProcessor.generateStudyContent(mockDocuments, 'technical');
      
      expect(result).toContain('Create a detailed technical study guide');
    });

    it('should generate study content for minimal style', () => {
      const result = DocumentProcessor.generateStudyContent(mockDocuments, 'minimal');
      
      expect(result).toContain('Create a concise, bullet-point style study guide');
    });

    it('should handle empty documents array', () => {
      const result = DocumentProcessor.generateStudyContent([], 'academic');
      
      expect(result).toBe('No documents available for study guide generation.');
    });
  });
});
