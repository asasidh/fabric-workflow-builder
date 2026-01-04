import React, { useState } from 'react';

interface PatternEditorProps {
  onSave: (name: string, content: string) => void;
  onCancel: () => void;
}

export const PatternEditor: React.FC<PatternEditorProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      alert('Pattern name is required.');
      return;
    }
    if (!content.trim()) {
      alert('Pattern content (system prompt) is required.');
      return;
    }
    onSave(name.trim(), content.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">Create New Pattern</h2>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4 flex-1">
          <div>
            <label htmlFor="pattern-name" className="block text-sm font-bold text-gray-700 mb-1 italic uppercase tracking-wider">
              Pattern Name
            </label>
            <input
              id="pattern-name"
              type="text"
              placeholder="e.g. summarize_meetings"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
          </div>

          <div className="flex-1 flex flex-col min-h-[300px]">
            <label htmlFor="pattern-content" className="block text-sm font-bold text-gray-700 mb-1 italic uppercase tracking-wider">
              System Prompt (Instructions)
            </label>
            <textarea
              id="pattern-content"
              placeholder="Enter the instructions for the AI here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 flex justify-end space-x-3 bg-gray-50/50">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg font-bold text-white bg-blue-500 hover:bg-blue-600 shadow-md active:scale-95 transition-all"
          >
            Save Pattern
          </button>
        </div>
      </div>
    </div>
  );
};
