import React, { useState } from 'react';
import { Check, Zap, Brain, Crown, Settings, Info } from 'lucide-react';
import { useOllama } from '../contexts/OllamaContext';
import { AVAILABLE_MODELS } from '../utils/contentAnalyzer';

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ isOpen, onClose }) => {
  const { models, currentModel, setCurrentModel, getModelInfo } = useOllama();
  const [selectedModel, setSelectedModel] = useState(currentModel);

  if (!isOpen) return null;

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
  };

  const handleConfirm = () => {
    setCurrentModel(selectedModel);
    onClose();
  };

  const getModelIcon = (modelName: string) => {
    if (modelName.includes('2b') || modelName.includes('mini')) return <Zap className="w-5 h-5 text-yellow-400" />;
    if (modelName.includes('13b') || modelName.includes('20b')) return <Crown className="w-5 h-5 text-purple-400" />;
    return <Brain className="w-5 h-5 text-blue-400" />;
  };

  const getModelSize = (modelName: string) => {
    const modelInfo = getModelInfo(modelName);
    return modelInfo?.size || 'Unknown';
  };

  const getModelCapabilities = (modelName: string) => {
    const modelInfo = getModelInfo(modelName);
    return modelInfo?.bestFor || [];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                🧙‍♂️ Wizard's Model Forge
              </h2>
              <p className="text-purple-200/80 font-arcane text-lg">Choose your AI companion's power level</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-purple-300 hover:text-white transition-colors duration-300 rounded-xl hover:bg-purple-500/20"
          >
            ✕
          </button>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {AVAILABLE_MODELS.map((model) => {
            const isAvailable = models.includes(model.name);
            const isSelected = selectedModel === model.name;
            const isCurrent = currentModel === model.name;

            return (
              <div
                key={model.name}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'border-purple-400 bg-gradient-to-br from-purple-900/50 to-pink-900/50 shadow-xl shadow-purple-500/30'
                    : isAvailable
                    ? 'border-purple-500/30 bg-slate-800/50 hover:border-purple-400/50 hover:bg-slate-800/70'
                    : 'border-gray-600/30 bg-gray-800/30 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => isAvailable && handleModelSelect(model.name)}
              >
                {/* Current Model Badge */}
                {isCurrent && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-arcane">
                    Active
                  </div>
                )}

                {/* Model Header */}
                <div className="flex items-center space-x-4 mb-4">
                  {getModelIcon(model.name)}
                  <div className="flex-1">
                    <h3 className="text-xl font-wizard text-white mb-1">{model.name}</h3>
                    <p className="text-purple-300/80 font-arcane text-sm">{model.size}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-6 h-6 text-green-400" />
                  )}
                </div>

                {/* Model Capabilities */}
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-arcane text-purple-300 mb-2">Best For:</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.bestFor.map((capability, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-800/50 text-purple-200 text-xs rounded-full border border-purple-500/30"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-arcane text-purple-300 mb-2">Context Window:</h4>
                    <p className="text-white/80 text-sm">{model.contextWindow.toLocaleString()} tokens</p>
                  </div>
                </div>

                {/* Availability Status */}
                <div className="mt-4 pt-4 border-t border-purple-500/20">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className={`text-sm font-arcane ${isAvailable ? 'text-green-300' : 'text-red-300'}`}>
                      {isAvailable ? 'Available' : 'Not Installed'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Model Info Panel */}
        {selectedModel && (
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-purple-500/30 mb-6">
            <div className="flex items-start space-x-4">
              <Info className="w-6 h-6 text-cyan-400 mt-1" />
              <div>
                <h3 className="text-lg font-wizard text-white mb-2">Wizard's Analysis</h3>
                <p className="text-purple-200/80 font-arcane text-sm">
                  {selectedModel === 'gemma2:2b' && "Lightning-fast responses for simple tasks. Perfect for quick definitions and basic summaries."}
                  {selectedModel === 'phi3:mini' && "Balanced performance for most study tasks. Great for medium-length content and structured explanations."}
                  {selectedModel === 'phi3:latest' && "Enhanced capabilities for detailed analysis. Excellent for comprehensive summaries and topic generation."}
                  {selectedModel === 'llama2:latest' && "Reliable performance for complex content. Good for academic papers and detailed study materials."}
                  {selectedModel === 'gemma2:latest' && "Advanced analysis capabilities. Perfect for dense content and creative study guides."}
                  {selectedModel === 'wizardlm-uncensored:13b' && "Exceptional understanding and creativity. Ideal for complex academic content and detailed explanations."}
                  {selectedModel === 'gpt-oss:20b' && "Maximum power for the most challenging content. Best for comprehensive analysis and expert-level explanations."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700/50 text-slate-300 font-arcane rounded-xl hover:bg-slate-600/50 transition-colors duration-300"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!models.includes(selectedModel)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/30"
          >
            ✨ Enchant Wizard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModelSelector;
