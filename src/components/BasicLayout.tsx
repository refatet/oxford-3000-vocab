import React, { ReactNode } from 'react';
import { clsx } from 'clsx';
import Button from './ui/Button';
import ProgressBar from './ui/ProgressBar';
import ErrorBoundary from './ui/ErrorBoundary';

export interface BasicLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  showProgress?: boolean;
  progressValue?: number;
  progressLabel?: string;
  rightContent?: ReactNode;
  className?: string;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  showProgress = false,
  progressValue = 0,
  progressLabel,
  rightContent,
  className,
}) => {
  return (
    <ErrorBoundary>
      <div className={clsx('min-h-screen bg-gray-100 flex flex-col', className)}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {showBackButton && onBackClick && (
                  <Button
                    variant="outline"
                    onClick={onBackClick}
                    className="mr-4"
                    aria-label="뒤로 가기"
                  >
                    ←
                  </Button>
                )}
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-child-friendly">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-sm text-gray-500 font-child-friendly mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              </div>
              
              {rightContent && (
                <div>
                  {rightContent}
                </div>
              )}
            </div>
            
            {showProgress && (
              <div className="mt-4">
                <ProgressBar
                  value={progressValue}
                  max={100}
                  label={progressLabel}
                  color="primary"
                  size="sm"
                />
              </div>
            )}
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="text-center text-sm text-gray-500 font-child-friendly">
              Oxford 3000 Vocabulary Learning App © {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default BasicLayout;
