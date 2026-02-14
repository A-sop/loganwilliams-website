# Contact Network — Security (Supabase)

**Purpose:** Ensure contact, household, and commission data is isolated per user. No user can see or modify another user's data.

---

## 1. Security Model

| Layer | Mechanism |
|-------|-----------|
| **Auth** | Clerk — user identity |
| **DB access** | Supabase with RLS |
| **User ID** | `auth.jwt()->>'sub'` (Clerk user ID passed via JWT) |
| **Client** | `createSupabaseClientForClerk()` — sends Clerk JWT so RLS applies |
| **Server actions** | Get `userId` from `auth()`; never accept `user_id` from client |

---

## 2. RLS Requirements (All Contact Network Tables)

Every table must have:

- **RLS enabled**
- **user_id** column (or ownership via FK)
- **Policies** for SELECT, INSERT, UPDATE, DELETE scoped to `auth.jwt()->>'sub' = user_id`

### Tables & Ownership

| Table | Owner column | Notes |
|-------|--------------|-------|
| households | user_id | Direct |
| contacts | user_id | Direct (owner; household_id is link) |
| contact_sources | user_id | Direct (denormalized for RLS; set from household on insert) |
| commission_records | user_id | Direct |
| household_tasks | user_id | Direct |

---

## 3. RLS Policies (Per Table)

### households

```sql
create policy "User can view own households"
  on households for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own households"
  on households for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own households"
  on households for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own households"
  on households for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));
```

### contacts

```sql
create policy "User can view own contacts"
  on contacts for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own contacts"
  on contacts for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own contacts"
  on contacts for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own contacts"
  on contacts for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));
```

### contact_sources

```sql
create policy "User can view own contact_sources"
  on contact_sources for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own contact_sources"
  on contact_sources for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own contact_sources"
  on contact_sources for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own contact_sources"
  on contact_sources for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));
```

### commission_records

```sql
create policy "User can view own commission_records"
  on commission_records for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own commission_records"
  on commission_records for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own commission_records"
  on commission_records for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own commission_records"
  on commission_records for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));
```

### household_tasks

```sql
create policy "User can view own household_tasks"
  on household_tasks for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own household_tasks"
  on household_tasks for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own household_tasks"
  on household_tasks for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own household_tasks"
  on household_tasks for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));
```

---

## 4. Application Code Rules

1. **User-scoped queries:** Use `createSupabaseClientForClerk()` — do **not** pass `user_id` in the query; RLS filters automatically.
2. **Inserts:** Get `userId` from `auth()` (server-only); set `user_id: userId` on insert. Never accept `user_id` from the client.
3. **Updates/Deletes:** Use the Clerk client; RLS blocks operations on rows where `user_id != auth.jwt()->>'sub'`.
4. **Imports (bulk):** When importing from Zoho/Provisionsabrechnung, use `auth()` to get `userId` and set it on every row. Use either Clerk client (RLS applies) or service_role with explicit server-side `user_id` setting — but prefer Clerk client for consistency.

---

## 5. Service Role vs Anon + JWT

| Use case | Client | Why |
|----------|--------|-----|
| User CRUD on own contacts | createSupabaseClientForClerk() | RLS enforces isolation |
| Bulk import (user logged in) | createSupabaseClientForClerk() | Same; batch inserts with user_id |
| Pre-auth / session-scoped (e.g. document intake) | createSupabaseAdmin() | No user yet; uses session_id; different flow |
| Background job / system task | createSupabaseAdmin() | If needed; must explicitly scope by user_id |

**Rule:** For contact network features, always use the Clerk client when the user is authenticated. Service role bypasses RLS — use only when necessary and with explicit server-side user scoping.

---

## 6. Sensitive Data

Contact data includes:

- Names, DOB, address, phone, email
- Marital status, citizenship, visa status
- Commission amounts
- Family members

All must be protected by RLS. No table should be readable by `anon` or by other users.

---

## 7. Verification Checklist

When Phase 1 (schema) is implemented:

- [ ] RLS enabled on all five tables
- [ ] All policies use `auth.jwt()->>'sub' = user_id`
- [ ] No permissive policies for `anon`
- [ ] Manual test: User A creates contact → User B cannot see it
- [ ] Data isolation doc updated: `src/docs/data-isolation-verification.md`
