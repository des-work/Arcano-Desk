import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

interface OllamaContextType {
  isConnected: boolean;
  models: string[];
  currentModel: string;
  isLoading: boolean;
  connect: () => Promise<boolean>;
  generateSummary: (content: string, length: 'short' | 'medium' | 'long', format: string) => Promise<string>;
  generateStudyMaterial: (content: string, type: 'flashcards' | 'questions' | 'notes') => Promise<string>;
  askQuestion: (question: string, context: string) => Promise<string>;
  setCurrentModel: (model: string) => void;
}

const OllamaContext = createContext<OllamaContextType | undefined>(undefined);

export const useOllama = () => {
  const context = useContext(OllamaContext);
  if (!context) {
    throw new Error('useOllama must be used within an OllamaProvider');
  }
  return context;
};

export const OllamaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState('llama2');
  const [isLoading, setIsLoading] = useState(false);

  const connect = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:11434/api/tags');
      const availableModels = response.data.models?.map((model: any) => model.name) || [];
      setModels(availableModels);
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

  const generateSummary = useCallback(async (
    content: string, 
    length: 'short' | 'medium' | 'long', 
    format: string
  ): Promise<string> => {
    try {
      setIsLoading(true);
      
      const lengthInstructions = {
        short: 'Create a brief 1-paragraph summary',
        medium: 'Create a detailed 3-paragraph summary',
        long: 'Create a comprehensive multi-paragraph summary'
      };

      const prompt = `You are a magical study assistant. ${lengthInstructions[length]} of the following content in ${format} format. Focus on key terms, dates, formulas, and important concepts. Make it engaging and easy to understand:

${content}

Summary:`;

      const response = await axios.post('http://localhost:11434/api/generate', {
        model: currentModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      });

      return response.data.response || 'Failed to generate summary';
    } catch (error) {
      console.error('Failed to generate summary:', error);
      return 'Error generating summary. Please check your Ollama connection.';
    } finally {
      setIsLoading(false);
    }
  }, [currentModel]);

  const generateStudyMaterial = useCallback(async (
    content: string, 
    type: 'flashcards' | 'questions' | 'notes'
  ): Promise<string> => {
    try {
      setIsLoading(true);
      
      const typeInstructions = {
        flashcards: 'Create flashcards with questions and answers',
        questions: 'Create practice questions with detailed answers',
        notes: 'Create organized study notes with key concepts'
      };

      const prompt = `You are a magical study assistant. ${typeInstructions[type]} based on the following content. Make it engaging and educational:

${content}

${type.charAt(0).toUpperCase() + type.slice(1)}:`;

      const response = await axios.post('http://localhost:11434/api/generate', {
        model: currentModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      });

      return response.data.response || 'Failed to generate study material';
    } catch (error) {
      console.error('Failed to generate study material:', error);
      return 'Error generating study material. Please check your Ollama connection.';
    } finally {
      setIsLoading(false);
    }
  }, [currentModel]);

  const askQuestion = useCallback(async (
    question: string, 
    context: string
  ): Promise<string> => {
    try {
      setIsLoading(true);
      
      const prompt = `You are a magical study assistant. Answer the following question based on the provided context. Be confident and helpful:

Context: ${context}

Question: ${question}

Answer:`;

      const response = await axios.post('http://localhost:11434/api/generate', {
        model: currentModel,
        prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        }
      });

      return response.data.response || 'Failed to generate answer';
    } catch (error) {
      console.error('Failed to generate answer:', error);
      return 'Error generating answer. Please check your Ollama connection.';
    } finally {
      setIsLoading(false);
    }
  }, [currentModel]);

  const value: OllamaContextType = {
    isConnected,
    models,
    currentModel,
    isLoading,
    connect,
    generateSummary,
    generateStudyMaterial,
    askQuestion,
    setCurrentModel,
  };

  return (
    <OllamaContext.Provider value={value}>
      {children}
    </OllamaContext.Provider>
  );
};
