import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface NodeDetailSidebarProps {
  node: any;
  onClose: () => void;
}

export const NodeDetailSidebar: React.FC<NodeDetailSidebarProps> = ({ node, onClose }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'input' | 'output' | 'error'>('output');
  const [description, setDescription] = useState<string | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);

  useEffect(() => {
    setDescription(null);
    // If it's a pattern node, default to info tab might be nice, but let's stick to user choice or default 'output'.
    // Actually, if it's a new node selection, maybe we should reset tab?
    // For now, keep current tab or default.
  }, [node.id]);

  const { data } = node;
  const isPatternNode = !!data.label && node.type !== 'inputNode' && node.type !== 'endNode' && node.type !== 'displayNode';

  useEffect(() => {
    const fetchInfo = async () => {
      if (activeTab === 'info' && isPatternNode && !description && !loadingInfo) {
        setLoadingInfo(true);
        try {
          const res = await fetch(`http://localhost:3001/api/patterns/${data.label}`);
          if (res.ok) {
            const json = await res.json();
            setDescription(json.description);
          } else {
            setDescription('Failed to load description.');
          }
        } catch (e) {
          setDescription('Error loading description.');
        } finally {
          setLoadingInfo(false);
        }
      }
    };
    fetchInfo();
  }, [activeTab, isPatternNode, description, loadingInfo, data.label]);

  if (!node) return null;

  const getContent = () => {
    switch (activeTab) {
      case 'info':
        if (!isPatternNode) return 'Info only available for Pattern Nodes.';
        if (loadingInfo) return 'Loading description...';
        return description || 'No description available.';
      case 'input':
        return data.input || (node.type === 'inputNode' ? data.text : '');
      case 'output':
        return data.output || data.result || '';
      case 'error':
        return data.error || '';
      default:
        return '';
    }
  };

  const content = getContent();
  const tabs = ['info', 'input', 'output', 'error'] as const;

  return (
    <div className="w-96 border-l border-gray-200 bg-white h-full flex flex-col shadow-xl animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="font-bold text-gray-800 text-sm uppercase tracking-tight">{data.label || 'Node Detail'}</h3>
          <p className="text-[10px] text-gray-400 font-mono">{node.id}</p>
        </div>
        <button 
          onClick={onClose}
          aria-label="Close details"
          className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-white prose prose-sm max-w-none">
        {content ? (
          activeTab === 'error' ? (
            <div className="whitespace-pre-wrap text-sm text-red-600 font-mono bg-red-50 p-3 rounded border border-red-100">
              {content}
            </div>
          ) : (
            <div className="text-gray-700 leading-relaxed">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )
        ) : (
          <div className="text-xs text-gray-400 italic text-center mt-10">
            No {activeTab} data available.
          </div>
        )}
      </div>
    </div>
  );
};
