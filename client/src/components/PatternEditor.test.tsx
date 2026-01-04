import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PatternEditor } from './PatternEditor';

describe('PatternEditor', () => {
  it('renders correctly', () => {
    render(<PatternEditor onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Create New Pattern')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. summarize_meetings/i)).toBeInTheDocument();
  });

  it('calls onSave with correct data', () => {
    const onSave = vi.fn();
    render(<PatternEditor onSave={onSave} onCancel={vi.fn()} />);
    
    fireEvent.change(screen.getByLabelText(/Pattern Name/i), { target: { value: 'test_pattern' } });
    fireEvent.change(screen.getByLabelText(/System Prompt/i), { target: { value: 'test content' } });
    
    fireEvent.click(screen.getByText('Save Pattern'));
    
    expect(onSave).toHaveBeenCalledWith('test_pattern', 'test content');
  });

  it('calls onCancel when cancel clicked', () => {
    const onCancel = vi.fn();
    render(<PatternEditor onSave={vi.fn()} onCancel={onCancel} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalled();
  });

  it('validates empty inputs', () => {
    const onSave = vi.fn();
    window.alert = vi.fn();
    render(<PatternEditor onSave={onSave} onCancel={vi.fn()} />);
    
    fireEvent.click(screen.getByText('Save Pattern'));
    expect(window.alert).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });
});
