import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

export const PatternNode = memo(({ data, selected }: any) => {
  const status = data.status || 'idle';

  let baseBorderColor = 'border-blue-200';
  let selectedBorderColor = 'border-blue-600';
  let ringColor = 'ring-blue-100';
  let icon = null;

  switch (status) {
    case 'running':
      baseBorderColor = 'border-amber-400';
      selectedBorderColor = 'border-amber-600';
      ringColor = 'ring-amber-100';
      icon = (
        <svg className="animate-spin h-3 w-3 text-amber-500 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-testid="status-running">
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
        <svg className="h-3 w-3 text-green-500 ml-2" viewBox="0 0 20 20" fill="currentColor" data-testid="status-success">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
      break;
    case 'error':
      baseBorderColor = 'border-red-500';
      selectedBorderColor = 'border-red-600';
      ringColor = 'ring-red-100';
      icon = (
        <svg className="h-3 w-3 text-red-500 ml-2" viewBox="0 0 20 20" fill="currentColor" data-testid="status-error">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
      break;
  }

  const borderClass = selected 
    ? `${selectedBorderColor} ring-4 ${ringColor}` 
    : baseBorderColor;

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${borderClass} min-w-[150px] max-w-[250px] transition-all duration-300`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-blue-400" />
      <div className="flex flex-row items-center justify-between">
        <div className="font-bold text-xs text-blue-800 uppercase tracking-tight">{data.label}</div>
        {icon}
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-blue-400" />
    </div>
  );
});