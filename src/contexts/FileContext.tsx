import React, { createContext, useContext, useState, useCallback } from 'react';
import { FileData, Course, StudyMaterial } from '../types';

interface FileContextType {
  files: FileData[];
  courses: Course[];
  studyMaterials: StudyMaterial[];
  addFile: (file: FileData) => void;
  updateFile: (id: string, updates: Partial<FileData>) => void;
  deleteFile: (id: string) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  addStudyMaterial: (material: StudyMaterial) => void;
  updateStudyMaterial: (id: string, updates: Partial<StudyMaterial>) => void;
  deleteStudyMaterial: (id: string) => void;
  getFilesByCourse: (courseId: string) => FileData[];
  getStudyMaterialsByCourse: (courseId: string) => StudyMaterial[];
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const useFiles = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      name: 'Computer Science 101',
      code: 'CS101',
      color: '#8B5CF6',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Mathematics',
      code: 'MATH201',
      color: '#EC4899',
      createdAt: new Date(),
    },
  ]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);

  const addFile = useCallback((file: FileData) => {
    setFiles(prev => [...prev, file]);
  }, []);

  const updateFile = useCallback((id: string, updates: Partial<FileData>) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const addCourse = useCallback((course: Course) => {
    setCourses(prev => [...prev, course]);
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    // Remove files and study materials associated with this course
    setFiles(prev => prev.filter(file => file.courseId !== id));
    setStudyMaterials(prev => prev.filter(material => material.courseId !== id));
  }, []);

  const addStudyMaterial = useCallback((material: StudyMaterial) => {
    setStudyMaterials(prev => [...prev, material]);
  }, []);

  const updateStudyMaterial = useCallback((id: string, updates: Partial<StudyMaterial>) => {
    setStudyMaterials(prev => prev.map(material => 
      material.id === id ? { ...material, ...updates } : material
    ));
  }, []);

  const deleteStudyMaterial = useCallback((id: string) => {
    setStudyMaterials(prev => prev.filter(material => material.id !== id));
  }, []);

  const getFilesByCourse = useCallback((courseId: string) => {
    return files.filter(file => file.courseId === courseId);
  }, [files]);

  const getStudyMaterialsByCourse = useCallback((courseId: string) => {
    return studyMaterials.filter(material => material.courseId === courseId);
  }, [studyMaterials]);

  const value: FileContextType = {
    files,
    courses,
    studyMaterials,
    addFile,
    updateFile,
    deleteFile,
    addCourse,
    updateCourse,
    deleteCourse,
    addStudyMaterial,
    updateStudyMaterial,
    deleteStudyMaterial,
    getFilesByCourse,
    getStudyMaterialsByCourse,
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
};
