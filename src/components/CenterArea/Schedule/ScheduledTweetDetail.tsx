// src/components/CenterContents/Schedule/ScheduledTweetDetail.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ScheduledTweetCard from '@/components/CenterArea/Schedule/ScheduledTweetCard'
import { ScheduledTweet } from '@/hooks/useScheduledTweets'

export default function ScheduledTweetDetail() {
  const { scheduleId } = useParams() as { scheduleId: string }
  const [scheduled, setScheduled] = useState<ScheduledTweet | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!scheduleId) return
    fetch(`http://localhost:5000/scheduledTweets?id=${scheduleId}`)
      .then(res => res.json())
      .then((data: ScheduledTweet[]) => {
        if (data.length) setScheduled(data[0])
        else setError('予約ツイートが見つかりません')
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [scheduleId])

  if (loading) return <p>詳細読み込み中…</p>
  if (error || !scheduled) return <p className="text-red-600">{error || 'エラーが発生しました'}</p>

  return (
    <div className="space-y-4">
      <button onClick={() => router.push('/scheduled_tweet')} className="text-blue-500 hover:underline">
        ← 戻る
      </button>
      <ScheduledTweetCard scheduled={scheduled} />
    </div>
  )
}
