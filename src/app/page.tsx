// app/page.tsx
import { redirect } from 'next/navigation'

export default function RootPage() {
  // ルートにアクセスされたら即 /home へ
  redirect('/home')
}
