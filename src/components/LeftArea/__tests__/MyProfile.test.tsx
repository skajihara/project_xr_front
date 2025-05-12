// src/components/LeftArea/__tests__/MyProfile.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import React from 'react'

// next/image モック
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'image'} />
  },
}))


// ErrorBoundary
class TestErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      return <div>{this.state.error.message}</div>
    }
    return this.props.children
  }
}

describe('MyProfile component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  const setup = async () => {
    const { default: MyProfile } = await import('../MyProfile')
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <MyProfile />
          </Suspense>
        </TestErrorBoundary>
      </SWRConfig>
    )
  }

  it('プロフィール情報が表示される', async () => {
    jest.doMock('next/navigation', () => ({
      useRouter: () => ({ push: jest.fn() }),
    }))
    jest.doMock('@/stores/useUserStore', () => ({
      useUserStore: (selector: (s: { user: { id: string }; clearUser: () => void }) => unknown) =>
        selector({ user: { id: 'alice' }, clearUser: jest.fn() }),
    }))
    jest.doMock('@/hooks/useAccount', () => ({
      useAccount: () => ({ id: 'alice', name: 'アリス', icon: '' }),
    }))

    await setup()

    expect(await screen.findByText('アリス')).toBeInTheDocument()
    expect(screen.getByText('@alice')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ログアウト' })).toBeInTheDocument()
  })

  it('ログアウトボタンクリックでclearUserとpush("/auth")が呼ばれる', async () => {
    const clearUserMock = jest.fn()
    const pushMock = jest.fn()

    jest.doMock('next/navigation', () => ({
      useRouter: () => ({ push: pushMock }),
    }))
    jest.doMock('@/stores/useUserStore', () => ({
      useUserStore: (selector: (s: { user: { id: string }; clearUser: () => void }) => unknown) =>
        selector({ user: { id: 'alice' }, clearUser: clearUserMock }),
    }))
    jest.doMock('@/hooks/useAccount', () => ({
      useAccount: () => ({ id: 'alice', name: 'アリス', icon: '' }),
    }))

    await setup()

    const button = screen.getByRole('button', { name: 'ログアウト' })
    fireEvent.click(button)

    expect(clearUserMock).toHaveBeenCalled()
    expect(pushMock).toHaveBeenCalledWith('/auth')
  })

  it('useAccountがエラーを投げたらエラーメッセージが表示される', async () => {
    jest.doMock('next/navigation', () => ({
      useRouter: () => ({ push: jest.fn() }),
    }))
    jest.doMock('@/stores/useUserStore', () => ({
      useUserStore: (selector: (s: { user: { id: string }; clearUser: () => void }) => unknown) =>
        selector({ user: { id: 'alice' }, clearUser: jest.fn() }),
    }))
    jest.doMock('@/hooks/useAccount', () => ({
      useAccount: () => {
        throw new Error('アカウント取得失敗')
      },
    }))

    await setup()

    expect(await screen.findByText('アカウント取得失敗')).toBeInTheDocument()
  })
})
