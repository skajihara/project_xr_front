// src/components/LeftArea/MyProfile.tsx
'use client'

import styles from '@/styles/MyProfile.module.css'

import { useAccount } from '@/hooks/useAccount'
import { useUserStore } from '@/stores/useUserStore'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function MyProfile() {
  const current = useUserStore(s => s.user)!
  const clearUser = useUserStore(s => s.clearUser)
  const router = useRouter()

  const account = useAccount(current.id)

  const handleLogout = () => {
    clearUser()
    router.push('/auth')
  }

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <Image
          src={account.icon || '/icons/account/default_icon.svg'}
          alt={account.name}
          width={40}
          height={40}
          className={styles.icon}
        />
        <div className={styles.texts}>
          <p className={styles.name}>{account.name}</p>
          <p className={styles.id}>@{account.id}</p>
        </div>
      </div>
      <button className={styles.logout} onClick={handleLogout}>
        ログアウト
      </button>
    </div>
  )
}
