// src/components/CenterArea/Profile/__tests__/ProfileHeader.test.tsx
import { render, screen } from '@testing-library/react'
import ProfileHeader from '../ProfileHeader'
import { useParams, useRouter, notFound } from 'next/navigation'
import { useAccount } from '@/hooks/useAccount'

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
  notFound: jest.fn(),
}))
jest.mock('@/hooks/useAccount', () => ({
  useAccount: jest.fn(),
}))
// next/image のモック（相対パスでの URL 解決エラーを防ぐ）
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'image'} />
  },
}))

describe('ProfileHeader コンポーネントの表示テスト', () => {
  const pushMock = jest.fn()

  const baseAccount = {
    id: 'user123',
    name: 'テストユーザー',
    bio: 'こんにちは、私はNext.jsの勉強をしています。',
    location: 'Tokyo',
    birthday: '1995-06-15',
    registered: '2020-01-01',
    following: 111,
    follower: 222,
    icon: '/icons/account/user_icon.svg',
    header_photo: '/images/header.jpg',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useParams as jest.Mock).mockReturnValue({ accountId: 'user123' })
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  it('account情報と画像が正しく表示される', () => {
    (useAccount as jest.Mock).mockReturnValue(baseAccount)

    render(<ProfileHeader />)

    expect(screen.getByText('テストユーザー')).toBeInTheDocument()
    expect(screen.getByText('@user123')).toBeInTheDocument()
    expect(screen.getByText('こんにちは、私はNext.jsの勉強をしています。')).toBeInTheDocument()
    expect(screen.getByText(/Tokyo/)).toBeInTheDocument()
    expect(screen.getByText(/1995-06-15/)).toBeInTheDocument()
    expect(screen.getByText(/2020年からTwitterを利用しています/)).toBeInTheDocument()
    expect(screen.getByText('111')).toBeInTheDocument()
    expect(screen.getByText('222')).toBeInTheDocument()

    const iconImg = screen.getByAltText('テストユーザー') as HTMLImageElement
    const headerImg = screen.getByAltText('header') as HTMLImageElement
    expect(iconImg.src).toContain('/icons/account/user_icon.svg')
    expect(headerImg.src).toContain('/images/header.jpg')
  })

  it.each([
    { case: '空文字', icon: '' },
    { case: 'null', icon: null },
  ])('account.icon が $case のときデフォルトアイコンが使われる', ({ icon }) => {
    (useAccount as jest.Mock).mockReturnValue({ ...baseAccount, icon })

    render(<ProfileHeader />)

    const img = screen.getByAltText('テストユーザー') as HTMLImageElement
    expect(img.src).toContain('/icons/account/default_icon.svg')
  })

  it('戻るボタンとフォロー中ボタンが表示される', () => {
    (useAccount as jest.Mock).mockReturnValue(baseAccount)
    render(<ProfileHeader />)

    expect(screen.getByText('← 戻る')).toBeInTheDocument()
    expect(screen.getByText('フォロー中')).toBeInTheDocument()
  })

  it('戻るボタンクリックで router.push("/home") が呼ばれる', () => {
    (useAccount as jest.Mock).mockReturnValue(baseAccount)
    render(<ProfileHeader />)

    screen.getByText('← 戻る').click()
    expect(pushMock).toHaveBeenCalledWith('/home')
  })
  
  it('account が null のとき notFound() が呼ばれる', () => {
    (useAccount as jest.Mock).mockReturnValue(null)
    
    const notFoundMock = notFound as unknown as jest.Mock
    render(<ProfileHeader />)
    
    expect(notFoundMock).toHaveBeenCalled()
  })
})
