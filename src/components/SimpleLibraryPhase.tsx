import React, { useState } from 'react';

interface SimpleLibraryPhaseProps {
  onComplete: () => void;
}

export const SimpleLibraryPhase: React.FC<SimpleLibraryPhaseProps> = ({ onComplete }) => {
  const [documents] = useState([
    { id: 1, name: 'Research Paper.pdf', status: 'processed', type: 'PDF' },
    { id: 2, name: 'Study Notes.docx', status: 'processing', type: 'Word' },
    { id: 3, name: 'Lecture Notes.txt', status: 'ready', type: 'Text' },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return '✅';
      case 'processing': return '⏳';
      case 'ready': return '📄';
      default: return '📄';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'from-green-800/30 to-emerald-800/30 border-green-500/20';
      case 'processing': return 'from-yellow-800/30 to-orange-800/30 border-yellow-500/20';
      case 'ready': return 'from-blue-800/30 to-indigo-800/30 border-blue-500/20';
      default: return 'from-gray-800/30 to-gray-700/30 border-gray-500/20';
    }
  };

  return (
    <div className="text-center max-w-4xl">
      <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-8">
        📚 Your Magical Library
      </h2>
      
      <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 mb-8">
        <div className="text-6xl mb-4">📖</div>
        <p className="text-purple-200/80 font-arcane mb-6">
          Your documents are being processed by the wizard...
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`bg-gradient-to-r ${getStatusColor(doc.status)} rounded-lg p-4 border transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{getStatusIcon(doc.status)}</span>
                <span className="text-xs text-gray-400">{doc.type}</span>
              </div>
              <h4 className="font-wizard text-white mb-1 truncate">{doc.name}</h4>
              <p className="text-sm text-gray-300 capitalize">{doc.status}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-indigo-800/30 to-purple-800/30 rounded-lg p-6 border border-indigo-500/20">
          <h4 className="font-wizard text-indigo-200 mb-4">📋 Library Stats:</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-wizard text-green-400">1</div>
              <div className="text-sm text-gray-400">Processed</div>
            </div>
            <div>
              <div className="text-2xl font-wizard text-yellow-400">1</div>
              <div className="text-sm text-gray-400">Processing</div>
            </div>
            <div>
              <div className="text-2xl font-wizard text-blue-400">1</div>
              <div className="text-sm text-gray-400">Ready</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onComplete}
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-wizard rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 shadow-lg hover:shadow-green-500/30"
        >
          Generate Summary
        </button>
      </div>
    </div>
  );
};

export default SimpleLibraryPhase;
