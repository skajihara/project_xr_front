// src/components/CenterContents/Schedule/ScheduledTweetCard.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { ScheduledTweet } from '@/hooks/useScheduledTweets'

export default function ScheduledTweetCard({ scheduled }: { scheduled: ScheduledTweet }) {
  const [icon, setIcon] = useState<string | null>(null)

  useEffect(() => {
    fetch(`http://localhost:5000/accounts/${scheduled.account_id}`)
      .then(res => res.json())
      .then(acc => {
        const url = acc.icon?.trim() ? acc.icon : '/icons/account/default_icon.svg'
        setIcon(url)
      })
      .catch(() => setIcon('/icons/account/default_icon.svg'))
  }, [scheduled.account_id])

  return (
    <Link href={`/scheduled_tweet/${scheduled.id}`} className="block">
      <div className="border rounded p-4 space-y-2 bg-white">
        {/* ユーザー情報 */}
        <div className="flex items-center space-x-3">
          {icon
            ? <Image src={icon} alt={scheduled.account_id} width={40} height={40} className="rounded-full" />
            : <div className="w-10 h-10 bg-gray-300 rounded-full" />}
          <div>
            <p className="font-semibold">@{scheduled.account_id}</p>
            <p className="text-xs text-gray-500">
              {new Date(scheduled.scheduled_datetime).toLocaleString()}
            </p>
          </div>
        </div>

        {/* テキスト */}
        <p>{scheduled.text}</p>

        {/* 画像 */}
        {scheduled.image && (
          <Image
            src={scheduled.image}
            alt="scheduled image"
            width={500}
            height={300}
            className="rounded"
          />
        )}
      </div>
    </Link>
  )
}
