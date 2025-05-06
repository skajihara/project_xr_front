// src/hooks/__tests__/useScheduledTweet.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import useSWR from 'swr'
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

// fetcher モック化
jest.mock('@/lib/fetcher')
const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>

function TestComponent({ id }: { id: string | number | null }) {
  const key = id != null ? `/scheduledTweets/${id}` : null
  const { data: scheduled } = useSWR<{ id: number; text: string }>(key, fetcher, { suspense: false })

  if (!scheduled) return <div>Loading fallback</div>

  return <div data-testid="scheduled-text">{scheduled.text}</div>
}

describe('useScheduledTweet without suspense', () => {
  beforeEach(() => {
    mockedFetcher.mockReset()
  })

  it('fetch 成功で scheduled が表示される', async () => {
    const fakeScheduled = {
      id: 1,
      account_id: 'user1',
      text: '予約ツイート！',
      image: null,
      location: null,
      scheduled_datetime: '2024-12-24 00:00:00',
      created_datetime: '2024-01-01 00:00:00',
      delete_flag: 0,
    }
    mockedFetcher.mockResolvedValueOnce(fakeScheduled)

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent id={1} />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByTestId('scheduled-text')).toHaveTextContent('予約ツイート！')
    })

    console.log(screen.debug())

    expect(mockedFetcher).toHaveBeenCalledWith('/scheduledTweets/1')
  })

  it('fetch 失敗なら fallback', async () => {
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

    expect(mockedFetcher).toHaveBeenCalledWith('/scheduledTweets/1')
  })

  it('id が null なら fetch されない', async () => {
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent id={null} />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByText('Loading fallback')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(mockedFetcher).not.toHaveBeenCalled()
  })
})
