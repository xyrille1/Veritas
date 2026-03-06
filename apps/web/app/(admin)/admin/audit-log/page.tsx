"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader, Spinner, EmptyState } from "@/components/shared/ui";
import { truncateAddress, relativeTime, suiExplorerTxUrl } from "@/lib/utils";

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [action, setAction] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["audit-log", page, action],
    queryFn: async () => {
      const p = new URLSearchParams({ page: String(page) });
      if (action) p.set("action", action);
      const res = await fetch(`/api/admin/audit-log?${p}`);
      return res.json();
    },
    staleTime: 10_000,
    refetchInterval: 10_000,
  });

  return (
    <div className="space-y-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <SectionHeader
          title="Audit Log"
          subtitle="Immutable record of all platform actions."
        />
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 bg-[#112040] border border-white/10 rounded-[8px] text-white text-sm
                     focus:outline-none focus:border-[#2563EB]"
        >
          <option value="">All Actions</option>
          <option value="USER_LOGIN">User Login</option>
          <option value="SETTLEMENT_EXECUTED">Settlement</option>
          <option value="DISPUTE_OPENED">Dispute</option>
          <option value="USER_ROLE_UPDATED">Role Update</option>
          <option value="EMERGENCY_PAUSE">Emergency Pause</option>
        </select>
      </div>

      <div className="bg-[#112040] border border-white/5 rounded-[12px] p-6 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size={28} />
          </div>
        ) : !data?.entries?.length ? (
          <EmptyState
            title="No audit entries"
            description="Actions will appear here as they occur."
          />
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/5 text-[#94A3B8] uppercase tracking-wide">
                <th className="text-left py-3 px-2">Time</th>
                <th className="text-left py-3 px-2">Actor</th>
                <th className="text-left py-3 px-2">Action</th>
                <th className="text-left py-3 px-2">Resource</th>
                <th className="text-left py-3 px-2">Tx</th>
              </tr>
            </thead>
            <tbody>
              {data.entries.map(
                (e: {
                  _id: string;
                  createdAt: string;
                  actorDisplay: string;
                  actorAddress: string;
                  action: string;
                  resourceType: string;
                  resourceId: string;
                  txDigest?: string;
                }) => (
                  <tr
                    key={e._id}
                    className="border-b border-white/5 hover:bg-white/3"
                  >
                    <td className="py-2 px-2 text-[#94A3B8]">
                      {relativeTime(e.createdAt)}
                    </td>
                    <td className="py-2 px-2">
                      <div className="text-white">{e.actorDisplay}</div>
                      <div className="text-[#94A3B8] font-mono">
                        {truncateAddress(e.actorAddress)}
                      </div>
                    </td>
                    <td className="py-2 px-2">
                      <code className="text-[#2563EB] bg-[#2563EB]/10 px-1.5 py-0.5 rounded">
                        {e.action}
                      </code>
                    </td>
                    <td className="py-2 px-2 text-[#94A3B8]">
                      {e.resourceType}:{" "}
                      <code className="font-mono text-white">
                        {truncateAddress(e.resourceId)}
                      </code>
                    </td>
                    <td className="py-2 px-2">
                      {e.txDigest && (
                        <a
                          href={suiExplorerTxUrl(e.txDigest)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#2563EB] underline"
                        >
                          {truncateAddress(e.txDigest)} ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        )}

        {data?.total > 100 && (
          <div className="flex justify-between mt-4 text-sm text-[#94A3B8]">
            <span>{data.total} entries</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border border-white/10 rounded disabled:opacity-40"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border border-white/10 rounded"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
