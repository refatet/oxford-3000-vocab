import React from 'react';
import { clsx } from 'clsx';

export interface SkeletonLoaderProps {
  variant?: 'text' | 'circle' | 'rectangle' | 'card' | 'progress';
  width?: string;
  height?: string;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  className,
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    text: 'h-4 w-full',
    circle: 'rounded-full',
    rectangle: 'w-full',
    card: 'w-full h-32 rounded-lg',
    progress: 'w-full h-4 rounded-full',
  };
  
  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      aria-hidden="true"
    />
  );
};

export default SkeletonLoader;
