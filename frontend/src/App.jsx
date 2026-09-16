import React, { useState } from 'react';

export default function App() {
  const [bbox, setBbox] = useState([88.30, 22.50, 88.40, 22.60]);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunQuery = async (e) => {
    e.preventDefault();
    if (!prompt) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, bbox })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Error connecting to Backend. Ensure FastAPI is running on port 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <div className="w-1/3 flex flex-col border-r border-slate-800 bg-slate-900/60 p-6 justify-between">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold tracking-tight text-white">
              SatQuery AI <span className="text-xs text-emerald-400 font-normal px-2 py-0.5 bg-emerald-950 rounded border border-emerald-800 ml-2">Bhoonidhi Active</span>
            </h1>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400 block mb-1">User Token Context (Encrypted):</span>
              <code className="text-emerald-400 font-mono">sad_kivuos (Verified)</code>
            </div>
          </div>

          <form onSubmit={handleRunQuery} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Natural Language Query</label>
              <textarea
                rows="4"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask about water changes, urban growth, or forest health in this region..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition resize-none shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 rounded-lg text-sm transition shadow-lg shadow-emerald-900/20"
            >
              {loading ? 'Executing AI Consensus Pipeline...' : 'Run Analysis'}
            </button>
          </form>
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-800/60 pt-4 text-center">
          SIH Problem ID: SIH26167
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-950">
        <div className="flex-1 min-h-[350px] bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-lg">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="z-10 max-w-md space-y-3">
            <h2 className="text-xl font-bold text-white">Geospatial AOI Canvas</h2>
            <p className="text-sm text-slate-400">Integrated directly with ISRO's Bhoonidhi Optical & SAR Catalogues.</p>
          </div>
        </div>

        {result && (
          <div className="mt-6 bg-slate-900 border border-emerald-800/50 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Auditable AI Output</span>
              <span className="text-xs bg-emerald-950 text-emerald-300 px-3 py-1 rounded-full border border-emerald-800 font-bold">
                Confidence: {(result.agent_response.confidence_score * 100).toFixed(1)}%
              </span>
            </div>
            <p className="text-base text-slate-200 leading-relaxed font-medium">{result.agent_response.summary}</p>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block mb-2 font-bold uppercase tracking-wide">Data Sources Triggered</span>
                <ul className="text-sm text-slate-300 space-y-2">
                  {result.active_datasets.map((d, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                      {d.mission} <span className="text-slate-500">({d.sensor})</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400 block mb-2 font-bold uppercase tracking-wide">Execution Chain</span>
                <ul className="text-sm text-slate-300 space-y-2">
                  {result.agent_response.evidence_chain.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 truncate">
                      <span className="text-emerald-500 font-mono">›</span> {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}