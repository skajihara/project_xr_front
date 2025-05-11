// src/components/CenterArea/Tweet/__tests__/TweetDetail.display.test.tsx
import { render, screen } from '@testing-library/react'
import TweetDetail from '../../Tweet/TweetDetail'
import { useParams, useRouter } from 'next/navigation'
import { useTweet } from '@/hooks/useTweet'

// モック定義
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))
jest.mock('@/hooks/useTweet', () => ({
  useTweet: jest.fn(),
}))
jest.mock('@/hooks/useAccount', () => ({
  useAccount: () => ({ icon: null }),
}))
jest.mock('@/stores/useUserStore', () => ({
  useUserStore: jest.fn().mockImplementation(selector => selector({ user: { id: 'user1' } })),
}))
// next/image のモック（相対パスでの URL 解決エラーを防ぐ）
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'image'} />
  },
}))

describe('TweetDetail 表示テスト', () => {
  const pushMock = jest.fn()
  const confirmMock = jest.fn()
  const alertMock = jest.fn()

  const tweetMock = {
    id: 1,
    account_id: 'user1',
    text: '元のツイートだよ！',
    image: '',
    datetime: '2025-01-01 10:00:00',
    location: 'Shibuya',
    likes: 0,
    retweets: 0,
    replies: 0,
    views: 0,
    delete_flag: 0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useParams as jest.Mock).mockReturnValue({ tweetId: '1' })
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    ;(useTweet as jest.Mock).mockReturnValue(tweetMock)
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true,
    })
    window.confirm = confirmMock
    window.alert = alertMock
  })

  it('ツイート詳細と編集・削除ボタンが表示される', async () => {
    render(<TweetDetail />)

    expect(await screen.findByText('元のツイートだよ！')).toBeInTheDocument()
    expect(screen.getByText('@user1')).toBeInTheDocument()
    expect(screen.getByText('編集')).toBeInTheDocument()
    expect(screen.getByText('削除')).toBeInTheDocument()
  })
})
