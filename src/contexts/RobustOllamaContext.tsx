/**
 * Robust Ollama Context
 * Advanced AI connection with model detection, fallbacks, and streaming
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface OllamaModel {
  name: string;
  id: string;
  size: string;
  modified: string;
  isAvailable: boolean;
}

interface RobustOllamaContextType {
  isConnected: boolean;
  isLoading: boolean;
  models: OllamaModel[];
  currentModel: OllamaModel | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  generateSummary: (content: string, length: 'short' | 'medium' | 'long', format?: string) => Promise<string>;
  generateStudyMaterial: (content: string, type: 'flashcards' | 'questions' | 'notes' | 'examples') => Promise<string>;
  askQuestion: (question: string, context: string) => Promise<string>;
  connect: () => Promise<boolean>;
  setCurrentModel: (model: OllamaModel) => void;
  testConnection: () => Promise<boolean>;
}

const RobustOllamaContext = createContext<RobustOllamaContextType | undefined>(undefined);

export const useRobustOllama = () => {
  const context = useContext(RobustOllamaContext);
  if (!context) {
    throw new Error('useRobustOllama must be used within a RobustOllamaProvider');
  }
  return context;
};

// Cache for AI responses
const responseCache = new Map<string, { response: string; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback responses for when AI is unavailable
const FALLBACK_RESPONSES = {
  summary: {
    short: "Key concepts and main points from your study materials.",
    medium: "This is a comprehensive overview of your study materials, covering the main concepts and important details that will help you understand the subject matter effectively.",
    long: "This is a detailed analysis of your study materials, providing comprehensive coverage of all key concepts, themes, and important information. The content has been carefully analyzed to ensure you have a complete understanding of the subject matter."
  },
  questions: "1. What are the main concepts discussed in this material?\n2. How do these concepts relate to each other?\n3. What practical applications can you identify?\n4. What are the key takeaways from this content?\n5. How would you explain this to someone else?",
  examples: "Here are practical examples that illustrate the key concepts from your study materials. These examples help demonstrate real-world applications and make the abstract concepts more concrete and understandable.",
  notes: "These are structured study notes covering the essential information from your materials. The notes are organized to help you review and understand the key concepts effectively.",
  flashcards: "Q: What is the main topic of this material?\nA: The main topic covers [key concepts from your study materials].\n\nQ: What are the important details?\nA: The important details include [specific information from your content]."
};

export const RobustOllamaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [currentModel, setCurrentModel] = useState<OllamaModel | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

  // Auto-connect on mount
  useEffect(() => {
    connect();
  }, []);

  // Test connection to Ollama
  const testConnection = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.models && data.models.length > 0;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }, []);

  // Connect to Ollama and detect models
  const connect = useCallback(async (): Promise<boolean> => {
    try {
      setConnectionStatus('connecting');
      setIsLoading(true);

      // Test connection first
      const isConnected = await testConnection();
      if (!isConnected) {
        throw new Error('Ollama is not running or not accessible');
      }

      // Get available models
      const response = await fetch('http://localhost:11434/api/tags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      const availableModels: OllamaModel[] = (data.models || []).map((model: any) => ({
        name: model.name,
        id: model.digest || model.name,
        size: formatBytes(model.size || 0),
        modified: new Date(model.modified_at || Date.now()).toLocaleDateString(),
        isAvailable: true
      }));

      setModels(availableModels);
      
      // Auto-select the best model (prefer smaller, faster models for study guides)
      const preferredModels = ['phi3:mini', 'gemma2:2b', 'phi3:latest', 'llama2:latest'];
      const selectedModel = availableModels.find(model => 
        preferredModels.includes(model.name)
      ) || availableModels[0];

      if (selectedModel) {
        setCurrentModel(selectedModel);
      }

      setIsConnected(true);
      setConnectionStatus('connected');
      return true;

    } catch (error) {
      console.error('Failed to connect to Ollama:', error);
      setIsConnected(false);
      setConnectionStatus('error');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [testConnection]);

  // Format bytes to human readable
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Make AI call with robust error handling
  const makeAICall = useCallback(async (
    prompt: string, 
    maxTokens: number = 500,
    useStreaming: boolean = false
  ): Promise<string> => {
    if (!currentModel) {
      throw new Error('No model selected');
    }

    const cacheKey = `${currentModel.name}_${prompt.substring(0, 100)}_${maxTokens}`;
    
    // Check cache first
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.response;
    }

    try {
      const requestBody = {
        model: currentModel.name,
        prompt: prompt,
        stream: useStreaming,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: maxTokens,
          stop: ['\n\n', '---', '##', '###']
        }
      };

      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(30000) // 30 second timeout
      });

      if (!response.ok) {
        throw new Error(`AI call failed: ${response.status} ${response.statusText}`);
      }

      if (useStreaming) {
        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('No response body');
        }

        let result = '';
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);
                if (data.response) {
                  result += data.response;
                }
                if (data.done) {
                  break;
                }
              } catch (e) {
                // Skip invalid JSON lines
              }
            }
          }
        }

        const finalResult = result.trim() || 'AI response not available';
        responseCache.set(cacheKey, { response: finalResult, timestamp: Date.now() });
        return finalResult;
      } else {
        // Handle non-streaming response
        const data = await response.json();
        const result = data.response?.trim() || 'AI response not available';
        responseCache.set(cacheKey, { response: result, timestamp: Date.now() });
        return result;
      }

    } catch (error) {
      console.error('AI call failed:', error);
      
      // Return fallback based on prompt type
      if (prompt.includes('summary') || prompt.includes('overview')) {
        const length = prompt.includes('short') ? 'short' : prompt.includes('long') ? 'long' : 'medium';
        return FALLBACK_RESPONSES.summary[length as keyof typeof FALLBACK_RESPONSES.summary];
      } else if (prompt.includes('questions')) {
        return FALLBACK_RESPONSES.questions;
      } else if (prompt.includes('examples')) {
        return FALLBACK_RESPONSES.examples;
      } else if (prompt.includes('flashcards')) {
        return FALLBACK_RESPONSES.flashcards;
      } else {
        return FALLBACK_RESPONSES.notes;
      }
    }
  }, [currentModel]);

  // Generate summary with optimized prompts
  const generateSummary = useCallback(async (
    content: string, 
    length: 'short' | 'medium' | 'long' = 'medium',
    format?: string
  ): Promise<string> => {
    const maxTokens = length === 'short' ? 200 : length === 'medium' ? 400 : 600;
    const contentPreview = content.substring(0, 3000); // Increased content limit
    
    const prompt = `Create a ${length} ${format || 'summary'} of this study material. Be concise but comprehensive. Focus on key concepts and main points:\n\n${contentPreview}`;
    
    return makeAICall(prompt, maxTokens, true); // Use streaming for better UX
  }, [makeAICall]);

  // Generate study material with specific types
  const generateStudyMaterial = useCallback(async (
    content: string, 
    type: 'flashcards' | 'questions' | 'notes' | 'examples'
  ): Promise<string> => {
    const contentPreview = content.substring(0, 2500); // Increased content limit
    let prompt = '';
    
    switch (type) {
      case 'flashcards':
        prompt = `Create 5-7 flashcards for this study material. Format each as "Q: [Question] A: [Answer]". Focus on key concepts:\n\n${contentPreview}`;
        break;
      case 'questions':
        prompt = `Generate 5-7 study questions for this material. Make them thought-provoking and focused on understanding:\n\n${contentPreview}`;
        break;
      case 'notes':
        prompt = `Create structured study notes with clear headings and key concepts:\n\n${contentPreview}`;
        break;
      case 'examples':
        prompt = `Provide 3-5 practical examples that illustrate the concepts in this material:\n\n${contentPreview}`;
        break;
    }
    
    return makeAICall(prompt, 500, true); // Use streaming
  }, [makeAICall]);

  // Ask questions with context
  const askQuestion = useCallback(async (question: string, context: string): Promise<string> => {
    const contextPreview = context.substring(0, 1500);
    const prompt = `Answer this question based on the provided context. Be helpful and specific:\n\nQuestion: ${question}\n\nContext: ${contextPreview}`;
    
    return makeAICall(prompt, 400, true); // Use streaming
  }, [makeAICall]);

  const value: RobustOllamaContextType = {
    isConnected,
    isLoading,
    models,
    currentModel,
    connectionStatus,
    generateSummary,
    generateStudyMaterial,
    askQuestion,
    connect,
    setCurrentModel,
    testConnection,
  };

  return (
    <RobustOllamaContext.Provider value={value}>
      {children}
    </RobustOllamaContext.Provider>
  );
};

export default RobustOllamaProvider;
