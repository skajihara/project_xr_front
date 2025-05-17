// src/components/RightArea/RecommendedUsers.tsx
'use client'

import styles from '@/styles/RecommendedUsers.module.css'

import { useAccounts } from '@/hooks/useAccounts'
import { useUserStore } from '@/stores/useUserStore'
import Image from 'next/image'

export default function RecommendedUsers() {
  const current = useUserStore(s => s.user)
  const accounts = useAccounts()
  const users = accounts.filter(u => u.id !== current?.id).slice(0, 5)

  return (
    <section className={styles.card}>
      <h3 className={styles.heading}>おすすめユーザー</h3>
      <ul className="flex flex-col gap-5">
        {users.map(u => (
          <li key={u.id} className={styles.user}>
            <Image
              src={u.icon || '/icons/account/default_icon.svg'}
              alt={u.name}
              width={32}
              height={32}
              className={styles.icon}
            />
            <div>
              <p className={styles.name}>{u.name}</p>
              <p className={styles.id}>@{u.id}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
