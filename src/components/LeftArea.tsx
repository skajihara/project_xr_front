// src/components/LeftArea.tsx
'use client'

import styles from '@/styles/LeftArea.module.css' 

import { Suspense } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import MyProfile  from '@/components/LeftArea/MyProfile'
import SideMenu from '@/components/LeftArea/SideMenu'

export default function LeftArea() {
  return (
    <div className={styles.container}>
      <SideMenu />
      <footer>
        <ErrorBoundary>
          <Suspense fallback={<p>プロフィール読み込み中…</p>}>
            <MyProfile />
          </Suspense>
        </ErrorBoundary>
      </footer>
    </div>
  )
}
