import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders Vite + React heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /Vite \+ React/i })).toBeInTheDocument();
  });

  it('increments count on button click', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /count is 0/i });
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument();
  });
});
