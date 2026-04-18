import { Info } from 'lucide-react'
import { useUIStore } from '../stores/useUIStore'

export function Toast() {
  const toast = useUIStore((s) => s.toast)

  return (
    <div
      className={`absolute top-10 left-1/2 transform -translate-x-1/2 bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-full text-sm shadow-xl z-[200] flex items-center gap-2 transition-opacity duration-300 pointer-events-none ${
        toast.visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Info className="w-4 h-4 text-sky-400" />
      <span>{toast.message}</span>
    </div>
  )
}
