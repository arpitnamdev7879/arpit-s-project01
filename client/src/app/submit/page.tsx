"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getWalletAddress, connectWallet, submitComplaint } from "@/hooks/contract";
import SubmitForm from "@/components/SubmitForm";
import WalletConnectButton from "@/components/WalletConnectButton";

export default function SubmitPage() {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: {
    department: string;
    title: string;
    description: string;
    urgency: number;
    deadlineDays: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      let addr = walletAddress || (await connectWallet());
      if (!addr) {
        throw new Error("Please connect your wallet first");
      }
      setWalletAddress(addr);

      const deadlineTimestamp =
        BigInt(Math.floor(Date.now() / 1000) + data.deadlineDays * 86400);

      const id = await submitComplaint(
        addr,
        data.department,
        data.title,
        data.description,
        data.urgency,
        deadlineTimestamp
      );

      setSuccess(Number(id));
    } catch (e: any) {
      setError(e.message || "Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">Complaint Submitted!</h1>
        <p className="text-zinc-500 mb-2">
          Your complaint has been recorded on the Stellar blockchain.
        </p>
        <p className="text-sm font-mono text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl inline-block mb-8">
          Complaint ID: #{success!.toString()}
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            View Dashboard
          </button>
          <button
            onClick={() => setSuccess(null)}
            className="px-6 py-3 rounded-xl border border-zinc-300 text-zinc-700 font-semibold hover:bg-zinc-50 transition-colors"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900">Submit a Complaint</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Report an issue to the relevant government department. All records are stored on-chain.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8">
            {walletAddress ? (
              <div className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Connected as {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm text-zinc-500 mb-3">Connect your wallet to submit a complaint:</p>
                <WalletConnectButton onAddressChange={setWalletAddress} />
              </div>
            )}

            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <SubmitForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 p-5">
            <h3 className="font-semibold text-zinc-900 mb-3">Submission Tips</h3>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Be specific and include relevant details
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Select the correct department for faster resolution
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                Set realistic deadlines for the department
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-500 font-bold">•</span>
                High urgency issues get priority attention
              </li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-5">
            <h3 className="font-semibold text-indigo-900 mb-2">On-Chain Security</h3>
            <p className="text-sm text-indigo-700 leading-relaxed">
              Your complaint is recorded on the Stellar blockchain and cannot be altered or deleted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
