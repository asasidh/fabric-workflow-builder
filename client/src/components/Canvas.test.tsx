import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Canvas } from './Canvas';

describe('Canvas', () => {
  it('renders the React Flow canvas', () => {
    const { container } = render(<Canvas />);
    expect(container.querySelector('.react-flow')).toBeInTheDocument();
  });

  it('shows the instructions panel', () => {
    render(<Canvas />);
    expect(screen.getByText(/Drag patterns from the sidebar/i)).toBeInTheDocument();
  });
});
