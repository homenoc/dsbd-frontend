# dsbd-frontend

HomeNOC (AS59105) のフロントエンド monorepo。`dsbd-user`（ユーザー向け）と
`dsbd-web-admin`（管理向け）を統合し、共通コードを `packages/shared` に集約する。

## 構成

```
apps/
  web/       ユーザーダッシュボード (React 18 + MUI 5 + Vite)
  admin/     管理ダッシュボード   (React 18 + MUI 5 + Vite)
packages/
  shared/    共有: API クライアント / 型 / 定数 / ユーティリティ (@dsbd/shared)
```

両アプリの履歴は元リポジトリ（dsbd-web / dsbd-web-admin）から `git subtree` で
取り込み済み。

## セットアップ

```bash
pnpm install
```

## 主要コマンド（ルート）

```bash
pnpm build         # 全パッケージビルド
pnpm typecheck     # 全パッケージ tsc --noEmit（vite build は型チェックしないため必須）
pnpm check         # Biome（lint + format チェック）
pnpm check:fix     # Biome 自動修正
pnpm test          # Vitest（純粋ロジックのみ対象）
pnpm web <script>  # 例: pnpm web dev
pnpm admin <script>
```

## ツールチェイン

- パッケージマネージャ: **pnpm**（workspace）
- lint / format: **Biome**（recommended ルール）
- テスト: **Vitest**（vlan パーサ等の純粋ロジック）
- 型: 共通設定 `tsconfig.base.json`
