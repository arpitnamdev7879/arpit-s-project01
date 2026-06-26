"use client";

import { useState, useEffect } from "react";
import { getWalletAddress, getCitizenComplaints } from "@/hooks/contract";
import type { Complaint } from "@/hooks/contract";
import ComplaintCard from "@/components/ComplaintCard";
import WalletConnectButton from "@/components/WalletConnectButton";
import { DEPARTMENTS } from "@/lib/utils";

export default function Dashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState("All");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWalletAddress().then(setWalletAddress);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      setLoading(true);
      getCitizenComplaints(walletAddress)
        .then(setComplaints)
        .catch((e) => {
          console.error("Failed to fetch complaints:", e);
          setComplaints([]);
        })
        .finally(() => setLoading(false));
    }
  }, [walletAddress]);

  const filteredComplaints = selectedDept === "All"
    ? complaints
    : complaints.filter(c => c.department === selectedDept);

  const activeCount = complaints.filter(
    c => c.status === "Submitted" || c.status === "InReview"
  ).length;

  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Track and manage your complaints
          </p>
        </div>
        {!walletAddress && <WalletConnectButton onAddressChange={setWalletAddress} />}
      </div>

      {walletAddress ? (
        <>
          {/* Stats */}
          {loading && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-200 text-sm text-indigo-600 flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading complaints...
            </div>
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Complaints", value: complaints.length, color: "text-indigo-600", bg: "bg-indigo-50" },
              { label: "Active", value: activeCount, color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Resolved", value: resolvedCount, color: "text-emerald-600", bg: "bg-emerald-50" },
              { label: "Escalated", value: complaints.filter(c => c.status === "Escalated").length, color: "text-red-600", bg: "bg-red-50" },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl border border-zinc-200 bg-white p-5`}>
                <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-zinc-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedDept("All")}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedDept === "All"
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              All
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDept === dept
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Complaints List */}
          <div className="space-y-4">
            {!loading && filteredComplaints.length === 0 ? (
              <div className="text-center py-16">
                <svg className="w-16 h-16 mx-auto text-zinc-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-zinc-500 font-medium">No complaints found</p>
                <p className="text-zinc-400 text-sm mt-1">Submit your first complaint to get started</p>
              </div>
            ) : (
              filteredComplaints.map((complaint) => (
                <ComplaintCard key={complaint.id.toString()} complaint={complaint} />
              ))
            )}
          </div>
        </>
      ) : (
        /* Connect prompt */
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Connect Your Wallet</h2>
          <p className="text-zinc-500 max-w-md mx-auto mb-8">
            Connect your Freighter wallet to view your complaints, track status, and submit new issues.
          </p>
          <WalletConnectButton onAddressChange={setWalletAddress} />
        </div>
      )}
    </div>
  );
}
