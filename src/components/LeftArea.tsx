// src/components/LeftArea.tsx
'use client'

import MyProfile  from '@/components/LeftArea/MyProfile'
import SideMenu from '@/components/LeftArea/SideMenu'

export default function LeftArea() {
  return (
    <div className="flex flex-col h-full">
      {/* メニュー */}
      <nav className="flex-1 p-4 space-y-2">
        <SideMenu />
      </nav>

      {/* プロフィール */}
      <footer className="p-4 border-t">
        <MyProfile />
      </footer>
    </div>
  )
}
