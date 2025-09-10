# 🎮✨ Arcano Desk - Magic Study Assistant

A retro arcade-themed AI-powered study assistant that helps you organize, summarize, and interact with your study materials using local AI models.

![Arcano Desk](https://img.shields.io/badge/Version-1.0.0-neon-purple?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?style=for-the-badge&logo=tailwindcss)

## 🌟 Features

### 📚 **Smart File Processing**
- **Multi-format Support**: PDF, Word (.docx), PowerPoint (.pptx), and Text files
- **OCR Integration**: Automatically processes scanned PDFs and images
- **AI-Powered Summaries**: Generate summaries with customizable length and format
- **Key Information Extraction**: Automatically extracts key terms, dates, formulas, and reviews

### 🎯 **Study Assistant**
- **Interactive Q&A**: Ask questions about your notes and get confident AI responses
- **Context-Aware**: Select specific files to provide context for better answers
- **Study Material Generation**: Create flashcards, practice questions, and study notes
- **Multiple Summary Formats**: Paragraph, bullet points, outline, or Q&A format

### 📖 **Library Management**
- **Course Organization**: Organize materials by courses with custom colors
- **Smart Search**: Search through file names and content
- **File Preview**: Quick preview of file contents and AI-generated summaries
- **Bulk Operations**: Upload multiple files at once

### 📅 **Assignment Tracking**
- **Built-in Calendar**: Visual calendar with assignment deadlines
- **Priority System**: Mark assignments as high, medium, or low priority
- **Status Tracking**: Track assignment progress (pending, in-progress, completed)
- **Upcoming Assignments**: Quick view of upcoming deadlines

### 🎨 **Retro Arcade Theme**
- **Neon Purple Rainbow**: Vibrant neon color scheme
- **Arcade Animations**: Glowing effects, floating elements, and smooth transitions
- **Pixel Fonts**: Authentic retro gaming aesthetic
- **Magic Elements**: Sparkles, zaps, and mystical UI components

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **Ollama** installed and running locally
- **A local AI model** (e.g., llama2)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/arcano-desk.git
   cd arcano-desk
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Ollama**
   ```bash
   # Install Ollama (if not already installed)
   # Visit https://ollama.ai for installation instructions
   
   # Start Ollama server
   ollama serve
   
   # Pull a model (in a new terminal)
   ollama pull llama2
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 Usage

### 1. **Setup Courses**
- Click "New Course" to create your first course
- Add course name and code (e.g., "Computer Science 101", "CS101")
- Courses are automatically assigned random neon colors

### 2. **Upload Files**
- Select a course from the dropdown
- Drag and drop files or click to browse
- Supported formats: PDF, DOCX, PPTX, TXT
- Files are automatically processed and summarized

### 3. **Interact with Assistant**
- Go to the Assistant page
- Select files to provide context
- Ask questions about your materials
- Generate study materials like flashcards and practice questions

### 4. **Track Assignments**
- Use the Calendar to add assignments
- Set due dates, priorities, and descriptions
- Track progress and view upcoming deadlines

## 🛠️ Configuration

### AI Model Settings
- **Model Selection**: Choose from available Ollama models
- **Temperature**: Control response creativity (0-1)
- **Top P**: Control response diversity (0-1)
- **Max Tokens**: Set maximum response length

### File Processing
- **OCR**: Automatically enabled for scanned PDFs
- **Summary Length**: Short, medium, or long summaries
- **Summary Format**: Paragraph, bullet, outline, or Q&A

## 📁 Project Structure

```
arcano-desk/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── FileUpload.tsx
│   │   └── Header.tsx
│   ├── contexts/
│   │   ├── FileContext.tsx
│   │   └── OllamaContext.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Library.tsx
│   │   ├── StudyAssistant.tsx
│   │   ├── Calendar.tsx
│   │   └── Settings.tsx
│   ├── utils/
│   │   └── fileProcessor.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Customization

### Theme Colors
The app uses a neon purple rainbow theme with these main colors:
- **Neon Purple**: `#8B5CF6`
- **Neon Pink**: `#EC4899`
- **Neon Cyan**: `#06B6D4`
- **Neon Green**: `#10B981`
- **Neon Yellow**: `#F59E0B`

### Animations
- **Glow Effects**: Neon glowing borders and text
- **Floating Elements**: Smooth floating animations
- **Pulse Effects**: Breathing light effects
- **Slide Transitions**: Smooth page transitions

## 🔧 Troubleshooting

### Ollama Connection Issues
1. Ensure Ollama is running: `ollama serve`
2. Check if models are available: `ollama list`
3. Pull a model if needed: `ollama pull llama2`
4. Restart the application

### File Processing Issues
1. Ensure file formats are supported (PDF, DOCX, PPTX, TXT)
2. For large files, processing may take longer
3. OCR processing requires more time for scanned documents

### Performance Tips
1. Use smaller AI models for faster responses
2. Process files in smaller batches
3. Clear old files periodically to maintain performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ollama** for providing local AI model capabilities
- **React** and **TypeScript** for the robust frontend framework
- **Tailwind CSS** for the beautiful styling system
- **Tesseract.js** for OCR functionality
- **Mammoth** for Word document processing
- **PDF-parse** for PDF text extraction

## 🎯 Roadmap

- [ ] **Voice Input**: Add voice-to-text for hands-free interaction
- [ ] **Mobile App**: React Native version for mobile devices
- [ ] **Cloud Sync**: Sync data across devices
- [ ] **Advanced OCR**: Better image processing and handwriting recognition
- [ ] **Study Groups**: Collaborative study features
- [ ] **Progress Analytics**: Study progress tracking and insights
- [ ] **Plugin System**: Extensible architecture for custom features

---

**Made with ✨ and lots of neon magic!** 🎮🌈

*Transform your study sessions into an epic arcade adventure!*
