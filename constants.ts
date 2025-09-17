export const TAB_AI_DETECTION = 'AI Detection';
export const TAB_WRITING_QUALITY = 'Writing Quality';
export const TAB_PLAGIARISM = 'Plagiarism';

export const DEFAULT_TEXT = `In the contemporary digital landscape, the proliferation of artificial intelligence has irrevocably altered the paradigm of content creation. Leveraging sophisticated neural networks, these systems can generate text that is virtually indistinguishable from human prose. This capability presents both unprecedented opportunities and significant challenges. For instance, the automation of content generation can streamline workflows and enhance productivity across various sectors. However, it also necessitates the development of robust mechanisms for identifying machine-generated text to maintain authenticity and combat misinformation. Ensuring the ethical deployment of these powerful tools is paramount for the future of digital communication. The text is very good and has no errors.`;

export const HUMANIZETONE_OPTIONS = ["Casual", "Formal", "Professional", "Academic", "Creative", "Empathetic", "Enthusiastic", "Sarcastic", "Objective"];
export const HUMANIZELEVEL_OPTIONS = ["Subtle", "Moderate", "Strong"];
export const SENTENCE_COMPLEXITY_OPTIONS = ["Simple", "Varied", "Complex"];
export const VOCABULARY_RICHNESS_OPTIONS = ["Basic", "Standard", "Expansive"];
export const TEXT_LENGTH_OPTIONS = ["Shorter", "Similar Length", "Longer"];

export const LANGUAGE_OPTIONS = [
  "Spanish",
  "French",
  "German",
  "Japanese",
  "Mandarin Chinese",
  "Russian",
  "Arabic",
  "Portuguese",
  "Italian",
  "Korean",
];

export const CORRECTION_DIALECT_OPTIONS = ["American English", "UK English"];

export const SCORE_DESCRIPTIONS: { [key: string]: string } = {
    low: "This text appears to be human-written.",
    medium: "This text has characteristics of both human and AI writing.",
    high: "This text is likely AI-generated.",
};