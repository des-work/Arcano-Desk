/**
 * Demo Routes Index
 * Main demo page with navigation to all animation engine features
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Palette, Zap, Star, Moon, Sun } from 'lucide-react';
import AnimationDemo from './AnimationDemo';

export const DemoRoutes: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const demos = [
    {
      id: 'animation',
      title: 'Animation Engine',
      description: 'Test time-of-day theming, wizard tiers, and particle effects',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-purple-600 to-pink-600',
      component: AnimationDemo,
    },
    {
      id: 'themes',
      title: 'Theme System',
      description: 'Preview different time-of-day themes and color palettes',
      icon: <Palette className="w-8 h-8" />,
      color: 'from-blue-600 to-cyan-600',
      component: () => <div>Theme Demo Coming Soon</div>,
    },
    {
      id: 'wizard',
      title: 'Wizard Progression',
      description: 'Test wizard tier advancement and magic type unlocks',
      icon: <Star className="w-8 h-8" />,
      color: 'from-yellow-600 to-orange-600',
      component: () => <div>Wizard Demo Coming Soon</div>,
    },
    {
      id: 'particles',
      title: 'Particle Effects',
      description: 'Interactive particle system and visual effects',
      icon: <Moon className="w-8 h-8" />,
      color: 'from-indigo-600 to-purple-600',
      component: () => <div>Particle Demo Coming Soon</div>,
    },
  ];

  const handleDemoSelect = (demoId: string) => {
    setActiveDemo(demoId);
  };

  const handleBack = () => {
    setActiveDemo(null);
  };

  if (activeDemo) {
    const demo = demos.find(d => d.id === activeDemo);
    if (demo) {
      const DemoComponent = demo.component;
      return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900">
          {/* Demo Header */}
          <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-wizard rounded-lg hover:from-gray-500 hover:to-gray-600 transition-all duration-300 flex items-center gap-2"
              >
                ← Back to Demos
              </button>
              
              <h1 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                {demo.title} Demo
              </h1>
              
              <div className="w-24"></div> {/* Spacer */}
            </div>
          </div>

          {/* Demo Content */}
          <DemoComponent />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 mb-4"
        >
          🎭 Animation Engine Demos
        </motion.h1>
        
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl text-purple-200/80 max-w-3xl mx-auto"
        >
          Interactive demonstrations of the new animation engine features. 
          Test time-of-day theming, wizard progression, particle effects, and more!
        </motion.p>
      </div>

      {/* Demo Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {demos.map((demo, index) => (
            <motion.div
              key={demo.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group cursor-pointer"
              onClick={() => handleDemoSelect(demo.id)}
            >
              <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 h-full">
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${demo.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {demo.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-wizard text-purple-200 mb-4 group-hover:text-white transition-colors duration-300">
                  {demo.title}
                </h3>

                {/* Description */}
                <p className="text-purple-300/70 mb-6 group-hover:text-purple-200/90 transition-colors duration-300">
                  {demo.description}
                </p>

                {/* Action Button */}
                <div className="flex items-center text-purple-300 group-hover:text-white transition-colors duration-300">
                  <Play className="w-4 h-4 mr-2" />
                  <span className="font-wizard">Launch Demo</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="max-w-6xl mx-auto mt-16">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="bg-gradient-to-br from-indigo-800/30 to-purple-800/30 backdrop-blur-sm rounded-2xl p-8 border border-indigo-500/20"
        >
          <h2 className="text-3xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-6 text-center">
            ✨ New Animation Engine Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🌅</div>
              <h3 className="text-lg font-wizard text-indigo-200 mb-2">Time-of-Day Theming</h3>
              <p className="text-indigo-300/70 text-sm">
                Dynamic color palettes that change based on the time of day
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🧙‍♂️</div>
              <h3 className="text-lg font-wizard text-purple-200 mb-2">Wizard Progression</h3>
              <p className="text-purple-300/70 text-sm">
                Multiple wizard tiers with unique magic types and visual effects
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-wizard text-pink-200 mb-2">Performance Optimization</h3>
              <p className="text-pink-300/70 text-sm">
                Adaptive quality and fade mode for long study sessions
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🎬</div>
              <h3 className="text-lg font-wizard text-yellow-200 mb-2">Cutscene Reveals</h3>
              <p className="text-yellow-300/70 text-sm">
                Elegant 4-9 second cutscenes for achievements and completions
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">💥</div>
              <h3 className="text-lg font-wizard text-red-200 mb-2">Friendly Failures</h3>
              <p className="text-red-300/70 text-sm">
                Funny error animations with particles and magical effects
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-3">🎨</div>
              <h3 className="text-lg font-wizard text-cyan-200 mb-2">Visual Effects</h3>
              <p className="text-cyan-300/70 text-sm">
                ACES tonemapping, bloom effects, and atmospheric fog
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Usage Instructions */}
      <div className="max-w-4xl mx-auto mt-12">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="bg-gradient-to-br from-green-800/30 to-emerald-800/30 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20"
        >
          <h2 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300 mb-4 text-center">
            🚀 How to Use
          </h2>
          
          <div className="space-y-4 text-green-200/80">
            <div className="flex items-start gap-3">
              <div className="text-green-400 font-wizard text-lg">1.</div>
              <p>Click on any demo card above to launch the interactive demonstration</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-green-400 font-wizard text-lg">2.</div>
              <p>Use the controls to test different time-of-day themes, wizard tiers, and settings</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-green-400 font-wizard text-lg">3.</div>
              <p>Trigger victory reveals and error animations to see the cutscene effects</p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="text-green-400 font-wizard text-lg">4.</div>
              <p>Experiment with fade mode and particle settings to test performance</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DemoRoutes;
