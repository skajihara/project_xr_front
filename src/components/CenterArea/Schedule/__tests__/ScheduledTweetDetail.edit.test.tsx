// src/components/CenterArea/Schedule/__tests__/ScheduledTweetDetail.edit.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ScheduledTweetDetail from '../../Schedule/ScheduledTweetDetail'
import { useRouter, useParams } from 'next/navigation'
import { useScheduledTweet } from '@/hooks/useScheduledTweet'

// モック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))
jest.mock('@/hooks/useScheduledTweet', () => ({
  useScheduledTweet: jest.fn(),
}))
jest.mock('@/hooks/useAccount', () => ({
  useAccount: () => ({ icon: null }),
}))
jest.mock('@/stores/useUserStore', () => ({
  useUserStore: () => ({ user: { id: 'user1' } }),
}))
// next/image のモック（相対パスでの URL 解決エラーを防ぐ）
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'image'} />
  },
}))

describe('ScheduledTweetDetail 編集・キャンセル機能のテスト', () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    // fetchモック
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock

    // パラメータとルーター
    (useParams as jest.Mock).mockReturnValue({ scheduleId: '1' })
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })

    // ツイートデータのモック
    ;(useScheduledTweet as jest.Mock).mockReturnValue({
      id: 1,
      account_id: 'user1',
      text: 'スケジュール投稿のテストだよ！',
      image: '',
      location: 'Tokyo',
      scheduled_datetime: '2025-01-01 10:00:00',
      created_datetime: '2024-12-31 12:00:00',
      delete_flag: 0,
    })
  })

  it('編集モードに切り替わり、フォームが表示されることを確認する', async () => {
    render(<ScheduledTweetDetail />)

    // 編集ボタンをクリックして編集モードに入る
    fireEvent.click(await screen.findByText('編集'))

    // フォーム要素が表示されることを確認
    expect(await screen.findByLabelText('テキスト')).toBeInTheDocument()
    expect(screen.getByLabelText('画像URL (任意)')).toBeInTheDocument()
    expect(screen.getByLabelText('予約日時')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
  })

  it('キャンセルボタンをクリックすると編集モードが終了し、元の表示に戻ることを確認する', async () => {
    render(<ScheduledTweetDetail />)

    // 編集モードにする
    fireEvent.click(await screen.findByText('編集'))

    // フォーム要素が見えている
    expect(await screen.findByLabelText('テキスト')).toBeInTheDocument()

    // キャンセルボタンクリック
    fireEvent.click(screen.getByRole('button', { name: 'キャンセル' }))

    // 再び編集・削除ボタンが表示されている（フォームが閉じた）
    await waitFor(() => {
      expect(screen.getByText('編集')).toBeInTheDocument()
      expect(screen.getByText('削除')).toBeInTheDocument()
    })
  })

  it('フォームを編集して保存すると fetch(PUT) と reload が呼ばれる', async () => {
    const mockReload = jest.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    })

    const mockFetch = fetch as jest.Mock
    mockFetch.mockResolvedValue({ ok: true })

    render(<ScheduledTweetDetail />)

    // 編集モードへ
    fireEvent.click(await screen.findByText('編集'))

    // 値を変更する
    fireEvent.change(screen.getByLabelText('テキスト'), {
      target: { value: '変更されたツイートだよ！' },
    })
    fireEvent.change(screen.getByLabelText('予約日時'), {
      target: { value: '2025-01-02T14:00' },
    })

    // 保存クリック
    fireEvent.click(screen.getByRole('button', { name: '保存' }))

    // fetchとreloadが呼ばれたか確認
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(mockFetch.mock.calls[0][0]).toBe('http://localhost:5000/scheduledTweets/1')
      expect(mockFetch.mock.calls[0][1].method).toBe('PUT')
      expect(mockReload).toHaveBeenCalled()
    })
  })

  it('保存時に fetch(PUT) が失敗するとエラーメッセージが表示される', async () => {
    const mockFetch = fetch as jest.Mock
    mockFetch.mockResolvedValue({ ok: false }) // ❌ 失敗応答

    render(<ScheduledTweetDetail />)

    // 編集モードへ
    fireEvent.click(await screen.findByText('編集'))

    // 値を変更する
    fireEvent.change(screen.getByLabelText('テキスト'), {
      target: { value: '失敗ケースのテストだよ！' },
    })
    fireEvent.change(screen.getByLabelText('予約日時'), {
      target: { value: '2025-01-02T14:00' },
    })

    // 保存クリック
    fireEvent.click(screen.getByRole('button', { name: '保存' }))

    // エラーメッセージ確認
    expect(await screen.findByText('更新に失敗しました。')).toBeInTheDocument()
  })
})
