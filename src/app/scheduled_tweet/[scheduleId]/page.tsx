// app/scheduled_tweet/[scheduleId]/page.tsx
'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import ScheduledTweetDetail from '@/components/CenterArea/Schedule/ScheduledTweetDetail'

export default function ScheduledTweetDetailPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>予約ツイート詳細読み込み中…</p>}>
        <ScheduledTweetDetail />
      </Suspense>
    </ErrorBoundary>
  )
}
