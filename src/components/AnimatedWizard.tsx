import React from 'react';
import { WizardAnimations } from '../animations';
import { useWizard } from '../hooks/useWizard';

interface AnimatedWizardProps {
  className?: string;
  onSpellComplete?: () => void;
}

export const AnimatedWizard: React.FC<AnimatedWizardProps> = ({
  className = '',
  onSpellComplete
}) => {
  const { 
    mood, 
    isLearning, 
    hasNewKnowledge, 
    currentSpell,
    energy,
    knowledge,
    experience,
    level
  } = useWizard();

  return (
    <div className={`relative ${className}`}>
      {/* Wizard Character with Animations */}
      <WizardAnimations
        isLearning={isLearning}
        hasNewKnowledge={hasNewKnowledge}
        currentSpell={currentSpell}
        mood={mood}
        onSpellComplete={onSpellComplete}
      />
      
      {/* Wizard Stats Display */}
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
        {/* Level Badge */}
        <div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-wizard mb-2">
          <span className="mr-1">🧙‍♂️</span>
          Level {level}
        </div>
        
        {/* Stats Bars */}
        <div className="flex space-x-2 text-xs">
          {/* Energy */}
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⚡</span>
            <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                style={{ width: `${energy}%` }}
              />
            </div>
          </div>
          
          {/* Knowledge */}
          <div className="flex items-center space-x-1">
            <span className="text-blue-400">📚</span>
            <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${knowledge}%` }}
              />
            </div>
          </div>
          
          {/* Experience */}
          <div className="flex items-center space-x-1">
            <span className="text-green-400">⭐</span>
            <div className="w-12 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${experience}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedWizard;
