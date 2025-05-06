// src/hooks/__tests__/useTrends.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import useSWR from 'swr'
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

jest.mock('@/lib/fetcher')
const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>

function TestComponent() {
  const { data: trends } = useSWR<{ topic: string }[]>('/trends', fetcher, { suspense: false })

  if (!trends) return <div>Loading fallback</div>

  return (
    <ul data-testid="trend-list">
      {trends.map(trend => (
        <li key={trend.topic} data-testid="trend-item">{trend.topic}</li>
      ))}
    </ul>
  )
}

describe('useTrends without suspense', () => {
  beforeEach(() => {
    mockedFetcher.mockReset()
  })

  it('fetch 成功でリスト表示', async () => {
    const fakeTrends = [
      { topic: 'Next.js', category: '', count: 1000 },
    ]
    mockedFetcher.mockResolvedValueOnce(fakeTrends)

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByTestId('trend-list')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(screen.getAllByTestId('trend-item')).toHaveLength(1)
    expect(screen.getByText('Next.js')).toBeInTheDocument()

    expect(mockedFetcher).toHaveBeenCalledWith('/trends')
  })

  it('fetch エラーなら fallback', async () => {
    mockedFetcher.mockRejectedValueOnce(new Error('fetch error'))

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByText('Loading fallback')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(mockedFetcher).toHaveBeenCalledWith('/trends')
  })

  it('fetch 成功して空配列なら空リスト', async () => {
    mockedFetcher.mockResolvedValueOnce([])

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByTestId('trend-list')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(screen.queryAllByTestId('trend-item')).toHaveLength(0)

    expect(mockedFetcher).toHaveBeenCalledWith('/trends')
  })
})
