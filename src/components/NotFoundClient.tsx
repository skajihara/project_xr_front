
// src/components/NotFoundClient.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import styles from '@/styles/NotFoundClient.module.css'

export default function NotFoundClient() {
  const router = useRouter()

  useEffect(() => {
    const t = setTimeout(() => {
      router.push('/home')
    }, 3000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.code}>404</h1>
      <p className={styles.message}>
        お探しのページが見つかりません。<br />
        数秒後にホームに戻ります…
      </p>
      <button className={styles.button} onClick={() => router.push('/home')}>
        今すぐホームへ
      </button>
    </div>
  )
}
