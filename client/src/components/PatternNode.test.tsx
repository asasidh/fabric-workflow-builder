import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { PatternNode } from './PatternNode';

const nodeTypes = {
  patternNode: PatternNode,
};

describe('PatternNode', () => {
  it('renders label', () => {
    const nodes = [{ id: '1', type: 'patternNode', position: { x: 0, y: 0 }, data: { label: 'Summarize' } }];
    render(
      <ReactFlowProvider>
        <div style={{ width: '500px', height: '500px' }}>
          <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
        </div>
      </ReactFlowProvider>
    );
    expect(screen.getByText('Summarize')).toBeInTheDocument();
  });

  it('renders running status', () => {
    const nodes = [{ id: '1', type: 'patternNode', position: { x: 0, y: 0 }, data: { label: 'Summarize', status: 'running' } }];
    render(
      <ReactFlowProvider>
        <div style={{ width: '500px', height: '500px' }}>
          <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
        </div>
      </ReactFlowProvider>
    );
    expect(screen.getByTestId('status-running')).toBeInTheDocument();
  });

  it('renders success status', () => {
    const nodes = [{ id: '1', type: 'patternNode', position: { x: 0, y: 0 }, data: { label: 'Summarize', status: 'success' } }];
    render(
      <ReactFlowProvider>
        <div style={{ width: '500px', height: '500px' }}>
          <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
        </div>
      </ReactFlowProvider>
    );
    expect(screen.getByTestId('status-success')).toBeInTheDocument();
  });

  it('renders error status', () => {
    const nodes = [{ id: '1', type: 'patternNode', position: { x: 0, y: 0 }, data: { label: 'Summarize', status: 'error' } }];
    render(
      <ReactFlowProvider>
        <div style={{ width: '500px', height: '500px' }}>
          <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
        </div>
      </ReactFlowProvider>
    );
    expect(screen.getByTestId('status-error')).toBeInTheDocument();
  });
});
