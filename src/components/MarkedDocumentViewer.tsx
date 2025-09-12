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
  const [showTeacherNotes, setShowTeacherNotes] = useState(true);

  // Generate teacher-style annotations and feedback
  const generateTeacherAnnotations = (content: string) => {
    const annotations = [];
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      if (line.includes('[HEADER]')) {
        annotations.push({
          line: index,
          type: 'excellent',
          message: 'Great structure! This header clearly organizes your content.',
          suggestion: 'Consider adding a brief introduction after this header.'
        });
      } else if (line.includes('[DEFINITION]')) {
        annotations.push({
          line: index,
          type: 'good',
          message: 'Well-defined concept. This shows good understanding.',
          suggestion: 'Try to include a real-world example to make it more memorable.'
        });
      } else if (line.includes('[FORMULA]')) {
        annotations.push({
          line: index,
          type: 'excellent',
          message: 'Mathematical concept clearly presented.',
          suggestion: 'Consider explaining what each variable represents.'
        });
      } else if (line.includes('[EXAMPLE]')) {
        annotations.push({
          line: index,
          type: 'excellent',
          message: 'Great use of examples! This helps with understanding.',
          suggestion: 'This example effectively illustrates the concept.'
        });
      } else if (line.includes('[IMPORTANT]')) {
        annotations.push({
          line: index,
          type: 'critical',
          message: 'Key point identified correctly!',
          suggestion: 'This is crucial for understanding the topic.'
        });
      }
    });
    
    return annotations;
  };

  const teacherAnnotations = generateTeacherAnnotations(markedDocument);

  const renderMarkedContent = (content: string) => {
    // Split content into lines and process each line
    const lines = content.split('\n');
    
    return lines.map((line, index) => {
      let processedLine = line;
      let className = 'text-purple-300/80 relative';
      let teacherNote = null;
      
      // Find teacher annotation for this line
      const annotation = teacherAnnotations.find(ann => ann.line === index);
      
      // Apply different styles based on markers
      if (line.includes('[HEADER]')) {
        processedLine = line.replace(/\[HEADER\]/g, '');
        className = 'text-2xl font-bold text-purple-200 bg-purple-800/30 p-3 rounded-lg border-l-4 border-purple-500 my-4 relative';
        teacherNote = annotation;
      } else if (line.includes('[SUBHEADER]')) {
        processedLine = line.replace(/\[SUBHEADER\]/g, '');
        className = 'text-xl font-semibold text-purple-300 bg-purple-700/20 p-2 rounded border-l-4 border-purple-400 my-3 relative';
        teacherNote = annotation;
      } else if (line.includes('[DEFINITION]')) {
        processedLine = line.replace(/\[DEFINITION\]/g, '');
        className = 'text-blue-200 bg-blue-900/30 p-2 rounded border-l-4 border-blue-500 my-2 relative';
        teacherNote = annotation;
      } else if (line.includes('[EXPLANATION]')) {
        processedLine = line.replace(/\[EXPLANATION\]/g, '');
        className = 'text-green-200 bg-green-900/30 p-2 rounded border-l-4 border-green-500 my-2 relative';
        teacherNote = annotation;
      } else if (line.includes('[FORMULA]')) {
        processedLine = line.replace(/\[FORMULA\]/g, '');
        className = 'text-orange-200 bg-orange-900/30 p-2 rounded border-l-4 border-orange-500 my-2 font-mono relative';
        teacherNote = annotation;
      } else if (line.includes('[PROCESS]')) {
        processedLine = line.replace(/\[PROCESS\]/g, '');
        className = 'text-cyan-200 bg-cyan-900/30 p-2 rounded border-l-4 border-cyan-500 my-2 relative';
        teacherNote = annotation;
      } else if (line.includes('[IMPORTANT]')) {
        processedLine = line.replace(/\[IMPORTANT\]/g, '');
        className = 'text-yellow-200 bg-yellow-900/30 p-2 rounded border-l-4 border-yellow-500 my-2 font-semibold relative';
        teacherNote = annotation;
      } else if (line.includes('[EXAMPLE]')) {
        processedLine = line.replace(/\[EXAMPLE\]/g, '');
        className = 'text-pink-200 bg-pink-900/30 p-2 rounded border-l-4 border-pink-500 my-2 relative';
        teacherNote = annotation;
      }
      
      return (
        <div key={index} className="relative group">
          <div className={className}>
            {processedLine}
          </div>
          
          {/* Teacher Note */}
          {teacherNote && showTeacherNotes && (
            <div className={`absolute right-0 top-0 transform translate-x-full w-80 bg-gradient-to-r from-yellow-900/90 to-orange-900/90 backdrop-blur-sm rounded-lg p-3 border border-yellow-500/30 shadow-lg z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
              <div className="flex items-start gap-2">
                <div className="text-2xl">👨‍🏫</div>
                <div className="flex-1">
                  <div className="text-yellow-200 font-semibold text-sm mb-1">Teacher's Note:</div>
                  <div className="text-yellow-100 text-xs mb-2">{teacherNote.message}</div>
                  <div className="text-yellow-200/80 text-xs italic">💡 {teacherNote.suggestion}</div>
                </div>
              </div>
            </div>
          )}
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
            👨‍🏫 Teacher's Review - AI-Analyzed Document
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowTeacherNotes(!showTeacherNotes)}
              className="px-3 py-1 bg-yellow-600/30 text-yellow-200 rounded-lg hover:bg-yellow-600/50 transition-colors text-sm"
            >
              {showTeacherNotes ? 'Hide' : 'Show'} Teacher Notes
            </button>
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
          <div className="text-center">
            <p className="text-purple-300/70 text-sm mb-2">
              👨‍🏫 <strong>Teacher's Review:</strong> This document has been analyzed by AI to identify different types of content and provide educational feedback.
            </p>
            <p className="text-yellow-300/70 text-xs">
              💡 Hover over highlighted sections to see teacher's notes and suggestions for improvement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarkedDocumentViewer;
