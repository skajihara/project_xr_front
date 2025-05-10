// src/components/CenterArea/Schedule/__tests__/MyTweetSchedule.test.tsx
import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { SWRConfig } from 'swr'
import MyTweetSchedule from '../MyTweetSchedule'

// モック
jest.mock('@/hooks/useScheduledTweets', () => ({
  useScheduledTweets: jest.fn(),
}))
jest.mock('@/hooks/useAccount', () => ({
  useAccount: jest.fn(() => ({ account: { icon: null }, loading: false, error: null })),
}))
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))
jest.mock('@/stores/useUserStore', () => ({
  useUserStore: jest.fn(() => ({ user: { id: 'mock_user' } })),
}))

import { useScheduledTweets } from '@/hooks/useScheduledTweets'

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
      return <div role="alert">{this.state.error.message}</div>
    }
    return this.props.children
  }
}

describe('MyTweetSchedule component with suspense', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function setup() {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestErrorBoundary>
          <Suspense fallback={<div>Loading fallback</div>}>
            <MyTweetSchedule />
          </Suspense>
        </TestErrorBoundary>
      </SWRConfig>
    )
  }

  it('スケジュールされたツイートリストが正常にレンダリングされる', async () => {
    (useScheduledTweets as jest.Mock).mockReturnValue([
      {
        id: 1,
        account_id: 'user1',
        text: '明日の予定です',
        image: null,
        likes: 0,
        retweets: 0,
        replies: 0,
        views: 0,
        datetime: '2024-05-07 09:00:00',
        location: null,
        delete_flag: 0,
      },
      {
        id: 2,
        account_id: 'user1',
        text: '会議のリマインダー',
        image: null,
        likes: 0,
        retweets: 0,
        replies: 0,
        views: 0,
        datetime: '2024-05-07 10:00:00',
        location: null,
        delete_flag: 0,
      },
      {
        id: 3,
        account_id: 'user1',
        text: '週末のイベント',
        image: null,
        likes: 0,
        retweets: 0,
        replies: 0,
        views: 0,
        datetime: '2024-05-07 11:00:00',
        location: null,
        delete_flag: 0,
      },
    ])

    setup()

    expect(screen.getByPlaceholderText('予約ツイートの内容を入力してね～')).toBeInTheDocument()

    expect(await screen.findByText('明日の予定です')).toBeInTheDocument()
    expect(screen.getByText('会議のリマインダー')).toBeInTheDocument()
    expect(screen.getByText('週末のイベント')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('フェッチエラー時にエラーメッセージを表示する', async () => {
    (useScheduledTweets as jest.Mock).mockImplementation(() => {
      throw new Error('エラー: フェッチ失敗')
    })

    setup()

    expect(await screen.findByRole('alert')).toHaveTextContent('エラー: フェッチ失敗')
  })

  it('スケジュールされたツイートが空なら空リストだけ出る', async () => {
    (useScheduledTweets as jest.Mock).mockReturnValue([])

    setup()

    expect(screen.getByPlaceholderText('予約ツイートの内容を入力してね～')).toBeInTheDocument()
    
    expect(await screen.findByRole('list')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
