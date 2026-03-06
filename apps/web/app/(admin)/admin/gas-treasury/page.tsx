'use client'

import { useQuery }                from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { SectionHeader, StatCard, Spinner } from '@/components/shared/ui'
import { mistToSui }               from '@/lib/sui/client'

export default function GasTreasuryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['gas-treasury'],
    queryFn:  async () => {
      const res = await fetch('/api/admin/gas-treasury')
      return res.json()
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  })

  const chartData = (data?.gasSeries ?? []).map((d: { date: string; mist: number }) => ({
    date: d.date.slice(5),       // MM-DD
    sui:  parseFloat(parseFloat(mistToSui(d.mist)).toFixed(6)),
  }))

  const balanceSui = data?.totalMist ? parseFloat(mistToSui(Number(data.totalMist))) : 0

  return (
    <div className="space-y-6 py-8">
      <SectionHeader title="Gas Treasury" subtitle="Sponsor wallet balance and daily gas expenditure." />

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size={36} /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              label="Treasury Balance"
              value={`${balanceSui.toFixed(4)} SUI`}
              accentColor="#2563EB"
            />
            <StatCard
              label="Network"
              value="SUI Testnet"
              accentColor="#D4A017"
            />
          </div>

          <div className="bg-[#112040] border border-white/5 rounded-[12px] p-6">
            <h2 className="text-white font-semibold mb-1">Daily Gas Expenditure (last 30 days)</h2>
            <p className="text-[#94A3B8] text-xs mb-6">Values in SUI (MIST converted)</p>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E3A5F" />
                  <XAxis
                    dataKey="date"
                    stroke="#94A3B8"
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94A3B8"
                    tick={{ fontSize: 11, fill: '#94A3B8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#112040',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(v: number | undefined) => v != null ? [`${v} SUI`, 'Gas'] : ['-', 'Gas']}
                  />
                  <Line
                    type="monotone"
                    dataKey="sui"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#2563EB' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[#94A3B8] text-sm text-center py-12">No gas data available yet.</p>
            )}
          </div>

          {data?.treasuryAddress && (
            <div className="bg-[#112040] border border-white/5 rounded-[12px] p-4">
              <p className="text-[#94A3B8] text-xs uppercase tracking-wide mb-1">Treasury Address</p>
              <code className="text-white font-mono text-sm break-all">{data.treasuryAddress}</code>
            </div>
          )}
        </>
      )}
    </div>
  )
}
