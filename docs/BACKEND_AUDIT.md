# DevPath Backend Audit

## 1. Route Inventory

| Route Path | Method(s) | Auth Guard | Uses withErrorHandler? | Cache-Aware? |
|---|---|---|---|---|
| `/api/auth/[...nextauth]` | GET, POST | none (NextAuth internal) | no | no |
| `/api/auth/register` | POST | none | yes | no |
| `/api/admin/stats` | GET | requireAdmin | yes | no |
| `/api/admin/users` | GET | requireAdmin | yes | no |
| `/api/admin/users/[userId]` | GET | requireAdmin | yes | no |
| `/api/admin/users/[userId]` | PATCH | requireAdmin | yes | no |
| `/api/admin/settings` | GET | requireAdmin | yes | no |
| `/api/bookmarks` | GET | manual session check (inline) | yes | no |
| `/api/dashboard` | GET | manual session check (inline) | yes | no |
| `/api/nodes/[nodeId]` | GET | none | no | no |
| `/api/nodes/[nodeId]` | PUT | requireAdmin | no | no |
| `/api/nodes/[nodeId]` | DELETE | requireAdmin | no | no |
| `/api/nodes/[nodeId]/comments` | GET | none (optional user session) | yes | no |
| `/api/nodes/[nodeId]/comments` | POST | requireAuth | yes | no |
| `/api/comments/[commentId]` | DELETE | requireAuth (owner or requireAdmin) | yes | no |
| `/api/comments/[commentId]/replies` | POST | requireAuth | yes | no |
| `/api/replies/[replyId]` | DELETE | requireAuth (owner or requireAdmin) | yes | no |
| `/api/nodes/[nodeId]/resources` | GET | none | no | no |
| `/api/nodes/[nodeId]/resources` | POST | requireAdmin | no | no |
| `/api/resources/[id]` | GET | none | no | no |
| `/api/resources/[id]` | PUT | requireAdmin | no | no |
| `/api/resources/[id]` | DELETE | requireAdmin | no | no |
| `/api/roadmaps` | GET | none (optional user session) | yes | yes (cache.get/set) |
| `/api/roadmaps` | POST | requireAdmin | yes | yes (cache.invalidate) |
| `/api/roadmaps/[roadmapId]` | GET | none (optional user session) | yes | yes (cache.get/set) |
| `/api/roadmaps/[roadmapId]` | PUT | requireAdmin | yes | yes (cache.invalidate) |
| `/api/roadmaps/[roadmapId]` | DELETE | requireAdmin | yes | yes (cache.invalidate) |
| `/api/roadmaps/[roadmapId]/bookmark` | POST | manual session check (inline) | yes | no |
| `/api/roadmaps/[roadmapId]/bookmark` | DELETE | manual session check (inline) | yes | no |
| `/api/roadmaps/[roadmapId]/like` | POST | manual session check (inline) | no | yes (cache.invalidate) |
| `/api/roadmaps/[roadmapId]/like` | DELETE | manual session check (inline) | no | yes (cache.invalidate) |
| `/api/roadmaps/[roadmapId]/nodes` | GET | none | yes | no |
| `/api/roadmaps/[roadmapId]/nodes` | POST | requireAdmin | yes | no |
| `/api/roadmaps/[roadmapId]/progress` | GET | manual session check (inline) | no | no |
| `/api/roadmaps/[roadmapId]/progress` | POST | manual session check (inline) | no | no |
| `/api/roadmaps/[roadmapId]/publish` | PATCH | requireAdmin | yes | yes (cache.invalidate) |
| `/api/roadmaps/[roadmapId]/status` | GET | none (optional user session) | yes | no |
| `/api/search` | GET | none (optional user session) | yes | yes (cache.get/set, TTL 60 s) |
| `/api/subscriptions/me` | GET | manual session check (inline) | yes | no |
| `/api/trending` | GET | none (optional user session) | yes | yes (cache.get/set, TTL 120 s) |
| `/api/users/me` | GET | manual session check (inline) | yes | yes (cache.get/set) |
| `/api/users/me` | PATCH | manual session check (inline) | yes | yes (cache.invalidate) |
| `/api/users/me/avatar` | POST | manual session check (inline) | yes | yes (cache.invalidate) |
| `/api/users/me/avatar` | DELETE | manual session check (inline) | yes | yes (cache.invalidate) |
| `/api/users/[username]` | GET | none (optional session for privacy check) | yes | yes (cache.get/set) |

---

## 2. Admin Role Model

### How `role` is stored on `User`

Defined in `prisma/schema.prisma` as a Prisma enum field with a default of `USER`:

```prisma
enum UserRole {
  USER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}

model User {
  role  UserRole  @default(USER)
  ...
}
```

The value is a string at the database level (MongoDB document field `role`). It is placed into the NextAuth JWT token in the `jwt` callback (`lib/auth.ts`), then forwarded to `session.user.role` in the `session` callback.

### `requireAuth` — exact signature (`lib/auth-utils.ts`)

```ts
export async function requireAuth(): Promise<AuthResult>
```

Calls `getServerSession(authOptions)`. Returns `{ session, response: null }` when authenticated (i.e., `session?.user?.id` is truthy). Returns `{ session: null, response: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }) }` otherwise.

### `requireAdmin` — exact signature (`lib/auth-utils.ts`)

```ts
export async function requireAdmin(): Promise<AuthResult>
```

Delegates to `requireAuth()` first. If that passes, checks whether `session.user.role` is exactly `"ADMIN"` or `"SUPER_ADMIN"`. If the role check fails, returns `{ session: null, response: NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 }) }`.

Supporting type:

```ts
export type AuthResult =
  | { session: Session; response: null }
  | { session: null; response: NextResponse };
```

---

## 3. Gap List

| Area | Status | Evidence |
|---|---|---|
| Admin CRUD: roadmaps | **Present** | `POST /api/roadmaps` (create), `PUT /api/roadmaps/[roadmapId]` (update), `DELETE /api/roadmaps/[roadmapId]` (delete), `GET /api/roadmaps/[roadmapId]` (read) — mutating methods guarded by `requireAdmin` |
| Admin CRUD: nodes | **Present** | `POST /api/roadmaps/[roadmapId]/nodes` (create), `PUT /api/nodes/[nodeId]` (update), `DELETE /api/nodes/[nodeId]` (delete), `GET /api/nodes/[nodeId]` (read) — mutating methods guarded by `requireAdmin` |
| Admin CRUD: resources | **Present** | `POST /api/nodes/[nodeId]/resources` (create), `PUT /api/resources/[id]` (update), `DELETE /api/resources/[id]` (delete), `GET /api/resources/[id]` (read) — mutating methods guarded by `requireAdmin` |
| Content publish/unpublish toggle | **RESOLVED** | Dedicated `PATCH /api/roadmaps/[roadmapId]/publish` endpoint created. Accepts `{ action: "publish" \| "unpublish" }` validated by Zod. Enforces the rule: **a roadmap with zero nodes cannot be published** (returns 400). Sets `isPublished`, `status` (`PUBLISHED`/`DRAFT`), and `publishedAt` (first publish only). Both `isPublished` and `status` are removed from the freeform `PUT` update schema. Cache invalidation fires on both transitions via `cache.invalidate(roadmap key)` + `cache.invalidate(roadmapList key)`. |
| Admin dashboard real-time stats | **RESOLVED** | `GET /api/admin/stats` expanded: now returns aggregate counts (`roadmapCount`, `publishedRoadmapCount`, `nodeCount`, `resourceCount`, `userCount`, `commentCount`), active-user counts for last 7/30 days, subscription tier+status breakdown, and full daily time-series for signups and roadmap completions for last 7 and 30 days. All queries use `prisma.*.count()`, `findMany` with date filters, and in-process bucketing — no external analytics infrastructure. |
| User: roadmap browsing | **Present** | `GET /api/roadmaps` supports pagination, `type`/`difficulty`/`featured` filters, case-insensitive `search`, and attaches `isLiked`/`isBookmarked` for authenticated users |
| User: search | **RESOLVED** | Dedicated `GET /api/search?q=` endpoint created. Calls `searchRoadmaps()` (previously dead code). Matches across `title`, `description`, `category`, `type` (enum equality), and `tags` array (`has`). Supports `page`/`pageSize` pagination. Optional session attaches `isLiked`/`isBookmarked`. Anonymous responses cached for 60 s (SHORT TTL). Only published roadmaps returned. |
| User: progress tracking | **Present** | `GET /api/roadmaps/[roadmapId]/progress` returns completed node IDs; `POST` toggles node completion, awards 10 pts, logs `NODE_COMPLETED` activity, detects roadmap completion, and awards 50 bonus pts |
| User: bookmarks/saved | **Present** | `POST /api/roadmaps/[roadmapId]/bookmark` and `DELETE` toggle bookmarks with atomic count update; `GET /api/bookmarks` returns all saved roadmaps for the current user |
| User: likes | **Present** | `POST /api/roadmaps/[roadmapId]/like` and `DELETE` toggle likes with atomic count update and cache invalidation |
| User: profile access | **Present** | `GET /api/users/me` and `PATCH /api/users/me` for self; `GET /api/users/[username]` for public profiles with `isPublic` privacy gate |
| Comments/replies | **RESOLVED** | `GET/POST /api/nodes/[nodeId]/comments` (list/create, node-scoped via `parentId`), `POST /api/comments/[commentId]/replies`, `DELETE /api/comments/[commentId]` and `DELETE /api/replies/[replyId]` (owner or admin). Zod-validated content (1–5000 chars). Optional session attaches `isOwner`. Cache-backed rate limit (5 writes/user/min). No list caching (write-heavy; pattern invalidation unsupported). |
| Admin user management | **RESOLVED** | `GET /api/admin/users` (paginated list, filterable by `role`/`search`/`disabled`), `GET /api/admin/users/[userId]` (full user detail with subscription + activity counts), `PATCH /api/admin/users/[userId]` (role change + soft-disable/enable via `disabled` boolean). Strict Zod allow-list — no raw body spread. Guards: `requireAdmin` with `adminId`/`adminRole` audit log on every request. Role escalation to `SUPER_ADMIN` restricted to `SUPER_ADMIN` only. DELETE is intentionally absent (soft-disable only). |
| Analytics/settings API | **RESOLVED** | `GET /api/admin/settings` returns full platform configuration: pagination defaults, cache TTLs, gamification point values, subscription tier limits, feature gate definitions (from `lib/config.ts` + `lib/feature-gates.ts`), plus live DB snapshot of user-role distribution and subscription tier+status breakdown via `groupBy`. All data is non-secret runtime config; no billing/checkout logic. |
| Search/trending | **RESOLVED** | `GET /api/trending` created. Calls `getTrendingRoadmaps()` (previously dead code). Returns up to 50 published roadmaps ordered by `viewCount → likeCount → bookmarkCount`. Optional `limit` query param (default 10, max 50). Optional session attaches `isLiked`/`isBookmarked`. Anonymous responses cached for 120 s. |

---

## 4. Inconsistencies Found

### 4.1 Mixed error-handling patterns

**RESOLVED**: Migrated all listed routes to `withErrorHandler` and `createApiResponse` to standardize error and success responses.

### 4.2 Inconsistent auth-guard style

**RESOLVED**: Replaced all inline `getServerSession` calls and manual null checks with `requireAuth` or `requireAdmin` helpers.

### 4.3 `POST /api/roadmaps` body spread without schema validation

**RESOLVED**: Implemented strict `roadmapCreateSchema` Zod validation for POST `/api/roadmaps`.

### 4.4 `PUT /api/nodes/[nodeId]` and `PUT /api/resources/[id]` spread raw body into Prisma update

**RESOLVED**: Implemented Zod schema validation and explicit field allow-lists for updates on nodes, resources, roadmaps, and users to prevent raw body spreads.

### 4.5 `GET /api/roadmaps/[roadmapId]` increments `viewCount` unconditionally

**RESOLVED**: Restricted the `viewCount` database increment to execute only when `fromCache` is false.

### 4.6 `requireAdmin` result destructures only `response`, discards `session`

**RESOLVED**: Updated all `requireAdmin` calls to destructure both `session` and `response`, logging admin audit trails (`adminId` and `adminRole`) for mutations.

### 4.7 `GET /api/users/me` cache key degrades to `user:profile:` when username is empty

**RESOLVED**: Configured the cache key in GET `/api/users/me` to fall back to `session.user.id` if username is unresolved.

### 4.8 `POST /api/users/me/avatar` stores a placeholder URL silently

**RESOLVED**: Updated the avatar upload POST handler to return a `501 Not Implemented` response.

### 4.9 `GET /api/test-debug` is reachable in non-production environments without auth

**RESOLVED**: Deleted `/api/test-debug` route and its test script entirely from the codebase since they were not used by production features.

### 4.10 Admin user management and analytics/settings APIs were missing

**RESOLVED**: Implemented the following endpoints, all guarded by `requireAdmin`, using `withErrorHandler` + `createApiResponse`, Zod-validated allow-lists, and `adminId`/`adminRole` audit logging on every request:

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/admin/users` | Paginated user list, filterable by `role`, `search`, `disabled` |
| `GET` | `/api/admin/users/[userId]` | Full user detail with subscription and activity counts |
| `PATCH` | `/api/admin/users/[userId]` | Role change + soft-disable/enable (no DELETE — by design) |
| `GET` | `/api/admin/settings` | Platform config: tier limits, feature gates, cache TTLs, points, live DB snapshot |
| `GET` | `/api/admin/stats` | Expanded: aggregate counts + active-user counts + daily time-series for signups/completions (7 and 30 day windows) |

### 4.11 Privilege-escalation gap: plain ADMIN could promote USER → ADMIN

**RESOLVED**: Added a third role-escalation guard in `PATCH /api/admin/users/[userId]`:
```ts
if (validated.role === "ADMIN" && session.user.role !== "SUPER_ADMIN") {
  throw ApiError.forbidden("Only SUPER_ADMIN can grant ADMIN role");
}
```
Final cumulative access matrix:
1. Non-SUPER_ADMIN cannot touch any account whose current role is ADMIN or SUPER_ADMIN.
2. Only SUPER_ADMIN can set a role to SUPER_ADMIN.
3. Only SUPER_ADMIN can set a role to ADMIN. ← new
Net: a plain ADMIN can only toggle the `disabled` flag on USER/MODERATOR accounts.

### 4.12 Soft-disable had no actual enforcement (JWT bypass) + `isPublic` conflation

**RESOLVED**: Added dedicated `isDisabled Boolean @default(false)` to the `User` model in `prisma/schema.prisma`. Applied to the MongoDB Atlas database via `npx prisma db push` (confirmed sync). Prisma client regenerated with `isDisabled` in the generated types.

Changes made:
- **`prisma/schema.prisma`**: `isDisabled Boolean @default(false)` added under `// Preferences` on the `User` model. Field is admin-only; `isPublic` is untouched as the user-facing profile-privacy toggle.
- **`lib/auth-utils.ts`**: `requireAuth()` DB re-check now selects and tests `isDisabled` (not `isPublic`). Check is `if (!dbUser || dbUser.isDisabled)` — blocked when `true`, allowed when `false` (inverted polarity from the old `isPublic` check). Returns `403 ACCOUNT_DISABLED` on block.
- **`app/api/admin/users/[userId]/route.ts`**: PATCH writes `isDisabled = validated.disabled` directly (no polarity inversion needed). `targetUser` and `updatedUser` selects updated. Response shape reads `disabled: updatedUser.isDisabled`. File header comment updated to document the clean separation.
- **`app/api/admin/users/route.ts`**: `disabled` filter now targets `isDisabled` directly. `findMany` select now includes `isDisabled`. Old `isPublic`-as-proxy comments removed.

`isPublic` conflation fully resolved: `PATCH /api/users/me` and `GET /api/users/[username]` are completely untouched. A user who sets their own profile to private (`isPublic: false`) retains full access to all `requireAuth`-guarded routes. Only an admin explicitly setting `isDisabled: true` will block a user.
