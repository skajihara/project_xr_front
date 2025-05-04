// app/scheduled_tweet/page.tsx
'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import MyTweetSchedule from '@/components/CenterArea/Schedule/MyTweetSchedule'

export default function ScheduledTweetPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>予約ツイート読み込み中…</p>}>
        <MyTweetSchedule />
      </Suspense>
    </ErrorBoundary>
  )
}
