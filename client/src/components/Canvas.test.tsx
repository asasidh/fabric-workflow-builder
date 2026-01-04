import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Canvas } from './Canvas';

describe('Canvas', () => {
  it('renders the React Flow canvas', () => {
    // Mock fetch for StatusIndicator
    global.fetch = vi.fn(() => new Promise(() => {}));
    const { container } = render(<Canvas />);
    expect(container.querySelector('.react-flow')).toBeInTheDocument();
  });

  it('renders the execution control panel and status indicator', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    render(<Canvas />);
    expect(screen.getByRole('button', { name: /Run Workflow/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export JSON/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Delete Selected/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Canvas/i })).toBeInTheDocument();
    expect(screen.getByText('Checking Fabric...')).toBeInTheDocument();
  });

  it('disables the run button when no nodes are present', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    render(<Canvas />);
    const button = screen.getByRole('button', { name: /Run Workflow/i });
    expect(button).toBeDisabled();
  });

  it('initially does not show the NodeDetailSidebar', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    render(<Canvas />);
    expect(screen.queryByText('Node Detail')).not.toBeInTheDocument();
  });
});
