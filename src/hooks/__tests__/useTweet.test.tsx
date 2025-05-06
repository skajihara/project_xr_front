// src/hooks/__tests__/useTweet.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import useSWR from 'swr'
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

// fetcher モック化
jest.mock('@/lib/fetcher')
const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>

function TestComponent({ id }: { id: string | number | null }) {
  const key = id != null ? `/tweets/${id}` : null
  const { data: tweet } = useSWR<{ id: number; text: string }>(key, fetcher, { suspense: false })

  if (!tweet) return <div>Loading fallback</div>

  return (
    <div data-testid="tweet-text">{tweet.text}</div>
  )
}

describe('useTweet without suspense', () => {
  beforeEach(() => {
    mockedFetcher.mockReset()
  })

  it('fetch 成功で tweet が表示される', async () => {
    const fakeTweet = {
      id: 1,
      account_id: 'user1',
      text: 'やっほ〜',
      image: null,
      likes: 0,
      retweets: 0,
      replies: 0,
      views: 0,
      datetime: '2024-01-01T00:00:00',
      location: null,
      delete_flag: 0,
    }

    mockedFetcher.mockResolvedValueOnce(fakeTweet)

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent id={1} />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByTestId('tweet-text')).toHaveTextContent('やっほ〜')
    })

    console.log(screen.debug())

    expect(mockedFetcher).toHaveBeenCalledWith('/tweets/1')
  })

  it('fetch が失敗したら fallback が表示される', async () => {
    mockedFetcher.mockRejectedValueOnce(new Error('fetch failed'))

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent id={1} />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByText('Loading fallback')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(mockedFetcher).toHaveBeenCalledWith('/tweets/1')
  })

  it('tweet ID が null だと fetch されず fallback のまま', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        {/* id が null になるようなケース */}
        <TestComponent id={null} />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByText('Loading fallback')).toBeInTheDocument()
    })

    console.log(screen.debug())

    // id が null の場合は fetcher はスキップされる
    expect(mockedFetcher).not.toHaveBeenCalled()
  })
})
