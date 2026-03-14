'use client';

import { useState, useEffect } from 'react';
import type { Topic } from '@/lib/types';

const EMPTY_FORM = { name: '', slug: '', description: '', sessions: '', color: 'teal', sort_order: 0 };

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Topic | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const data = await fetch('/api/topics').then((r) => r.json());
    setTopics(data);
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError('');
    setShowForm(true);
  }

  function openEdit(t: Topic) {
    setEditing(t);
    setForm({ name: t.name, slug: t.slug, description: t.description ?? '', sessions: t.sessions ?? '', color: t.color, sort_order: t.sort_order });
    setError('');
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.slug) return setError('Name and slug are required.');
    setSaving(true);
    setError('');
    const res = editing
      ? await fetch(`/api/topics/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      : await fetch('/api/topics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    if (!res.ok) { const d = await res.json(); return setError(d.error ?? 'Error saving'); }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this topic? All its lectures and questions will also be deleted.')) return;
    await fetch(`/api/topics/${id}`, { method: 'DELETE' });
    load();
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Topics</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg">
          + Add Topic
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs text-slate-500 uppercase">
            <tr>
              <th className="text-left px-5 py-3">Order</th>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Slug</th>
              <th className="text-left px-5 py-3">Sessions</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {topics.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-5 py-3 text-slate-500">{t.sort_order}</td>
                <td className="px-5 py-3 font-medium text-slate-800">{t.name}</td>
                <td className="px-5 py-3 text-slate-400 font-mono text-xs">{t.slug}</td>
                <td className="px-5 py-3 text-slate-500">{t.sessions ?? '—'}</td>
                <td className="px-5 py-3 text-center">
                  <button onClick={() => openEdit(t)} className="text-teal-600 hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {topics.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-slate-400">No topics yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <Modal title={editing ? 'Edit Topic' : 'Add Topic'} onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            <Field label="Topic Name *">
              <input type="text" value={form.name} onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({ ...f, name, slug: editing ? f.slug : autoSlug(name) }));
              }} className={inputClass} placeholder="e.g. Balance of Payments" />
            </Field>
            <Field label="Slug (URL) *">
              <input type="text" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className={inputClass} placeholder="e.g. balance-of-payments" />
            </Field>
            <Field label="Sessions">
              <input type="text" value={form.sessions} onChange={(e) => setForm((f) => ({ ...f, sessions: e.target.value }))} className={inputClass} placeholder="e.g. Sessions 1-2" />
            </Field>
            <Field label="Description">
              <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={inputClass + ' h-20 resize-none'} placeholder="Brief description of the topic" />
            </Field>
            <Field label="Display Order">
              <input type="number" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: +e.target.value }))} className={inputClass} />
            </Field>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Topic'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
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

const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';
