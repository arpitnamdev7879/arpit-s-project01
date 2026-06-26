"use client";

import { useState, useEffect } from "react";
import {
  getWalletAddress,
  getDepartmentComplaints,
  assignOfficer,
  resolveComplaint,
} from "@/hooks/contract";
import type { Complaint } from "@/hooks/contract";
import ComplaintCard from "@/components/ComplaintCard";
import WalletConnectButton from "@/components/WalletConnectButton";
import { DEPARTMENTS } from "@/lib/utils";

export default function OfficerPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState("Health");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);

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

  const filtered = showUnassignedOnly
    ? complaints.filter((c) => c.status === "Submitted")
    : complaints;

  const myCases = complaints.filter(
    (c) =>
      c.officer &&
      walletAddress &&
      c.officer.toLowerCase() === walletAddress.toLowerCase() &&
      c.status === "InReview"
  ).length;

  const pendingCount = complaints.filter(
    (c) => c.status === "Submitted"
  ).length;

  const urgentCount = complaints.filter((c) => c.urgency >= 8).length;

  const handleAssign = async (id: number) => {
    if (!walletAddress) return;
    try {
      setActionMsg("Assigning complaint to you...");
      await assignOfficer(walletAddress, id, walletAddress);
      setActionMsg(`Complaint #${id} assigned to you`);
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">
            Officer Portal
          </h2>
          <p className="text-zinc-500 max-w-md mx-auto mb-8">
            Connect your wallet to access the officer dashboard and manage
            complaints.
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
            Officer Portal
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage and resolve citizen complaints
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
        </div>
      </div>

      {/* Action feedback */}
      {actionMsg && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200 text-sm text-blue-700">
          {actionMsg}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-2xl font-bold text-indigo-600">
            {complaints.length}
          </div>
          <div className="text-sm text-zinc-500 mt-1">
            Total ({selectedDept})
          </div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-2xl font-bold text-amber-600">{myCases}</div>
          <div className="text-sm text-zinc-500 mt-1">My Cases</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-2xl font-bold text-blue-600">{pendingCount}</div>
          <div className="text-sm text-zinc-500 mt-1">Unassigned</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="text-2xl font-bold text-emerald-600">
            {complaints.filter((c) => c.status === "Resolved").length}
          </div>
          <div className="text-sm text-zinc-500 mt-1">Resolved</div>
        </div>
      </div>

      {/* Department selector */}
      <div className="mb-4">
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

      {/* Toggle unassigned only */}
      <div className="flex items-center gap-4 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showUnassignedOnly}
            onChange={(e) => setShowUnassignedOnly(e.target.checked)}
            className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-sm text-zinc-600">Show unassigned only</span>
        </label>
      </div>

      {/* Urgent alert */}
      {urgentCount > 0 && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-sm font-medium text-red-700">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            {urgentCount} urgent complaint(s) require immediate attention
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-zinc-500">Loading complaints...</p>
        </div>
      )}

      {/* Complaints */}
      {!loading && (
        <div className="space-y-4">
          {filtered.length === 0 ? (
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
            filtered.map((complaint) => (
              <ComplaintCard
                key={complaint.id.toString()}
                complaint={complaint}
                showActions
                onAssign={
                  complaint.status === "Submitted" ? handleAssign : undefined
                }
                onResolve={
                  complaint.status === "InReview" ? handleResolve : undefined
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
