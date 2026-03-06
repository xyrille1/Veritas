"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  SectionHeader,
  Spinner,
  EmptyState,
  Button,
} from "@/components/shared/ui";

interface Org {
  _id: string;
  name: string;
  domain?: string;
  tier: string;
  createdAt: string;
}

export default function OrganisationsPage() {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [creating, setCreating] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orgs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/organisations");
      return res.json();
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/organisations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, domain: newDomain }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-orgs"] });
      setNewName("");
      setNewDomain("");
      setCreating(false);
    },
  });

  return (
    <div className="space-y-6 py-8">
      <div className="flex items-end justify-between">
        <SectionHeader
          title="Organisations"
          subtitle="Manage enterprise organisations on the platform."
        />
        <Button variant="primary" size="sm" onClick={() => setCreating(true)}>
          + New Org
        </Button>
      </div>

      {/* Create form */}
      {creating && (
        <div className="bg-[#112040] border border-[#2563EB]/30 rounded-[12px] p-5 space-y-3">
          <h3 className="text-white font-semibold">Create Organisation</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Organisation name"
              className="px-4 py-2 bg-[#0A1628] border border-white/10 rounded-[8px] text-white text-sm
                         focus:outline-none focus:border-[#2563EB]"
            />
            <input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              placeholder="domain.com (optional)"
              className="px-4 py-2 bg-[#0A1628] border border-white/10 rounded-[8px] text-white text-sm
                         focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          {create.isError && (
            <p className="text-red-400 text-sm">
              {(create.error as Error).message}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => create.mutate()}
              disabled={!newName || create.isPending}
            >
              {create.isPending ? "Creating…" : "Create"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCreating(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="bg-[#112040] border border-white/5 rounded-[12px] p-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size={28} />
          </div>
        ) : !data?.orgs?.length ? (
          <EmptyState
            title="No organisations"
            description="Create the first organisation above."
          />
        ) : (
          <div className="space-y-3">
            {data.orgs.map((org: Org) => (
              <div
                key={org._id}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="text-white font-medium">{org.name}</p>
                  {org.domain && (
                    <p className="text-[#94A3B8] text-xs">{org.domain}</p>
                  )}
                </div>
                <span className="px-2 py-0.5 text-xs bg-[#2563EB]/10 text-[#2563EB] rounded-full">
                  {org.tier}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
