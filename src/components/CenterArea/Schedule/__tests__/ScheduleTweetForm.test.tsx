// src/components/CenterArea/Schedule/__tests__/ScheduleTweetForm.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ScheduleTweetForm from '../ScheduleTweetForm'

// モック定義
jest.mock('@/stores/useUserStore', () => ({
  useUserStore: () => ({
    user: { id: 'user123', name: 'テストユーザー' }
  })
}))

describe('ScheduleTweetForm', () => {
  const originalReload = window.location.reload

  beforeEach(() => {
    jest.resetAllMocks()
    global.fetch = jest.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true,
    })
  })

  afterAll(() => {
    window.location.reload = originalReload
  })

  it('フォームが正しくレンダリングされる', () => {
    render(<ScheduleTweetForm />)

    expect(screen.getByLabelText('テキスト')).toBeInTheDocument()
    expect(screen.getByLabelText('画像URL (任意)')).toBeInTheDocument()
    expect(screen.getByLabelText('予約日時')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '予約ツイート登録' })).toBeInTheDocument()
  })

  it('未入力で投稿するとエラーが表示される', async () => {
    const { container } = render(<ScheduleTweetForm />)
  
    await fireEvent.submit(container.querySelector('form')!)
  
    expect(await screen.findByText('テキストと日時は必須です！')).toBeInTheDocument()
  })

  it('正常に投稿できたらfetchとreloadが呼ばれる', async () => {
    const mockFetch = fetch as jest.Mock
    mockFetch.mockResolvedValue({ ok: true })

    render(<ScheduleTweetForm />)

    fireEvent.change(screen.getByLabelText('テキスト'), { target: { value: '予約ツイート！' } })
    fireEvent.change(screen.getByLabelText('予約日時'), { target: { value: '2025-12-25T15:00' } })

    fireEvent.click(screen.getByRole('button', { name: '予約ツイート登録' }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(window.location.reload).toHaveBeenCalled()
    })
  })

  it('fetch失敗時にエラーメッセージが出る', async () => {
    const mockFetch = fetch as jest.Mock
    mockFetch.mockRejectedValue(new Error('送信失敗'))

    render(<ScheduleTweetForm />)

    fireEvent.change(screen.getByLabelText('テキスト'), { target: { value: 'エラー確認' } })
    fireEvent.change(screen.getByLabelText('予約日時'), { target: { value: '2025-12-25T15:00' } })

    fireEvent.click(screen.getByRole('button', { name: '予約ツイート登録' }))

    await waitFor(() => {
      expect(screen.getByText('送信に失敗しました。再度お試しください。')).toBeInTheDocument()
    })
  })
})
