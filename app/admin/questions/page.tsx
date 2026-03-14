'use client';

import { useState, useEffect } from 'react';
import type { Question, Topic, Lecture } from '@/lib/types';

type FormState = {
  topic_id: string;
  lecture_id: string;
  question_text: string;
  model_answer: string;
  question_type: 'short_answer' | 'long_answer';
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
};

const EMPTY_FORM: FormState = { topic_id: '', lecture_id: '', question_text: '', model_answer: '', question_type: 'long_answer', marks: 5, difficulty: 'medium' };

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<(Question & { topics: { name: string } })[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Question | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');

  async function load() {
    const [qData, tData] = await Promise.all([
      fetch('/api/questions').then((r) => r.json()),
      fetch('/api/topics').then((r) => r.json()),
    ]);
    setQuestions(qData);
    setTopics(tData);
  }

  useEffect(() => { load(); }, []);

  async function loadLectures(topicId: string) {
    if (!topicId) return setLectures([]);
    const data = await fetch(`/api/lectures?topic=${topicId}`).then((r) => r.json());
    setLectures(data);
  }

  function openAdd() {
    setEditing(null);
    const defTopic = filterTopic === 'all' ? (topics[0]?.id ?? '') : filterTopic;
    setForm({ ...EMPTY_FORM, topic_id: defTopic });
    loadLectures(defTopic);
    setError('');
    setShowForm(true);
  }

  function openEdit(q: Question) {
    setEditing(q);
    setForm({ topic_id: q.topic_id, lecture_id: q.lecture_id ?? '', question_text: q.question_text, model_answer: q.model_answer, question_type: q.question_type, marks: q.marks, difficulty: q.difficulty });
    loadLectures(q.topic_id);
    setError('');
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.question_text || !form.model_answer || !form.topic_id) return setError('Topic, question and answer are required.');
    setSaving(true);
    setError('');
    const payload = { ...form, lecture_id: form.lecture_id || null };
    const res = editing
      ? await fetch(`/api/questions/${editing.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      : await fetch('/api/questions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) { const d = await res.json(); return setError(d.error ?? 'Error saving'); }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this question?')) return;
    await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    load();
  }

  const filtered = filterTopic === 'all' ? questions : questions.filter((q) => q.topic_id === filterTopic);

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Questions</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg">
          + Add Question
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-5 flex-wrap">
        <FilterBtn label="All" active={filterTopic === 'all'} onClick={() => setFilterTopic('all')} />
        {topics.map((t) => <FilterBtn key={t.id} label={t.name} active={filterTopic === t.id} onClick={() => setFilterTopic(t.id)} />)}
      </div>

      <div className="space-y-3">
        {filtered.map((q, i) => (
          <div key={q.id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{q.topics?.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : q.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{q.difficulty}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{q.marks} marks</span>
                </div>
                <p className="text-sm font-medium text-slate-800 mb-2">Q{i + 1}. {q.question_text}</p>
                <p className="text-xs text-slate-500 line-clamp-1">Answer: {q.model_answer}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(q)} className="text-sm text-teal-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(q.id)} className="text-sm text-red-500 hover:underline">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400 bg-white border border-gray-200 rounded-xl">
            <p>No questions found.</p>
          </div>
        )}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Question' : 'Add Question'} onClose={() => setShowForm(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Topic *">
                <select value={form.topic_id} onChange={(e) => { setForm((f) => ({ ...f, topic_id: e.target.value, lecture_id: '' })); loadLectures(e.target.value); }} className={inputClass}>
                  <option value="">Select topic...</option>
                  {topics.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Lecture (optional)">
                <select value={form.lecture_id} onChange={(e) => setForm((f) => ({ ...f, lecture_id: e.target.value }))} className={inputClass} disabled={!form.topic_id}>
                  <option value="">All lectures</option>
                  {lectures.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Question *">
              <textarea value={form.question_text} onChange={(e) => setForm((f) => ({ ...f, question_text: e.target.value }))} className={inputClass + ' h-24 resize-none'} placeholder="Enter the question..." />
            </Field>
            <Field label="Model Answer *">
              <textarea value={form.model_answer} onChange={(e) => setForm((f) => ({ ...f, model_answer: e.target.value }))} className={inputClass + ' h-32 resize-y'} placeholder="Enter the model answer. Students will see this after clicking 'Show Answer'." />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Type">
                <select value={form.question_type} onChange={(e) => setForm((f) => ({ ...f, question_type: e.target.value as 'short_answer' | 'long_answer' }))} className={inputClass}>
                  <option value="short_answer">Short Answer</option>
                  <option value="long_answer">Long Answer</option>
                </select>
              </Field>
              <Field label="Marks">
                <input type="number" min={1} max={20} value={form.marks} onChange={(e) => setForm((f) => ({ ...f, marks: +e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Difficulty">
                <select value={form.difficulty} onChange={(e) => setForm((f) => ({ ...f, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))} className={inputClass}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </Field>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Question'}
              </button>
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
