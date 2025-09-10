import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AISettings {
  defaultModel: string;
  temperature: number;
  topP: number;
  maxTokens: number;
  autoModelSelection: boolean;
  modelTransparency: boolean;
  responseFormat: 'paragraph' | 'bullet' | 'structured';
  summaryLength: 'short' | 'medium' | 'long';
}

interface FileSettings {
  autoSave: boolean;
  autoBackup: boolean;
  maxFileSize: number; // in MB
  allowedFormats: string[];
  ocrEnabled: boolean;
  compressionEnabled: boolean;
}

interface UISettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  animations: boolean;
  soundEffects: boolean;
  compactMode: boolean;
  showTooltips: boolean;
}

interface PerformanceSettings {
  cacheEnabled: boolean;
  cacheSize: number; // in MB
  autoOptimize: boolean;
  backgroundProcessing: boolean;
  maxConcurrentRequests: number;
}

interface PrivacySettings {
  dataCollection: boolean;
  analytics: boolean;
  crashReporting: boolean;
  telemetry: boolean;
}

interface SettingsState {
  ai: AISettings;
  files: FileSettings;
  ui: UISettings;
  performance: PerformanceSettings;
  privacy: PrivacySettings;
  lastUpdated: number;
  version: string;
}

const initialState: SettingsState = {
  ai: {
    defaultModel: 'llama2:latest',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    autoModelSelection: true,
    modelTransparency: true,
    responseFormat: 'paragraph',
    summaryLength: 'medium',
  },
  files: {
    autoSave: true,
    autoBackup: true,
    maxFileSize: 50,
    allowedFormats: ['.pdf', '.docx', '.pptx', '.txt'],
    ocrEnabled: true,
    compressionEnabled: true,
  },
  ui: {
    theme: 'dark',
    language: 'en',
    fontSize: 'medium',
    animations: true,
    soundEffects: false,
    compactMode: false,
    showTooltips: true,
  },
  performance: {
    cacheEnabled: true,
    cacheSize: 100,
    autoOptimize: true,
    backgroundProcessing: true,
    maxConcurrentRequests: 3,
  },
  privacy: {
    dataCollection: false,
    analytics: false,
    crashReporting: true,
    telemetry: false,
  },
  lastUpdated: Date.now(),
  version: '1.0.0',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    // AI Settings
    updateAISettings: (state, action: PayloadAction<Partial<AISettings>>) => {
      state.ai = { ...state.ai, ...action.payload };
      state.lastUpdated = Date.now();
    },
    setDefaultModel: (state, action: PayloadAction<string>) => {
      state.ai.defaultModel = action.payload;
      state.lastUpdated = Date.now();
    },
    setTemperature: (state, action: PayloadAction<number>) => {
      state.ai.temperature = Math.max(0, Math.min(2, action.payload));
      state.lastUpdated = Date.now();
    },
    setTopP: (state, action: PayloadAction<number>) => {
      state.ai.topP = Math.max(0, Math.min(1, action.payload));
      state.lastUpdated = Date.now();
    },
    setMaxTokens: (state, action: PayloadAction<number>) => {
      state.ai.maxTokens = Math.max(1, Math.min(8192, action.payload));
      state.lastUpdated = Date.now();
    },
    toggleAutoModelSelection: (state) => {
      state.ai.autoModelSelection = !state.ai.autoModelSelection;
      state.lastUpdated = Date.now();
    },
    toggleModelTransparency: (state) => {
      state.ai.modelTransparency = !state.ai.modelTransparency;
      state.lastUpdated = Date.now();
    },
    setResponseFormat: (state, action: PayloadAction<AISettings['responseFormat']>) => {
      state.ai.responseFormat = action.payload;
      state.lastUpdated = Date.now();
    },
    setSummaryLength: (state, action: PayloadAction<AISettings['summaryLength']>) => {
      state.ai.summaryLength = action.payload;
      state.lastUpdated = Date.now();
    },
    
    // File Settings
    updateFileSettings: (state, action: PayloadAction<Partial<FileSettings>>) => {
      state.files = { ...state.files, ...action.payload };
      state.lastUpdated = Date.now();
    },
    toggleAutoSave: (state) => {
      state.files.autoSave = !state.files.autoSave;
      state.lastUpdated = Date.now();
    },
    toggleAutoBackup: (state) => {
      state.files.autoBackup = !state.files.autoBackup;
      state.lastUpdated = Date.now();
    },
    setMaxFileSize: (state, action: PayloadAction<number>) => {
      state.files.maxFileSize = Math.max(1, Math.min(500, action.payload));
      state.lastUpdated = Date.now();
    },
    setAllowedFormats: (state, action: PayloadAction<string[]>) => {
      state.files.allowedFormats = action.payload;
      state.lastUpdated = Date.now();
    },
    toggleOCR: (state) => {
      state.files.ocrEnabled = !state.files.ocrEnabled;
      state.lastUpdated = Date.now();
    },
    toggleCompression: (state) => {
      state.files.compressionEnabled = !state.files.compressionEnabled;
      state.lastUpdated = Date.now();
    },
    
    // UI Settings
    updateUISettings: (state, action: PayloadAction<Partial<UISettings>>) => {
      state.ui = { ...state.ui, ...action.payload };
      state.lastUpdated = Date.now();
    },
    setTheme: (state, action: PayloadAction<UISettings['theme']>) => {
      state.ui.theme = action.payload;
      state.lastUpdated = Date.now();
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.ui.language = action.payload;
      state.lastUpdated = Date.now();
    },
    setFontSize: (state, action: PayloadAction<UISettings['fontSize']>) => {
      state.ui.fontSize = action.payload;
      state.lastUpdated = Date.now();
    },
    toggleAnimations: (state) => {
      state.ui.animations = !state.ui.animations;
      state.lastUpdated = Date.now();
    },
    toggleSoundEffects: (state) => {
      state.ui.soundEffects = !state.ui.soundEffects;
      state.lastUpdated = Date.now();
    },
    toggleCompactMode: (state) => {
      state.ui.compactMode = !state.ui.compactMode;
      state.lastUpdated = Date.now();
    },
    toggleTooltips: (state) => {
      state.ui.showTooltips = !state.ui.showTooltips;
      state.lastUpdated = Date.now();
    },
    
    // Performance Settings
    updatePerformanceSettings: (state, action: PayloadAction<Partial<PerformanceSettings>>) => {
      state.performance = { ...state.performance, ...action.payload };
      state.lastUpdated = Date.now();
    },
    toggleCache: (state) => {
      state.performance.cacheEnabled = !state.performance.cacheEnabled;
      state.lastUpdated = Date.now();
    },
    setCacheSize: (state, action: PayloadAction<number>) => {
      state.performance.cacheSize = Math.max(10, Math.min(1000, action.payload));
      state.lastUpdated = Date.now();
    },
    toggleAutoOptimize: (state) => {
      state.performance.autoOptimize = !state.performance.autoOptimize;
      state.lastUpdated = Date.now();
    },
    toggleBackgroundProcessing: (state) => {
      state.performance.backgroundProcessing = !state.performance.backgroundProcessing;
      state.lastUpdated = Date.now();
    },
    setMaxConcurrentRequests: (state, action: PayloadAction<number>) => {
      state.performance.maxConcurrentRequests = Math.max(1, Math.min(10, action.payload));
      state.lastUpdated = Date.now();
    },
    
    // Privacy Settings
    updatePrivacySettings: (state, action: PayloadAction<Partial<PrivacySettings>>) => {
      state.privacy = { ...state.privacy, ...action.payload };
      state.lastUpdated = Date.now();
    },
    toggleDataCollection: (state) => {
      state.privacy.dataCollection = !state.privacy.dataCollection;
      state.lastUpdated = Date.now();
    },
    toggleAnalytics: (state) => {
      state.privacy.analytics = !state.privacy.analytics;
      state.lastUpdated = Date.now();
    },
    toggleCrashReporting: (state) => {
      state.privacy.crashReporting = !state.privacy.crashReporting;
      state.lastUpdated = Date.now();
    },
    toggleTelemetry: (state) => {
      state.privacy.telemetry = !state.privacy.telemetry;
      state.lastUpdated = Date.now();
    },
    
    // Bulk operations
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      const { lastUpdated, version, ...updates } = action.payload;
      Object.assign(state, updates);
      state.lastUpdated = Date.now();
    },
    resetSettings: (state) => {
      return { ...initialState, version: state.version };
    },
    resetAISettings: (state) => {
      state.ai = initialState.ai;
      state.lastUpdated = Date.now();
    },
    resetFileSettings: (state) => {
      state.files = initialState.files;
      state.lastUpdated = Date.now();
    },
    resetUISettings: (state) => {
      state.ui = initialState.ui;
      state.lastUpdated = Date.now();
    },
    resetPerformanceSettings: (state) => {
      state.performance = initialState.performance;
      state.lastUpdated = Date.now();
    },
    resetPrivacySettings: (state) => {
      state.privacy = initialState.privacy;
      state.lastUpdated = Date.now();
    },
    
    // Version management
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
      state.lastUpdated = Date.now();
    },
  },
});

export const {
  updateAISettings,
  setDefaultModel,
  setTemperature,
  setTopP,
  setMaxTokens,
  toggleAutoModelSelection,
  toggleModelTransparency,
  setResponseFormat,
  setSummaryLength,
  updateFileSettings,
  toggleAutoSave,
  toggleAutoBackup,
  setMaxFileSize,
  setAllowedFormats,
  toggleOCR,
  toggleCompression,
  updateUISettings,
  setTheme,
  setLanguage,
  setFontSize,
  toggleAnimations,
  toggleSoundEffects,
  toggleCompactMode,
  toggleTooltips,
  updatePerformanceSettings,
  toggleCache,
  setCacheSize,
  toggleAutoOptimize,
  toggleBackgroundProcessing,
  setMaxConcurrentRequests,
  updatePrivacySettings,
  toggleDataCollection,
  toggleAnalytics,
  toggleCrashReporting,
  toggleTelemetry,
  updateSettings,
  resetSettings,
  resetAISettings,
  resetFileSettings,
  resetUISettings,
  resetPerformanceSettings,
  resetPrivacySettings,
  setVersion,
} = settingsSlice.actions;

export default settingsSlice.reducer;
