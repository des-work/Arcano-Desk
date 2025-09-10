import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ollamaService } from '../../services/ollamaService';
import { analyzeContent, getModelInfo, AVAILABLE_MODELS } from '../../utils/contentAnalyzer';

// Async thunks
export const connectToOllama = createAsyncThunk(
  'ollama/connect',
  async (_, { rejectWithValue }) => {
    try {
      const result = await ollamaService.connect();
      return result;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to connect to Ollama');
    }
  }
);

export const loadModels = createAsyncThunk(
  'ollama/loadModels',
  async (_, { rejectWithValue }) => {
    try {
      const models = await ollamaService.getAvailableModels();
      return models;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load models');
    }
  }
);

export const generateSummary = createAsyncThunk(
  'ollama/generateSummary',
  async (
    { content, length, format }: { content: string; length: 'short' | 'medium' | 'long'; format: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as any;
      const analysis = analyzeContent(content);
      const recommendedModel = analysis.recommendedModel;
      const availableModels = state.ollama.models;
      const modelToUse = availableModels.includes(recommendedModel) ? recommendedModel : state.ollama.currentModel;
      
      const result = await ollamaService.generateSummary(content, length, format, modelToUse);
      return {
        result,
        analysis,
        modelUsed: modelToUse,
        modelInfo: getModelInfo(modelToUse),
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to generate summary');
    }
  }
);

export const generateStudyMaterial = createAsyncThunk(
  'ollama/generateStudyMaterial',
  async (
    { content, type }: { content: string; type: 'flashcards' | 'questions' | 'notes' },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as any;
      const analysis = analyzeContent(content);
      const recommendedModel = analysis.recommendedModel;
      const availableModels = state.ollama.models;
      const modelToUse = availableModels.includes(recommendedModel) ? recommendedModel : state.ollama.currentModel;
      
      const result = await ollamaService.generateStudyMaterial(content, type, modelToUse);
      return {
        result,
        analysis,
        modelUsed: modelToUse,
        modelInfo: getModelInfo(modelToUse),
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to generate study material');
    }
  }
);

export const askQuestion = createAsyncThunk(
  'ollama/askQuestion',
  async (
    { question, context }: { question: string; context: string },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as any;
      const analysis = analyzeContent(context);
      const recommendedModel = analysis.recommendedModel;
      const availableModels = state.ollama.models;
      const modelToUse = availableModels.includes(recommendedModel) ? recommendedModel : state.ollama.currentModel;
      
      const result = await ollamaService.askQuestion(question, context, modelToUse);
      return {
        result,
        analysis,
        modelUsed: modelToUse,
        modelInfo: getModelInfo(modelToUse),
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to get answer');
    }
  }
);

export const generateTopic = createAsyncThunk(
  'ollama/generateTopic',
  async (
    { topic, type, depth, context }: { 
      topic: string; 
      type: 'definition' | 'example' | 'explanation' | 'study_guide'; 
      depth: 'brief' | 'detailed' | 'comprehensive';
      context?: string;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as any;
      const availableModels = state.ollama.models;
      const modelToUse = availableModels.includes('phi3:latest') ? 'phi3:latest' : 
                        availableModels.includes('llama2:latest') ? 'llama2:latest' : 
                        state.ollama.currentModel;
      
      const result = await ollamaService.generateTopic(topic, type, depth, context, modelToUse);
      return {
        result,
        modelUsed: modelToUse,
        modelInfo: getModelInfo(modelToUse),
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to generate topic');
    }
  }
);

export const suggestTopics = createAsyncThunk(
  'ollama/suggestTopics',
  async (content: string, { rejectWithValue }) => {
    try {
      const analysis = analyzeContent(content);
      const suggestions = await ollamaService.suggestTopics(content, analysis);
      return suggestions;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to suggest topics');
    }
  }
);

interface OllamaState {
  isConnected: boolean;
  models: string[];
  currentModel: string;
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  modelInfo: {
    [modelName: string]: {
      size: string;
      capabilities: string[];
      bestFor: string[];
      contextWindow: number;
    };
  };
  activityLog: Array<{
    id: string;
    type: 'summary' | 'study_material' | 'question' | 'topic';
    timestamp: number;
    modelUsed: string;
    contentLength: number;
    success: boolean;
  }>;
  performance: {
    averageResponseTime: number;
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
  };
}

const initialState: OllamaState = {
  isConnected: false,
  models: [],
  currentModel: 'llama2:latest',
  isLoading: false,
  error: null,
  lastActivity: null,
  connectionStatus: 'disconnected',
  modelInfo: {},
  activityLog: [],
  performance: {
    averageResponseTime: 0,
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
  },
};

const ollamaSlice = createSlice({
  name: 'ollama',
  initialState,
  reducers: {
    setCurrentModel: (state, action: PayloadAction<string>) => {
      state.currentModel = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateConnectionStatus: (state, action: PayloadAction<OllamaState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
    },
    logActivity: (state, action: PayloadAction<{
      type: 'summary' | 'study_material' | 'question' | 'topic';
      modelUsed: string;
      contentLength: number;
      success: boolean;
      responseTime: number;
    }>) => {
      const { type, modelUsed, contentLength, success, responseTime } = action.payload;
      
      // Add to activity log
      state.activityLog.unshift({
        id: Date.now().toString(),
        type,
        timestamp: Date.now(),
        modelUsed,
        contentLength,
        success,
      });
      
      // Keep only last 100 activities
      if (state.activityLog.length > 100) {
        state.activityLog = state.activityLog.slice(0, 100);
      }
      
      // Update performance metrics
      state.performance.totalRequests++;
      if (success) {
        state.performance.successfulRequests++;
      } else {
        state.performance.failedRequests++;
      }
      
      // Update average response time
      const totalTime = state.performance.averageResponseTime * (state.performance.totalRequests - 1) + responseTime;
      state.performance.averageResponseTime = totalTime / state.performance.totalRequests;
      
      state.lastActivity = Date.now();
    },
    clearActivityLog: (state) => {
      state.activityLog = [];
      state.performance = {
        averageResponseTime: 0,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
      };
    },
  },
  extraReducers: (builder) => {
    // Connect to Ollama
    builder
      .addCase(connectToOllama.pending, (state) => {
        state.isLoading = true;
        state.connectionStatus = 'connecting';
        state.error = null;
      })
      .addCase(connectToOllama.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isConnected = action.payload.success;
        state.connectionStatus = action.payload.success ? 'connected' : 'error';
        state.models = action.payload.models || [];
        state.error = action.payload.success ? null : 'Connection failed';
      })
      .addCase(connectToOllama.rejected, (state, action) => {
        state.isLoading = false;
        state.isConnected = false;
        state.connectionStatus = 'error';
        state.error = action.payload as string;
      });

    // Load models
    builder
      .addCase(loadModels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadModels.fulfilled, (state, action) => {
        state.isLoading = false;
        state.models = action.payload;
        // Update model info
        action.payload.forEach(modelName => {
          const info = getModelInfo(modelName);
          if (info) {
            state.modelInfo[modelName] = info;
          }
        });
      })
      .addCase(loadModels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Generate summary
    builder
      .addCase(generateSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastActivity = Date.now();
      })
      .addCase(generateSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Generate study material
    builder
      .addCase(generateStudyMaterial.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateStudyMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastActivity = Date.now();
      })
      .addCase(generateStudyMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Ask question
    builder
      .addCase(askQuestion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(askQuestion.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastActivity = Date.now();
      })
      .addCase(askQuestion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Generate topic
    builder
      .addCase(generateTopic.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateTopic.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastActivity = Date.now();
      })
      .addCase(generateTopic.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Suggest topics
    builder
      .addCase(suggestTopics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(suggestTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastActivity = Date.now();
      })
      .addCase(suggestTopics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentModel,
  clearError,
  updateConnectionStatus,
  logActivity,
  clearActivityLog,
} = ollamaSlice.actions;

export default ollamaSlice.reducer;
