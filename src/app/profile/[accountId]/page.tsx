// app/profile/[accountId]/page.tsx
'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import ProfileHeader from '@/components/CenterArea/Profile/ProfileHeader'
import ProfileTweets from '@/components/CenterArea/Profile/ProfileTweets'

export default function ProfilePage() {
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<p>プロフィール読み込み中…</p>}>
          <ProfileHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<p>ツイート読み込み中…</p>}>
          <ProfileTweets />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}
