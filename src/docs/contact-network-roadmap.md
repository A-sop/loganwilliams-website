# Contact Network — Roadmap & Implementation Plan

**Purpose:** Single source of truth for contacts and clients across Zoho CRM, Provisionsabrechnung (DVAG), and future sources. Whittle down unnecessary contacts, track DVAG and project tasks, build a clean business network.

**Scale:** Personal use first → later extend to colleague and his business's employees.

---

## 1. Goals

| Goal | Description |
|------|-------------|
| **Whittle down** | Consolidate contacts from all sources; deduplicate; identify and archive low-value/inactive contacts |
| **Track tasks** | DVAG tasks and new projects in one place; link tasks to households/clients |
| **One network** | Single source of truth for business contacts going forward |
| **Reuse** | Same system for colleague and his team (multi-tenant later) |

---

## 2. Full Scope (Not All at Once)

### Contact & CRM

- Zoho CRM import (Accounts → households, Contacts → contacts)
- Provisionsabrechnung import (commission data, client value)
- Matching by **name + DOB** (Kundennummer often absent for leads, closed-lost)
- Source labels: GFP, DVAG, Personal, ZOHO_CRM
- Outlook: low priority (DVAG cloud, phasing out)
- Google Contacts: optional (Android sync; cleaned → Zoho Mail)

### Value & Commission

- Commission records from Provisionsabrechnung
- "Most valuable client" analytics
- Product mix, tenure, trends per client

### Documents

- Document intake (PDF, images) → extract send date, organisation, receiver, task
- File renaming from extracted data
- **Meldebescheinigung** upload → extract earliest date = arrival in Germany
- Zip backup upload

### Tasks

- Tasks linked to households/clients
- Linear sync: create issues for client tasks
- Open tasks shown under household/client

### Channels (Later)

- Slack: document forwarding, voice messages
- Voice → transcribe (Whisper) → interpret → task or info update → route to user

---

## 3. Phased Implementation Plan

### Phase 1: Schema + Core Tables ✅

**Deliverable:** Supabase migrations for households, contacts, contact_roles, contact_sources, commission_records, household_tasks.

**Tables:**

- `households` — canonical client/household; `profile_image_path` for copied images
- `contacts` — people; linked to household; `profile_image_path` for copied images
- `contact_roles` — multi-hat roles (DVAG_CLIENT, FRIEND, SUPPLIER, OTHER_PROJECT_CLIENT)
- `contact_sources` — provenance (source_type, external_id per source)
- `commission_records` — Provisionsabrechnung rows
- `household_tasks` — tasks linked to household + Linear

**Migration:** `supabase/migrations/20260213000000_contact_network_tables.sql`

**Session prompt:** "Implement Phase 1: create schema migrations for contact network (households, contacts, contact_roles, contact_sources, commission_records, household_tasks)."

---

### Phase 2: Zoho Import Script

**Deliverable:** Script(s) to import Zoho Accounts + Contacts from `src/data/zoho-backup/`.

**Source:** `src/data/zoho-backup/Data/Accounts_001.csv`, `Contacts_001.csv`

**RecordImages (profile photos):**

- Source: `src/data/zoho-backup/RecordImages/` (hash-style filenames, e.g. `a2egi33d9d5fdf5ba48b9ab348eef96cd5dfb.png`)
- Contacts CSV: `Contact Image` column has filename; Accounts: `Account Image`
- **Behavior:** Copy (do not rename originals) to human-readable path under `CLIENT_DOCUMENTS_PATH` or app storage; store path in `profile_image_path` on `households`/`contacts`
- Filename length does not affect load time; optimize via resize/compress if needed later

**Mappings:**

- Accounts: Record Id → external_id, Account Name → primary_name
- Contacts: Record Id → external_id, Full Name → primary_name, Account Name.id → household_id, Date of Birth

**Session prompt:** "Implement Phase 2: Zoho import script for Accounts and Contacts from zoho-backup. Map to households and contacts. Copy RecordImages to human-readable paths and set profile_image_path."

---

### Phase 3: Contact Dashboard UI

**Deliverable:** Dashboard page showing contact list with value, last contact date, source badge.

**Columns:** Name, Value (sum commission), Last contact date, Source

**Route:** e.g. `/workspace/contacts` or `/contacts`

**Session prompt:** "Implement Phase 3: contact dashboard with value, last contact date, source. Sortable list."

---

### Phase 4: Contact Dossier (Detail Page)

**Deliverable:** Detail page per contact with personal info section.

**Fields:**

- Address
- Family members
- Marital status
- Citizenship
- Visa status
- Date of birth
- Time since arrival in Germany (from `arrival_date_germany`)
- Phone, email, notes
- Commission summary
- Open tasks

**Route:** e.g. `/contacts/[id]`

**Session prompt:** "Implement Phase 4: contact dossier page with personal info, address, family, marital status, citizenship, visa, arrival date, commission summary."

---

### Phase 5: Provisionsabrechnung Import

**Deliverable:** Parser for DVAG Provisionsabrechnung CSV; insert into `commission_records`.

**Column mapping (from user-provided headers):**

| Source | Canonical |
|--------|-----------|
| Kundennummer | client_identifier |
| Kundenname | client_name |
| Nettobetrag | amount_eur |
| Monat | period_start/end |
| Produktschlüssel | product_type |
| Vertragsnummer | contract_ref |

**Session prompt:** "Implement Phase 5: Provisionsabrechnung parser and import into commission_records."

---

### Phase 6: Matching (Name + DOB)

**Deliverable:** Deduplication and linking of Provisionsabrechnung rows to households via name + DOB.

**Logic:**

- Normalize name (trim, collapse spaces)
- Match: primary_name + date_of_birth
- Fallback: email, name + phone
- Store match or flag for manual review

**Session prompt:** "Implement Phase 6: matching logic for Provisionsabrechnung to households by name + DOB."

---

### Phase 7: Meldebescheinigung Upload & Extraction

**Deliverable:** Upload PDF/image of Meldebescheinigung; extract dates; set earliest = arrival_date_germany.

**Flow:** Upload → OCR/vision extract dates → parse DD.MM.YYYY → min date → update contact.

**Session prompt:** "Implement Phase 7: Meldebescheinigung upload, date extraction, arrival_date_germany update."

---

### Phase 8: Tasks + Linear Sync

**Deliverable:** household_tasks linked to households; create Linear issues for client tasks; show open tasks on dossier.

**Session prompt:** "Implement Phase 8: household_tasks, Linear issue creation for client tasks, open tasks on dossier."

---

### Phase 9+: Slack, Voice, etc.

Defer until core is stable.

---

## 4. Schema Outline

### households

- id, user_id (or company_id for multi-tenant)
- primary_name, client_number
- address, phone, email
- marital_status, citizenship, visa_status, arrival_date_germany
- family_members (text or JSON)
- profile_image_path — path to copied profile image (from RecordImages)
- created_at, updated_at

### contacts

- id, household_id (nullable for standalone)
- primary_name, first_name, last_name
- date_of_birth, email, phone
- address
- profile_image_path — path to copied profile image (from RecordImages)
- created_at, updated_at

### contact_roles (multi-hat)

- id, household_id, user_id
- role_type: DVAG_CLIENT | FRIEND | SUPPLIER | OTHER_PROJECT_CLIENT
- project_ref (optional)
- unique(household_id, role_type)

### contact_sources

- id, household_id, user_id (for RLS)
- source_type, external_id
- last_synced_at, raw_snapshot (optional)

### commission_records

- id, user_id, source_type
- client_identifier, client_name
- amount_eur, period_start, period_end, product_type
- contract_ref, raw_line (jsonb), imported_at

### household_tasks

- id, household_id, user_id
- title, description, due_date, status
- source, linear_issue_id, linear_url
- created_at, updated_at

---

## 5. Source Mappings

### Zoho CRM

**Accounts:**

- Record Id → external_id
- Account Name → primary_name
- Phone, Website, Billing* → address/contact

**Contacts:**

- Record Id → external_id
- Full Name → primary_name (First + Last fallback)
- Account Name.id → household_id
- Date of Birth → date_of_birth
- Email, Mobile, Mailing* → contact/address

### DVAG Provisionsabrechnung

- Kundennummer → client_identifier
- Kundenname → client_name
- Nettobetrag → amount_eur
- Monat, Buch.-datum, Fällig von/bis → period
- Produktschlüssel → product_type

---

## 6. Session Prompts (Copy-Paste)

| Phase | Prompt |
|-------|--------|
| 1 | "Implement Phase 1 from contact-network-roadmap: schema migrations for households, contacts, contact_sources, commission_records, household_tasks." |
| 2 | "Implement Phase 2: Zoho import script for Accounts and Contacts." |
| 3 | "Implement Phase 3: contact dashboard with value, last contact, source." |
| 4 | "Implement Phase 4: contact dossier page with full personal info." |
| 5 | "Implement Phase 5: Provisionsabrechnung parser and import." |
| 6 | "Implement Phase 6: name + DOB matching for commission records to households." |
| 7 | "Implement Phase 7: Meldebescheinigung upload and arrival date extraction." |
| 8 | "Implement Phase 8: household_tasks and Linear sync." |

---

## 7. Security

Contact data is sensitive (names, DOB, address, commission amounts). All tables use RLS:

- `user_id` on every table
- Policies: `auth.jwt()->>'sub' = user_id` for SELECT, INSERT, UPDATE, DELETE
- Use `createSupabaseClientForClerk()` for user-scoped queries; never accept `user_id` from client

**Full spec:** `src/docs/contact-network-security.md`

---

## 8. Key Docs

- **This file:** `src/docs/contact-network-roadmap.md`
- **Phase 1 checklist:** `src/docs/contact-network-phase1-checklist.md`
- **Security:** `src/docs/contact-network-security.md`
- **File storage:** `src/docs/file-storage-architecture.md`
- **Zoho backup:** `src/data/zoho-backup/` (exclude RecordImages from git if large)
- **Document intake schema:** `src/docs/document-intake-schema.md`
- **Workspace PRD:** `src/docs/workspace-prd.md`
- **Data isolation verification:** `src/docs/data-isolation-verification.md`
