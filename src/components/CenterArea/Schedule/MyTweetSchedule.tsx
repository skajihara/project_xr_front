// src/components/CenterContents/Schedule/MyTweetSchedule.tsx
'use client'

import { useUserStore } from '@/stores/useUserStore'
import { useScheduledTweets } from '@/hooks/useScheduledTweets'
import ScheduledTweetCard from '@/components/CenterArea/Schedule/ScheduledTweetCard'

export default function MyTweetSchedule() {
  const user = useUserStore(s => s.user)!
  const { scheduledTweets, loading, error } = useScheduledTweets(user.id)

  console.log(scheduledTweets, loading, error)

  if (loading) return <p>予約ツイート読み込み中…</p>
  if (error)   return <p className="text-red-600">エラー: {error}</p>

  return (
    <ul className="space-y-4">
      {scheduledTweets.map(st => (
        <li key={st.id}>
          <ScheduledTweetCard scheduled={st} />
        </li>
      ))}
    </ul>
  )
}
