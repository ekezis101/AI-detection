import React from 'react';

interface CircularProgressBarProps {
  percentage: number;
  color: string;
}

export const CircularProgressBar: React.FC<CircularProgressBarProps> = ({ percentage, color }) => {
  const radius = 50;
  const stroke = 10;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative my-4" style={{ width: '150px', height: '150px' }}>
      <svg
        height="100%"
        width="100%"
        viewBox={`0 0 ${radius * 2} ${radius * 2}`}
        className="transform -rotate-90"
      >
        <circle
          stroke="var(--bg-dark-2)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center text-3xl font-bold"
        style={{ color: color }}
      >
        {Math.round(percentage)}%
      </div>
    </div>
  );
};