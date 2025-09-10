import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
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
  addLearnedConcept,
  setActiveEffect,
  addAchievement,
  addExperiencePoints,
  rest,
  meditate
} from '../store/slices/wizardSlice';

export const useWizard = () => {
  const dispatch = useAppDispatch();
  const {
    mood,
    energy,
    knowledge,
    experience,
    isLearning,
    hasNewKnowledge,
    currentSpell,
    learningProgress,
    lastActivity,
    totalInteractions,
    successfulSpells,
    failedSpells,
    recentTopics,
    favoriteModels,
    learnedConcepts,
    activeEffect,
    effectIntensity,
    effectDuration,
    currentMessage,
    messageQueue,
    isSpeaking,
    averageResponseTime,
    accuracy,
    userSatisfaction,
    preferredModel,
    preferredResponseStyle,
    preferredTopics,
    achievements,
    level,
    experiencePoints
  } = useAppSelector((state) => state.wizard);

  // Mood management
  const changeMood = useCallback((newMood: typeof mood) => {
    dispatch(setMood(newMood));
  }, [dispatch]);

  // Energy management
  const updateEnergyLevel = useCallback((amount: number) => {
    dispatch(updateEnergy(energy + amount));
  }, [dispatch, energy]);

  // Knowledge management
  const updateKnowledgeLevel = useCallback((amount: number) => {
    dispatch(updateKnowledge(knowledge + amount));
  }, [dispatch, knowledge]);

  // Experience management
  const updateExperienceLevel = useCallback((amount: number) => {
    dispatch(updateExperience(experience + amount));
  }, [dispatch, experience]);

  // Learning state
  const startLearning = useCallback(() => {
    dispatch(setLearning(true));
  }, [dispatch]);

  const stopLearning = useCallback(() => {
    dispatch(setLearning(false));
  }, [dispatch]);

  const gainKnowledge = useCallback((concept: string) => {
    dispatch(setNewKnowledge(true));
    dispatch(addLearnedConcept(concept));
    dispatch(updateKnowledge(knowledge + 5));
    dispatch(addExperiencePoints(10));
    
    // Auto-stop new knowledge state after 3 seconds
    setTimeout(() => {
      dispatch(setNewKnowledge(false));
    }, 3000);
  }, [dispatch, knowledge]);

  // Spell casting
  const castSpell = useCallback((spellName: string) => {
    dispatch(setCurrentSpell(spellName));
    
    // Auto-clear spell after 5 seconds
    setTimeout(() => {
      dispatch(setCurrentSpell(''));
    }, 5000);
  }, [dispatch]);

  // Learning progress
  const updateProgress = useCallback((progress: number) => {
    dispatch(updateLearningProgress(progress));
  }, [dispatch]);

  // Interaction tracking
  const logInteraction = useCallback((success: boolean, responseTime: number) => {
    dispatch(recordInteraction({ success, responseTime }));
  }, [dispatch]);

  // Topic management
  const addTopic = useCallback((topic: string) => {
    dispatch(addRecentTopic(topic));
  }, [dispatch]);

  // Effect management
  const triggerEffect = useCallback((effect: string, intensity: 'low' | 'medium' | 'high' = 'medium', duration: number = 3000) => {
    dispatch(setActiveEffect({ effect, intensity, duration }));
  }, [dispatch]);

  // Achievement system
  const unlockAchievement = useCallback((achievement: string) => {
    dispatch(addAchievement(achievement));
  }, [dispatch]);

  const addXP = useCallback((amount: number) => {
    dispatch(addExperiencePoints(amount));
  }, [dispatch]);

  // Rest and recovery
  const takeRest = useCallback(() => {
    dispatch(rest());
  }, [dispatch]);

  const meditate = useCallback(() => {
    dispatch(meditate());
  }, [dispatch]);

  // Computed values
  const isTired = energy < 30;
  const isExcited = mood === 'excited' || mood === 'proud';
  const isFocused = mood === 'focused' || mood === 'thinking';
  const isSleeping = mood === 'sleeping';
  const isConfused = mood === 'confused';

  const canCastSpell = energy > 20 && !isSleeping;
  const canLearn = energy > 10 && !isSleeping;
  const needsRest = energy < 20;

  const performanceRating = Math.round((accuracy + userSatisfaction) / 2);
  const isHighPerformer = performanceRating > 85;
  const isStruggling = performanceRating < 60;

  const recentActivity = lastActivity ? Date.now() - lastActivity : 0;
  const isActive = recentActivity < 300000; // 5 minutes

  const successRate = totalInteractions > 0 ? (successfulSpells / totalInteractions) * 100 : 0;
  const isReliable = successRate > 80;

  // Auto-behaviors based on state
  const autoBehaviors = {
    // Auto-rest when energy is low
    shouldRest: needsRest && !isLearning,
    
    // Auto-meditate when confused
    shouldMeditate: isConfused && energy > 30,
    
    // Auto-celebrate when performing well
    shouldCelebrate: isHighPerformer && !isExcited,
    
    // Auto-focus when struggling
    shouldFocus: isStruggling && !isFocused
  };

  return {
    // State
    mood,
    energy,
    knowledge,
    experience,
    isLearning,
    hasNewKnowledge,
    currentSpell,
    learningProgress,
    lastActivity,
    totalInteractions,
    successfulSpells,
    failedSpells,
    recentTopics,
    favoriteModels,
    learnedConcepts,
    activeEffect,
    effectIntensity,
    effectDuration,
    currentMessage,
    messageQueue,
    isSpeaking,
    averageResponseTime,
    accuracy,
    userSatisfaction,
    preferredModel,
    preferredResponseStyle,
    preferredTopics,
    achievements,
    level,
    experiencePoints,
    
    // Actions
    changeMood,
    updateEnergyLevel,
    updateKnowledgeLevel,
    updateExperienceLevel,
    startLearning,
    stopLearning,
    gainKnowledge,
    castSpell,
    updateProgress,
    logInteraction,
    addTopic,
    triggerEffect,
    unlockAchievement,
    addXP,
    takeRest,
    meditate,
    
    // Computed
    isTired,
    isExcited,
    isFocused,
    isSleeping,
    isConfused,
    canCastSpell,
    canLearn,
    needsRest,
    performanceRating,
    isHighPerformer,
    isStruggling,
    isActive,
    successRate,
    isReliable,
    autoBehaviors
  };
};
