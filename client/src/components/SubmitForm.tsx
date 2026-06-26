"use client";

import { useState } from "react";
import { DEPARTMENTS, URGENCY_LABELS } from "@/lib/utils";

interface SubmitFormProps {
  onSubmit: (data: {
    department: string;
    title: string;
    description: string;
    urgency: number;
    deadlineDays: number;
  }) => Promise<void>;
  loading?: boolean;
}

export default function SubmitForm({ onSubmit, loading = false }: SubmitFormProps) {
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState(5);
  const [deadlineDays, setDeadlineDays] = useState(7);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!department || !title || !description) return;
    await onSubmit({ department, title, description, urgency, deadlineDays });
    setTitle("");
    setDescription("");
    setDepartment("");
    setUrgency(5);
    setDeadlineDays(7);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Department
        </label>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        >
          <option value="">Select a department...</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Complaint Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Brief title describing the issue"
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Provide details about the complaint..."
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
        />
      </div>

      {/* Urgency */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Urgency Level: <span className="font-bold text-indigo-600">{URGENCY_LABELS[urgency]}</span>
        </label>
        <input
          type="range"
          min={1}
          max={10}
          value={urgency}
          onChange={(e) => setUrgency(parseInt(e.target.value))}
          className="w-full accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-1">
          <span>Minimal</span>
          <span>Emergency</span>
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Expected Resolution (days)
        </label>
        <input
          type="number"
          min={1}
          max={365}
          value={deadlineDays}
          onChange={(e) => setDeadlineDays(parseInt(e.target.value))}
          className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting...
          </span>
        ) : (
          "Submit Complaint"
        )}
      </button>
    </form>
  );
}
