
// src/components/NotFoundClient.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NotFoundClient() {
  const router = useRouter()

  // 例: マウントして 3秒後に /home に自動リダイレクトしたいなら…
  useEffect(() => {
    const t = setTimeout(() => {
      router.push('/home')
    }, 3000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
      <p className="text-xl mb-6 text-gray-600">
        お探しのページが見つかりません。<br/>
        数秒後にホームに戻ります…
      </p>
      <button
        onClick={() => router.push('/home')}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        今すぐホームへ
      </button>
    </div>
  )
}
