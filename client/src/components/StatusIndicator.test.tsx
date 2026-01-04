import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StatusIndicator } from './StatusIndicator';

describe('StatusIndicator', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows loading initially', () => {
    // Mock fetch to pending
    global.fetch = vi.fn(() => new Promise(() => {})); 
    render(<StatusIndicator />);
    expect(screen.getByText('Checking Fabric...')).toBeInTheDocument();
  });

  it('shows connected when API returns available: true', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ available: true, version: '1.0.0' }),
    });

    render(<StatusIndicator />);
    
    await waitFor(() => {
      expect(screen.getByText('Fabric Ready (1.0.0)')).toBeInTheDocument();
    });
    expect(screen.getByRole('status')).toHaveClass('bg-green-500');
  });

  it('shows disconnected when API returns available: false', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ available: false }),
    });

    render(<StatusIndicator />);
    
    await waitFor(() => {
      expect(screen.getByText('Fabric Not Found')).toBeInTheDocument();
    });
    expect(screen.getByRole('status')).toHaveClass('bg-red-500');
  });
});
