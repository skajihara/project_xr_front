// src/components/ErrorBoundary.tsx
'use client'
import React, { useEffect } from 'react'
import { ErrorBoundary as EB } from 'react-error-boundary'

type FallbackProps = {
  error: Error
  resetErrorBoundary: () => void
}

function AutoResetFallback({ error, resetErrorBoundary }: FallbackProps) {
  // 5秒後に自動でリセット
  useEffect(() => {
    const timer = setTimeout(() => {
      resetErrorBoundary()
    }, 5000)
    return () => clearTimeout(timer)
  }, [resetErrorBoundary])

  return (
    <div className="p-4 bg-red-100 text-red-800">
      <p>エラー発生…（5秒後に自動でリトライするよ）</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary} className="underline">
        今すぐリトライ
      </button>
    </div>
  )
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <EB
      fallbackRender={({ error, resetErrorBoundary }) => (
        <AutoResetFallback
          error={error}
          resetErrorBoundary={resetErrorBoundary}
        />
      )}
    >
      {children}
    </EB>
  )
}
