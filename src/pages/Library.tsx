import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  BookOpen, 
  File, 
  Sparkles,
  Download,
  Eye,
  Trash2,
  Edit3
} from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import { useOllama } from '../contexts/OllamaContext';
import FileUpload from '../components/FileUpload';
import toast from 'react-hot-toast';

const Library: React.FC = () => {
  const { files, courses, addCourse, deleteFile } = useFiles();
  const { generateSummary, generateStudyMaterial, isLoading } = useOllama();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [showUpload, setShowUpload] = useState(false);
  const [showNewCourse, setShowNewCourse] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = !selectedCourse || file.courseId === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleCreateCourse = () => {
    if (!newCourseName.trim() || !newCourseCode.trim()) {
      toast.error('Please fill in both course name and code');
      return;
    }

    const courseColors = ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981', '#F59E0B', '#F97316'];
    const randomColor = courseColors[Math.floor(Math.random() * courseColors.length)];

    addCourse({
      id: Date.now().toString(),
      name: newCourseName,
      code: newCourseCode,
      color: randomColor,
      createdAt: new Date(),
    });

    setNewCourseName('');
    setNewCourseCode('');
    setShowNewCourse(false);
    toast.success('Course created successfully!');
  };

  const handleGenerateSummary = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      const summary = await generateSummary(file.content, 'medium', 'paragraph');
      // Update file with new summary
      toast.success('Summary generated successfully!');
    } catch (error) {
      toast.error('Failed to generate summary');
    }
  };

  const handleGenerateStudyMaterial = async (fileId: string, type: 'flashcards' | 'questions' | 'notes') => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    try {
      const material = await generateStudyMaterial(file.content, type);
      // Add study material to context
      toast.success(`${type} generated successfully!`);
    } catch (error) {
      toast.error(`Failed to generate ${type}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-pixel text-transparent bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text neon-glow">
            Library
          </h1>
          <p className="text-gray-400 font-arcade">Manage your study materials and courses</p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowNewCourse(true)}
            className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-arcade rounded-lg hover:from-neon-pink hover:to-neon-purple transition-all duration-300 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Course</span>
          </button>
          
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="px-4 py-2 bg-gradient-to-r from-neon-cyan to-neon-green text-white font-arcade rounded-lg hover:from-neon-green hover:to-neon-cyan transition-all duration-300 flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Upload Files</span>
          </button>
        </div>
      </div>

      {/* New Course Modal */}
      {showNewCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-arcade-bg border-2 border-neon-purple rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-pixel text-neon-purple mb-4">Create New Course</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 font-arcade mb-2">Course Name</label>
                <input
                  type="text"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none"
                  placeholder="e.g., Computer Science 101"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 font-arcade mb-2">Course Code</label>
                <input
                  type="text"
                  value={newCourseCode}
                  onChange={(e) => setNewCourseCode(e.target.value)}
                  className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none"
                  placeholder="e.g., CS101"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateCourse}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-arcade rounded-lg hover:from-neon-pink hover:to-neon-purple transition-all duration-300"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewCourse(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white font-arcade rounded-lg hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Section */}
      {showUpload && (
        <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-cyan/30">
          <h2 className="text-xl font-pixel text-neon-cyan mb-4">Upload Files</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 font-arcade mb-2">Select Course</label>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full bg-arcade-bg border border-neon-cyan/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-cyan focus:outline-none"
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
                onUploadComplete={() => setShowUpload(false)}
              />
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg pl-10 pr-4 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none"
            />
          </div>
        </div>
        
        <div className="md:w-64">
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full bg-arcade-bg border border-neon-pink/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-pink focus:outline-none"
          >
            <option value="">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.code} - {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFiles.map(file => {
          const course = courses.find(c => c.id === file.courseId);
          return (
            <div key={file.id} className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-purple/30 hover:border-neon-purple/60 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <File className="w-6 h-6 text-neon-purple" />
                  <div>
                    <h3 className="font-arcade text-white truncate">{file.name}</h3>
                    <p className="text-sm text-gray-400">{course?.code || 'Unknown Course'}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedFile(selectedFile === file.id ? null : file.id)}
                    className="p-1 text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteFile(file.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-neon-purple/20 text-neon-purple text-xs rounded border border-neon-purple/50">
                    {file.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </div>

                {file.summary && (
                  <div className="text-sm text-gray-300 line-clamp-3">
                    {file.summary.substring(0, 150)}...
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleGenerateSummary(file.id)}
                    disabled={isLoading}
                    className="flex-1 px-3 py-1 bg-neon-purple/20 text-neon-purple text-xs font-arcade rounded border border-neon-purple/50 hover:bg-neon-purple/30 transition-all duration-300 disabled:opacity-50"
                  >
                    Summary
                  </button>
                  <button
                    onClick={() => handleGenerateStudyMaterial(file.id, 'flashcards')}
                    disabled={isLoading}
                    className="flex-1 px-3 py-1 bg-neon-pink/20 text-neon-pink text-xs font-arcade rounded border border-neon-pink/50 hover:bg-neon-pink/30 transition-all duration-300 disabled:opacity-50"
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => handleGenerateStudyMaterial(file.id, 'questions')}
                    disabled={isLoading}
                    className="flex-1 px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-xs font-arcade rounded border border-neon-cyan/50 hover:bg-neon-cyan/30 transition-all duration-300 disabled:opacity-50"
                  >
                    Quiz
                  </button>
                </div>
              </div>

              {/* Expanded View */}
              {selectedFile === file.id && (
                <div className="mt-4 pt-4 border-t border-neon-purple/30">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-arcade text-neon-purple mb-2">Content Preview:</h4>
                      <div className="text-sm text-gray-300 max-h-32 overflow-y-auto bg-arcade-bg/50 rounded p-3">
                        {file.content.substring(0, 500)}...
                      </div>
                    </div>
                    
                    {file.summary && (
                      <div>
                        <h4 className="text-sm font-arcade text-neon-pink mb-2">AI Summary:</h4>
                        <div className="text-sm text-gray-300 bg-arcade-bg/50 rounded p-3">
                          {file.summary}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-pixel text-gray-400 mb-2">No files found</h3>
          <p className="text-gray-500 font-arcade">
            {searchTerm || selectedCourse ? 'Try adjusting your filters' : 'Upload some files to get started'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Library;
