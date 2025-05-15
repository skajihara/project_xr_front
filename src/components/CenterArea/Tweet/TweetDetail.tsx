// src/components/CenterArea/Schedule/TweetDetail.tsx
'use client'

import styles from '@/styles/TweetDetail.module.css'
import btn from '@/styles/Button.module.css'

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
    <div className={styles.wrapper}>
      <button onClick={() => router.push('/home')} className="text-blue-500 hover:underline">
        ← 戻る
      </button>

      {!isEditing ? (
        <>
          <TweetCard tweet={tweet} />
          {isOwner && (
            <div className={styles.buttonRow}>
              <button
                onClick={() => setIsEditing(true)}
                className={`${btn.button} ${btn.primary}`}
              >
                編集
              </button>
              <button
                onClick={handleDelete}
                className={`${btn.button} ${btn.danger}`}
              >
                削除
              </button>
            </div>
          )}
        </>
      ) : (
        <form onSubmit={handleSave} className={styles.form}>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <div>
            <label htmlFor="text" className={styles.label}>テキスト</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={styles.textarea}
              required
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="image" className={styles.label}>画像URL (任意)</label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.buttonRow}>
            <button
              type="submit"
              disabled={saving}
              className={`${btn.button} ${btn.primary} ${saving ? btn.disabled : ''}`}
            >
              {saving ? '更新中…' : '保存'}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={`${btn.button} ${btn.gray}`}
            >
              キャンセル
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
