import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import {
  loadFiles,
  saveFile,
  deleteFile,
  loadCourses,
  saveCourse,
  deleteCourse,
  loadStudyMaterials,
  saveStudyMaterial,
  deleteStudyMaterial,
  updateFile,
  updateCourse,
  updateStudyMaterial,
  clearError,
  invalidateCache,
} from '../store/slices/filesSlice';

export const useFiles = () => {
  const dispatch = useAppDispatch();
  const {
    files,
    courses,
    studyMaterials,
    loading,
    error,
    lastUpdated,
    cache,
  } = useAppSelector((state) => state.files);

  // File operations
  const loadFilesData = useCallback(() => {
    dispatch(loadFiles());
  }, [dispatch]);

  const addFile = useCallback((file: any) => {
    dispatch(saveFile(file));
  }, [dispatch]);

  const updateFileData = useCallback((id: string, updates: any) => {
    dispatch(updateFile({ id, updates }));
  }, [dispatch]);

  const removeFile = useCallback((id: string) => {
    dispatch(deleteFile(id));
  }, [dispatch]);

  // Course operations
  const loadCoursesData = useCallback(() => {
    dispatch(loadCourses());
  }, [dispatch]);

  const addCourse = useCallback((course: any) => {
    dispatch(saveCourse(course));
  }, [dispatch]);

  const updateCourseData = useCallback((id: string, updates: any) => {
    dispatch(updateCourse({ id, updates }));
  }, [dispatch]);

  const removeCourse = useCallback((id: string) => {
    dispatch(deleteCourse(id));
  }, [dispatch]);

  // Study material operations
  const loadStudyMaterialsData = useCallback(() => {
    dispatch(loadStudyMaterials());
  }, [dispatch]);

  const addStudyMaterial = useCallback((material: any) => {
    dispatch(saveStudyMaterial(material));
  }, [dispatch]);

  const updateStudyMaterialData = useCallback((id: string, updates: any) => {
    dispatch(updateStudyMaterial({ id, updates }));
  }, [dispatch]);

  const removeStudyMaterial = useCallback((id: string) => {
    dispatch(deleteStudyMaterial(id));
  }, [dispatch]);

  // Utility functions
  const getFilesByCourse = useCallback((courseId: string) => {
    return files.filter(file => file.courseId === courseId);
  }, [files]);

  const getStudyMaterialsByCourse = useCallback((courseId: string) => {
    return studyMaterials.filter(material => material.courseId === courseId);
  }, [studyMaterials]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const clearCache = useCallback(() => {
    dispatch(invalidateCache());
  }, [dispatch]);

  // Computed values
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

  return {
    // State
    files,
    courses,
    studyMaterials,
    loading,
    error,
    lastUpdated,
    cache,
    
    // Actions
    loadFiles: loadFilesData,
    addFile,
    updateFile: updateFileData,
    deleteFile: removeFile,
    loadCourses: loadCoursesData,
    addCourse,
    updateCourse: updateCourseData,
    deleteCourse: removeCourse,
    loadStudyMaterials: loadStudyMaterialsData,
    addStudyMaterial,
    updateStudyMaterial: updateStudyMaterialData,
    deleteStudyMaterial: removeStudyMaterial,
    
    // Utilities
    getFilesByCourse,
    getStudyMaterialsByCourse,
    clearError: clearErrorState,
    clearCache,
    
    // Computed
    recentFiles,
    recentStudyMaterials,
    stats,
  };
};
