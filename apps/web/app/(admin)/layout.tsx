import { NavBar } from '@/components/nav/NavBar'
import { CommandPalette } from '@/components/nav/CommandPalette'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A1628]">
      <NavBar />
      <CommandPalette />
      <div className="pt-16 max-w-screen-2xl mx-auto px-6">{children}</div>
    </div>
  )
}
