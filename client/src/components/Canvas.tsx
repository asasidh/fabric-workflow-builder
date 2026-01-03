import React, { useCallback, useState } from 'react';
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

const initialNodes: any[] = [];
const initialEdges: any[] = [];

let id = 0;
const getId = () => `node_${id++}`;

const CanvasInner = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [inputText, setInputText] = useState('Sample input text for the workflow');
  const [isExecuting, setIsExecuting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [results, setResults] = useState<Record<string, string>>({});
  
  const { screenToFlowPosition } = useReactFlow();

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
        id: getId(),
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
          input: inputText
        }),
      });
      const data = await response.json();
      setResults(data.results);
      // Results will be displayed in the next task
    } catch (error) {
      console.error('Execution failed:', error);
    } finally {
      setIsExecuting(false);
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
        fitView
      >
        <Background color="#ccc" variant={"dots" as any} />
        <Controls />
        
        <Panel position="top-right" className="space-y-2">
          <div className="bg-white p-3 border border-gray-200 rounded shadow-sm w-64">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
              Initial Input
            </label>
            <textarea
              className="w-full text-sm border border-gray-200 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              onClick={onExecute}
              disabled={isExecuting || nodes.length === 0}
              className={`mt-2 w-full py-2 px-4 rounded font-bold text-white transition-all ${
                isExecuting || nodes.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 shadow-md active:scale-95'
              }`}
            >
              {isExecuting ? 'Executing...' : 'Run Workflow'}
            </button>
          </div>
          <div className="bg-white p-2 border border-gray-200 rounded shadow-sm text-xs text-gray-500 text-center">
            Drag patterns onto the canvas to start
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