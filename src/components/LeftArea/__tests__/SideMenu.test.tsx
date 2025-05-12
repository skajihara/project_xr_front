import { render, screen, fireEvent } from '@testing-library/react'
import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import React from 'react'

// ErrorBoundary
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

describe('SideMenu component', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  const setup = async () => {
    const { default: SideMenu } = await import('../SideMenu')
    render(
      <SWRConfig value={{ provider: () => new Map() }}>
        <TestErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <SideMenu />
          </Suspense>
        </TestErrorBoundary>
      </SWRConfig>
    )
  }

  it('すべてのメニューリンクが表示され、クリックでpushされる', async () => {
    const pushMock = jest.fn()
    jest.doMock('next/navigation', () => ({
      useRouter: () => ({ push: pushMock }),
    }))
    jest.doMock('@/stores/useUserStore', () => ({
      useUserStore: (selector: (s: { user: { id: string } }) => unknown) =>
        selector({ user: { id: 'alice' } }),
    }))

    await setup()

    expect(await screen.findByText('ホーム')).toBeInTheDocument()
    expect(screen.getByText('プロフィール')).toHaveAttribute('href', '/profile/alice')

    const link = screen.getByText('プロフィール')
    fireEvent.click(link)

    expect(pushMock).toHaveBeenCalledWith('/profile/alice')
  })
})
