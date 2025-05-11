// src/components/CenterArea/Schedule/__tests__/ScheduledTweetDetail.test.tsx
import { render, screen } from '@testing-library/react'
import ScheduledTweetDetail from '../../Schedule/ScheduledTweetDetail'
import { useScheduledTweet } from '@/hooks/useScheduledTweet'

// モック関数を先に定義
const mockUseParams = jest.fn()
const mockUseRouter = jest.fn(() => ({ push: jest.fn() }))
const mockNotFound = jest.fn()

jest.mock('next/navigation', () => ({
  useParams: () => mockUseParams(),
  useRouter: () => mockUseRouter(),
  notFound: () => mockNotFound(),
}))

jest.mock('@/hooks/useScheduledTweet', () => ({
  useScheduledTweet: jest.fn(),
}))

jest.mock('@/hooks/useAccount', () => ({
  useAccount: jest.fn(() => ({ icon: null })),
}))

describe('ScheduledTweetDetail 表示系テスト', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    mockUseParams.mockReturnValue({ scheduleId: '1' })

    ;(useScheduledTweet as jest.Mock).mockReturnValue({
      id: 1,
      account_id: 'user1',
      text: 'スケジュール投稿のテストだよ！',
      image: null,
      location: 'Tokyo',
      scheduled_datetime: '2025-01-01T10:00:00',
      created_datetime: '2024-12-30T12:00:00',
      delete_flag: 0,
    })
  })

  it('ツイート詳細と編集・削除ボタンが表示される', async () => {
    render(<ScheduledTweetDetail />)

    expect(await screen.findByText('スケジュール投稿のテストだよ！')).toBeInTheDocument()
    expect(screen.getByText('Tokyo')).toBeInTheDocument()
    expect(screen.getByText('@user1')).toBeInTheDocument()
    expect(screen.getByText('編集')).toBeInTheDocument()
    expect(screen.getByText('削除')).toBeInTheDocument()
  })
})
