// src/components/RightArea/__tests__/TrendTopics.test.tsx
import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import React from 'react'

// next/image モック（contextエラー回避）
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || 'image'} />
  },
}))

// 独自 ErrorBoundary
class TestErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      return <div>{this.state.error.message}</div>
    }
    return this.props.children
  }
}

describe('TrendTopics component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  const setup = async () => {
    const { default: TrendTopics } = await import('../TrendTopics')
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <TrendTopics />
          </Suspense>
        </TestErrorBoundary>
      </SWRConfig>
    )
  }

  it('トレンドトピックスが正しく表示される', async () => {
    jest.doMock('@/hooks/useTrends', () => ({
      useTrends: () => [
        { category: 'エンタメ', topic: 'アニメ新作', count: 12345 },
        { category: 'スポーツ', topic: 'オリンピック', count: 67890 },
      ],
    }))

    await setup()

    expect(await screen.findByText('トレンドトピックス')).toBeInTheDocument()
    expect(screen.getByText('エンタメのトレンド')).toBeInTheDocument()
    expect(screen.getByText('アニメ新作')).toBeInTheDocument()
    expect(screen.getByText('12,345 tweets')).toBeInTheDocument()

    expect(screen.getByText('スポーツのトレンド')).toBeInTheDocument()
    expect(screen.getByText('オリンピック')).toBeInTheDocument()
    expect(screen.getByText('67,890 tweets')).toBeInTheDocument()
  })

  it('エラー時にエラーメッセージを表示する', async () => {
    jest.doMock('@/hooks/useTrends', () => ({
      useTrends: () => {
        throw new Error('トレンド取得失敗')
      },
    }))

    await setup()

    expect(await screen.findByText('トレンド取得失敗')).toBeInTheDocument()
  })
})
