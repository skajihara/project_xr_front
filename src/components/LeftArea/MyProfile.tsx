// src/components/LeftContents/MyProfile.tsx
'use client'

import { useUserStore } from '@/stores/useUserStore'

export default function MyProfile() {
  const user = useUserStore(s => s.user)!
  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full" />
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-500">@{user.id}</p>
      </div>
    </div>
  )
}
