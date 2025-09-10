import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

// Import slices
import filesSlice from './slices/filesSlice';
import ollamaSlice from './slices/ollamaSlice';
import uiSlice from './slices/uiSlice';
import settingsSlice from './slices/settingsSlice';
import wizardSlice from './slices/wizardSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['files', 'settings', 'ui'], // Only persist these slices
  blacklist: ['ollama', 'wizard'], // Don't persist these (they're session-based)
};

// Root reducer
const rootReducer = combineReducers({
  files: filesSlice,
  ollama: ollamaSlice,
  ui: uiSlice,
  settings: settingsSlice,
  wizard: wizardSlice,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['_persist'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Store utilities
export const getStoreState = () => store.getState();
export const dispatchAction = (action: any) => store.dispatch(action);
