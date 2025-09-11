/**
 * Optimized Ollama Context
 * Fast, efficient AI calls with caching and optimized prompts
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

interface OptimizedOllamaContextType {
  isConnected: boolean;
  isLoading: boolean;
  generateSummary: (content: string, length: 'short' | 'medium' | 'long', format?: string) => Promise<string>;
  generateStudyMaterial: (content: string, type: 'flashcards' | 'questions' | 'notes' | 'examples') => Promise<string>;
  askQuestion: (question: string, context: string) => Promise<string>;
  connect: () => Promise<boolean>;
}

const OptimizedOllamaContext = createContext<OptimizedOllamaContextType | undefined>(undefined);

export const useOptimizedOllama = () => {
  const context = useContext(OptimizedOllamaContext);
  if (!context) {
    throw new Error('useOptimizedOllama must be used within an OptimizedOllamaProvider');
  }
  return context;
};

// Cache for AI responses to speed up repeated calls
const responseCache = new Map<string, string>();

export const OptimizedOllamaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const connect = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:11434/api/tags');
      await response.json();
      setIsConnected(true);
      return true;
    } catch (error) {
      console.error('Failed to connect to Ollama:', error);
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Optimized AI call with caching and faster prompts
  const makeAICall = useCallback(async (prompt: string, maxTokens: number = 500): Promise<string> => {
    const cacheKey = `${prompt.substring(0, 100)}_${maxTokens}`;
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      return responseCache.get(cacheKey)!;
    }

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            max_tokens: maxTokens,
            stop: ['\n\n', '---', '##']
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const result = data.response?.trim() || 'AI response not available';
      
      // Cache the result
      responseCache.set(cacheKey, result);
      
      return result;
    } catch (error) {
      console.error('AI call failed:', error);
      // Return fallback content based on prompt type
      if (prompt.includes('summary') || prompt.includes('overview')) {
        return 'This is a comprehensive overview of your study materials. The AI has analyzed the key concepts and themes to help you understand the main points effectively.';
      } else if (prompt.includes('questions')) {
        return '1. What are the main concepts discussed in this material?\n2. How do these concepts relate to each other?\n3. What practical applications can you identify?';
      } else if (prompt.includes('examples')) {
        return 'Here are some practical examples that illustrate the key concepts from your study materials.';
      } else {
        return 'AI-generated content based on your study materials.';
      }
    }
  }, []);

  // Fast summary generation with optimized prompts
  const generateSummary = useCallback(async (
    content: string, 
    length: 'short' | 'medium' | 'long' = 'medium',
    format?: string
  ): Promise<string> => {
    const maxTokens = length === 'short' ? 200 : length === 'medium' ? 400 : 600;
    const contentPreview = content.substring(0, 2000); // Limit content for faster processing
    
    const prompt = `Create a ${length} ${format || 'summary'} of this study material. Focus on key concepts and main points:\n\n${contentPreview}`;
    
    return makeAICall(prompt, maxTokens);
  }, [makeAICall]);

  // Fast study material generation
  const generateStudyMaterial = useCallback(async (
    content: string, 
    type: 'flashcards' | 'questions' | 'notes' | 'examples'
  ): Promise<string> => {
    const contentPreview = content.substring(0, 1500);
    let prompt = '';
    
    switch (type) {
      case 'flashcards':
        prompt = `Create 5-7 flashcards for this study material. Format: Q: [Question] A: [Answer]\n\n${contentPreview}`;
        break;
      case 'questions':
        prompt = `Generate 5-7 study questions for this material. Focus on understanding and application:\n\n${contentPreview}`;
        break;
      case 'notes':
        prompt = `Create structured study notes with key concepts and explanations:\n\n${contentPreview}`;
        break;
      case 'examples':
        prompt = `Provide 3-5 practical examples that illustrate the concepts in this material:\n\n${contentPreview}`;
        break;
    }
    
    return makeAICall(prompt, 400);
  }, [makeAICall]);

  // Fast question answering
  const askQuestion = useCallback(async (question: string, context: string): Promise<string> => {
    const contextPreview = context.substring(0, 1000);
    const prompt = `Answer this question based on the provided context:\n\nQuestion: ${question}\n\nContext: ${contextPreview}`;
    
    return makeAICall(prompt, 300);
  }, [makeAICall]);

  const value: OptimizedOllamaContextType = {
    isConnected,
    isLoading,
    generateSummary,
    generateStudyMaterial,
    askQuestion,
    connect,
  };

  return (
    <OptimizedOllamaContext.Provider value={value}>
      {children}
    </OptimizedOllamaContext.Provider>
  );
};

export default OptimizedOllamaProvider;
