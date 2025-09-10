import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Flag,
  Edit3,
  Trash2,
  CheckCircle
} from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import { Assignment } from '../types';
import toast from 'react-hot-toast';

const CalendarPage: React.FC = () => {
  const { courses } = useFiles();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    courseId: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleCreateAssignment = () => {
    if (!newAssignment.title.trim() || !newAssignment.courseId) {
      toast.error('Please fill in all required fields');
      return;
    }

    const assignment: Assignment = {
      id: Date.now().toString(),
      ...newAssignment,
      status: 'pending',
      createdAt: new Date(),
    };

    setAssignments(prev => [...prev, assignment]);
    setNewAssignment({
      title: '',
      description: '',
      dueDate: new Date(),
      courseId: '',
      priority: 'medium',
    });
    setShowNewAssignment(false);
    toast.success('Assignment created successfully!');
  };

  const handleUpdateAssignment = (id: string, updates: Partial<Assignment>) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? { ...assignment, ...updates } : assignment
    ));
    setEditingAssignment(null);
    toast.success('Assignment updated successfully!');
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    toast.success('Assignment deleted successfully!');
  };

  const getAssignmentsForDate = (date: Date) => {
    return assignments.filter(assignment => 
      assignment.dueDate.toDateString() === date.toDateString()
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 border-red-400/50 bg-red-400/10';
      case 'medium': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'low': return 'text-green-400 border-green-400/50 bg-green-400/10';
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'pending': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dayAssignments = getAssignmentsForDate(date);
      return (
        <div className="space-y-1">
          {dayAssignments.slice(0, 2).map(assignment => (
            <div
              key={assignment.id}
              className={`text-xs px-1 py-0.5 rounded truncate ${
                assignment.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                assignment.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-green-500/20 text-green-300'
              }`}
            >
              {assignment.title}
            </div>
          ))}
          {dayAssignments.length > 2 && (
            <div className="text-xs text-gray-400">
              +{dayAssignments.length - 2} more
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const selectedDateAssignments = getAssignmentsForDate(selectedDate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-pixel text-transparent bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan bg-clip-text neon-glow">
            Calendar
          </h1>
          <p className="text-gray-400 font-arcade">Track your assignments and deadlines</p>
        </div>
        
        <button
          onClick={() => setShowNewAssignment(true)}
          className="px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-arcade rounded-lg hover:from-neon-pink hover:to-neon-purple transition-all duration-300 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* New Assignment Modal */}
      {(showNewAssignment || editingAssignment) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-arcade-bg border-2 border-neon-purple rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-pixel text-neon-purple mb-4">
              {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 font-arcade mb-2">Title *</label>
                <input
                  type="text"
                  value={editingAssignment ? editingAssignment.title : newAssignment.title}
                  onChange={(e) => editingAssignment 
                    ? setEditingAssignment({...editingAssignment, title: e.target.value})
                    : setNewAssignment({...newAssignment, title: e.target.value})
                  }
                  className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none"
                  placeholder="Assignment title"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 font-arcade mb-2">Description</label>
                <textarea
                  value={editingAssignment ? editingAssignment.description : newAssignment.description}
                  onChange={(e) => editingAssignment 
                    ? setEditingAssignment({...editingAssignment, description: e.target.value})
                    : setNewAssignment({...newAssignment, description: e.target.value})
                  }
                  className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none resize-none"
                  rows={3}
                  placeholder="Assignment description"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 font-arcade mb-2">Course *</label>
                <select
                  value={editingAssignment ? editingAssignment.courseId : newAssignment.courseId}
                  onChange={(e) => editingAssignment 
                    ? setEditingAssignment({...editingAssignment, courseId: e.target.value})
                    : setNewAssignment({...newAssignment, courseId: e.target.value})
                  }
                  className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none"
                >
                  <option value="">Select course...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 font-arcade mb-2">Due Date *</label>
                <input
                  type="datetime-local"
                  value={editingAssignment 
                    ? editingAssignment.dueDate.toISOString().slice(0, 16)
                    : newAssignment.dueDate.toISOString().slice(0, 16)
                  }
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    editingAssignment 
                      ? setEditingAssignment({...editingAssignment, dueDate: date})
                      : setNewAssignment({...newAssignment, dueDate: date})
                  }}
                  className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 font-arcade mb-2">Priority</label>
                <select
                  value={editingAssignment ? editingAssignment.priority : newAssignment.priority}
                  onChange={(e) => {
                    const priority = e.target.value as 'low' | 'medium' | 'high';
                    editingAssignment 
                      ? setEditingAssignment({...editingAssignment, priority})
                      : setNewAssignment({...newAssignment, priority})
                  }}
                  className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-3 py-2 text-white font-arcade focus:border-neon-purple focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={editingAssignment 
                    ? () => handleUpdateAssignment(editingAssignment.id, editingAssignment)
                    : handleCreateAssignment
                  }
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-arcade rounded-lg hover:from-neon-pink hover:to-neon-purple transition-all duration-300"
                >
                  {editingAssignment ? 'Update' : 'Create'}
                </button>
                <button
                  onClick={() => {
                    setShowNewAssignment(false);
                    setEditingAssignment(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white font-arcade rounded-lg hover:bg-gray-700 transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-cyan/30">
            <h2 className="text-xl font-pixel text-neon-cyan mb-4 flex items-center space-x-2">
              <CalendarIcon className="w-5 h-5" />
              <span>Calendar View</span>
            </h2>
            
            <div className="bg-arcade-bg rounded-lg p-4">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileContent={tileContent}
                className="react-calendar"
              />
            </div>
          </div>
        </div>

        {/* Selected Date Assignments */}
        <div className="space-y-6">
          <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-purple/30">
            <h2 className="text-xl font-pixel text-neon-purple mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5" />
              <span>{selectedDate.toLocaleDateString()}</span>
            </h2>
            
            <div className="space-y-3">
              {selectedDateAssignments.length > 0 ? (
                selectedDateAssignments.map(assignment => {
                  const course = courses.find(c => c.id === assignment.courseId);
                  return (
                    <div key={assignment.id} className="bg-arcade-bg/50 rounded-lg p-4 border border-neon-purple/20">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-arcade text-white text-sm">{assignment.title}</h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setEditingAssignment(assignment)}
                            className="p-1 text-gray-400 hover:text-neon-cyan transition-colors"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteAssignment(assignment.id)}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-400">{course?.code || 'Unknown Course'}</span>
                          <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(assignment.priority)}`}>
                            {assignment.priority}
                          </span>
                          <span className={`text-xs ${getStatusColor(assignment.status)}`}>
                            {assignment.status}
                          </span>
                        </div>
                        
                        {assignment.description && (
                          <p className="text-xs text-gray-300 line-clamp-2">{assignment.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {assignment.dueDate.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400 font-arcade text-sm">No assignments for this date</p>
              )}
            </div>
          </div>

          {/* Upcoming Assignments */}
          <div className="bg-arcade-bg/50 rounded-lg p-6 border border-neon-green/30">
            <h2 className="text-xl font-pixel text-neon-green mb-4 flex items-center space-x-2">
              <Flag className="w-5 h-5" />
              <span>Upcoming</span>
            </h2>
            
            <div className="space-y-3">
              {assignments
                .filter(a => a.dueDate > new Date() && a.status !== 'completed')
                .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
                .slice(0, 5)
                .map(assignment => {
                  const course = courses.find(c => c.id === assignment.courseId);
                  return (
                    <div key={assignment.id} className="bg-arcade-bg/50 rounded-lg p-3 border border-neon-green/20">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-arcade text-white text-sm">{assignment.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded border ${getPriorityColor(assignment.priority)}`}>
                          {assignment.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-400">
                        <span>{course?.code || 'Unknown Course'}</span>
                        <span>•</span>
                        <span>{assignment.dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              
              {assignments.filter(a => a.dueDate > new Date() && a.status !== 'completed').length === 0 && (
                <p className="text-gray-400 font-arcade text-sm">No upcoming assignments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
