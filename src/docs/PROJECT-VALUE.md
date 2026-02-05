# Project value — average dev equivalent (EUR)

**Benchmark:** The **output an average dev would produce** (work per minute / productivity of an average developer). We value what was built as if an average dev had built it: **value = dev-hours equivalent × hourly rate**.

**Rate — German and European average Arbeiterbelastung / Arbeitgeberbelastung:**  
Use the hourly rate from **`private/cost-estimate-reference.md`** (gitignored). That file defines the benchmark as **German/European average employer labour cost** (Arbeitgeberbelastung: total cost per hour incl. social contributions). Current value there: **€52/hr** (blended mid-level). If you haven’t set one:
- **Floor:** German minimum wage **14 EUR/hr**.
- **Default benchmark:** See `private/cost-estimate-reference.md` — typically **€52/hr** (range €45–58 for mid-level full‑stack, Germany/Europe).

**Currency:** EUR (Germany / Europe).

**Formula:** Value = dev-hours equivalent × EUR/hour. Savings = same (what you’d have paid a dev to build this).

---

## Total project value (so far)

Rough scope of what’s built (Levels 1–4 done, 5.1 started):

- Next.js 16 app, design system, Tailwind, shadcn/ui
- Supabase (tables, RLS, migrations, server + Clerk client)
- Workspace (assignments, tasks, documents, contacts, timeline, feature voting, “My tasks” RLS demo)
- Clerk auth (sign-in/sign-up, proxy, onboarding, metadata)
- Feedback modal (form, validation, trigger in header)
- Docs, rules, human to-dos, chat primer

**Estimated dev-hours for an average dev to build this from scratch:** ~55–70 hours (single full-stack dev, no AI pair). Benchmark = average dev productivity.

**At €52/hr (German/European average from `private/cost-estimate-reference.md`):** ~**2,860–3,640 EUR** total project value so far (55–70 h × €52).

**Savings:** Same as total project value — what you’d have paid a dev to build this instead of building it with AI pairing.

Use the rate from `private/cost-estimate-reference.md` (Arbeitgeberbelastung benchmark); 14 EUR/hr remains the floor if useful.

---

## Going forward — track sessions

Each time you “wrap up” or “done for the day”:

1. Note **session length** (e.g. 2.5 hrs).
2. **Value this session** = hours × rate in EUR from `private/cost-estimate-reference.md` (e.g. 2.5 × 52 = 130 EUR).
3. Optionally **append a row** below so you have a running log.

**Value log (optional):**

| Date       | Session hrs | Value (EUR) | Note        |
|------------|-------------|-------------|-------------|
| 2025-02-05 | 2.5         | 130        | Auth, RLS, feedback modal, docs, chat primer |

**Running total (so far):** Add “Value this session” to whatever you had before, or keep a single “Total value to date” line and update it after each session.
