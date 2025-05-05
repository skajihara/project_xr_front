// src/hooks/__tests__/useTweets.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import useSWR from 'swr'
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

// fetcher をモック化
jest.mock('@/lib/fetcher')
const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>

function TestComponent() {
  const { data: tweets } = useSWR<{ id: number; text: string }[]>('/tweets', fetcher, { suspense: false })

  if (!tweets) return <div>Loading fallback</div>

  return (
    <ul data-testid="tweet-list">
      {tweets.map(t => (
        <li key={t.id} data-testid="tweet-item">
          {t.text}
        </li>
      ))}
    </ul>
  )
}

describe('useTweets without suspense', () => {
  beforeEach(() => {
    mockedFetcher.mockReset()
  })

  it('fetcher が成功するとリストがレンダーされる', async () => {
    const fakeTweets = [
      {
        id: 1,
        account_id: 'user1',
        text: 'こんにちは',
        image: null,
        likes: 0,
        retweets: 0,
        replies: 0,
        views: 0,
        datetime: '2024-01-01T00:00:00',
        location: null,
        delete_flag: 0,
      },
    ]
    mockedFetcher.mockResolvedValueOnce(fakeTweets)

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent />
      </SWRConfig>
    )

    console.log(screen.debug())

    await waitFor(() => {
      expect(screen.getByTestId('tweet-list')).toBeInTheDocument()
    })

    expect(screen.getAllByTestId('tweet-item')).toHaveLength(1)
    expect(screen.getByText('こんにちは')).toBeInTheDocument()

    expect(mockedFetcher).toHaveBeenCalledWith('/tweets')

    console.log(screen.debug())
  })
})
