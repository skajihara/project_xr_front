// src/components/CenterArea/Schedule/__tests__/ScheduledTweetDetail.delete.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ScheduledTweetDetail from '../ScheduledTweetDetail'
import { useScheduledTweet } from '@/hooks/useScheduledTweet'
import { useRouter, useParams } from 'next/navigation'

// モック定義
jest.mock('@/hooks/useScheduledTweet', () => ({
  useScheduledTweet: jest.fn(),
}))
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  notFound: jest.fn(),
}))
jest.mock('@/hooks/useAccount', () => ({
  useAccount: () => ({ icon: null }),
}))
// next/image のモック（相対パスでの URL 解決エラーを防ぐ）
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'image'} />
  },
}))

describe('ScheduledTweetDetail 削除テスト', () => {
  const pushMock = jest.fn()
  const confirmMock = jest.fn()
  const alertMock = jest.fn()
  const mockScheduled = {
    id: 1,
    account_id: 'user1',
    text: 'スケジュール投稿のテストだよ！',
    image: null,
    location: 'Tokyo',
    scheduled_datetime: '2025-01-01T10:00',
    created_datetime: '2024-12-31 10:00',
    delete_flag: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useParams as jest.Mock).mockReturnValue({ scheduleId: '1' })
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    ;(useScheduledTweet as jest.Mock).mockReturnValue(mockScheduled)

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
      text: async () => '',
    })

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() },
    })

    window.confirm = confirmMock
    window.alert = alertMock
  })

  it('削除ボタン押下で confirm が呼ばれる', async () => {
    render(<ScheduledTweetDetail />)
    const button = await screen.findByRole('button', { name: '削除' })
    fireEvent.click(button)
    expect(confirmMock).toHaveBeenCalledWith('この予約ツイートを削除してもいいですか？')
  })

  it('confirm が true の場合、fetch(DELETE) が呼ばれて router.push される', async () => {
    confirmMock.mockReturnValue(true)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
      text: async () => '',
    })

    render(<ScheduledTweetDetail />)
    const button = await screen.findByRole('button', { name: '削除' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8081/api/schedule/1',
        expect.objectContaining({ method: 'DELETE' })
      )
      expect(pushMock).toHaveBeenCalledWith('/scheduled_tweet')
    })
  })

  it('confirm が false の場合、fetch や router.push は呼ばれない', async () => {
    confirmMock.mockReturnValue(false)
    render(<ScheduledTweetDetail />)
    const button = await screen.findByRole('button', { name: '削除' })
    fireEvent.click(button)
    expect(fetch).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('削除失敗時は alert が表示される', async () => {
    confirmMock.mockReturnValue(true)
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      text: async () => '削除に失敗しました。',
    })

    render(<ScheduledTweetDetail />)
    const button = await screen.findByRole('button', { name: '削除' })
    fireEvent.click(button)

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('削除に失敗しました。'))
    })
  })
})
