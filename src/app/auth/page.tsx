// src/app/auth/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/useUserStore'
import styles from '@/styles/AuthPage.module.css'

export default function AuthPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const setUser = useUserStore((s) => s.setUser)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:5000/users')
      if (!res.ok) throw new Error('Network error')
      const users: { id: string; password: string; name: string }[] = await res.json()
      const matched = users.find(u => u.id === id && u.password === password)
      if (!matched) {
        setError('IDかパスワードが正しくないよ〜')
        setId('')
        setPassword('')
        return
      }
      setUser({ id: matched.id, name: matched.name })
      router.push('/home')
    } catch (err) {
      console.error(err)
      setError('ログイン処理に失敗しました！')
    }
  }

  const normalizeToAlnum = (value: string) => {
    const normalized = value.normalize('NFKC')
    return normalized.replace(/[^0-9A-Za-z]/g, '')
  }

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (e.type === 'compositionstart') {
      setIsComposing(true)
    } else if (e.type === 'compositionend') {
      setIsComposing(false)
      setId(normalizeToAlnum(e.currentTarget.value))
    }
  }

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (isComposing) {
      setId(val)
    } else {
      setId(normalizeToAlnum(val))
    }
  }

  const handleBlur = () => {
    setId(normalizeToAlnum(id))
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>ログイン</h2>

        <div className={styles.inputGroup}>
          <label className={styles.label}>ユーザーID</label>
          <input
            type="text"
            value={id}
            onChange={handleIdChange}
            onCompositionStart={handleComposition}
            onCompositionEnd={handleComposition}
            onBlur={handleBlur}
            required
            className={styles.input}
            placeholder="半角英数字のみ"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={styles.button}>
          ログイン
        </button>
      </form>
    </div>
  )
}
