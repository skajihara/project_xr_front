// src/components/CenterContents/Schedule/MyTweetSchedule.tsx
'use client'

import { useUserStore } from '@/stores/useUserStore'
import { useScheduledTweets } from '@/hooks/useScheduledTweets'
import ScheduledTweetCard from '@/components/CenterArea/Schedule/ScheduledTweetCard'
import ScheduleTweetForm from '@/components/CenterArea/Schedule/ScheduleTweetForm'

export default function MyTweetSchedule() {
  const user = useUserStore(s => s.user)!
  const scheduledTweets = useScheduledTweets(user.id)
  return (
    <>
      <ScheduleTweetForm />
      <ul className="space-y-4">
        {scheduledTweets.map(st => (
          <li key={st.id}>
            <ScheduledTweetCard scheduled={st} />
          </li>
        ))}
      </ul>
    </>
  )
}
