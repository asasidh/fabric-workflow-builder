import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
  it('renders all mock patterns', () => {
    render(<Sidebar />);
    expect(screen.getByText('Summarize')).toBeInTheDocument();
    expect(screen.getByText('Extract Wisdom')).toBeInTheDocument();
    expect(screen.getByText('Bullet Points')).toBeInTheDocument();
  });

  it('patterns are draggable', () => {
    render(<Sidebar />);
    const summarizeItem = screen.getByText('Summarize').closest('[draggable="true"]');
    expect(summarizeItem).toBeInTheDocument();
  });
});
