import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Canvas } from './Canvas';

describe('Canvas', () => {
  it('renders the React Flow canvas', () => {
    const { container } = render(<Canvas />);
    expect(container.querySelector('.react-flow')).toBeInTheDocument();
  });

  it('renders the execution control panel', () => {
    render(<Canvas />);
    expect(screen.getByText(/Initial Input/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run Workflow/i })).toBeInTheDocument();
  });

  it('disables the run button when no nodes are present', () => {
    render(<Canvas />);
    const button = screen.getByRole('button', { name: /Run Workflow/i });
    expect(button).toBeDisabled();
  });
});