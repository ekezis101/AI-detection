import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SuggestionCategory, WritingSuggestion, PlagiarismResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    aiDetection: {
      type: Type.OBJECT,
      properties: {
        overallScore: {
          type: Type.INTEGER,
          description: "A confidence score (0-100) representing the probability that the text was AI-generated. This score is critical and must be derived from a deep, forensic linguistic analysis. Scrutinize the text for statistical markers like perplexity (word choice predictability) and burstiness (rhythmic variation in sentence structure), alongside common AI generative patterns and artifacts. A higher score indicates a greater likelihood of machine generation.",
        },
        modelBreakdown: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              model: { type: Type.STRING, description: "e.g., GPT-4, Gemini, Claude" },
              probability: { type: Type.NUMBER, description: "Likelihood percentage for this model." },
            },
            required: ["model", "probability"],
          },
        },
        highlightedPhrases: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              phrase: { type: Type.STRING, description: "The exact word or phrase highly indicative of AI generation. CRITICAL: This must be a small, precise substring, NOT the full sentence." },
              reason: { type: Type.STRING, description: "Brief reason (e.g., 'Low Perplexity', 'Repetitive Structure', 'Generic Phrasing')." },
            },
            required: ["phrase", "reason"],
          },
        },
      },
      required: ["overallScore", "modelBreakdown", "highlightedPhrases"],
    },
    writingQuality: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: {
            type: Type.STRING,
            enum: Object.values(SuggestionCategory),
            description: "Category of the suggestion.",
          },
          originalSentence: {
            type: Type.STRING,
            description: "The full sentence containing the issue, for context.",
          },
           originalPhrase: {
            type: Type.STRING,
            description: "The exact word or phrase within the sentence that has an issue. CRITICAL: This must be a precise substring of originalSentence, NOT the full sentence.",
          },
          description: {
            type: Type.STRING,
            description: "A description of the issue found.",
          },
          suggestion: {
            type: Type.STRING,
            description: "The suggested correction or improvement.",
          },
        },
        required: ["category", "originalSentence", "originalPhrase", "description", "suggestion"],
      },
    },
  },
  required: ["aiDetection", "writingQuality"],
};

const writingQualitySchema = {
    type: Type.OBJECT,
    properties: {
        writingQuality: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    category: {
                        type: Type.STRING,
                        enum: Object.values(SuggestionCategory),
                        description: "Category of the suggestion.",
                    },
                    originalSentence: {
                        type: Type.STRING,
                        description: "The sentence containing the issue.",
                    },
                    originalPhrase: {
                        type: Type.STRING,
                        description: "The exact word or phrase within the sentence that has an issue. CRITICAL: This must be a precise substring, NOT the full sentence.",
                    },
                    description: {
                        type: Type.STRING,
                        description: "A description of the issue found.",
                    },
                    suggestion: {
                        type: Type.STRING,
                        description: "The suggested correction or improvement.",
                    },
                },
                required: ["category", "originalSentence", "originalPhrase", "description", "suggestion"],
            },
        },
    },
    required: ["writingQuality"],
};


export async function analyzeText(text: string): Promise<Omit<AnalysisResult, 'plagiarism'>> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Act as a world-class forensic linguistic analyst. Your task is to provide a comprehensive analysis of the following text, focusing on AI content detection and writing quality. For both AI detection and writing quality, your analysis must be granular. When you identify a problematic segment, you MUST return only the specific word or phrase that contains the issue. DO NOT return the entire sentence. For example, if the issue is a single misspelled word, the 'originalPhrase' should be just that word. This precision is critical for the application's highlighting feature.
---
TEXT:
${text}
---`,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
      systemInstruction: `You are an expert linguistic analyst for the "ClarifyAI Grammar" application. Your task is to analyze user-submitted text with extreme accuracy. You specialize in two areas:
1.  **AI Content Detection:** Differentiating between human-written and AI-generated text by analyzing linguistic fingerprints like perplexity (randomness) and burstiness (sentence structure variation).
2.  **Writing Quality:** Identifying grammatical errors, style issues, and suggesting improvements to enhance clarity, conciseness, and impact.
When you find an issue, pinpoint the exact word or phrase that is problematic.`
    },
  });

  const jsonResponse = JSON.parse(response.text);
  return jsonResponse as Omit<AnalysisResult, 'plagiarism'>;
}

export async function checkGrammar(text: string): Promise<{writingQuality: WritingSuggestion[]}> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze the following text for writing quality issues, including grammar, spelling, punctuation, style, and tone. For each issue, identify and return the *specific phrase* that needs correction. DO NOT return the entire sentence, only the precise substring with the issue.
---
TEXT:
${text}
---`,
        config: {
            responseMimeType: "application/json",
            responseSchema: writingQualitySchema,
            systemInstruction: `You are a writing assistant for "ClarifyAI Grammar". Your sole focus is to identify and provide suggestions for writing quality issues.`
        },
    });

    return JSON.parse(response.text);
}

// Mock function for plagiarism checking
export async function checkPlagiarism(text: string): Promise<PlagiarismResult> {
    console.log("Simulating plagiarism check for:", text.substring(0, 50) + "...");
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Return a mock result
    const hasPlagiarism = text.toLowerCase().includes("contemporary digital landscape");
    if (hasPlagiarism) {
        return {
            overallPercentage: 28,
            sources: [
                { url: 'https://www.techjournal.com/ai-content-creation-trends', matchPercentage: 15 },
                { url: 'https://en.wikipedia.org/wiki/Neural_network', matchPercentage: 8 },
                { url: 'https://www.digitaltrends.com/cool-tech/what-is-ai/', matchPercentage: 5 },
            ]
        };
    }
    return {
        overallPercentage: 0,
        sources: []
    };
}

export async function humanizeText(
    text: string, 
    tone: string, 
    level: string,
    sentenceComplexity: string,
    vocabularyRichness: string,
    textLength: string
): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Please rewrite the following text to sound more human-written, adhering to the specified parameters.
- Tone: ${tone}
- Intensity/Level of change: ${level}
- Sentence Complexity: ${sentenceComplexity} (e.g., use simpler sentences, or a mix of long and short, or more complex structures)
- Vocabulary Richness: ${vocabularyRichness} (e.g., use common words, or a broader, more sophisticated vocabulary)
- Desired Output Length: ${textLength} (make the new text shorter, longer, or a similar length to the original)
- CRITICAL: Do not use contractions. For example, use "I am" instead of "I'm", and "was not" instead of "wasn't".
- IMPORTANT: Only return the rewritten text, with no extra explanations or preamble.
---
ORIGINAL TEXT:
${text}
---
REWRITTEN TEXT:`,
    });
    return response.text.trim();
}

export async function correctGrammar(text: string, dialect: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Please correct all grammar, spelling, and punctuation in the following text to strictly adhere to ${dialect} standards.
- IMPORTANT: Only return the corrected text, with no extra explanations or preamble.
---
ORIGINAL TEXT:
${text}
---
CORRECTED TEXT:`,
    });
    return response.text.trim();
}

export async function proofreadText(text: string): Promise<{writingQuality: WritingSuggestion[]}> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Perform a comprehensive proofread of the following text. Go beyond basic grammar and spelling. Focus on improving style, consistency, clarity, and overall flow. For each issue found, identify the specific phrase that needs improvement.
---
TEXT:
${text}
---`,
        config: {
            responseMimeType: "application/json",
            responseSchema: writingQualitySchema,
            systemInstruction: `You are an expert editor for "ClarifyAI Grammar". Your task is to provide high-level feedback to make the user's writing more professional and impactful.`
        },
    });

    return JSON.parse(response.text);
}

export async function summarizeText(text: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate a concise, easy-to-read summary of the following text. The summary should capture the main points and key information.
---
TEXT:
${text}
---
SUMMARY:`,
    });
    return response.text.trim();
}

export async function translateText(text: string, language: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Please translate the following text into ${language}.
- IMPORTANT: Only return the translated text, with no extra explanations or preamble.
---
ORIGINAL TEXT:
${text}
---
TRANSLATED TEXT:`,
    });
    return response.text.trim();
}

export async function detectLanguage(text: string): Promise<string> {
    // Avoid API calls for very short or empty text to save resources.
    if (text.trim().length < 20) {
        return "English";
    }
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Detect the language of the following text. Respond with only the name of the language (e.g., 'Spanish', 'French', 'English').
---
TEXT:
${text}
---
LANGUAGE:`,
        config: {
            // Disable thinking for this simple, low-latency task for a faster response.
            thinkingConfig: { thinkingBudget: 0 }
        }
    });
    return response.text.trim();
}
