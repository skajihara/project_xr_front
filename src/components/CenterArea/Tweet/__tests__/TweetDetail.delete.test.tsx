// src/components/CenterArea/Tweet/__tests__/TweetDetail.delete.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

describe('TweetDetail 表示・編集・削除のテスト', () => {
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
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: async () => ({}),
      text: async () => '',
    })) as jest.Mock
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true,
    })
    window.confirm = confirmMock
    window.alert = alertMock
  })

  it('削除ボタン押下で confirm が呼ばれる', () => {
    render(<TweetDetail />)

    fireEvent.click(screen.getByText('削除'))

    expect(confirmMock).toHaveBeenCalledWith('このツイートを削除してもいい？')
  })

  it('confirm が true なら fetch(DELETE) → router.push("/home") が呼ばれる', async () => {
    confirmMock.mockReturnValue(true)
    render(<TweetDetail />)

    fireEvent.click(screen.getByText('削除'))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:8081/api/tweet/1',expect.objectContaining({ method: 'DELETE' }))
      expect(pushMock).toHaveBeenCalledWith('/home')
    })
  })

  it('confirm が false なら fetch や push は呼ばれない', () => {
    confirmMock.mockReturnValue(false)
    render(<TweetDetail />)

    fireEvent.click(screen.getByText('削除'))

    expect(fetch).not.toHaveBeenCalled()
    expect(pushMock).not.toHaveBeenCalled()
  })

  it('削除失敗時は alert が表示される', async () => {
    confirmMock.mockReturnValue(true)

    const mockedFetch = global.fetch as jest.Mock
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      text: async () => '削除に失敗しました。',
    })

    render(<TweetDetail />)

    fireEvent.click(screen.getByText('削除'))

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('削除に失敗しました。'))
    })
  })

})
