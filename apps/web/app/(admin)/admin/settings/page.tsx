"use client";

import { SectionHeader } from "@/components/shared/ui";
import { APP_CONFIG, CONTRACT_ADDRESSES, ZKLOGIN_CONFIG } from "@/config";

export default function AdminSettingsPage() {
  const configs = [
    {
      group: "Application",
      items: [
        { key: "App Name", value: APP_CONFIG.APP_NAME },
        { key: "Network", value: String(APP_CONFIG.APP_URL) },
        {
          key: "Max Page Size",
          value: String(APP_CONFIG.ADMIN_LIST_PAGE_SIZE),
        },
      ],
    },
    {
      group: "Smart Contracts (Testnet)",
      items: [
        { key: "Package ID", value: CONTRACT_ADDRESSES.SHIPMENT_PACKAGE },
        { key: "Role Registry", value: CONTRACT_ADDRESSES.ROLE_REGISTRY },
        { key: "Escrow Vault", value: CONTRACT_ADDRESSES.ESCROW_VAULT },
      ],
    },
    {
      group: "zkLogin",
      items: [
        { key: "Prover URL", value: ZKLOGIN_CONFIG.PROVER_URL },
        { key: "Redirect URI", value: ZKLOGIN_CONFIG.REDIRECT_URI },
      ],
    },
  ];

  return (
    <div className="space-y-6 py-8">
      <SectionHeader
        title="Platform Settings"
        subtitle="Read-only view of all configuration values."
      />

      {configs.map((group) => (
        <div
          key={group.group}
          className="bg-[#112040] border border-white/5 rounded-[12px] p-6"
        >
          <h2 className="text-white font-semibold mb-4">{group.group}</h2>
          <div className="space-y-3">
            {group.items.map((item) => (
              <div
                key={item.key}
                className="flex justify-between gap-4 py-2 border-b border-white/5 last:border-0"
              >
                <span className="text-[#94A3B8] text-sm shrink-0">
                  {item.key}
                </span>
                <code className="text-white font-mono text-xs text-right break-all">
                  {item.value}
                </code>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-[#112040] border border-[#D4A017]/20 rounded-[12px] p-5">
        <p className="text-[#D4A017] text-sm font-medium mb-1">
          ⚠ Configuration Changes
        </p>
        <p className="text-[#94A3B8] text-sm">
          To update contract addresses or environment variables, edit your{" "}
          <code className="font-mono">.env.local</code> file and redeploy. Smart
          contract addresses require a new deployment to testnet/mainnet.
        </p>
      </div>
    </div>
  );
}
