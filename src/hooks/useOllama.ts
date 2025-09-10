import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  connectToOllama,
  loadModels,
  generateSummary,
  generateStudyMaterial,
  askQuestion,
  generateTopic,
  suggestTopics,
  setCurrentModel,
  clearError,
  logActivity,
  clearActivityLog,
} from '../store/slices/ollamaSlice';

export const useOllama = () => {
  const dispatch = useAppDispatch();
  const {
    isConnected,
    models,
    currentModel,
    isLoading,
    error,
    lastActivity,
    connectionStatus,
    modelInfo,
    activityLog,
    performance,
  } = useAppSelector((state) => state.ollama);

  // Connection management
  const connect = useCallback(async () => {
    const result = await dispatch(connectToOllama());
    return result.payload?.success || false;
  }, [dispatch]);

  const loadAvailableModels = useCallback(() => {
    dispatch(loadModels());
  }, [dispatch]);

  // AI operations
  const generateSummaryData = useCallback(async (
    content: string,
    length: 'short' | 'medium' | 'long',
    format: string
  ) => {
    const startTime = Date.now();
    try {
      const result = await dispatch(generateSummary({ content, length, format }));
      const responseTime = Date.now() - startTime;
      
      // Log activity
      dispatch(logActivity({
        type: 'summary',
        modelUsed: result.payload?.modelUsed || currentModel,
        contentLength: content.length,
        success: !!result.payload,
        responseTime,
      }));
      
      return result.payload?.result || 'Failed to generate summary';
    } catch (error) {
      const responseTime = Date.now() - startTime;
      dispatch(logActivity({
        type: 'summary',
        modelUsed: currentModel,
        contentLength: content.length,
        success: false,
        responseTime,
      }));
      throw error;
    }
  }, [dispatch, currentModel]);

  const generateStudyMaterialData = useCallback(async (
    content: string,
    type: 'flashcards' | 'questions' | 'notes'
  ) => {
    const startTime = Date.now();
    try {
      const result = await dispatch(generateStudyMaterial({ content, type }));
      const responseTime = Date.now() - startTime;
      
      dispatch(logActivity({
        type: 'study_material',
        modelUsed: result.payload?.modelUsed || currentModel,
        contentLength: content.length,
        success: !!result.payload,
        responseTime,
      }));
      
      return result.payload?.result || 'Failed to generate study material';
    } catch (error) {
      const responseTime = Date.now() - startTime;
      dispatch(logActivity({
        type: 'study_material',
        modelUsed: currentModel,
        contentLength: content.length,
        success: false,
        responseTime,
      }));
      throw error;
    }
  }, [dispatch, currentModel]);

  const askQuestionData = useCallback(async (question: string, context: string) => {
    const startTime = Date.now();
    try {
      const result = await dispatch(askQuestion({ question, context }));
      const responseTime = Date.now() - startTime;
      
      dispatch(logActivity({
        type: 'question',
        modelUsed: result.payload?.modelUsed || currentModel,
        contentLength: context.length,
        success: !!result.payload,
        responseTime,
      }));
      
      return result.payload?.result || 'Failed to get answer';
    } catch (error) {
      const responseTime = Date.now() - startTime;
      dispatch(logActivity({
        type: 'question',
        modelUsed: currentModel,
        contentLength: context.length,
        success: false,
        responseTime,
      }));
      throw error;
    }
  }, [dispatch, currentModel]);

  const generateTopicData = useCallback(async (
    topic: string,
    type: 'definition' | 'example' | 'explanation' | 'study_guide',
    depth: 'brief' | 'detailed' | 'comprehensive',
    context?: string
  ) => {
    const startTime = Date.now();
    try {
      const result = await dispatch(generateTopic({ topic, type, depth, context }));
      const responseTime = Date.now() - startTime;
      
      dispatch(logActivity({
        type: 'topic',
        modelUsed: result.payload?.modelUsed || currentModel,
        contentLength: topic.length + (context?.length || 0),
        success: !!result.payload,
        responseTime,
      }));
      
      return result.payload?.result || 'Failed to generate topic';
    } catch (error) {
      const responseTime = Date.now() - startTime;
      dispatch(logActivity({
        type: 'topic',
        modelUsed: currentModel,
        contentLength: topic.length + (context?.length || 0),
        success: false,
        responseTime,
      }));
      throw error;
    }
  }, [dispatch, currentModel]);

  const suggestTopicsData = useCallback(async (content: string) => {
    try {
      const result = await dispatch(suggestTopics(content));
      return result.payload || [];
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  // Model management
  const setModel = useCallback((modelName: string) => {
    dispatch(setCurrentModel(modelName));
  }, [dispatch]);

  const getModelInfo = useCallback((modelName: string) => {
    return modelInfo[modelName] || null;
  }, [modelInfo]);

  // Error handling
  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Activity management
  const clearActivity = useCallback(() => {
    dispatch(clearActivityLog());
  }, [dispatch]);

  // Computed values
  const availableModels = models;
  const isModelAvailable = useCallback((modelName: string) => {
    return models.includes(modelName);
  }, [models]);

  const getPerformanceStats = () => ({
    ...performance,
    successRate: performance.totalRequests > 0 
      ? (performance.successfulRequests / performance.totalRequests) * 100 
      : 0,
    averageResponseTime: performance.averageResponseTime,
  });

  const getRecentActivity = (limit: number = 10) => {
    return activityLog.slice(0, limit);
  };

  return {
    // State
    isConnected,
    models: availableModels,
    currentModel,
    isLoading,
    error,
    lastActivity,
    connectionStatus,
    modelInfo,
    activityLog,
    performance,
    
    // Actions
    connect,
    loadModels: loadAvailableModels,
    generateSummary: generateSummaryData,
    generateStudyMaterial: generateStudyMaterialData,
    askQuestion: askQuestionData,
    generateTopic: generateTopicData,
    suggestTopics: suggestTopicsData,
    setCurrentModel: setModel,
    clearError: clearErrorState,
    clearActivityLog: clearActivity,
    
    // Utilities
    getModelInfo,
    isModelAvailable,
    getPerformanceStats,
    getRecentActivity,
  };
};
