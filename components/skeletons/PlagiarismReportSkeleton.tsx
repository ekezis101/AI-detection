import React from 'react';

export const PlagiarismReportSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Overall Match Skeleton */}
            <div className="text-center">
                <div className="h-5 w-32 mx-auto bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-14 w-24 mx-auto mt-2 bg-gray-200 dark:bg-gray-700/50 rounded"></div>
                <div className="h-4 w-48 mx-auto mt-2 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>

            {/* Matched Sources Skeleton */}
            <div>
                <div className="h-5 w-40 mb-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between gap-4">
                            <div className="flex-grow h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="flex-shrink-0 h-7 w-20 bg-gray-200 dark:bg-gray-700/50 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
