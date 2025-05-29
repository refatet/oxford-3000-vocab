import React, { createContext, useContext, useState, ReactNode } from 'react';

type ErrorSeverity = 'error' | 'warning' | 'info';

interface ErrorContextType {
  showError: (message: string, severity?: ErrorSeverity, details?: string) => void;
  hideError: () => void;
  error: {
    visible: boolean;
    message: string;
    severity: ErrorSeverity;
    details?: string;
  };
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState({
    visible: false,
    message: '',
    severity: 'error' as ErrorSeverity,
    details: undefined as string | undefined,
  });

  const showError = (message: string, severity: ErrorSeverity = 'error', details?: string) => {
    setError({
      visible: true,
      message,
      severity,
      details,
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`[${severity.toUpperCase()}] ${message}`, details || '');
    }
  };

  const hideError = () => {
    setError(prev => ({
      ...prev,
      visible: false,
    }));
  };

  return (
    <ErrorContext.Provider
      value={{
        showError,
        hideError,
        error,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  
  if (context === undefined) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  
  return context;
};
