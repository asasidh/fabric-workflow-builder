import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export const StartNode = memo(() => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-green-50 border-2 border-green-400 min-w-[100px]">
      <div className="font-bold text-sm text-green-900 text-center">START</div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-green-500" />
    </div>
  );
});
