import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  MessageSquare, 
  Upload, 
  Sparkles, 
  Zap,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import { useOllama } from '../contexts/OllamaContext';
import FileUpload from '../components/FileUpload';

const Dashboard: React.FC = () => {
  const { files, courses, studyMaterials } = useFiles();
  const { isConnected, connect, isLoading } = useOllama();
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  useEffect(() => {
    if (!isConnected) {
      connect();
    }
  }, [isConnected, connect]);

  const recentFiles = files.slice(-5).reverse();
  const recentStudyMaterials = studyMaterials.slice(-3).reverse();
  const upcomingAssignments = []; // Will be implemented with calendar

  const stats = {
    totalFiles: files.length,
    totalCourses: courses.length,
    totalStudyMaterials: studyMaterials.length,
    processedToday: files.filter(f => 
      f.lastProcessed && 
      new Date(f.lastProcessed).toDateString() === new Date().toDateString()
    ).length,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Sparkles className="w-8 h-8 text-neon-purple animate-pulse-neon" />
          <h1 className="text-4xl font-pixel text-transparent bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text neon-glow">
            Welcome to Arcano Desk
          </h1>
          <Zap className="w-8 h-8 text-neon-yellow animate-bounce-slow" />
        </div>
        <p className="text-gray-400 font-arcade text-lg">
          Your magical AI study assistant is ready to help!
        </p>
        {!isConnected && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-400 font-arcade text-sm">
              ⚠️ Ollama not connected. Please start Ollama and refresh.
            </p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-neon-purple/20 to-neon-pink/20 rounded-lg p-4 border border-neon-purple/30">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-neon-purple" />
            <div>
              <p className="text-2xl font-pixel text-neon-purple">{stats.totalFiles}</p>
              <p className="text-xs text-gray-400 font-arcade">Files</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 rounded-lg p-4 border border-neon-pink/30">
          <div className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-neon-pink" />
            <div>
              <p className="text-2xl font-pixel text-neon-pink">{stats.totalCourses}</p>
              <p className="text-xs text-gray-400 font-arcade">Courses</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-neon-cyan/20 to-neon-green/20 rounded-lg p-4 border border-neon-cyan/30">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-6 h-6 text-neon-cyan" />
            <div>
              <p className="text-2xl font-pixel text-neon-cyan">{stats.totalStudyMaterials}</p>
              <p className="text-xs text-gray-400 font-arcade">Materials</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-neon-green/20 to-neon-yellow/20 rounded-lg p-4 border border-neon-green/30">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-6 h-6 text-neon-green" />
            <div>
              <p className="text-2xl font-pixel text-neon-green">{stats.processedToday}</p>
              <p className="text-xs text-gray-400 font-arcade">Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-purple/30">
          <h2 className="text-xl font-pixel text-neon-purple mb-4 flex items-center space-x-2">
            <Upload className="w-5 h-5" />
            <span>Quick Upload</span>
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 font-arcade mb-2">
                Select Course
              </label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none"
              >
                <option value="">Choose a course...</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </option>
                ))}
              </select>
            </div>
            
            {selectedCourse && (
              <FileUpload 
                courseId={selectedCourse} 
                onUploadComplete={() => setSelectedCourse('')}
              />
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-cyan/30">
          <h2 className="text-xl font-pixel text-neon-cyan mb-4 flex items-center space-x-2">
            <Zap className="w-5 h-5" />
            <span>Quick Actions</span>
          </h2>
          
          <div className="space-y-3">
            <Link
              to="/library"
              className="flex items-center space-x-3 p-3 bg-neon-purple/10 hover:bg-neon-purple/20 rounded-lg border border-neon-purple/30 transition-all duration-300 group"
            >
              <BookOpen className="w-5 h-5 text-neon-purple group-hover:animate-pulse" />
              <span className="font-arcade text-neon-purple">Browse Library</span>
            </Link>
            
            <Link
              to="/assistant"
              className="flex items-center space-x-3 p-3 bg-neon-pink/10 hover:bg-neon-pink/20 rounded-lg border border-neon-pink/30 transition-all duration-300 group"
            >
              <MessageSquare className="w-5 h-5 text-neon-pink group-hover:animate-pulse" />
              <span className="font-arcade text-neon-pink">Ask Assistant</span>
            </Link>
            
            <Link
              to="/calendar"
              className="flex items-center space-x-3 p-3 bg-neon-cyan/10 hover:bg-neon-cyan/20 rounded-lg border border-neon-cyan/30 transition-all duration-300 group"
            >
              <Calendar className="w-5 h-5 text-neon-cyan group-hover:animate-pulse" />
              <span className="font-arcade text-neon-cyan">View Calendar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Files */}
        <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-green/30">
          <h2 className="text-xl font-pixel text-neon-green mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>Recent Files</span>
          </h2>
          
          <div className="space-y-3">
            {recentFiles.length > 0 ? (
              recentFiles.map(file => (
                <div key={file.id} className="flex items-center space-x-3 p-3 bg-neon-green/5 rounded-lg border border-neon-green/20">
                  <File className="w-4 h-4 text-neon-green" />
                  <div className="flex-1 min-w-0">
                    <p className="font-arcade text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-gray-400">
                      {courses.find(c => c.id === file.courseId)?.code || 'Unknown Course'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 font-arcade text-sm">No files uploaded yet</p>
            )}
          </div>
        </div>

        {/* Recent Study Materials */}
        <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-yellow/30">
          <h2 className="text-xl font-pixel text-neon-yellow mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5" />
            <span>Recent Materials</span>
          </h2>
          
          <div className="space-y-3">
            {recentStudyMaterials.length > 0 ? (
              recentStudyMaterials.map(material => (
                <div key={material.id} className="flex items-center space-x-3 p-3 bg-neon-yellow/5 rounded-lg border border-neon-yellow/20">
                  <Sparkles className="w-4 h-4 text-neon-yellow" />
                  <div className="flex-1 min-w-0">
                    <p className="font-arcade text-sm text-white truncate">{material.title}</p>
                    <p className="text-xs text-gray-400 capitalize">{material.type}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 font-arcade text-sm">No study materials created yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
