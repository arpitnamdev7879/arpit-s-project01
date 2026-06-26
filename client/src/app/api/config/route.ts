import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    network: "testnet",
    rpcUrl: "https://soroban-testnet.stellar.org",
    networkPassphrase: "Test SDF Network ; September 2015",
    contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
    departments: [
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
    ],
    version: "1.0.0",
  });
}
