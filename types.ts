export interface ModelBreakdown {
  model: string;
  probability: number;
}

export interface HighlightedPhrase {
  /** The specific word or phrase flagged by AI detection. */
  phrase: string;
  /** The reason why this phrase was flagged (e.g., 'Low Perplexity'). */
  reason: string;
}

export interface AiDetectionResult {
  overallScore: number;
  modelBreakdown: ModelBreakdown[];
  highlightedPhrases: HighlightedPhrase[];
}

export enum SuggestionCategory {
  Grammar = "Grammar",
  Spelling = "Spelling",
  Punctuation = "Punctuation",
  Style = "Style",
  Clarity = "Clarity",
  Conciseness = "Conciseness",
  Tone = "Tone",
}

export interface WritingSuggestion {
  category: SuggestionCategory;
  /** The full original sentence containing the issue, for providing context. */
  originalSentence: string;
  /** The specific word or phrase within the sentence that has an issue, for highlighting. */
  originalPhrase: string;
  description: string;
  suggestion: string;
}

export interface PlagiarismSource {
  url: string;
  matchPercentage: number;
}

export interface PlagiarismResult {
  overallPercentage: number;
  sources: PlagiarismSource[];
}

export interface AnalysisResult {
  aiDetection: AiDetectionResult;
  writingQuality: WritingSuggestion[];
  plagiarism?: PlagiarismResult;
}

export enum AnalysisStatus {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}