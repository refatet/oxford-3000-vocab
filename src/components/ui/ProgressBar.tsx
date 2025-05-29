import React from 'react';
import { clsx } from 'clsx';

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  color?: 'primary' | 'secondary' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  color = 'primary',
  size = 'md',
  showPercentage = true,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  
  const baseClasses = 'w-full rounded-full overflow-hidden bg-gray-200';
  
  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    warning: 'bg-warning-500',
    danger: 'bg-red-600',
  };
  
  const sizeClasses = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };
  
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-700 font-child-friendly">
            {label}
          </span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-700 font-child-friendly">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={clsx(baseClasses, sizeClasses[size])}>
        <div
          className={clsx(
            'transition-all duration-300 ease-in-out',
            colorClasses[color],
            sizeClasses[size]
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
