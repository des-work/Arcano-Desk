export interface ContentAnalysis {
  wordCount: number;
  sentenceCount: number;
  averageSentenceLength: number;
  topicDensity: number;
  complexityScore: number;
  recommendedModel: string;
  reasoning: string;
  estimatedTokens: number;
}

export interface ModelInfo {
  name: string;
  size: string;
  capabilities: string[];
  bestFor: string[];
  contextWindow: number;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    name: 'gemma2:2b',
    size: '1.6GB',
    capabilities: ['fast', 'lightweight', 'basic_summarization'],
    bestFor: ['short_texts', 'simple_definitions', 'basic_explanations'],
    contextWindow: 8192
  },
  {
    name: 'phi3:mini',
    size: '2.2GB',
    capabilities: ['balanced', 'good_summarization', 'topic_generation'],
    bestFor: ['medium_texts', 'definitions', 'examples', 'structured_content'],
    contextWindow: 128000
  },
  {
    name: 'phi3:latest',
    size: '2.2GB',
    capabilities: ['balanced', 'good_summarization', 'topic_generation'],
    bestFor: ['medium_texts', 'definitions', 'examples', 'structured_content'],
    contextWindow: 128000
  },
  {
    name: 'llama2:latest',
    size: '3.8GB',
    capabilities: ['good_summarization', 'complex_analysis', 'detailed_explanations'],
    bestFor: ['medium_complex_texts', 'detailed_summaries', 'concept_explanations'],
    contextWindow: 4096
  },
  {
    name: 'gemma2:latest',
    size: '5.4GB',
    capabilities: ['excellent_summarization', 'complex_analysis', 'creative_responses'],
    bestFor: ['complex_texts', 'dense_content', 'creative_summaries', 'study_guides'],
    contextWindow: 8192
  },
  {
    name: 'wizardlm-uncensored:13b',
    size: '7.4GB',
    capabilities: ['excellent_analysis', 'creative_writing', 'detailed_explanations', 'uncensored_responses'],
    bestFor: ['very_complex_texts', 'academic_content', 'detailed_study_guides', 'creative_analysis'],
    contextWindow: 2048
  },
  {
    name: 'gpt-oss:20b',
    size: '13GB',
    capabilities: ['exceptional_analysis', 'academic_writing', 'comprehensive_summaries', 'expert_explanations'],
    bestFor: ['highly_complex_texts', 'academic_papers', 'comprehensive_study_guides', 'expert_analysis'],
    contextWindow: 4096
  }
];

export const analyzeContent = (content: string): ContentAnalysis => {
  // Basic text analysis
  const words = content.split(/\s+/).filter(word => word.length > 0);
  const sentences = content.split(/[.!?]+/).filter(sent => sent.trim().length > 0);

  const wordCount = words.length;
  const sentenceCount = sentences.length;
  const averageSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;

  // Topic density analysis (looking for technical/academic terms)
  const technicalTerms = [
    'theory', 'analysis', 'methodology', 'framework', 'algorithm',
    'concept', 'principle', 'paradigm', 'hypothesis', 'theorem',
    'function', 'variable', 'parameter', 'equation', 'formula'
  ];

  const topicMatches = technicalTerms.reduce((count, term) => {
    return count + (content.toLowerCase().match(new RegExp(term, 'g')) || []).length;
  }, 0);

  const topicDensity = wordCount > 0 ? (topicMatches / wordCount) * 100 : 0;

  // Complexity scoring
  let complexityScore = 0;

  // Word count factor
  if (wordCount < 500) complexityScore += 1; // Simple
  else if (wordCount < 2000) complexityScore += 2; // Medium
  else if (wordCount < 5000) complexityScore += 3; // Complex
  else complexityScore += 4; // Very Complex

  // Sentence length factor
  if (averageSentenceLength < 15) complexityScore += 1;
  else if (averageSentenceLength < 25) complexityScore += 2;
  else complexityScore += 3;

  // Topic density factor
  if (topicDensity < 0.5) complexityScore += 1;
  else if (topicDensity < 1.0) complexityScore += 2;
  else complexityScore += 3;

  // Model selection logic
  let recommendedModel: string;
  let reasoning: string;

  if (complexityScore <= 3) {
    recommendedModel = 'gemma2:2b';
    reasoning = 'Simple content detected - using lightweight model for fast processing';
  } else if (complexityScore <= 5) {
    recommendedModel = wordCount < 1500 ? 'phi3:mini' : 'phi3:latest';
    reasoning = 'Medium complexity - using balanced model for good quality and speed';
  } else if (complexityScore <= 7) {
    recommendedModel = wordCount < 3000 ? 'llama2:latest' : 'gemma2:latest';
    reasoning = 'Complex content - using capable model for detailed analysis';
  } else if (complexityScore <= 9) {
    recommendedModel = 'wizardlm-uncensored:13b';
    reasoning = 'Very complex content - using advanced model for comprehensive understanding';
  } else {
    recommendedModel = 'gpt-oss:20b';
    reasoning = 'Extremely complex content - using most capable model for expert analysis';
  }

  // Estimate tokens (rough approximation: 1 token ≈ 0.75 words)
  const estimatedTokens = Math.ceil(wordCount * 1.33);

  return {
    wordCount,
    sentenceCount,
    averageSentenceLength,
    topicDensity,
    complexityScore,
    recommendedModel,
    reasoning,
    estimatedTokens
  };
};

export const getModelInfo = (modelName: string): ModelInfo | undefined => {
  return AVAILABLE_MODELS.find(model => model.name === modelName);
};

export const validateModelCompatibility = (modelName: string, analysis: ContentAnalysis): boolean => {
  const model = getModelInfo(modelName);
  if (!model) return false;

  // Check if content fits within model's context window
  return analysis.estimatedTokens <= model.contextWindow;
};

export const suggestAlternativeModel = (currentModel: string, analysis: ContentAnalysis): string | null => {
  if (validateModelCompatibility(currentModel, analysis)) {
    return null; // Current model is fine
  }

  // Find the smallest model that can handle the content
  for (const model of AVAILABLE_MODELS) {
    if (validateModelCompatibility(model.name, analysis)) {
      return model.name;
    }
  }

  return null; // No suitable model found
};
