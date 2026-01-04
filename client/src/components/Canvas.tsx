import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider,
  Panel,
} from '@xyflow/react';
import { PatternNode } from './PatternNode';
import { EndNode } from './EndNode';
import { InputNode } from './InputNode';

const nodeTypes = {
  patternNode: PatternNode,
  endNode: EndNode,
  inputNode: InputNode,
};

const STORAGE_KEY = 'fabric-workflow-state';

const CanvasInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { screenToFlowPosition, setViewport, toObject, deleteElements } = useReactFlow();

  // Load from LocalStorage
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const { nodes: savedNodes, edges: savedEdges, viewport } = JSON.parse(savedState);
      setNodes(savedNodes || []);
      setEdges(savedEdges || []);
      if (viewport) {
        setViewport(viewport);
      }
    }
  }, [setNodes, setEdges, setViewport]);

  // Save to LocalStorage
  useEffect(() => {
    const state = { nodes, edges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [nodes, edges]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const patternName = event.dataTransfer.getData('patternName');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Date.now()}`,
        type,
        position,
        data: { label: patternName },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onExecute = async () => {
    if (nodes.length === 0) return;
    
    setIsExecuting(true);
    try {
      const response = await fetch('http://localhost:3001/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflow: { nodes, edges },
          input: ''
        }),
      });
      const data = await response.json();
      
      setNodes((nds) =>
        nds.map((node) => {
          if (data.results[node.id]) {
            return {
              ...node,
              data: {
                ...node.data,
                result: data.results[node.id],
              },
            };
          }
          return node;
        })
      );
    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const onExport = useCallback(() => {
    const flow = toObject();
    const json = JSON.stringify(flow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `workflow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [toObject]);

  const onDeleteSelected = useCallback(async () => {
    const selectedNodes = nodes.filter(node => node.selected);
    const selectedEdges = edges.filter(edge => edge.selected);
    
    if (selectedNodes.length > 0 || selectedEdges.length > 0) {
      if (window.confirm('Delete selected elements?')) {
        await deleteElements({ nodes: selectedNodes, edges: selectedEdges });
      }
    } else {
       alert("Select nodes or edges to delete first.");
    }
  }, [nodes, edges, deleteElements]);

  const onClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setNodes([]);
      setEdges([]);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <div className="flex-1 relative bg-gray-50 h-full" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 0.7 }}
        fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 2 }}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background color="#ccc" variant={"dots" as any} />
        <Controls />
        
        <Panel position="top-right" className="space-y-2">
          <div className="bg-white p-3 border border-gray-200 rounded shadow-sm w-48">
            <button
              onClick={onExecute}
              disabled={isExecuting || nodes.length === 0}
              className={`w-full py-2 px-4 rounded font-bold text-white transition-all ${
                isExecuting || nodes.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-md active:scale-95'
              }`}
            >
              {isExecuting ? 'Executing...' : 'Run Workflow'}
            </button>
            <button
              onClick={onExport}
              disabled={nodes.length === 0}
              className="mt-2 w-full py-1 px-4 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors disabled:opacity-50"
            >
              Export JSON
            </button>
            <button
              onClick={onDeleteSelected}
              className="mt-2 w-full py-1 px-4 rounded text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
            >
              Delete Selected
            </button>
            <button
              onClick={onClear}
              className="mt-2 w-full py-1 px-4 rounded text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              Clear Canvas
            </button>
          </div>
          <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs text-gray-500 text-center">
            Changes are saved automatically
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const Canvas = () => (
  <ReactFlowProvider>
    <CanvasInner />
  </ReactFlowProvider>
);