import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NodeDetailSidebar } from './NodeDetailSidebar';

describe('NodeDetailSidebar', () => {
  const mockNode = {
    id: 'node-1',
    data: {
      label: 'Test Node',
      input: 'Initial Input',
      output: 'Final Output',
      error: 'Something went wrong',
    },
  };

  it('renders correctly with labels', () => {
    render(<NodeDetailSidebar node={mockNode} onClose={() => {}} />);
    expect(screen.getByText('Test Node')).toBeInTheDocument();
    expect(screen.getByText('node-1')).toBeInTheDocument();
  });

  it('switches between tabs', () => {
    render(<NodeDetailSidebar node={mockNode} onClose={() => {}} />);
    
    // Default is output
    expect(screen.getByText('Final Output')).toBeInTheDocument();

    // Switch to input
    fireEvent.click(screen.getByText('input'));
    expect(screen.getByText('Initial Input')).toBeInTheDocument();

    // Switch to error
    fireEvent.click(screen.getByText('error'));
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('fetches and displays info for pattern nodes', async () => {
    const mockPatternNode = {
      id: 'node-2',
      type: 'patternNode',
      data: { label: 'Summarize' },
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ description: '# Pattern Info' }),
    });

    render(<NodeDetailSidebar node={mockPatternNode} onClose={() => {}} />);
    
    // Switch to info
    const infoTab = screen.getByText('info');
    fireEvent.click(infoTab);

    // Wait for content (using findBy because it's async)
    expect(await screen.findByText('Pattern Info')).toBeInTheDocument(); // Markdown renders h1
    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/api/patterns/Summarize');
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<NodeDetailSidebar node={mockNode} onClose={onClose} />);
    const closeButton = screen.getByLabelText('Close details');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
