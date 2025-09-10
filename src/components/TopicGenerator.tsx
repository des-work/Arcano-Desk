import React, { useState } from 'react';
import { Sparkles, BookOpen, Lightbulb, Search, X, Wand2, Brain } from 'lucide-react';
import { useOllama } from '../hooks/useOllama';
import { useFiles } from '../hooks/useFiles';

interface TopicGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const TopicGenerator: React.FC<TopicGeneratorProps> = ({ isOpen, onClose }) => {
  const { generateTopic, suggestTopics, isLoading } = useOllama();
  const { files } = useFiles();
  
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'definition' | 'example' | 'explanation' | 'study_guide'>('definition');
  const [depth, setDepth] = useState<'brief' | 'detailed' | 'comprehensive'>('detailed');
  const [context, setContext] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    try {
      const content = await generateTopic(topic, type, depth, context || undefined);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Failed to generate topic:', error);
    }
  };

  const handleSuggestTopics = async () => {
    if (files.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      // Combine content from recent files
      const recentFiles = files.slice(-3);
      const combinedContent = recentFiles.map(f => f.content).join('\n\n');
      
      const topicSuggestions = await suggestTopics(combinedContent);
      setSuggestions(topicSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to suggest topics:', error);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setTopic(suggestion.topic);
    setType(suggestion.type);
    setShowSuggestions(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-purple-900/95 backdrop-blur-lg rounded-3xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                🔮 Knowledge Forge
              </h2>
              <p className="text-cyan-200/80 font-arcane text-lg">Generate magical insights on any topic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-purple-300 hover:text-white transition-colors duration-300 rounded-xl hover:bg-purple-500/20"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-arcane text-purple-300 mb-3">Topic to Explore</label>
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Machine Learning, Photosynthesis, World War II..."
                  className="w-full bg-slate-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white font-arcane placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-colors duration-300"
                />
                <Search className="absolute right-3 top-3 w-5 h-5 text-purple-400" />
              </div>
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-sm font-arcane text-purple-300 mb-3">Generation Type</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'definition', label: '📖 Definition', icon: BookOpen },
                  { value: 'example', label: '💡 Examples', icon: Lightbulb },
                  { value: 'explanation', label: '🔍 Explanation', icon: Search },
                  { value: 'study_guide', label: '📚 Study Guide', icon: Sparkles },
                ].map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setType(value as any)}
                    className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center space-x-2 ${
                      type === value
                        ? 'border-purple-400 bg-gradient-to-r from-purple-900/50 to-pink-900/50'
                        : 'border-purple-500/30 bg-slate-800/50 hover:border-purple-400/50'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-purple-300" />
                    <span className="text-sm font-arcane text-white">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Depth Selection */}
            <div>
              <label className="block text-sm font-arcane text-purple-300 mb-3">Detail Level</label>
              <div className="space-y-2">
                {[
                  { value: 'brief', label: 'Brief - Quick overview (2-3 paragraphs)', color: 'from-green-500 to-emerald-500' },
                  { value: 'detailed', label: 'Detailed - Comprehensive coverage (3-5 paragraphs)', color: 'from-blue-500 to-cyan-500' },
                  { value: 'comprehensive', label: 'Comprehensive - Expert-level depth (4-6 paragraphs)', color: 'from-purple-500 to-pink-500' },
                ].map(({ value, label, color }) => (
                  <button
                    key={value}
                    onClick={() => setDepth(value as any)}
                    className={`w-full p-3 rounded-xl border-2 transition-all duration-300 text-left ${
                      depth === value
                        ? `border-purple-400 bg-gradient-to-r ${color}`
                        : 'border-purple-500/30 bg-slate-800/50 hover:border-purple-400/50'
                    }`}
                  >
                    <span className="text-sm font-arcane text-white">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Context Input */}
            <div>
              <label className="block text-sm font-arcane text-purple-300 mb-3">Context (Optional)</label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Add context from your documents or specify what you're looking for..."
                rows={3}
                className="w-full bg-slate-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white font-arcane placeholder-purple-300/50 focus:border-purple-400 focus:outline-none transition-colors duration-300 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleSuggestTopics}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-arcane rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Wand2 className="w-4 h-4" />
                <span>Suggest Topics</span>
              </button>
              <button
                onClick={handleGenerate}
                disabled={!topic.trim() || isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>✨ Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="space-y-6">
            {/* Generated Content */}
            {generatedContent && (
              <div>
                <h3 className="text-lg font-wizard text-white mb-4 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span>Generated Knowledge</span>
                </h3>
                <div className="bg-slate-800/50 rounded-xl p-6 border border-purple-500/30 max-h-96 overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-white font-arcane text-sm leading-relaxed">
                      {generatedContent}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Topic Suggestions */}
            {showSuggestions && (
              <div>
                <h3 className="text-lg font-wizard text-white mb-4 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  <span>Suggested Topics</span>
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full p-4 bg-slate-800/50 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 text-left group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-arcane text-white group-hover:text-purple-300 transition-colors">
                          {suggestion.topic}
                        </h4>
                        <span className="text-xs text-purple-400 font-rune capitalize">
                          {suggestion.type}
                        </span>
                      </div>
                      <p className="text-sm text-purple-200/80 font-arcane">
                        {suggestion.reason}
                      </p>
                      <div className="mt-2 flex items-center space-x-2">
                        <div className="flex-1 bg-purple-900/30 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${suggestion.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-purple-300 font-arcane">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="mt-3 text-sm text-purple-400 hover:text-purple-300 font-arcane transition-colors duration-300"
                >
                  Hide suggestions
                </button>
              </div>
            )}

            {/* Empty State */}
            {!generatedContent && !showSuggestions && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-lg font-wizard text-white mb-2">Ready to Generate Knowledge</h3>
                <p className="text-purple-200/80 font-arcane text-sm">
                  Enter a topic above and let the wizard forge magical insights for you!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicGenerator;
