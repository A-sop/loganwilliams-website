# Contact Network — Phase 1 Checklist

**Phase:** Schema + Core Tables  
**Roadmap:** `src/docs/contact-network-roadmap.md`

---

## Pre-requisites

- [ ] Supabase project linked (or local)
- [ ] Migration workflow: edit `supabase/schemas/` or create manual migration in `supabase/migrations/`
- [ ] See `src/docs/declarative-schema-workflow.md` if using schema files

---

## Schema to Create

### 1. households

- `id` uuid PK
- `user_id` text (Clerk sub; for multi-tenant: company_id)
- `primary_name` text
- `client_number` text (e.g. H-001, Kundennummer)
- `address` text (or street, city, state, zip, country)
- `phone` text, `email` text
- `marital_status` text, `citizenship` text, `visa_status` text
- `arrival_date_germany` date (earliest from Meldebescheinigung)
- `family_members` text (or jsonb)
- `notes` text
- `created_at`, `updated_at` timestamptz

### 2. contacts

- `id` uuid PK
- `household_id` uuid FK nullable (standalone contacts)
- `user_id` text
- `primary_name` text, `first_name` text, `last_name` text
- `date_of_birth` date
- `email` text, `phone` text
- `address` text
- `created_at`, `updated_at` timestamptz

### 3. contact_sources

- `id` uuid PK
- `household_id` uuid FK
- `user_id` text (for RLS; set from household on insert)
- `source_type` text (ZOHO_CRM, PROVISIONSABRECHNUNG, GFP, DVAG, PERSONAL)
- `external_id` text (Zoho Record Id, Kundennummer, etc.)
- `last_synced_at` timestamptz nullable
- `raw_snapshot` jsonb nullable

### 4. commission_records

- `id` uuid PK
- `user_id` text
- `source_type` text (DVAG_PROVISIONSABRECHNUNG, etc.)
- `client_identifier` text (Kundennummer when available)
- `client_name` text
- `amount_eur` decimal(12,2)
- `period_start` date, `period_end` date
- `product_type` text, `contract_ref` text
- `raw_line` jsonb nullable
- `imported_at` timestamptz
- `import_batch_id` uuid nullable

### 5. household_tasks

- `id` uuid PK
- `household_id` uuid FK
- `user_id` text
- `title` text, `description` text
- `due_date` date nullable, `status` text default 'open'
- `source` text (document, voice, slack, manual)
- `linear_issue_id` text, `linear_url` text
- `created_at`, `updated_at` timestamptz

---

## Indexes

- households: `user_id`
- contacts: `household_id`, `user_id`, `date_of_birth`
- contact_sources: `household_id`, `(source_type, external_id)`
- commission_records: `user_id`, `client_identifier`, `amount_eur desc`
- household_tasks: `household_id`, `status`

---

## RLS

Enable RLS on all tables. **Full policies:** see `src/docs/contact-network-security.md`.

**Per table:** SELECT, INSERT, UPDATE, DELETE — all scoped to `user_id = auth.jwt()->>'sub'`.

**Rules:**
- Use `createSupabaseClientForClerk()` for user-scoped operations (never service_role for contact CRUD)
- Server actions: get `userId` from `auth()`; never accept `user_id` from client

---

## Verification

- [ ] Migrations run cleanly (`supabase db push` or equivalent)
- [ ] Tables visible in Supabase Studio
- [ ] No conflicts with existing tables (uploads, task_suggestions, etc.)
