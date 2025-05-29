import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BasicLayout from '../../components/BasicLayout';

describe('BasicLayout Component', () => {
  test('renders with title and children', () => {
    render(
      <MemoryRouter>
        <BasicLayout title="Test Title">
          <div data-testid="test-content">Test Content</div>
        </BasicLayout>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('renders with subtitle when provided', () => {
    render(
      <MemoryRouter>
        <BasicLayout title="Test Title" subtitle="Test Subtitle">
          <div>Test Content</div>
        </BasicLayout>
      </MemoryRouter>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  test('renders back button when showBackButton is true', () => {
    const mockOnBackClick = jest.fn();
    
    render(
      <MemoryRouter>
        <BasicLayout 
          title="Test Title" 
          showBackButton={true}
          onBackClick={mockOnBackClick}
        >
          <div>Test Content</div>
        </BasicLayout>
      </MemoryRouter>
    );
    
    const backButton = screen.getByRole('button', { name: /뒤로 가기/i });
    expect(backButton).toBeInTheDocument();
  });

  test('renders progress bar when showProgress is true', () => {
    render(
      <MemoryRouter>
        <BasicLayout 
          title="Test Title" 
          showProgress={true}
          progressValue={50}
          progressLabel="Test Progress"
        >
          <div>Test Content</div>
        </BasicLayout>
      </MemoryRouter>
    );
    
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(screen.getByText('Test Progress')).toBeInTheDocument();
  });

  test('renders right content when provided', () => {
    render(
      <MemoryRouter>
        <BasicLayout 
          title="Test Title" 
          rightContent={<div data-testid="right-content">Right Content</div>}
        >
          <div>Test Content</div>
        </BasicLayout>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('right-content')).toBeInTheDocument();
    expect(screen.getByText('Right Content')).toBeInTheDocument();
  });
});
