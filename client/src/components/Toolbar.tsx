import React from 'react';
import { StatusIndicator } from './StatusIndicator';

interface ToolbarProps {
  onExecute: () => void;
  onExport: () => void;
  onDelete: () => void;
  onClear: () => void;
  isExecuting: boolean;
  executionError: string | null;
  hasNodes: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onExecute,
  onExport,
  onDelete,
  onClear,
  isExecuting,
  executionError,
  hasNodes,
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm z-10">
      <div className="flex items-center space-x-4">
        <StatusIndicator />
        <div className="h-6 w-px bg-gray-300 mx-2"></div>
        <button
          onClick={onExecute}
          disabled={isExecuting || !hasNodes}
          className={`py-1.5 px-4 rounded font-bold text-white text-sm transition-all flex items-center ${
            isExecuting || !hasNodes
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 shadow-sm active:scale-95'
          }`}
        >
          {isExecuting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Executing...
            </>
          ) : (
            'Run Workflow'
          )}
        </button>
        {executionError && (
          <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
            Error: {executionError}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onExport}
          disabled={!hasNodes}
          className="py-1.5 px-3 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors disabled:opacity-50"
        >
          Export JSON
        </button>
        <button
          onClick={onDelete}
          className="py-1.5 px-3 rounded text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
        >
          Delete Selected
        </button>
        <button
          onClick={onClear}
          className="py-1.5 px-3 rounded text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          Clear Canvas
        </button>
      </div>
    </div>
  );
};
