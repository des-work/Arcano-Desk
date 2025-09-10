import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
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
} from '../store/slices/uiSlice';

export const useUI = () => {
  const dispatch = useAppDispatch();
  const {
    currentPage,
    sidebarOpen,
    modals,
    notifications,
    loading,
    theme,
    effects,
    wizard,
    layout,
    performance,
  } = useAppSelector((state) => state.ui);

  // Navigation
  const navigateToPage = useCallback((page: string) => {
    dispatch(setCurrentPage(page));
  }, [dispatch]);

  const toggleSidebarState = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  const setSidebarState = useCallback((open: boolean) => {
    dispatch(setSidebarOpen(open));
  }, [dispatch]);

  // Modal management
  const openModalState = useCallback((type: keyof typeof modals, data?: any) => {
    dispatch(openModal({ type, data }));
  }, [dispatch]);

  const closeModalState = useCallback((type: keyof typeof modals) => {
    dispatch(closeModal(type));
  }, [dispatch]);

  const closeAllModalsState = useCallback(() => {
    dispatch(closeAllModals());
  }, [dispatch]);

  // Notification management
  const showNotification = useCallback((
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration?: number
  ) => {
    dispatch(addNotification({ type, message, duration }));
  }, [dispatch]);

  const hideNotification = useCallback((id: string) => {
    dispatch(removeNotification(id));
  }, [dispatch]);

  const clearAllNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  // Loading states
  const setGlobalLoadingState = useCallback((loading: boolean) => {
    dispatch(setGlobalLoading(loading));
  }, [dispatch]);

  const setPageLoadingState = useCallback((loading: boolean) => {
    dispatch(setPageLoading(loading));
  }, [dispatch]);

  const setComponentLoadingState = useCallback((component: string, loading: boolean) => {
    dispatch(setComponentLoading({ component, loading }));
  }, [dispatch]);

  const clearAllLoading = useCallback(() => {
    dispatch(clearLoading());
  }, [dispatch]);

  // Theme management
  const updateTheme = useCallback((themeUpdates: Partial<typeof theme>) => {
    dispatch(setTheme(themeUpdates));
  }, [dispatch]);

  // Effects management
  const triggerEffect = useCallback((
    effect: string,
    intensity: 'low' | 'medium' | 'high' = 'medium',
    duration: number = 3000
  ) => {
    dispatch(setActiveEffect({ effect, intensity, duration }));
  }, [dispatch]);

  const clearActiveEffect = useCallback(() => {
    dispatch(clearEffect());
  }, [dispatch]);

  // Wizard management
  const setWizardLearningState = useCallback((learning: boolean) => {
    dispatch(setWizardLearning(learning));
  }, [dispatch]);

  const setWizardKnowledgeState = useCallback((knowledge: boolean) => {
    dispatch(setWizardKnowledge(knowledge));
  }, [dispatch]);

  const setWizardSpellState = useCallback((spell: string) => {
    dispatch(setWizardSpell(spell));
  }, [dispatch]);

  const setWizardMoodState = useCallback((mood: typeof wizard.mood) => {
    dispatch(setWizardMood(mood));
  }, [dispatch]);

  const updateWizardState = useCallback((updates: Partial<typeof wizard>) => {
    dispatch(updateWizard(updates));
  }, [dispatch]);

  // Layout management
  const updateGridSize = useCallback((size: typeof layout.gridSize) => {
    dispatch(setGridSize(size));
  }, [dispatch]);

  const updateShowSidebar = useCallback((show: boolean) => {
    dispatch(setShowSidebar(show));
  }, [dispatch]);

  const updateCompactMode = useCallback((compact: boolean) => {
    dispatch(setCompactMode(compact));
  }, [dispatch]);

  const updateLayoutState = useCallback((updates: Partial<typeof layout>) => {
    dispatch(updateLayout(updates));
  }, [dispatch]);

  // Performance management
  const updatePerformanceState = useCallback((updates: Partial<typeof performance>) => {
    dispatch(updatePerformance(updates));
  }, [dispatch]);

  const optimizePerformanceState = useCallback(() => {
    dispatch(optimizePerformance());
  }, [dispatch]);

  // Reset
  const resetUIState = useCallback(() => {
    dispatch(resetUI());
  }, [dispatch]);

  // Computed values
  const isModalOpen = useCallback((type: keyof typeof modals) => {
    return modals[type].isOpen;
  }, [modals]);

  const getActiveNotifications = () => {
    return notifications.filter(n => 
      !n.duration || Date.now() - n.timestamp < n.duration
    );
  };

  const isAnyLoading = loading.global || loading.page || Object.values(loading.component).some(Boolean);

  const getLoadingComponents = () => {
    return Object.keys(loading.component).filter(key => loading.component[key]);
  };

  return {
    // State
    currentPage,
    sidebarOpen,
    modals,
    notifications,
    loading,
    theme,
    effects,
    wizard,
    layout,
    performance,
    
    // Navigation
    navigateToPage,
    toggleSidebar: toggleSidebarState,
    setSidebarOpen: setSidebarState,
    
    // Modals
    openModal: openModalState,
    closeModal: closeModalState,
    closeAllModals: closeAllModalsState,
    isModalOpen,
    
    // Notifications
    showNotification,
    hideNotification,
    clearAllNotifications,
    getActiveNotifications,
    
    // Loading
    setGlobalLoading: setGlobalLoadingState,
    setPageLoading: setPageLoadingState,
    setComponentLoading: setComponentLoadingState,
    clearAllLoading,
    isAnyLoading,
    getLoadingComponents,
    
    // Theme
    updateTheme,
    
    // Effects
    triggerEffect,
    clearActiveEffect,
    
    // Wizard
    setWizardLearning: setWizardLearningState,
    setWizardKnowledge: setWizardKnowledgeState,
    setWizardSpell: setWizardSpellState,
    setWizardMood: setWizardMoodState,
    updateWizard: updateWizardState,
    
    // Layout
    updateGridSize,
    updateShowSidebar,
    updateCompactMode,
    updateLayout: updateLayoutState,
    
    // Performance
    updatePerformance: updatePerformanceState,
    optimizePerformance: optimizePerformanceState,
    
    // Reset
    resetUI: resetUIState,
  };
};
