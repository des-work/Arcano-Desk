import React from 'react';

type LayoutPhase = 'upload' | 'library' | 'summary' | 'idle';

interface SimpleDynamicLayoutProps {
  children: React.ReactNode;
  currentPhase: LayoutPhase;
  onPhaseChange: (phase: LayoutPhase) => void;
}

export const SimpleDynamicLayout: React.FC<SimpleDynamicLayoutProps> = ({
  children,
  currentPhase,
  onPhaseChange
}) => {
  return (
    <div className="relative w-full h-full">
      {/* Phase Navigation */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2 bg-black/20 backdrop-blur-sm rounded-full p-2 border border-purple-500/30">
          {(['upload', 'library', 'summary'] as LayoutPhase[]).map((phase) => (
            <button
              key={phase}
              onClick={() => onPhaseChange(phase)}
              className={`px-4 py-2 rounded-full text-sm font-wizard transition-all duration-300 ${
                currentPhase === phase
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-300 hover:text-white hover:bg-purple-500/30'
              }`}
            >
              {phase === 'upload' && '📁 Upload'}
              {phase === 'library' && '📚 Library'}
              {phase === 'summary' && '✨ Summary'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full pt-20">
        {children}
      </div>

      {/* Floating Wizard */}
      <div className="absolute bottom-4 right-4 z-30">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-purple-500/50 transition-all duration-300 cursor-pointer transform hover:scale-110">
          <span className="text-2xl">🧙‍♂️</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleDynamicLayout;
