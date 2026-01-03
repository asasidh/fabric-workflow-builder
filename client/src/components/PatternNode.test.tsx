import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { PatternNode } from './PatternNode';

const nodeTypes = {
  patternNode: PatternNode,
};

describe('PatternNode', () => {
  it('renders label and ready state', () => {
    const nodes = [{ id: '1', type: 'patternNode', position: { x: 0, y: 0 }, data: { label: 'Summarize' } }];
    render(
      <ReactFlowProvider>
        <div style={{ width: '500px', height: '500px' }}>
          <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
        </div>
      </ReactFlowProvider>
    );
    expect(screen.getByText('Summarize')).toBeInTheDocument();
    expect(screen.getByText(/Ready to run/i)).toBeInTheDocument();
  });

  it('renders result when provided', () => {
    const nodes = [{ id: '1', type: 'patternNode', position: { x: 0, y: 0 }, data: { label: 'Summarize', result: 'Success!' } }];
    render(
      <ReactFlowProvider>
        <div style={{ width: '500px', height: '500px' }}>
          <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
        </div>
      </ReactFlowProvider>
    );
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });
});