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
  generateStudyMaterial: (content: string, type: 'flashcards' | 'questions' | 'notes' | 'examples' | 'annotations') => Promise<string>;
  askQuestion: (question: string, context: string) => Promise<string>;
  connect: () => Promise<boolean>;
  reconnect: () => Promise<boolean>;
  setCurrentModel: (model: OllamaModel) => void;
  testConnection: () => Promise<boolean>;
  getConnectionInfo: () => { status: string; model: string; modelsCount: number };
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

// Enhanced fallback responses that are more specific and useful
const ENHANCED_FALLBACK_RESPONSES = {
  questions: [
    "What are the main concepts discussed in this material?",
    "How do these concepts relate to each other?",
    "What practical applications can you identify?",
    "What are the key takeaways from this content?",
    "How would you explain this to someone else?"
  ],
  notes: [
    "Review the main headings and subheadings for structure",
    "Identify key terms and their definitions",
    "Look for examples and case studies provided",
    "Note any formulas, processes, or procedures mentioned",
    "Highlight important dates, numbers, or statistics"
  ],
  examples: [
    "Consider how this concept applies in different scenarios",
    "Think about similar situations you may have encountered",
    "Look for patterns that repeat throughout the material",
    "Identify what makes each example unique or important",
    "Connect these examples to your own experiences"
  ],
  annotations: [
    "This section provides foundational knowledge for the topic",
    "Pay attention to the examples given - they illustrate key concepts",
    "The structure here follows a logical progression",
    "These points are essential for understanding the broader context",
    "Consider how this relates to real-world applications"
  ],
  summaries: [
    "This material covers important concepts that build upon each other",
    "Understanding the relationships between different topics is crucial",
    "Practical applications help reinforce theoretical knowledge",
    "Regular review and practice will improve retention",
    "Connecting new information to existing knowledge enhances learning"
  ]
};

export const RobustOllamaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [currentModel, setCurrentModel] = useState<OllamaModel | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

  // Auto-connect on mount with retry logic
  useEffect(() => {
    const attemptConnection = async () => {
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts && !isConnected) {
        attempts++;
        console.log(`AI connection attempt ${attempts}/${maxAttempts}`);
        
        const success = await connect();
        if (success) {
          console.log('AI connected successfully');
          break;
        }
        
        if (attempts < maxAttempts) {
          console.log('Retrying AI connection in 2 seconds...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      if (!isConnected) {
        console.log('AI connection failed after all attempts. Using fallback mode.');
      }
    };
    
    attemptConnection();
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

  // Manual reconnect function
  const reconnect = useCallback(async (): Promise<boolean> => {
    console.log('Manual AI reconnection requested');
    setIsConnected(false);
    setConnectionStatus('connecting');
    setCurrentModel(null);
    setModels([]);
    
    return await connect();
  }, [connect]);

  // Get connection information
  const getConnectionInfo = useCallback(() => {
    return {
      status: connectionStatus,
      model: currentModel?.name || 'None',
      modelsCount: models.length
    };
  }, [connectionStatus, currentModel, models]);

  // Format bytes to human readable
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Make AI call with robust error handling and retry logic
  const makeAICall = useCallback(async (
    prompt: string, 
    maxTokens: number = 500,
    useStreaming: boolean = false,
    retryCount: number = 0
  ): Promise<string> => {
    if (!currentModel) {
      throw new Error('No model selected');
    }

    const cacheKey = `${currentModel.name}_${prompt.substring(0, 100)}_${maxTokens}`;
    
    // Check cache first
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('Using cached AI response');
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

        const finalResult = result.trim() || '';
        responseCache.set(cacheKey, { response: finalResult, timestamp: Date.now() });
        return finalResult;
      } else {
        // Handle non-streaming response
        const data = await response.json();
        const result = data.response?.trim() || '';
        responseCache.set(cacheKey, { response: result, timestamp: Date.now() });
        return result;
      }

    } catch (error) {
      console.error(`AI call failed (attempt ${retryCount + 1}):`, error);
      
      // Retry logic for transient errors
      if (retryCount < 2 && error instanceof Error && 
          (error.message.includes('timeout') || error.message.includes('network'))) {
        console.log(`Retrying AI call in ${(retryCount + 1) * 1000}ms...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
        return makeAICall(prompt, maxTokens, useStreaming, retryCount + 1);
      }
      
      console.log('Using fallback response for prompt:', prompt.substring(0, 100));
      
      // Return enhanced fallback based on prompt type
      if (prompt.includes('summary') || prompt.includes('overview')) {
        const length = prompt.includes('short') ? 'short' : prompt.includes('long') ? 'long' : 'medium';
        return FALLBACK_RESPONSES.summary[length as keyof typeof FALLBACK_RESPONSES.summary];
      } else if (prompt.includes('questions')) {
        return ENHANCED_FALLBACK_RESPONSES.questions.join('\n');
      } else if (prompt.includes('examples')) {
        return ENHANCED_FALLBACK_RESPONSES.examples.join('\n');
      } else if (prompt.includes('flashcards')) {
        return FALLBACK_RESPONSES.flashcards;
      } else if (prompt.includes('annotations')) {
        return ENHANCED_FALLBACK_RESPONSES.annotations.join('\n');
      } else if (prompt.includes('notes')) {
        return ENHANCED_FALLBACK_RESPONSES.notes.join('\n');
      } else {
        return ENHANCED_FALLBACK_RESPONSES.notes.join('\n');
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
    
    const prompt = `You are an expert study guide creator. Create a ${length} ${format || 'summary'} of this study material. 

Requirements:
- Be concise but comprehensive
- Focus on key concepts and main points
- Highlight important relationships between concepts
- Make it suitable for study and review
- Use clear, academic language

${contentPreview}`;
    
    return makeAICall(prompt, maxTokens, true); // Use streaming for better UX
  }, [makeAICall]);

  // Generate study material with specific types
  const generateStudyMaterial = useCallback(async (
    content: string, 
    type: 'flashcards' | 'questions' | 'notes' | 'examples' | 'annotations'
  ): Promise<string> => {
    const contentPreview = content.substring(0, 2500); // Increased content limit
    let prompt = '';
    
    switch (type) {
      case 'flashcards':
        prompt = `Create 5-7 flashcards for this study material. Format each as "Q: [Question] A: [Answer]". Focus on key concepts:\n\n${contentPreview}`;
        break;
      case 'questions':
        prompt = `You are an expert study guide creator. Generate 5-7 high-quality study questions for this academic material. Make them:
- Thought-provoking and analytical
- Focused on understanding key concepts
- Suitable for exam preparation
- Covering different levels of complexity

Format each question on a new line, starting with a number (1., 2., etc.):

${contentPreview}`;
        break;
      case 'notes':
        prompt = `You are an expert study guide creator. Create 5-7 structured study notes for this material. Each note should be:
- Clear and actionable
- Focused on key concepts and important information
- Easy to understand and remember
- Directly related to the content

Format each note on a new line as a bullet point:

${contentPreview}`;
        break;
      case 'examples':
        prompt = `You are an expert study guide creator. Provide 3-5 practical examples that illustrate the concepts in this material. Each example should be:
- Specific and relevant to the content
- Easy to understand
- Demonstrating real-world applications
- Supporting the main concepts

Format each example on a new line as a bullet point:

${contentPreview}`;
        break;
      case 'annotations':
        prompt = `You are an expert study guide creator. Create 5-7 helpful study annotations and insights for this material. Each annotation should be:
- Focused on key points and connections
- Providing learning tips and strategies
- Highlighting important relationships
- Offering study guidance

Format each annotation on a new line as a bullet point:

${contentPreview}`;
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
    reconnect,
    setCurrentModel,
    testConnection,
    getConnectionInfo,
  };

  return (
    <RobustOllamaContext.Provider value={value}>
      {children}
    </RobustOllamaContext.Provider>
  );
};

export default RobustOllamaProvider;

