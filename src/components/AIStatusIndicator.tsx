import React, { useState } from 'react';
import { useRobustOllama } from '../contexts/RobustOllamaContext.tsx';

interface AIStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { 
    isConnected, 
    isLoading, 
    connectionStatus, 
    currentModel, 
    models, 
    reconnect, 
    getConnectionInfo 
  } = useRobustOllama();
  
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);

  const handleReconnect = async () => {
    setIsReconnecting(true);
    try {
      await reconnect();
    } catch (error) {
      console.error('Reconnection failed:', error);
    } finally {
      setIsReconnecting(false);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return '🤖';
      case 'connecting': return '⏳';
      case 'error': return '⚠️';
      default: return '❌';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'AI Connected';
      case 'connecting': return 'Connecting...';
      case 'error': return 'AI Unavailable';
      default: return 'AI Disconnected';
    }
  };

  const connectionInfo = getConnectionInfo();

  return (
    <div className={`ai-status-indicator ${className}`}>
      {/* Compact Status */}
      <div className="flex items-center gap-2">
        <span className="text-lg">{getStatusIcon()}</span>
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {currentModel && (
          <span className="text-xs text-gray-400">
            ({currentModel.name})
          </span>
        )}
      </div>

      {/* Detailed Status */}
      {showDetails && (
        <div className="mt-3 space-y-3">
          {/* Connection Details */}
          <div className="bg-gray-800/50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">Connection Details</h4>
            <div className="space-y-1 text-xs text-gray-400">
              <div>Status: <span className={getStatusColor()}>{connectionInfo.status}</span></div>
              <div>Model: <span className="text-gray-300">{connectionInfo.model}</span></div>
              <div>Available Models: <span className="text-gray-300">{connectionInfo.modelsCount}</span></div>
            </div>
          </div>

          {/* Available Models */}
          {models.length > 0 && (
            <div className="bg-gray-800/50 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Available Models</h4>
              <div className="space-y-1">
                {models.map((model) => (
                  <div 
                    key={model.id} 
                    className={`text-xs p-2 rounded ${
                      model.name === currentModel?.name 
                        ? 'bg-blue-600/30 text-blue-300' 
                        : 'bg-gray-700/30 text-gray-400'
                    }`}
                  >
                    <div className="font-medium">{model.name}</div>
                    <div className="text-gray-500">{model.size}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleReconnect}
              disabled={isReconnecting || isLoading}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white text-xs rounded transition-colors"
            >
              {isReconnecting ? 'Reconnecting...' : 'Reconnect'}
            </button>
            
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
            >
              {showModelSelector ? 'Hide Models' : 'Show Models'}
            </button>
          </div>

          {/* Installation Guide */}
          {!isConnected && (
            <div className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
              <h4 className="text-sm font-semibold text-amber-300 mb-2">Setup AI</h4>
              <div className="text-xs text-amber-200 space-y-1">
                <p>1. Install Ollama from <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="text-amber-300 hover:text-amber-200 underline">ollama.ai</a></p>
                <p>2. Download a model: <code className="bg-gray-700 px-1 rounded">ollama pull phi3:mini</code></p>
                <p>3. Start Ollama: <code className="bg-gray-700 px-1 rounded">ollama serve</code></p>
                <p>4. Click "Reconnect" above</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIStatusIndicator;