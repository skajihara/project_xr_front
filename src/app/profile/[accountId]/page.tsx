// app/profile/[accountId]/page.tsx
'use client'

import ProfileHeader from '@/components/CenterArea/Profile/ProfileHeader'
import ProfileTweets from '@/components/CenterArea/Profile/ProfileTweets'

export default function ProfilePage() {
  return (
    <>
      <ProfileHeader />
      <ProfileTweets />
    </>
  )
}
