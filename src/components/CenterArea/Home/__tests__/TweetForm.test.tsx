// src/components/CenterArea/Home/__tests__/TweetForm.test.tsx
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import TweetForm from '../TweetForm'

// モック：Zustandのストア
jest.mock('@/stores/useUserStore', () => ({
  useUserStore: () => ({ user: { id: 'test-user' } }),
}))

describe('TweetForm', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    global.fetch = jest.fn()

    // reload を安全にモック
    Object.defineProperty(window, 'location', {
      value: {
        ...window.location,
        reload: jest.fn(),
      },
      writable: true,
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('フォームが正しくレンダリングされる', () => {
    render(<TweetForm />)
    expect(screen.getByPlaceholderText('いまどうしてる？')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('画像URL (任意)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ツイート' })).toBeInTheDocument()
  })

  it('空の投稿でエラーが表示される', async () => {
    render(<TweetForm />)
    fireEvent.click(screen.getByRole('button', { name: 'ツイート' }))
    expect(await screen.findByText('ツイート内容を入力してね')).toBeInTheDocument()
  })

  it('正常に投稿できるとfetchとリロードが呼ばれる', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: '投稿成功！' }),
      text: () => Promise.resolve('投稿成功！'),
    })

    render(<TweetForm />)

    fireEvent.change(screen.getByPlaceholderText('いまどうしてる？'), {
      target: { value: 'テストツイート' },
    })
    fireEvent.change(screen.getByPlaceholderText('画像URL (任意)'), {
      target: { value: 'https://example.com/image.jpg' },
    })

    fireEvent.click(screen.getByRole('button', { name: 'ツイート' }))

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(window.location.reload).toHaveBeenCalled()
    })
  })

  it('fetch失敗でエラーメッセージが表示される', async () => {
    const mockFetch = global.fetch as jest.Mock
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve('ツイート投稿に失敗しました'),
    })

    render(<TweetForm />)

    fireEvent.change(screen.getByPlaceholderText('いまどうしてる？'), {
      target: { value: '失敗ツイート' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'ツイート' }))

    expect(await screen.findByText(/ツイート投稿に失敗しました/)).toBeInTheDocument()
  })

})
