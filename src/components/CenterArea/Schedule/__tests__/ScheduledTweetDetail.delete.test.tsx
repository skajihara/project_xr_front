// src/components/CenterArea/Schedule/__tests__/ScheduledTweetDetail.delete.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ScheduledTweetDetail from '../ScheduledTweetDetail'
import { useScheduledTweet } from '@/hooks/useScheduledTweet'
import { useRouter, useParams } from 'next/navigation'

// モック定義
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))
jest.mock('@/hooks/useScheduledTweet', () => ({
  useScheduledTweet: jest.fn(),
}))

describe('ScheduledTweetDetail 削除テスト', () => {
  const pushMock = jest.fn()
  const confirmMock = jest.fn()
  const alertMock = jest.fn()
  const originalConfirm = window.confirm
  const originalAlert = window.alert
  const scheduled = {
    id: 1,
    account_id: 'user1',
    text: '削除対象の予約ツイート',
    image: null,
    location: 'Tokyo',
    scheduled_datetime: '2025-01-01T10:00:00',
    created_datetime: '2024-12-31T10:00:00',
    delete_flag: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useParams as jest.Mock).mockReturnValue({ scheduleId: '1' })
    ;(useScheduledTweet as jest.Mock).mockReturnValue(scheduled)
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    global.fetch = jest.fn()

    window.confirm = confirmMock
    window.alert = alertMock
  })

  afterAll(() => {
    window.confirm = originalConfirm
    window.alert = originalAlert
  })

  it('削除ボタン押下で confirm が呼ばれる', () => {
    render(<ScheduledTweetDetail />)

    const button = screen.getByText('削除')
    fireEvent.click(button)

    expect(confirmMock).toHaveBeenCalledWith('この予約ツイートを削除してもいいですか？')
  })

  it('confirm が true の場合、fetch(DELETE) が呼ばれて router.push される', async () => {
    confirmMock.mockReturnValue(true)
    ;(fetch as jest.Mock).mockResolvedValue({ ok: true })

    render(<ScheduledTweetDetail />)

    const button = screen.getByText('削除')
    fireEvent.click(button)

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/scheduledTweets/1', { method: 'DELETE' })
      expect(pushMock).toHaveBeenCalledWith('/scheduled_tweet')
    })
  })

  it('confirm が false の場合、fetch や router.push は呼ばれない', () => {
    confirmMock.mockReturnValue(false)

    render(<ScheduledTweetDetail />)

    const button = screen.getByText('削除')
    fireEvent.click(button)

    expect(fetch).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('削除失敗時は alert が表示される', async () => {
    confirmMock.mockReturnValue(true)
    ;(fetch as jest.Mock).mockResolvedValue({ ok: false })

    render(<ScheduledTweetDetail />)

    fireEvent.click(screen.getByText('削除'))

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('削除に失敗しました。')
    })
  })
})
