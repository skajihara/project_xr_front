// src/components/CenterArea/Profile/__tests__/ProfileTweets.test.tsx
import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { SWRConfig } from 'swr'
import ProfileTweets from '../ProfileTweets'

// モック
jest.mock('next/navigation', () => ({
  useParams: () => ({ accountId: 'user1' }),
  useRouter: () => ({ push: jest.fn() }),
}))

jest.mock('@/hooks/useTweetsByAccount', () => ({
  useTweetsByAccount: jest.fn(),
}))

jest.mock('@/hooks/useAccount', () => ({
  useAccount: jest.fn(() => ({ account: { icon: null }, loading: false, error: null })),
}))

import { useTweetsByAccount } from '@/hooks/useTweetsByAccount'

// ErrorBoundary
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

describe('ProfileTweets component with suspense', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function setup() {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestErrorBoundary>
          <Suspense fallback={<div>Loading fallback</div>}>
            <ProfileTweets />
          </Suspense>
        </TestErrorBoundary>
      </SWRConfig>
    )
  }

  it('ツイートリストが正常にレンダリングされる', async () => {
    (useTweetsByAccount as jest.Mock).mockReturnValue([
      {
        id: 1,
        account_id: 'user1',
        text: 'おはよう from Profile',
        image: null,
        likes: 1,
        retweets: 0,
        replies: 0,
        views: 10,
        datetime: '2024-01-01 08:00:00',
        location: null,
        delete_flag: 0,
      },
      {
        id: 2,
        account_id: 'user1',
        text: 'こんにちは from Profile',
        image: null,
        likes: 2,
        retweets: 1,
        replies: 1,
        views: 20,
        datetime: '2024-01-01 12:00:00',
        location: null,
        delete_flag: 0,
      },
      {
        id: 3,
        account_id: 'user1',
        text: 'おやすみ from Profile',
        image: null,
        likes: 3,
        retweets: 2,
        replies: 2,
        views: 30,
        datetime: '2024-01-01 23:00:00',
        location: null,
        delete_flag: 0,
      },
    ])
  
    setup()
  
    expect(await screen.findByText('おはよう from Profile')).toBeInTheDocument()
    expect(screen.getByText('こんにちは from Profile')).toBeInTheDocument()
    expect(screen.getByText('おやすみ from Profile')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('フェッチエラー時にエラーメッセージを表示する', async () => {
    (useTweetsByAccount as jest.Mock).mockImplementation(() => {
      throw new Error('エラー: フェッチ失敗')
    })

    setup()

    expect(await screen.findByText('エラー: フェッチ失敗')).toBeInTheDocument()
  })

  it('ツイートが空ならメッセージを表示する', async () => {
    (useTweetsByAccount as jest.Mock).mockReturnValue([])

    setup()

    expect(await screen.findByText('まだツイートがないよ')).toBeInTheDocument()
  })
})
