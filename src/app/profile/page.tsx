// app/profile/page.tsx
import { redirect } from 'next/navigation'

export default function ProfileRoot() {
  // ログインユーザーのIDを localStorage から取得
  const raw = localStorage.getItem('user-storage')
  const { state } = raw ? JSON.parse(raw) : {}
  const userId = state?.user?.id
  if (!userId) { redirect('/auth') }
  // ルートアクセスは自分のプロフィールにリダイレクト
  redirect(`/profile/${userId}`)
}
