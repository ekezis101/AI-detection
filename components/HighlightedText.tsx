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

  // Create a regex that finds any of the highlight strings
  const regex = new RegExp(`(${highlights.map(h => h.text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  const parts = text.split(regex);
  
  // FIX: Explicitly type the Map to ensure `get` returns `Highlight | undefined`.
  const highlightMap = new Map<string, Highlight>(highlights.map(h => [h.text, h]));

  return (
    <p className="whitespace-pre-wrap leading-relaxed text-gray-700 dark:text-gray-300">
      {parts.map((part, index) => {
        const highlight = highlightMap.get(part);
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