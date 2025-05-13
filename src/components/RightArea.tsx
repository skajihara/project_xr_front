// src/components/RightArea.tsx
'use client'

import styles from '@/styles/RightArea.module.css'

import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import TrendTopics from '@/components/RightArea/TrendTopics'
import RecommendedUsers from '@/components/RightArea/RecommendedUsers'

export default function RightArea() {
  return (
    <div className={styles.container}>
      <ErrorBoundary>
        <Suspense fallback={<p>トレンドを読み込み中…</p>}>
          <TrendTopics />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<p>おすすめユーザー読み込み中…</p>}>
          <RecommendedUsers />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}
