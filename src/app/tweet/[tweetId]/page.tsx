// app/tweet/[tweetId]/page.tsx
'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import TweetDetail from '@/components/CenterArea/Tweet/TweetDetail'

export default function TweetDetailPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>ツイート詳細読み込み中…</p>}>
        <TweetDetail />
      </Suspense>
    </ErrorBoundary>
  )
}
