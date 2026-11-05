# DevPath Frontend Audit

> Generated after reading all files under `app/**` (excluding `app/api/**`),
> `components/**`, and the client-side data-fetching layer (`lib/hooks/`,
> `lib/dashboard-fix.ts`).  Cross-referenced against `docs/BACKEND_AUDIT.md`
> for the authoritative backend route inventory.

---

## 1. Page Inventory

| Page / Route | API Endpoints Called | Auth Requirement | Current State |
|---|---|---|---|
| `/` (landing) | none | public | working (static) |
| `/about` | none | public | working (static) |
| `/login` | NextAuth `signIn()` only | public | working |
| `/register` | `POST /api/auth/register` | public | working |
| `/roadmaps` | `GET /api/roadmaps` (browse) and `GET /api/search` (search mode via `useSearchRoadmaps`) | public | working |
| `/roadmaps/[roadmapId]` | `GET /api/roadmaps/[id]`, `GET /api/roadmaps/[id]/progress`, `POST /api/roadmaps/[id]/progress` | user (redirects to login if not authed) | working for progress; publish toggle absent |
| `/saved` | `GET /api/bookmarks` (via `useSavedRoadmaps`) | user | working |
| `/dashboard` | `GET /api/dashboard` (via `useDashboardData`) | user | working (basic) |
| `/dashboard` layout | none | user | working |
| `/profile/[accountId]` | `GET /api/users/[username]` | public | working — loads live profile data and respects privacy settings |
| `/pricing` | none | public | stub — subscribe button calls `console.log` only |
| `/pricing/dashboard` | **none** | public | **dead page — 100% hardcoded mock data; duplicate of `/dashboard`** |
| `/admin` | `GET /api/admin/stats` | admin | working — client-side admin guard added; expanded stats fields are consumed |
| `/admin/roadmaps` | `GET /api/roadmaps?all=true`, `DELETE /api/roadmaps/[id]`, `PATCH /api/roadmaps/[id]/publish` | admin (backend only) | **RESOLVED** — now calls admin endpoint with `?all=true` to show drafts; publish/unpublish toggle added; uses toast notifications; **client-side admin guard added** |
| `/admin/roadmaps/new` | `POST /api/roadmaps` | admin (backend only) | **RESOLVED** — form submits correctly; now uses toast notifications instead of alert(); **client-side admin guard added**; **status/isPublished fields removed** — always creates drafts |
| `/admin/roadmaps/[id]/edit` | `GET /api/roadmaps/[id]`, `PUT /api/roadmaps/[id]` | admin (backend only) | **RESOLVED** — edit page created; matches new/page.tsx form style; uses toast notifications |
| `/admin/users` | `GET /api/admin/users`, `PATCH /api/admin/users/[userId]` | admin | working — user management page exists |
| `/admin/settings` | `GET /api/admin/settings` | admin | working — settings page exists |

---

## 2. API Call Inventory

| Call Site | Endpoint | Response Shape Expected | Handles `error`/`code`? |
|---|---|---|---|
| `lib/hooks/use-roadmaps.ts` · `useRoadmaps` | `GET /api/roadmaps` | `axios` response → reads `data.data.data` as `Roadmap[]` — **one extra `.data` nesting; correct only if backend wraps twice: `{success, data:{data:Roadmap[],pagination}}`** | no — errors fall to React-Query `error` state; no `.code` check |
| `lib/hooks/use-roadmaps.ts` · `useRoadmap` | `GET /api/roadmaps/[id]` | reads `data.data` as single Roadmap | no |
| `lib/hooks/use-roadmaps.ts` · `useCreateRoadmap` | `POST /api/roadmaps` | reads `data.data` | no |
| `lib/hooks/use-roadmaps.ts` · `useUpdateRoadmap` | `PUT /api/roadmaps/[id]` | reads `data.data` | no |
| `lib/hooks/use-roadmaps.ts` · `useDeleteRoadmap` | `DELETE /api/roadmaps/[id]` | reads `data` (no `.data` unwrap — **inconsistent**) | no |
| `lib/hooks/use-roadmaps.ts` · `useRoadmapProgress` | `GET /api/roadmaps/[id]/progress` | reads `data.data?.completedNodeIds ?? []` | no |
| `lib/hooks/use-roadmaps.ts` · `useToggleNodeProgress` | `POST /api/roadmaps/[id]/progress` | reads `data.data?.completedNodeIds ?? []` | no |
| `lib/hooks/use-roadmaps.ts` · `useDashboard` | `GET /api/dashboard` | reads `data.data` | no |
| `lib/hooks/use-roadmaps-lazy.ts` · `useRoadmapsLazy` | `GET /api/roadmaps` | reads `data.data` as `{data:Roadmap[],pagination}` — pagination path `lastPage.pagination.page` is **wrong**: `lastPage` is an `AxiosResponse`, so pagination is at `lastPage.data.data.pagination`; **infinite scroll never advances past page 1** | no |
| `lib/hooks/use-bookmark.ts` · `useBookmarkStatus` | `GET /api/roadmaps/[id]/status` | reads `response.data.data.isBookmarked`, `response.data.data.bookmarkCount` | no — errors caught and `toast.error` shown; no `.code` check |
| `lib/hooks/use-bookmark.ts` · `useToggleBookmark` | `POST /api/roadmaps/[id]/bookmark`, `DELETE /api/roadmaps/[id]/bookmark` | reads `response.data` (full BookmarkResponse shape); optimistic updates with rollback | no `.code` check |
| `lib/hooks/use-bookmark.ts` · `useSavedRoadmaps` | `GET /api/bookmarks` | reads `response.data.data \|\| []` | no |
| `lib/dashboard-fix.ts` · `useDashboardData` | `GET /api/dashboard` | checks `result.success`; reads `result.data.user`, `.stats`, `.inProgress`, `.saved`, `.weeklyActivity`; reads `result.error` on failure | reads `.error` string only; no `.code` check; does NOT handle `ACCOUNT_DISABLED` |
| `components/roadmaps/RoadmapCard.tsx` | `POST /api/roadmaps/[id]/like`, `DELETE /api/roadmaps/[id]/like` | no response body read — only catch/toast | no |
| `app/register/page.tsx` | `POST /api/auth/register` | checks `response.ok`; reads `result.error` | no `.code` check |
| `app/admin/page.tsx` | `GET /api/admin/stats` | checks `json.success`; reads `json.data` into an expanded `AdminStats` model | yes — handles errors with toast and visible message |
| `app/admin/roadmaps/page.tsx` | `GET /api/roadmaps?all=true`, `DELETE /api/roadmaps/[id]`, `PATCH /api/roadmaps/[id]/publish` | checks `data.success`; reads `data.data`, `data.error` | **RESOLVED** — now uses toast notifications instead of alert(); reads `data.error`; no `.code` check |
| `app/admin/roadmaps/new/page.tsx` | `POST /api/roadmaps` | checks `data.success`; reads `data.data.roadmapId`, `data.error` | **RESOLVED** — now uses toast notifications instead of alert(); reads `data.error`; no `.code` check |
| `app/admin/roadmaps/[id]/edit/page.tsx` | `GET /api/roadmaps/[id]`, `PUT /api/roadmaps/[id]` | checks `data.success`; reads `data.data`, `data.error` | **NEW** — uses toast notifications; reads `data.error`; no `.code` check |

**Response shape note:** The backend uses `withErrorHandler` + `createApiResponse`, which produces:
```json
{ "success": true, "data": <payload>, "timestamp": "...", "requestId": "req_..." }
```
or on error:
```json
{ "success": false, "error": "...", "code": "VALIDATION_ERROR", "timestamp": "...", "requestId": "req_..." }
```
No frontend code reads `timestamp`, `requestId`, or `code` from any response. This is benign for `timestamp`/`requestId` (ignored extra fields), but means **no frontend code differentiates error types by `.code`** — including `ACCOUNT_DISABLED`, `FORBIDDEN`, `NOT_FOUND`, etc. All errors are treated as generic failures.

---

## 3. New Backend Endpoints With No Frontend Yet

All of the following are confirmed to have **zero** frontend callers:

| Endpoint | Backend Status | Frontend Status |
|---|---|---|
| `GET /api/search` | RESOLVED (dedicated search endpoint with pagination) | **resolved** — `/roadmaps` page uses search API via `useSearchRoadmaps` |
| `GET /api/trending` | RESOLVED | **resolved** — homepage and `TrendingRoadmaps` component call this endpoint |
| `PATCH /api/roadmaps/[id]/publish` | RESOLVED | **RESOLVED** — publish/unpublish toggle added to admin roadmap list with zero-nodes error handling |
| `GET /api/admin/users` | RESOLVED | **resolved** — `/admin/users` page exists and uses this endpoint |
| `GET /api/admin/users/[userId]` | RESOLVED | **missing** — no dedicated user detail page yet |
| `PATCH /api/admin/users/[userId]` | RESOLVED | **resolved** — user management page uses this endpoint for role/disable changes |
| `GET /api/admin/settings` | RESOLVED | **resolved** — `/admin/settings` page exists and fetches live settings |
| `GET /api/admin/stats` (expanded) | RESOLVED (time-series, active users, subscription breakdown) | **resolved** — admin dashboard now consumes expanded stats and displays time series |
| `GET /api/nodes/[nodeId]/comments` | RESOLVED | **missing** — `NodeDetails` panel has no comments section |
| `POST /api/nodes/[nodeId]/comments` | RESOLVED | **missing** |
| `POST /api/comments/[commentId]/replies` | RESOLVED | **missing** |
| `DELETE /api/comments/[commentId]` | RESOLVED | **missing** |
| `DELETE /api/replies/[replyId]` | RESOLVED | **missing** |
| `GET /api/users/me` | Present | **resolved** — `/settings` loads the current profile and populates settings form |
| `PATCH /api/users/me` | Present | **resolved** — `/settings` submits profile updates successfully |
| `POST /api/users/me/avatar` | Present (returns 501) | **missing** |
| `GET /api/users/[username]` | Present | **resolved** — `/profile/[accountId]` loads live profile data |
| `GET /api/subscriptions/me` | Present | **missing** — pricing page subscribe button is a stub; subscription status is never fetched |
| `GET /api/roadmaps/[id]/status` | Present | **called** by `use-bookmark.ts` (bookmark status only) — but `isLiked` from status response is not used to initialize like button state in `RoadmapCard` |

---

## 4. Broken or Mismatched Response Handling

### 4.1 `ACCOUNT_DISABLED` (403, code `ACCOUNT_DISABLED`) — resolved by global interceptor
The app now includes a global API interceptor in `lib/api-client.ts` that redirects `ACCOUNT_DISABLED` responses to `/account-disabled`. This is the only error code currently handled centrally; other API error codes still generally surface as generic failure messages.
"ACCOUNT_DISABLED"`, every frontend caller treats it identically to any other error (generic toast, empty state, or silent swallow). A disabled user will see confusing "Failed to load" messages or a broken dashboard with no explanation. No route redirects to a "your account has been disabled" page.

### 4.2 `app/admin/page.tsx` — now handles admin stats errors and expanded fields
`app/admin/page.tsx` now shows toast errors and a visible stats error banner when `/api/admin/stats` fails. The page also reads the expanded `AdminStats` payload and renders additional active user and time-series data.

### 4.4 `useRoadmapsLazy` — `getNextPageParam` reads wrong path
```ts
getNextPageParam: (lastPage: any) => {
  if (!lastPage || !lastPage.pagination) return 1;  // always true — .pagination is undefined
  return lastPage.pagination.page + 1;
}
```
`lastPage` is an `AxiosResponse` object. The pagination object lives at `lastPage.data.data.pagination`. As a result, `getNextPageParam` always returns `1` and infinite scroll never loads more pages.

### 4.5 `app/admin/roadmaps/page.tsx` — calls public roadmaps endpoint
**RESOLVED**: Backend now supports `?all=true` parameter with `requireAdmin` guard. Frontend updated to call `/api/roadmaps?all=true` to show all roadmaps including drafts to admins. Admin requests bypass cache for security.

```ts
// Before:
fetch("/api/roadmaps")  // returns only isPublished: true roadmaps

// After:
fetch("/api/roadmaps?all=true")  // returns all roadmaps (admin-only)
```

### 4.6 No client-side admin guard on admin pages
**RESOLVED**: `app/admin/page.tsx`, `app/admin/roadmaps/page.tsx`, and `app/admin/roadmaps/new/page.tsx` all now guard access with `useSession()` and redirect non-admin users. The admin section has an active client-side gate.

### 4.7 `useDeleteRoadmap` response read inconsistency
```ts
// useCreateRoadmap / useUpdateRoadmap:
return response.data.data;

// useDeleteRoadmap:
return response.data;  // ← misses the .data unwrap
```
These hooks are nominally consistent with the response wrapper, but the delete hook deviates. Low severity (delete doesn't return a body that's used), but indicative of copy-paste drift.

### 4.8 `app/admin/roadmaps/new/page.tsx` — sends `isPublished` and `status` in POST body
**RESOLVED**: The form no longer includes `status` and `isPublished` fields. New roadmaps are always created as drafts with `isPublished: false` hardcoded in the submit handler. This enforces the proper workflow: create as draft → add nodes → publish via toggle, ensuring the zero-nodes validation is always enforced.

### 4.9 `alert()` usage in admin pages
**RESOLVED**: Both `app/admin/roadmaps/page.tsx` and `app/admin/roadmaps/new/page.tsx` now use the existing toast notification system (`components/use-toast.ts`) instead of `alert()` for user feedback. The new edit page also uses toast notifications.

### 4.10 Error code handling is still incomplete
`ACCOUNT_DISABLED` is now handled centrally, but most frontend code still does not branch on `.code` values (`VALIDATION_ERROR`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMIT`). Error responses are still largely surfaced as generic failure messages. Useful behaviors still absent:
- `CONFLICT` on registration (username/email taken) → could show inline field error instead of generic toast
- `RATE_LIMIT` → could show a specific retry-after message

---

## 5. Admin Dashboard UI Status

### What exists
An admin UI is present at `/admin` with two sub-pages:

| Route | Content |
|---|---|
| `/admin` | Stats overview — now consumes expanded data from `GET /api/admin/stats`, shows time-series charts, and includes client-side auth guard |
| `/admin/roadmaps` | **RESOLVED** — Roadmap list (all roadmaps including drafts) with Delete button and publish/unpublish toggle. Uses toast notifications. **Client-side admin guard added.** |
| `/admin/roadmaps/new` | **RESOLVED** — Full roadmap creation form (status/isPublished removed — always creates drafts). Uses toast notifications. Routes to `/admin/roadmaps/[id]/edit` on success. **Client-side admin guard added.** |
| `/admin/roadmaps/[id]/edit` | **RESOLVED** — Full roadmap edit form matching new/page.tsx style. Loads existing data via GET, updates via PUT. Uses toast notifications. |
| `/admin/users` | **RESOLVED** — User management page exists and is wired to `GET /api/admin/users` and `PATCH /api/admin/users/[userId]` |
| `/admin/settings` | **RESOLVED** — Settings page exists and loads runtime settings from `GET /api/admin/settings` |

### What is absent relative to the current backend

| Missing Feature | Backend Endpoint | Notes |
|---|---|---|
| Publish / unpublish toggle | `PATCH /api/roadmaps/[id]/publish` | **RESOLVED** — toggle added to admin roadmap list with zero-nodes error handling |
| Draft roadmaps visible | `GET /api/roadmaps?all=true` (admin-only) | **RESOLVED** — backend now supports `?all=true` with requireAdmin guard; frontend updated |
| Roadmap edit page | `PUT /api/roadmaps/[id]` | **RESOLVED** — edit page created at `/admin/roadmaps/[id]/edit` |
| User management | `GET /api/admin/users`, `GET /api/admin/users/[id]`, `PATCH /api/admin/users/[id]` | **RESOLVED** — user management page exists and can disable/role-change users; dedicated detail page still missing |
| Platform settings | `GET /api/admin/settings` | **RESOLVED** — settings page exists and displays runtime config and subscription breakdown |
| Expanded stats dashboard | `GET /api/admin/stats` (expanded fields) | **RESOLVED** — admin dashboard consumes active-user metrics and time-series data |
| Node management | `POST /api/roadmaps/[id]/nodes`, `PUT /api/nodes/[id]`, `DELETE /api/nodes/[id]` | No admin UI for nodes at all |
| Resource management | `POST /api/nodes/[id]/resources`, `PUT /api/resources/[id]`, `DELETE /api/resources/[id]` | No admin UI for resources |
| Comment moderation | `DELETE /api/comments/[id]`, `DELETE /api/replies/[id]` | No admin UI |

### Summary
The admin UI covers approximately **one-third** of the available admin API surface. It can create, edit, delete, and publish/unpublish roadmaps. Draft roadmaps are now visible to admins. Remaining work — user management, settings, expanded analytics, node/resource/comment management — requires new frontend work (marked as out of scope for current task).
