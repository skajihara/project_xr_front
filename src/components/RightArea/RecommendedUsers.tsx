// src/components/RightArea/RecommendedUsers.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUserStore } from '@/stores/useUserStore'

type Account = {
  id: string
  name: string
  icon?: string
}

export default function RecommendedUsers() {
  const currentUser = useUserStore(s => s.user)
  const [users, setUsers] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:5000/accounts')
      .then(res => {
        if (!res.ok) throw new Error('ユーザー取得失敗')
        return res.json()
      })
      .then((data: Account[]) => {
        // 自分以外から最初の5件だけチョイス
        setUsers(data.filter(u => u.id !== currentUser?.id).slice(0, 5))
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [currentUser])

  if (loading) return <p>おすすめユーザー読み込み中…</p>
  if (error)   return <p className="text-red-600">エラー: {error}</p>

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
