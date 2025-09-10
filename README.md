# 🧙‍♂️ Arcano Desk - Magic Study Assistant

A powerful local desktop application that uses AI models to transform your study materials into magical learning experiences. Upload documents, generate intelligent summaries, create study materials, and get instant answers from your personal wizard assistant.

## ✨ Features

### 🧠 **Intelligent AI Model Selection**
- **Automatic Model Selection**: Analyzes content complexity and chooses the optimal AI model
- **Smart Content Analysis**: Evaluates word count, topic density, and complexity scores
- **Model Transparency**: Shows which model was used and why
- **Available Models**:
  - `gemma2:2b` (1.6GB) - Lightning-fast for simple content
  - `phi3:mini/latest` (2.2GB) - Balanced performance for most tasks
  - `llama2:latest` (3.8GB) - Reliable for complex content
  - `gemma2:latest` (5.4GB) - Advanced analysis capabilities
  - `wizardlm-uncensored:13b` (7.4GB) - Exceptional understanding
  - `gpt-oss:20b` (13GB) - Maximum power for expert analysis

### 🔮 **Knowledge Forge**
- **Topic Generation**: Create definitions, examples, explanations, and study guides
- **Smart Suggestions**: Automatically suggests topics from your uploaded documents
- **Depth Control**: Choose from brief, detailed, or comprehensive explanations
- **Context Integration**: Uses your document context for better relevance

### 📚 **Document Processing**
- **Multi-Format Support**: PDF, Word (.docx), PowerPoint (.pptx), and text files
- **OCR Capabilities**: Extract text from scanned documents
- **Intelligent Summaries**: Generate summaries with customizable length and format
- **Study Materials**: Create flashcards, practice questions, and organized notes

### 🧙‍♂️ **Wizard Assistant**
- **Q&A System**: Ask questions based on your uploaded documents
- **Magical Personality**: Wizard-themed responses with full transparency
- **Learning Progress**: Tracks your study materials and progress
- **Smart Recommendations**: Suggests topics and study approaches

### 📅 **Study Management**
- **Course Organization**: Organize materials by course or subject
- **Assignment Tracking**: Calendar integration for due dates and priorities
- **Progress Monitoring**: Track your learning journey
- **Library System**: Keep all your study materials organized

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Ollama installed and running
- At least one AI model downloaded (recommended: `llama2:latest`)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/des-work/Arcano-Desk.git
   cd Arcano-Desk
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start Ollama** (if not already running)
   ```bash
   ollama serve
   ```

4. **Download a model** (if you haven't already)
   ```bash
   ollama pull llama2:latest
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

## 🎯 Usage

### 1. **Upload Documents**
- Click "📚 Summon Scrolls" to upload your study materials
- Supported formats: PDF, Word, PowerPoint, and text files
- The wizard will automatically analyze and process your documents

### 2. **Generate Knowledge**
- Click "🔮 Knowledge Forge" to generate topics and explanations
- Choose from definitions, examples, explanations, or study guides
- Select depth level: brief, detailed, or comprehensive

### 3. **Ask Questions**
- Click "🧙‍♂️ Oracle" to ask questions about your documents
- The wizard will provide confident, well-organized answers
- Full transparency about which AI model was used

### 4. **Manage Models**
- Click "⚙️ Model Forge" to select and manage AI models
- View model capabilities and performance characteristics
- Switch between models based on your needs

## 🛠️ Technical Details

### **Architecture**
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom magical theme
- **AI Integration**: Ollama API with local model support
- **File Processing**: Mammoth (Word), PDF.js (PDF), Tesseract.js (OCR)
- **State Management**: React Context API

### **AI Model Selection Logic**
The system automatically analyzes content and selects the optimal model:

```typescript
// Content Analysis Factors
- Word Count: <500 (simple), 500-2000 (medium), 2000-5000 (complex), >5000 (very complex)
- Topic Density: Technical terms and academic language detection
- Sentence Complexity: Average sentence length analysis
- Context Window: Ensures content fits within model limits
```

### **Supported File Types**
- **PDF**: Text extraction with OCR fallback
- **Word (.docx)**: Full document processing
- **PowerPoint (.pptx)**: Slide content extraction
- **Text (.txt)**: Direct text processing

## 🎨 Customization

### **Themes**
The app features a magical wizard theme with:
- Neon purple and rainbow color schemes
- Custom fonts (Cinzel, Uncial Antiqua, Old English Text MT)
- Magical animations and effects
- Responsive design for all screen sizes

### **Model Configuration**
You can customize the AI model selection by:
- Adding new models to the `AVAILABLE_MODELS` array
- Adjusting complexity scoring thresholds
- Modifying model selection logic in `contentAnalyzer.ts`

## 🔧 Troubleshooting

### **Common Issues**

1. **"Cannot find module 'path-browserify'"**
   ```bash
   npm install path-browserify --legacy-peer-deps
   ```

2. **Ollama Connection Issues**
   - Ensure Ollama is running: `ollama serve`
   - Check if models are downloaded: `ollama list`
   - Verify Ollama is accessible at `http://localhost:11434`

3. **File Upload Problems**
   - Check file format is supported
   - Ensure file size is reasonable (<50MB recommended)
   - Try with a smaller file first

4. **Model Selection Issues**
   - Verify models are installed: `ollama list`
   - Check model names match exactly
   - Ensure sufficient system resources

## 📈 Performance Tips

- **Model Selection**: Smaller models (2B-3B) for simple tasks, larger models (7B+) for complex analysis
- **File Size**: Keep individual files under 50MB for optimal processing
- **Batch Processing**: Process multiple small files rather than one large file
- **Memory**: Ensure sufficient RAM for larger models (8GB+ recommended for 7B+ models)

## 🤝 Contributing

We welcome contributions! Please feel free to:
- Report bugs and issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Ollama** for providing the local AI infrastructure
- **React** and **Tailwind CSS** for the amazing development experience
- **Lucide React** for the beautiful icons
- **The open-source community** for all the amazing tools and libraries

---

**Made with ✨ magic and 🧙‍♂️ wizardry**

*Transform your study experience with the power of AI and a touch of magic!*