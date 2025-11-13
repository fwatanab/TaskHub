# TaskHub

TaskHub は Next.js (Pages Router)・NextAuth (Google 認証)・Prisma・Neon を用いて構築したタスク管理アプリです。  
ログインユーザーごとにタスクを完全に分離し、作成 / 取得 / 更新 / 削除をすべて API 経由で行います。  
UI には Tailwind CSS を活用し、「カード一覧＋モーダル詳細」の構成で長文や大量のタスクにも対応しています。

## 主な機能

- Google アカウントでのログイン / ログアウト (`next-auth` + PrismaAdapter)
- ログイン済みユーザー自身のタスクのみを扱う REST API（GET/POST/PATCH/DELETE）
- フロントでは `useTasks` フックで CRUD を集約し、TaskBoard（フォーム＋一覧＋モーダル詳細）を構成
- タイトル・詳細が長文でもカードで省略表示、クリックするとモーダルで全文＆スクロール閲覧

## 技術スタック

- Next.js 16 (Pages Router)
- React 19 + TypeScript
- NextAuth (Google Provider + PrismaAdapter)
- Prisma + Neon (PostgreSQL)
- Tailwind CSS v4

## セットアップ

1. 依存関係のインストール

```bash
npm install
```

2. Prisma のセットアップ  

```bash
npx prisma generate
npx prisma migrate dev
```

3. 開発サーバー

```bash
npm run dev
```

4. ビルド / 本番起動

```bash
npm run build
npm start
```

## 必要な環境変数

`.env`に以下を設定してください。

```
DATABASE_URL=postgresql://...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=ランダムな文字列
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=yyyy
```

## ディレクトリ構成（抜粋）

```
src/
├── components/
│   ├── layout/        # AppLayout 等
│   └── tasks/         # TaskBoard, TaskList, TaskItem, TaskModal など
├── hooks/useTasks.ts  # タスク CRUD 用のカスタムフック
├── lib/               # prisma.ts, taskService.ts, auth config
├── pages/
│   ├── api/           # tasks API, auth API
│   ├── signin.tsx
│   └── index.tsx
├── styles/globals.css
└── types/
    ├── task.ts
    └── next-auth.d.ts
```

## 開発メモ

- タスク API は認証必須です。未ログインでアクセスすると 401 を返します。
- タイトルは必須、詳細は任意で null を許容しています。
- 一覧→モーダルの遷移で編集ボタンを押すとそのままインライン編集モードに突入します。
- Google のアカウント選択を常に表示させるため `prompt: "select_account"` を付けています。


