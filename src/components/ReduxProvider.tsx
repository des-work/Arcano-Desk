import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store';
import ErrorBoundary from './ErrorBoundary';

interface ReduxProviderProps {
  children: React.ReactNode;
}

const ReduxProvider: React.FC<ReduxProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
              <h2 className="text-2xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">
                🧙‍♂️ Awakening the Wizard...
              </h2>
              <p className="text-purple-200/80 font-arcane">
                Loading your magical study companion
              </p>
            </div>
          </div>
        }
        persistor={persistor}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </PersistGate>
    </Provider>
  );
};

export default ReduxProvider;
