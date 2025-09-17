import { SuggestionCategory } from '../types';

// Using neon/futuristic colors
const colorPalette = {
    red: '#FF4444',     // Bright Red for critical errors
    blue: '#00A3FF',    // Electric Blue for style
    green: '#39FF14',   // Neon Green for clarity/positive
    cyan: '#00F6FF',
    magenta: '#FF00E5',
    yellow: '#FFFF00',
};


export const categoryToColor = (category: SuggestionCategory): string => {
  switch (category) {
    case SuggestionCategory.Grammar:
    case SuggestionCategory.Spelling:
    case SuggestionCategory.Punctuation:
      return colorPalette.magenta;
    case SuggestionCategory.Style:
    case SuggestionCategory.Tone:
      return colorPalette.blue;
    case SuggestionCategory.Clarity:
    case SuggestionCategory.Conciseness:
      return colorPalette.cyan;
    default:
      return '#6B7280'; // Gray-500
  }
};

export const getAiHighlightColor = (alpha: number = 1) => {
    // A neon yellow for AI highlights
    const hexToRgb = (hex: string) => {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return { r, g, b };
    };
    const {r, g, b} = hexToRgb(colorPalette.yellow);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const scoreToColor = (score: number): string => {
  if (score < 40) return colorPalette.cyan; // Human-written
  if (score < 75) return colorPalette.yellow; // Mixed
  return colorPalette.magenta; // AI-generated
};