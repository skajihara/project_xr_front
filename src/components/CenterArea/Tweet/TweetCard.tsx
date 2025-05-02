// src/components/CenterArea/Tweet/TweetCard.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Tweet } from '@/types/tweet'

export default function TweetCard({ tweet }: { tweet: Tweet }) {
  const router = useRouter()
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {
    async function loadIcon() {
      try {
        const res = await fetch(`http://localhost:5000/accounts/${tweet.account_id}`)
        if (!res.ok) throw new Error('アカウント情報取得失敗')
        const account: { icon?: string } = await res.json()
        const iconUrl =
          account.icon && account.icon.trim() !== ''
            ? account.icon
            : '/icons/account/default_icon.svg'
        setIcon(iconUrl)
      } catch {
        setIcon('/icons/account/default_icon.svg')
      }
    }
    loadIcon()
  }, [tweet.account_id])

  // カード全体クリック: ツイート詳細へ
  const goTweet = () => {
    router.push(`/tweet/${tweet.id}`)
  }
  // アイコンクリック: プロフィールへ（バブリング防止）
  const goProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/profile/${tweet.account_id}`)
  }

  return (
    <div
      onClick={goTweet}
      className="border rounded p-4 space-y-2 bg-white cursor-pointer"
    >
      {/* ユーザー情報 */}
      <div className="flex items-center space-x-3">
        {icon ? (
          <Image
            src={icon}
            alt={tweet.account_id}
            width={40}
            height={40}
            className="rounded-full bg-gray-200"
            onClick={goProfile}
          />
        ) : (
          <div
            onClick={goProfile}
            className="w-10 h-10 bg-gray-300 rounded-full cursor-pointer"
          />
        )}
        <div>
          <p className="font-semibold">@{tweet.account_id}</p>
          <p className="text-xs text-gray-500">
            {new Date(tweet.datetime).toLocaleString()}
          </p>
        </div>
      </div>

      {/* テキスト */}
      <p>{tweet.text}</p>

      {/* 画像 */}
      {tweet.image && (
        <Image
          src={tweet.image}
          alt="tweet image"
          width={500}
          height={300}
          className="rounded"
          priority
        />
      )}

      {/* メタ情報 */}
      <div className="flex space-x-4 text-sm text-gray-500">
        <span>❤ {tweet.likes}</span>
        <span>🔁 {tweet.retweets}</span>
        <span>💬 {tweet.replies}</span>
        <span>👁️ {tweet.views}</span>
      </div>
    </div>
  )
}
