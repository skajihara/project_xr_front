import React, { Suspense } from 'react'
import { render, screen } from '@testing-library/react'
import { SWRConfig } from 'swr'
import Timeline from '../Timeline'

// モック
jest.mock('@/hooks/useTweets', () => ({
  useTweets: jest.fn(),
}))
jest.mock('@/hooks/useAccount', () => ({
  useAccount: jest.fn(() => ({ account: { icon: null }, loading: false, error: null })),
}))
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

import { useTweets } from '@/hooks/useTweets'

// 独自 ErrorBoundary（react-error-boundary はモックが難しいため使用しない）
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

describe('Timeline component with suspense', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  function setup() {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestErrorBoundary>
          <Suspense fallback={<div>Loading fallback</div>}>
            <Timeline />
          </Suspense>
        </TestErrorBoundary>
      </SWRConfig>
    )
  }

  it('ツイートリストが正常にレンダリングされる', async () => {
    (useTweets as jest.Mock).mockReturnValue([
      {
        id: 1,
        account_id: 'user1',
        text: 'おはよう！',
        image: null,
        likes: 0,
        retweets: 0,
        replies: 0,
        views: 0,
        datetime: '2024-01-01 08:00:00',
        location: null,
        delete_flag: 0,
      },
      {
        id: 2,
        account_id: 'user2',
        text: 'こんにちは！',
        image: null,
        likes: 3,
        retweets: 1,
        replies: 2,
        views: 100,
        datetime: '2024-01-01 12:00:00',
        location: null,
        delete_flag: 0,
      },
      {
        id: 3,
        account_id: 'user3',
        text: 'おやすみ～',
        image: null,
        likes: 10,
        retweets: 5,
        replies: 1,
        views: 500,
        datetime: '2024-01-01 23:00:00',
        location: null,
        delete_flag: 0,
      },
    ])
  
    setup()
 
    // TweetForm の textarea も描画されてること
    expect(screen.getByPlaceholderText('いまどうしてる？')).toBeInTheDocument()

    // 3件のツイートが表示されること
    expect(await screen.findByText('おはよう！')).toBeInTheDocument()
    expect(screen.getByText('こんにちは！')).toBeInTheDocument()
    expect(screen.getByText('おやすみ～')).toBeInTheDocument()
    
    // listitem の数も確認（TweetCardのliが3件）
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })  

  it('フェッチエラー時にエラーメッセージを表示する', async () => {
    (useTweets as jest.Mock).mockImplementation(() => {
      throw new Error('エラー: フェッチ失敗')
    })

    setup()

    expect(await screen.findByText('エラー: フェッチ失敗')).toBeInTheDocument()
  })

  it('ツイートが空なら空リストだけ出る', async () => {
    (useTweets as jest.Mock).mockImplementation(() => [])

    setup()

    // TweetFormのtextareaは常に存在
    expect(await screen.findByPlaceholderText('いまどうしてる？')).toBeInTheDocument()
    // ul はあるけど listitem はゼロ
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
