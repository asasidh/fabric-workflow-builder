import React from 'react';

const patterns = [
  { id: 'summarize', name: 'Summarize', description: 'Summarize the input text' },
  { id: 'extract_wisdom', name: 'Extract Wisdom', description: 'Extract key insights' },
  { id: 'bullet_points', name: 'Bullet Points', description: 'Convert to bullet points' },
];

const controls = [
  { id: 'start', name: 'Start', type: 'startNode', description: 'Workflow entry point' },
  { id: 'end', name: 'End', type: 'endNode', description: 'Workflow exit point' },
  { id: 'input', name: 'User Input', type: 'inputNode', description: 'Provide custom input' },
];

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('patternName', label); // Reusing 'patternName' for label
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Fabric Patterns</h2>
      
      <div className="mb-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Controls</h3>
        {controls.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors"
            onDragStart={(event) => onDragStart(event, item.type, item.name)}
            draggable
          >
            <div className="font-semibold text-gray-800">{item.name}</div>
            <div className="text-xs text-gray-600 mt-1">{item.description}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Patterns</h3>
        {patterns.map((pattern) => (
          <div
            key={pattern.id}
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-colors"
            onDragStart={(event) => onDragStart(event, 'patternNode', pattern.name)}
            draggable
          >
            <div className="font-semibold text-blue-800">{pattern.name}</div>
            <div className="text-xs text-blue-600 mt-1">{pattern.description}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};