// src/components/CenterArea/Profile/ProfileHeader.tsx
'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAccount } from '@/hooks/useAccount'

export default function ProfileHeader() {
  const { accountId } = useParams() as { accountId: string }
  const { account, loading, error } = useAccount(accountId)
  const router = useRouter()

  if (loading) return <p>プロフィール読み込み中…</p>
  if (error || !account) return <p className="text-red-600">エラー: {error}</p>

  return (
    <div className="space-y-4 bg-white border-b p-4">
      <button onClick={() => router.push('/home')} className="text-blue-500 hover:underline">
        ← 戻る
      </button>
      <div className="h-48 relative">
        <Image src={account.header_photo} alt="header" width={750} height={200} className="object-cover" />
      </div>
      <div className="flex justify-between items-end -mt-8 px-4">
        <Image
          src={account.icon?.trim() ? account.icon : '/icons/account/default_icon.svg'}
          alt={account.name}
          width={96}
          height={96}
          className="rounded-full border-4 border-white bg-gray-200"
        />
        <button className="px-4 py-1 bg-blue-500 text-white rounded">フォロー中</button>
      </div>
      <div className="px-4 space-y-1">
        <h2 className="text-xl font-bold">{account.name}</h2>
        <p className="text-gray-500">@{account.id}</p>
        <p>{account.bio}</p>
        <p className="text-sm text-gray-500">
          📍 {account.location} • 🎂 {account.birthday}
        </p>
        <p className="text-sm text-gray-500">
          {new Date(account.registered).getFullYear()}年からTwitterを利用しています
        </p>
        <p className="text-sm">
          <span className="font-semibold">{account.following}</span> フォロー中 ・{' '}
          <span className="font-semibold">{account.follower}</span> フォロワー
        </p>
      </div>
    </div>
  )
}
