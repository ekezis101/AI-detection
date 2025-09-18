import React from 'react';
import { TranslateIcon, CloseIcon } from './icons';
import { Tooltip } from './Tooltip';

interface TranslationPromptProps {
  language: string;
  onTranslate: () => void;
  onDismiss: () => void;
  isTranslating: boolean;
}

export const TranslationPrompt: React.FC<TranslationPromptProps> = ({ language, onTranslate, onDismiss, isTranslating }) => {
  return (
    <div className="mb-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700 flex items-center justify-between gap-4 transition-all duration-300 ease-in-out">
      <div className="flex items-center">
        <TranslateIcon className="h-6 w-6 text-indigo-500 dark:text-indigo-300 mr-3 flex-shrink-0" />
        <p className="text-sm text-indigo-800 dark:text-indigo-200">
          We've detected the language is <span className="font-bold">{language}</span>. Would you like to translate it to English?
        </p>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <Tooltip title="Translate text to English">
          <button
            onClick={onTranslate}
            disabled={isTranslating}
            className="px-3 py-1.5 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-wait"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </Tooltip>
        <Tooltip title="Dismiss">
          <button
            onClick={onDismiss}
            disabled={isTranslating}
            className="p-1.5 rounded-full text-indigo-600 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 disabled:opacity-50"
            aria-label="Dismiss translation prompt"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
