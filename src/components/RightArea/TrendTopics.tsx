// src/components/RightArea/TrendTopics.tsx
'use client'

import { useTrends } from '@/hooks/useTrends'

export default function TrendTopics() {
  const { trends, loading, error } = useTrends()

  if (loading) return <p>トレンドを読み込み中…</p>
  if (error)   return <p className="text-red-600">エラー: {error}</p>

  return (
    <section className="bg-gray-100 p-3 rounded">
      <h3 className="font-bold mb-2">トレンドトピックス</h3>
      <ul className="space-y-2">
        {trends.map(({ category, topic, count }) => (
          <li key={topic}>
            <p className="text-sm text-gray-500">{category}のトレンド</p>
            <p className="font-semibold">{topic}</p>
            <p className="text-xs text-gray-500">{count.toLocaleString()} tweets</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
