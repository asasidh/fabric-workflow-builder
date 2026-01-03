import React from 'react';

const patterns = [
  { id: 'summarize', name: 'Summarize', description: 'Summarize the input text' },
  { id: 'extract_wisdom', name: 'Extract Wisdom', description: 'Extract key insights' },
  { id: 'bullet_points', name: 'Bullet Points', description: 'Convert to bullet points' },
];

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string, patternName: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('patternName', patternName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Fabric Patterns</h2>
      <div className="space-y-3">
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
