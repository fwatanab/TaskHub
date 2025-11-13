# TaskHub 要件定義書

## プロジェクト概要

- **プロジェクト名**：TaskHub  
- **作成者**：fwatanab  
- **作成日**：2025-11-09

### 開発の背景

Webアプリ開発において、フロントエンド・バックエンド・データベースの3層構造を理解し、実務に近い構成を体験的に学ぶことを目的とする。  
本プロジェクトでは、**Next.jsのPages RouterとAPI Routesによるフルスタック構成**を採用し、**PostgreSQLとの接続・操作・デプロイまで**を一貫して行う。  

### 開発の目的

ユーザーが自分専用のタスクを登録・更新・削除できるシンプルなタスク管理アプリを実装する。  
アプリはNext.js上で完結し、バックエンドAPIをAPI Routesで実装し、PostgreSQL上のデータを操作する。  
他ユーザーのデータにはアクセスできない構造を想定し、**RDBとAPI層の責務分離**を意識する。

### 目標

- Next.js (Frontend + Backend) と PostgreSQL を接続した CRUD アプリの完成
- GitHub にてソースコードを公開
- Vercel と Neon を利用した無料デプロイ

## 1. スコープ

### 対象範囲
- タスクのCRUD（本人データのみ）
- タスク一覧 / 詳細表示、作成フォーム、編集、削除
- Prisma ORM 経由の DB 操作
- Neon データベース接続・マイグレーション管理
- デプロイ（Vercel + Neon）と環境変数設定、基本的な本番検証

### 除外範囲
- 通知、タグ付け、コメント、添付ファイル
- 複雑な検索・並び替え・ページング最適化
- 権限ロールやチーム共有機能

## 2. システム要件

### アーキテクチャ
```
[Client] Next.js (React + TypeScript)
    ↓ fetch
[Server] Next.js API Routes (Node.js)
    ↓ Prisma ORM
[DB] PostgreSQL (Neon)
```

### 技術スタック
| 区分 | 技術 / ツール |
| --- | --- |
| フロントエンド | Next.js (Pages Router), React, TypeScript |
| バックエンド | Next.js API Routes |
| ORM | Prisma |
| DB | PostgreSQL (Neon) |
| 開発環境 | VSCode, Node.js, pnpm/npm |
| デプロイ | Vercel (Next.js Hosting), Neon (DB) |
| バージョン管理 | Git / GitHub |
| テスト / 品質 | Jest, ESLint |

## 3. 機能要件

| 機能 | 概要 | API エンドポイント | HTTP メソッド |
| --- | --- | --- | --- |
| タスク一覧取得 | 自分のタスクを全て取得 | `/api/tasks` | GET |
| タスク詳細取得 | 指定IDのタスクを取得 | `/api/tasks/:id` | GET |
| タスク作成 | 新規タスクを登録 | `/api/tasks` | POST |
| タスク更新 | 指定タスクの更新（タイトル/詳細/状態） | `/api/tasks/:id` | PATCH |
| タスク削除 | 指定タスクを削除 | `/api/tasks/:id` | DELETE |

※ 実装では詳細取得 API を単独では用意せず、一覧データからモーダル表示しているが、設計上は `/api/tasks/:id` を想定。

## 4. 非機能要件

| 項目 | 内容 |
| --- | --- |
| 認証 | NextAuth（Google OAuth）導入。すべての API は認証必須。 |
| セキュリティ | HTTPS (Vercel) / 同一オリジン前提で CORS 対応。 |
| パフォーマンス | Task (userId, createdAt) にインデックス設置。レスポンス 300ms 以内を目標。 |
| 可用性 | Vercel / Neon の SLA に準拠。 |
| 保守性 | TypeScript + Prisma による型安全な開発。 |
| スケーラビリティ | Prisma スキーマ拡張、Neon の接続プールを利用。 |
| 運用 | `.env` による環境分離、マイグレーションは Git 管理 (`prisma migrate`). |

## 5. データベース設計（Prisma / PostgreSQL）

### users
| 列 | 型 | 制約 |
| --- | --- | --- |
| id | SERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | NOT NULL UNIQUE |
| image | VARCHAR(255) | NULL |
| email_verified | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |

### accounts テーブル（NextAuth 用接続情報）

|列名|型|制約 / 備考|
|---|---|---|
|id|SERIAL|PRIMARY KEY|
|user_id|INTEGER|NOT NULL, FOREIGN KEY → users.id (ON DELETE CASCADE)|
|provider|VARCHAR(255)|NOT NULL|
|provider_account_id|VARCHAR(255)|NOT NULL, UNIQUE (provider, provider_account_id)|
|type|VARCHAR(255)|NOT NULL|
|refresh_token|TEXT|NULL 可|
|access_token|TEXT|NULL 可|
|expires_at|INTEGER|NULL 可|
|token_type|VARCHAR(255)|NULL 可|
|scope|VARCHAR(255)|NULL 可|
|id_token|TEXT|NULL 可|
|session_state|VARCHAR(255)|NULL 可|

### sessions テーブル（NextAuthセッション）

|列名|型|制約 / 備考|
|---|---|---|
|id|VARCHAR(191)|PRIMARY KEY (Prisma既定で cuid())|
|session_token|VARCHAR(255)|UNIQUE|
|user_id|INTEGER|NOT NULL, FOREIGN KEY → users.id (ON DELETE CASCADE)|
|expires|TIMESTAMPTZ(6)|NOT NULL|

### verification_tokens テーブル（NextAuthがメール認証等で使用）

|列名|型|制約 / 備考|
|---|---|---|
|identifier|VARCHAR(255)|NOT NULL|
|token|VARCHAR(255)|NOT NULL, UNIQUE|
|expires|TIMESTAMPTZ(6)|NOT NULL|
|複合ユニーク|(identifier, token)||

### tasks
| 列 | 型 | 制約 |
| --- | --- | --- |
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | FK → users(id) ON DELETE CASCADE |
| title | VARCHAR(100) | NOT NULL |
| detail | TEXT | NULL |
| state | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| updated_at | TIMESTAMPTZ | DEFAULT now() |


## 6. 認証方針

- NextAuth.js (Google OAuth) を採用。  
- API では `getServerSession` を用いて `session.user.id` を取得し、Prisma クエリに `where: { userId: session.user.id }` を必ず付与。  
- ログアウト／アカウント切り替えしやすいよう `prompt: "select_account"` を付与。  
- サインイン / サインアウトは NextAuth 提供のエンドポイント `/api/auth/*` を利用。

## 7. 運用・開発要件

| 項目 | 内容 |
| --- | --- |
| 環境変数 | `.env` / `.env.local` で `DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID` 等を管理。 `.env.sample` あり。 |
| ローカル実行 | `npm run dev` |
| DB マイグレーション | `npx prisma migrate dev` |
| 本番デプロイ | Vercel (Next.js) + Neon (DB) |
| テスト | 任意で Postman / curl / Jest など |
