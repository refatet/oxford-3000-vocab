import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import { ErrorProvider } from './contexts/ErrorContext';
import { AudioProvider } from './contexts/AudioContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorProvider>
      <AudioProvider>
        <Router>
          <App />
        </Router>
      </AudioProvider>
    </ErrorProvider>
  </React.StrictMode>
);
