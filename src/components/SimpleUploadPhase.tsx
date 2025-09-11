import React, { useState } from 'react';

interface SimpleUploadPhaseProps {
  onComplete: () => void;
}

export const SimpleUploadPhase: React.FC<SimpleUploadPhaseProps> = ({ onComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setUploading(true);
      
      // Simulate file processing
      setTimeout(() => {
        const fileNames = Array.from(files).map(file => file.name);
        setUploadedFiles(prev => [...prev, ...fileNames]);
        setUploading(false);
      }, 2000);
    }
  };

  const handleComplete = () => {
    if (uploadedFiles.length > 0) {
      onComplete();
    }
  };

  return (
    <div className="text-center max-w-2xl">
      <h2 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-8">
        📁 Upload Your Documents
      </h2>
      
      <div className="bg-gradient-to-br from-purple-800/30 to-pink-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 mb-8">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-purple-200/80 font-arcane mb-6">
          Drag and drop your files here or click to browse
        </p>
        
        <div className="border-2 border-dashed border-purple-400/50 rounded-lg p-8 hover:border-purple-400/80 transition-colors cursor-pointer mb-6">
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-purple-300/70 mb-2">Click to select files</p>
            <p className="text-purple-400/50 text-sm">Supported: PDF, DOCX, TXT</p>
          </label>
        </div>

        {uploading && (
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mr-3"></div>
            <span className="text-purple-300">Processing files...</span>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="text-left">
            <h3 className="text-lg font-wizard text-purple-200 mb-4">Uploaded Files:</h3>
            <div className="space-y-2">
              {uploadedFiles.map((fileName, index) => (
                <div key={index} className="flex items-center justify-between bg-green-800/30 rounded-lg p-3 border border-green-500/20">
                  <span className="text-green-300">✅ {fileName}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleComplete}
          disabled={uploadedFiles.length === 0}
          className={`px-8 py-4 rounded-xl font-wizard transition-all duration-300 shadow-lg ${
            uploadedFiles.length > 0
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/30'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue to Library
        </button>
      </div>
    </div>
  );
};

export default SimpleUploadPhase;
