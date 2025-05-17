// components/AuthWrapper.tsx
'use client'

import styles from '@/styles/AuthWrapper.module.css' 

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import LeftArea from '@/components/LeftArea'
import CenterArea from '@/components/CenterArea'
import RightArea from '@/components/RightArea'
import { useUserStore } from '@/stores/useUserStore'

type Props = { children: ReactNode }

export default function AuthWrapper({ children }: Props) {
  const user         = useUserStore((s) => s.user)
  const hasHydrated  = useUserStore((s) => s.hasHydrated)
  const router       = useRouter()
  const path         = usePathname()

  useEffect(() => {

    // ストレージの復元が終わるまでログイン状態を判定しない
    if (!hasHydrated) return

    if (path !== '/auth' && !user) {
      router.replace('/auth')
    }
  }, [hasHydrated, path, user, router])

  // 復元中または未ログイン時は何も描画しない
  if (!hasHydrated || (!user && path !== '/auth')) {
    return null
  }

  // ページに応じた表示判定
  const isAuthPage    = path === '/auth'
  const isDetailPage  = path.startsWith('/tweet/') || path.startsWith('/scheduled_tweet/')
  const showLeftArea  = !isAuthPage
  const showRightArea = !isAuthPage && !isDetailPage

  // 認証済 or /auth なら画面を描画
  if (path === '/auth') {
    return <>{children}</>
  }

  return (
    <div className={styles.layoutWrapper}>
      {showLeftArea && (
        <div className={styles.left}>
          <LeftArea />
        </div>
      )}
      <div className={styles.center}>
        <CenterArea>{children}</CenterArea>
      </div>
      {showRightArea && (
        <div className={styles.right}>
          <RightArea />
        </div>
      )}
    </div>
  )
}
