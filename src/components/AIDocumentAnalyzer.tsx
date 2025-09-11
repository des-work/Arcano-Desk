import React, { useState, useCallback } from 'react';
import { useRobustOllama } from '../contexts/RobustOllamaContext.tsx';
import { ProcessedDocument } from '../utils/DocumentProcessor.ts';

interface AIDocumentAnalyzerProps {
  documents: ProcessedDocument[];
  onAnalysisComplete: (analysis: DocumentAnalysis) => void;
  onError: (error: string) => void;
}

interface DocumentAnalysis {
  keyTerms: string[];
  examples: string[];
  questions: string[];
  annotations: string[];
  summaries: string[];
  structure: {
    headers: string[];
    subheaders: string[];
    definitions: string[];
    explanations: string[];
    formulas: string[];
    processes: string[];
  };
  importance: {
    mostImportant: string[];
    moderateImportant: string[];
    leastImportant: string[];
  };
  markedDocument: string; // Original document with AI-identified parts marked
}

export const AIDocumentAnalyzer: React.FC<AIDocumentAnalyzerProps> = ({
  documents,
  onAnalysisComplete,
  onError
}) => {
  const { generateSummary, generateStudyMaterial, askQuestion, isConnected, isLoading } = useRobustOllama;
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');

  const analyzeDocument = useCallback(async (doc: ProcessedDocument): Promise<Partial<DocumentAnalysis>> => {
    try {
      setCurrentStep(`Analyzing ${doc.name}...`);
      
      // Step 1: Analyze document structure
      const structurePrompt = `Analyze the structure of this document and identify:
1. Main headers (titles, chapter names, major sections)
2. Subheaders (subsection titles, minor headings)
3. Definitions (terms that are defined or explained)
4. Explanations (detailed explanations of concepts)
5. Formulas (mathematical expressions, equations)
6. Processes (step-by-step procedures, methods)

Document content:
${doc.content}

Please provide a structured response in this format:
HEADERS: [list of main headers]
SUBHEADERS: [list of subheaders]
DEFINITIONS: [list of defined terms with their definitions]
EXPLANATIONS: [list of key explanations]
FORMULAS: [list of formulas and equations]
PROCESSES: [list of processes and procedures]`;

      const structureResponse = await askQuestion(structurePrompt, doc.content);
      
      // Step 2: Extract key terms using AI
      const keyTermsPrompt = `Extract the most important key terms from this document. Focus on:
- Technical terms
- Concepts that are central to the topic
- Terms that appear frequently
- Terms that are defined or explained

Document content:
${doc.content}

Provide a list of 10-15 key terms, one per line.`;

      const keyTermsResponse = await generateStudyMaterial(doc.content, 'notes');
      
      // Step 3: Generate examples using AI
      const examplesPrompt = `Find and extract practical examples from this document. Look for:
- "For example" statements
- Case studies
- Illustrative scenarios
- Real-world applications
- Sample problems or solutions

Document content:
${doc.content}

Provide 5-8 examples, one per line.`;

      const examplesResponse = await generateStudyMaterial(doc.content, 'examples');
      
      // Step 4: Generate study questions using AI
      const questionsPrompt = `Generate thoughtful study questions based on this document. Create questions that:
- Test understanding of key concepts
- Require analysis and synthesis
- Cover different levels of complexity
- Focus on practical applications

Document content:
${doc.content}

Provide 6-8 questions, one per line.`;

      const questionsResponse = await generateStudyMaterial(doc.content, 'questions');
      
      // Step 5: Generate annotations using AI
      const annotationsPrompt = `Create study annotations for this document. Focus on:
- Important concepts to highlight
- Key insights and connections
- Study tips and strategies
- Areas that need special attention

Document content:
${doc.content}

Provide 5-7 annotations, one per line.`;

      const annotationsResponse = await generateStudyMaterial(doc.content, 'notes');
      
      // Step 6: Generate summaries using AI
      const summariesPrompt = `Create comprehensive summaries of the most important topics in this document. Focus on:
- Main themes and concepts
- Key takeaways
- Critical information
- Overall understanding

Document content:
${doc.content}

Provide 4-6 summary points, one per line.`;

      const summariesResponse = await generateSummary(doc.content, 'long');
      
      // Step 7: Determine importance levels using AI
      const importancePrompt = `Analyze the importance of different concepts in this document. Categorize them as:
- Most Important: Core concepts that are essential to understand
- Moderately Important: Important supporting concepts
- Least Important: Background information or supplementary details

Document content:
${doc.content}

Provide your analysis in this format:
MOST IMPORTANT: [list of most important concepts]
MODERATELY IMPORTANT: [list of moderately important concepts]
LEAST IMPORTANT: [list of least important concepts]`;

      const importanceResponse = await askQuestion(importancePrompt, doc.content);
      
      // Step 8: Mark the original document with identified parts
      const markingPrompt = `Mark the original document to highlight different types of content. Add markers like:
- [HEADER] for main headers
- [SUBHEADER] for subheaders
- [DEFINITION] for definitions
- [EXPLANATION] for explanations
- [FORMULA] for formulas
- [PROCESS] for processes
- [IMPORTANT] for most important concepts
- [EXAMPLE] for examples

Original document:
${doc.content}

Return the marked document with these annotations.`;

      const markedDocumentResponse = await askQuestion(markingPrompt, doc.content);
      
      // Parse responses and extract structured data
      const parseList = (text: string, prefix: string): string[] => {
        const lines = text.split('\n');
        const relevantLines = lines.filter(line => 
          line.trim().toLowerCase().includes(prefix.toLowerCase()) || 
          (line.trim().length > 0 && !line.includes(':') && !line.includes('HEADERS') && !line.includes('SUBHEADERS'))
        );
        return relevantLines.map(line => line.replace(/^[-•*]\s*/, '').trim()).filter(line => line.length > 0);
      };

      const parseStructure = (text: string) => {
        const lines = text.split('\n');
        return {
          headers: parseList(text, 'HEADERS'),
          subheaders: parseList(text, 'SUBHEADERS'),
          definitions: parseList(text, 'DEFINITIONS'),
          explanations: parseList(text, 'EXPLANATIONS'),
          formulas: parseList(text, 'FORMULAS'),
          processes: parseList(text, 'PROCESSES')
        };
      };

      const parseImportance = (text: string) => {
        return {
          mostImportant: parseList(text, 'MOST IMPORTANT'),
          moderateImportant: parseList(text, 'MODERATELY IMPORTANT'),
          leastImportant: parseList(text, 'LEAST IMPORTANT')
        };
      };

      return {
        keyTerms: parseList(keyTermsResponse, 'key terms'),
        examples: parseList(examplesResponse, 'example'),
        questions: parseList(questionsResponse, 'question'),
        annotations: parseList(annotationsResponse, 'annotation'),
        summaries: parseList(summariesResponse, 'summary'),
        structure: parseStructure(structureResponse),
        importance: parseImportance(importanceResponse),
        markedDocument: markedDocumentResponse
      };
      
    } catch (error) {
      console.error('Error analyzing document:', error);
      throw error;
    }
  }, [generateSummary, generateStudyMaterial, askQuestion]);

  const analyzeAllDocuments = useCallback(async () => {
    if (!isConnected) {
      onError('AI is not connected. Please check your Ollama connection.');
      return;
    }

    try {
      setAnalysisProgress(0);
      const totalSteps = documents.length * 8; // 8 steps per document
      let currentStep = 0;

      const analysisResults: Partial<DocumentAnalysis>[] = [];

      for (const doc of documents) {
        setCurrentStep(`Analyzing ${doc.name}...`);
        const docAnalysis = await analyzeDocument(doc);
        analysisResults.push(docAnalysis);
        
        currentStep += 8;
        setAnalysisProgress((currentStep / totalSteps) * 100);
      }

      // Combine all document analyses
      const combinedAnalysis: DocumentAnalysis = {
        keyTerms: [...new Set(analysisResults.flatMap(r => r.keyTerms || []))],
        examples: [...new Set(analysisResults.flatMap(r => r.examples || []))],
        questions: [...new Set(analysisResults.flatMap(r => r.questions || []))],
        annotations: [...new Set(analysisResults.flatMap(r => r.annotations || []))],
        summaries: [...new Set(analysisResults.flatMap(r => r.summaries || []))],
        structure: {
          headers: [...new Set(analysisResults.flatMap(r => r.structure?.headers || []))],
          subheaders: [...new Set(analysisResults.flatMap(r => r.structure?.subheaders || []))],
          definitions: [...new Set(analysisResults.flatMap(r => r.structure?.definitions || []))],
          explanations: [...new Set(analysisResults.flatMap(r => r.structure?.explanations || []))],
          formulas: [...new Set(analysisResults.flatMap(r => r.structure?.formulas || []))],
          processes: [...new Set(analysisResults.flatMap(r => r.structure?.processes || []))]
        },
        importance: {
          mostImportant: [...new Set(analysisResults.flatMap(r => r.importance?.mostImportant || []))],
          moderateImportant: [...new Set(analysisResults.flatMap(r => r.importance?.moderateImportant || []))],
          leastImportant: [...new Set(analysisResults.flatMap(r => r.importance?.leastImportant || []))]
        },
        markedDocument: analysisResults.map(r => r.markedDocument).join('\n\n---\n\n')
      };

      setAnalysisProgress(100);
      setCurrentStep('Analysis complete!');
      onAnalysisComplete(combinedAnalysis);
      
    } catch (error) {
      console.error('Error in document analysis:', error);
      onError('Failed to analyze documents. Please try again.');
    }
  }, [documents, analyzeDocument, isConnected, onAnalysisComplete, onError]);

  return {
    analyzeAllDocuments,
    analysisProgress,
    currentStep,
    isLoading
  };
};

export default AIDocumentAnalyzer;
