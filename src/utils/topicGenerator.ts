import { ContentAnalysis } from './contentAnalyzer';

export interface TopicRequest {
  topic: string;
  context?: string;
  type: 'definition' | 'example' | 'explanation' | 'study_guide';
  depth: 'brief' | 'detailed' | 'comprehensive';
}

export interface GeneratedTopic {
  id: string;
  topic: string;
  type: string;
  content: string;
  relatedConcepts: string[];
  generatedAt: Date;
  modelUsed: string;
  confidence: number;
}

export interface TopicSuggestion {
  topic: string;
  reason: string;
  confidence: number;
  type: 'definition' | 'example' | 'explanation';
}

export const generateTopicPrompt = (request: TopicRequest, analysis?: ContentAnalysis): string => {
  const { topic, type, depth, context } = request;

  let prompt = '';

  switch (type) {
    case 'definition':
      prompt = `Provide a clear, concise definition of "${topic}". `;
      if (depth === 'detailed') {
        prompt += 'Include key characteristics, historical context if relevant, and practical applications. ';
      } else if (depth === 'comprehensive') {
        prompt += 'Provide a comprehensive definition including etymology, key characteristics, historical development, and multiple applications across different fields. ';
      }
      break;

    case 'example':
      prompt = `Provide practical examples of "${topic}". `;
      if (depth === 'detailed') {
        prompt += 'Include 2-3 real-world examples with explanations of how they demonstrate the concept. ';
      } else if (depth === 'comprehensive') {
        prompt += 'Provide multiple examples across different contexts, including both simple and complex applications. ';
      }
      break;

    case 'explanation':
      prompt = `Explain "${topic}" in a clear, organized manner. `;
      if (depth === 'detailed') {
        prompt += 'Break down the concept into components, provide step-by-step understanding, and include practical implications. ';
      } else if (depth === 'comprehensive') {
        prompt += 'Provide a thorough explanation including background, components, applications, limitations, and future implications. ';
      }
      break;

    case 'study_guide':
      prompt = `Create a study guide for "${topic}". `;
      prompt += 'Include key concepts, important definitions, practical examples, and study questions. ';
      break;
  }

  if (context) {
    prompt += `\n\nContext from user's documents: ${context}\n\n`;
    prompt += 'If relevant, reference or connect this information to the provided context. ';
  }

  // Add formatting instructions
  prompt += '\n\nFormat your response clearly with appropriate headings and bullet points where helpful. ';
  prompt += 'Keep explanations organized and avoid rambling. ';
  prompt += 'Focus on accuracy and clarity over length. ';

  // Add depth-specific instructions
  if (depth === 'brief') {
    prompt += 'Keep the response concise - aim for 2-3 paragraphs maximum. ';
  } else if (depth === 'detailed') {
    prompt += 'Provide detailed but organized information - aim for 3-5 paragraphs. ';
  } else if (depth === 'comprehensive') {
    prompt += 'Provide comprehensive coverage while maintaining organization - aim for 4-6 paragraphs. ';
  }

  return prompt;
};

export const suggestTopicsFromContent = (content: string, analysis: ContentAnalysis): TopicSuggestion[] => {
  const suggestions: TopicSuggestion[] = [];

  // Extract potential topics from content
  const sentences = content.split(/[.!?]+/).filter(sent => sent.trim().length > 10);

  // Look for technical terms and concepts
  const technicalPatterns = [
    /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Title case terms
    /\b[a-z]+(?:-[a-z]+)+\b/g, // Hyphenated terms
    /\b[A-Z]{2,}\b/g, // Acronyms
  ];

  const potentialTopics = new Set<string>();

  sentences.forEach(sentence => {
    technicalPatterns.forEach(pattern => {
      const matches = sentence.match(pattern);
      if (matches) {
        matches.forEach(match => {
          if (match.length > 3 && match.length < 30) {
            potentialTopics.add(match);
          }
        });
      }
    });
  });

  // Convert to suggestions
  Array.from(potentialTopics).slice(0, 8).forEach(topic => {
    const confidence = Math.random() * 0.4 + 0.6; // 0.6-1.0 confidence range
    const types: Array<'definition' | 'example' | 'explanation'> = ['definition', 'example', 'explanation'];

    suggestions.push({
      topic,
      reason: `Found in document content with ${Math.round(confidence * 100)}% relevance`,
      confidence,
      type: types[Math.floor(Math.random() * types.length)]
    });
  });

  // Sort by confidence
  return suggestions.sort((a, b) => b.confidence - a.confidence);
};

export const generateStudyGuidePrompt = (topic: string, context?: string): string => {
  let prompt = `Create a well-organized study guide for "${topic}". Include:

1. **Key Concepts** - Main ideas and principles
2. **Important Definitions** - Essential terms and their meanings
3. **Practical Examples** - Real-world applications
4. **Study Questions** - Questions to test understanding
5. **Key Takeaways** - Most important points to remember

`;

  if (context) {
    prompt += `\nContext from user's documents: ${context}\n`;
    prompt += 'Reference relevant information from the context where applicable.\n';
  }

  prompt += '\nFormat the study guide clearly with headings and bullet points. ';
  prompt += 'Make it comprehensive but organized - focus on quality over quantity. ';
  prompt += 'Ensure all information is accurate and well-structured.';

  return prompt;
};

export const createTopicFromQuestion = (question: string): TopicSuggestion => {
  // Extract main topic from question
  const questionWords = question.toLowerCase().split(/\s+/);
  const stopWords = ['what', 'is', 'are', 'how', 'why', 'when', 'where', 'who', 'which', 'can', 'do', 'does', 'the', 'a', 'an'];

  const keywords = questionWords.filter(word =>
    word.length > 3 &&
    !stopWords.includes(word) &&
    !word.match(/^(what|how|why|when|where|who|which|can|do|does|the|a|an)$/i)
  );

  const topic = keywords.slice(0, 3).join(' ');

  return {
    topic: topic || 'general question',
    reason: 'Extracted from user question',
    confidence: 0.8,
    type: question.toLowerCase().includes('what is') ? 'definition' :
          question.toLowerCase().includes('how') ? 'explanation' : 'example'
  };
};

export const formatGeneratedContent = (content: string, type: string): string => {
  // Add some basic formatting improvements
  let formatted = content;

  // Add proper spacing
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  // Ensure proper heading formatting
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '**$1**');

  // Add emoji indicators based on type
  const typeEmoji = {
    definition: '📖',
    example: '💡',
    explanation: '🔍',
    study_guide: '📚'
  };

  if (typeEmoji[type as keyof typeof typeEmoji]) {
    formatted = `${typeEmoji[type as keyof typeof typeEmoji]} ${formatted}`;
  }

  return formatted;
};
