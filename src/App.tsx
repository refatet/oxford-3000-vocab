import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import WordCardPage from './pages/WordCardPage';
import RWLPage from './pages/RWLPage';
import ProgressPage from './pages/ProgressPage';
import ErrorToast from './components/ui/ErrorToast';
import { useError } from './contexts/ErrorContext';

const App: React.FC = () => {
  const { error, hideError } = useError();

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:level" element={<QuizPage />} />
        <Route path="/wordcard" element={<WordCardPage />} />
        <Route path="/rwl" element={<RWLPage />} />
        <Route path="/progress" element={<ProgressPage />} />
      </Routes>
      
      {error.visible && (
        <ErrorToast
          message={error.message}
          severity={error.severity}
          details={error.details}
          onClose={hideError}
        />
      )}
    </>
  );
};

export default App;
