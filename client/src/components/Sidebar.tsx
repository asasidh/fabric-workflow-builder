import React, { useEffect, useState } from 'react';
import { PatternEditor } from './PatternEditor';

const controls = [
  { id: 'input', name: 'User Input', type: 'inputNode', description: 'Provide custom input' },
  { id: 'display', name: 'Display Output', type: 'displayNode', description: 'Visualize stage results' },
  { id: 'end', name: 'End', type: 'endNode', description: 'Workflow exit point' },
];

export const Sidebar = () => {
  const [patterns, setPatterns] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);

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

  const handleSavePattern = async (name: string, content: string) => {
    // Phase 3: Implement actual backend save
    console.log('Saving pattern:', { name, content });
    setIsCreating(false);
    // Optimistic update for UI if we wanted, but let's wait for Phase 3
  };

  const filteredPatterns = patterns.filter(pattern => 
    pattern.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Fabric</h2>
        <button 
          title="Create New Pattern"
          onClick={() => setIsCreating(true)}
          className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {isCreating && (
        <PatternEditor 
          onSave={handleSavePattern} 
          onCancel={() => setIsCreating(false)} 
        />
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patterns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Controls</h3>
          {controls.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-100 transition-colors group"
              onDragStart={(event) => onDragStart(event, item.type, item.name)}
              draggable
            >
              <div className="font-semibold text-xs text-gray-800">{item.name}</div>
              <div className="text-[10px] text-gray-500 mt-1 line-clamp-2">{item.description}</div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patterns</h3>
          {isLoading ? (
            <div className="text-xs text-gray-400 italic p-3">Loading patterns...</div>
          ) : filteredPatterns.length > 0 ? (
            filteredPatterns.map((pattern) => (
              <div
                key={pattern}
                className="p-3 bg-blue-50 border border-blue-100 rounded-lg cursor-grab active:cursor-grabbing hover:bg-blue-100 transition-colors"
                onDragStart={(event) => onDragStart(event, 'patternNode', pattern)}
                draggable
              >
                <div className="font-semibold text-xs text-blue-800 break-words">{pattern}</div>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400 italic p-3">
              {searchTerm ? 'No patterns match your search.' : 'No patterns found.'}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
