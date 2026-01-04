import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders controls and initial loading state', () => {
    global.fetch = vi.fn(() => new Promise(() => {}));
    render(<Sidebar />);
    expect(screen.getByText('User Input')).toBeInTheDocument();
    expect(screen.getByText('Display Output')).toBeInTheDocument();
    expect(screen.getByText('Loading patterns...')).toBeInTheDocument();
  });

  it('renders fetched patterns', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ patterns: ['summarize', 'extract_wisdom'] }),
    });

    render(<Sidebar />);
    
    await waitFor(() => {
      expect(screen.getByText('summarize')).toBeInTheDocument();
      expect(screen.getByText('extract_wisdom')).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading patterns...')).not.toBeInTheDocument();
  });

  it('shows error message when no patterns found', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ patterns: [] }),
    });

    render(<Sidebar />);
    
    await waitFor(() => {
      expect(screen.getByText(/No patterns found/i)).toBeInTheDocument();
    });
  });
});