'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useUserStore } from '@/stores/useUserStore'

type AccountDetail = {
  id: string
  name: string
  icon: string
}

export default function MyProfile() {
  const current = useUserStore(s => s.user)
  const [account, setAccount] = useState<AccountDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!current) return
    fetch(`http://localhost:5000/accounts/${current.id}`)
      .then(res => {
        if (!res.ok) throw new Error('アカウント情報取得失敗')
        return res.json()
      })
      .then((data: AccountDetail) => setAccount(data))
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [current])

  if (loading) return <p>プロフィール読み込み中…</p>
  if (error || !account) return <p className="text-red-600">読み込みエラー</p>

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
    </div>
  )
}
