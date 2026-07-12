# 技術的負債・暫定実装メモ（dsbd-frontend）

リファクタ中に「動かすことを優先して暫定対応した」箇所の一覧。後で直せるように記録する。
各項目は `場所 / 何をした / なぜ暫定 / あるべき姿`。

## F2/F3（共有クライアント・TanStack Query 移行）

### 1. `@tanstack/react-query` の型が解決していない（要根治）
- **場所**: 両アプリ（`tsconfig.json` moduleResolution=bundler でも `useQuery` が `any` になる）
- **何をした**: `hooks/useInfo.ts` / `hooks/useCatalog.ts` / admin `hooks/useResources.ts` の戻り値に**明示的な返り型**を付けて、`data` を実型に固定した。`useQuery<T>()` の明示ジェネリックでも `data` が `any` になったため、hook 境界で型を張り直している。インラインの `useQuery`/`useMutation`（各コンポーネント内）もコールバック引数に手動注釈。
- **なぜ暫定**: react-query v5.101 の型宣言（`build/modern/index.d.ts`）がこのツールチェーンで読めておらず、`useQuery`/`QueryClient`/`QueryClientProvider` が軒並み `any`。実行時は正常。原因未特定（`target: es5` / query-core の型解決 / exports 条件のいずれか疑い）。
- **あるべき姿**: react-query の型が正しく解決する構成に直す（`target` を ES2020 に上げる、`@types` 整合、`tsconfig` の module/moduleResolution 見直し等）。解決すれば hook の手張り返り型は不要になり、`isLoading`/`refetch` 等も型付きで使える。

### 2. hook が react-query のフル返り値型を返せていない
- **場所**: 両アプリの hooks（`useInfo.ts`, `useCatalog.ts`, admin `useResources.ts`）
- **何をした**: 返り型を `{ data, error, isLoading }`（+一部 `refetch`）に絞った手張り型。
- **なぜ暫定**: 上記#1 で react-query が `any` のため、フル型（`UseQueryResult<T>`）を返せない。
- **あるべき姿**: #1 解決後、`UseQueryResult<T>` をそのまま返す。

### 4. `onUnauthorized` が `window.location.href` でリダイレクト
- **場所**: `apps/web/src/lib/api.ts`, `apps/admin/src/lib/api.ts`
- **何をした**: 401 時に `window.location.href='/login'`（web）/ `'/'`（admin）でハードリダイレクト。
- **なぜ暫定**: 共有クライアントは React Router の外側なので `navigate` が使えない。
- **あるべき姿**: ルーターと連携した 401 ハンドリング（router 経由の soft navigation）。

### 5. admin のトークンは `sessionStorage` 直参照のまま
- **場所**: `apps/admin/src/lib/api.ts`（`getAuthHeaders` が `sessionStorage.getItem('AccessToken')`）
- **何をした**: F1b でキー不整合バグは直したが、`lib/tokenStorage.ts` への一元化は未実施。
- **あるべき姿**: `tokenStorage` モジュールに集約し、全 sessionStorage 直参照を置換。

### 6. Add.tsx / UserDetail / ConnectionAdd などで filter/find コールバックに手動型注釈
- **場所**: 上記各ページの `.filter((value: ServiceData) => ...)` 等
- **何をした**: #1 の影響で `infoData` が一時 `any` に見えていた名残で明示注釈を付けた箇所がある。hook 返り型を張った今は本来不要。
- **あるべき姿**: #1 解決後に不要な注釈を掃除。

### 11. 型名 `CatalogData` は `TemplateData` の re-export エイリアス
- **場所**: 両アプリ `interface.ts`（`export type { TemplateData as CatalogData }`）
- **何をした**: useCatalog リネーム時、shared/interface の実体型名 `TemplateData` は据え置き、アプリ側だけエイリアスで `CatalogData` に。
- **あるべき姿**: 実体の型名自体を `CatalogData` にリネーム（shared 含む）。

## 解消済み（記録）
- ~~#3 `api/Info.ts` の invalidate シム~~ → 全 mutation が `invalidateQueries` 直呼びに置換し**ファイル削除**（2026-07-12）
- ~~#7 admin の TanStack Query 移行~~ → 完了。読み=useQuery（useResources の list/detail hooks）、書き=useMutation+invalidate（2026-07-12）
- ~~#8 命令的 API の共有クライアント移行~~ → **axios 全廃・`src/api/` ディレクトリごと解体**。薄いラッパーは queryFn/mutationFn にインライン、実ロジックは lib/（auth/config/tool）へ移設。reload/setReload 機構も全廃（2026-07-12）
- ~~#9 Dashboard(admin) の /group 二重取得~~ → `useGroups()` に一本化（2026-07-12）
- ~~#10 useTemplate 名称不一致~~ → `useCatalog`/`CatalogData` にリネーム（型実体名は #11 に残件）（2026-07-12）

## backend（参考: 別リポ dsbd-backend / refactor/backend-all）
- B3 で store のトランザクション導入は未実施（service/connection 追加・承認）→ 承認ワークフロー（workflow パッケージ）と一緒に実装予定。
- Get の `ResultDatabase` ラッパは呼び出し箇所 churn 抑制のため一部維持（本来は `([]T, error)` に統一したい）。
