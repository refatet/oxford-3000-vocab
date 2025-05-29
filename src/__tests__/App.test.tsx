import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { ErrorProvider } from '../contexts/ErrorContext';
import { AudioProvider } from '../contexts/AudioContext';

// Mock the page components
jest.mock('../pages/HomePage', () => () => <div data-testid="home-page">Home Page</div>);
jest.mock('../pages/QuizPage', () => () => <div data-testid="quiz-page">Quiz Page</div>);
jest.mock('../pages/WordCardPage', () => () => <div data-testid="wordcard-page">Word Card Page</div>);
jest.mock('../pages/RWLPage', () => () => <div data-testid="rwl-page">RWL Page</div>);
jest.mock('../pages/ProgressPage', () => () => <div data-testid="progress-page">Progress Page</div>);

const renderWithProviders = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <ErrorProvider>
      <AudioProvider>
        <MemoryRouter initialEntries={[route]}>
          {ui}
        </MemoryRouter>
      </AudioProvider>
    </ErrorProvider>
  );
};

describe('App Component', () => {
  test('renders HomePage on root route', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('home-page')).toBeInTheDocument();
  });

  test('renders QuizPage on /quiz/:level route', () => {
    renderWithProviders(<App />, { route: '/quiz/1' });
    expect(screen.getByTestId('quiz-page')).toBeInTheDocument();
  });

  test('renders WordCardPage on /wordcard route', () => {
    renderWithProviders(<App />, { route: '/wordcard' });
    expect(screen.getByTestId('wordcard-page')).toBeInTheDocument();
  });

  test('renders RWLPage on /rwl route', () => {
    renderWithProviders(<App />, { route: '/rwl' });
    expect(screen.getByTestId('rwl-page')).toBeInTheDocument();
  });

  test('renders ProgressPage on /progress route', () => {
    renderWithProviders(<App />, { route: '/progress' });
    expect(screen.getByTestId('progress-page')).toBeInTheDocument();
  });
});
