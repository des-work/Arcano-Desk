import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

export interface ProcessedFile {
  content: string;
  type: 'pdf' | 'docx' | 'pptx' | 'txt';
  name: string;
}

export const processFile = async (file: File): Promise<ProcessedFile> => {
  const fileType = file.name.split('.').pop()?.toLowerCase() as 'pdf' | 'docx' | 'pptx' | 'txt';
  
  switch (fileType) {
    case 'txt':
      return processTextFile(file);
    case 'pdf':
      return processPdfFile(file);
    case 'docx':
      return processDocxFile(file);
    case 'pptx':
      return processPptxFile(file);
    default:
      throw new Error('Unsupported file type');
  }
};

const processTextFile = async (file: File): Promise<ProcessedFile> => {
  const content = await file.text();
  return {
    content,
    type: 'txt',
    name: file.name,
  };
};

const processPdfFile = async (file: File): Promise<ProcessedFile> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfData = await pdfParse(Buffer.from(arrayBuffer));
  
  // If PDF has no text content, try OCR
  if (!pdfData.text || pdfData.text.trim().length === 0) {
    console.log('PDF appears to be scanned, attempting OCR...');
    const ocrResult = await performOCR(file);
    return {
      content: ocrResult,
      type: 'pdf',
      name: file.name,
    };
  }
  
  return {
    content: pdfData.text,
    type: 'pdf',
    name: file.name,
  };
};

const processDocxFile = async (file: File): Promise<ProcessedFile> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  
  return {
    content: result.value,
    type: 'docx',
    name: file.name,
  };
};

const processPptxFile = async (file: File): Promise<ProcessedFile> => {
  // For now, we'll treat PPTX as a binary file and suggest manual text extraction
  // In a full implementation, you'd use a library like pptx2json or similar
  return {
    content: 'PowerPoint file detected. Please copy and paste the text content manually, or convert to PDF for better processing.',
    type: 'pptx',
    name: file.name,
  };
};

const performOCR = async (file: File): Promise<string> => {
  try {
    const { data: { text } } = await Tesseract.recognize(file, 'eng', {
      logger: m => console.log(m)
    });
    return text;
  } catch (error) {
    console.error('OCR failed:', error);
    return 'OCR processing failed. Please try a different file or manually input the text.';
  }
};

export const extractKeyTerms = (content: string): string[] => {
  // Simple key term extraction - in a real app, you'd use more sophisticated NLP
  const words = content.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const wordCount: { [key: string]: number } = {};
  
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .filter(([_, count]) => count > 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word, _]) => word);
};

export const extractDates = (content: string): string[] => {
  const dateRegex = /\b\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}\b|\b\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b/gi;
  return content.match(dateRegex) || [];
};

export const extractFormulas = (content: string): string[] => {
  // Look for mathematical expressions and formulas
  const formulaRegex = /[a-zA-Z]\s*[=<>≤≥]\s*[a-zA-Z0-9+\-*/^()\s]+|[a-zA-Z]\s*\([^)]+\)\s*[=<>≤≥]\s*[a-zA-Z0-9+\-*/^()\s]+/g;
  return content.match(formulaRegex) || [];
};
