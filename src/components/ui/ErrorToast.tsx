import React from 'react';
import { clsx } from 'clsx';

export interface ErrorToastProps {
  message: string;
  severity?: 'error' | 'warning' | 'info';
  details?: string;
  onClose: () => void;
  autoHideDuration?: number;
  className?: string;
}

const ErrorToast: React.FC<ErrorToastProps> = ({
  message,
  severity = 'error',
  details,
  onClose,
  autoHideDuration = 5000,
  className,
}) => {
  React.useEffect(() => {
    if (autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [autoHideDuration, onClose]);

  const severityClasses = {
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  const severityIcons = {
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={clsx(
        'fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg max-w-md transition-all duration-300 transform',
        severityClasses[severity],
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <div className="mr-2 text-lg">{severityIcons[severity]}</div>
        <div className="flex-1">
          <p className="font-medium font-child-friendly">{message}</p>
          {details && (
            <p className="mt-1 text-sm font-child-friendly">{details}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ErrorToast;
