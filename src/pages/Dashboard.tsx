import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Calendar,
  Sparkles,
  Plus,
  ArrowRight,
  FileText,
  Brain,
  CheckCircle,
  Clock,
  Star,
  File,
  Wand2,
  ScrollText,
  Trophy,
  Settings
} from 'lucide-react';
import { useFiles } from '../contexts/FileContext.tsx';
import { useOllama } from '../contexts/OllamaContext.tsx';
import Wizard from '../components/Wizard.tsx';
import MagicalEffects from '../components/MagicalEffects.tsx';
import ModelSelector from '../components/ModelSelector.tsx';
import TopicGenerator from '../components/TopicGenerator.tsx';

const Dashboard: React.FC = () => {
  const { files, courses, studyMaterials } = useFiles();
  const { isConnected, connect } = useOllama();
  const [activeEffect, setActiveEffect] = useState<string>('');
  const [isWizardLearning, setIsWizardLearning] = useState(false);
  const [hasNewKnowledge, setHasNewKnowledge] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showTopicGenerator, setShowTopicGenerator] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, [isConnected, connect]);

  const recentFiles = files.slice(-5).reverse();
  const recentStudyMaterials = studyMaterials.slice(-3).reverse();

  const stats = {
    totalFiles: files.length,
    totalCourses: courses.length,
    totalStudyMaterials: studyMaterials.length,
    processedToday: files.filter(f =>
      f.lastProcessed &&
      new Date(f.lastProcessed).toDateString() === new Date().toDateString()
    ).length,
  };

  const handleWizardSpell = () => {
    const effects = ['lightning', 'rain', 'snow', 'plants', 'creatures', 'sparkles'];
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    setActiveEffect(randomEffect);
    setTimeout(() => setActiveEffect(''), 5000);
  };

  return (
    <div className="relative min-h-screen">
      {/* Magical Effects Background */}
      <MagicalEffects activeEffect={activeEffect} intensity="medium" />

      <div className="relative z-10 space-y-8">
        {/* Wizard Welcome Section */}
        <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-purple-500/30">
          <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
            <div className="flex-shrink-0">
              <Wizard
                isLearning={isWizardLearning}
                hasNewKnowledge={hasNewKnowledge}
                onCastSpell={handleWizardSpell}
              />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-4 animate-fade-in">
                Arcano Desk
              </h1>
              <p className="text-xl font-arcane text-purple-200 mb-4">
                Your mystical AI study companion awaits!
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="bg-purple-800/50 rounded-full px-4 py-2 border border-purple-400/30">
                  <span className="text-purple-300 font-rune text-sm">🧙‍♂️ Wizard Ready</span>
                </div>
                <div className="bg-cyan-800/50 rounded-full px-4 py-2 border border-cyan-400/30">
                  <span className="text-cyan-300 font-rune text-sm">📚 {stats.totalFiles} Scrolls</span>
                </div>
                <div className="bg-green-800/50 rounded-full px-4 py-2 border border-green-400/30">
                  <span className="text-green-300 font-rune text-sm">🎯 {stats.totalCourses} Courses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ollama Connection Status */}
          {!isConnected && (
            <div className="mt-6 bg-gradient-to-r from-amber-900/80 to-orange-900/80 backdrop-blur-sm border border-amber-500/50 rounded-xl p-4 animate-pulse">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-4 h-4 bg-amber-400 rounded-full animate-ping"></div>
                <div className="text-center">
                  <p className="text-amber-200 font-mystic text-lg">✨ Awakening the Wizard...</p>
                  <p className="text-amber-300/80 text-sm font-arcane">Start Ollama to unleash full magical powers</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enchanted Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ScrollText, label: 'Ancient Scrolls', value: stats.totalFiles, color: 'from-blue-500 to-cyan-500', bgColor: 'from-blue-900/80 to-cyan-900/80' },
            { icon: BookOpen, label: 'Magical Tomes', value: stats.totalCourses, color: 'from-green-500 to-emerald-500', bgColor: 'from-green-900/80 to-emerald-900/80' },
            { icon: Wand2, label: 'Wizard Crafts', value: stats.totalStudyMaterials, color: 'from-purple-500 to-pink-500', bgColor: 'from-purple-900/80 to-pink-900/80' },
            { icon: Trophy, label: 'Daily Quests', value: stats.processedToday, color: 'from-yellow-500 to-orange-500', bgColor: 'from-yellow-900/80 to-orange-900/80' },
          ].map((stat, index) => (
            <div key={index} className={`bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-opacity-30 hover:border-opacity-60 transition-all duration-300 hover:scale-105 hover:shadow-xl group relative overflow-hidden`}>
              {/* Magical sparkle effect */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-sparkle" />
              </div>

              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-wizard text-white font-bold">{stat.value}</p>
                  <p className="text-white/80 text-sm font-arcane">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mystical Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/library"
            className="group relative bg-gradient-to-br from-blue-900/80 to-cyan-900/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden"
            onMouseEnter={() => setIsWizardLearning(true)}
            onMouseLeave={() => setIsWizardLearning(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:animate-bounce">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-wizard text-white mb-1 group-hover:text-cyan-200 transition-colors">📚 Summon Scrolls</h3>
                <p className="text-blue-200/80 text-xs font-arcane">Upload documents</p>
              </div>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
          </Link>

          <button
            onClick={() => setShowTopicGenerator(true)}
            className="group relative bg-gradient-to-br from-cyan-900/80 to-blue-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl shadow-lg group-hover:animate-bounce">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-wizard text-white mb-1 group-hover:text-blue-200 transition-colors">🔮 Knowledge Forge</h3>
                <p className="text-cyan-200/80 text-xs font-arcane">Generate topics</p>
              </div>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
          </button>

          <Link
            to="/assistant"
            className="group relative bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden"
            onMouseEnter={() => setHasNewKnowledge(true)}
            onMouseLeave={() => setHasNewKnowledge(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:animate-bounce">
                <Wand2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-wizard text-white mb-1 group-hover:text-pink-200 transition-colors">🧙‍♂️ Oracle</h3>
                <p className="text-purple-200/80 text-xs font-arcane">Ask questions</p>
              </div>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowRight className="w-4 h-4 text-pink-400 animate-pulse" />
            </div>
          </Link>

          <button
            onClick={() => setShowModelSelector(true)}
            className="group relative bg-gradient-to-br from-amber-900/80 to-orange-900/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-500/30 hover:border-amber-400/60 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg group-hover:animate-bounce">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-wizard text-white mb-1 group-hover:text-orange-200 transition-colors">⚙️ Model Forge</h3>
                <p className="text-amber-200/80 text-xs font-arcane">Choose AI power</p>
              </div>
            </div>
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Settings className="w-4 h-4 text-orange-400 animate-pulse" />
            </div>
          </button>
        </div>

        {/* Wizard's Getting Started Quest */}
        {courses.length === 0 && (
          <div className="bg-gradient-to-br from-amber-900/80 to-orange-900/80 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/30 relative overflow-hidden">
            <div className="absolute top-4 right-4 animate-sparkle">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <h2 className="text-3xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 mb-6 flex items-center space-x-3">
              <Trophy className="w-8 h-8" />
              <span>🧙‍♂️ Wizard's First Quest</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: 1, icon: '📜', title: 'Gather Ancient Scrolls', desc: 'Upload your study documents', color: 'from-amber-500 to-yellow-500' },
                { step: 2, icon: '🏰', title: 'Build Your Academy', desc: 'Create magical courses', color: 'from-orange-500 to-red-500' },
                { step: 3, icon: '✨', title: 'Seek Mystic Wisdom', desc: 'Ask the wizard questions', color: 'from-yellow-500 to-amber-500' },
              ].map((item) => (
                <div key={item.step} className="text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <h3 className="text-white font-wizard text-lg mb-2">{item.title}</h3>
                  <p className="text-amber-200/80 text-sm font-arcane">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        {/* Recent Magical Scrolls */}
        <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
          <h2 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300 mb-6 flex items-center space-x-3">
            <Clock className="w-6 h-6 text-purple-400" />
            <span>📜 Recent Scrolls</span>
          </h2>

          <div className="space-y-4">
            {recentFiles.length > 0 ? (
              recentFiles.map((file, index) => (
                <div key={file.id} className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-purple-400/30 transition-all duration-300 hover:scale-102 group">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <File className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-arcane truncate group-hover:text-cyan-200 transition-colors">{file.name}</p>
                    <p className="text-slate-400 text-sm font-rune">
                      {courses.find(c => c.id === file.courseId)?.code || 'Unknown Realm'}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-sparkle" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ScrollText className="w-10 h-10 text-slate-400" />
                </div>
                <p className="text-slate-400 font-arcane text-lg mb-2">No scrolls in the library yet</p>
                <Link to="/library" className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-mystic transition-colors">
                  <span>✨ Summon your first scroll</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Model Selector Modal */}
      <ModelSelector 
        isOpen={showModelSelector} 
        onClose={() => setShowModelSelector(false)} 
      />

      {/* Topic Generator Modal */}
      <TopicGenerator 
        isOpen={showTopicGenerator} 
        onClose={() => setShowTopicGenerator(false)} 
      />
    </div>
  );
};

export default Dashboard;
