# 技術的負債・暫定実装メモ（dsbd-frontend）

リファクタ中に「動かすことを優先して暫定対応した」箇所の一覧。後で直せるように記録する。
各項目は `場所 / 何をした / なぜ暫定 / あるべき姿`。

## F2/F3（共有クライアント・TanStack Query 移行）

### 1. `@tanstack/react-query` の型が解決していない（要根治）
- **場所**: `apps/web`（`tsconfig.json` moduleResolution=bundler でも `useQuery` が `any` になる）
- **何をした**: `hooks/useInfo.ts` / `hooks/useTemplate.ts` の戻り値に **明示的な返り型**（`UseInfoResult` / `UseTemplateResult`）を付けて、`data` を `InfoData`/`TemplateData` に固定した。`useQuery<T>()` の明示ジェネリックでも `data` が `any` になったため、hook 境界で型を張り直している。
- **なぜ暫定**: react-query v5.101 の型宣言（`build/modern/index.d.ts`）がこのツールチェーンで読めておらず、`useQuery`/`QueryClient`/`QueryClientProvider` が軒並み `any`。実行時は正常。原因未特定（`target: es5` / query-core の型解決 / exports 条件のいずれか疑い）。
- **あるべき姿**: react-query の型が正しく解決する構成に直す（`target` を ES2020 に上げる、`@types` 整合、`tsconfig` の module/moduleResolution 見直し等）。解決すれば hook の手張り返り型は不要になり、`isLoading`/`refetch` 等も型付きで使える。

### 2. hook が `isLoading`/`refetch` 等を返していない
- **場所**: `apps/web/src/hooks/useInfo.ts`, `useTemplate.ts`
- **何をした**: 返り型を `{ data, error, isLoading }` に絞った（消費側が `data`/`error` しか使っていないため）。
- **なぜ暫定**: 上記#1 で react-query が `any` のため、フル型（`UseQueryResult<T>`）を返せない。
- **あるべき姿**: #1 解決後、`UseQueryResult<InfoData>` をそのまま返す。

### 3. `api/Info.ts` の `Get()`/`GetTemplate()` が「invalidate だけする」名残関数
- **場所**: `apps/web/src/api/Info.ts`
- **何をした**: 旧 Redux dispatch を捨て、`queryClient.invalidateQueries` を呼ぶだけの薄い関数に。多数のダイアログが `Get().then()` で呼ぶのを壊さないための互換シム。
- **あるべき姿**: 各ダイアログを直接 `queryClient.invalidateQueries({queryKey: infoQueryKey})` もしくは mutation の `onSuccess` に置き換え、`api/Info.ts` を削除。

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

### 7. admin アプリの Recoil→TanStack Query 移行は未着手
- **場所**: `apps/admin`（`api/Recoil.ts` の `TemplateState` atom がまだ生きている）
- **状態**: web の F3 は完了。admin はこれから（同じ useTemplate パターンを適用予定）。

### 9. Dashboard(admin) で /group を二重取得
- **場所**: `apps/admin/src/pages/Dashboard/Dashboard.tsx`
- **何をした**: 統計チップ用に `GroupGetAll()`(imperative)で `group` state を、Group ウィジェット用に `useGroups()`(TanStack Query)で `groups` を、それぞれ取得している。/group を2回叩く。
- **あるべき姿**: `useGroups()` に一本化し `GroupGetAll` を撤去。

### 10. useTemplate/TemplateData の名称が実体(catalog)と不一致
- **場所**: 両アプリ `hooks/useTemplate.ts`, `interface.ts TemplateData`
- **何をした**: B5 で `/template`→`/catalog` に repoint したが、churn 抑制のため hook 名 `useTemplate`・型名 `TemplateData` を据え置き。
- **あるべき姿**: `useCatalog`/`CatalogData` にリネーム。

### 11. useInfo 解体後、消費ページが InfoData 形状を useMemo で再組立て
- **場所**: `apps/web/src/pages/**`（Dashboard/Procedure/Add/Payment/SupportDetail 等）
- **何をした**: B6 で `/info` を per-resource 化。churn 抑制のため各ページで per-resource hook を呼び、`useMemo` で旧 `InfoData` 形状（`undefined`→ロード後 stable）に再組立てして下流コードを据え置いた。
- **あるべき姿**: 消費側を直接 hook の `data` 読みに書き換え、`InfoData` 組立てシムを撤去。

### 12. invalidateAllInfo は全リソースキーを一括 invalidate
- **場所**: `apps/web/src/hooks/useInfo.ts` `invalidateAllInfo`、`api/Info.ts` `Get()`
- **何をした**: 旧「blob 丸ごと refetch」の挙動保存のため、mutation 後は 8 キー全て invalidate。
- **あるべき姿**: 変更したリソースのキーだけ invalidate（例: connection 追加なら connection/info/service のみ）。

### 8. 各 API ファイル（Service.ts 等）の共有クライアント移行は未完
- **場所**: `apps/web/src/api/*`, `apps/admin/src/api/*`
- **何をした**: 共有 `createApiClient` は用意し info/template は移行したが、命令的 API（Service.Post 等）は旧 axios のまま。
- **あるべき姿**: 全 API ファイルを `lib/api` の共有クライアントに載せ替え、`{error,data}` 契約を throw + 型付き返却に統一（F3 の呼び出し元更新と一緒に）。

## backend（参考: 別リポ dsbd-backend / refactor/backend-all）
- B3 で store のトランザクション導入は未実施（service/connection 追加・承認）→ 承認ワークフロー（workflow パッケージ）と一緒に実装予定。
- Get の `ResultDatabase` ラッパは呼び出し箇所 churn 抑制のため一部維持（本来は `([]T, error)` に統一したい）。
