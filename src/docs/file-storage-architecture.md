# File Storage Architecture (C:\DATA)

**Purpose:** Single authoritative root for all important files. Local-first, OneDrive as mirror only.  
**Source:** Designed with user for minimal cognitive overhead, no recursion, works even if OneDrive dies.

---

## 1. Authoritative Root

```
C:\DATA
```

Everything important lives under `C:\DATA`. Not Desktop, not Documents, not directly inside OneDrive.

---

## 2. Top-Level Structure

```
C:\DATA
│
├── 00_INBOX          # Temp, downloads, unsorted — nothing lives here permanently
├── 10_WORK           # Active client work, revenue-generating
├── 20_ADMIN          # Taxes, insurance, legal, IDs — life infrastructure
├── 30_PROJECTS       # Courses, experiments, finite things
├── 40_MEDIA           # Video, photos, audio, heavy files
└── 90_ARCHIVE        # Cold storage — old work, closed years
```

Numbering prevents reshuffling. Spacing allows growth.

---

## 3. Contact Network App Paths

| Use Case | Path |
|----------|------|
| Client documents (passports, licenses, bank) | `C:\DATA\10_WORK\{ClientName}\` |
| CPA / direct debit templates | `C:\DATA\10_WORK\Templates\` |
| Personal data (your own) | `C:\DATA\20_ADMIN\Personal\` — never mixed with client |
| Inbox before classification | `C:\DATA\00_INBOX` |
| Closed clients | `C:\DATA\90_ARCHIVE\Clients\` |

**Rule:** Personal data stays in `20_ADMIN\Personal\`. Client data stays in `10_WORK\`.

---

## 4. App Configuration

| Env var | Purpose | Example |
|---------|---------|---------|
| `DATA_ROOT` | Base path for all data | `C:\DATA` |
| `CLIENT_DOCUMENTS_PATH` | Client work base (documents, scans) | `C:\DATA\10_WORK` |

The app stores relative paths in the database (e.g. `10_WORK/Schmidt_Maria/passport_2024.pdf`). Full path = `DATA_ROOT` + stored path, or `CLIENT_DOCUMENTS_PATH` + `{ClientName}/filename`.

---

## 5. OneDrive (Mirror Only)

OneDrive syncs `C:\DATA` only. It must NOT redirect Desktop, Documents, or Pictures.

- Backup → OFF for Desktop, Documents, Pictures
- OneDrive mirrors `C:\DATA`
- If OneDrive fails, `C:\DATA` and local backup still work

---

## 6. External Backup (8TB)

```
D:\BACKUPS\
├── DATA_MIRROR      # Robocopy of C:\DATA
└── SNAPSHOTS        # Optional point-in-time
```

**Robocopy command:**
```cmd
robocopy C:\DATA D:\BACKUPS\DATA_MIRROR /MIR /COPY:DAT /R:1 /W:1
```

---

## 7. Rules (No Recursion)

1. No cloud folder may contain another cloud folder
2. Desktop is not storage — only shortcuts or temp
3. Only one authoritative root: `C:\DATA`
4. External drives are mirrors only — never edited directly
5. Business OneDrive isolated — never mixed with personal

---

## 8. Keys Per Deployment

Each deployment (this repo, my-app, GFP) has its own env vars. Keys live in that project's `.env.local` and Vercel env vars. Never share keys across deployments.

---

## 9. Related Docs

- **Contact network:** `src/docs/contact-network-roadmap.md`
- **Phase 1 checklist:** `src/docs/contact-network-phase1-checklist.md`
- **Security:** `src/docs/contact-network-security.md`
