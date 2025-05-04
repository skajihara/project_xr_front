// src/components/TestError.tsx
'use client'

import React, { useEffect } from 'react'

export default function TestError() {
  useEffect(() => {
    throw new Error('テスト用エラー！ErrorBoundary 動作確認中')
  }, [])

  return <div>ここは表示されないよ</div>
}
