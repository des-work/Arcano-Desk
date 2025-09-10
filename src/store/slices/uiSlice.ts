import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data?: any;
}

interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
  duration?: number;
}

interface UIState {
  // Navigation
  currentPage: string;
  sidebarOpen: boolean;
  
  // Modals
  modals: {
    modelSelector: ModalState;
    topicGenerator: ModalState;
    fileUpload: ModalState;
    settings: ModalState;
    wizard: ModalState;
  };
  
  // Notifications
  notifications: NotificationState[];
  
  // Loading states
  loading: {
    global: boolean;
    page: boolean;
    component: Record<string, boolean>;
  };
  
  // Theme and effects
  theme: {
    mode: 'light' | 'dark' | 'auto';
    primaryColor: string;
    accentColor: string;
  };
  
  effects: {
    activeEffect: string;
    intensity: 'low' | 'medium' | 'high';
    duration: number;
  };
  
  // Wizard state
  wizard: {
    isLearning: boolean;
    hasNewKnowledge: boolean;
    currentSpell: string;
    mood: 'happy' | 'focused' | 'excited' | 'thinking' | 'sleeping';
  };
  
  // Layout
  layout: {
    gridSize: 'small' | 'medium' | 'large';
    showSidebar: boolean;
    compactMode: boolean;
  };
  
  // Performance
  performance: {
    renderTime: number;
    memoryUsage: number;
    lastOptimization: number;
  };
}

const initialState: UIState = {
  currentPage: 'dashboard',
  sidebarOpen: true,
  
  modals: {
    modelSelector: { isOpen: false, type: null },
    topicGenerator: { isOpen: false, type: null },
    fileUpload: { isOpen: false, type: null },
    settings: { isOpen: false, type: null },
    wizard: { isOpen: false, type: null },
  },
  
  notifications: [],
  
  loading: {
    global: false,
    page: false,
    component: {},
  },
  
  theme: {
    mode: 'dark',
    primaryColor: '#8B5CF6',
    accentColor: '#EC4899',
  },
  
  effects: {
    activeEffect: '',
    intensity: 'medium',
    duration: 3000,
  },
  
  wizard: {
    isLearning: false,
    hasNewKnowledge: false,
    currentSpell: '',
    mood: 'happy',
  },
  
  layout: {
    gridSize: 'medium',
    showSidebar: true,
    compactMode: false,
  },
  
  performance: {
    renderTime: 0,
    memoryUsage: 0,
    lastOptimization: Date.now(),
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Navigation
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    // Modals
    openModal: (state, action: PayloadAction<{ type: keyof UIState['modals']; data?: any }>) => {
      const { type, data } = action.payload;
      state.modals[type] = { isOpen: true, type, data };
    },
    closeModal: (state, action: PayloadAction<keyof UIState['modals']>) => {
      const modalType = action.payload;
      state.modals[modalType] = { isOpen: false, type: null };
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach(key => {
        state.modals[key as keyof UIState['modals']] = { isOpen: false, type: null };
      });
    },
    
    // Notifications
    addNotification: (state, action: PayloadAction<Omit<NotificationState, 'id' | 'timestamp'>>) => {
      const notification: NotificationState = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    
    // Loading states
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.page = action.payload;
    },
    setComponentLoading: (state, action: PayloadAction<{ component: string; loading: boolean }>) => {
      const { component, loading } = action.payload;
      state.loading.component[component] = loading;
    },
    clearLoading: (state) => {
      state.loading = {
        global: false,
        page: false,
        component: {},
      };
    },
    
    // Theme
    setTheme: (state, action: PayloadAction<Partial<UIState['theme']>>) => {
      state.theme = { ...state.theme, ...action.payload };
    },
    
    // Effects
    setActiveEffect: (state, action: PayloadAction<{ effect: string; intensity?: 'low' | 'medium' | 'high'; duration?: number }>) => {
      const { effect, intensity = 'medium', duration = 3000 } = action.payload;
      state.effects = { activeEffect: effect, intensity, duration };
    },
    clearEffect: (state) => {
      state.effects.activeEffect = '';
    },
    
    // Wizard
    setWizardLearning: (state, action: PayloadAction<boolean>) => {
      state.wizard.isLearning = action.payload;
    },
    setWizardKnowledge: (state, action: PayloadAction<boolean>) => {
      state.wizard.hasNewKnowledge = action.payload;
    },
    setWizardSpell: (state, action: PayloadAction<string>) => {
      state.wizard.currentSpell = action.payload;
    },
    setWizardMood: (state, action: PayloadAction<UIState['wizard']['mood']>) => {
      state.wizard.mood = action.payload;
    },
    updateWizard: (state, action: PayloadAction<Partial<UIState['wizard']>>) => {
      state.wizard = { ...state.wizard, ...action.payload };
    },
    
    // Layout
    setGridSize: (state, action: PayloadAction<UIState['layout']['gridSize']>) => {
      state.layout.gridSize = action.payload;
    },
    setShowSidebar: (state, action: PayloadAction<boolean>) => {
      state.layout.showSidebar = action.payload;
    },
    setCompactMode: (state, action: PayloadAction<boolean>) => {
      state.layout.compactMode = action.payload;
    },
    updateLayout: (state, action: PayloadAction<Partial<UIState['layout']>>) => {
      state.layout = { ...state.layout, ...action.payload };
    },
    
    // Performance
    updatePerformance: (state, action: PayloadAction<Partial<UIState['performance']>>) => {
      state.performance = { ...state.performance, ...action.payload };
    },
    optimizePerformance: (state) => {
      state.performance.lastOptimization = Date.now();
      // Clear old notifications
      state.notifications = state.notifications.slice(0, 20);
      // Clear component loading states
      state.loading.component = {};
    },
    
    // Reset
    resetUI: (state) => {
      return { ...initialState, theme: state.theme }; // Keep theme preferences
    },
  },
});

export const {
  setCurrentPage,
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  closeAllModals,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setPageLoading,
  setComponentLoading,
  clearLoading,
  setTheme,
  setActiveEffect,
  clearEffect,
  setWizardLearning,
  setWizardKnowledge,
  setWizardSpell,
  setWizardMood,
  updateWizard,
  setGridSize,
  setShowSidebar,
  setCompactMode,
  updateLayout,
  updatePerformance,
  optimizePerformance,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
