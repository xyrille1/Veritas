'use client'

import { useState }   from 'react'
import { useMutation } from '@tanstack/react-query'
import { SectionHeader } from '@/components/shared/ui'

export default function IncidentsPage() {
  const [paused, setPaused]   = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [lastTx, setLastTx]   = useState<string | null>(null)

  const toggle = useMutation({
    mutationFn: async (action: 'pause' | 'resume') => {
      const res = await fetch('/api/admin/incidents', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error((await res.json()).error)
      return res.json()
    },
    onSuccess: (data, variable) => {
      setPaused(variable === 'pause')
      setLastTx(data.digest)
      setConfirm(false)
    },
  })

  return (
    <div className="space-y-6 py-8">
      <SectionHeader title="Incidents" subtitle="Emergency controls for the VERITAS platform." />

      {/* Emergency Pause */}
      <div className="bg-[#112040] border border-red-500/20 rounded-[12px] p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="text-3xl mt-0.5">🚨</div>
          <div className="flex-1">
            <h2 className="text-white font-bold text-lg">Emergency Pause</h2>
            <p className="text-[#94A3B8] text-sm mt-1">
              Immediately halts all new escrow operations on-chain. Existing verified settlements are not affected.
              This action is executed as a SUI PTB and is recorded immutably in the audit log.
            </p>
          </div>
        </div>

        <div className={`p-4 rounded-[10px] ${paused ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#22C55E]/10 border border-[#22C55E]/20'}`}>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${paused ? 'bg-red-500 animate-pulse' : 'bg-[#22C55E]'}`} />
            <span className={`font-semibold text-sm ${paused ? 'text-red-400' : 'text-[#22C55E]'}`}>
              {paused ? 'PLATFORM PAUSED — New escrow operations halted' : 'Platform Operating Normally'}
            </span>
          </div>
        </div>

        {lastTx && (
          <p className="text-[#94A3B8] text-xs">
            Last action tx:{' '}
            <a href={`https://suiexplorer.com/txblock/${lastTx}?network=testnet`}
               target="_blank" rel="noreferrer" className="text-[#2563EB] underline">
              {lastTx.slice(0, 20)}… ↗
            </a>
          </p>
        )}

        {!confirm ? (
          <button
            onClick={() => setConfirm(true)}
            className={`px-6 py-3 font-semibold rounded-[10px] transition-colors ${
              paused
                ? 'bg-[#22C55E] text-white hover:bg-[#16a34a]'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {paused ? '▶ Resume Platform' : '⏸ Pause Platform'}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-red-400 text-sm font-medium">
              ⚠ Are you certain? This affects all active escrow operations.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => toggle.mutate(paused ? 'resume' : 'pause')}
                disabled={toggle.isPending}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-[10px] hover:bg-red-700 disabled:opacity-50"
              >
                {toggle.isPending ? 'Executing…' : 'Confirm'}
              </button>
              <button onClick={() => setConfirm(false)}
                className="px-6 py-3 border border-white/10 text-[#94A3B8] rounded-[10px] hover:text-white">
                Cancel
              </button>
            </div>
            {toggle.isError && (
              <p className="text-red-400 text-sm">{(toggle.error as Error).message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
