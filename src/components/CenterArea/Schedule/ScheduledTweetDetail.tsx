// /src/components/CenterArea/Schedule/ScheduledTweetDetail.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import ScheduledTweetCard from '@/components/CenterArea/Schedule/ScheduledTweetCard'
import { useScheduledTweet } from '@/hooks/useScheduledTweet'

export default function ScheduledTweetDetail() {
  const { scheduleId } = useParams() as { scheduleId: string }
  const router = useRouter()
  const scheduled = useScheduledTweet(scheduleId)

  // 編集フォーム用 state
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [scheduledDatetime, setScheduledDatetime] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // データ読み込み完了したらフォームに初期値セット
  useEffect(() => {
    if (scheduled) {
      setText(scheduled.text)
      setImage(scheduled.image ?? '')
      setScheduledDatetime(scheduled.scheduled_datetime)
    }
  }, [scheduled])

  if (!scheduled) notFound()

  // 更新処理
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    if (!text.trim() || !scheduledDatetime) {
      setErrorMsg('テキストと日時は必須です！')
      return
    }
    setSaving(true)
    try {
      // 秒を付与して東京タイム表記に
      const dt = new Date(scheduledDatetime)
      const formatted = dt
        .toLocaleString('sv', { timeZone: 'Asia/Tokyo' })
        .replace(' ', 'T')
      await fetch(`http://localhost:5000/scheduledTweets/${scheduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scheduled,
          text: text.trim(),
          image: image.trim() || null,
          scheduled_datetime: formatted,
        }),
      }).then(res => {
        if (!res.ok) throw new Error('更新に失敗しました。')
      })
      // 編集モード解除＆再描画
      setIsEditing(false)
      window.location.reload()
    } catch (err: unknown) {
      console.error(err)
      setErrorMsg(err instanceof Error ? err.message : '更新エラー')
    } finally {
      setSaving(false)
    }
  }

  // 削除処理
  const handleDelete = async () => {
    if (!confirm('この予約ツイートを削除してもいいですか？')) return
    try {
      const res = await fetch(
        `http://localhost:5000/scheduledTweets/${scheduleId}`,
        { method: 'DELETE' }
      )
      if (!res.ok) throw new Error('削除に失敗しました。')
      router.push('/scheduled_tweet')
    } catch (err: unknown) {
      console.error(err)
      alert(err instanceof Error ? err.message : '削除エラー')
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => router.push('/scheduled_tweet')}
        className="text-blue-500 hover:underline"
      >
        ← 戻る
      </button>

      {!isEditing ? (
        <>
          <ScheduledTweetCard scheduled={scheduled} />
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              削除
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSave} className="space-y-4 border rounded p-4 bg-white">
          {errorMsg && <p className="text-red-600">{errorMsg}</p>}

          <div>
            <label className="block mb-1">テキスト</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full p-2 border rounded resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block mb-1">画像URL (任意)</label>
            <input
              type="text"
              value={image}
              onChange={e => setImage(e.target.value)}
              className="w-full p-2 border rounded"
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
              disabled={saving}
              className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? '更新中…' : '保存'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
