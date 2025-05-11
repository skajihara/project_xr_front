// src/components/CenterArea/Tweet/__tests__/TweetCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import TweetCard from '../TweetCard'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/hooks/useAccount'
import '@testing-library/jest-dom'

// モック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))
jest.mock('@/hooks/useAccount', () => ({
  useAccount: jest.fn(),
}))

describe('TweetCard', () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
    ;(useAccount as jest.Mock).mockReturnValue({ icon: null })
  })

  const tweet = {
    id: 1,
    account_id: 'user1',
    text: 'テストツイートだよ～',
    image: null,
    likes: 5,
    retweets: 2,
    replies: 1,
    views: 50,
    datetime: '2025-05-01 12:34:56',
    location: '渋谷',
    delete_flag: 0,
  }

  it('アカウントID、日時、テキスト、locationを正しく表示する', () => {
    render(<TweetCard tweet={tweet} />)

    expect(screen.getByText('@user1')).toBeInTheDocument()
    expect(screen.getByText('テストツイートだよ～')).toBeInTheDocument()
    expect(screen.getByText(/2025\/5\/1.*12:34:56/)).toBeInTheDocument() // toLocaleString()前提
    expect(screen.getByText('渋谷')).toBeInTheDocument()
  })

  it('アイコンがnullならデフォルト画像が表示される', () => {
    render(<TweetCard tweet={tweet} />)

    const image = screen.getByAltText('user1') as HTMLImageElement
    expect(image).toBeInTheDocument()
    expect(image.src).toContain('/icons/account/default_icon.svg')
  })

  it('カウント系が正しく表示される', () => {
    render(<TweetCard tweet={tweet} />)

    expect(screen.getByText('❤ 5')).toBeInTheDocument()
    expect(screen.getByText('🔁 2')).toBeInTheDocument()
    expect(screen.getByText('💬 1')).toBeInTheDocument()
    expect(screen.getByText('👁️ 50')).toBeInTheDocument()
  })

  it('クリックでツイート詳細へ遷移する', () => {
    render(<TweetCard tweet={tweet} />)
    fireEvent.click(screen.getByText('テストツイートだよ～'))

    expect(pushMock).toHaveBeenCalledWith('/tweet/1')
  })

  it('アイコンクリックでプロフィールへ遷移する（イベント伝播阻止）', () => {
    render(<TweetCard tweet={tweet} />)
    const image = screen.getByAltText('user1')

    fireEvent.click(image)

    expect(pushMock).toHaveBeenCalledWith('/profile/user1')
  })

  it('delete_flagが1でも表示される（描画側で制御しない限り）', () => {
    render(<TweetCard tweet={{ ...tweet, delete_flag: 1 }} />)

    expect(screen.getByText('テストツイートだよ～')).toBeInTheDocument()
  })
})
