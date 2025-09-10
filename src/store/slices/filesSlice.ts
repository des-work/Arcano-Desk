import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { FileData, Course, StudyMaterial } from '../../types';
import { fileService } from '../../services/fileService';

// Async thunks
export const loadFiles = createAsyncThunk(
  'files/loadFiles',
  async (_, { rejectWithValue }) => {
    try {
      return await fileService.loadFiles();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load files');
    }
  }
);

export const saveFile = createAsyncThunk(
  'files/saveFile',
  async (file: FileData, { rejectWithValue }) => {
    try {
      return await fileService.saveFile(file);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save file');
    }
  }
);

export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (fileId: string, { rejectWithValue }) => {
    try {
      await fileService.deleteFile(fileId);
      return fileId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete file');
    }
  }
);

export const loadCourses = createAsyncThunk(
  'files/loadCourses',
  async (_, { rejectWithValue }) => {
    try {
      return await fileService.loadCourses();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load courses');
    }
  }
);

export const saveCourse = createAsyncThunk(
  'files/saveCourse',
  async (course: Course, { rejectWithValue }) => {
    try {
      return await fileService.saveCourse(course);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save course');
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'files/deleteCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      await fileService.deleteCourse(courseId);
      return courseId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete course');
    }
  }
);

export const loadStudyMaterials = createAsyncThunk(
  'files/loadStudyMaterials',
  async (_, { rejectWithValue }) => {
    try {
      return await fileService.loadStudyMaterials();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load study materials');
    }
  }
);

export const saveStudyMaterial = createAsyncThunk(
  'files/saveStudyMaterial',
  async (material: StudyMaterial, { rejectWithValue }) => {
    try {
      return await fileService.saveStudyMaterial(material);
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to save study material');
    }
  }
);

export const deleteStudyMaterial = createAsyncThunk(
  'files/deleteStudyMaterial',
  async (materialId: string, { rejectWithValue }) => {
    try {
      await fileService.deleteStudyMaterial(materialId);
      return materialId;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete study material');
    }
  }
);

interface FilesState {
  files: FileData[];
  courses: Course[];
  studyMaterials: StudyMaterial[];
  loading: {
    files: boolean;
    courses: boolean;
    studyMaterials: boolean;
  };
  error: string | null;
  lastUpdated: number | null;
  cache: {
    filesByCourse: Record<string, FileData[]>;
    materialsByCourse: Record<string, StudyMaterial[]>;
  };
}

const initialState: FilesState = {
  files: [],
  courses: [
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
  ],
  studyMaterials: [],
  loading: {
    files: false,
    courses: false,
    studyMaterials: false,
  },
  error: null,
  lastUpdated: null,
  cache: {
    filesByCourse: {},
    materialsByCourse: {},
  },
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateFile: (state, action: PayloadAction<{ id: string; updates: Partial<FileData> }>) => {
      const { id, updates } = action.payload;
      const fileIndex = state.files.findIndex(file => file.id === id);
      if (fileIndex !== -1) {
        state.files[fileIndex] = { ...state.files[fileIndex], ...updates };
        state.lastUpdated = Date.now();
      }
    },
    updateCourse: (state, action: PayloadAction<{ id: string; updates: Partial<Course> }>) => {
      const { id, updates } = action.payload;
      const courseIndex = state.courses.findIndex(course => course.id === id);
      if (courseIndex !== -1) {
        state.courses[courseIndex] = { ...state.courses[courseIndex], ...updates };
        state.lastUpdated = Date.now();
      }
    },
    updateStudyMaterial: (state, action: PayloadAction<{ id: string; updates: Partial<StudyMaterial> }>) => {
      const { id, updates } = action.payload;
      const materialIndex = state.studyMaterials.findIndex(material => material.id === id);
      if (materialIndex !== -1) {
        state.studyMaterials[materialIndex] = { ...state.studyMaterials[materialIndex], ...updates };
        state.lastUpdated = Date.now();
      }
    },
    invalidateCache: (state) => {
      state.cache = {
        filesByCourse: {},
        materialsByCourse: {},
      };
    },
  },
  extraReducers: (builder) => {
    // Load files
    builder
      .addCase(loadFiles.pending, (state) => {
        state.loading.files = true;
        state.error = null;
      })
      .addCase(loadFiles.fulfilled, (state, action) => {
        state.loading.files = false;
        state.files = action.payload;
        state.lastUpdated = Date.now();
        state.cache.filesByCourse = {};
      })
      .addCase(loadFiles.rejected, (state, action) => {
        state.loading.files = false;
        state.error = action.payload as string;
      });

    // Save file
    builder
      .addCase(saveFile.pending, (state) => {
        state.loading.files = true;
        state.error = null;
      })
      .addCase(saveFile.fulfilled, (state, action) => {
        state.loading.files = false;
        const existingIndex = state.files.findIndex(file => file.id === action.payload.id);
        if (existingIndex !== -1) {
          state.files[existingIndex] = action.payload;
        } else {
          state.files.push(action.payload);
        }
        state.lastUpdated = Date.now();
        state.cache.filesByCourse = {};
      })
      .addCase(saveFile.rejected, (state, action) => {
        state.loading.files = false;
        state.error = action.payload as string;
      });

    // Delete file
    builder
      .addCase(deleteFile.pending, (state) => {
        state.loading.files = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading.files = false;
        state.files = state.files.filter(file => file.id !== action.payload);
        state.lastUpdated = Date.now();
        state.cache.filesByCourse = {};
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading.files = false;
        state.error = action.payload as string;
      });

    // Load courses
    builder
      .addCase(loadCourses.pending, (state) => {
        state.loading.courses = true;
        state.error = null;
      })
      .addCase(loadCourses.fulfilled, (state, action) => {
        state.loading.courses = false;
        state.courses = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(loadCourses.rejected, (state, action) => {
        state.loading.courses = false;
        state.error = action.payload as string;
      });

    // Save course
    builder
      .addCase(saveCourse.pending, (state) => {
        state.loading.courses = true;
        state.error = null;
      })
      .addCase(saveCourse.fulfilled, (state, action) => {
        state.loading.courses = false;
        const existingIndex = state.courses.findIndex(course => course.id === action.payload.id);
        if (existingIndex !== -1) {
          state.courses[existingIndex] = action.payload;
        } else {
          state.courses.push(action.payload);
        }
        state.lastUpdated = Date.now();
      })
      .addCase(saveCourse.rejected, (state, action) => {
        state.loading.courses = false;
        state.error = action.payload as string;
      });

    // Delete course
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.loading.courses = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading.courses = false;
        state.courses = state.courses.filter(course => course.id !== action.payload);
        // Remove associated files and study materials
        state.files = state.files.filter(file => file.courseId !== action.payload);
        state.studyMaterials = state.studyMaterials.filter(material => material.courseId !== action.payload);
        state.lastUpdated = Date.now();
        state.cache = { filesByCourse: {}, materialsByCourse: {} };
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading.courses = false;
        state.error = action.payload as string;
      });

    // Load study materials
    builder
      .addCase(loadStudyMaterials.pending, (state) => {
        state.loading.studyMaterials = true;
        state.error = null;
      })
      .addCase(loadStudyMaterials.fulfilled, (state, action) => {
        state.loading.studyMaterials = false;
        state.studyMaterials = action.payload;
        state.lastUpdated = Date.now();
        state.cache.materialsByCourse = {};
      })
      .addCase(loadStudyMaterials.rejected, (state, action) => {
        state.loading.studyMaterials = false;
        state.error = action.payload as string;
      });

    // Save study material
    builder
      .addCase(saveStudyMaterial.pending, (state) => {
        state.loading.studyMaterials = true;
        state.error = null;
      })
      .addCase(saveStudyMaterial.fulfilled, (state, action) => {
        state.loading.studyMaterials = false;
        const existingIndex = state.studyMaterials.findIndex(material => material.id === action.payload.id);
        if (existingIndex !== -1) {
          state.studyMaterials[existingIndex] = action.payload;
        } else {
          state.studyMaterials.push(action.payload);
        }
        state.lastUpdated = Date.now();
        state.cache.materialsByCourse = {};
      })
      .addCase(saveStudyMaterial.rejected, (state, action) => {
        state.loading.studyMaterials = false;
        state.error = action.payload as string;
      });

    // Delete study material
    builder
      .addCase(deleteStudyMaterial.pending, (state) => {
        state.loading.studyMaterials = true;
        state.error = null;
      })
      .addCase(deleteStudyMaterial.fulfilled, (state, action) => {
        state.loading.studyMaterials = false;
        state.studyMaterials = state.studyMaterials.filter(material => material.id !== action.payload);
        state.lastUpdated = Date.now();
        state.cache.materialsByCourse = {};
      })
      .addCase(deleteStudyMaterial.rejected, (state, action) => {
        state.loading.studyMaterials = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  updateFile,
  updateCourse,
  updateStudyMaterial,
  invalidateCache,
} = filesSlice.actions;

export default filesSlice.reducer;
