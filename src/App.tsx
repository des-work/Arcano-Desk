import React, { useState, useEffect, Suspense } from 'react';
import { ProcessedDocument, DocumentProcessor } from './utils/DocumentProcessor.ts';
import { OllamaProvider } from './contexts/OllamaContext.tsx';
import { OptimizedOllamaProvider } from './contexts/OptimizedOllamaContext.tsx';
import { RobustOllamaProvider, useRobustOllama } from './contexts/RobustOllamaContext.tsx';
import AIDocumentAnalyzer from './components/AIDocumentAnalyzer.tsx';
import MarkedDocumentViewer from './components/MarkedDocumentViewer.tsx';
import LibraryPhase from './components/LibraryPhase.tsx';
import LaunchScreen from './components/LaunchScreen.tsx';
import AIStatusIndicator from './components/AIStatusIndicator.tsx';
// import { PerformanceMonitor } from './components/PerformanceMonitor.tsx';
import { StudyGuideEnhancementOptions } from './utils/DocumentProcessor';
// import { SimpleDocumentUpload } from './components/SimpleDocumentUpload';
import './styles/magical-academia.css';

// Inline SimpleDocumentUpload component
interface SimpleDocumentUploadProps {
  onFileSelect: (file: File) => void;
  className?: string;
}

const SimpleDocumentUpload: React.FC<SimpleDocumentUploadProps> = ({
  onFileSelect,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-purple-400 bg-purple-50/20'
            : 'border-purple-300 bg-purple-50/10 hover:border-purple-400 hover:bg-purple-50/20'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="space-y-4">
          <div className="text-6xl">📁</div>
          <div>
            <h3 className="text-2xl font-bold text-purple-200 mb-2">
              Upload Documents
            </h3>
            <p className="text-purple-300/70">
              Drag and drop files here or click to browse
            </p>
            <p className="text-purple-300/50 text-sm mt-2">
              Supports PDF, Word, Text, and Image files
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const { 
    isConnected, 
    isLoading: aiLoading, 
    generateSummary, 
    generateStudyMaterial, 
    askQuestion,
    reconnect,
    getConnectionInfo 
  } = useRobustOllama();
  const [showLaunchScreen, setShowLaunchScreen] = useState(true);
  const [currentPhase, setCurrentPhase] = useState<'welcome' | 'upload' | 'library' | 'sample' | 'customize' | 'export' | 'generating'>('welcome');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [aiStatus, setAiStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [generatedStudyGuide, setGeneratedStudyGuide] = useState<any[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [enhancementOptions, setEnhancementOptions] = useState<StudyGuideEnhancementOptions | null>(null);
  const [showEnhancedGenerator, setShowEnhancedGenerator] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [showEnhancedStudyGuide, setShowEnhancedStudyGuide] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showStudyGuide, setShowStudyGuide] = useState(false);
  const [sampleStudyGuide, setSampleStudyGuide] = useState<any[]>([]);
  const [customizedStudyGuide, setCustomizedStudyGuide] = useState<any[]>([]);
  const [isSampleApproved, setIsSampleApproved] = useState(false);
  const [customizationOptions, setCustomizationOptions] = useState({
    includeExamples: true,
    includeQuestions: true,
    includeAnnotations: true,
    includeSummaries: true,
    detailLevel: 'comprehensive' as 'basic' | 'comprehensive' | 'detailed',
    focusAreas: [] as string[]
  });
  
  // AI Analysis states
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [showMarkedDocument, setShowMarkedDocument] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCache, setAnalysisCache] = useState<Map<string, any>>(new Map());

  // Update AI status based on actual connection
  useEffect(() => {
    if (isConnected) {
      setAiStatus('connected');
    } else if (aiLoading) {
      setAiStatus('connecting');
    } else {
      setAiStatus('disconnected');
    }
  }, [isConnected, aiLoading]);

  const handlePhaseChange = (phase: 'welcome' | 'upload' | 'library' | 'sample' | 'customize' | 'export' | 'generating') => {
    setCurrentPhase(phase);
    setShowLaunchScreen(false);
  };

  const handleStartJourney = () => {
    setShowLaunchScreen(false);
    setCurrentPhase('upload');
  };

  const handleEnhancedDocumentsProcessed = (processedDocs: ProcessedDocument[]) => {
    setDocuments(processedDocs);
    setUploadComplete(true);
    setCurrentPhase('library');
  };

  const handleEnhancedStudyGuideGeneration = (processedDocs: ProcessedDocument[], options: StudyGuideEnhancementOptions) => {
    setDocuments(processedDocs);
    setEnhancementOptions(options);
    setShowEnhancedGenerator(true);
      setCurrentPhase('generating');
  };

  const handleEnhancedStudyGuideComplete = (studyGuide: any[]) => {
    setGeneratedStudyGuide(studyGuide);
    setShowStudyGuide(true);
    setCurrentPhase('sample');
  };

  const handleStudyGuideComplete = (studyGuide: any[]) => {
    setGeneratedStudyGuide(studyGuide);
    setShowStudyGuide(true);
    setCurrentPhase('sample');
  };

  // AI-powered function to generate study guide from uploaded documents
  const generateStudyGuideFromDocuments = async (docs: ProcessedDocument[]) => {
    if (!docs || docs.length === 0) {
      throw new Error('No documents to process');
    }

    if (!isConnected) {
      throw new Error('AI is not connected. Please check your Ollama connection.');
    }

    // Create cache key from document content hashes
    const cacheKey = docs.map(doc => `${doc.name}-${doc.content.length}`).join('|');
    
    // Check cache first (instant response for repeated documents)
    if (analysisCache.has(cacheKey)) {
      console.log('Using cached analysis for faster response');
      const cachedAnalysis = analysisCache.get(cacheKey);
      setAiAnalysis(cachedAnalysis.combinedAnalysis);
      setSampleStudyGuide(cachedAnalysis.studyGuideSections);
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      // Use AI to analyze documents directly
      // Analyze each document with AI
      const analysisResults: any[] = [];
      
      // Pre-process all documents to extract content efficiently
      const preprocessedDocs = docs.map(doc => ({
        ...doc,
        keyTerms: extractKeyTermsFromDocument(doc.content),
        examples: extractExamplesFromDocument(doc.content)
      }));

      // Combine all content for single AI call (faster than multiple calls)
      const combinedContent = preprocessedDocs.map(doc => 
        `Document: ${doc.name}\n${doc.content}\n\nKey Terms Found: ${doc.keyTerms.join(', ')}\nExamples Found: ${doc.examples.slice(0, 3).join('; ')}\n\n`
      ).join('---\n\n');

      // Check AI connection status before making calls
      console.log('AI Connection Status:', { isConnected, aiLoading });
      
      let questionsResponse = '';
      let studyNotesResponse = '';
      let keyTakeawaysResponse = '';
      let annotationsResponse = '';
      let examplesResponse = '';

      if (isConnected && !aiLoading) {
        console.log('Making AI calls with connected AI...');
        try {
          // Enhanced AI analysis with comprehensive content generation
          [questionsResponse, studyNotesResponse, keyTakeawaysResponse, annotationsResponse, examplesResponse] = await Promise.all([
            generateStudyMaterial(combinedContent, 'questions'),
            generateStudyMaterial(combinedContent, 'notes'),
            generateSummary(combinedContent, 'long'),
            generateStudyMaterial(combinedContent, 'annotations'),
            generateStudyMaterial(combinedContent, 'examples')
          ]);
          console.log('AI calls completed successfully');
        } catch (error) {
          console.error('AI calls failed:', error);
          // Continue with empty responses, will use fallbacks
        }
      } else {
        console.log('AI not connected, using fallback content');
        // Will use fallback content below
      }

      // Process AI responses with better filtering and fallbacks
      console.log('=== AI RESPONSE ANALYSIS ===');
      console.log('Questions Response Length:', questionsResponse.length);
      console.log('Study Notes Response Length:', studyNotesResponse.length);
      console.log('Key Takeaways Response Length:', keyTakeawaysResponse.length);
      console.log('Annotations Response Length:', annotationsResponse.length);
      console.log('Examples Response Length:', examplesResponse.length);
      
      console.log('Raw AI Responses:', {
        questionsResponse: questionsResponse.substring(0, 300),
        studyNotesResponse: studyNotesResponse.substring(0, 300),
        keyTakeawaysResponse: keyTakeawaysResponse.substring(0, 300),
        annotationsResponse: annotationsResponse.substring(0, 300),
        examplesResponse: examplesResponse.substring(0, 300)
      });

      // Improved response processing with better filtering
      const processAIResponse = (response: string, type: string) => {
        if (!response || response.trim().length === 0) {
          console.log(`${type} response is empty`);
          return [];
        }
        
        const lines = response.split('\n')
          .map(line => line.trim())
          .filter(line => {
            // Filter out empty lines and common AI response prefixes
            if (line.length === 0) return false;
            if (line.includes('AI response not available')) return false;
            if (line.includes('I apologize')) return false;
            if (line.includes('I cannot')) return false;
            if (line.startsWith('Here are')) return false;
            if (line.startsWith('Based on')) return false;
            return true;
          })
          .slice(0, 10);
        
        console.log(`${type} processed lines:`, lines.length, lines.slice(0, 3));
        return lines;
      };

      const questions = processAIResponse(questionsResponse, 'Questions');
      const studyNotes = processAIResponse(studyNotesResponse, 'Study Notes');
      const keyTakeaways = processAIResponse(keyTakeawaysResponse, 'Key Takeaways');
      const annotations = processAIResponse(annotationsResponse, 'Annotations');
      const aiExamples = processAIResponse(examplesResponse, 'Examples');

      console.log('Processed Content:', {
        questions: questions.length,
        studyNotes: studyNotes.length,
        keyTakeaways: keyTakeaways.length,
        annotations: annotations.length,
        aiExamples: aiExamples.length
      });

      // Enhanced fallback content based on document content
      const generateFallbackContent = (docs: any[], type: string) => {
        const docNames = docs.map(d => d.name).join(', ');
        const docCount = docs.length;
        
        switch (type) {
          case 'questions':
            return [
              `What are the main topics covered in ${docNames}?`,
              `How do the concepts in these ${docCount} document${docCount > 1 ? 's' : ''} relate to each other?`,
              `What are the key definitions or terms explained in ${docNames}?`,
              `What practical examples or applications are mentioned?`,
              `What are the most important points to remember from ${docNames}?`,
              `How would you summarize the main ideas in your own words?`,
              `What questions do you still have after reading ${docNames}?`
            ];
          case 'studyNotes':
            return [
              `Focus on the main headings and subheadings in ${docNames}`,
              `Identify and define all key terms mentioned`,
              `Look for numbered lists, bullet points, and examples`,
              `Note any formulas, processes, or step-by-step procedures`,
              `Highlight important dates, numbers, or statistics`,
              `Pay attention to bold, italic, or underlined text`,
              `Look for "for example" or "such as" statements`
            ];
          case 'keyTakeaways':
            return [
              `${docNames} contains important information that builds understanding`,
              `The concepts presented are interconnected and support each other`,
              `Practical examples help illustrate theoretical concepts`,
              `Regular review of this material will improve retention`,
              `Connecting this information to prior knowledge enhances learning`,
              `The structure follows a logical progression of ideas`,
              `Key points are essential for understanding the broader context`
            ];
          case 'annotations':
            return [
              `This section provides foundational knowledge for the topic`,
              `Pay attention to examples - they illustrate key concepts clearly`,
              `The structure follows a logical progression of ideas`,
              `These points are essential for understanding the broader context`,
              `Consider how this relates to real-world applications`,
              `Look for patterns that repeat throughout the material`,
              `Note the relationships between different concepts`
            ];
          case 'examples':
            return [
              `Look for sentences that start with "For example" or "Such as"`,
              `Find numbered lists that provide specific instances`,
              `Identify bullet points that give concrete examples`,
              `Look for case studies or real-world applications mentioned`,
              `Find analogies or comparisons used to explain concepts`,
              `Look for step-by-step procedures or processes`,
              `Identify specific data, numbers, or statistics provided`
            ];
          default:
            return [];
        }
      };

      const fallbackQuestions = generateFallbackContent(docs, 'questions');
      const fallbackStudyNotes = generateFallbackContent(docs, 'studyNotes');
      const fallbackKeyTakeaways = generateFallbackContent(docs, 'keyTakeaways');
      const fallbackAnnotations = generateFallbackContent(docs, 'annotations');
      const fallbackExamples = generateFallbackContent(docs, 'examples');

      // Use fallbacks if AI responses are insufficient
      const finalQuestions = questions.length > 0 ? questions : fallbackQuestions.slice(0, 5);
      const finalStudyNotes = studyNotes.length > 0 ? studyNotes : fallbackStudyNotes.slice(0, 5);
      const finalKeyTakeaways = keyTakeaways.length > 0 ? keyTakeaways : fallbackKeyTakeaways.slice(0, 5);
      const finalAnnotations = annotations.length > 0 ? annotations : fallbackAnnotations.slice(0, 5);
      const finalAiExamples = aiExamples.length > 0 ? aiExamples : fallbackExamples.slice(0, 5);

      // Create analysis results for each document with comprehensive content
      preprocessedDocs.forEach((doc, index) => {
        const docQuestions = finalQuestions.slice(index * 2, (index + 1) * 2);
        const docStudyNotes = finalStudyNotes.slice(index * 2, (index + 1) * 2);
        const docKeyTakeaways = finalKeyTakeaways.slice(index * 2, (index + 1) * 2);
        const docAnnotations = finalAnnotations.slice(index * 2, (index + 1) * 2);
        const docAiExamples = finalAiExamples.slice(index * 2, (index + 1) * 2);
        
        // Combine extracted examples with AI-generated examples
        const combinedExamples = [...doc.examples, ...docAiExamples].slice(0, 8);
        
        // Ensure we have content for each category
        const finalDocQuestions = docQuestions.length > 0 ? docQuestions : finalQuestions.slice(0, 2);
        const finalDocStudyNotes = docStudyNotes.length > 0 ? docStudyNotes : finalStudyNotes.slice(0, 2);
        const finalDocKeyTakeaways = docKeyTakeaways.length > 0 ? docKeyTakeaways : finalKeyTakeaways.slice(0, 2);
        const finalDocAnnotations = docAnnotations.length > 0 ? docAnnotations : finalAnnotations.slice(0, 2);
        
        const analysisResult = {
          keyTerms: doc.keyTerms,
          examples: combinedExamples,
          questions: finalDocQuestions,
          studyNotes: finalDocStudyNotes,
          keyTakeaways: finalDocKeyTakeaways,
          annotations: finalDocAnnotations
        };
        
        console.log(`Analysis Result for Document ${index + 1}:`, {
          keyTerms: analysisResult.keyTerms.length,
          examples: analysisResult.examples.length,
          questions: analysisResult.questions.length,
          studyNotes: analysisResult.studyNotes.length,
          keyTakeaways: analysisResult.keyTakeaways.length,
          annotations: analysisResult.annotations.length
        });
        
        analysisResults.push(analysisResult);
      });
      
      // Combine all analysis results
      const combinedAnalysis = {
        keyTerms: [...new Set(analysisResults.flatMap(r => r.keyTerms))],
        examples: [...new Set(analysisResults.flatMap(r => r.examples))],
        questions: [...new Set(analysisResults.flatMap(r => r.questions))],
        studyNotes: [...new Set(analysisResults.flatMap(r => r.studyNotes))],
        keyTakeaways: [...new Set(analysisResults.flatMap(r => r.keyTakeaways))],
        annotations: [...new Set(analysisResults.flatMap(r => r.annotations))],
        markedDocument: docs.map(doc => doc.content).join('\n\n---\n\n')
      };
      
      setAiAnalysis(combinedAnalysis);
      
      // Generate study guide sections based on AI analysis
      const studyGuideSections: any[] = [];

      // Create a section for each document with comprehensive content
      docs.forEach((doc, index) => {
        const section = {
          id: `doc-${index + 1}`,
          title: `${doc.name} - AI Analyzed Content`,
          content: doc.content.substring(0, 800) + (doc.content.length > 800 ? '...' : ''),
          keywords: analysisResults[index]?.keyTerms || [],
          examples: analysisResults[index]?.examples || [],
          questions: analysisResults[index]?.questions || [],
          annotations: analysisResults[index]?.annotations || [],
          summaries: analysisResults[index]?.keyTakeaways || [],
          studyNotes: analysisResults[index]?.studyNotes || []
        };
        studyGuideSections.push(section);
      });

      // Create a comprehensive overview section
      if (docs.length > 1) {
        const overviewSection = {
          id: 'overview',
          title: 'AI Document Overview & Cross-References',
          content: `This study guide combines AI analysis from ${docs.length} uploaded documents: ${docs.map(d => d.name).join(', ')}. The following sections provide detailed AI-powered analysis of each document's key concepts and important information.`,
          keywords: combinedAnalysis.keyTerms.slice(0, 20),
          examples: combinedAnalysis.examples.slice(0, 10),
          questions: [
            'How do the concepts from different documents relate to each other?',
            'What are the common themes across all documents?',
            'Which concepts appear most frequently across documents?',
            'What are the main ideas that connect all documents?'
          ],
          annotations: combinedAnalysis.annotations.slice(0, 8),
          summaries: combinedAnalysis.keyTakeaways.slice(0, 8),
          studyNotes: combinedAnalysis.studyNotes.slice(0, 8)
        };
        studyGuideSections.unshift(overviewSection);
      }

      console.log('=== FINAL STUDY GUIDE ANALYSIS ===');
      console.log('Total sections created:', studyGuideSections.length);
      console.log('AI Connection Status:', { isConnected, aiLoading });
      console.log('Content Sources:', {
        usingAI: isConnected && !aiLoading,
        usingFallbacks: !isConnected || aiLoading,
        questionsSource: questions.length > 0 ? 'AI' : 'Fallback',
        studyNotesSource: studyNotes.length > 0 ? 'AI' : 'Fallback',
        keyTakeawaysSource: keyTakeaways.length > 0 ? 'AI' : 'Fallback',
        annotationsSource: annotations.length > 0 ? 'AI' : 'Fallback',
        examplesSource: aiExamples.length > 0 ? 'AI' : 'Fallback'
      });
      
      console.log('Final Study Guide Sections:', studyGuideSections.map(section => ({
        title: section.title,
        keywords: section.keywords?.length || 0,
        examples: section.examples?.length || 0,
        questions: section.questions?.length || 0,
        studyNotes: section.studyNotes?.length || 0,
        annotations: section.annotations?.length || 0,
        summaries: section.summaries?.length || 0
      })));

      setSampleStudyGuide(studyGuideSections);
      setIsAnalyzing(false);

      // Cache the results for future use (instant response next time)
      const cacheData = {
        combinedAnalysis,
        studyGuideSections
      };
      setAnalysisCache(prev => new Map(prev.set(cacheKey, cacheData)));

    } catch (error) {
      console.error('Error generating study guide:', error);
      setAnalysisError('Failed to analyze documents. Please try again.');
      setIsAnalyzing(false);
      throw error;
    }
  };

  // Enhanced helper functions to generate study content from document text
  const extractKeyTermsFromDocument = (content: string): string[] => {
    const keyTerms: string[] = [];
    
    // Extract section headers (bold and underlined) - your primary format
    const sectionHeaders = content.match(/\*\*([^*]+)\*\*/g) || [];
    const underlinedHeaders = content.match(/__([^_]+)__/g) || [];
    
    // Extract section subheaders (bold only)
    const subHeaders = content.match(/\*\*([^*]+)\*\*/g) || [];
    
    // Extract concepts being explained (italics) - your key format
    const conceptTerms = content.match(/\*([^*]+)\*/g) || [];
    
    // Extract headings and subheadings (lines that start with #)
    const headings = content.match(/^#+\s*(.+)$/gm) || [];
    
    // Extract terms from headings
    const headingTerms = headings.map(h => h.replace(/^#+\s*/, '').trim());
    keyTerms.push(...headingTerms);
    
    // Extract section headers (bold and underlined)
    const sectionHeaderTerms = sectionHeaders.map(h => h.replace(/\*\*/g, '').trim());
    keyTerms.push(...sectionHeaderTerms);
    
    // Extract underlined headers
    const underlinedTerms = underlinedHeaders.map(h => h.replace(/__/g, '').trim());
    keyTerms.push(...underlinedTerms);
    
    // Extract concepts (italics) - your most important terms
    const conceptTermsClean = conceptTerms.map(t => t.replace(/\*/g, '').trim());
    keyTerms.push(...conceptTermsClean);
    
    // Extract technical terms and commands (your field-specific terms)
    const technicalTerms = content.match(/\b[A-Z][a-z]+(?: [A-Z][a-z]+)*\b/g) || [];
    keyTerms.push(...technicalTerms.slice(0, 5));
    
    // Extract acronyms and abbreviations (with explanations)
    const acronyms = content.match(/\b[A-Z]{2,}\b/g) || [];
    keyTerms.push(...acronyms.slice(0, 3));
    
    // Filter out common words and duplicates
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall', 'from', 'they', 'them', 'their', 'there', 'here', 'where', 'when', 'why', 'how', 'what', 'which', 'who', 'chapter', 'section', 'part', 'figure', 'table', 'page', 'note', 'example', 'case', 'study']);
    
    return [...new Set(keyTerms)]
      .filter(term => term.length > 2 && !commonWords.has(term.toLowerCase()))
      .slice(0, 10);
  };

  const extractExamplesFromDocument = (content: string): string[] => {
    const examples: string[] = [];
    
    // Extract code snippets (your primary example type)
    const codeSnippets = content.match(/```[\s\S]*?```/g) || [];
    const inlineCode = content.match(/`[^`]+`/g) || [];
    examples.push(...codeSnippets.map(code => code.trim()));
    examples.push(...inlineCode.map(code => code.trim()));
    
    // Extract case studies (your secondary example type)
    const caseStudyPatterns = [
      /case study[^.]*\./gi,
      /case[^.]*\./gi,
      /scenario[^.]*\./gi,
      /situation[^.]*\./gi
    ];
    
    caseStudyPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        examples.push(...matches.map(match => match.trim()));
      }
    });
    
    // Extract analogies (your third example type)
    const analogyPatterns = [
      /analogy[^.]*\./gi,
      /like[^.]*\./gi,
      /similar to[^.]*\./gi,
      /comparable to[^.]*\./gi,
      /just as[^.]*\./gi
    ];
    
    analogyPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        examples.push(...matches.map(match => match.trim()));
      }
    });
    
    // Extract step-by-step examples (your preferred format)
    const stepByStepPatterns = [
      /step \d+[^.]*\./gi,
      /first[^.]*\./gi,
      /second[^.]*\./gi,
      /third[^.]*\./gi,
      /next[^.]*\./gi,
      /then[^.]*\./gi,
      /finally[^.]*\./gi
    ];
    
    stepByStepPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        examples.push(...matches.map(match => match.trim()));
      }
    });
    
    // Extract numbered examples (1., 2., etc.) - your preferred format
    const numberedExamples = content.match(/^\s*\d+\.\s+[^.\n]+\./gm) || [];
    examples.push(...numberedExamples.map(ex => ex.trim()));
    
    // Extract bullet point examples (small quick lists) - your preferred format
    const bulletExamples = content.match(/^\s*[-*•]\s+[^.\n]+\./gm) || [];
    examples.push(...bulletExamples.map(ex => ex.trim()));
    
    // Extract paragraph examples (your preferred format)
    const paragraphExamples = content.match(/^[^#\*\-\d].*example[^.]*\./gim) || [];
    examples.push(...paragraphExamples.map(ex => ex.trim()));
    
    // Extract "for example" patterns (your frequent usage)
    const forExamplePatterns = [
      /for example[^.]*\./gi,
      /for instance[^.]*\./gi,
      /such as[^.]*\./gi,
      /e\.g\.[^.]*\./gi
    ];
    
    forExamplePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        examples.push(...matches.map(match => match.trim()));
      }
    });
    
    return [...new Set(examples)].slice(0, 8);
  };

  const extractKeyTerms = (content: string): string[] => {
    // Extract headings and subheadings (lines that start with # or are in ALL CAPS)
    const headings = content.match(/^#+\s*(.+)$/gm) || [];
    const allCapsLines = content.match(/^[A-Z\s]{3,}$/gm) || [];
    
    // Extract terms from headings
    const headingTerms = headings.map(h => h.replace(/^#+\s*/, '').trim());
    
    // Extract ALL CAPS terms
    const capsTerms = allCapsLines.map(line => line.trim());
    
    // Extract capitalized words (potential proper nouns/terms)
    const capitalizedTerms = content.match(/[A-Z][a-z]+(?: [A-Z][a-z]+)*/g) || [];
    
    // Extract bold/italic terms (markdown format)
    const boldTerms = content.match(/\*\*([^*]+)\*\*/g) || [];
    const italicTerms = content.match(/\*([^*]+)\*/g) || [];
    
    // Combine and clean up terms
    const allTerms = [
      ...headingTerms,
      ...capsTerms,
      ...capitalizedTerms.slice(0, 10), // Limit to avoid too many common words
      ...boldTerms.map(t => t.replace(/\*\*/g, '')),
      ...italicTerms.map(t => t.replace(/\*/g, ''))
    ];
    
    // Filter out common words and duplicates
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'shall', 'from', 'they', 'them', 'their', 'there', 'here', 'where', 'when', 'why', 'how', 'what', 'which', 'who', 'chapter', 'section', 'part', 'figure', 'table', 'page']);
    
    return [...new Set(allTerms)]
      .filter(term => term.length > 2 && !commonWords.has(term.toLowerCase()))
      .slice(0, 15);
  };

  const extractExamples = (content: string): string[] => {
    const examples: string[] = [];
    
    // Look for example patterns
    const examplePatterns = [
      /for example[^.]*\./gi,
      /for instance[^.]*\./gi,
      /such as[^.]*\./gi,
      /e\.g\.[^.]*\./gi,
      /example[^.]*\./gi,
      /consider[^.]*\./gi,
      /suppose[^.]*\./gi,
      /imagine[^.]*\./gi
    ];
    
    examplePatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        examples.push(...matches.map(match => match.trim()));
      }
    });
    
    // Look for numbered examples (1., 2., etc.)
    const numberedExamples = content.match(/^\s*\d+\.\s+[^.\n]+\./gm) || [];
    examples.push(...numberedExamples.map(ex => ex.trim()));
    
    // Look for bullet point examples
    const bulletExamples = content.match(/^\s*[-*•]\s+[^.\n]+\./gm) || [];
    examples.push(...bulletExamples.map(ex => ex.trim()));
    
    // Extract sentences that contain "example" or "instance"
    const exampleSentences = content.split(/[.!?]+/)
      .filter(sentence => 
        sentence.toLowerCase().includes('example') || 
        sentence.toLowerCase().includes('instance') ||
        sentence.toLowerCase().includes('such as')
      )
      .map(s => s.trim())
      .filter(s => s.length > 20);
    
    examples.push(...exampleSentences);
    
    return [...new Set(examples)].slice(0, 8);
  };

  const generateQuestionsFromContent = (content: string): string[] => {
    const questions: string[] = [];
    
    // Extract main ideas and concepts
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    
    if (sentences.length > 0) {
      // Look for definition patterns and create definition questions
      const definitionPatterns = [
        /is defined as/gi,
        /refers to/gi,
        /means that/gi,
        /is the/gi,
        /can be described as/gi
      ];
      
      if (definitionPatterns.some(pattern => pattern.test(content))) {
        questions.push('How are the key concepts defined in this document?');
        questions.push('What are the main definitions provided?');
      }
      
      // Look for formula patterns
      if (content.match(/[a-zA-Z]\s*=\s*[a-zA-Z0-9+\-*/()]+/) || content.includes('formula')) {
        questions.push('What formulas are presented and how are they applied?');
        questions.push('How do the mathematical relationships work?');
      }
      
      // Look for process patterns
      if (content.match(/(step|process|procedure|method|technique)/gi)) {
        questions.push('What processes or methods are described?');
        questions.push('What are the main steps involved?');
      }
      
      // Look for comparison patterns
      if (content.match(/(compare|contrast|versus|difference|similar)/gi)) {
        questions.push('What comparisons or contrasts are made?');
        questions.push('What are the key differences and similarities?');
      }
      
      // Look for application patterns
      if (content.match(/(application|use|practice|implement|apply)/gi)) {
        questions.push('What are the practical applications of these concepts?');
        questions.push('How can this knowledge be applied?');
      }
      
      // Look for cause-effect patterns
      if (content.match(/(because|therefore|thus|consequently|leads to|causes)/gi)) {
        questions.push('What cause-and-effect relationships are described?');
        questions.push('What are the consequences or results?');
      }
      
      // Generate questions based on headings
      const headings = content.match(/^#+\s*(.+)$/gm) || [];
      headings.forEach(heading => {
        const cleanHeading = heading.replace(/^#+\s*/, '').trim();
        if (cleanHeading.length > 5) {
          questions.push(`What does "${cleanHeading}" mean and why is it important?`);
        }
      });
      
      // Default comprehensive questions
      questions.push('What are the main ideas presented in this document?');
      questions.push('What are the most important concepts to understand?');
    }
    
    return [...new Set(questions)].slice(0, 6);
  };

  const generateAnnotationsFromContent = (content: string): string[] => {
    const annotations: string[] = [];
    
    if (content.length > 100) {
      // Extract highlighted and bolded items
      const boldItems = content.match(/\*\*([^*]+)\*\*/g) || [];
      const italicItems = content.match(/\*([^*]+)\*/g) || [];
      
      if (boldItems.length > 0) {
        annotations.push(`Important bolded concepts: ${boldItems.slice(0, 3).join(', ')}`);
      }
      
      if (italicItems.length > 0) {
        annotations.push(`Key italicized terms: ${italicItems.slice(0, 3).join(', ')}`);
      }
      
      // Look for important indicators
      const importancePatterns = [
        /important[^.]*\./gi,
        /significant[^.]*\./gi,
        /crucial[^.]*\./gi,
        /essential[^.]*\./gi,
        /key[^.]*\./gi,
        /critical[^.]*\./gi
      ];
      
      importancePatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          annotations.push(...matches.slice(0, 2).map(match => `Note: ${match.trim()}`));
        }
      });
      
      // Look for numerical data
      const numbers = content.match(/\d+[%]?/g) || [];
      if (numbers.length > 0) {
        annotations.push(`Pay attention to numerical data: ${numbers.slice(0, 3).join(', ')}`);
      }
      
      // Look for lists and bullet points
      const lists = content.match(/^\s*[-*•]\s+[^.\n]+/gm) || [];
      if (lists.length > 0) {
        annotations.push(`Important list items: ${lists.slice(0, 2).map(item => item.trim()).join(', ')}`);
      }
      
      // Look for technical terms
      const technicalTerms = content.match(/[a-z]+[A-Z][a-z]+/g) || [];
      if (technicalTerms.length > 0) {
        annotations.push(`Technical terms to understand: ${technicalTerms.slice(0, 3).join(', ')}`);
      }
      
      // Look for formulas or equations
      if (content.match(/[a-zA-Z]\s*=\s*[a-zA-Z0-9+\-*/()]+/)) {
        annotations.push('Note the formulas and mathematical relationships');
      }
      
      // Default annotations
      annotations.push('Focus on understanding the core concepts');
      annotations.push('Look for examples and practical applications');
    }
    
    return [...new Set(annotations)].slice(0, 6);
  };

  const generateSummariesFromContent = (content: string): string[] => {
    const summaries: string[] = [];
    
    if (content.length > 100) {
      // Extract main topics from headings
      const headings = content.match(/^#+\s*(.+)$/gm) || [];
      if (headings.length > 0) {
        summaries.push(`Main topics covered: ${headings.slice(0, 3).map(h => h.replace(/^#+\s*/, '')).join(', ')}`);
      }
      
      // Look for conclusion patterns
      const conclusionPatterns = [
        /in conclusion[^.]*\./gi,
        /to summarize[^.]*\./gi,
        /in summary[^.]*\./gi,
        /overall[^.]*\./gi,
        /in summary[^.]*\./gi
      ];
      
      conclusionPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          summaries.push(...matches.slice(0, 2).map(match => match.trim()));
        }
      });
      
      // Extract first few sentences as main topic
      const firstSentences = content.split(/[.!?]+/).slice(0, 3);
      if (firstSentences.length > 0) {
        summaries.push(`Main topic: ${firstSentences[0].trim()}`);
      }
      
      // Look for importance indicators
      const importanceSentences = content.split(/[.!?]+/)
        .filter(sentence => 
          sentence.toLowerCase().includes('important') || 
          sentence.toLowerCase().includes('significant') ||
          sentence.toLowerCase().includes('crucial') ||
          sentence.toLowerCase().includes('key')
        )
        .slice(0, 2)
        .map(s => s.trim());
      
      summaries.push(...importanceSentences);
      
      // Look for application patterns
      const applicationSentences = content.split(/[.!?]+/)
        .filter(sentence => 
          sentence.toLowerCase().includes('application') || 
          sentence.toLowerCase().includes('use') ||
          sentence.toLowerCase().includes('practice')
        )
        .slice(0, 1)
        .map(s => s.trim());
      
      summaries.push(...applicationSentences);
      
      // Default comprehensive summary
      summaries.push('This document covers important concepts and information');
      summaries.push('Review all sections for complete understanding');
    }
    
    return [...new Set(summaries)].slice(0, 6);
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    setSelectedDocuments(prev => prev.filter(id => id !== documentId));
  };

  const handleLibraryComplete = (selectedFileIds: string[]) => {
    setSelectedDocuments(selectedFileIds);
    const selectedDocs = documents.filter(doc => selectedFileIds.includes(doc.id));
    handleGenerateStudyGuide(selectedDocs);
  };

  const handleGenerateStudyGuide = async (docsToProcess?: ProcessedDocument[]) => {
    const docs = docsToProcess || documents;
    setCurrentPhase('generating');
    
    try {
      // Process uploaded documents to generate study guide
      await generateStudyGuideFromDocuments(docs);
      setCurrentPhase('sample');
    } catch (error) {
      console.error('Error generating study guide:', error);
      // Fallback to mock data if there's an error
      const mockSampleGuide = [
        {
          id: '1',
          title: 'Generated from Uploaded Documents',
          content: 'This study guide was generated from your uploaded documents. The content below represents the key concepts and information extracted from your files.',
          keywords: ['document analysis', 'content extraction', 'study guide'],
          examples: ['Content from your uploaded files'],
          questions: ['What are the main topics in your documents?'],
          annotations: ['This content is based on your uploaded documents'],
          summaries: ['Key information extracted from your files']
        }
      ];
      setSampleStudyGuide(mockSampleGuide);
      setCurrentPhase('sample');
    }
  };

  // Export functionality
  const handleExportToPDF = () => {
    const content = customizedStudyGuide.map(section => 
      `${section.title}\n\n${section.content}\n\nKey Terms: ${section.keywords?.join(', ') || 'None'}\n\nExamples:\n${section.examples?.map(ex => `• ${ex}`).join('\n') || 'None'}\n\nQuestions:\n${section.questions?.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}\n\nAnnotations:\n${section.annotations?.map(ann => `• ${ann}`).join('\n') || 'None'}\n\n${'='.repeat(50)}\n\n`
    ).join('');
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'study-guide.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportToWord = () => {
    const content = customizedStudyGuide.map(section => 
      `${section.title}\n\n${section.content}\n\nKey Terms: ${section.keywords?.join(', ') || 'None'}\n\nExamples:\n${section.examples?.map(ex => `• ${ex}`).join('\n') || 'None'}\n\nQuestions:\n${section.questions?.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}\n\nAnnotations:\n${section.annotations?.map(ann => `• ${ann}`).join('\n') || 'None'}\n\n${'='.repeat(50)}\n\n`
    ).join('');
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    element.href = URL.createObjectURL(file);
    element.download = 'study-guide.docx';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrintPreview = () => {
    const printContent = customizedStudyGuide.map(section => 
      `${section.title}\n\n${section.content}\n\nKey Terms: ${section.keywords?.join(', ') || 'None'}\n\nExamples:\n${section.examples?.map(ex => `• ${ex}`).join('\n') || 'None'}\n\nQuestions:\n${section.questions?.map((q, i) => `${i + 1}. ${q}`).join('\n') || 'None'}\n\nAnnotations:\n${section.annotations?.map(ann => `• ${ann}`).join('\n') || 'None'}\n\n${'='.repeat(50)}\n\n`
    ).join('');
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Study Guide - Print Preview</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              h1, h2, h3 { color: #333; }
              .section { margin-bottom: 30px; page-break-inside: avoid; }
            </style>
          </head>
          <body>
            <h1>AI-Generated Study Guide</h1>
            <pre style="white-space: pre-wrap;">${printContent}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (showDemo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto p-8">
          <div className="text-8xl mb-8">🧙‍♂️</div>
          <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-6">
            Enhanced Document Processing Demo
          </h1>
          <p className="text-purple-200 text-xl mb-8 leading-relaxed">
            The enhanced document processing system is ready! This demo showcases:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <div className="text-4xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-purple-200 mb-2">Smart Upload</h3>
              <p className="text-purple-300/70 text-sm">
                Drag & drop PDF, Word, Text, and Image files with real-time processing
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-blue-200 mb-2">AI Analysis</h3>
              <p className="text-blue-300/70 text-sm">
                Extract key concepts, vocabulary, and important sections automatically
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-green-200 mb-2">Enhanced Guides</h3>
              <p className="text-green-300/70 text-sm">
                Generate comprehensive study guides with annotations and content
              </p>
            </div>
          </div>

          <div className="space-y-4">
          <button
              onClick={() => setShowDemo(false)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          >
              🚀 Back to Main App
          </button>
            
            <div className="text-purple-300/70 text-sm">
              <p>✅ Real PDF processing with PDF.js</p>
              <p>✅ Word document processing with Mammoth.js</p>
              <p>✅ Image OCR with Tesseract.js</p>
              <p>✅ AI-powered content analysis and enhancement</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showLaunchScreen) {
    return <LaunchScreen onComplete={handleStartJourney} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-2xl">🧙‍♂️</div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
              Arcano Desk
            </h1>
          </div>
          
          {/* AI Status Indicator */}
          <div className="flex items-center gap-4">
            <AIStatusIndicator showDetails={false} />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-purple-500/10 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Progress Indicator */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2">
              {(['upload', 'library', 'sample', 'customize', 'export'] as const).map((phase, index) => (
                <div key={phase} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentPhase === phase
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : index < (['upload', 'library', 'sample', 'customize', 'export'] as const).indexOf(currentPhase as any)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 4 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      index < (['upload', 'library', 'sample', 'customize', 'export'] as const).indexOf(currentPhase as any)
                        ? 'bg-green-600'
                        : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Phase Buttons */}
          <div className="flex justify-center gap-2 flex-wrap">
            {(['upload', 'library', 'sample', 'customize', 'export'] as const).map((phase) => (
            <button
              key={phase}
              onClick={() => handlePhaseChange(phase)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 text-sm ${
                currentPhase === phase
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white hover:bg-purple-500/30'
              }`}
            >
                {phase === 'upload' && '📁 Upload'}
                {phase === 'library' && '📚 Library'}
                {phase === 'sample' && '🔍 Sample'}
                {phase === 'customize' && '⚙️ Customize'}
                {phase === 'export' && '📤 Export'}
            </button>
          ))}
        </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        {/* AI Analysis Progress */}
        {currentPhase === 'generating' && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20">
              <div className="text-center">
                <div className="text-6xl mb-4">🧙‍♂️</div>
                <h3 className="text-2xl font-bold text-purple-200 mb-4">
                  AI is Analyzing Your Documents
                </h3>
                <p className="text-purple-300/70 mb-6">
                  Our AI wizard is reading through your documents, identifying key concepts, extracting examples, and creating meaningful study content...
                </p>
                
                 {isAnalyzing && (
                   <div className="space-y-4">
                     <div className="w-full bg-purple-900/30 rounded-full h-2">
                       <div
                         className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                         style={{ width: `${aiAnalysis?.progress || 0}%` }}
                       ></div>
                     </div>
                     <div className="text-purple-300/60 text-sm space-y-1">
                       <p>⚡ Supercharged Analysis in Progress...</p>
                       <p>• Extracting key terms from formatting patterns</p>
                       <p>• Finding code snippets, case studies, and analogies</p>
                       <p>• Generating optimized study content with AI</p>
                       <p>• Caching results for instant future access</p>
                     </div>
          </div>
        )}

                {analysisError && (
                  <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 mt-4">
                    <p className="text-red-200 text-sm">{analysisError}</p>
                    <button
                      onClick={() => {
                        setAnalysisError(null);
                        handleGenerateStudyGuide();
                      }}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors text-sm"
                    >
                      Try Again
                    </button>
          </div>
        )}

                <div className="flex justify-center mt-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Phase */}
        {currentPhase === 'upload' && (
          <div className="max-w-4xl mx-auto">
            <SimpleDocumentUpload
              onFileSelect={async (file) => {
                console.log('File selected:', file.name);
                try {
                  // Process the file using DocumentProcessor
                  const processedDoc = await DocumentProcessor.processFile(file);
                  setDocuments(prev => [...prev, processedDoc]);
                  setUploadComplete(true);
                  setCurrentPhase('library');
                } catch (error) {
                  console.error('Error processing file:', error);
                  // Show error message to user
                  alert(`Error processing file: ${file.name}. Please try again.`);
                }
              }}
            />
            
            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => handlePhaseChange('library')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300"
              >
                📚 View Library
              </button>
            </div>
          </div>
        )}

        {/* Library Phase */}
        {currentPhase === 'library' && (
          <div className="max-w-6xl mx-auto">
            <LibraryPhase
              onComplete={handleLibraryComplete}
              documents={documents}
              onDeleteDocument={handleDeleteDocument}
            />
            
            {/* Navigation */}
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={() => handlePhaseChange('upload')}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                📁 Upload More Documents
              </button>
            </div>
          </div>
        )}

        {/* Sample Phase */}
        {currentPhase === 'sample' && sampleStudyGuide.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                  Sample Study Guide
              </h2>
                <p className="text-purple-200 text-lg mb-6">
                  Review the AI-generated sample below. You can approve it to proceed to customization, or go back to make changes.
                </p>
                
                {/* AI Connection Status */}
                <div className="mb-6">
                  <AIStatusIndicator showDetails={true} className="w-full" />
                  
                  {/* Content Generation Status */}
                  <div className="mt-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4">
                    <h4 className="text-lg font-semibold text-blue-300 mb-3 flex items-center">
                      <span className="text-xl mr-2">🤖</span>
                      Content Generation Status
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          sampleStudyGuide.some(s => s.questions?.length > 0) ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        <div className="text-blue-200">Questions</div>
                        <div className="text-blue-300/60 text-xs">
                          {sampleStudyGuide.reduce((acc, s) => acc + (s.questions?.length || 0), 0)} total
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          sampleStudyGuide.some(s => s.studyNotes?.length > 0) ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        <div className="text-blue-200">Study Notes</div>
                        <div className="text-blue-300/60 text-xs">
                          {sampleStudyGuide.reduce((acc, s) => acc + (s.studyNotes?.length || 0), 0)} total
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          sampleStudyGuide.some(s => s.summaries?.length > 0) ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        <div className="text-blue-200">Key Takeaways</div>
                        <div className="text-blue-300/60 text-xs">
                          {sampleStudyGuide.reduce((acc, s) => acc + (s.summaries?.length || 0), 0)} total
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          sampleStudyGuide.some(s => s.annotations?.length > 0) ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        <div className="text-blue-200">Annotations</div>
                        <div className="text-blue-300/60 text-xs">
                          {sampleStudyGuide.reduce((acc, s) => acc + (s.annotations?.length || 0), 0)} total
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
                          sampleStudyGuide.some(s => s.examples?.length > 0) ? 'bg-green-400' : 'bg-yellow-400'
                        }`}></div>
                        <div className="text-blue-200">Examples</div>
                        <div className="text-blue-300/60 text-xs">
                          {sampleStudyGuide.reduce((acc, s) => acc + (s.examples?.length || 0), 0)} total
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-blue-300/80">
                      {isConnected ? 
                        '✅ AI-powered content generation active' : 
                        '⚠️ Using fallback content - connect AI for enhanced generation'
                      }
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <p className="text-blue-200 text-sm">
                    💡 <strong>Tip:</strong> This is a preview of how your study guide will look. You can customize the content, add focus areas, and adjust the detail level in the next step.
              </p>
            </div>
            
                {/* Teacher Annotations Button */}
                {aiAnalysis?.markedDocument && (
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={() => setShowMarkedDocument(true)}
                      className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-lg hover:from-amber-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-amber-500/30 flex items-center gap-2"
                    >
                      <span className="text-xl">👨‍🏫</span>
                      View Teacher Annotations
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                {sampleStudyGuide.map((section, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-2xl font-semibold text-purple-200 mb-4 flex items-center">
                      <span className="text-3xl mr-3">📚</span>
                      {section.title}
                    </h3>
                    
                    <div className="mb-6">
                      <p className="text-purple-300/80 leading-relaxed">{section.content}</p>
                    </div>
                    
                    {section.keywords && section.keywords.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">🏷️</span>
                          Key Terms (extracted from headings, bold text, and important concepts)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {section.keywords.map((keyword: string, keyIdx: number) => (
                            <span key={keyIdx} className="px-3 py-1 bg-purple-600/30 text-purple-200 text-sm rounded-full border border-purple-500/30 hover:bg-purple-600/40 transition-colors">
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <p className="text-purple-300/60 text-xs mt-2">
                          Found {section.keywords.length} key terms from document structure and formatting
                </p>
              </div>
                    )}
                    
                    {section.examples && section.examples.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">💡</span>
                          Examples (actual sentences from your document)
                        </h4>
                        <ul className="list-disc list-inside text-purple-300/80 space-y-2">
                          {section.examples.map((example: string, exIdx: number) => (
                            <li key={exIdx} className="bg-purple-900/20 p-3 rounded-lg border-l-4 border-purple-500/50">
                              {example}
                            </li>
                          ))}
                        </ul>
                        <p className="text-purple-300/60 text-xs mt-2">
                          Found {section.examples.length} examples from "for example", numbered lists, and bullet points
                </p>
              </div>
                    )}
                    
                    {section.questions && section.questions.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">❓</span>
                          Study Questions (derived from main ideas)
                        </h4>
                        <ul className="list-disc list-inside text-purple-300/80 space-y-2">
                          {section.questions.map((question: string, qIdx: number) => (
                            <li key={qIdx} className="bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-500/50">
                              {question}
                            </li>
                          ))}
                        </ul>
                        <p className="text-purple-300/60 text-xs mt-2">
                          Generated from definitions, formulas, processes, and main concepts
                </p>
              </div>
                    )}
                    
                    {section.annotations && section.annotations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">📝</span>
                          Study Notes (quick, digestible facts from your document)
                        </h4>
                        <ul className="list-disc list-inside text-purple-300/80 space-y-2">
                          {section.annotations.map((annotation: string, aIdx: number) => (
                            <li key={aIdx} className="bg-green-900/20 p-3 rounded-lg border-l-4 border-green-500/50">
                              {annotation}
                            </li>
                          ))}
                        </ul>
                        <p className="text-purple-300/60 text-xs mt-2">
                          AI-generated study notes based on your document content
                        </p>
            </div>
                    )}
                    
                    {section.studyNotes && section.studyNotes.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">📖</span>
                          Study Notes (quick, digestible facts)
                        </h4>
                        <ul className="list-disc list-inside text-purple-300/80 space-y-2">
                          {section.studyNotes.map((note: string, nIdx: number) => (
                            <li key={nIdx} className="bg-cyan-900/20 p-3 rounded-lg border-l-4 border-cyan-500/50">
                              {note}
                            </li>
                          ))}
                        </ul>
                        <p className="text-purple-300/60 text-xs mt-2">
                          Quick, easily digestible facts from your document
                        </p>
          </div>
        )}

                    {section.summaries && section.summaries.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">📋</span>
                          Key Takeaways (detailed synopsis of your document)
                        </h4>
                        <ul className="list-disc list-inside text-purple-300/80 space-y-2">
                          {section.summaries.map((summary: string, sIdx: number) => (
                            <li key={sIdx} className="bg-orange-900/20 p-3 rounded-lg border-l-4 border-orange-500/50">
                              {summary}
                            </li>
                          ))}
                        </ul>
                        <p className="text-purple-300/60 text-xs mt-2">
                          AI-generated comprehensive summary of your document's main points
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sample Phase Actions */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => handlePhaseChange('library')}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
              >
                ← Back to Library
              </button>
              
              {aiAnalysis?.markedDocument && (
                <button
                  onClick={() => setShowMarkedDocument(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
                >
                  🔍 View AI-Marked Document
                </button>
              )}
              
              <button
                onClick={() => {
                  setIsSampleApproved(true);
                  setCurrentPhase('customize');
                }}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
              >
                ✅ Approve & Customize
              </button>
            </div>
          </div>
        )}

        {/* Customization Phase */}
        {currentPhase === 'customize' && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">⚙️</div>
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                  Customize Your Study Guide
            </h2>
                <p className="text-purple-200 text-lg mb-6">
                  Fine-tune your study guide to match your learning preferences and focus areas.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Customization Options */}
                <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-2xl font-semibold text-purple-200 mb-6">Content Options</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customizationOptions.includeExamples}
                        onChange={(e) => setCustomizationOptions(prev => ({ ...prev, includeExamples: e.target.checked }))}
                        className="w-5 h-5 text-purple-600 bg-purple-100 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-purple-200">Include Examples</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customizationOptions.includeQuestions}
                        onChange={(e) => setCustomizationOptions(prev => ({ ...prev, includeQuestions: e.target.checked }))}
                        className="w-5 h-5 text-purple-600 bg-purple-100 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-purple-200">Include Study Questions</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customizationOptions.includeAnnotations}
                        onChange={(e) => setCustomizationOptions(prev => ({ ...prev, includeAnnotations: e.target.checked }))}
                        className="w-5 h-5 text-purple-600 bg-purple-100 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-purple-200">Include Study Notes</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customizationOptions.includeSummaries}
                        onChange={(e) => setCustomizationOptions(prev => ({ ...prev, includeSummaries: e.target.checked }))}
                        className="w-5 h-5 text-purple-600 bg-purple-100 border-purple-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-purple-200">Include Key Takeaways</span>
                    </label>
                </div>
                  
                  <div className="mt-6">
                    <label className="block text-purple-200 font-semibold mb-3">Detail Level</label>
                    <select
                      value={customizationOptions.detailLevel}
                      onChange={(e) => setCustomizationOptions(prev => ({ ...prev, detailLevel: e.target.value as 'basic' | 'comprehensive' | 'detailed' }))}
                      className="w-full p-3 bg-purple-800/50 border border-purple-500/30 rounded-lg text-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="basic">Basic - Key concepts only</option>
                      <option value="comprehensive">Comprehensive - Balanced detail</option>
                      <option value="detailed">Detailed - In-depth coverage</option>
                    </select>
                  </div>
                </div>
                
                {/* Preview */}
                <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                  <h3 className="text-2xl font-semibold text-blue-200 mb-6">Preview</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-900/30 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-blue-200 mb-2">Content Structure</h4>
                      <ul className="text-blue-300/80 space-y-1 text-sm">
                        <li>• Main content sections</li>
                        <li>• Key terms and definitions</li>
                        {customizationOptions.includeExamples && <li>• Practical examples</li>}
                        {customizationOptions.includeQuestions && <li>• Study questions</li>}
                        {customizationOptions.includeAnnotations && <li>• Study notes and tips</li>}
                        {customizationOptions.includeSummaries && <li>• Key takeaways</li>}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-900/30 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-blue-200 mb-2">Detail Level</h4>
                      <p className="text-blue-300/80 text-sm">
                        {customizationOptions.detailLevel === 'basic' && 'Concise explanations focusing on core concepts'}
                        {customizationOptions.detailLevel === 'comprehensive' && 'Balanced coverage with examples and context'}
                        {customizationOptions.detailLevel === 'detailed' && 'In-depth analysis with extensive examples and explanations'}
                      </p>
                      </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Customization Actions */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => handlePhaseChange('sample')}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
              >
                ← Back to Sample
              </button>
                      <button
                        onClick={() => {
                  // Apply customization and generate final study guide
                  const customized = sampleStudyGuide.map(section => ({
                    ...section,
                    examples: customizationOptions.includeExamples ? section.examples : [],
                    questions: customizationOptions.includeQuestions ? section.questions : [],
                    annotations: customizationOptions.includeAnnotations ? section.annotations : [],
                    summaries: customizationOptions.includeSummaries ? section.summaries : []
                  }));
                  setCustomizedStudyGuide(customized);
                  setCurrentPhase('export');
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
              >
                ✨ Generate Final Guide
                      </button>
                    </div>
          </div>
        )}

        {/* Export Phase */}
        {currentPhase === 'export' && customizedStudyGuide.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">📤</div>
                <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
                  Your Custom Study Guide
                </h2>
                <p className="text-purple-200 text-lg mb-6">
                  Your personalized study guide is ready! Choose how you'd like to export it.
                </p>
              </div>
              
              {/* Export Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20 text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="text-4xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold text-green-200 mb-2">PDF Export</h3>
                  <p className="text-green-300/70 text-sm mb-4">Download as a formatted PDF document</p>
                  <button 
                    onClick={handleExportToPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors"
                  >
                    Download PDF
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-blue-800/30 to-cyan-800/30 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="text-4xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-blue-200 mb-2">Word Document</h3>
                  <p className="text-blue-300/70 text-sm mb-4">Export as an editable Word document</p>
                  <button 
                    onClick={handleExportToWord}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    Download DOCX
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 text-center hover:scale-105 transition-transform duration-300 cursor-pointer">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-purple-200 mb-2">Print View</h3>
                  <p className="text-purple-300/70 text-sm mb-4">View formatted for printing</p>
                  <button 
                    onClick={handlePrintPreview}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                  >
                    Print Preview
                  </button>
                </div>
              </div>
              
              {/* Final Study Guide Display */}
              <div className="space-y-6">
                {customizedStudyGuide.map((section, idx) => (
                  <div key={idx} className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                    <h3 className="text-2xl font-semibold text-purple-200 mb-4 flex items-center">
                      <span className="text-3xl mr-3">📚</span>
                      {section.title}
                    </h3>
                    
                    <div className="mb-6">
                      <p className="text-purple-300/80 leading-relaxed">{section.content}</p>
                    </div>
                    
                    {section.keywords && section.keywords.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">🏷️</span>
                          Key Terms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {section.keywords.map((keyword: string, keyIdx: number) => (
                            <span key={keyIdx} className="px-3 py-1 bg-purple-600/30 text-purple-200 text-sm rounded-full border border-purple-500/30">
                              {keyword}
                            </span>
                          ))}
                        </div>
                </div>
              )}
                    
                    {customizationOptions.includeExamples && section.examples && section.examples.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">💡</span>
                          Examples
                        </h4>
                        <ul className="list-disc list-inside text-purple-300/80 space-y-1">
                          {section.examples.map((example: string, exIdx: number) => (
                            <li key={exIdx}>{example}</li>
                          ))}
                        </ul>
            </div>
                    )}
                    
                    {customizationOptions.includeQuestions && section.questions && section.questions.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">❓</span>
                          Study Questions
                        </h4>
                        <ul className="list-disc list-inside text-purple-300/80 space-y-1">
                          {section.questions.map((question: string, qIdx: number) => (
                            <li key={qIdx}>{question}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {customizationOptions.includeAnnotations && section.annotations && section.annotations.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">📝</span>
                          Study Notes
                        </h4>
                        <ul className="list-disc list-inside text-purple-300/80 space-y-1">
                          {section.annotations.map((annotation: string, aIdx: number) => (
                            <li key={aIdx}>{annotation}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {customizationOptions.includeSummaries && section.summaries && section.summaries.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-purple-300 mb-3 flex items-center">
                          <span className="text-xl mr-2">📋</span>
                          Key Takeaways
                        </h4>
                        <ul className="list-disc list-inside text-purple-300/80 space-y-1">
                          {section.summaries.map((summary: string, sIdx: number) => (
                            <li key={sIdx}>{summary}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Export Actions */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => handlePhaseChange('customize')}
                className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300"
              >
                ← Back to Customize
              </button>
              <button
                onClick={() => {
                  setCurrentPhase('welcome');
                  setShowLaunchScreen(true);
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
              >
                🏠 Start New Guide
              </button>
            </div>
          </div>
        )}

        {/* Legacy Summary Phase - keeping for backward compatibility */}
        {currentPhase === 'sample' && showStudyGuide && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-purple-200 mb-6">Generated Study Guide</h2>
              
              {generatedStudyGuide.map((section, idx) => (
                <div key={idx} className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20 mb-6">
                  <h3 className="text-2xl font-semibold text-purple-200 mb-4">{section.title}</h3>
                  <p className="text-purple-300/70 mb-4">{section.content}</p>
                  
                  {section.keywords && section.keywords.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-purple-300 mb-2">Keywords:</h4>
                      <div className="flex flex-wrap gap-2">
                        {section.keywords.map((keyword: string, keyIdx: number) => (
                          <span key={keyIdx} className="px-3 py-1 bg-purple-600/30 text-purple-200 text-sm rounded">
                            {keyword}
                          </span>
                        ))}
                </div>
                </div>
                  )}
                  
                  {section.examples && section.examples.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-purple-300 mb-2">Examples:</h4>
                      <ul className="list-disc list-inside text-purple-300/70">
                        {section.examples.map((example: string, exIdx: number) => (
                          <li key={exIdx}>{example}</li>
                        ))}
                      </ul>
              </div>
                  )}
                  
                  {section.questions && section.questions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-purple-300 mb-2">Questions:</h4>
                      <ul className="list-disc list-inside text-purple-300/70">
                        {section.questions.map((question: string, qIdx: number) => (
                          <li key={qIdx}>{question}</li>
                        ))}
                      </ul>
                </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Navigation */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => handlePhaseChange('library')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-cyan-500 transition-all duration-300"
              >
                📚 Back to Library
              </button>
              <button
                onClick={() => setShowLaunchScreen(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all duration-300"
              >
                🏠 Home
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Marked Document Viewer Modal */}
      {showMarkedDocument && aiAnalysis?.markedDocument && (
        <MarkedDocumentViewer
          markedDocument={aiAnalysis.markedDocument}
          onClose={() => setShowMarkedDocument(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
        <RobustOllamaProvider>
          <AppContent />
        </RobustOllamaProvider>
  );
}

export default App;