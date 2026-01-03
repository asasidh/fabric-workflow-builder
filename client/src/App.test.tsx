import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Layout', () => {
  it('renders the Fabric Patterns sidebar', () => {
    render(<App />);
    expect(screen.getByText(/Fabric Patterns/i)).toBeInTheDocument();
  });

  it('renders the canvas area', () => {
    const { container } = render(<App />);
    // React Flow adds a class 'react-flow' to the container
    expect(container.querySelector('.react-flow')).toBeInTheDocument();
  });
});