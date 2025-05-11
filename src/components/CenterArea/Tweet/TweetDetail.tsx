// src/components/CenterArea/Schedule/ScheduledTweetDetail.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import TweetCard from '@/components/CenterArea/Tweet/TweetCard'
import { useTweet } from '@/hooks/useTweet'
import { useUserStore } from '@/stores/useUserStore'

export default function TweetDetail() {
  const { tweetId } = useParams() as { tweetId: string }
  const router = useRouter()
  const tweet = useTweet(tweetId)
  const currentUser = useUserStore(s => s.user)

  // 編集用 state
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState('')
  const [image, setImage] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // 取得したツイートをフォームにセット
  useEffect(() => {
    if (tweet) {
      setText(tweet.text)
      setImage(tweet.image ?? '')
    }
  }, [tweet])

  if (!tweet)  notFound()

  // 自分のツイートなら編集・削除可能
  const isOwner = currentUser?.id === tweet.account_id

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    if (!text.trim()) {
      setErrorMsg('ツイート内容は必須だよ！')
      return
    }
    setSaving(true)
    try {
      await fetch(`http://localhost:5000/tweets/${tweet.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tweet,
          text: text.trim(),
          image: image.trim() || null,
        }),
      }).then(res => {
        if (!res.ok) throw new Error('更新に失敗しました。')
      })
      setIsEditing(false)
      window.location.reload()
    } catch (err: unknown) {
      console.error(err)
      setErrorMsg(err instanceof Error ? err.message : '更新エラー')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('このツイートを削除してもいい？')) return
    try {
      const res = await fetch(`http://localhost:5000/tweets/${tweet.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('削除に失敗しました。')
      router.push('/home')
    } catch (err: unknown) {
      console.error(err)
      alert(err instanceof Error ? err.message : '削除エラー')
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => router.push('/home')}
        className="text-blue-500 hover:underline"
      >
        ← 戻る
      </button>

      {!isEditing ? (
        <>
          <TweetCard tweet={tweet} />
          {isOwner && (
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
          )}
        </>
      ) : (
        <form onSubmit={handleSave} className="space-y-4 border rounded p-4 bg-white">
          {errorMsg && <p className="text-red-600">{errorMsg}</p>}

          <div>
            <label htmlFor="text" className="block mb-1">テキスト</label>
            <textarea
              id="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className="w-full p-2 border rounded resize-none"
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block mb-1">画像URL (任意)</label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={e => setImage(e.target.value)}
              className="w-full p-2 border rounded"
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
