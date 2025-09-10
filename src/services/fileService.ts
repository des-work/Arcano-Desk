import { FileData, Course, StudyMaterial } from '../types';

class FileService {
  private baseUrl = 'http://localhost:3001/api'; // Mock API endpoint
  private cache = new Map<string, any>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  // Cache management
  private getCacheKey(key: string): string {
    return `fileService_${key}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cacheKey = this.getCacheKey(key);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    
    this.cache.delete(cacheKey);
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    const cacheKey = this.getCacheKey(key);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });
  }

  private clearCache(): void {
    this.cache.clear();
  }

  // File operations
  async loadFiles(): Promise<FileData[]> {
    const cacheKey = 'files';
    const cached = this.getFromCache<FileData[]>(cacheKey);
    if (cached) return cached;

    try {
      // In a real app, this would be an API call
      const files = this.loadFromLocalStorage<FileData[]>('files', []);
      this.setCache(cacheKey, files);
      return files;
    } catch (error) {
      console.error('Error loading files:', error);
      throw new Error('Failed to load files');
    }
  }

  async saveFile(file: FileData): Promise<FileData> {
    try {
      const files = await this.loadFiles();
      const existingIndex = files.findIndex(f => f.id === file.id);
      
      if (existingIndex !== -1) {
        files[existingIndex] = { ...file, lastProcessed: new Date() };
      } else {
        files.push({ ...file, lastProcessed: new Date() });
      }
      
      this.saveToLocalStorage('files', files);
      this.clearCache();
      
      return files[existingIndex !== -1 ? existingIndex : files.length - 1];
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('Failed to save file');
    }
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      const files = await this.loadFiles();
      const filteredFiles = files.filter(f => f.id !== fileId);
      
      this.saveToLocalStorage('files', filteredFiles);
      this.clearCache();
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  // Course operations
  async loadCourses(): Promise<Course[]> {
    const cacheKey = 'courses';
    const cached = this.getFromCache<Course[]>(cacheKey);
    if (cached) return cached;

    try {
      const courses = this.loadFromLocalStorage<Course[]>('courses', [
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
      
      this.setCache(cacheKey, courses);
      return courses;
    } catch (error) {
      console.error('Error loading courses:', error);
      throw new Error('Failed to load courses');
    }
  }

  async saveCourse(course: Course): Promise<Course> {
    try {
      const courses = await this.loadCourses();
      const existingIndex = courses.findIndex(c => c.id === course.id);
      
      if (existingIndex !== -1) {
        courses[existingIndex] = course;
      } else {
        courses.push(course);
      }
      
      this.saveToLocalStorage('courses', courses);
      this.clearCache();
      
      return courses[existingIndex !== -1 ? existingIndex : courses.length - 1];
    } catch (error) {
      console.error('Error saving course:', error);
      throw new Error('Failed to save course');
    }
  }

  async deleteCourse(courseId: string): Promise<void> {
    try {
      const courses = await this.loadCourses();
      const filteredCourses = courses.filter(c => c.id !== courseId);
      
      this.saveToLocalStorage('courses', filteredCourses);
      this.clearCache();
      
      // Also delete associated files and study materials
      await this.deleteFilesByCourse(courseId);
      await this.deleteStudyMaterialsByCourse(courseId);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw new Error('Failed to delete course');
    }
  }

  // Study material operations
  async loadStudyMaterials(): Promise<StudyMaterial[]> {
    const cacheKey = 'studyMaterials';
    const cached = this.getFromCache<StudyMaterial[]>(cacheKey);
    if (cached) return cached;

    try {
      const materials = this.loadFromLocalStorage<StudyMaterial[]>('studyMaterials', []);
      this.setCache(cacheKey, materials);
      return materials;
    } catch (error) {
      console.error('Error loading study materials:', error);
      throw new Error('Failed to load study materials');
    }
  }

  async saveStudyMaterial(material: StudyMaterial): Promise<StudyMaterial> {
    try {
      const materials = await this.loadStudyMaterials();
      const existingIndex = materials.findIndex(m => m.id === material.id);
      
      if (existingIndex !== -1) {
        materials[existingIndex] = { ...material, lastModified: new Date() };
      } else {
        materials.push({ ...material, lastModified: new Date() });
      }
      
      this.saveToLocalStorage('studyMaterials', materials);
      this.clearCache();
      
      return materials[existingIndex !== -1 ? existingIndex : materials.length - 1];
    } catch (error) {
      console.error('Error saving study material:', error);
      throw new Error('Failed to save study material');
    }
  }

  async deleteStudyMaterial(materialId: string): Promise<void> {
    try {
      const materials = await this.loadStudyMaterials();
      const filteredMaterials = materials.filter(m => m.id !== materialId);
      
      this.saveToLocalStorage('studyMaterials', filteredMaterials);
      this.clearCache();
    } catch (error) {
      console.error('Error deleting study material:', error);
      throw new Error('Failed to delete study material');
    }
  }

  // Utility methods
  async getFilesByCourse(courseId: string): Promise<FileData[]> {
    const files = await this.loadFiles();
    return files.filter(f => f.courseId === courseId);
  }

  async getStudyMaterialsByCourse(courseId: string): Promise<StudyMaterial[]> {
    const materials = await this.loadStudyMaterials();
    return materials.filter(m => m.courseId === courseId);
  }

  private async deleteFilesByCourse(courseId: string): Promise<void> {
    const files = await this.loadFiles();
    const filteredFiles = files.filter(f => f.courseId !== courseId);
    this.saveToLocalStorage('files', filteredFiles);
  }

  private async deleteStudyMaterialsByCourse(courseId: string): Promise<void> {
    const materials = await this.loadStudyMaterials();
    const filteredMaterials = materials.filter(m => m.courseId !== courseId);
    this.saveToLocalStorage('studyMaterials', filteredMaterials);
  }

  // Local storage helpers
  private loadFromLocalStorage<T>(key: string, defaultValue: T): T {
    try {
      const stored = localStorage.getItem(`arcano-desk-${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        if (Array.isArray(parsed)) {
          return parsed.map(item => this.convertDates(item)) as T;
        }
        return this.convertDates(parsed) as T;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private saveToLocalStorage<T>(key: string, data: T): void {
    try {
      localStorage.setItem(`arcano-desk-${key}`, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      throw new Error(`Failed to save ${key}`);
    }
  }

  private convertDates(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.convertDates(item));
    }

    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && this.isDateString(value)) {
        converted[key] = new Date(value);
      } else if (typeof value === 'object' && value !== null) {
        converted[key] = this.convertDates(value);
      } else {
        converted[key] = value;
      }
    }

    return converted;
  }

  private isDateString(value: string): boolean {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value);
  }

  // Backup and restore
  async exportData(): Promise<string> {
    try {
      const files = await this.loadFiles();
      const courses = await this.loadCourses();
      const materials = await this.loadStudyMaterials();
      
      const data = {
        files,
        courses,
        materials,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw new Error('Failed to export data');
    }
  }

  async importData(data: string): Promise<void> {
    try {
      const parsed = JSON.parse(data);
      
      if (parsed.files) {
        this.saveToLocalStorage('files', parsed.files);
      }
      if (parsed.courses) {
        this.saveToLocalStorage('courses', parsed.courses);
      }
      if (parsed.materials) {
        this.saveToLocalStorage('studyMaterials', parsed.materials);
      }
      
      this.clearCache();
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data');
    }
  }

  // Statistics
  async getStatistics(): Promise<{
    totalFiles: number;
    totalCourses: number;
    totalMaterials: number;
    totalSize: number;
    lastActivity: Date | null;
  }> {
    try {
      const files = await this.loadFiles();
      const courses = await this.loadCourses();
      const materials = await this.loadStudyMaterials();
      
      const totalSize = files.reduce((sum, file) => sum + (file.content?.length || 0), 0);
      const lastActivity = files.reduce((latest, file) => {
        const fileDate = file.lastProcessed || file.uploadedAt;
        return fileDate > latest ? fileDate : latest;
      }, new Date(0));
      
      return {
        totalFiles: files.length,
        totalCourses: courses.length,
        totalMaterials: materials.length,
        totalSize,
        lastActivity: lastActivity.getTime() > 0 ? lastActivity : null,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw new Error('Failed to get statistics');
    }
  }
}

export const fileService = new FileService();
