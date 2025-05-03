// src/components/CenterArea.tsx
'use client'

import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function CenterArea({ children }: Props) {
  return (
    <div className="p-4">
      {/* ここにOutlet的に各ページの中身が入る */}
      {children}
    </div>
  )
}
