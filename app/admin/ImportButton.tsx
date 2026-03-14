'use client';

import { useState } from 'react';

export default function ImportButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function handleImport() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/import', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setResult(`Success! Added ${data.lecturesInserted} lectures and ${data.questionsInserted} questions.`);
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (e: any) {
      setResult(`Error: ${e.message}`);
    }
    setLoading(false);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-slate-800">Bulk Import Content</h2>
        <p className="text-sm text-slate-500 mt-1">Automatically read .md files and insert missing lectures and sample questions.</p>
        {result && (
          <p className={`text-sm mt-3 font-medium ${result.startsWith('Success') ? 'text-green-600' : 'text-red-500'}`}>
            {result}
          </p>
        )}
      </div>
      <button
        onClick={handleImport}
        disabled={loading}
        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? 'Importing...' : 'Run Import Script →'}
      </button>
    </div>
  );
}
