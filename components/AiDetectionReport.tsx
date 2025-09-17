

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AiDetectionResult } from '../types';
import { AiSignalIcon, AuthenticityIcon, InfoIcon } from './icons';
import { scoreToColor } from '../utils/colorUtils';
import { CircularProgressBar } from './CircularProgressBar';
import { SCORE_DESCRIPTIONS } from '../constants';
import { AiDetectionReportSkeleton } from './skeletons/AiDetectionReportSkeleton';

interface AiDetectionReportProps {
  data?: AiDetectionResult;
  plagiarismPercentage?: number;
  isLoading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 dark:text-gray-100">{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};

export const AiDetectionReport: React.FC<AiDetectionReportProps> = ({ data, plagiarismPercentage, isLoading }) => {
  if (isLoading) {
    return <AiDetectionReportSkeleton />;
  }

  if (!data) {
    return null; // Or some placeholder if needed when not loading but no data
  }

  const chartData = data.modelBreakdown.filter(item => item.probability > 0).map(item => ({...item}));
  const scoreColor = scoreToColor(data.overallScore);

  const getScoreDescription = (score: number) => {
    if (score < 40) return SCORE_DESCRIPTIONS.low;
    if (score < 75) return SCORE_DESCRIPTIONS.medium;
    return SCORE_DESCRIPTIONS.high;
  }

  const hasPlagiarismData = plagiarismPercentage !== undefined;
  let authenticityScore: number | null = null;
  if (hasPlagiarismData) {
      const humanScore = 100 - data.overallScore;
      const originalityScore = 100 - plagiarismPercentage!;
      authenticityScore = Math.round((humanScore + originalityScore) / 2);
  }

  return (
    <div className="space-y-6">
      {authenticityScore !== null && (
        <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700 text-center">
            <h3 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 flex items-center justify-center">
                <AuthenticityIcon className="h-6 w-6 mr-2" />
                Authenticity Score
            </h3>
            <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{authenticityScore}%</p>
            <p className="text-sm text-indigo-500 dark:text-indigo-300 mt-1">
                A combined measure of human-like writing and originality.
            </p>
        </div>
      )}

      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">AI Detection Score</h3>
        <CircularProgressBar percentage={data.overallScore} color={scoreColor} />
        <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
            {getScoreDescription(data.overallScore)}
        </p>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg text-center">
          <div className="flex items-center justify-center text-sm text-blue-800 dark:text-blue-200">
              <InfoIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <p><span className="font-semibold">A Note on AI Detection:</span> Our score is based on an advanced forensic analysis of linguistic patterns. While highly accurate, no AI detection tool is 100% infallible. This result should be used as a strong indicator, not an absolute guarantee. Always apply human judgment.</p>
          </div>
      </div>

      {chartData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Potential AI Model Breakdown</h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="probability"
                  nameKey="model"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {data.highlightedPhrases.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Phrases with AI Signals</h3>
          <ul className="space-y-4">
            {data.highlightedPhrases.map((item, index) => (
              <li key={index} className="p-3 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-400 dark:border-amber-500 rounded-r-lg">
                <p className="italic text-gray-700 dark:text-gray-300">"{item.phrase}"</p>
                <div className="flex items-center mt-2 text-sm text-amber-800 dark:text-amber-300">
                  <AiSignalIcon className="h-4 w-4 mr-2"/>
                  <span className="font-semibold">{item.reason}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};