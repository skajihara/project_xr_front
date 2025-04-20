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
  const user = useUserStore(s => s.user)
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    if (path !== '/auth' && !user) {
      router.replace('/auth')
    }
  }, [user, router, path])

  // /auth ルートは例外でレンダー
  if (path === '/auth') {
    return <>{children}</>
  }

  if (!user) return null

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r overflow-auto">
        <LeftArea />
      </div>
      <div className="flex-1 overflow-auto">
        <CenterArea>
          {children}
        </CenterArea>
      </div>
      <div className="w-1/4 border-l overflow-auto">
        <RightArea />
      </div>
    </div>
  )
}
