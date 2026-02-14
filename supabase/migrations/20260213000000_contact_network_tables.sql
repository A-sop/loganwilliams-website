-- Contact Network — Phase 1 schema
-- Source: src/docs/contact-network-roadmap.md, contact-network-phase1-checklist.md
-- Security: contact-network-security.md — RLS on all tables

-- 1. households
create table if not exists "public"."households" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" text not null,
  "primary_name" text,
  "client_number" text,
  "address" text,
  "phone" text,
  "email" text,
  "marital_status" text,
  "citizenship" text,
  "visa_status" text,
  "arrival_date_germany" date,
  "family_members" text,
  "notes" text,
  "profile_image_path" text,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

create index if not exists "idx_households_user_id" on "public"."households" ("user_id");

alter table "public"."households" enable row level security;

create policy "User can view own households"
  on "public"."households" for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own households"
  on "public"."households" for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own households"
  on "public"."households" for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own households"
  on "public"."households" for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create trigger update_households_updated_at
  before update on "public"."households"
  for each row execute function update_updated_at_column();

-- 2. contacts
create table if not exists "public"."contacts" (
  "id" uuid primary key default gen_random_uuid(),
  "household_id" uuid references "public"."households" ("id") on delete set null,
  "user_id" text not null,
  "primary_name" text,
  "first_name" text,
  "last_name" text,
  "date_of_birth" date,
  "email" text,
  "phone" text,
  "address" text,
  "profile_image_path" text,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

create index if not exists "idx_contacts_household_id" on "public"."contacts" ("household_id");
create index if not exists "idx_contacts_user_id" on "public"."contacts" ("user_id");
create index if not exists "idx_contacts_date_of_birth" on "public"."contacts" ("date_of_birth");

alter table "public"."contacts" enable row level security;

create policy "User can view own contacts"
  on "public"."contacts" for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own contacts"
  on "public"."contacts" for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own contacts"
  on "public"."contacts" for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own contacts"
  on "public"."contacts" for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create trigger update_contacts_updated_at
  before update on "public"."contacts"
  for each row execute function update_updated_at_column();

-- 3. contact_roles (multi-hat: DVAG_CLIENT, FRIEND, SUPPLIER, OTHER_PROJECT_CLIENT)
create table if not exists "public"."contact_roles" (
  "id" uuid primary key default gen_random_uuid(),
  "household_id" uuid not null references "public"."households" ("id") on delete cascade,
  "user_id" text not null,
  "role_type" text not null,
  "project_ref" text,
  "created_at" timestamptz not null default now(),
  unique ("household_id", "role_type")
);

create index if not exists "idx_contact_roles_household_id" on "public"."contact_roles" ("household_id");
create index if not exists "idx_contact_roles_user_id" on "public"."contact_roles" ("user_id");
create index if not exists "idx_contact_roles_role_type" on "public"."contact_roles" ("role_type");

alter table "public"."contact_roles" enable row level security;

create policy "User can view own contact_roles"
  on "public"."contact_roles" for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own contact_roles"
  on "public"."contact_roles" for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own contact_roles"
  on "public"."contact_roles" for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own contact_roles"
  on "public"."contact_roles" for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

-- 4. contact_sources
create table if not exists "public"."contact_sources" (
  "id" uuid primary key default gen_random_uuid(),
  "household_id" uuid not null references "public"."households" ("id") on delete cascade,
  "user_id" text not null,
  "source_type" text not null,
  "external_id" text,
  "last_synced_at" timestamptz,
  "raw_snapshot" jsonb,
  "created_at" timestamptz not null default now()
);

create index if not exists "idx_contact_sources_household_id" on "public"."contact_sources" ("household_id");
create index if not exists "idx_contact_sources_user_id" on "public"."contact_sources" ("user_id");
create index if not exists "idx_contact_sources_source_external" on "public"."contact_sources" ("source_type", "external_id");

alter table "public"."contact_sources" enable row level security;

create policy "User can view own contact_sources"
  on "public"."contact_sources" for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own contact_sources"
  on "public"."contact_sources" for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own contact_sources"
  on "public"."contact_sources" for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own contact_sources"
  on "public"."contact_sources" for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

-- 5. commission_records
create table if not exists "public"."commission_records" (
  "id" uuid primary key default gen_random_uuid(),
  "user_id" text not null,
  "source_type" text not null,
  "client_identifier" text,
  "client_name" text,
  "amount_eur" decimal(12,2) not null,
  "period_start" date,
  "period_end" date,
  "product_type" text,
  "contract_ref" text,
  "raw_line" jsonb,
  "imported_at" timestamptz not null default now(),
  "import_batch_id" uuid
);

create index if not exists "idx_commission_records_user_id" on "public"."commission_records" ("user_id");
create index if not exists "idx_commission_records_client" on "public"."commission_records" ("client_identifier");
create index if not exists "idx_commission_records_amount" on "public"."commission_records" ("amount_eur" desc);

alter table "public"."commission_records" enable row level security;

create policy "User can view own commission_records"
  on "public"."commission_records" for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own commission_records"
  on "public"."commission_records" for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own commission_records"
  on "public"."commission_records" for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own commission_records"
  on "public"."commission_records" for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

-- 6. household_tasks
create table if not exists "public"."household_tasks" (
  "id" uuid primary key default gen_random_uuid(),
  "household_id" uuid not null references "public"."households" ("id") on delete cascade,
  "user_id" text not null,
  "title" text not null,
  "description" text,
  "due_date" date,
  "status" text not null default 'open',
  "source" text,
  "linear_issue_id" text,
  "linear_url" text,
  "created_at" timestamptz not null default now(),
  "updated_at" timestamptz not null default now()
);

create index if not exists "idx_household_tasks_household_id" on "public"."household_tasks" ("household_id");
create index if not exists "idx_household_tasks_user_id" on "public"."household_tasks" ("user_id");
create index if not exists "idx_household_tasks_status" on "public"."household_tasks" ("household_id", "status");

alter table "public"."household_tasks" enable row level security;

create policy "User can view own household_tasks"
  on "public"."household_tasks" for select to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can insert own household_tasks"
  on "public"."household_tasks" for insert to authenticated
  with check (user_id = (select auth.jwt()->>'sub'));

create policy "User can update own household_tasks"
  on "public"."household_tasks" for update to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create policy "User can delete own household_tasks"
  on "public"."household_tasks" for delete to authenticated
  using (user_id = (select auth.jwt()->>'sub'));

create trigger update_household_tasks_updated_at
  before update on "public"."household_tasks"
  for each row execute function update_updated_at_column();
