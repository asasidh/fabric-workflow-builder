import React, { useEffect, useState } from 'react';

const controls = [
  { id: 'input', name: 'User Input', type: 'inputNode', description: 'Provide custom input' },
  { id: 'display', name: 'Display Output', type: 'displayNode', description: 'Visualize stage results' },
  { id: 'end', name: 'End', type: 'endNode', description: 'Workflow exit point' },
];

export const Sidebar = () => {
  const [patterns, setPatterns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/patterns');
        const data = await response.json();
        setPatterns(data.patterns || []);
      } catch (error) {
        console.error('Failed to fetch patterns:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatterns();
  }, []);

  const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('patternName', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Fabric Patterns</h2>
      
      <div className="mb-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-gray-400">Controls</h3>
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
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-gray-400">Patterns</h3>
        {isLoading ? (
          <div className="text-xs text-gray-400 italic p-3">Loading patterns...</div>
        ) : patterns.length > 0 ? (
          patterns.map((pattern) => (
            <div
              key={pattern}
              className="p-3 bg-blue-50 border border-blue-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-colors"
              onDragStart={(event) => onDragStart(event, 'patternNode', pattern)}
              draggable
            >
              <div className="font-semibold text-blue-800 break-words">{pattern}</div>
            </div>
          ))
        ) : (
          <div className="text-xs text-red-400 italic p-3">No patterns found. Ensure Fabric is installed or running.</div>
        )}
      </div>
    </aside>
  );
};
