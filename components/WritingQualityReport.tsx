import React from 'react';
import { WritingSuggestion, SuggestionCategory } from '../types';
import {
    GrammarIcon,
    StyleIcon,
    ClarityIcon,
    SpellingIcon,
    PunctuationIcon,
    ConcisenessIcon,
    ToneIcon,
    CorrectGrammarIcon
} from './icons';
import { categoryToColor } from '../utils/colorUtils';
import { WritingQualityReportSkeleton } from './skeletons/WritingQualityReportSkeleton';
import { Tooltip } from './Tooltip';

interface WritingQualityReportProps {
  data?: WritingSuggestion[];
  isLoading?: boolean;
  onApplySuggestion: (suggestion: WritingSuggestion) => void;
}

const CategoryIcon: React.FC<{ category: SuggestionCategory }> = ({ category }) => {
    const iconProps = { className: "h-5 w-5" };
    switch (category) {
        case SuggestionCategory.Grammar:
            return <GrammarIcon {...iconProps} />;
        case SuggestionCategory.Spelling:
            return <SpellingIcon {...iconProps} />;
        case SuggestionCategory.Punctuation:
            return <PunctuationIcon {...iconProps} />;
        case SuggestionCategory.Style:
            return <StyleIcon {...iconProps} />;
        case SuggestionCategory.Conciseness:
            return <ConcisenessIcon {...iconProps} />;
        case SuggestionCategory.Tone:
            return <ToneIcon {...iconProps} />;
        case SuggestionCategory.Clarity:
            return <ClarityIcon {...iconProps} />;
        default:
            return <StyleIcon {...iconProps} />;
    }
};

export const WritingQualityReport: React.FC<WritingQualityReportProps> = ({ data, isLoading, onApplySuggestion }) => {
  if (isLoading) {
    return <WritingQualityReportSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Suggestions Found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Looks like your text is clear and correct!</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {data.map((item, index) => {
        const borderColor = categoryToColor(item.category);
        return (
          <div key={index} className="p-4 rounded-lg border-l-4 bg-gray-100 dark:bg-gray-800" style={{ borderColor }}>
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-1" style={{ color: borderColor }}>
                    <CategoryIcon category={item.category} />
                </div>
                <div>
                    <p className="text-sm font-semibold" style={{ color: borderColor }}>{item.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p>
                    <div className="mt-3 space-y-2">
                        <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50">
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {item.originalSentence.split(item.originalPhrase).map((part, i, arr) => (
                                    <React.Fragment key={i}>
                                        <span className="line-through">{part}</span>
                                        {i < arr.length - 1 && (
                                            <span className="line-through font-bold bg-red-200 dark:bg-red-800/50 px-1 rounded">
                                                {item.originalPhrase}
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </p>
                        </div>
                        <div className="flex justify-center">
                            <svg className="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50">
                            <p className="text-sm text-green-800 dark:text-green-300 flex-grow pr-2">
                                {item.suggestion}
                            </p>
                            <Tooltip title="Apply this suggestion">
                                <button
                                    onClick={() => onApplySuggestion(item)}
                                    className="flex-shrink-0 p-1.5 rounded-full text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50 transition-colors"
                                    aria-label="Apply suggestion"
                                >
                                    <CorrectGrammarIcon className="h-5 w-5" />
                                </button>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};