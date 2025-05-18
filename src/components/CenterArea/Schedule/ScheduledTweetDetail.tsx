// /src/components/CenterArea/Schedule/ScheduledTweetDetail.tsx
'use client'

import styles from '@/styles/ScheduledTweetDetail.module.css'
import btn from '@/styles/Button.module.css'

import { useState, useEffect } from 'react'
import { useParams, useRouter, notFound } from 'next/navigation'
import ScheduledTweetCard from '@/components/CenterArea/Schedule/ScheduledTweetCard'
import { useScheduledTweet } from '@/hooks/useScheduledTweet'
import { fetcher } from '@/lib/fetcher'
import { formatDateToJstString } from '@/lib/formatDate'

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
      const dt = new Date(scheduledDatetime)
      const formatted = formatDateToJstString(dt)

      await fetcher(`/schedule/${scheduleId}`, 'PUT', {
        ...scheduled,
        text: text.trim(),
        image: image.trim() || null,
        scheduled_datetime: formatted,
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

  // 削除処理
  const handleDelete = async () => {
    if (!confirm('この予約ツイートを削除してもいいですか？')) return
    try {
      await fetcher(`/schedule/${scheduleId}`, 'DELETE')
      router.push('/scheduled_tweet')
    } catch (err: unknown) {
      console.error(err)
      alert(err instanceof Error ? err.message : '削除エラー')
    }
  }

  return (
    <div className={styles.wrapper}>
      <button onClick={() => router.push('/scheduled_tweet')} className="text-blue-500 hover:underline">
        ← 戻る
      </button>

      {!isEditing ? (
        <>
          <ScheduledTweetCard scheduled={scheduled} />
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
        </>
      ) : (
        <form onSubmit={handleSave} className={styles.form}>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}

          <div>
            <label htmlFor="text" className={styles.label}>テキスト</label>
            <textarea
              id="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className={styles.textarea}
              rows={3}
              required
            />
          </div>

          <div>
            <label htmlFor="image" className={styles.label}>画像URL (任意)</label>
            <input
              id="image"
              type="text"
              value={image}
              onChange={e => setImage(e.target.value)}
              className={styles.input}
            />
          </div>

          <div>
            <label htmlFor="datetime" className={styles.label}>予約日時</label>
            <input
              id="datetime"
              type="datetime-local"
              value={scheduledDatetime}
              onChange={e => setScheduledDatetime(e.target.value)}
              className={styles.input}
              required
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
