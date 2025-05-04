// app/error_test/page.tsx
'use client'
import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import TestError from '@/components/TestError'

export default function ErrorTestPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>読み込み中…</p>}>
        <TestError />
      </Suspense>
    </ErrorBoundary>
  )
}
