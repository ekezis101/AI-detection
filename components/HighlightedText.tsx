import React from 'react';

interface Highlight {
  text: string;
  color: string;
  tooltip: string;
}

interface HighlightedTextProps {
  text: string;
  highlights: Highlight[];
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, highlights }) => {
  if (highlights.length === 0) {
    return <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">{text}</p>;
  }

  // Create a regex that finds any of the highlight strings, escape special regex characters
  const escapedHighlights = highlights.map(h => h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escapedHighlights.join('|')})`, 'gi'); // Added case-insensitive flag
  const parts = text.split(regex);
  
  // Create a case-insensitive map for better matching
  const highlightMap = new Map<string, Highlight>(highlights.map(h => [h.text, h]));
  const lowerCaseMap = new Map<string, Highlight>(highlights.map(h => [h.text.toLowerCase(), h]));

  return (
    <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
      {parts.map((part, index) => {
        const highlight = highlightMap.get(part) || lowerCaseMap.get(part.toLowerCase());
        if (highlight) {
          return (
            <span key={index} className="relative group rounded px-1 py-0.5" style={{ backgroundColor: highlight.color }}>
              {part}
              <span className="absolute bottom-full mb-2 w-max max-w-xs p-2 text-xs text-white bg-gray-800 dark:bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 left-1/2 -translate-x-1/2">
                {highlight.tooltip}
              </span>
            </span>
          );
        }
        return part;
      })}
    </p>
  );
};