// src/components/CenterArea/Tweet/TweetCard.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/hooks/useAccount'
import { Tweet } from '@/types/tweet'

export default function TweetCard({ tweet }: { tweet: Tweet }) {
  const router = useRouter()
  const account = useAccount(tweet.account_id)
  const icon = account?.icon?.trim() ? account.icon : '/icons/account/default_icon.svg'

  const goTweet = () => router.push(`/tweet/${tweet.id}`)
  const goProfile = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/profile/${tweet.account_id}`)
  }

  return (
    <div onClick={goTweet} className="border rounded p-4 space-y-2 bg-white cursor-pointer">
      <div className="flex items-center space-x-3">
        <Image
          src={icon}
          alt={tweet.account_id}
          width={40}
          height={40}
          className="rounded-full bg-gray-200"
          onClick={goProfile}
        />
        <div>
          <p className="font-semibold">@{tweet.account_id}</p>
          <p className="text-xs text-gray-500">
            {new Date(tweet.datetime).toLocaleString()}
          </p>
        </div>
      </div>
      <p>{tweet.text}</p>
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
      <div className="flex space-x-4 text-sm text-gray-500">
        <span>❤ {tweet.likes}</span>
        <span>🔁 {tweet.retweets}</span>
        <span>💬 {tweet.replies}</span>
        <span>👁️ {tweet.views}</span>
      </div>
    </div>
  )
}
