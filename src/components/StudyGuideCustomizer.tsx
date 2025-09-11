/**
 * Study Guide Customizer
 * Fast, intuitive customization interface for AI-generated study guides
 */

import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Type, 
  Layout, 
  Sparkles, 
  Eye, 
  Settings, 
  Wand2,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { StudyGuideSection } from './StreamlinedStudyGuideGenerator.tsx';

export interface StudyGuideCustomizerProps {
  studyGuide: StudyGuideSection[];
  onCustomize: (customizedGuide: StudyGuideSection[], settings: CustomizationSettings) => void;
  onGenerate: (finalGuide: StudyGuideSection[]) => void;
  className?: string;
}

export interface CustomizationSettings {
  style: 'academic' | 'casual' | 'creative' | 'technical' | 'minimal';
  colorScheme: 'default' | 'academic' | 'colorful' | 'minimal' | 'magical' | 'dark' | 'neon';
  format: 'outline' | 'detailed' | 'summary' | 'flashcards';
  includeExamples: boolean;
  includeQuestions: boolean;
  highlightKeywords: boolean;
  boldHeadings: boolean;
}

const STYLE_OPTIONS = [
  { id: 'academic', name: 'Academic', icon: '📚', description: 'Formal, structured approach' },
  { id: 'casual', name: 'Casual', icon: '😊', description: 'Friendly, conversational tone' },
  { id: 'creative', name: 'Creative', icon: '🎨', description: 'Visual, engaging format' },
  { id: 'technical', icon: '⚙️', name: 'Technical', description: 'Precise, detailed analysis' },
  { id: 'minimal', name: 'Minimal', icon: '✨', description: 'Clean, simple design' }
];

const COLOR_SCHEMES = [
  { id: 'magical', name: 'Magical', preview: 'bg-gradient-to-r from-purple-500 to-pink-500' },
  { id: 'academic', name: 'Academic', preview: 'bg-gradient-to-r from-blue-500 to-indigo-500' },
  { id: 'colorful', name: 'Colorful', preview: 'bg-gradient-to-r from-green-500 to-cyan-500' },
  { id: 'minimal', name: 'Minimal', preview: 'bg-gradient-to-r from-gray-500 to-gray-600' },
  { id: 'dark', name: 'Dark', preview: 'bg-gradient-to-r from-gray-800 to-black' },
  { id: 'neon', name: 'Neon', preview: 'bg-gradient-to-r from-green-400 to-blue-400' }
];

const FORMAT_OPTIONS = [
  { id: 'outline', name: 'Outline', icon: '📋', description: 'Structured bullet points' },
  { id: 'detailed', name: 'Detailed', icon: '📖', description: 'Comprehensive explanations' },
  { id: 'summary', name: 'Summary', icon: '📝', description: 'Concise key points' },
  { id: 'flashcards', name: 'Flashcards', icon: '🃏', description: 'Quick review format' }
];

export const StudyGuideCustomizer: React.FC<StudyGuideCustomizerProps> = ({
  studyGuide,
  onCustomize,
  onGenerate,
  className = '',
}) => {
  const [settings, setSettings] = useState<CustomizationSettings>({
    style: 'academic',
    colorScheme: 'magical',
    format: 'detailed',
    includeExamples: true,
    includeQuestions: true,
    highlightKeywords: true,
    boldHeadings: true,
  });

  const [previewMode, setPreviewMode] = useState<'settings' | 'preview'>('settings');
  const [isGenerating, setIsGenerating] = useState(false);

  // Auto-apply settings when they change
  useEffect(() => {
    onCustomize(studyGuide, settings);
  }, [settings, studyGuide, onCustomize]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    onGenerate(studyGuide);
    setIsGenerating(false);
  };

  const updateSetting = <K extends keyof CustomizationSettings>(
    key: K,
    value: CustomizationSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="text-6xl mb-4">🎨</div>
        <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-4">
          Customize Your Study Guide
        </h2>
        <p className="text-purple-200/80 text-lg">
          Personalize your AI-generated study materials to match your learning style
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-300">{studyGuide.length}</div>
          <div className="text-purple-400/70 text-sm">Sections Generated</div>
        </div>
        <div className="bg-black/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-300">
            {studyGuide.reduce((sum, section) => sum + section.content.length, 0).toLocaleString()}
          </div>
          <div className="text-purple-400/70 text-sm">Characters</div>
        </div>
        <div className="bg-black/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-300">
            {studyGuide.reduce((sum, section) => sum + (section.keywords?.length || 0), 0)}
          </div>
          <div className="text-purple-400/70 text-sm">Keywords</div>
        </div>
      </div>

      {/* Customization Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Style Selection */}
        <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
            <Type className="w-5 h-5" />
            Writing Style
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {STYLE_OPTIONS.map((style) => (
              <button
                key={style.id}
                onClick={() => updateSetting('style', style.id as any)}
                className={`p-3 rounded-lg text-left transition-all duration-300 ${
                  settings.style === style.id
                    ? 'bg-purple-600/30 border border-purple-400/50'
                    : 'bg-black/20 border border-purple-400/20 hover:border-purple-400/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div>
                    <div className="font-medium text-purple-200">{style.name}</div>
                    <div className="text-sm text-purple-300/70">{style.description}</div>
                  </div>
                  {settings.style === style.id && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Scheme */}
        <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Color Scheme
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {COLOR_SCHEMES.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => updateSetting('colorScheme', scheme.id as any)}
                className={`p-3 rounded-lg text-left transition-all duration-300 ${
                  settings.colorScheme === scheme.id
                    ? 'ring-2 ring-purple-400'
                    : 'hover:ring-1 hover:ring-purple-400/50'
                }`}
              >
                <div className={`w-full h-8 rounded mb-2 ${scheme.preview}`} />
                <div className="text-sm font-medium text-purple-200">{scheme.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5" />
            Format
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {FORMAT_OPTIONS.map((format) => (
              <button
                key={format.id}
                onClick={() => updateSetting('format', format.id as any)}
                className={`p-3 rounded-lg text-left transition-all duration-300 ${
                  settings.format === format.id
                    ? 'bg-purple-600/30 border border-purple-400/50'
                    : 'bg-black/20 border border-purple-400/20 hover:border-purple-400/40'
                }`}
              >
                <div className="text-2xl mb-2">{format.icon}</div>
                <div className="font-medium text-purple-200">{format.name}</div>
                <div className="text-xs text-purple-300/70">{format.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Additional Features
          </h3>
          <div className="space-y-4">
            {[
              { key: 'includeExamples', label: 'Include Examples', icon: '💡' },
              { key: 'includeQuestions', label: 'Include Questions', icon: '❓' },
              { key: 'highlightKeywords', label: 'Highlight Keywords', icon: '🔍' },
              { key: 'boldHeadings', label: 'Bold Headings', icon: '📝' },
            ].map((option) => (
              <label
                key={option.key}
                className="flex items-center gap-3 p-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={settings[option.key as keyof CustomizationSettings] as boolean}
                  onChange={(e) => updateSetting(option.key as keyof CustomizationSettings, e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-transparent border-purple-400 rounded focus:ring-purple-500"
                />
                <span className="text-2xl">{option.icon}</span>
                <span className="text-purple-200 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="flex justify-center">
        <div className="bg-black/20 rounded-lg p-1 flex">
          <button
            onClick={() => setPreviewMode('settings')}
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              previewMode === 'settings'
                ? 'bg-purple-600 text-white'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
          <button
            onClick={() => setPreviewMode('preview')}
            className={`px-4 py-2 rounded-md transition-all duration-300 ${
              previewMode === 'preview'
                ? 'bg-purple-600 text-white'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Preview
          </button>
        </div>
      </div>

      {/* Preview */}
      {previewMode === 'preview' && (
        <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-purple-200 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Preview
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {studyGuide.slice(0, 2).map((section) => (
              <div key={section.id} className="bg-black/20 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-200 mb-2">
                  {section.title}
                </h4>
                <p className="text-purple-300/80 text-sm line-clamp-3">
                  {section.content.substring(0, 200)}...
                </p>
                {section.keywords && section.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {section.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-600/30 text-purple-200 text-xs rounded"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-wizard rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
        >
          {isGenerating ? (
            <>
              <Wand2 className="w-5 h-5 animate-spin" />
              Generating Final Study Guide...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Final Study Guide
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default StudyGuideCustomizer;
