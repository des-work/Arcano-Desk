// ============================================================================
// CORE DATA TYPES
// ============================================================================

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
  metadata?: FileMetadata;
}

export interface FileMetadata {
  size: number;
  wordCount: number;
  pageCount?: number;
  language?: string;
  complexity?: 'low' | 'medium' | 'high';
  topics?: string[];
  lastModified: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  color: string;
  createdAt: Date;
  description?: string;
  instructor?: string;
  semester?: string;
  year?: number;
  tags?: string[];
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'flashcards' | 'questions' | 'notes' | 'summary';
  content: string;
  courseId: string;
  createdAt: Date;
  fileId?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime?: number; // in minutes
  tags?: string[];
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
  estimatedHours?: number;
  actualHours?: number;
  notes?: string;
}

// ============================================================================
// AI & MODEL TYPES
// ============================================================================

export interface OllamaSettings {
  model: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt?: string;
  customInstructions?: string;
}

export interface ModelInfo {
  name: string;
  size: string;
  capabilities: string[];
  bestFor: string[];
  contextWindow: number;
  performance: {
    speed: 'fast' | 'medium' | 'slow';
    quality: 'basic' | 'good' | 'excellent';
    memoryUsage: 'low' | 'medium' | 'high';
  };
  requirements: {
    minRAM: number; // in GB
    recommendedRAM: number; // in GB
    gpuAcceleration: boolean;
  };
}

export interface ContentAnalysis {
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  topicDensity: number;
  complexityScore: number;
  recommendedModel: string;
  reasoning: string;
  estimatedTokens: number;
  readingTime: number; // in minutes
  keyTopics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// ============================================================================
// UI & ANIMATION TYPES
// ============================================================================

export interface SummarySettings {
  length: 'short' | 'medium' | 'long';
  format: 'paragraph' | 'bullet' | 'outline' | 'q&a';
  includeKeyTerms: boolean;
  includeDates: boolean;
  includeFormulas: boolean;
  includeReviews: boolean;
  language?: string;
  style?: 'academic' | 'casual' | 'technical';
}

export interface WizardState {
  mood: 'happy' | 'excited' | 'focused' | 'sleepy' | 'curious' | 'proud';
  energy: number;
  wisdom: number;
  currentSpell: string | null;
  isCasting: boolean;
  lastAction: string | null;
  interactionCount: number;
  experience: number;
  level: number;
}

export interface AnimationConfig {
  type: string;
  intensity: 'subtle' | 'gentle' | 'moderate' | 'intense' | 'epic';
  duration: 'instant' | 'fast' | 'normal' | 'slow' | 'epic';
  easing: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  lazy?: boolean;
  cacheable?: boolean;
  performance?: {
    maxParticles?: number;
    quality?: 'low' | 'medium' | 'high';
    adaptive?: boolean;
  };
}

// ============================================================================
// API & SERVICE TYPES
// ============================================================================

export interface OllamaResponse {
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
  model?: string;
  created_at?: string;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  requestId?: string;
}

// ============================================================================
// PERFORMANCE & MONITORING TYPES
// ============================================================================

export interface PerformanceMetrics {
  fps: number;
  activeAnimations: number;
  memoryUsage: number;
  performanceRating: 'excellent' | 'good' | 'fair' | 'poor';
  recommendations: string[];
  renderTime: number;
  bundleSize: number;
  loadTime: number;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  components: {
    ollama: 'connected' | 'disconnected' | 'error';
    animations: 'enabled' | 'disabled' | 'limited';
    storage: 'available' | 'full' | 'error';
    network: 'online' | 'offline' | 'slow';
  };
  lastCheck: Date;
  uptime: number;
}

// ============================================================================
// USER PREFERENCES & SETTINGS
// ============================================================================

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  animations: {
    enabled: boolean;
    intensity: 'low' | 'medium' | 'high';
    performance: 'quality' | 'balanced' | 'performance';
  };
  wizard: {
    personality: 'friendly' | 'scholarly' | 'mystical';
    verbosity: 'minimal' | 'normal' | 'detailed';
    autoCast: boolean;
  };
  study: {
    defaultModel: string;
    autoAnalyze: boolean;
    saveHistory: boolean;
    exportFormat: 'pdf' | 'docx' | 'txt';
  };
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    types: string[];
  };
}

// ============================================================================
// ROUTING & NAVIGATION TYPES
// ============================================================================

export type RoutePath = 
  | '/'
  | '/library'
  | '/assistant'
  | '/calendar'
  | '/settings'
  | '/upload'
  | '/summary';

export interface NavigationItem {
  path: RoutePath;
  icon: React.ComponentType<any>;
  label: string;
  description: string;
  color: string;
  requiresAuth?: boolean;
  requiresFiles?: boolean;
  badge?: string | number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type FileType = 'pdf' | 'docx' | 'pptx' | 'txt';
export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in-progress' | 'completed';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type AnimationIntensity = 'subtle' | 'gentle' | 'moderate' | 'intense' | 'epic';
export type PerformanceMode = 'high' | 'medium' | 'low';

// ============================================================================
// EVENT TYPES
// ============================================================================

export interface AppEvent {
  type: string;
  payload: any;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface WizardEvent extends AppEvent {
  type: 'wizard-cast' | 'wizard-learn' | 'wizard-excited' | 'wizard-sleep';
  payload: {
    spell?: string;
    mood?: string;
    energy?: number;
    wisdom?: number;
  };
}

export interface FileEvent extends AppEvent {
  type: 'file-upload' | 'file-process' | 'file-delete' | 'file-analyze';
  payload: {
    fileId: string;
    fileName: string;
    fileType: FileType;
    fileSize?: number;
  };
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================

export type {
  // Re-export commonly used types
  FileData as File,
  Course,
  StudyMaterial,
  Assignment,
  OllamaSettings,
  ModelInfo,
  ContentAnalysis,
  SummarySettings,
  WizardState,
  AnimationConfig,
  OllamaResponse,
  OllamaModel,
  ApiError,
  PerformanceMetrics,
  SystemHealth,
  UserPreferences,
  NavigationItem,
  AppEvent,
  WizardEvent,
  FileEvent,
};
