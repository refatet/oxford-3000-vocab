import React from 'react';
import { clsx } from 'clsx';
import SkeletonLoader from './SkeletonLoader';

export interface SkeletonCardProps {
  variant?: 'word' | 'quiz' | 'progress' | 'stats';
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = 'word',
  className,
}) => {
  const baseClasses = 'bg-white rounded-xl shadow-md p-6 w-full';
  
  const renderContent = () => {
    switch (variant) {
      case 'word':
        return (
          <>
            <SkeletonLoader variant="text" className="w-1/3 mb-4" />
            <SkeletonLoader variant="rectangle" height="120px" className="mb-4" />
            <SkeletonLoader variant="text" className="w-full mb-2" />
            <SkeletonLoader variant="text" className="w-3/4 mb-4" />
            <div className="flex justify-between mt-4">
              <SkeletonLoader variant="rectangle" width="48%" height="36px" />
              <SkeletonLoader variant="rectangle" width="48%" height="36px" />
            </div>
          </>
        );
      
      case 'quiz':
        return (
          <>
            <SkeletonLoader variant="text" className="w-2/3 mb-4" />
            <SkeletonLoader variant="rectangle" height="100px" className="mb-6" />
            <div className="space-y-3">
              <SkeletonLoader variant="rectangle" height="40px" />
              <SkeletonLoader variant="rectangle" height="40px" />
              <SkeletonLoader variant="rectangle" height="40px" />
              <SkeletonLoader variant="rectangle" height="40px" />
            </div>
          </>
        );
      
      case 'progress':
        return (
          <>
            <SkeletonLoader variant="text" className="w-1/2 mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <SkeletonLoader variant="rectangle" height="60px" />
              <SkeletonLoader variant="rectangle" height="60px" />
              <SkeletonLoader variant="rectangle" height="60px" />
              <SkeletonLoader variant="rectangle" height="60px" />
            </div>
            <SkeletonLoader variant="text" className="w-1/3 mb-2" />
            <SkeletonLoader variant="progress" className="mb-6" />
            <SkeletonLoader variant="text" className="w-1/3 mb-2" />
            <SkeletonLoader variant="progress" />
          </>
        );
      
      case 'stats':
        return (
          <>
            <SkeletonLoader variant="text" className="w-1/3 mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <SkeletonLoader variant="rectangle" height="80px" />
              <SkeletonLoader variant="rectangle" height="80px" />
            </div>
            <SkeletonLoader variant="text" className="w-full mb-2" />
            <SkeletonLoader variant="text" className="w-3/4 mb-4" />
            <SkeletonLoader variant="rectangle" height="120px" />
          </>
        );
      
      default:
        return <SkeletonLoader variant="card" />;
    }
  };
  
  return (
    <div className={clsx(baseClasses, className)}>
      {renderContent()}
    </div>
  );
};

export default SkeletonCard;
