import React from 'react';
import { PlagiarismResult } from '../types';
import { ExternalLinkIcon } from './icons';
import { PlagiarismReportSkeleton } from './skeletons/PlagiarismReportSkeleton';
import { Tooltip } from './Tooltip';

interface PlagiarismReportProps {
  data?: PlagiarismResult;
  isLoading?: boolean;
}

export const PlagiarismReport: React.FC<PlagiarismReportProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return <PlagiarismReportSkeleton />;
  }
  
  if (!data || data.sources.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Plagiarism Detected</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Your text appears to be original.</p>
      </div>
    );
  }

  const scoreColor = data.overallPercentage > 0 ? 'text-red-500' : 'text-green-500';

  return (
    <div className="space-y-6">
        <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Overall Match</h3>
            <p className={`text-5xl font-bold mt-2 ${scoreColor}`}>{data.overallPercentage}%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.sources.length} matched source(s) found.</p>
        </div>
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Matched Sources</h3>
        <ul className="space-y-3">
          {data.sources.map((source, index) => (
            <li key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between gap-4">
                <div className="flex-grow">
                  <Tooltip title={`Visit source: ${source.url}`}>
                    <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        <span className="truncate">{source.url}</span>
                        <ExternalLinkIcon className="h-4 w-4 ml-2 flex-shrink-0"/>
                    </a>
                  </Tooltip>
                </div>
                <div className="flex-shrink-0 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50 px-2.5 py-1 rounded-full">
                    {source.matchPercentage}% Match
                </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
