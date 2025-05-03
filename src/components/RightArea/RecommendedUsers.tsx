// src/components/RightArea/RecommendedUsers.tsx
'use client'

import { useAccounts } from '@/hooks/useAccounts'
import { useUserStore } from '@/stores/useUserStore'
import Image from 'next/image'

export default function RecommendedUsers() {
  const current = useUserStore(s => s.user)
  const { accounts, loading, error } = useAccounts()

  if (loading) return <p>おすすめユーザー読み込み中…</p>
  if (error)   return <p className="text-red-600">エラー: {error}</p>

  const users = accounts.filter(u => u.id !== current?.id).slice(0, 5)

  return (
    <section className="bg-gray-100 p-3 rounded">
      <h3 className="font-bold mb-2">おすすめユーザー</h3>
      <ul className="space-y-3">
        {users.map(u => (
          <li key={u.id} className="flex items-center space-x-3">
            <Image
              src={u.icon || '/icons/account/default_icon.svg'}
              alt={u.name}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-xs text-gray-500">@{u.id}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
