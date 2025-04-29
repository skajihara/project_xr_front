'use client'

import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/useUserStore'

export default function SideMenu() {
  const router = useRouter()
  const user   = useUserStore(s => s.user)

  const items = [
    { href: '/home',         label: 'ホーム' },
    { href: '/search',       label: '話題を検索' },
    { href: '/notifications',label: '通知' },
    { href: '/messages',     label: 'メッセージ' },
    { href: '/lists',        label: 'リスト' },
    { href: '/bookmarks',    label: 'ブックマーク' },
    { href: '/communities',  label: 'コミュニティ' },
    { href: '/premium',      label: 'プレミアム' },
    { href: `/profile/${user?.id}`, label: 'プロフィール' },
    { href: '/more',         label: 'もっと見る' },
    { href: '/scheduled_tweet', label: '予約ツイート' },
  ]

  return (
    <ul className="space-y-1">
      {items.map(({ href, label }) => (
        <li key={href}>
          <a
            onClick={(e) => {
              e.preventDefault()
              router.push(href)
            }}
            href={href}
            className="block px-3 py-2 text-blue-600 hover:underline cursor-pointer"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}
