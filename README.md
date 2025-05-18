# アプリ説明
- Twitter風アプリです。
- 主な機能は以下の通りです。
    - ログイン＆ログアウト
    - ホーム
        - タイムライン表示
        - ツイート詳細表示
        - 新規ツイート投稿
    - プロフィール
        - プロフィール表示
        - アカウントごとのツイート一覧表示
    - 予約ツイート
        - 予約ツイート一覧表示
        - 予約ツイート詳細表示
        - 新規予約ツイート登録

### アプリ構成
    - Next.js + TypeScript + Zustand + CSS Modules

### 起動方法
    - @ = クローン先ディレクトリ
    - フロントエンド
        - @\project_xr_front\src> npm run dev
        - @\project_xr_front\src> npm run server
    - サーバサイド
        - @\project_xr_app\src\main\java\com\skajihara\project_xr_app\ProjectXrApplication.java を実行

### 注意点
    - ログインに使用するユーザ情報は実際にAPIを叩いているのではなくdb.jsonに保存してあるIDとパスワードで検証しているだけ（実際のアカウントテーブルに存在しない情報でログインするとログイン後にエラーが起きる）
    - 右エリアの表示も同じくdb.jsonから取得しているが、表示しているだけなので気にしなくてよい
