# 個別指導塾における授業引継ぎ支援システム

Next.js App Router、TypeScript、Prisma、Supabase、Tailwind CSS を使った授業引継ぎ支援システムです。

## セットアップ

```bash
npm install
cp .env.example .env.local
npm run prisma:generate
npm run dev
```

Supabase PostgreSQL を使う場合は `.env.local` の `DATABASE_URL` と `DIRECT_URL` を設定し、以下を実行します。

```bash
npm run prisma:migrate -- --name init
npm run db:seed
```

`DATABASE_URL` が未設定の場合は、画面確認用のサンプルデータで動作します。

## 主な画面

- `/login` ログイン画面
- `/` トップ画面
- `/students` 生徒検索画面
- `/students/[studentId]` 生徒詳細画面
- `/students/[studentId]/lessons/new` 授業記録入力画面
- `/students/[studentId]/lessons/new/confirm` 確認画面
- `/students/[studentId]/lessons/new/complete` 完了画面
- `/admin` 管理者画面
