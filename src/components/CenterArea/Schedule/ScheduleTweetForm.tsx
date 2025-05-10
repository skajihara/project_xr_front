// src/components/CenterArea/Schedule/ScheduleTweetForm.tsx
'use client'

import { useState } from 'react'
import { useUserStore } from '@/stores/useUserStore'

export default function ScheduleTweetForm() {
  const user = useUserStore(s => s.user)!

  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [scheduledDatetime, setScheduledDatetime] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!text || !scheduledDatetime) {
      setError('テキストと日時は必須です！')
      return
    }
    setLoading(true)
    try {
      // 入力値（例: "2025-04-20T14:30"）を（"2025-04-20 14:30:00"）にフォーマット
      const dt = new Date(scheduledDatetime)
      const formatted = dt.toLocaleString('sv', { timeZone: 'Asia/Tokyo' })

      await fetch('http://localhost:5000/scheduledTweets', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          account_id: user.id,
          text,
          image: image||null,
          location: null,
          scheduled_datetime: formatted,
          created_datetime: new Date().toLocaleString('sv', { timeZone: 'Asia/Tokyo' }),
          delete_flag: 0
        })
      })
      // フォーム初期化
      setText('')
      setImage('')
      setScheduledDatetime('')
      // 最新の一覧を再描画
      window.location.reload()
    } catch (err) {
      console.error(err)
      setError('送信に失敗しました。再度お試しください。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border rounded p-4 bg-white">
      <h5 className="text-lg font-semibold">新規予約ツイート</h5>
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block mb-1">テキスト</label>
        <textarea
          value={text}
          onChange={e=>setText(e.target.value)}
          placeholder="予約ツイートの内容を入力してね～"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block mb-1">画像URL (任意)</label>
        <input
          type="text"
          value={image}
          onChange={e=>setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block mb-1">予約日時</label>
        <input
          type="datetime-local"
          value={scheduledDatetime}
          onChange={e=>setScheduledDatetime(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? '送信中…' : '予約ツイート登録'}
      </button>
    </form>
  )
}
