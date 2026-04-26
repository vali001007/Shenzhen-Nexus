import { useState } from 'react'

export function LoginPage({ onLogin }: { onLogin: (id: string) => void }) {
  const [id, setId] = useState('')

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Shenzhen Nexus</h1>
          <p className="text-sm text-slate-400 mt-1">商户核销系统</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <label className="block text-sm text-slate-400">
            商户 ID
            <input
              type="text"
              className="mt-2 w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              placeholder="e.g. pingan-merchant-1"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && id.trim() && onLogin(id.trim())}
            />
          </label>

          <button
            className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition"
            disabled={!id.trim()}
            onClick={() => onLogin(id.trim())}
          >
            登录
          </button>
        </div>

        <p className="text-center text-xs text-slate-600">MVP 版本 · 无需密码</p>
      </div>
    </div>
  )
}
