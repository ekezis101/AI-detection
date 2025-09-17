import React from 'react';

export const AiDetectionReportSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Authenticity Score Skeleton */}
      <div className="p-4 rounded-lg bg-gray-200 dark:bg-gray-700/50">
          <div className="h-5 w-40 mx-auto bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-12 w-24 mx-auto mt-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
          <div className="h-3 w-64 mx-auto mt-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
      </div>

      {/* AI Detection Score Skeleton */}
      <div className="flex flex-col items-center">
        <div className="h-5 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
        <div className="rounded-full bg-gray-200 dark:bg-gray-700/50 h-[150px] w-[150px] my-2"></div>
        <div className="h-4 w-72 bg-gray-300 dark:bg-gray-600 rounded mt-2"></div>
      </div>

      {/* Disclaimer Skeleton */}
      <div className="p-3 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-lg"></div>

      {/* Pie Chart Skeleton */}
      <div>
        <div className="h-5 w-56 mb-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="h-48 w-full bg-gray-200 dark:bg-gray-700/50 rounded-lg"></div>
      </div>

      {/* Phrases Skeleton */}
      <div>
        <div className="h-5 w-48 mb-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
        <div className="space-y-4">
          <div className="h-20 w-full bg-gray-200 dark:bg-gray-700/50 rounded-lg"></div>
          <div className="h-20 w-full bg-gray-200 dark:bg-gray-700/50 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};
