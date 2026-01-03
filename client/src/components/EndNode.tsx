import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export const EndNode = memo(({ data }: any) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-red-50 border-2 border-red-400 min-w-[100px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-red-500" />
      <div className="font-bold text-sm text-red-900 text-center">END</div>
       {data.result && (
          <div className="mt-2 p-2 bg-white border border-red-100 rounded text-[10px] text-gray-700 overflow-hidden text-ellipsis max-h-32 overflow-y-auto">
            {data.result}
          </div>
        )}
    </div>
  );
});
