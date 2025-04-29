// src/components/CenterArea/Profile/ProfileHeader.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

type Account = {
  id: string
  name: string
  bio: string
  icon: string
  header_photo: string
  location: string
  birthday: string
  registered: string
  following: number
  follower: number
}

export default function ProfileHeader() {
  const { accountId } = useParams() as { accountId: string }
  const [acct, setAcct] = useState<Account|null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState<string|null>(null)

  useEffect(() => {
    if (!accountId) return
    fetch(`http://localhost:5000/accounts/${accountId}`)
      .then(res => {
        if (!res.ok) throw new Error('プロフィール取得失敗')
        return res.json()
      })
      .then((data: Account) => setAcct(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [accountId])

  if (loading) return <p>プロフィール読み込み中…</p>
  if (error || !acct) return <p className="text-red-600">エラー: {error ?? '見つからないよ'}</p>

  return (
    <div className="space-y-4 bg-white border-b p-4">
      <Link href="/home" className="text-blue-500 hover:underline">← 戻る</Link>
      {/* ヘッダー画像 */}
      <div className="h-48 relative">
        <Image
          src={acct.header_photo}
          alt="header"
          width={800}
          height={200}
          className="object-cover"
        />
      </div>
      {/* アイコンとフォローボタン */}
      <div className="flex justify-between items-end -mt-8 px-4">
        <Image
          src={acct.icon}
          alt="icon"
          width={96}
          height={96}
          className="rounded-full border-4 border-white bg-gray-200"
        />
        <button className="px-4 py-1 bg-blue-500 text-white rounded">フォロー中</button>
      </div>
      {/* 名前など */}
      <div className="px-4 space-y-1">
        <h2 className="text-xl font-bold">{acct.name}</h2>
        <p className="text-gray-500">@{acct.id}</p>
        <p>{acct.bio}</p>
        <p className="text-sm text-gray-500">
          📍 {acct.location} • 🎂 {acct.birthday}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(acct.registered).getFullYear()}年からTwitterを利用しています
        </p>
        <p className="text-sm">
          <span className="font-semibold">{acct.following}</span> フォロー中 ・ 
          <span className="font-semibold">{acct.follower}</span> フォロワー
        </p>
      </div>
    </div>
  )
}
