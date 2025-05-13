// src/components/CenterArea.tsx
'use client'

import styles from '@/styles/CenterArea.module.css' 

import { ReactNode } from 'react'

export default function CenterArea({ children }: { children: ReactNode }) {
  return (
    <div className={styles.container}>
      {children}
    </div>
  )
}
