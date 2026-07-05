import { useState, useEffect } from 'react';
import { FetchLog, ApiEndpoint } from '../types/database';
import { api } from '../lib/api';
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function LogsPage() {
  const [logs, setLogs] = useState<(FetchLog & { endpoint_name: string })[]>([]);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedEndpoint]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [endpointsData, logsData] = await Promise.all([
        api.getEndpoints(),
        api.getLogs({ endpoint_id: selectedEndpoint, limit: 100 }),
      ]);
      setEndpoints(endpointsData);
      setLogs(logsData);
    } catch (err) {
      console.error('Failed to load logs:', err);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Fetch Logs</h1>
          <p className="text-slate-400 mt-1">
            History of data fetch operations
          </p>
        </div>
        <select
          value={selectedEndpoint}
          onChange={(e) => setSelectedEndpoint(e.target.value)}
          className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Endpoints</option>
          {endpoints.map((ep) => (
            <option key={ep.id} value={ep.id}>
              {ep.name}
            </option>
          ))}
        </select>
      </div>

      {logs.length === 0 ? (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-12 text-center">
          <p className="text-slate-400">No fetch logs found</p>
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                  Endpoint
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                  Records
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                  Created
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                  Updated
                </th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">
                  Duration
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                  Time
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">
                  Error
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-700/30">
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 text-sm ${
                        log.status === 'success'
                          ? 'text-green-400'
                          : log.status === 'partial'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                    >
                      {log.status === 'success' ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : log.status === 'partial' ? (
                        <AlertCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white">{log.endpoint_name}</td>
                  <td className="px-4 py-3 text-right text-slate-300">
                    {log.records_fetched}
                  </td>
                  <td className="px-4 py-3 text-right text-green-400">
                    {log.records_created}
                  </td>
                  <td className="px-4 py-3 text-right text-blue-400">
                    {log.records_updated}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-400">
                    {log.duration_ms}ms
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-sm whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-red-400 text-sm max-w-xs truncate">
                    {log.error_message || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}
