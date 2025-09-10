import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WizardState {
  // Personality and mood
  mood: 'happy' | 'focused' | 'excited' | 'thinking' | 'sleeping' | 'confused' | 'proud';
  energy: number; // 0-100
  knowledge: number; // 0-100
  experience: number; // 0-100
  
  // Learning state
  isLearning: boolean;
  hasNewKnowledge: boolean;
  currentSpell: string;
  learningProgress: number; // 0-100
  
  // Activity tracking
  lastActivity: number;
  totalInteractions: number;
  successfulSpells: number;
  failedSpells: number;
  
  // Memory and context
  recentTopics: string[];
  favoriteModels: string[];
  learnedConcepts: string[];
  
  // Visual effects
  activeEffect: string;
  effectIntensity: 'low' | 'medium' | 'high';
  effectDuration: number;
  
  // Communication
  currentMessage: string;
  messageQueue: string[];
  isSpeaking: boolean;
  
  // Performance metrics
  averageResponseTime: number;
  accuracy: number; // 0-100
  userSatisfaction: number; // 0-100
  
  // Preferences
  preferredModel: string;
  preferredResponseStyle: 'formal' | 'casual' | 'magical' | 'academic';
  preferredTopics: string[];
  
  // Achievements
  achievements: string[];
  level: number;
  experiencePoints: number;
}

const initialState: WizardState = {
  mood: 'happy',
  energy: 100,
  knowledge: 50,
  experience: 0,
  
  isLearning: false,
  hasNewKnowledge: false,
  currentSpell: '',
  learningProgress: 0,
  
  lastActivity: Date.now(),
  totalInteractions: 0,
  successfulSpells: 0,
  failedSpells: 0,
  
  recentTopics: [],
  favoriteModels: ['llama2:latest'],
  learnedConcepts: [],
  
  activeEffect: '',
  effectIntensity: 'medium',
  effectDuration: 3000,
  
  currentMessage: '',
  messageQueue: [],
  isSpeaking: false,
  
  averageResponseTime: 0,
  accuracy: 85,
  userSatisfaction: 90,
  
  preferredModel: 'llama2:latest',
  preferredResponseStyle: 'magical',
  preferredTopics: [],
  
  achievements: [],
  level: 1,
  experiencePoints: 0,
};

const wizardSlice = createSlice({
  name: 'wizard',
  initialState,
  reducers: {
    // Mood and personality
    setMood: (state, action: PayloadAction<WizardState['mood']>) => {
      state.mood = action.payload;
      state.lastActivity = Date.now();
    },
    updateEnergy: (state, action: PayloadAction<number>) => {
      state.energy = Math.max(0, Math.min(100, action.payload));
    },
    updateKnowledge: (state, action: PayloadAction<number>) => {
      state.knowledge = Math.max(0, Math.min(100, action.payload));
    },
    updateExperience: (state, action: PayloadAction<number>) => {
      state.experience = Math.max(0, Math.min(100, action.payload));
    },
    
    // Learning state
    setLearning: (state, action: PayloadAction<boolean>) => {
      state.isLearning = action.payload;
      if (action.payload) {
        state.mood = 'focused';
        state.energy = Math.max(0, state.energy - 10);
      }
    },
    setNewKnowledge: (state, action: PayloadAction<boolean>) => {
      state.hasNewKnowledge = action.payload;
      if (action.payload) {
        state.mood = 'excited';
        state.knowledge = Math.min(100, state.knowledge + 5);
        state.experiencePoints += 10;
      }
    },
    setCurrentSpell: (state, action: PayloadAction<string>) => {
      state.currentSpell = action.payload;
    },
    updateLearningProgress: (state, action: PayloadAction<number>) => {
      state.learningProgress = Math.max(0, Math.min(100, action.payload));
    },
    
    // Activity tracking
    recordInteraction: (state, action: PayloadAction<{ success: boolean; responseTime: number }>) => {
      const { success, responseTime } = action.payload;
      state.totalInteractions++;
      state.lastActivity = Date.now();
      
      if (success) {
        state.successfulSpells++;
        state.accuracy = (state.successfulSpells / state.totalInteractions) * 100;
        state.experiencePoints += 5;
      } else {
        state.failedSpells++;
        state.accuracy = (state.successfulSpells / state.totalInteractions) * 100;
      }
      
      // Update average response time
      const totalTime = state.averageResponseTime * (state.totalInteractions - 1) + responseTime;
      state.averageResponseTime = totalTime / state.totalInteractions;
      
      // Update mood based on performance
      if (state.accuracy > 90) {
        state.mood = 'proud';
      } else if (state.accuracy < 70) {
        state.mood = 'confused';
      } else {
        state.mood = 'focused';
      }
    },
    
    // Memory and context
    addRecentTopic: (state, action: PayloadAction<string>) => {
      state.recentTopics.unshift(action.payload);
      if (state.recentTopics.length > 10) {
        state.recentTopics = state.recentTopics.slice(0, 10);
      }
    },
    addFavoriteModel: (state, action: PayloadAction<string>) => {
      if (!state.favoriteModels.includes(action.payload)) {
        state.favoriteModels.push(action.payload);
      }
    },
    removeFavoriteModel: (state, action: PayloadAction<string>) => {
      state.favoriteModels = state.favoriteModels.filter(model => model !== action.payload);
    },
    addLearnedConcept: (state, action: PayloadAction<string>) => {
      if (!state.learnedConcepts.includes(action.payload)) {
        state.learnedConcepts.push(action.payload);
        state.knowledge = Math.min(100, state.knowledge + 2);
      }
    },
    
    // Visual effects
    setActiveEffect: (state, action: PayloadAction<{ effect: string; intensity?: 'low' | 'medium' | 'high'; duration?: number }>) => {
      const { effect, intensity = 'medium', duration = 3000 } = action.payload;
      state.activeEffect = effect;
      state.effectIntensity = intensity;
      state.effectDuration = duration;
    },
    clearEffect: (state) => {
      state.activeEffect = '';
    },
    
    // Communication
    setCurrentMessage: (state, action: PayloadAction<string>) => {
      state.currentMessage = action.payload;
    },
    addMessageToQueue: (state, action: PayloadAction<string>) => {
      state.messageQueue.push(action.payload);
    },
    processMessageQueue: (state) => {
      if (state.messageQueue.length > 0) {
        state.currentMessage = state.messageQueue.shift() || '';
        state.isSpeaking = true;
      }
    },
    setSpeaking: (state, action: PayloadAction<boolean>) => {
      state.isSpeaking = action.payload;
    },
    clearMessageQueue: (state) => {
      state.messageQueue = [];
      state.currentMessage = '';
      state.isSpeaking = false;
    },
    
    // Performance metrics
    updateAccuracy: (state, action: PayloadAction<number>) => {
      state.accuracy = Math.max(0, Math.min(100, action.payload));
    },
    updateUserSatisfaction: (state, action: PayloadAction<number>) => {
      state.userSatisfaction = Math.max(0, Math.min(100, action.payload));
    },
    
    // Preferences
    setPreferredModel: (state, action: PayloadAction<string>) => {
      state.preferredModel = action.payload;
    },
    setPreferredResponseStyle: (state, action: PayloadAction<WizardState['preferredResponseStyle']>) => {
      state.preferredResponseStyle = action.payload;
    },
    addPreferredTopic: (state, action: PayloadAction<string>) => {
      if (!state.preferredTopics.includes(action.payload)) {
        state.preferredTopics.push(action.payload);
      }
    },
    removePreferredTopic: (state, action: PayloadAction<string>) => {
      state.preferredTopics = state.preferredTopics.filter(topic => topic !== action.payload);
    },
    
    // Achievements and leveling
    addAchievement: (state, action: PayloadAction<string>) => {
      if (!state.achievements.includes(action.payload)) {
        state.achievements.push(action.payload);
        state.experiencePoints += 50;
      }
    },
    updateLevel: (state) => {
      const newLevel = Math.floor(state.experiencePoints / 100) + 1;
      if (newLevel > state.level) {
        state.level = newLevel;
        state.energy = 100; // Restore energy on level up
        state.mood = 'excited';
      }
    },
    addExperiencePoints: (state, action: PayloadAction<number>) => {
      state.experiencePoints += action.payload;
      // Check for level up
      const newLevel = Math.floor(state.experiencePoints / 100) + 1;
      if (newLevel > state.level) {
        state.level = newLevel;
        state.energy = 100;
        state.mood = 'excited';
      }
    },
    
    // Rest and recovery
    rest: (state) => {
      state.energy = Math.min(100, state.energy + 20);
      state.mood = 'sleeping';
      state.isLearning = false;
      state.currentSpell = '';
    },
    meditate: (state) => {
      state.energy = Math.min(100, state.energy + 10);
      state.knowledge = Math.min(100, state.knowledge + 5);
      state.mood = 'focused';
    },
    
    // Reset
    resetWizard: (state) => {
      return { ...initialState, achievements: state.achievements, level: state.level, experiencePoints: state.experiencePoints };
    },
    resetStats: (state) => {
      state.totalInteractions = 0;
      state.successfulSpells = 0;
      state.failedSpells = 0;
      state.accuracy = 85;
      state.averageResponseTime = 0;
    },
  },
});

export const {
  setMood,
  updateEnergy,
  updateKnowledge,
  updateExperience,
  setLearning,
  setNewKnowledge,
  setCurrentSpell,
  updateLearningProgress,
  recordInteraction,
  addRecentTopic,
  addFavoriteModel,
  removeFavoriteModel,
  addLearnedConcept,
  setActiveEffect,
  clearEffect,
  setCurrentMessage,
  addMessageToQueue,
  processMessageQueue,
  setSpeaking,
  clearMessageQueue,
  updateAccuracy,
  updateUserSatisfaction,
  setPreferredModel,
  setPreferredResponseStyle,
  addPreferredTopic,
  removePreferredTopic,
  addAchievement,
  updateLevel,
  addExperiencePoints,
  rest,
  meditate,
  resetWizard,
  resetStats,
} = wizardSlice.actions;

export default wizardSlice.reducer;
