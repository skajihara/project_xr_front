// src/components/CenterArea/Tweet/__tests__/TweetDetail.edit.test.tsx
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

describe('TweetDetail 編集テスト', () => {
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

  it('編集モードでフォームが表示される', async () => {
    render(<TweetDetail />)

    fireEvent.click(screen.getByText('編集'))

    expect(await screen.findByLabelText('テキスト')).toBeInTheDocument()
    expect(screen.getByLabelText('画像URL (任意)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
  })

  it('フォーム初期値がツイート内容と一致している', async () => {
    render(<TweetDetail />)
    fireEvent.click(screen.getByText('編集'))

    const text = await screen.findByLabelText('テキスト') as HTMLTextAreaElement
    const image = screen.getByLabelText('画像URL (任意)') as HTMLInputElement

    expect(text.value).toBe(tweetMock.text)
    expect(image.value).toBe('')
  })

  it('キャンセルボタンで編集モードが解除される', async () => {
    render(<TweetDetail />)

    fireEvent.click(screen.getByText('編集'))
    fireEvent.click(await screen.findByRole('button', { name: 'キャンセル' }))

    await waitFor(() => {
      expect(screen.getByText('編集')).toBeInTheDocument()
      expect(screen.getByText('削除')).toBeInTheDocument()
    })
  })

  it('保存でfetch(PUT)とreloadが呼ばれる', async () => {
    render(<TweetDetail />)

    fireEvent.click(screen.getByText('編集'))
    fireEvent.change(await screen.findByLabelText('テキスト'), {
      target: { value: '更新された内容だよ！' },
    })

    fireEvent.click(screen.getByRole('button', { name: '保存' }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('http://localhost:5000/tweets/1', expect.anything())
      expect(window.location.reload).toHaveBeenCalled()
    })
  })

  it('保存失敗時はエラーメッセージが表示される', async () => {
    ;(fetch as jest.Mock).mockResolvedValueOnce({ ok: false })

    render(<TweetDetail />)
    fireEvent.click(screen.getByText('編集'))
    fireEvent.change(await screen.findByLabelText('テキスト'), {
      target: { value: '失敗ケース' },
    })

    fireEvent.click(screen.getByRole('button', { name: '保存' }))

    expect(await screen.findByText('更新に失敗しました。')).toBeInTheDocument()
  })
})
