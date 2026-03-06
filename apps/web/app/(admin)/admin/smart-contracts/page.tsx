"use client";

import { useQuery } from "@tanstack/react-query";
import { SectionHeader, Spinner } from "@/components/shared/ui";

interface Contract {
  label: string;
  address: string;
  status: "ok" | "error";
  error?: string;
}

export default function SmartContractsPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["smart-contracts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/smart-contracts");
      return res.json();
    },
    staleTime: 60_000,
  });

  return (
    <div className="space-y-6 py-8">
      <div className="flex items-end justify-between">
        <SectionHeader
          title="Smart Contracts"
          subtitle="On-chain contract health on SUI Testnet."
        />
        <button
          onClick={() => refetch()}
          className="px-4 py-2 text-sm border border-white/10 text-[#94A3B8] rounded-[8px]
                     hover:text-white hover:border-white/20 transition-colors"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size={32} />
        </div>
      ) : (
        <div className="space-y-3">
          {(data?.contracts ?? []).map((c: Contract) => (
            <div
              key={c.label}
              className="bg-[#112040] border border-white/5 rounded-[12px] p-5
                                          flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-white font-semibold capitalize">{c.label}</p>
                <code className="text-[#94A3B8] font-mono text-xs">
                  {c.address}
                </code>
                {c.error && (
                  <p className="text-red-400 text-xs mt-1">{c.error}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${c.status === "ok" ? "bg-[#22C55E]" : "bg-red-500"}`}
                />
                <span
                  className={`text-sm font-medium ${c.status === "ok" ? "text-[#22C55E]" : "text-red-400"}`}
                >
                  {c.status === "ok" ? "Online" : "Error"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#112040] border border-white/5 rounded-[12px] p-5">
        <p className="text-[#94A3B8] text-xs uppercase tracking-wide mb-1">
          Network
        </p>
        <p className="text-white font-semibold">{data?.network ?? "testnet"}</p>
      </div>
    </div>
  );
}
