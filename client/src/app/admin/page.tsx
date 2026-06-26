"use client";

import { useState, useEffect } from "react";
import {
  getWalletAddress,
  getDepartmentComplaints,
  assignOfficer,
  resolveComplaint,
  escalateComplaint,
} from "@/hooks/contract";
import type { Complaint } from "@/hooks/contract";
import ComplaintCard from "@/components/ComplaintCard";
import WalletConnectButton from "@/components/WalletConnectButton";
import {
  DEPARTMENTS,
  URGENCY_LABELS as URGENCY,
} from "@/lib/utils";

export default function AdminPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState("Health");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  useEffect(() => {
    getWalletAddress().then(setWalletAddress);
  }, []);

  useEffect(() => {
    if (walletAddress && selectedDept) {
      setLoading(true);
      getDepartmentComplaints(selectedDept)
        .then(setComplaints)
        .catch((e) => {
          console.error("Failed to fetch complaints:", e);
          setComplaints([]);
        })
        .finally(() => setLoading(false));
    }
  }, [walletAddress, selectedDept]);

  const handleAssign = async (id: number) => {
    if (!walletAddress) return;
    const officer = prompt("Enter officer address to assign:")?.trim();
    if (!officer) return;
    try {
      setActionMsg("Assigning officer...");
      await assignOfficer(walletAddress, id, officer);
      setActionMsg(`Officer assigned to complaint #${id}`);
      // Refresh
      const updated = await getDepartmentComplaints(selectedDept);
      setComplaints(updated);
    } catch (e: any) {
      setActionMsg(`Error: ${e.message}`);
    }
  };

  const handleResolve = async (id: number) => {
    if (!walletAddress) return;
    try {
      setActionMsg("Resolving complaint...");
      await resolveComplaint(walletAddress, id);
      setActionMsg(`Complaint #${id} resolved`);
      const updated = await getDepartmentComplaints(selectedDept);
      setComplaints(updated);
    } catch (e: any) {
      setActionMsg(`Error: ${e.message}`);
    }
  };

  const handleEscalate = async (id: number) => {
    if (!walletAddress) return;
    try {
      setActionMsg("Escalating complaint...");
      await escalateComplaint(walletAddress, id);
      setActionMsg(`Complaint #${id} escalated`);
      const updated = await getDepartmentComplaints(selectedDept);
      setComplaints(updated);
    } catch (e: any) {
      setActionMsg(`Error: ${e.message}`);
    }
  };

  const totalComplaints = complaints.length;
  const totalPending = complaints.filter(
    (c) => c.status === "Submitted" || c.status === "InReview"
  ).length;
  const totalEscalated = complaints.filter(
    (c) => c.status === "Escalated"
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === "Resolved"
  ).length;
  const overdueCount = complaints.filter(
    (c) =>
      (c.status === "Submitted" || c.status === "InReview") &&
      Date.now() / 1000 > Number(c.deadline)
  ).length;

  if (!walletAddress) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Admin Dashboard
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto mb-8">
            Connect your wallet to access the admin dashboard with pattern
            detection and escalation controls.
          </p>
          <WalletConnectButton onAddressChange={setWalletAddress} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">
            Admin Dashboard
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            System-wide oversight, pattern detection, and escalation management
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-sm text-violet-700">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          Admin Access
        </div>
      </div>

      {/* Alert banner */}
      {overdueCount > 0 && (
        <div className="mb-6 px-5 py-4 rounded-2xl bg-red-50 border border-red-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-red-800">
                {overdueCount} Overdue Complaint(s)
              </p>
              <p className="text-sm text-red-600">
                These complaints have passed their deadline and require
                escalation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action feedback */}
      {actionMsg && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700">
          {actionMsg}
        </div>
      )}

      {/* Overview stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-zinc-900">
                {totalComplaints}
              </div>
              <div className="text-sm text-zinc-500">Total ({selectedDept})</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-amber-600">
                {totalPending}
              </div>
              <div className="text-sm text-zinc-500">Pending</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">
                {totalEscalated + overdueCount}
              </div>
              <div className="text-sm text-zinc-500">Needs Attention</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {resolvedCount}
              </div>
              <div className="text-sm text-zinc-500">Resolved</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Department selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          Select Department
        </label>
        <div className="flex flex-wrap gap-2">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedDept === dept
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-zinc-500">Loading complaints...</p>
        </div>
      )}

      {/* Complaints list */}
      {!loading && (
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto text-zinc-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-zinc-500 font-medium">
                No complaints in {selectedDept}
              </p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id.toString()}
                complaint={complaint}
                showActions
                onAssign={handleAssign}
                onResolve={handleResolve}
                onEscalate={handleEscalate}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
