import React, { useState, useEffect } from 'react';
import { Settings, Server, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { checkHealth } from '../services/api';

export default function SettingsView() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiUrl, setApiUrl] = useState('http://127.0.0.1:8000');

  const verifyApi = async () => {
    setApiStatus('checking');
    try {
      const res = await checkHealth();
      if (res.status === 'ok') {
        setApiStatus('online');
      } else {
        setApiStatus('error');
      }
    } catch {
      setApiStatus('offline');
    }
  };

  useEffect(() => {
    verifyApi();
  }, []);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          ⚙️ Settings & System Status
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Verify backend FastAPI server health and API endpoint configuration.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">FastAPI Backend Status</h3>
              <p className="text-xs text-slate-500">Connected to http://127.0.0.1:8000/api/v1</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {apiStatus === 'online' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Online (200 OK)
              </span>
            )}
            {(apiStatus === 'offline' || apiStatus === 'error') && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                <XCircle className="w-3.5 h-3.5" /> Offline / Error
              </span>
            )}
            {apiStatus === 'checking' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Checking...
              </span>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Backend API Base URL</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50"
              readOnly
            />
          </div>

          <button
            onClick={verifyApi}
            className="px-4 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-verify Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
