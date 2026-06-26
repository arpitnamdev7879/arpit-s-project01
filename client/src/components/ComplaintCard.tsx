"use client";

import { STATUS_COLORS, URGENCY_LABELS } from "@/lib/utils";

interface Complaint {
  id: number | string | bigint;
  citizen: string;
  department: string;
  title: string;
  description: string;
  urgency: number;
  status: string;
  deadline: number | string | bigint;
  officer?: string | null;
  created_at: number | string | bigint;
  resolved_at?: number | string | bigint | null;
}

interface ComplaintCardProps {
  complaint: Complaint;
  onAssign?: (id: number) => void;
  onResolve?: (id: number) => void;
  onEscalate?: (id: number) => void;
  showActions?: boolean;
}

function formatTimestamp(ts: string | number | bigint): string {
  const n = typeof ts === "string" ? parseInt(ts) : Number(ts);
  if (!n || isNaN(n)) return "N/A";
  return new Date(n * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateAddress(addr: string): string {
  if (!addr) return "N/A";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ComplaintCard({
  complaint,
  onAssign,
  onResolve,
  onEscalate,
  showActions = false,
}: ComplaintCardProps) {
  const id = typeof complaint.id === "string" ? parseInt(complaint.id) : Number(complaint.id);
  const isOverdue = complaint.status !== "Resolved" && complaint.status !== "Escalated" &&
    Date.now() / 1000 > Number(complaint.deadline);

  return (
    <div className={`rounded-2xl border p-5 transition-all hover:shadow-md ${
      isOverdue ? "border-red-200 bg-red-50/30" : "border-zinc-200 bg-white"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-zinc-400">#{id}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[complaint.status] || "bg-zinc-100 text-zinc-700"}`}>
            {complaint.status}
          </span>
          {isOverdue && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 animate-pulse">
              OVERDUE
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${
            complaint.urgency >= 8 ? "bg-red-500" :
            complaint.urgency >= 5 ? "bg-amber-500" : "bg-blue-500"
          }`} />
          <span className="text-xs font-medium text-zinc-500">
            {URGENCY_LABELS[complaint.urgency] || `Level ${complaint.urgency}`}
          </span>
        </div>
      </div>

      <h3 className="text-base font-semibold text-zinc-900 mb-1">{complaint.title}</h3>
      <p className="text-sm text-zinc-500 mb-3 line-clamp-2">{complaint.description}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 mb-4">
        <div>
          <span className="block text-zinc-500 font-medium">Department</span>
          {complaint.department}
        </div>
        <div>
          <span className="block text-zinc-500 font-medium">Submitted</span>
          {formatTimestamp(complaint.created_at)}
        </div>
        <div>
          <span className="block text-zinc-500 font-medium">Deadline</span>
          <span className={isOverdue ? "text-red-500 font-medium" : ""}>
            {formatTimestamp(complaint.deadline)}
          </span>
        </div>
        <div>
          <span className="block text-zinc-500 font-medium">Officer</span>
          {complaint.officer ? truncateAddress(complaint.officer as string) : "Unassigned"}
        </div>
        <div>
          <span className="block text-zinc-500 font-medium">Citizen</span>
          {truncateAddress(complaint.citizen)}
        </div>
        {complaint.resolved_at && (
          <div>
            <span className="block text-zinc-500 font-medium">Resolved</span>
            {formatTimestamp(complaint.resolved_at)}
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex gap-2 pt-3 border-t border-zinc-100">
          {complaint.status === "Submitted" && onAssign && (
            <button
              onClick={() => onAssign(id)}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
            >
              Assign to Me
            </button>
          )}
          {complaint.status === "InReview" && onResolve && (
            <button
              onClick={() => onResolve(id)}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
            >
              Mark Resolved
            </button>
          )}
          {(complaint.status === "Submitted" || complaint.status === "InReview") && onEscalate && (
            <button
              onClick={() => onEscalate(id)}
              className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              Escalate
            </button>
          )}
        </div>
      )}
    </div>
  );
}
