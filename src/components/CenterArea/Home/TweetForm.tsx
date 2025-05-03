// src/components/CenterArea/Home/TweetForm.tsx
'use client'

import { useState } from 'react'
import { useUserStore } from '@/stores/useUserStore'

export default function TweetForm() {
    const user = useUserStore((s) => s.user)
    const [text, setText] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [error, setError] = useState<string | null>(null)
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)
      if (!text.trim()) {
        setError('ツイート内容を入力してね')
        return
      }
  
      const newTweet = {
        account_id: user?.id,
        text,
        image: imageUrl || null,
        likes: 0,
        retweets: 0,
        replies: 0,
        views: 0,
        datetime: new Date().toLocaleString('sv', { timeZone: 'Asia/Tokyo' }),
        location: null,
        delete_flag: 0,
      }
  
      try {
        const res = await fetch('http://localhost:5000/tweets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTweet),
        })
        if (!res.ok) throw new Error('ツイート投稿に失敗しました')
        setText('')
        setImageUrl('')
        // 投稿後にタイムラインをリロード
        window.location.reload()
      } catch (err: unknown) {
        console.error(err)
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('予期せぬエラーが発生しました')
        }
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-white">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="いまどうしてる？"
          className="w-full px-3 py-2 border rounded resize-none"
          rows={3}
        />
        <div className="mt-2 flex items-center space-x-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="画像URL (任意)"
            className="flex-1 px-3 py-1 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            ツイート
          </button>
        </div>
        {error && <p className="mt-1 text-red-600">{error}</p>}
      </form>
    )
  }
  