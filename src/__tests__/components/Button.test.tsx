import React from 'react';
import { render, screen } from '@testing-library/react';
import Button from '../../components/ui/Button';

describe('Button Component', () => {
  test('renders button with default props', () => {
    render(<Button>Test Button</Button>);
    const buttonElement = screen.getByText('Test Button');
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement.tagName).toBe('BUTTON');
    expect(buttonElement).toHaveClass('bg-primary-600');
  });

  test('renders button with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary Button</Button>);
    expect(screen.getByText('Secondary Button')).toHaveClass('bg-secondary-600');

    rerender(<Button variant="outline">Outline Button</Button>);
    expect(screen.getByText('Outline Button')).toHaveClass('bg-white');

    rerender(<Button variant="danger">Danger Button</Button>);
    expect(screen.getByText('Danger Button')).toHaveClass('bg-red-600');
  });

  test('renders button with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small Button</Button>);
    expect(screen.getByText('Small Button')).toHaveClass('py-1');

    rerender(<Button size="md">Medium Button</Button>);
    expect(screen.getByText('Medium Button')).toHaveClass('py-2');

    rerender(<Button size="lg">Large Button</Button>);
    expect(screen.getByText('Large Button')).toHaveClass('py-3');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>);
    expect(screen.getByText('Custom Button')).toHaveClass('custom-class');
  });

  test('renders disabled button', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByText('Disabled Button');
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass('opacity-50');
    expect(buttonElement).toHaveClass('cursor-not-allowed');
  });
});
