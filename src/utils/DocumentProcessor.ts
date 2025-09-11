/**
 * Document Processing Utility
 * Handles reading and processing various document types
 */

export interface ProcessedDocument {
  id: string;
  name: string;
  type: string;
  content: string;
  wordCount: number;
  extractedText: string;
  metadata: {
    size: number;
    uploadDate: Date;
    lastProcessed: Date;
  };
}

export class DocumentProcessor {
  /**
   * Process a file and extract its content
   */
  static async processFile(file: File): Promise<ProcessedDocument> {
    const content = await this.extractTextFromFile(file);
    
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      content: content,
      wordCount: content.split(/\s+/).length,
      extractedText: content,
      metadata: {
        size: file.size,
        uploadDate: new Date(),
        lastProcessed: new Date(),
      }
    };
  }

  /**
   * Extract text content from various file types
   */
  private static async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type.toLowerCase();
    
    try {
      if (fileType.includes('text/plain') || fileType.includes('text/')) {
        return await this.readTextFile(file);
      } else if (fileType.includes('application/pdf')) {
        return await this.readPDFFile(file);
      } else if (fileType.includes('image/')) {
        return await this.readImageFile(file);
      } else if (fileType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document') || 
                 fileType.includes('application/msword')) {
        return await this.readWordFile(file);
      } else {
        // Fallback for unknown file types
        return `File: ${file.name}\nType: ${file.type}\nSize: ${file.size} bytes\n\n[Content extraction not supported for this file type]`;
      }
    } catch (error) {
      console.error('Error processing file:', error);
      return `Error processing file: ${file.name}\n\nPlease try uploading a different file or contact support if the issue persists.`;
    }
  }

  /**
   * Read plain text files
   */
  private static async readTextFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string || '');
      };
      reader.onerror = () => reject(new Error('Failed to read text file'));
      reader.readAsText(file);
    });
  }

  /**
   * Read PDF files (simplified - in production you'd use a PDF library)
   */
  private static async readPDFFile(file: File): Promise<string> {
    // For now, return a placeholder. In production, you'd use pdf.js or similar
    return `PDF Document: ${file.name}\n\n[PDF content extraction would be implemented here using a library like pdf.js]\n\nThis is a placeholder for PDF text extraction. The actual implementation would require adding a PDF processing library to extract the text content from the PDF file.`;
  }

  /**
   * Read image files (simplified - in production you'd use OCR)
   */
  private static async readImageFile(file: File): Promise<string> {
    // For now, return a placeholder. In production, you'd use Tesseract.js or similar
    return `Image Document: ${file.name}\n\n[OCR text extraction would be implemented here using a library like Tesseract.js]\n\nThis is a placeholder for image text extraction. The actual implementation would require adding an OCR library to extract text from images.`;
  }

  /**
   * Read Word documents (simplified - in production you'd use mammoth.js)
   */
  private static async readWordFile(file: File): Promise<string> {
    // For now, return a placeholder. In production, you'd use mammoth.js
    return `Word Document: ${file.name}\n\n[Word document text extraction would be implemented here using a library like mammoth.js]\n\nThis is a placeholder for Word document text extraction. The actual implementation would require adding a Word processing library to extract the text content from .doc/.docx files.`;
  }

  /**
   * Generate study content based on processed documents
   */
  static generateStudyContent(
    documents: ProcessedDocument[], 
    style: 'academic' | 'casual' | 'creative' | 'technical' | 'minimal' = 'academic'
  ): string {
    if (documents.length === 0) {
      return 'No documents available for study guide generation.';
    }

    const totalWords = documents.reduce((sum, doc) => sum + doc.wordCount, 0);
    const documentNames = documents.map(doc => doc.name).join(', ');

    const stylePrompts = {
      academic: `Create a comprehensive academic study guide with formal language, structured sections, and scholarly analysis.`,
      casual: `Create a friendly, conversational study guide that's easy to read and understand.`,
      creative: `Create an imaginative, engaging study guide with creative analogies and memorable examples.`,
      technical: `Create a detailed technical study guide with precise terminology and systematic explanations.`,
      minimal: `Create a concise, bullet-point style study guide focusing on key concepts and essential information.`
    };

    return `${stylePrompts[style]}

Based on the following documents:
${documents.map(doc => `
Document: ${doc.name}
Type: ${doc.type}
Word Count: ${doc.wordCount}
Content Preview: ${doc.extractedText.substring(0, 200)}...
`).join('\n')}

Total Documents: ${documents.length}
Total Word Count: ${totalWords}

Please generate a study guide that synthesizes the key concepts from these documents in the ${style} style.`;
  }
}
