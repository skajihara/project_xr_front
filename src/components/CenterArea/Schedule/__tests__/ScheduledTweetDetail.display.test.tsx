// src/components/CenterArea/Schedule/__tests__/ScheduledTweetDetail.display.test.tsx
import { render, screen } from '@testing-library/react'
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

describe('ScheduledTweetDetail 表示テスト', () => {
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
    ;(useRouter as jest.Mock).mockReturnValue({ push: jest.fn() })
    ;(useScheduledTweet as jest.Mock).mockReturnValue(mockScheduled)
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() },
    })
    window.confirm = jest.fn(() => true)
    window.alert = jest.fn()
  })

  it('ツイート詳細と編集・削除ボタンが表示される', async () => {
    render(<ScheduledTweetDetail />)

    expect(await screen.findByText('スケジュール投稿のテストだよ！')).toBeInTheDocument()
    expect(screen.getByText('@user1')).toBeInTheDocument()
    expect(screen.getByText('Tokyo')).toBeInTheDocument()
    expect(screen.getByText('編集')).toBeInTheDocument()
    expect(screen.getByText('削除')).toBeInTheDocument()
  })
})
