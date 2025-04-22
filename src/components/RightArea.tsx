// src/components/RightArea.tsx
'use client'

import TrendTopics from '@/components/RightArea/TrendTopics'
import RecommendedUsers from '@/components/RightArea/RecommendedUsers'

export default function RightArea() {
  return (
    <div className="flex flex-col h-full p-4 space-y-6">
      <TrendTopics />
      <RecommendedUsers />
    </div>
  )
}
