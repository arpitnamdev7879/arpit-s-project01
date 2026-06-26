import { rpc, nativeToScVal, scValToNative, Address, xdr } from "@stellar/stellar-sdk";

// ScVal conversion helpers
export function toScValString(v: string) {
  return nativeToScVal(v, { type: "string" });
}

export function toScValU32(v: number) {
  return nativeToScVal(v, { type: "u32" });
}

export function toScValI128(v: string | number | bigint) {
  return nativeToScVal(v.toString(), { type: "i128" });
}

export function toScValU64(v: string | number | bigint) {
  return nativeToScVal(v.toString(), { type: "u64" });
}

export function toScValI64(v: string | number | bigint) {
  return nativeToScVal(v.toString(), { type: "i64" });
}

export function toScValAddress(v: string) {
  return new Address(v).toScVal();
}

export function toScValBool(v: boolean) {
  return nativeToScVal(v);
}

export function toScValSymbol(v: string) {
  return nativeToScVal(v, { type: "symbol" });
}

export function fromScVal(sv: any): any {
  return scValToNative(sv);
}

// Stellar network configuration
export const NETWORK_CONFIG = {
  rpcUrl: "https://soroban-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
};

// Contract configuration - UPDATE THIS with your deployed contract address
export const CONTRACT_ADDRESS = "CAIN3UH2KIVGAY55LSGRD5I37HI3N3OWXXL2B5PBNM4WWP22BWHLBM53";

export const DEPARTMENTS = [
  "Health",
  "Education", 
  "Transportation",
  "Sanitation",
  "PublicSafety",
  "Housing",
  "Water",
  "Electricity",
  "Environment",
  "Agriculture",
];

export const URGENCY_LABELS: Record<number, string> = {
  1: "Trivial",
  2: "Minor",
  3: "Moderate",
  4: "Notable",
  5: "Important",
  6: "Significant",
  7: "Critical",
  8: "Urgent",
  9: "Emergency",
  10: "Immediate",
};

export const STATUS_COLORS: Record<string, string> = {
  Submitted: "bg-yellow-100 text-yellow-800 border-yellow-300",
  InReview: "bg-blue-100 text-blue-800 border-blue-300",
  Resolved: "bg-green-100 text-green-800 border-green-300",
  Escalated: "bg-red-100 text-red-800 border-red-300",
};
