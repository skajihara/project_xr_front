// src/components/CenterArea/Profile/ProfileHeader.tsx
'use client'

import styles from '@/styles/ProfileHeader.module.css'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAccount } from '@/hooks/useAccount'
import { notFound } from 'next/navigation'
import verifiedIcon from '@/public/icons/system/verified.svg'

export default function ProfileHeader() {
  const { accountId } = useParams() as { accountId: string }
  const account = useAccount(accountId)
  const router = useRouter()

  if (!account) return notFound()

  return (
    <div className={styles.wrapper}>
      <button className={styles.backButton} onClick={() => router.push('/home')}>
        ←
      </button>

      <div className={styles.headerPhoto}>
        <Image
          src={account.header_photo}
          alt="header"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className={styles.avatarRow}>
        <Image
          src={account.icon?.trim() ? account.icon : '/icons/account/default_icon.svg'}
          alt="icon"
          width={128}
          height={128}
          className={styles.icon}
        />
        <button className={styles.editButton}>プロフィールを編集</button>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.nameRow}>
          <h1 className={styles.name}>{account.name}</h1>
          {/* 認証マーク（仮） */}
          <Image src={verifiedIcon} alt="verified" className={styles.verified} />
        </div>
        <p className={styles.id}>@{account.id}</p>
        <p className={styles.bio}>{account.bio}</p>
        <div className={styles.meta}>
          <span>📍 {account.location}</span>
          <span>🎂 {account.birthday}</span>
          <span>📅 {new Date(account.registered).getFullYear()}年からXを利用しています</span>
        </div>
        <p className={styles.follow}>
          <span className={styles.bold}>{account.following}</span> フォロー中 ・{' '}
          <span className={styles.bold}>{account.follower}</span> フォロワー
        </p>
      </div>
    </div>
  )
}

