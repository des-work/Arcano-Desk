/**
 * AI Status Indicator
 * Real-time AI connection status and model information
 */

import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Loader, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Cpu,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useRobustOllama } from '../contexts/RobustOllamaContext.tsx';

export interface AIStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  className = '',
  showDetails = true
}) => {
  const { 
    isConnected, 
    isLoading, 
    models, 
    currentModel, 
    connectionStatus, 
    connect, 
    testConnection 
  } = useRobustOllama();

  const [isTesting, setIsTesting] = useState(false);
  const [lastTested, setLastTested] = useState<Date | null>(null);

  // Auto-test connection every 30 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!isLoading) {
        await testConnection();
        setLastTested(new Date());
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isLoading, testConnection]);

  const handleReconnect = async () => {
    setIsTesting(true);
    try {
      await connect();
      setLastTested(new Date());
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusIcon = () => {
    if (isLoading || isTesting) {
      return <Loader className="w-4 h-4 animate-spin text-blue-400" />;
    }
    
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'connecting':
        return <Loader className="w-4 h-4 animate-spin text-yellow-400" />;
      default:
        return <WifiOff className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    if (isLoading || isTesting) {
      return 'Testing Connection...';
    }
    
    switch (connectionStatus) {
      case 'connected':
        return `Connected (${currentModel?.name || 'No Model'})`;
      case 'error':
        return 'Connection Failed';
      case 'connecting':
        return 'Connecting...';
      default:
        return 'Disconnected';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'connecting':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Status */}
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <span className={`font-medium ${getStatusColor()}`}>
          {getStatusText()}
        </span>
        {connectionStatus === 'error' && (
          <button
            onClick={handleReconnect}
            disabled={isTesting}
            className="p-1 text-purple-400 hover:text-purple-300 transition-colors disabled:opacity-50"
            title="Reconnect"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="space-y-2 text-sm">
          {/* Model Information */}
          {currentModel && (
            <div className="flex items-center gap-2 text-purple-300/70">
              <Cpu className="w-3 h-3" />
              <span>{currentModel.name}</span>
              <span className="text-purple-400/50">•</span>
              <span>{currentModel.size}</span>
            </div>
          )}

          {/* Available Models Count */}
          {models.length > 0 && (
            <div className="flex items-center gap-2 text-purple-300/70">
              <Zap className="w-3 h-3" />
              <span>{models.length} model{models.length > 1 ? 's' : ''} available</span>
            </div>
          )}

          {/* Last Tested */}
          {lastTested && (
            <div className="text-purple-400/50 text-xs">
              Last tested: {lastTested.toLocaleTimeString()}
            </div>
          )}

          {/* Connection Details */}
          <div className="text-purple-400/50 text-xs">
            Ollama API: localhost:11434
          </div>
        </div>
      )}

      {/* Model Selection (if multiple models available) */}
      {showDetails && models.length > 1 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-purple-200">Available Models:</div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {models.map((model) => (
              <div
                key={model.id}
                className={`flex items-center justify-between p-2 rounded text-xs ${
                  currentModel?.id === model.id
                    ? 'bg-purple-600/30 border border-purple-400/50'
                    : 'bg-black/20 border border-purple-400/20'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3" />
                  <span className="text-purple-200">{model.name}</span>
                </div>
                <div className="text-purple-400/70">{model.size}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStatusIndicator;
