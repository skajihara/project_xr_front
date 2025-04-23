'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Tweet } from '@/hooks/useTweets'

export default function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <Link href={`/tweet/${tweet.id}`} className="block">
    <div className="border rounded p-4 space-y-2 bg-white">
      {/* ユーザー情報 */}
      <div className="flex items-center space-x-3">
        {/* アバターはデフォプレースホルダー */}
        <div className="w-10 h-10 bg-gray-300 rounded-full" />
        <div>
          <p className="font-semibold">@{tweet.account_id}</p>
          <p className="text-xs text-gray-500">{new Date(tweet.datetime).toLocaleString()}</p>
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
          priority={true}
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
    </Link>
  )
}
