import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from '../animations';
import { InteractiveButton, InteractiveCard } from '../animations';
import { useOllama } from '../hooks/useOllama';
import { useWizard } from '../hooks/useWizard';
import { LoadingAnimation } from '../animations';
import { 
  BookOpen, 
  Wand2, 
  Download, 
  Share, 
  Edit, 
  RefreshCw,
  Settings,
  Copy,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SummaryPhaseProps {
  selectedFiles: string[];
  onComplete: () => void;
}

export const SummaryPhase: React.FC<SummaryPhaseProps> = ({ 
  selectedFiles, 
  onComplete 
}) => {
  const { triggerAnimation } = useAnimations();
  const { generateSummary, isLoading } = useOllama();
  const { castSpell, gainKnowledge, changeMood, startLearning, stopLearning } = useWizard();
  
  const [summary, setSummary] = useState('');
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [summaryFormat, setSummaryFormat] = useState('paragraph');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Update wizard state
  useEffect(() => {
    changeMood('focused');
    castSpell('summary-creation');
    startLearning();
  }, [changeMood, castSpell, startLearning]);

  // Generate summary
  const handleGenerateSummary = async () => {
    if (selectedFiles.length === 0) {
      toast.error('No files selected for summary');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);
    setSummary('');
    
    // Wizard starts working
    changeMood('focused');
    castSpell('massive-spell');
    triggerAnimation('loading-magic', { intensity: 'intense' });

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Generate summary
      const content = `Content from ${selectedFiles.length} selected files...`;
      const result = await generateSummary(content, summaryLength, summaryFormat);
      
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      // Wizard celebrates
      changeMood('proud');
      castSpell('summary-complete');
      gainKnowledge('Summary Creation');
      triggerAnimation('epic-summary', { intensity: 'epic' });
      
      setSummary(result);
      toast.success('Summary generated successfully!');
      
    } catch (error) {
      console.error('Summary generation error:', error);
      changeMood('confused');
      triggerAnimation('notification-error', { intensity: 'moderate' });
      toast.error('Failed to generate summary');
    } finally {
      setIsGenerating(false);
      stopLearning();
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      triggerAnimation('button-click', { intensity: 'moderate' });
      toast.success('Summary copied to clipboard!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy summary');
    }
  };

  // Download summary
  const handleDownload = () => {
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    triggerAnimation('button-click', { intensity: 'moderate' });
    toast.success('Summary downloaded!');
  };

  // Regenerate summary
  const handleRegenerate = () => {
    setSummary('');
    handleGenerateSummary();
  };

  return (
    <div className="w-full h-full flex flex-col p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            ✨ Magical Summary
          </h1>
          
          <div className="flex items-center space-x-4">
            <InteractiveButton
              variant="secondary"
              size="sm"
              onClick={() => setSummaryFormat(summaryFormat === 'paragraph' ? 'bullet' : 'paragraph')}
            >
              <Settings className="w-4 h-4 mr-2" />
              {summaryFormat === 'paragraph' ? 'Bullet' : 'Paragraph'}
            </InteractiveButton>
            
            <select
              value={summaryLength}
              onChange={(e) => setSummaryLength(e.target.value as any)}
              className="px-4 py-2 bg-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-purple-400 font-arcane"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>

        {/* Summary Controls */}
        <div className="flex items-center space-x-4 mb-6">
          <InteractiveButton
            variant="magic"
            onClick={handleGenerateSummary}
            disabled={isGenerating || selectedFiles.length === 0}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Summary'}
          </InteractiveButton>
          
          {summary && (
            <>
              <InteractiveButton
                variant="secondary"
                onClick={handleRegenerate}
                disabled={isGenerating}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </InteractiveButton>
              
              <InteractiveButton
                variant="secondary"
                onClick={handleCopy}
              >
                {copied ? <CheckCircle className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </InteractiveButton>
              
              <InteractiveButton
                variant="secondary"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </InteractiveButton>
            </>
          )}
        </div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {isGenerating ? (
          <LoadingAnimation
            type="summary"
            progress={generationProgress}
            message="The wizard is weaving your summary..."
          />
        ) : summary ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full"
          >
            <InteractiveCard className="p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-wizard text-white">
                  Your Magical Summary
                </h2>
                
                <div className="flex items-center space-x-2 text-sm text-purple-200/60">
                  <span>{summary.length} characters</span>
                  <span>•</span>
                  <span>{summary.split(' ').length} words</span>
                </div>
              </div>
              
              <div className="prose prose-invert max-w-none">
                <div className="text-purple-200 font-arcane leading-relaxed whitespace-pre-wrap">
                  {summary}
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <BookOpen className="w-24 h-24 text-purple-400/50 mb-4" />
            <h3 className="text-xl font-wizard text-purple-300 mb-2">
              Ready to Create Magic?
            </h3>
            <p className="text-purple-200/60 font-arcane mb-6">
              Select your files and let the wizard weave a magical summary for you
            </p>
            
            <InteractiveButton
              variant="magic"
              onClick={handleGenerateSummary}
              disabled={selectedFiles.length === 0}
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate Summary
            </InteractiveButton>
          </motion.div>
        )}
      </div>

      {/* Action Bar */}
      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8"
          >
            <InteractiveCard className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-purple-200 font-arcane">
                    Summary ready! What would you like to do next?
                  </span>
                </div>
                
                <div className="flex space-x-4">
                  <InteractiveButton
                    variant="secondary"
                    onClick={() => {
                      triggerAnimation('button-click', { intensity: 'gentle' });
                      setSummary('');
                    }}
                  >
                    New Summary
                  </InteractiveButton>
                  
                  <InteractiveButton
                    variant="primary"
                    onClick={() => {
                      triggerAnimation('button-click', { intensity: 'moderate' });
                      onComplete();
                    }}
                  >
                    Continue
                  </InteractiveButton>
                </div>
              </div>
            </InteractiveCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SummaryPhase;
