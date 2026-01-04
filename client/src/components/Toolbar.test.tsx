import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  const defaultProps = {
    onExecute: vi.fn(),
    onExport: vi.fn(),
    onDelete: vi.fn(),
    onClear: vi.fn(),
    isExecuting: false,
    executionError: null,
    hasNodes: true,
  };

  beforeEach(() => {
    global.fetch = vi.fn(() => new Promise(() => {}));
  });

  it('renders correctly', () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByText('Run Workflow')).toBeInTheDocument();
    expect(screen.getByText('Export JSON')).toBeInTheDocument();
  });

  it('disables run button when executing', () => {
    render(<Toolbar {...defaultProps} isExecuting={true} />);
    expect(screen.getByText('Executing...')).toBeDisabled();
  });

  it('shows error message when present', () => {
    render(<Toolbar {...defaultProps} executionError="Failed" />);
    expect(screen.getByText('Error: Failed')).toBeInTheDocument();
  });

  it('calls handlers on click', () => {
    render(<Toolbar {...defaultProps} />);
    fireEvent.click(screen.getByText('Run Workflow'));
    expect(defaultProps.onExecute).toHaveBeenCalled();
    
    fireEvent.click(screen.getByText('Export JSON'));
    expect(defaultProps.onExport).toHaveBeenCalled();
  });
});
