// src/app/auth/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/useUserStore'

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

  // 確定後に半角英数字に変換する処理
  const normalizeToAlnum = (value: string) => {
    const normalized = value.normalize('NFKC')
    return normalized.replace(/[^0-9A-Za-z]/g, '')
  }

  const handleComposition = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (e.type === 'compositionstart') {
      setIsComposing(true)
    } else if (e.type === 'compositionend') {
      setIsComposing(false)
      // 確定された文字列を変換
      setId(normalizeToAlnum(e.currentTarget.value))
    }
  }

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (isComposing) {
      // IME入力中はそのまま反映
      setId(val)
    } else {
      // IME外 or 直接入力なら変換
      setId(normalizeToAlnum(val))
    }
  }

  const handleBlur = () => {
    // フォーカス外れた時にも確実に変換
    setId(normalizeToAlnum(id))
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 border rounded space-y-4">
        <h2 className="text-2xl font-bold">ログイン</h2>
        <div>
          <label className="block mb-1">ユーザーID</label>
          <input
            type="text"
            value={id}
            onChange={handleIdChange}
            onCompositionStart={handleComposition}
            onCompositionEnd={handleComposition}
            onBlur={handleBlur}
            required
            className="w-full px-2 py-1 border rounded"
            placeholder="半角英数字のみ"
          />
        </div>
        <div>
          <label className="block mb-1">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-2 py-1 border rounded"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ログイン
        </button>
      </form>
    </div>
  )
}
