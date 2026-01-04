import React, { useEffect, useState } from 'react';

export const StatusIndicator = () => {
  const [status, setStatus] = useState<'loading' | 'connected' | 'disconnected'>('loading');
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/status');
        const data = await response.json();
        if (data.available) {
          setStatus('connected');
          setVersion(data.version);
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        setStatus('disconnected');
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 bg-white px-3 py-1 rounded-full shadow-sm border border-gray-200">
      <div
        role="status"
        aria-label={status}
        className={`w-3 h-3 rounded-full ${
          status === 'loading'
            ? 'bg-yellow-400 animate-pulse'
            : status === 'connected'
            ? 'bg-green-500'
            : 'bg-red-500'
        }`}
      />
      <span className="text-xs font-medium text-gray-600">
        {status === 'loading'
          ? 'Checking Fabric...'
          : status === 'connected'
          ? `Fabric Ready (${version})`
          : 'Fabric Not Found'}
      </span>
    </div>
  );
};
