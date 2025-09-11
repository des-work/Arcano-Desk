import React, { useState } from 'react';

interface MarkedDocumentViewerProps {
  markedDocument: string;
  onClose: () => void;
}

export const MarkedDocumentViewer: React.FC<MarkedDocumentViewerProps> = ({
  markedDocument,
  onClose
}) => {
  const [showLegend, setShowLegend] = useState(true);

  const renderMarkedContent = (content: string) => {
    // Split content into lines and process each line
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      let processedLine = line;
      let className = 'text-purple-300/80';
      
      // Apply different styles based on markers
      if (line.includes('[HEADER]')) {
        processedLine = line.replace(/\[HEADER\]/g, '');
        className = 'text-2xl font-bold text-purple-200 bg-purple-800/30 p-3 rounded-lg border-l-4 border-purple-500 my-4';
      } else if (line.includes('[SUBHEADER]')) {
        processedLine = line.replace(/\[SUBHEADER\]/g, '');
        className = 'text-xl font-semibold text-purple-300 bg-purple-700/20 p-2 rounded border-l-4 border-purple-400 my-3';
      } else if (line.includes('[DEFINITION]')) {
        processedLine = line.replace(/\[DEFINITION\]/g, '');
        className = 'text-blue-200 bg-blue-900/30 p-2 rounded border-l-4 border-blue-500 my-2';
      } else if (line.includes('[EXPLANATION]')) {
        processedLine = line.replace(/\[EXPLANATION\]/g, '');
        className = 'text-green-200 bg-green-900/30 p-2 rounded border-l-4 border-green-500 my-2';
      } else if (line.includes('[FORMULA]')) {
        processedLine = line.replace(/\[FORMULA\]/g, '');
        className = 'text-orange-200 bg-orange-900/30 p-2 rounded border-l-4 border-orange-500 my-2 font-mono';
      } else if (line.includes('[PROCESS]')) {
        processedLine = line.replace(/\[PROCESS\]/g, '');
        className = 'text-cyan-200 bg-cyan-900/30 p-2 rounded border-l-4 border-cyan-500 my-2';
      } else if (line.includes('[IMPORTANT]')) {
        processedLine = line.replace(/\[IMPORTANT\]/g, '');
        className = 'text-yellow-200 bg-yellow-900/30 p-2 rounded border-l-4 border-yellow-500 my-2 font-semibold';
      } else if (line.includes('[EXAMPLE]')) {
        processedLine = line.replace(/\[EXAMPLE\]/g, '');
        className = 'text-pink-200 bg-pink-900/30 p-2 rounded border-l-4 border-pink-500 my-2';
      }
      
      return (
        <div key={index} className={className}>
          {processedLine}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-xl border border-purple-500/30 max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-black/20 backdrop-blur-sm border-b border-purple-500/20 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
            AI-Analyzed Document
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="px-3 py-1 bg-purple-600/30 text-purple-200 rounded-lg hover:bg-purple-600/50 transition-colors text-sm"
            >
              {showLegend ? 'Hide' : 'Show'} Legend
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-red-600/30 text-red-200 rounded-lg hover:bg-red-600/50 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Legend */}
        {showLegend && (
          <div className="bg-black/10 backdrop-blur-sm border-b border-purple-500/10 p-4">
            <h3 className="text-lg font-semibold text-purple-200 mb-3">Content Markers Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-purple-200">Headers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-400 rounded"></div>
                <span className="text-purple-200">Subheaders</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-purple-200">Definitions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-purple-200">Explanations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                <span className="text-purple-200">Formulas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                <span className="text-purple-200">Processes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-purple-200">Important</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-500 rounded"></div>
                <span className="text-purple-200">Examples</span>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-2">
            {renderMarkedContent(markedDocument)}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-black/20 backdrop-blur-sm border-t border-purple-500/20 p-4">
          <p className="text-purple-300/70 text-sm text-center">
            This document has been analyzed by AI to identify different types of content. Use the legend above to understand the color coding.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarkedDocumentViewer;
