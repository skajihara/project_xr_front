// src/components/LeftArea/MyProfile.tsx
'use client'

import { useAccount } from '@/hooks/useAccount'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function MyProfile() {
  const current = useUserStore(s => s.user)!
  const clearUser = useUserStore(s => s.clearUser)
  const router = useRouter()

  const account = useAccount(current.id)

  const handleLogout = () => {
    clearUser()
    router.push('/auth')
  }

  return (
    <div className="flex items-center space-x-3">
      <Image
        src={account.icon || '/icons/account/default_icon.svg'}
        alt={account.name}
        width={40}
        height={40}
        className="rounded-full object-cover bg-gray-200"
      />
      <div>
        <p className="font-semibold">{account.name}</p>
        <p className="text-sm text-gray-500">@{account.id}</p>
      </div>
      <button
        onClick={handleLogout}
        className="px-3 py-1 text-sm text-red-500 hover:underline"
      >
        ログアウト
      </button>
    </div>
  )
}
