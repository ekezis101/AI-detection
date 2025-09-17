import React from 'react';

interface TooltipProps {
  title: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ title, children, position = 'top', className = '' }) => {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={`relative group inline-block ${className}`}>
      {children}
      <div
        className={`absolute whitespace-nowrap z-50 p-2 text-xs text-white bg-gray-800 dark:bg-black rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none ${positionClasses[position]}`}
        role="tooltip"
      >
        {title}
      </div>
    </div>
  );
};
