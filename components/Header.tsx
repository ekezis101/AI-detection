import React from 'react';
import { AppLogoIcon, FeedbackIcon } from './icons';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  onFeedbackClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onFeedbackClick }) => {
  return (
    <header className="p-4 border-b border-[var(--border-color)] bg-black/30 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex items-center justify-between">
        <div className="w-28 md:w-36"></div>
        <div className="flex items-center space-x-3">
            <AppLogoIcon className="h-8 w-8" />
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-wider brand-glow">
                ClarifyAI Grammar
            </h1>
        </div>
        <div className="flex justify-end w-28 md:w-36">
          <Tooltip title="Submit feedback or suggest a feature" position="bottom">
            <button
                onClick={onFeedbackClick}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-[var(--text-light)] hover:bg-[var(--glass-bg)] rounded-lg transition-colors"
                aria-label="Submit Feedback"
            >
                <FeedbackIcon className="h-5 w-5" />
                <span className="hidden md:inline">Feedback</span>
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
};