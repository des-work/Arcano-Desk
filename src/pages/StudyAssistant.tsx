import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  BookOpen, 
  MessageSquare, 
  Zap,
  Loader2,
  File,
  X
} from 'lucide-react';
import { useFiles } from '../contexts/FileContext.tsx';
import { useOllama } from '../contexts/OllamaContext.tsx';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  fileContext?: string;
}

const StudyAssistant: React.FC = () => {
  const { files, courses } = useFiles();
  const { askQuestion, isLoading } = useOllama();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showFileSelector, setShowFileSelector] = useState(false);

  useEffect(() => {
    // Add welcome message
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        type: 'assistant',
        content: "Hello! I'm your magical study assistant. I can help you with questions about your notes, generate summaries, create study materials, and more. What would you like to know?",
        timestamp: new Date(),
      }]);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      // Get context from selected files
      const contextFiles = files.filter(f => selectedFiles.includes(f.id));
      const context = contextFiles.map(f => `File: ${f.name}\nContent: ${f.content}`).join('\n\n');
      
      const response = await askQuestion(inputMessage, context);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
        fileContext: contextFiles.length > 0 ? contextFiles.map(f => f.name).join(', ') : undefined,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to get response from assistant');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your magical study assistant. I can help you with questions about your notes, generate summaries, create study materials, and more. What would you like to know?",
      timestamp: new Date(),
    }]);
    setSelectedFiles([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mystic Oracle Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-wizard text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300">
            🧙‍♂️ Mystic Oracle
          </h1>
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-green-500 rounded-2xl shadow-lg">
            <Zap className="w-8 h-8 text-white animate-bounce" />
          </div>
        </div>
        <p className="text-purple-200/80 font-arcane text-xl max-w-2xl mx-auto">
          "Seek wisdom from the ancient scrolls, and the oracle shall reveal secrets untold..."
        </p>
        {/* Magical divider */}
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-purple-400"></div>
          <div className="text-purple-400 font-rune text-lg">✦</div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-purple-400"></div>
        </div>
      </div>

      {/* File Context Selector */}
      <div className="bg-arcade-bg/50 rounded-lg p-4 border border-neon-cyan/30">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-pixel text-neon-cyan flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>File Context</span>
          </h2>
          <button
            onClick={() => setShowFileSelector(!showFileSelector)}
            className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan text-sm font-arcade rounded border border-neon-cyan/50 hover:bg-neon-cyan/30 transition-all duration-300"
          >
            {showFileSelector ? 'Hide' : 'Select Files'}
          </button>
        </div>

        {selectedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {selectedFiles.map(fileId => {
              const file = files.find(f => f.id === fileId);
              if (!file) return null;
              return (
                <div key={fileId} className="flex items-center space-x-2 bg-neon-purple/20 text-neon-purple px-3 py-1 rounded border border-neon-purple/50">
                  <File className="w-3 h-3" />
                  <span className="text-sm font-arcade">{file.name}</span>
                  <button
                    onClick={() => toggleFileSelection(fileId)}
                    className="text-neon-purple hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {showFileSelector && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.length > 0 ? (
              files.map(file => {
                const course = courses.find(c => c.id === file.courseId);
                const isSelected = selectedFiles.includes(file.id);
                return (
                  <div
                    key={file.id}
                    onClick={() => toggleFileSelection(file.id)}
                    className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? 'bg-neon-purple/20 border border-neon-purple/50' 
                        : 'bg-arcade-bg/50 border border-gray-600/50 hover:border-neon-purple/30'
                    }`}
                  >
                    <File className="w-4 h-4 text-neon-purple" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-arcade text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-400">{course?.code || 'Unknown Course'}</p>
                    </div>
                    {isSelected && (
                      <div className="w-2 h-2 bg-neon-purple rounded-full"></div>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400 font-arcade text-sm">No files available. Upload some files first!</p>
            )}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <div className="bg-arcade-bg/30 rounded-lg border border-neon-purple/30 h-96 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white'
                    : 'bg-arcade-bg/50 border border-neon-cyan/30 text-gray-100'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {message.type === 'assistant' && (
                    <Sparkles className="w-5 h-5 text-neon-cyan mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="font-arcade text-sm whitespace-pre-wrap">
                      {message.content}
                    </div>
                    {message.fileContext && (
                      <div className="mt-2 text-xs text-gray-400">
                        Based on: {message.fileContext}
                      </div>
                    )}
                    <div className="mt-2 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-arcade-bg/50 border border-neon-cyan/30 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />
                  <span className="font-arcade text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-arcade-bg/50 rounded-lg p-4 border border-neon-purple/30">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your study materials..."
              className="w-full bg-arcade-bg border border-neon-purple/50 rounded-lg px-4 py-3 text-white font-arcade focus:border-neon-purple focus:outline-none resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-arcade rounded-lg hover:from-neon-pink hover:to-neon-purple transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Send</span>
            </button>
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-gray-600 text-white font-arcade rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setInputMessage("Can you summarize the main concepts from my notes?")}
          className="p-3 bg-neon-purple/10 border border-neon-purple/30 rounded-lg hover:bg-neon-purple/20 transition-all duration-300 text-left"
        >
          <div className="text-sm font-arcade text-neon-purple">Summarize Notes</div>
        </button>
        
        <button
          onClick={() => setInputMessage("Create flashcards for the key terms in my materials.")}
          className="p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-lg hover:bg-neon-pink/20 transition-all duration-300 text-left"
        >
          <div className="text-sm font-arcade text-neon-pink">Create Flashcards</div>
        </button>
        
        <button
          onClick={() => setInputMessage("Generate practice questions based on my study materials.")}
          className="p-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg hover:bg-neon-cyan/20 transition-all duration-300 text-left"
        >
          <div className="text-sm font-arcade text-neon-cyan">Practice Questions</div>
        </button>
        
        <button
          onClick={() => setInputMessage("What are the most important formulas and equations?")}
          className="p-3 bg-neon-green/10 border border-neon-green/30 rounded-lg hover:bg-neon-green/20 transition-all duration-300 text-left"
        >
          <div className="text-sm font-arcade text-neon-green">Key Formulas</div>
        </button>
      </div>
    </div>
  );
};

export default StudyAssistant;
