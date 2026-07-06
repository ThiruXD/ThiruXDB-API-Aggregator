import React, { useState, useEffect, useRef } from 'react';
import { api, ApiEndpoint } from '../lib/api';
import { Terminal, Play, Square, Loader2, RefreshCw, Trash2 } from 'lucide-react';

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function LiveLogsPage() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('');
  const [logs, setLogs] = useState<any[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [polling, setPolling] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getEndpoints().then(data => {
      setEndpoints(data.filter(e => e.is_active));
      if (data.length > 0) {
        setSelectedEndpointId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (polling && selectedEndpointId) {
      const fetchLogs = () => {
        api.getLiveLogs(selectedEndpointId)
          .then(setLogs)
          .catch(console.error);
      };
      fetchLogs();
      interval = setInterval(fetchLogs, 1000);
    }
    return () => clearInterval(interval);
  }, [polling, selectedEndpointId]);

  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleTogglePolling = () => {
    if (!polling && selectedEndpointId) {
      setPolling(true);
    } else {
      setPolling(false);
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400';
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'system': return 'text-blue-400 font-bold';
      default: return 'text-gray-300';
    }
  };

  const handleClearLogs = async () => {
    if (!selectedEndpointId) return;
    try {
      await api.clearLiveLogs(selectedEndpointId);
      setLogs([]);
    } catch (e) {
      console.error(e);
    }
  };

  const logSize = formatBytes(JSON.stringify(logs).length);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-indigo-500/10 rounded-xl">
          <Terminal className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Live Fetch Logs</h1>
          <p className="text-gray-400 text-sm">Monitor background sync activity in real-time</p>
        </div>
      </div>

      <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <select
            className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[200px]"
            value={selectedEndpointId}
            onChange={(e) => {
              setSelectedEndpointId(e.target.value);
              setLogs([]);
              setPolling(false);
            }}
          >
            {endpoints.map(ep => (
              <option key={ep.id} value={ep.id}>{ep.name}</option>
            ))}
          </select>
          <button
            onClick={handleTogglePolling}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${polling ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}`}
          >
            {polling ? <><Square className="w-4 h-4 fill-current" /> Stop Stream</> : <><Play className="w-4 h-4 fill-current" /> Stream Logs</>}
          </button>
          {polling && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
        </div>
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} className="sr-only peer" />
            <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
            <span className="ml-3 text-sm font-medium text-gray-300">Auto-scroll</span>
          </label>
          <div className="w-px h-6 bg-gray-700 mx-2"></div>
          <span className="text-sm text-gray-400 font-mono w-20 text-right">{logSize}</span>
          <button
            onClick={handleClearLogs}
            className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium transition bg-gray-700/50 text-gray-300 hover:bg-red-500/20 hover:text-red-400"
            title="Clear logs"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-gray-950 border border-gray-800 rounded-xl h-[60vh] overflow-y-auto p-4 font-mono text-sm shadow-inner relative">
        {!polling && logs.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <Terminal className="w-12 h-12 mb-2 opacity-50" />
            <p>Select an endpoint and start streaming logs</p>
          </div>
        )}
        <div className="space-y-1">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4 hover:bg-gray-900/50 px-2 py-1 rounded">
              <span className="text-gray-600 shrink-0 select-none">
                {new Date(log.timestamp).toLocaleTimeString(undefined, { hour12: false, fractionalSecondDigits: 3 })}
              </span>
              <span className={`break-all ${getColorForType(log.type)}`}>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
