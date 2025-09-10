import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, CloudRain, Snowflake, Leaf, PawPrint, Brain } from 'lucide-react';

interface WizardProps {
  isLearning?: boolean;
  hasNewKnowledge?: boolean;
  onCastSpell?: () => void;
}

const Wizard: React.FC<WizardProps> = ({
  isLearning = false,
  hasNewKnowledge = false,
  onCastSpell
}) => {
  const [currentEffect, setCurrentEffect] = useState<string>('');
  const [isCasting, setIsCasting] = useState(false);

  const effects = [
    { name: 'lightning', icon: Zap, color: 'text-yellow-400', animation: 'animate-lightning' },
    { name: 'rain', icon: CloudRain, color: 'text-blue-400', animation: 'animate-rain-drop' },
    { name: 'snow', icon: Snowflake, color: 'text-white', animation: 'animate-snow-fall' },
    { name: 'plants', icon: Leaf, color: 'text-green-400', animation: 'animate-grow-plant' },
    { name: 'creatures', icon: PawPrint, color: 'text-purple-400', animation: 'animate-creature-appear' },
  ];

  const castRandomSpell = () => {
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    setCurrentEffect(randomEffect.name);
    setIsCasting(true);
    setTimeout(() => setIsCasting(false), 3000);

    if (onCastSpell) {
      onCastSpell();
    }
  };

  useEffect(() => {
    // Auto-cast spells occasionally to keep the wizard "alive"
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        castRandomSpell();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLearning || hasNewKnowledge) {
      setTimeout(castRandomSpell, 500);
    }
  }, [isLearning, hasNewKnowledge]);

  const currentEffectData = effects.find(e => e.name === currentEffect);

  return (
    <div className="relative flex flex-col items-center space-y-4">
      {/* Wizard Character */}
      <div className="relative">
        {/* Magical Aura */}
        <div className={`absolute inset-0 rounded-full border-4 border-purple-500/50 animate-magic-circle ${isCasting ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`} />

        {/* Wizard Body */}
        <div className="relative bg-gradient-to-b from-purple-900 to-purple-700 rounded-lg p-6 shadow-2xl border border-purple-400/30">
          {/* Wizard Hat */}
          <div className="relative mb-4">
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-purple-600 mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-6 h-3 bg-yellow-400 rounded-t-full"></div>
            <Sparkles className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-400 animate-sparkle" size={16} />
          </div>

          {/* Wizard Face */}
          <div className="text-center mb-4">
            <div className="text-4xl mb-2 animate-wizard-wiggle">🧙‍♂️</div>
            <div className="text-xs font-rune text-purple-200 tracking-wider">
              {isLearning ? 'LEARNING...' : hasNewKnowledge ? 'INSIGHT!' : 'READY'}
            </div>
          </div>

          {/* Wizard Robe */}
          <div className="text-center">
            <div className="text-2xl">👘</div>
            <div className="flex justify-center space-x-2 mt-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>

        {/* Active Spell Effect */}
        {isCasting && currentEffectData && (
          <div className={`absolute -top-8 left-1/2 transform -translate-x-1/2 ${currentEffectData.animation}`}>
            <currentEffectData.icon size={32} className={currentEffectData.color} />
          </div>
        )}
      </div>

      {/* Spell Book */}
      <div className="bg-gradient-to-b from-amber-900 to-amber-800 rounded-lg p-4 shadow-lg border border-amber-600/30">
        <div className="text-center font-rune text-amber-200 text-sm mb-2">SPELL BOOK</div>
        <div className="grid grid-cols-3 gap-2">
          {effects.map((effect, index) => (
            <button
              key={effect.name}
              onClick={() => {
                setCurrentEffect(effect.name);
                setIsCasting(true);
                setTimeout(() => setIsCasting(false), 3000);
                if (onCastSpell) onCastSpell();
              }}
              className={`p-2 rounded border-2 transition-all duration-200 hover:scale-110 ${
                currentEffect === effect.name && isCasting
                  ? 'border-yellow-400 bg-yellow-400/20 animate-pulse'
                  : 'border-amber-600/50 bg-amber-800/50 hover:border-amber-400'
              }`}
              title={`Cast ${effect.name} spell`}
            >
              <effect.icon size={16} className={effect.color} />
            </button>
          ))}
        </div>
      </div>

      {/* Wisdom Counter */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-full px-4 py-2 border border-purple-400/30">
        <div className="flex items-center space-x-2">
          <Brain size={16} className="text-purple-300" />
          <span className="font-arcane text-purple-200 text-sm">
            Wisdom: {Math.floor(Math.random() * 1000) + 500}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
