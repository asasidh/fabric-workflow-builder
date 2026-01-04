import React, { memo, useState, useEffect } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export const InputNode = memo(({ id, data }: any) => {
  const { updateNodeData } = useReactFlow();
  const [useClipboard, setUseClipboard] = useState(data.useClipboard || false);
  const [text, setText] = useState(data.text || '');

  useEffect(() => {
    updateNodeData(id, { useClipboard, text });
  }, [useClipboard, text, id, updateNodeData]);

  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-yellow-50 border-2 border-yellow-400 min-w-[200px]">
      <div className="font-bold text-xs text-yellow-900 mb-2">USER INPUT</div>
      
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