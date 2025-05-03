// /src/components/CenterArea/Schedule/ScheduledTweetDetail.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ScheduledTweetCard from '@/components/CenterArea/Schedule/ScheduledTweetCard'
import { ScheduledTweet } from '@/types/scheduledTweet'

export default function ScheduledTweetDetail() {
  const { scheduleId } = useParams() as { scheduleId: string }
  const router = useRouter()

  const [scheduled, setScheduled] = useState<ScheduledTweet|null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string|null>(null)
  const [isEditing, setIsEditing] = useState(false)

  // 編集用フォームの state
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [scheduledDatetime, setScheduledDatetime] = useState('')

  useEffect(() => {
    if (!scheduleId) return
    setLoading(true)
    fetch(`http://localhost:5000/scheduledTweets?id=${scheduleId}`)
      .then(res => res.json())
      .then((data: ScheduledTweet[]) => {
        if (data.length) {
          const item = data[0]
          setScheduled(item)
          setText(item.text)
          setImage(item.image ?? '')
          setScheduledDatetime(item.scheduled_datetime)
        } else {
          setError('予約ツイートが見つかりません')
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [scheduleId])

  const handleDelete = async () => {
    if (!scheduled) return
    if (!confirm('本当に削除する？')) return
    await fetch(`http://localhost:5000/scheduledTweets/${scheduled.id}`, {
      method: 'DELETE',
    })
    router.push('/scheduled_tweet')
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduled) return
    setLoading(true)
    try {
      const body = {
        text,
        image: image || null,
        scheduled_datetime: scheduledDatetime,
      }
      await fetch(`http://localhost:5000/scheduledTweets/${scheduled.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      // 更新後は state も更新
      setScheduled(prev => prev ? { ...prev, ...body } as ScheduledTweet : prev)
      setIsEditing(false)
    } catch (err) {
      console.error(err)
      alert('更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>詳細読み込み中…</p>
  if (error || !scheduled) return <p className="text-red-600">{error || 'エラー発生'}</p>

  return (
    <div className="space-y-4">
      <button onClick={() => router.push('/scheduled_tweet')} className="text-blue-500 hover:underline">
        ← 戻る
      </button>

      {!isEditing ? (
        <>
          {/* 通常表示 */}
          <ScheduledTweetCard scheduled={scheduled} />

          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 bg-yellow-400 rounded"
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              削除
            </button>
          </div>
        </>
      ) : (
        <>
          {/* 編集フォーム */}
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block mb-1">テキスト</label>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">画像URL</label>
              <input
                type="text"
                value={image}
                onChange={e => setImage(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="空文字で画像を削除"
              />
            </div>
            <div>
              <label className="block mb-1">予約日時</label>
              <input
                type="datetime-local"
                value={scheduledDatetime}
                onChange={e => setScheduledDatetime(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-3 py-1 bg-green-500 text-white rounded"
                disabled={loading}
              >
                {loading ? '更新中…' : '更新する'}
              </button>
              <button
                type="button"
                onClick={() => {
                  // 編集キャンセル時はフォーム state を元に戻す
                  setText(scheduled.text)
                  setImage(scheduled.image ?? '')
                  setScheduledDatetime(scheduled.scheduled_datetime)
                  setIsEditing(false)
                }}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                キャンセル
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}
