import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { analyzeContent, getModelInfo } from '../utils/contentAnalyzer';
import { generateTopicPrompt, suggestTopicsFromContent, formatGeneratedContent } from '../utils/topicGenerator';

interface OllamaResponse {
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

interface OllamaModel {
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

class OllamaService {
  private client: AxiosInstance;
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private cache: Map<string, { data: any; timestamp: number }>;
  private cacheTimeout: number;

  constructor() {
    this.baseUrl = 'http://localhost:11434';
    this.timeout = 30000; // 30 seconds
    this.retryAttempts = 3;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`🧙‍♂️ Ollama Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Ollama Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log(`✨ Ollama Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('Ollama Response Error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (error.code === 'ECONNREFUSED') {
      return new Error('Cannot connect to Ollama. Please ensure Ollama is running on localhost:11434');
    }
    if (error.response?.status === 404) {
      return new Error('Model not found. Please check if the model is installed');
    }
    if (error.response?.status === 500) {
      return new Error('Ollama server error. Please check the Ollama logs');
    }
    if (error.code === 'ECONNABORTED') {
      return new Error('Request timeout. The model might be too slow or overloaded');
    }
    return new Error(error.message || 'Unknown error occurred');
  }

  private getCacheKey(key: string): string {
    return `ollama_${key}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cacheKey = this.getCacheKey(key);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    this.cache.delete(cacheKey);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    const cacheKey = this.getCacheKey(key);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  private async retryRequest<T>(requestFn: () => Promise<T>, attempts: number = this.retryAttempts): Promise<T> {
    for (let i = 0; i < attempts; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === attempts - 1) throw error;
        
        // Exponential backoff
        const delay = Math.pow(2, i) * 1000;
        console.log(`Retrying request in ${delay}ms... (attempt ${i + 1}/${attempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retry attempts reached');
  }

  // Connection management
  async connect(): Promise<{ success: boolean; models: string[]; error?: string }> {
    try {
      const response = await this.retryRequest(() => this.client.get('/api/tags'));
      const models = response.data.models?.map((model: OllamaModel) => model.name) || [];
      
      return { success: true, models };
    } catch (error) {
      console.error('Failed to connect to Ollama:', error);
      return { 
        success: false, 
        models: [], 
        error: error instanceof Error ? error.message : 'Connection failed' 
      };
    }
  }

  async getAvailableModels(): Promise<string[]> {
    const cacheKey = 'available_models';
    const cached = this.getFromCache<string[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await this.retryRequest(() => this.client.get('/api/tags'));
      const models = response.data.models?.map((model: OllamaModel) => model.name) || [];
      
      this.setCache(cacheKey, models);
      return models;
    } catch (error) {
      console.error('Failed to get available models:', error);
      throw error;
    }
  }

  async getModelInfo(modelName: string): Promise<OllamaModel | null> {
    try {
      const response = await this.retryRequest(() => this.client.get('/api/tags'));
      const model = response.data.models?.find((m: OllamaModel) => m.name === modelName);
      return model || null;
    } catch (error) {
      console.error(`Failed to get model info for ${modelName}:`, error);
      return null;
    }
  }

  // Content generation
  async generateSummary(
    content: string, 
    length: 'short' | 'medium' | 'long', 
    format: string, 
    model: string
  ): Promise<string> {
    const startTime = Date.now();
    
    try {
      const lengthInstructions = {
        short: 'Create a brief 1-paragraph summary',
        medium: 'Create a detailed 3-paragraph summary',
        long: 'Create a comprehensive multi-paragraph summary'
      };

      const prompt = `You are a magical study assistant wizard. ${lengthInstructions[length]} of the following content in ${format} format. 

Focus on key terms, dates, formulas, and important concepts. Make it engaging, well-organized, and easy to understand. Avoid messy regurgitations - provide clear, structured insights.

Content to analyze:
${content}

Magical Summary:`;

      const response = await this.retryRequest(() => 
        this.client.post('/api/generate', {
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 2048,
          }
        })
      );

      const result = response.data.response || 'Failed to generate summary';
      const responseTime = Date.now() - startTime;
      
      console.log(`✨ Summary generated in ${responseTime}ms using ${model}`);
      
      return result;
    } catch (error) {
      console.error('Failed to generate summary:', error);
      throw error;
    }
  }

  async generateStudyMaterial(
    content: string, 
    type: 'flashcards' | 'questions' | 'notes', 
    model: string
  ): Promise<string> {
    const startTime = Date.now();
    
    try {
      const typeInstructions = {
        flashcards: 'Create flashcards with questions and answers',
        questions: 'Create practice questions with detailed answers',
        notes: 'Create organized study notes with key concepts'
      };

      const prompt = `You are a magical study assistant. ${typeInstructions[type]} based on the following content. Make it engaging and educational:

${content}

${type.charAt(0).toUpperCase() + type.slice(1)}:`;

      const response = await this.retryRequest(() => 
        this.client.post('/api/generate', {
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 2048,
          }
        })
      );

      const result = response.data.response || 'Failed to generate study material';
      const responseTime = Date.now() - startTime;
      
      console.log(`✨ Study material generated in ${responseTime}ms using ${model}`);
      
      return result;
    } catch (error) {
      console.error('Failed to generate study material:', error);
      throw error;
    }
  }

  async askQuestion(question: string, context: string, model: string): Promise<string> {
    const startTime = Date.now();
    
    try {
      const prompt = `You are a magical study assistant wizard. Answer the following question based on the provided context. Be confident, helpful, and well-organized. Provide clear, structured responses that avoid messy regurgitations.

Context: ${context}

Question: ${question}

Magical Answer:`;

      const response = await this.retryRequest(() => 
        this.client.post('/api/generate', {
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 2048,
          }
        })
      );

      const result = response.data.response || 'Failed to generate answer';
      const responseTime = Date.now() - startTime;
      
      console.log(`✨ Question answered in ${responseTime}ms using ${model}`);
      
      return result;
    } catch (error) {
      console.error('Failed to answer question:', error);
      throw error;
    }
  }

  async generateTopic(
    topic: string,
    type: 'definition' | 'example' | 'explanation' | 'study_guide',
    depth: 'brief' | 'detailed' | 'comprehensive',
    context: string | undefined,
    model: string
  ): Promise<string> {
    const startTime = Date.now();
    
    try {
      const prompt = generateTopicPrompt({ topic, type, depth, context });
      
      const response = await this.retryRequest(() => 
        this.client.post('/api/generate', {
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 2048,
          }
        })
      );

      const content = response.data.response || 'Failed to generate topic';
      const formattedContent = formatGeneratedContent(content, type);
      const responseTime = Date.now() - startTime;
      
      console.log(`✨ Topic generated in ${responseTime}ms using ${model}`);
      
      return formattedContent;
    } catch (error) {
      console.error('Failed to generate topic:', error);
      throw error;
    }
  }

  async suggestTopics(content: string, analysis: any): Promise<any[]> {
    try {
      const suggestions = suggestTopicsFromContent(content, analysis);
      return suggestions;
    } catch (error) {
      console.error('Failed to suggest topics:', error);
      throw error;
    }
  }

  // Model management
  async pullModel(modelName: string): Promise<void> {
    try {
      console.log(`📥 Pulling model: ${modelName}`);
      
      const response = await this.client.post('/api/pull', {
        name: modelName,
        stream: false,
      });
      
      console.log(`✅ Model ${modelName} pulled successfully`);
    } catch (error) {
      console.error(`Failed to pull model ${modelName}:`, error);
      throw error;
    }
  }

  async deleteModel(modelName: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting model: ${modelName}`);
      
      await this.client.delete('/api/delete', {
        data: { name: modelName }
      });
      
      console.log(`✅ Model ${modelName} deleted successfully`);
    } catch (error) {
      console.error(`Failed to delete model ${modelName}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; details: any }> {
    try {
      const response = await this.client.get('/api/tags');
      return {
        status: 'healthy',
        details: {
          models: response.data.models?.length || 0,
          timestamp: new Date().toISOString(),
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        }
      };
    }
  }

  // Performance monitoring
  async getPerformanceMetrics(): Promise<{
    averageResponseTime: number;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
  }> {
    // This would typically come from a monitoring service
    // For now, return mock data
    return {
      averageResponseTime: 1500,
      totalRequests: 100,
      successfulRequests: 95,
      failedRequests: 5,
    };
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Ollama service cache cleared');
  }

  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

export const ollamaService = new OllamaService();
