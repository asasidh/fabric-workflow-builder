import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import { DisplayNode } from './DisplayNode';

const nodeTypes = {
  displayNode: DisplayNode,
};

describe('DisplayNode', () => {
  it('renders correctly', () => {
    const nodes = [{ id: '1', type: 'displayNode', position: { x: 0, y: 0 }, data: { } }];
    render(
      <ReactFlowProvider>
        <div style={{ width: '500px', height: '500px' }}>
          <ReactFlow nodes={nodes} nodeTypes={nodeTypes} />
        </div>
      </ReactFlowProvider>
    );
    expect(screen.getByText('Display Output')).toBeInTheDocument();
  });
});
