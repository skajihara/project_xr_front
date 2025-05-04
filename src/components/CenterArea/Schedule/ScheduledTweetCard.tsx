// src/components/CenterContents/Schedule/ScheduledTweetCard.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/hooks/useAccount'
import { ScheduledTweet } from '@/types/scheduledTweet'

export default function ScheduledTweetCard({ scheduled }: { scheduled: ScheduledTweet }) {
  const router = useRouter()
  const account = useAccount(scheduled.account_id)
  const icon = account?.icon?.trim() ? account.icon : '/icons/account/default_icon.svg'
  const goDetail = () => router.push(`/scheduled_tweet/${scheduled.id}`)
  return (
    <div onClick={goDetail} className="border rounded p-4 space-y-2 bg-white cursor-pointer">
      <div className="flex items-center space-x-3">
        <Image
          src={icon}
          alt={scheduled.account_id}
          width={40}
          height={40}
          className="rounded-full bg-gray-200"
        />
        <div>
          <p className="font-semibold">@{scheduled.account_id}</p>
          <p className="text-xs text-gray-500">
            {new Date(scheduled.scheduled_datetime).toLocaleString()}
          </p>
        </div>
      </div>
      <p>{scheduled.text}</p>
      {scheduled.image && (
        <Image
          src={scheduled.image}
          alt="scheduled image"
          width={500}
          height={300}
          className="rounded"
          priority
        />
      )}
    </div>
  )
}
