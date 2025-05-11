// src/components/CenterContents/Schedule/__tests__/ScheduledTweetCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import ScheduledTweetCard from '../ScheduledTweetCard'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/hooks/useAccount'
import { ScheduledTweet } from '@/types/scheduledTweet'

// モック関数を作成
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/hooks/useAccount', () => ({
  useAccount: jest.fn(),
}))

describe('ScheduledTweetCard', () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    // useRouterのモックを設定
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    jest.clearAllMocks()
  })

  const baseScheduledTweet: ScheduledTweet = {
    id: 1,
    account_id: 'testuser',
    text: 'これはテストの予約ツイートです',
    image: null,
    location: null,
    scheduled_datetime: '2025-12-25T15:00:00+09:00',
    created_datetime: '2025-12-24T12:00:00+09:00',
    delete_flag: 0,
  }

  it('アカウントIDと日時が表示される', () => {
    (useAccount as jest.Mock).mockReturnValue({ icon: '/icons/account/test_icon.svg' })

    render(<ScheduledTweetCard scheduled={baseScheduledTweet} />)

    expect(screen.getByText('@testuser')).toBeInTheDocument()
    expect(screen.getByText('これはテストの予約ツイートです')).toBeInTheDocument()
    expect(screen.getByText(new Date(baseScheduledTweet.scheduled_datetime).toLocaleString())).toBeInTheDocument()
  })

  it('画像がある場合、画像が表示される', () => {
    (useAccount as jest.Mock).mockReturnValue({ icon: '/icons/account/test_icon.svg' })
  
    const scheduledWithImage = {
      ...baseScheduledTweet,
      image: 'https://example.com/image.jpg',
    }
  
    render(<ScheduledTweetCard scheduled={scheduledWithImage} />)
  
    const img = screen.getByAltText('scheduled image') as HTMLImageElement
    expect(img).toBeInTheDocument()
  
    // src属性に元画像のURLがエンコードされて含まれてるか確認
    expect(decodeURIComponent(img.src)).toContain('https://example.com/image.jpg')
  })

  it('アイコンが null の場合、デフォルトアイコンが使用される', () => {
    (useAccount as jest.Mock).mockReturnValue({ icon: null })

    render(<ScheduledTweetCard scheduled={baseScheduledTweet} />)

    const iconImg = screen.getByAltText('testuser') as HTMLImageElement
    expect(iconImg).toBeInTheDocument()
    expect(iconImg.src).toContain('/icons/account/default_icon.svg')
  })

  it('カードクリックで router.push が呼ばれる', () => {
    (useAccount as jest.Mock).mockReturnValue({ icon: '/icons/account/test_icon.svg' })

    render(<ScheduledTweetCard scheduled={baseScheduledTweet} />)

    const card = screen.getByText('これはテストの予約ツイートです').closest('div')
    expect(card).toBeInTheDocument()

    fireEvent.click(card!)

    expect(pushMock).toHaveBeenCalledWith('/scheduled_tweet/1')
  })
})
