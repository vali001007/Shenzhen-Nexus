import { useState } from 'react'
import { LoginPage } from './pages/LoginPage'
import { ScanPage } from './pages/ScanPage'

export interface MerchantProfile {
  services: {
    englishService: boolean
    foreignCard: boolean
    privateRoom: boolean
    conciergeSupport: boolean
  }
  discountText: string
}

const defaultProfile: MerchantProfile = {
  services: {
    englishService: true,
    foreignCard: true,
    privateRoom: false,
    conciergeSupport: false,
  },
  discountText: '',
}

export function App() {
  const [merchantId, setMerchantId] = useState(() => localStorage.getItem('snx-merchant-id') || '')
  const [profile, setProfile] = useState<MerchantProfile>(() => {
    const saved = localStorage.getItem(`snx-merchant-profile-${localStorage.getItem('snx-merchant-id') || ''}`)
    if (!saved) return defaultProfile
    try {
      return JSON.parse(saved)
    } catch {
      return defaultProfile
    }
  })

  const handleLogin = (id: string) => {
    localStorage.setItem('snx-merchant-id', id)
    const saved = localStorage.getItem(`snx-merchant-profile-${id}`)
    if (saved) {
      try {
        setProfile(JSON.parse(saved))
      } catch {
        setProfile(defaultProfile)
      }
    } else {
      setProfile(defaultProfile)
    }
    setMerchantId(id)
  }

  const handleLogout = () => {
    localStorage.removeItem('snx-merchant-id')
    setMerchantId('')
  }

  const handleProfileChange = (next: MerchantProfile) => {
    setProfile(next)
    if (merchantId) {
      localStorage.setItem(`snx-merchant-profile-${merchantId}`, JSON.stringify(next))
    }
  }

  if (!merchantId) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <ScanPage merchantId={merchantId} onLogout={handleLogout} profile={profile} onProfileChange={handleProfileChange} />
}
