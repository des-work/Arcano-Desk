/**
 * Animation Demo Route
 * Interactive demo for testing animation engine features
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Sun, Moon, Star } from 'lucide-react';
import { useTimeTheme } from '../../utils/timeTheme';
import { useSessionMode } from '../../utils/sessionMode';
import { useWizardProgress } from '../../state/wizardProgress';
import { VictoryReveal, VICTORY_CARDS } from '../../reveal/VictoryReveal';
import { FriendlyFail } from '../../errors/FriendlyFail';

export const AnimationDemo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(12); // 12 PM for testing
  const [wizardTier, setWizardTier] = useState(1);
  const [fadeMode, setFadeMode] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showError, setShowError] = useState(false);
  const [particleCount, setParticleCount] = useState(150);

  const { currentTheme } = useTimeTheme();
  const { fadeMode: sessionFadeMode, enableFadeMode, disableFadeMode } = useSessionMode();
  const { processContent, currentTier } = useWizardProgress();

  // Simulate time changes
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => (prev + 1) % 24);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Update wizard tier
  useEffect(() => {
    if (wizardTier !== currentTier) {
      setWizardTier(currentTier);
    }
  }, [currentTier, wizardTier]);

  const handleTimeChange = (hour: number) => {
    setCurrentTime(hour);
    // Force theme update
    const store = useTimeTheme.getState();
    store.updateTheme();
  };

  const handleWizardTierChange = (tier: number) => {
    setWizardTier(tier);
    // Simulate content processing to reach tier
    const words = tier * 5000;
    const pages = tier * 20;
    const diversity = tier * 0.2;
    processContent(words, pages, diversity);
  };

  const handleFadeModeToggle = () => {
    if (fadeMode) {
      disableFadeMode();
    } else {
      enableFadeMode();
    }
    setFadeMode(!fadeMode);
  };

  const triggerVictory = () => {
    setShowVictory(true);
  };

  const triggerError = () => {
    setShowError(true);
  };

  const getTimeOfDay = (hour: number) => {
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Day';
    if (hour >= 18 && hour < 22) return 'Evening';
    return 'Night';
  };

  const timeOfDay = getTimeOfDay(currentTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
          🎭 Animation Engine Demo
        </h1>
        <p className="text-purple-200/80 text-lg">
          Test the new animation engine features and visual effects
        </p>
      </div>

      {/* Demo Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Time of Day Controls */}
        <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-wizard text-purple-200 mb-4 flex items-center gap-2">
            <Sun className="w-5 h-5" />
            Time of Day Theme
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-purple-300">Current Time:</span>
              <span className="text-yellow-400 font-mono text-lg">
                {currentTime.toString().padStart(2, '0')}:00
              </span>
              <span className="text-purple-200/80">({timeOfDay})</span>
            </div>

            <div className="flex gap-2">
              {[6, 12, 18, 22].map(hour => (
                <button
                  key={hour}
                  onClick={() => handleTimeChange(hour)}
                  className={`px-4 py-2 rounded-lg text-sm font-wizard transition-all duration-300 ${
                    currentTime === hour
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'bg-purple-700/50 text-purple-300 hover:bg-purple-600/50'
                  }`}
                >
                  {hour}:00
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-wizard rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 flex items-center gap-2"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                {isPlaying ? 'Pause' : 'Play'} Time
              </button>
            </div>
          </div>
        </div>

        {/* Wizard Tier Controls */}
        <div className="bg-gradient-to-br from-cyan-800/30 to-blue-800/30 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/20">
          <h3 className="text-xl font-wizard text-cyan-200 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Wizard Tier System
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-cyan-300">Current Tier:</span>
              <span className="text-yellow-400 font-wizard text-lg">
                Tier {wizardTier}
              </span>
            </div>

            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map(tier => (
                <button
                  key={tier}
                  onClick={() => handleWizardTierChange(tier)}
                  className={`px-3 py-2 rounded-lg text-sm font-wizard transition-all duration-300 ${
                    wizardTier === tier
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                      : 'bg-cyan-700/50 text-cyan-300 hover:bg-cyan-600/50'
                  }`}
                >
                  T{tier}
                </button>
              ))}
            </div>

            <div className="text-cyan-300/70 text-sm">
              Unlock new magic types and visual effects as you progress!
            </div>
          </div>
        </div>

        {/* Fade Mode Controls */}
        <div className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
          <h3 className="text-xl font-wizard text-green-200 mb-4 flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Session Mode
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-green-300">Fade Mode:</span>
              <span className={`font-wizard ${fadeMode ? 'text-yellow-400' : 'text-green-400'}`}>
                {fadeMode ? 'Active' : 'Inactive'}
              </span>
            </div>

            <button
              onClick={handleFadeModeToggle}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-wizard rounded-lg hover:from-green-500 hover:to-emerald-500 transition-all duration-300"
            >
              Toggle Fade Mode
            </button>

            <div className="text-green-300/70 text-sm">
              Fade mode reduces particle count and quality for long sessions
            </div>
          </div>
        </div>

        {/* Particle Controls */}
        <div className="bg-gradient-to-br from-pink-800/30 to-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-pink-500/20">
          <h3 className="text-xl font-wizard text-pink-200 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Particle Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-pink-300">Particle Count:</span>
              <span className="text-yellow-400 font-mono">
                {particleCount}
              </span>
            </div>

            <input
              type="range"
              min="50"
              max="500"
              value={particleCount}
              onChange={(e) => setParticleCount(Number(e.target.value))}
              className="w-full h-2 bg-pink-700/50 rounded-lg appearance-none cursor-pointer"
            />

            <div className="text-pink-300/70 text-sm">
              Adjust particle density for performance testing
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center mb-8">
        <div className="flex gap-4 justify-center">
          <button
            onClick={triggerVictory}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-wizard rounded-lg hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-yellow-500/30"
          >
            🎉 Trigger Victory Reveal
          </button>

          <button
            onClick={triggerError}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-wizard rounded-lg hover:from-red-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-red-500/30"
          >
            💥 Trigger Error Animation
          </button>
        </div>
      </div>

      {/* Current Theme Display */}
      <div className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20 mb-8">
        <h3 className="text-xl font-wizard text-indigo-200 mb-4">
          Current Theme Properties
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-indigo-300 text-sm">Base Hue</div>
            <div className="text-yellow-400 font-mono">{currentTheme.baseHue}°</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-indigo-300 text-sm">Accent Hue</div>
            <div className="text-yellow-400 font-mono">{currentTheme.accentHue}°</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-indigo-300 text-sm">Bloom Threshold</div>
            <div className="text-yellow-400 font-mono">{currentTheme.bloomThreshold}</div>
          </div>
          <div className="bg-black/20 rounded-lg p-3">
            <div className="text-indigo-300 text-sm">Fog Density</div>
            <div className="text-yellow-400 font-mono">{currentTheme.fog.density}</div>
          </div>
        </div>
      </div>

      {/* Victory Reveal */}
      <VictoryReveal
        show={showVictory}
        cards={[
          VICTORY_CARDS.documentProcessed,
          VICTORY_CARDS.summaryGenerated,
          VICTORY_CARDS.wizardLevelUp,
          VICTORY_CARDS.achievementUnlocked,
        ]}
        onComplete={() => setShowVictory(false)}
        duration={6}
        title="Demo Victory!"
        subtitle="Testing the victory reveal system"
      />

      {/* Error Animation */}
      <FriendlyFail
        show={showError}
        error="Demo error for testing the friendly fail system"
        onRetry={() => setShowError(false)}
        onDismiss={() => setShowError(false)}
        duration={1200}
      />
    </div>
  );
};

export default AnimationDemo;
