// src/components/LeftContents/SideMenu.tsx
'use client'

import Link from 'next/link'

const items = [
  { href: '/home',    label: 'ホーム' },
  { href: '/search',  label: '話題を検索' },
  { href: '/notifications', label: '通知' },
  { href: '/messages',     label: 'メッセージ' },
  { href: '/lists',        label: 'リスト' },
  { href: '/bookmarks',    label: 'ブックマーク' },
  { href: '/communities',  label: 'コミュニティ' },
  { href: '/premium',      label: 'プレミアム' },
  { href: '/profile',      label: 'プロフィール' },
  { href: '/more',         label: 'もっと見る' },
  { href: '/scheduled_tweet', label: '予約ツイート' },
]

export default function SideMenu() {
  return (
    <ul className="space-y-1">
      {items.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className="block px-3 py-2 rounded hover:bg-gray-100">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  )
}
