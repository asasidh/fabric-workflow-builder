import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export const PatternNode = memo(({ data }: any) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-200 min-w-[150px] max-w-[250px]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-blue-400" />
      <div className="flex flex-col">
        <div className="font-bold text-xs text-blue-800 uppercase tracking-tight">{data.label}</div>
        {data.result ? (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-[10px] text-blue-900 overflow-hidden text-ellipsis italic">
            {data.result}
          </div>
        ) : (
          <div className="mt-1 text-[9px] text-gray-400 italic">Ready to run...</div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-400" />
    </div>
  );
});
