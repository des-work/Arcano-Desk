import React, { useState, useEffect } from 'react';

interface SimpleSummaryPhaseProps {
  onComplete: () => void;
}

export const SimpleSummaryPhase: React.FC<SimpleSummaryPhaseProps> = ({ onComplete }) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    // Simulate AI processing
    const timer = setTimeout(() => {
      setSummary(`
# 📚 Document Analysis Summary

## 🎯 Key Topics Identified
- **Machine Learning**: Advanced algorithms and neural networks
- **Data Science**: Statistical analysis and visualization techniques
- **Research Methods**: Experimental design and hypothesis testing

## 📊 Important Concepts
1. **Supervised Learning**: Training models with labeled data
2. **Unsupervised Learning**: Finding patterns in unlabeled data
3. **Deep Learning**: Multi-layer neural networks for complex tasks

## 🔍 Study Recommendations
- Focus on practical implementation of algorithms
- Practice with real-world datasets
- Review mathematical foundations of ML

## ⭐ Key Insights
The documents contain comprehensive coverage of modern machine learning techniques, with particular emphasis on practical applications and hands-on implementation.
      `);
      setIsGenerating(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center max-w-4xl">
      <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-8">
        ✨ AI Summary Generated
      </h2>
      
      <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 mb-8">
        {isGenerating ? (
          <div className="text-center">
            <div className="text-6xl mb-4">🧙‍♂️</div>
            <p className="text-purple-200/80 font-arcane mb-6">
              The wizard is analyzing your documents...
            </p>
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-purple-300">Casting analysis spells...</span>
            </div>
          </div>
        ) : (
          <div className="text-left">
            <div className="text-6xl mb-4 text-center">🎯</div>
            <p className="text-purple-200/80 font-arcane mb-6 text-center">
              The wizard has completed the analysis!
            </p>
            <div className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 rounded-lg p-6 border border-indigo-500/20">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-indigo-300/90 leading-relaxed">
                  {summary}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {!isGenerating && (
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {/* TODO: Add Q&A functionality */}}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-wizard rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-blue-500/30"
          >
            Ask Questions
          </button>
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-wizard rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleSummaryPhase;
