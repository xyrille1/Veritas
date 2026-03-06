"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader, StatCard } from "@/components/shared/ui";
import { ADMIN_NAV_ITEMS } from "@/config";
import { relativeTime } from "@/lib/utils";

export default function AdminPage() {
  const { data: kpis } = useQuery({
    queryKey: ["admin-kpis"],
    queryFn: async () => {
      const res = await fetch("/api/shipments?kpi=1");
      return res.json();
    },
    staleTime: 15_000,
    refetchInterval: 15_000,
  });

  const { data: recentAudit } = useQuery({
    queryKey: ["recent-audit"],
    queryFn: async () => {
      const res = await fetch("/api/admin/audit-log?page=1");
      return res.json();
    },
    staleTime: 15_000,
    refetchInterval: 15_000,
  });

  return (
    <div className="space-y-8 py-8">
      <SectionHeader
        title="Admin Command Centre"
        subtitle="Real-time platform health and activity feed."
      />

      {/* Quick nav */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ADMIN_NAV_ITEMS.filter((n) => n.href !== "/admin").map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-[#112040] border border-white/5 rounded-[10px] p-4 hover:border-[#2563EB] transition-colors"
          >
            <p className="text-white font-medium text-sm">{item.label}</p>
          </Link>
        ))}
      </div>

      {/* KPI overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Pending"
          value={kpis?.pending ?? "—"}
          accentColor="#F59E0B"
        />
        <StatCard
          label="Settled"
          value={kpis?.settled ?? "—"}
          accentColor="#22C55E"
        />
        <StatCard
          label="Disputed"
          value={kpis?.disputed ?? "—"}
          accentColor="#EF4444"
        />
        <StatCard
          label="Total"
          value={kpis?.total ?? "—"}
          accentColor="#2563EB"
        />
      </div>

      {/* Live audit feed */}
      <div className="bg-[#112040] border border-white/5 rounded-[12px] p-6">
        <h2 className="text-white font-semibold mb-4">Live Audit Feed</h2>
        {recentAudit?.entries?.length ? (
          <ul className="space-y-2 max-h-[400px] overflow-y-auto">
            {recentAudit.entries.map(
              (e: {
                _id: string;
                action: string;
                actorDisplay: string;
                resourceType: string;
                resourceId: string;
                createdAt: string;
              }) => (
                <li
                  key={e._id}
                  className="flex items-start gap-3 py-2 border-b border-white/5 last:border-0"
                >
                  <span className="text-[#94A3B8] text-xs w-24 shrink-0">
                    {relativeTime(e.createdAt)}
                  </span>
                  <span className="text-white text-xs font-mono">
                    {e.action}
                  </span>
                  <span className="text-[#94A3B8] text-xs">
                    {e.actorDisplay}
                  </span>
                  <span className="text-[#94A3B8] text-xs ml-auto">
                    {e.resourceType}
                  </span>
                </li>
              ),
            )}
          </ul>
        ) : (
          <p className="text-[#94A3B8] text-sm">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
