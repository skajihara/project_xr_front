// app/home/page.tsx
'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Timeline from '@/components/CenterArea/Home/Timeline'

export default function HomePage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>ツイート読み込み中…</p>}>
        <Timeline />
      </Suspense>
    </ErrorBoundary>
  )
}
