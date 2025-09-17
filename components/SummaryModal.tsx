import React, { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';
import { CopyIcon, CloseIcon } from './icons';

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: string;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, summary }) => {
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    // Reset copy status when the summary changes
    setCopyStatus('idle');
  }, [summary]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(summary).then(() => {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl m-4 transform transition-all">
        <div className="p-6 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Generated Summary</h2>
            <Tooltip title="Close">
                <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <CloseIcon className="h-6 w-6"/>
                </button>
            </Tooltip>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
            <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {summary}
            </p>
        </div>
        
        <div className="p-6 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
          <Tooltip title="Close this window">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Close
            </button>
          </Tooltip>
          <Tooltip title="Copy summary to clipboard">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <CopyIcon className="h-5 w-5 mr-2"/>
              {copyStatus === 'copied' ? 'Copied!' : 'Copy Summary'}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};