"use client";

import { Client, networks } from "contract";
import {
  isConnected,
  getAddress,
  signTransaction,
  isAllowed,
  setAllowed,
} from "@stellar/freighter-api";

const RPC_URL = "https://soroban-testnet.stellar.org";

let client: Client | null = null;

function getClient(): Client {
  if (!client) {
    client = new Client({
      rpcUrl: RPC_URL,
      networkPassphrase: networks.testnet.networkPassphrase,
      contractId: networks.testnet.contractId,
      signTransaction: async (txXdr: string) => {
        return signTransaction(txXdr, {
          networkPassphrase: networks.testnet.networkPassphrase,
        });
      },
    });
  }
  return client;
}

// ========================
// Wallet helpers
// ========================

export async function connectWallet(): Promise<string | null> {
  try {
    const { isConnected: connected } = await isConnected();
    if (!connected) {
      const { isAllowed: allowed } = await isAllowed();
      if (!allowed) {
        await setAllowed();
      }
    }
    const { address } = await getAddress();
    return address;
  } catch (e) {
    console.error("Failed to connect wallet:", e);
    return null;
  }
}

export async function getWalletAddress(): Promise<string | null> {
  try {
    const { address } = await getAddress();
    return address;
  } catch {
    return null;
  }
}

// Check if wallet is Freighter (synchronous check, use as fallback)
export function isFreighterAvailable(): boolean {
  return typeof window !== "undefined" && "freighter" in window;
}

// Async check — more reliable, uses freighter-api's isConnected()
export async function checkFreighterAvailable(): Promise<boolean> {
  try {
    await isConnected();
    return true;
  } catch {
    return false;
  }
}

// ========================
// Contract API Functions
// ========================

export async function initAdmin(admin: string) {
  const c = getClient();
  const tx = await c.init({ admin });
  return tx.signAndSend();
}

export async function submitComplaint(
  citizen: string,
  department: string,
  title: string,
  description: string,
  urgency: number,
  deadline: bigint,
): Promise<bigint> {
  const c = getClient();
  const tx = await c.submit({
    citizen,
    department,
    title,
    description,
    urgency,
    deadline,
  });
  const sent = await tx.signAndSend();
  return sent.result!;
}

export async function assignOfficer(
  admin: string,
  complaintId: bigint | number,
  officer: string,
) {
  const c = getClient();
  const tx = await c.assign({
    admin,
    complaint_id: BigInt(complaintId),
    officer,
  });
  return tx.signAndSend();
}

export async function resolveComplaint(
  officer: string,
  complaintId: bigint | number,
) {
  const c = getClient();
  const tx = await c.resolve({
    officer,
    complaint_id: BigInt(complaintId),
  });
  return tx.signAndSend();
}

export async function escalateComplaint(
  admin: string,
  complaintId: bigint | number,
) {
  const c = getClient();
  const tx = await c.escalate({
    admin,
    complaint_id: BigInt(complaintId),
  });
  return tx.signAndSend();
}

export async function getComplaint(complaintId: bigint | number) {
  const c = getClient();
  const tx = await c.get({ complaint_id: BigInt(complaintId) });
  return tx.result;
}

export async function getCitizenComplaints(citizen: string) {
  const c = getClient();
  const tx = await c.get_by_citizen({ citizen });
  return tx.result;
}

export async function getDepartmentComplaints(department: string) {
  const c = getClient();
  const tx = await c.get_by_department({ department });
  return tx.result;
}

export async function getDepartmentCount(department: string): Promise<number> {
  const c = getClient();
  const tx = await c.get_department_count({ department });
  return Number(tx.result);
}

// ========================
// Type exports
// ========================

export type { Complaint } from "contract";
