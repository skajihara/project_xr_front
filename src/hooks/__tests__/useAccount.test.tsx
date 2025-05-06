// src/hooks/__tests__/useAccount.test.tsx
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import useSWR from 'swr'
import { SWRConfig } from 'swr'
import { fetcher } from '@/lib/fetcher'

// fetcher モック化
jest.mock('@/lib/fetcher')
const mockedFetcher = fetcher as jest.MockedFunction<typeof fetcher>

function TestComponent({ id }: { id: string | null }) {
  const key = id ? `/accounts/${id}` : null
  const { data: account } = useSWR<{ id: string; name: string }>(key, fetcher, { suspense: false })

  if (!account) return <div>Loading fallback</div>

  return (
    <div data-testid="account-name">{account.name}</div>
  )
}

describe('useAccount without suspense', () => {
  beforeEach(() => {
    mockedFetcher.mockReset()
  })

  it('fetch 成功で account が表示される', async () => {
    const fakeAccount = {
      id: 'user1',
      name: 'テストユーザー',
      bio: '単体テスト作成中',
      icon: null,
      header_photo: '',
      location: '渋谷',
      birthday: '2000-01-01',
      registered: '2024-01-01',
      following: 100,
      follower: 200,
      valid_flag: 1,
      delete_flag: 0,
    }

    mockedFetcher.mockResolvedValueOnce(fakeAccount)

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent id="user1" />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByTestId('account-name')).toHaveTextContent('テストユーザー')
    })

    console.log(screen.debug())

    expect(mockedFetcher).toHaveBeenCalledWith('/accounts/user1')
  })

  it('fetch エラーなら fallback を表示する', async () => {
    mockedFetcher.mockRejectedValueOnce(new Error('fetch failed'))

    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestComponent id="user1" />
      </SWRConfig>
    )

    await waitFor(() => {
      expect(screen.getByText('Loading fallback')).toBeInTheDocument()
    })

    console.log(screen.debug())

    expect(mockedFetcher).toHaveBeenCalledWith('/accounts/user1')
  })

  it('id が null のとき fetch 呼ばれず fallback', async () => {
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
