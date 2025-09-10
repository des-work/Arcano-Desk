import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimations } from '../animations';
import { InteractiveButton, InteractiveCard } from '../animations';
import { useFiles } from '../hooks/useFiles';
import { useWizard } from '../hooks/useWizard';
import { 
  BookOpen, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List,
  Eye,
  Edit,
  Trash2,
  Star
} from 'lucide-react';

interface LibraryPhaseProps {
  onComplete: () => void;
}

export const LibraryPhase: React.FC<LibraryPhaseProps> = ({ onComplete }) => {
  const { triggerAnimation } = useAnimations();
  const { files, courses, getFilesByCourse } = useFiles();
  const { castSpell, gainKnowledge, changeMood } = useWizard();
  
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showCreateCourse, setShowCreateCourse] = useState(false);

  // Update wizard state
  useEffect(() => {
    changeMood('excited');
    castSpell('library-reveal');
  }, [changeMood, castSpell]);

  // Filter files based on search and course
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || file.courseId === selectedCourse;
    return matchesSearch && matchesCourse;
  });

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
    
    triggerAnimation('button-click', { intensity: 'gentle' });
  };

  const handleCreateSummary = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }
    
    changeMood('focused');
    castSpell('summary-creation');
    triggerAnimation('wizard-cast', { intensity: 'intense' });
    
    // Wizard gains knowledge from selected files
    selectedFiles.forEach(fileId => {
      const file = files.find(f => f.id === fileId);
      if (file) {
        gainKnowledge(file.name);
      }
    });
    
    onComplete();
  };

  const handleFileAction = (fileId: string, action: 'view' | 'edit' | 'delete') => {
    triggerAnimation('button-click', { intensity: 'moderate' });
    
    switch (action) {
      case 'view':
        castSpell('file-reveal');
        break;
      case 'edit':
        castSpell('file-edit');
        break;
      case 'delete':
        castSpell('file-destroy');
        break;
    }
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
            📚 Knowledge Library
          </h1>
          
          <div className="flex items-center space-x-4">
            <InteractiveButton
              variant="secondary"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </InteractiveButton>
            
            <InteractiveButton
              variant="magic"
              size="sm"
              onClick={() => setShowCreateCourse(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Course
            </InteractiveButton>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Search your library..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 font-arcane"
            />
          </div>
          
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 backdrop-blur-lg border border-slate-600/50 rounded-xl text-white focus:outline-none focus:border-purple-400 font-arcane"
          >
            <option value="all">All Courses</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Files Grid/List */}
      <div className="flex-1 overflow-y-auto">
        {filteredFiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <BookOpen className="w-24 h-24 text-purple-400/50 mb-4" />
            <h3 className="text-xl font-wizard text-purple-300 mb-2">
              No files found
            </h3>
            <p className="text-purple-200/60 font-arcane">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload some files to get started'}
            </p>
          </motion.div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <InteractiveCard
                  hoverEffect="magic"
                  className={`p-6 ${selectedFiles.includes(file.id) ? 'ring-2 ring-purple-400' : ''}`}
                  onClick={() => handleFileSelect(file.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-purple-400" />
                      <div>
                        <h3 className="font-wizard text-white text-lg">
                          {file.name}
                        </h3>
                        <p className="text-purple-200/60 font-arcane text-sm">
                          {courses.find(c => c.id === file.courseId)?.name || 'Unknown Course'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction(file.id, 'view');
                        }}
                        className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction(file.id, 'edit');
                        }}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileAction(file.id, 'delete');
                        }}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-purple-200/60">
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {selectedFiles.includes(file.id) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-2 right-2"
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  )}
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Action Bar */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
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
                    {selectedFiles.length} file(s) selected
                  </span>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-purple-400 hover:text-purple-300 transition-colors font-arcane"
                  >
                    Clear Selection
                  </button>
                </div>
                
                <div className="flex space-x-4">
                  <InteractiveButton
                    variant="secondary"
                    onClick={() => {
                      triggerAnimation('button-click', { intensity: 'gentle' });
                      setSelectedFiles([]);
                    }}
                  >
                    Cancel
                  </InteractiveButton>
                  
                  <InteractiveButton
                    variant="magic"
                    onClick={handleCreateSummary}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Create Summary
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

export default LibraryPhase;
