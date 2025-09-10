import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Zap, 
  Save, 
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useOllama } from '../contexts/OllamaContext.tsx';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { 
    isConnected, 
    models, 
    currentModel, 
    setCurrentModel, 
    connect, 
    isLoading 
  } = useOllama();
  
  const [settings, setSettings] = useState({
    model: currentModel,
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 2048,
    autoConnect: true,
    theme: 'retro',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('arcano-desk-settings');
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
  }, []);

  useEffect(() => {
    setSettings(prev => ({ ...prev, model: currentModel }));
  }, [currentModel]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('arcano-desk-settings', JSON.stringify(settings));
      
      // Update Ollama model if changed
      if (settings.model !== currentModel) {
        setCurrentModel(settings.model);
      }
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    const success = await connect();
    if (success) {
      toast.success('Connection successful!');
    } else {
      toast.error('Connection failed. Please check if Ollama is running.');
    }
  };

  const handleResetSettings = () => {
    setSettings({
      model: 'llama2',
      temperature: 0.7,
      topP: 0.9,
      maxTokens: 2048,
      autoConnect: true,
      theme: 'retro',
    });
    toast.success('Settings reset to defaults');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <SettingsIcon className="w-8 h-8 text-neon-purple animate-pulse-neon" />
          <h1 className="text-3xl font-pixel text-transparent bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text neon-glow">
            Settings
          </h1>
          <Zap className="w-8 h-8 text-neon-yellow animate-bounce-slow" />
        </div>
        <p className="text-gray-400 font-arcade">Configure your magical study assistant</p>
      </div>

      {/* Connection Status */}
      <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-cyan/30">
        <h2 className="text-xl font-pixel text-neon-cyan mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <span>AI Connection</span>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isConnected ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <p className="font-arcade text-white">
                  Ollama Status: {isConnected ? 'Connected' : 'Disconnected'}
                </p>
                <p className="text-sm text-gray-400">
                  {isConnected ? 'AI models are ready to use' : 'Please start Ollama to use AI features'}
                </p>
              </div>
            </div>
            
            <button
              onClick={handleTestConnection}
              disabled={isLoading}
              className="px-4 py-2 bg-neon-cyan/20 text-neon-cyan font-arcade rounded border border-neon-cyan/50 hover:bg-neon-cyan/30 transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Test Connection</span>
            </button>
          </div>

          {!isConnected && (
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                <div>
                  <h3 className="font-arcade text-red-400 mb-2">Ollama Not Running</h3>
                  <p className="text-sm text-red-300 mb-3">
                    To use AI features, you need to have Ollama running on your system.
                  </p>
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>1. Install Ollama from <a href="https://ollama.ai" className="text-neon-cyan hover:underline">ollama.ai</a></p>
                    <p>2. Run: <code className="bg-arcade-bg px-2 py-1 rounded text-neon-yellow">ollama serve</code></p>
                    <p>3. Pull a model: <code className="bg-arcade-bg px-2 py-1 rounded text-neon-yellow">ollama pull llama2</code></p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Model Settings */}
      <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-purple/30">
        <h2 className="text-xl font-pixel text-neon-purple mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <span>AI Model Settings</span>
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 font-arcade mb-2">Model</label>
            <select
              value={settings.model}
              onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
              className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none"
            >
              {models.length > 0 ? (
                models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))
              ) : (
                <option value="llama2">llama2 (default)</option>
              )}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Available models: {models.length > 0 ? models.join(', ') : 'None detected'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 font-arcade mb-2">
                Temperature: {settings.temperature}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <p className="text-xs text-gray-400 mt-1">Controls randomness (0 = deterministic, 1 = creative)</p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 font-arcade mb-2">
                Top P: {settings.topP}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.topP}
                onChange={(e) => setSettings(prev => ({ ...prev, topP: parseFloat(e.target.value) }))}
                className="w-full"
              />
              <p className="text-xs text-gray-400 mt-1">Controls diversity of responses</p>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 font-arcade mb-2">
              Max Tokens: {settings.maxTokens}
            </label>
            <input
              type="range"
              min="512"
              max="4096"
              step="256"
              value={settings.maxTokens}
              onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">Maximum length of AI responses</p>
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-pink/30">
        <h2 className="text-xl font-pixel text-neon-pink mb-4 flex items-center space-x-2">
          <SettingsIcon className="w-5 h-5" />
          <span>General Settings</span>
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-arcade text-white">Auto-connect to Ollama</p>
              <p className="text-sm text-gray-400">Automatically try to connect to Ollama on startup</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoConnect}
                onChange={(e) => setSettings(prev => ({ ...prev, autoConnect: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neon-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-purple"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm text-gray-400 font-arcade mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full bg-arcade-bg border border-neon-pink/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-pink focus:outline-none"
            >
              <option value="retro">Retro Arcade</option>
              <option value="dark">Dark Mode</option>
              <option value="light">Light Mode</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-arcade rounded-lg hover:from-neon-pink hover:to-neon-purple transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
        
        <button
          onClick={handleResetSettings}
          className="flex-1 px-6 py-3 bg-gray-600 text-white font-arcade rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center justify-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* About */}
      <div className="bg-arcade-bg/30 rounded-lg p-6 border border-neon-green/30">
        <h2 className="text-xl font-pixel text-neon-green mb-4">About Arcano Desk</h2>
        <div className="space-y-2 text-sm text-gray-300">
          <p>Version: 1.0.0</p>
          <p>Built with React, TypeScript, and Tailwind CSS</p>
          <p>AI powered by Ollama with local models</p>
          <p>Designed with a retro arcade magic theme</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
