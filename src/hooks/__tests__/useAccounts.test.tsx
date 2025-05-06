// src/hooks/__tests__/useAccounts.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import useSWR from 'swr'
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

// fetcher モック化
jest.mock('@/lib/fetcher')
const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>

function TestComponent() {
  const { data: accounts } = useSWR<{ id: string; name: string }[]>('/accounts', fetcher, { suspense: false })

  if (!accounts) return <div>Loading fallback</div>

  return (
    <ul data-testid="account-list">
      {accounts.map(account => (
        <li key={account.id} data-testid="account-item">
          {account.name}
        </li>
      ))}
    </ul>
  )
}

describe('useAccounts without suspense', () => {
  beforeEach(() => {
    mockedFetcher.mockReset()
  })

  it('fetch 成功で account リストが表示される', async () => {
    const fakeAccounts = [
      {
        id: 'user1',
        name: 'テストユーザー',
        bio: '単体テスト作成中',
        icon: null,
        header_photo: '',
        location: '渋谷',
        birthday: '2000-01-01',
        registered: '2024-01-01',
        following: 50,
        follower: 70,
        valid_flag: 1,
        delete_flag: 0,
      },
    ]

    mockedFetcher.mockResolvedValueOnce(fakeAccounts)

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByTestId('account-list')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(screen.getAllByTestId('account-item')).toHaveLength(1)
    expect(screen.getByText('テストユーザー')).toBeInTheDocument()

    expect(mockedFetcher).toHaveBeenCalledWith('/accounts')
  })

  it('fetch エラーなら fallback を表示する', async () => {
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

    expect(mockedFetcher).toHaveBeenCalledWith('/accounts')
  })

  it('fetch 成功して空配列なら空リストが出る', async () => {
    mockedFetcher.mockResolvedValueOnce([])

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByTestId('account-list')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(screen.queryAllByTestId('account-item')).toHaveLength(0)

    expect(mockedFetcher).toHaveBeenCalledWith('/accounts')
  })
})
