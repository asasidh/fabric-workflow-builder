import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const InputNode = memo(({ id, data, selected }: any) => {
  const { updateNodeData } = useReactFlow();
  const [useClipboard, setUseClipboard] = useState(data.useClipboard || false);
  const [text, setText] = useState(data.text || '');

  useEffect(() => {
    updateNodeData(id, { useClipboard, text });
  }, [useClipboard, text, id, updateNodeData]);

  const status = data.status || 'idle';
  let baseBorderColor = 'border-yellow-400';
  let selectedBorderColor = 'border-yellow-600';
  let ringColor = 'ring-yellow-100';
  let icon = null;

  switch (status) {
    case 'running':
      baseBorderColor = 'border-amber-400';
      selectedBorderColor = 'border-amber-600';
      ringColor = 'ring-amber-100';
      icon = (
        <svg className="animate-spin h-3 w-3 text-amber-500 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      );
      break;
    case 'success':
      baseBorderColor = 'border-green-500';
      selectedBorderColor = 'border-green-600';
      ringColor = 'ring-green-100';
      icon = (
        <svg className="h-3 w-3 text-green-500 ml-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
      break;
  }

  const borderClass = selected 
    ? `${selectedBorderColor} ring-4 ${ringColor}` 
    : baseBorderColor;

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-yellow-50 border-2 ${borderClass} min-w-[200px] transition-all duration-300`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-xs text-yellow-900">USER INPUT</div>
        {icon}
      </div>
      
      <div className="flex items-center mb-2 nodrag">
        <input 
          type="checkbox" 
          id={`cb-${id}`}
          checked={useClipboard}
          onChange={(e) => setUseClipboard(e.target.checked)}
          className="mr-2 cursor-pointer"
        />
        <label htmlFor={`cb-${id}`} className="text-xs text-gray-700 cursor-pointer">Use Clipboard</label>
      </div>

      {!useClipboard && (
        <textarea
          className="w-full text-xs p-1 border rounded nodrag"
          rows={3}
          placeholder="Enter input here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.stopPropagation()} 
        />
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-yellow-500" />
    </div>
  );
});
