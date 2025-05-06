/* eslint-disable @typescript-eslint/no-require-imports */
const nextJest = require('next/jest')

/** src/ を Next.js のプロジェクトルートとして渡す */
const createJestConfig = nextJest({
  dir: './',
})

/** Jest のカスタム設定 */
const customJestConfig = {
  // テストファイルの拡張子
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // TypeScript のトランスパイルに ts-jest を使う
  preset: 'ts-jest',
  // テスト環境をブラウザ相当に
  testEnvironment: 'jest-environment-jsdom',
  // テスト時に最初に実行するセットアップファイル
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // モジュール解決のために src/ をルートに含める
  moduleDirectories: ['node_modules', '<rootDir>'],
  // パスエイリアス (@/xxx) を解決
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    // CSS や画像などのインポートをモック
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/public/__mocks__/fileMock.js',
  },
}

module.exports = createJestConfig(customJestConfig)
