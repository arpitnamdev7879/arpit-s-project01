import { NextResponse } from "next/server";

// In production, this would aggregate from the Soroban contract
// For now, it provides demo data for the frontend
const DEMO_DEPT_STATS: Record<string, { total: number; pending: number; resolved: number; escalated: number }> = {
  Health: { total: 142, pending: 38, resolved: 89, escalated: 15 },
  Education: { total: 98, pending: 25, resolved: 61, escalated: 12 },
  Transportation: { total: 156, pending: 42, resolved: 97, escalated: 17 },
  Sanitation: { total: 203, pending: 55, resolved: 128, escalated: 20 },
  PublicSafety: { total: 87, pending: 18, resolved: 61, escalated: 8 },
  Housing: { total: 65, pending: 22, resolved: 35, escalated: 8 },
  Water: { total: 112, pending: 29, resolved: 75, escalated: 8 },
  Electricity: { total: 178, pending: 48, resolved: 115, escalated: 15 },
  Environment: { total: 43, pending: 12, resolved: 28, escalated: 3 },
  Agriculture: { total: 29, pending: 8, resolved: 19, escalated: 2 },
};

export async function GET() {
  const departments = Object.entries(DEMO_DEPT_STATS).map(([name, stats]) => ({
    name,
    ...stats,
    resolveRate: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0,
  }));

  return NextResponse.json({
    departments,
    totalComplaints: departments.reduce((a, d) => a + d.total, 0),
    totalPending: departments.reduce((a, d) => a + d.pending, 0),
    totalResolved: departments.reduce((a, d) => a + d.resolved, 0),
    totalEscalated: departments.reduce((a, d) => a + d.escalated, 0),
  });
}
