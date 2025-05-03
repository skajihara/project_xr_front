// app/layout.tsx
import '@/styles/globals.css'
import AuthWrapper from '@/components/AuthWrapper'

export const metadata = {
  title: 'My Twitter風アプリ',
  description: 'Next.js + TS + Zustand',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
