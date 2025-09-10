export interface FileData {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'pptx' | 'txt';
  content: string;
  courseId: string;
  uploadedAt: Date;
  lastProcessed?: Date;
  summary?: string;
  keyTerms?: string[];
  dates?: string[];
  formulas?: string[];
  reviews?: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  createdAt: Date;
  description?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'flashcards' | 'questions' | 'notes' | 'summary';
  content: string;
  courseId: string;
  createdAt: Date;
  fileId?: string;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  courseId: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

export interface SummarySettings {
  length: 'short' | 'medium' | 'long';
  format: 'paragraph' | 'bullet' | 'outline' | 'q&a';
  includeKeyTerms: boolean;
  includeDates: boolean;
  includeFormulas: boolean;
  includeReviews: boolean;
}

export interface OllamaSettings {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
}
