// src/hooks/__tests__/useScheduledTweets.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import useSWR from 'swr'
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

jest.mock('@/lib/fetcher')
const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>

function TestComponent({ accountId }: { accountId: string }) {
  const { data: scheduledTweets } = useSWR<{ id: number; text: string }[]>(
    `/scheduledTweets?account_id=${accountId}`,
    fetcher,
    { suspense: false }
  )

  if (!scheduledTweets) return <div>Loading fallback</div>

  return (
    <ul data-testid="scheduled-list">
      {scheduledTweets.map(st => (
        <li key={st.id} data-testid="scheduled-item">{st.text}</li>
      ))}
    </ul>
  )
}

describe('useScheduledTweets without suspense', () => {
  beforeEach(() => {
    mockedFetcher.mockReset()
  })

  it('fetch 成功でリスト表示', async () => {
    const fakeScheduled = [
      { id: 1, account_id: 'user1', text: '予約ツイート1', image: null, location: null, scheduled_datetime: '', created_datetime: '', delete_flag: 0 },
    ]
    mockedFetcher.mockResolvedValueOnce(fakeScheduled)

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent accountId="user1" />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByTestId('scheduled-list')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(screen.getAllByTestId('scheduled-item')).toHaveLength(1)
    expect(screen.getByText('予約ツイート1')).toBeInTheDocument()

    expect(mockedFetcher).toHaveBeenCalledWith('/scheduledTweets?account_id=user1')
  })

  it('fetch エラーなら fallback', async () => {
    mockedFetcher.mockRejectedValueOnce(new Error('fetch error'))

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent accountId="user1" />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByText('Loading fallback')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(mockedFetcher).toHaveBeenCalledWith('/scheduledTweets?account_id=user1')
  })

  it('fetch 成功して空配列なら空リスト', async () => {
    mockedFetcher.mockResolvedValueOnce([])

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent accountId="user1" />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByTestId('scheduled-list')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(screen.queryAllByTestId('scheduled-item')).toHaveLength(0)
    expect(mockedFetcher).toHaveBeenCalledWith('/scheduledTweets?account_id=user1')
  })
})
