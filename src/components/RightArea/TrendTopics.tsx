'use client'

import { useEffect, useState } from 'react'

type Trend = {
  category: string
  topic: string
  count: number
}

export default function TrendTopics() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('http://localhost:5000/trends')
      .then(res => {
        if (!res.ok) throw new Error('トレンドの取得に失敗')
        return res.json()
      })
      .then((data: Trend[]) => {
        setTrends(data)
      })
      .catch(err => {
        console.error(err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

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
