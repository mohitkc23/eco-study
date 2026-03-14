'use client';

import { useState, useEffect } from 'react';
import type { Lecture, Topic, SessionMedia } from '@/lib/types';

type LectureForm = {
  topic_id: string;
  title: string;
  session_number: string;
  pdf_filename: string;
  notes_md: string;
  sort_order: number;
};

const EMPTY_FORM: LectureForm = {
  topic_id: '', title: '', session_number: '', pdf_filename: '', notes_md: '', sort_order: 0,
};

export default function AdminSessionsPage() {
  const [lectures, setLectures] = useState<(Lecture & { topics: { name: string } })[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Lecture | null>(null);
  const [form, setForm] = useState<LectureForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');

  // Media management state
  const [mediaFor, setMediaFor] = useState<Lecture | null>(null);
  const [media, setMedia] = useState<SessionMedia[]>([]);
  const [newMedia, setNewMedia] = useState({ media_type: 'youtube' as 'youtube' | 'image', url: '', caption: '' });
  const [mediaErr, setMediaErr] = useState('');

  async function load() {
    const [lData, tData] = await Promise.all([
      fetch('/api/lectures').then((r) => r.json()),
      fetch('/api/topics').then((r) => r.json()),
    ]);
    setLectures(lData);
    setTopics(tData);
  }

  useEffect(() => { load(); }, []);

  async function openMedia(l: Lecture) {
    setMediaFor(l);
    setMediaErr('');
    const data = await fetch(`/api/session-media?lecture=${l.id}`).then((r) => r.json());
    setMedia(data);
  }

  async function addMedia() {
    if (!newMedia.url || !mediaFor) return setMediaErr('URL is required');
    setMediaErr('');
    const res = await fetch('/api/session-media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newMedia, lecture_id: mediaFor.id, caption: newMedia.caption || null }),
    });
    if (!res.ok) return setMediaErr('Error adding media');
    setNewMedia({ media_type: 'youtube', url: '', caption: '' });
    const data = await fetch(`/api/session-media?lecture=${mediaFor.id}`).then((r) => r.json());
    setMedia(data);
  }

  async function deleteMedia(id: string) {
    await fetch(`/api/session-media/${id}`, { method: 'DELETE' });
    if (mediaFor) {
      const data = await fetch(`/api/session-media?lecture=${mediaFor.id}`).then((r) => r.json());
      setMedia(data);
    }
  }

  function openAdd() {
    setEditing(null);
    setForm({ ...EMPTY_FORM, topic_id: filterTopic === 'all' ? (topics[0]?.id ?? '') : filterTopic });
    setError('');
    setShowForm(true);
  }

  function openEdit(l: Lecture) {
    setEditing(l);
    setForm({
      topic_id: l.topic_id,
      title: l.title,
      session_number: l.session_number?.toString() ?? '',
      pdf_filename: l.pdf_filename ?? '',
      notes_md: l.notes_md ?? '',
      sort_order: l.sort_order,
    });
    setError('');
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title || !form.topic_id) return setError('Title and topic are required.');
    setSaving(true);
    setError('');
    const payload = {
      topic_id: form.topic_id,
      title: form.title,
      session_number: form.session_number ? parseInt(form.session_number) : null,
      pdf_filename: form.pdf_filename || null,
      notes_md: form.notes_md || null,
      sort_order: form.sort_order,
    };
    const res = editing
      ? await fetch(`/api/lectures/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/lectures', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) { const d = await res.json(); return setError(d.error ?? 'Error saving'); }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this session?')) return;
    await fetch(`/api/lectures/${id}`, { method: 'DELETE' });
    load();
  }

  const filtered = filterTopic === 'all' ? lectures : lectures.filter((l) => l.topic_id === filterTopic);

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Sessions</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg">
          + Add Session
        </button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        <FilterBtn label="All" active={filterTopic === 'all'} onClick={() => setFilterTopic('all')} />
        {topics.map((t) => <FilterBtn key={t.id} label={t.name} active={filterTopic === t.id} onClick={() => setFilterTopic(t.id)} />)}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="text-left px-4 py-3 w-12">#</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Topic</th>
              <th className="text-center px-4 py-3">PDF</th>
              <th className="text-center px-4 py-3">Notes</th>
              <th className="text-center px-4 py-3">Media</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-slate-400 text-center">{l.session_number ?? '—'}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{l.title}</td>
                <td className="px-4 py-3 text-slate-400 text-xs">{(l as Lecture & { topics: { name: string } }).topics?.name}</td>
                <td className="px-4 py-3 text-center text-emerald-500">{l.pdf_filename ? '✓' : <span className="text-slate-300">—</span>}</td>
                <td className="px-4 py-3 text-center text-emerald-500">{l.notes_md ? '✓' : <span className="text-slate-300">—</span>}</td>
                <td className="px-4 py-3 text-center">
                  <button onClick={() => openMedia(l)} className="text-xs text-blue-500 border border-blue-200 rounded px-2 py-0.5 hover:bg-blue-50 transition-colors">
                    + Media
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button onClick={() => openEdit(l)} className="text-teal-600 hover:underline">Edit</button>
                    <button onClick={() => handleDelete(l.id)} className="text-red-500 hover:underline">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">No sessions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Session add/edit modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Session' : 'Add Session'} onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Topic *">
                <select value={form.topic_id} onChange={(e) => setForm((f) => ({ ...f, topic_id: e.target.value }))} className={ic}>
                  <option value="">Select topic...</option>
                  {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Session Number">
                <input type="number" min={1} max={50} value={form.session_number}
                  onChange={(e) => setForm((f) => ({ ...f, session_number: e.target.value }))}
                  className={ic} placeholder="e.g. 1" />
              </Field>
            </div>
            <Field label="Session Title *">
              <input type="text" value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                className={ic} placeholder="e.g. Introduction to Balance of Payments" />
            </Field>
            <Field label="PDF Filename">
              <input type="text" value={form.pdf_filename}
                onChange={(e) => setForm((f) => ({ ...f, pdf_filename: e.target.value }))}
                className={ic} placeholder="e.g. PPT-7-INE-BalanceofPayments.pdf" />
              <p className="text-xs text-slate-400 mt-1">File must exist in <code>public/pdfs/</code></p>
            </Field>
            <Field label="Notes (Markdown)">
              <textarea
                value={form.notes_md}
                onChange={(e) => setForm((f) => ({ ...f, notes_md: e.target.value }))}
                className={ic + ' h-56 resize-y font-mono text-xs'}
                placeholder={`# Session Title\n\n## Key Concepts\n\n- Point 1\n- Point 2\n\n**Bold**, *italic*, \`code\`\n\n| Column 1 | Column 2 |\n|---|---|\n| A | B |`}
              />
              <p className="text-xs text-slate-400 mt-1">Full Markdown supported — headings, lists, tables, bold, code blocks.</p>
            </Field>
            <Field label="Display Order">
              <input type="number" value={form.sort_order}
                onChange={(e) => setForm((f) => ({ ...f, sort_order: +e.target.value }))}
                className={ic} />
            </Field>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Session'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Media management modal */}
      {mediaFor && (
        <Modal title={`Media — ${mediaFor.title}`} onClose={() => setMediaFor(null)}>
          <div className="space-y-4">
            {media.length > 0 ? (
              <div className="space-y-2">
                {media.map((m) => (
                  <div key={m.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-xs font-semibold text-slate-500 shrink-0 pt-0.5 w-16">
                      {m.media_type === 'youtube' ? '▶ Video' : '🖼 Image'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 truncate font-mono">{m.url}</p>
                      {m.caption && <p className="text-xs text-slate-400 mt-0.5 italic">{m.caption}</p>}
                    </div>
                    <button onClick={() => deleteMedia(m.id)} className="text-red-400 hover:text-red-600 text-base shrink-0 leading-none">×</button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">No media added yet.</p>
            )}

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <p className="text-sm font-semibold text-slate-700">Add New Media</p>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Type">
                  <select value={newMedia.media_type}
                    onChange={(e) => setNewMedia((m) => ({ ...m, media_type: e.target.value as 'youtube' | 'image' }))}
                    className={ic}>
                    <option value="youtube">YouTube Video</option>
                    <option value="image">Image URL</option>
                  </select>
                </Field>
                <div className="col-span-2">
                  <Field label="URL *">
                    <input type="url" value={newMedia.url}
                      onChange={(e) => setNewMedia((m) => ({ ...m, url: e.target.value }))}
                      className={ic}
                      placeholder={newMedia.media_type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://example.com/image.png'} />
                  </Field>
                </div>
              </div>
              <Field label="Caption (optional)">
                <input type="text" value={newMedia.caption}
                  onChange={(e) => setNewMedia((m) => ({ ...m, caption: e.target.value }))}
                  className={ic} placeholder="e.g. Figure 2.1: The BOP Framework" />
              </Field>
              {mediaErr && <p className="text-sm text-red-600">{mediaErr}</p>}
              <div className="flex justify-end">
                <button onClick={addMedia} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Add Media
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function FilterBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${active ? 'bg-teal-600 text-white' : 'bg-white border border-gray-200 text-slate-600 hover:border-teal-300'}`}>
      {label}
    </button>
  );
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}
const ic = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';
