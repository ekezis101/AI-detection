import React from 'react';
import { AnalysisResult, WritingSuggestion } from '../types';
import { AiDetectionReport } from './AiDetectionReport';
import { WritingQualityReport } from './WritingQualityReport';
import { PlagiarismReport } from './PlagiarismReport';
import { TAB_AI_DETECTION, TAB_WRITING_QUALITY, TAB_PLAGIARISM } from '../constants';
import { Tooltip } from './Tooltip';

interface ResultsPanelProps {
  result: AnalysisResult | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoading?: boolean;
  onApplySuggestion: (suggestion: WritingSuggestion) => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({ result, activeTab, setActiveTab, isLoading, onApplySuggestion }) => {
  const tabs = [TAB_AI_DETECTION, TAB_WRITING_QUALITY, TAB_PLAGIARISM];

  const qualityIssueCount = result?.writingQuality.length ?? 0;
  const plagiarismSourceCount = result?.plagiarism?.sources.length ?? 0;
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-[var(--border-color)]">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {tabs.map((tab) => {
            // Conditionally render tabs based on available data, or if loading
            if (tab === TAB_PLAGIARISM && !result?.plagiarism && !isLoading) return null;
            if (tab === TAB_AI_DETECTION && !result?.aiDetection && !isLoading) return null;

            return (
              <Tooltip key={tab} title={`View ${tab} Report`} position="bottom">
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`${
                    activeTab === tab
                      ? 'border-[var(--accent-cyan)] text-[var(--accent-cyan)]'
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center`}
                >
                  {tab}
                  {tab === TAB_WRITING_QUALITY && qualityIssueCount > 0 && !isLoading && (
                    <span className={`ml-2 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activeTab === tab ? 'bg-cyan-900/50 text-cyan-300' : 'bg-gray-700 text-gray-200'
                    }`}>
                      {qualityIssueCount}
                    </span>
                  )}
                  {tab === TAB_PLAGIARISM && plagiarismSourceCount > 0 && !isLoading && (
                    <span className={`ml-2 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        activeTab === tab ? 'bg-cyan-900/50 text-cyan-300' : 'bg-gray-700 text-gray-200'
                    }`}>
                      {plagiarismSourceCount}
                    </span>
                  )}
                </button>
              </Tooltip>
            )
          })}
        </nav>
      </div>

      <div className="flex-grow mt-5 overflow-y-auto" style={{maxHeight: '400px'}}>
        {activeTab === TAB_AI_DETECTION && <AiDetectionReport data={result?.aiDetection} plagiarismPercentage={result?.plagiarism?.overallPercentage} isLoading={isLoading} />}
        {activeTab === TAB_WRITING_QUALITY && <WritingQualityReport data={result?.writingQuality} isLoading={isLoading} onApplySuggestion={onApplySuggestion} />}
        {activeTab === TAB_PLAGIARISM && <PlagiarismReport data={result?.plagiarism} isLoading={isLoading} />}
      </div>
    </div>
  );
};