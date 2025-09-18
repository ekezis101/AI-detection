import React from 'react';
import { diffChars } from 'diff';
import { CloseIcon } from './icons';
import { Tooltip } from './Tooltip';

interface ComparisonViewProps {
  originalText: string;
  modifiedText: string;
  onAccept: () => void;
  onDiscard: () => void;
}

const DiffPane: React.FC<{ title: string; content: React.ReactNode }> = ({ title, content }) => (
  <div className="w-full lg:w-1/2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 h-full overflow-y-auto">
    <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200 sticky top-0 bg-white dark:bg-gray-900 py-2 border-b border-gray-200 dark:border-gray-700">{title}</h3>
    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-700 dark:text-gray-300">{content}</pre>
  </div>
);

export const ComparisonView: React.FC<ComparisonViewProps> = ({ originalText, modifiedText, onAccept, onDiscard }) => {
  const differences = diffChars(originalText, modifiedText);

  const originalContent = differences.map((part, index) => {
    const style = part.added ? { display: 'none' } : part.removed ? { backgroundColor: 'rgba(239, 68, 68, 0.2)', textDecoration: 'line-through' } : {};
    return <span key={index} style={style}>{part.value}</span>;
  });

  const modifiedContent = differences.map((part, index) => {
    const style = part.removed ? { display: 'none' } : part.added ? { backgroundColor: 'rgba(16, 185, 129, 0.2)' } : {};
    return <span key={index} style={style}>{part.value}</span>;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex flex-col p-4 md:p-8" aria-modal="true" role="dialog">
      <div className="flex-shrink-0 flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">Review Changes</h2>
        <Tooltip title="Close and discard all changes" position="bottom">
            <button onClick={onDiscard} className="p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Close review">
                <CloseIcon className="h-6 w-6 text-white" />
            </button>
        </Tooltip>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-4 min-h-0">
        <DiffPane title="Before" content={originalContent} />
        <DiffPane title="After" content={modifiedContent} />
      </div>

      <div className="flex-shrink-0 flex justify-end space-x-4 mt-6">
        <Tooltip title="Revert to the original text">
            <button
                onClick={onDiscard}
                className="px-6 py-2 text-sm font-medium text-gray-200 bg-transparent border border-gray-500 rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
                Discard Changes
            </button>
        </Tooltip>
        <Tooltip title="Apply the new version to the main editor">
            <button
                onClick={onAccept}
                className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                Accept Changes
            </button>
        </Tooltip>
      </div>
    </div>
  );
};