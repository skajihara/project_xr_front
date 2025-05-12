// src/components/RightArea/__tests__/RecommendedUsers.test.tsx
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import React from 'react'

// next/image モック（contextエラー回避）
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'image'} />
  },
}))

// 独自 ErrorBoundary
class TestErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return <div>{this.state.error.message}</div>
    }
    return this.props.children
  }
}

describe('RecommendedUsers component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  const setup = async () => {
    const { default: RecommendedUsers } = await import('../RecommendedUsers')
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <RecommendedUsers />
          </Suspense>
        </TestErrorBoundary>
      </SWRConfig>
    )
  }

  it('自分以外のおすすめユーザーが表示されること', async () => {
    jest.doMock('@/hooks/useAccounts', () => ({
      useAccounts: () => [
        { id: 'bob', name: 'Bob', icon: '' },
        { id: 'alice', name: 'Alice', icon: '/images/alice.png' },
      ],
    }))
    jest.doMock('@/stores/useUserStore', () => ({
      useUserStore: (selector: (s: { user: { id: string } }) => unknown) =>
        selector({ user: { id: 'alice' } }), // alice が自分
    }))

    await setup()

    expect(await screen.findByText('おすすめユーザー')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('@bob')).toBeInTheDocument()
    expect(screen.queryByText('Alice')).not.toBeInTheDocument() // ← ここ通るようになる！
  })

  it('エラー時にエラーメッセージを表示する', async () => {
    jest.doMock('@/hooks/useAccounts', () => ({
      useAccounts: () => {
        throw new Error('ユーザー取得失敗')
      },
    }))
    jest.mock('@/stores/useUserStore', () => ({
      useUserStore: jest.fn(() => ({ user: { id: 'unknown' } })),
    }))

    await setup()

    expect(await screen.findByText('ユーザー取得失敗')).toBeInTheDocument()
  })
})
