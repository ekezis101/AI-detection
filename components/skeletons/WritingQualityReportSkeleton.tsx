import React from 'react';

export const WritingQualityReportSkeleton: React.FC = () => {
    return (
        <div className="space-y-5 animate-pulse">
            {[...Array(3)].map((_, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800 border-l-4 border-gray-300 dark:border-gray-600">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 pt-1">
                            <div className="h-6 w-6 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        </div>
                        <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                            
                            <div className="mt-3 space-y-2 pt-2">
                                <div className="p-3 rounded-md bg-gray-200 dark:bg-gray-700/50">
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                                </div>
                                <div className="flex justify-center items-center h-5">
                                    <div className="h-5 w-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                                </div>
                                <div className="p-3 rounded-md bg-gray-200 dark:bg-gray-700/50">
                                    <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
