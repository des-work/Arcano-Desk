import React from 'react';
import { Toaster } from 'react-hot-toast';
import ReduxProvider from './components/ReduxProvider';
import AppRouter from './components/AppRouter';

function App() {
  return (
    <ReduxProvider>
      <AppRouter />
      
      {/* Global Toaster */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'linear-gradient(135deg, #1A0A2E 0%, #2D1B4E 100%)',
            color: '#8B5CF6',
            border: '2px solid #8B5CF6',
            borderRadius: '12px',
            fontFamily: 'Merriweather, serif',
            boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
          },
        }}
      />
    </ReduxProvider>
  );
}

export default App;
