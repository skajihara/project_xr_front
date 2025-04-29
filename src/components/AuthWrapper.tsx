// components/AuthWrapper.tsx
'use client'

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

  // 認証済 or /auth なら画面を描画
  if (path === '/auth') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r overflow-auto">
        <LeftArea />
      </div>
      <div className="flex-1 overflow-auto">
        <CenterArea>{children}</CenterArea>
      </div>
      <div className="w-1/4 border-l overflow-auto">
        <RightArea />
      </div>
    </div>
  )
}
