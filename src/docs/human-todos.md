# Human dev to-dos

**Single reference for all human tasks.** Auth (4.5, 4.6), Level 5, and loose ends.

---

## Auth — reference (no checkboxes)

**App:** Main route `/workspace`. Env: `SUPABASE_ANON_KEY` for Clerk+RLS.

**Security model (4.5):** Clerk = who you are (JWT). Supabase RLS = what you can access (rows where `user_id` = JWT `sub`).

**Environments (4.6):** Local → Preview (`auth-flow-*.vercel.app`) → Production (custom domain). Clerk: Development keys for Local+Preview; Production keys + custom domain for Production.

---

## 4.5 — Security verification

- [ ] **Data isolation:** Log in as User A → create items (e.g. “My tasks” on workspace). Log out. Log in as User B → confirm User B does **not** see User A’s data.
- [ ] **Secrets:** Confirm no real keys in committed files; `.env.local` is in `.gitignore`. If you ever committed a key, rotate it and remove from history.

---

## 4.6 — Domain and Clerk Production

- [ ] **Domain:** [vercel.com/domains](https://vercel.com/domains) — purchase or link domain. Vercel project → Settings → Domains → Add → your domain → Production. Wait 2–5 min; https://yourdomain.com loads with SSL.
- [ ] **Clerk Production:** Dashboard → Production env → copy `pk_live_...`, `sk_live_...`. Domains: add `https://yourdomain.com` (do **not** add `.vercel.app` here). Sessions → Customize session token: `{"metadata": "{{user.public_metadata}}"}` → Save.

---

## 4.6 — Vercel environment variables

**Vercel project → Settings → Environment Variables.**

| Variable | Production | Preview / Development |
|----------|------------|------------------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_live_...` | `pk_test_...` |
| `CLERK_SECRET_KEY` | `sk_live_...` | `sk_test_...` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | `/workspace` | `/workspace` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` | `/onboarding` | `/onboarding` |
| `SUPABASE_URL` | same | same |
| `SUPABASE_SERVICE_ROLE_KEY` | same | same |
| `SUPABASE_ANON_KEY` | same | same |

- [ ] Add each; Clerk keys differ by environment as above. Secret keys show as “Encrypted”.

---

## 4.6 — Pre-production checklist

- [ ] Auth works locally (signup, login, logout, onboarding).
- [ ] Data isolation done (§4.5).
- [ ] Clerk: custom domain + preview (`*.vercel.app`) + localhost allowed; redirect URLs updated.
- [ ] Vercel env set (§ above).
- [ ] RLS migration applied if using “My tasks”: run `supabase db push` or apply `supabase/migrations/20260205120000_clerk_tasks_rls.sql` in Supabase.

---

## 4.6 — Test preview deployment

- [ ] Vercel → deployment for branch **auth-flow** → copy preview URL.
- [ ] Signup → onboarding → `/workspace`; create data (e.g. “My tasks”); log out, log in → skip onboarding, data still there.
- [ ] Incognito → `/workspace` → redirect to sign-in → sign in → land on `/workspace`.
- [ ] Mobile (or DevTools): signup/login.
- [ ] Error states: invalid email, weak password, wrong password show messages.

---

## 4.6 — PR and merge

- [ ] GitHub → Compare & pull request: base **main**, compare **auth-flow**. Title: `feat(auth): implement authentication with Clerk and Supabase`. Description: auth summary, preview URL, link to PRD. Confirm no `.env.local` or secrets in Files changed.
- [ ] Pre-merge: preview tested, data isolation verified, mobile ok, no console errors, env and Clerk domains set, no sensitive data committed.
- [ ] Merge **auth-flow** → **main**. Optionally delete remote `auth-flow` after merge.

---

## 4.6 — Verify production

- [ ] Vercel → latest **main** deployment → “Ready”. Open production domain → sign up (real test account) → onboarding → create data → log out, log in → data persists. Check Clerk/Supabase dashboards for errors.

---

## 4.6 — Cleanup and PRD

- [ ] Local: `git checkout main && git pull origin main && git branch -d auth-flow`.
- [ ] **PRD:** Open `src/docs/auth-flow/auth-flow-prd.md`. Status → “Shipped to Production”; add production URL and ship date; mark stages 1–7 complete.

---

## Auth — loose ends (optional)

- [ ] **Clerk + Supabase (for RLS):** Clerk Dashboard → Integrations → Supabase → Activate. Supabase Dashboard → Authentication → Add provider → Clerk → paste Clerk domain. Only needed if you use “My tasks” or other RLS tables.
- [ ] **RLS “My tasks”:** If you use the Supabase “My tasks” card, apply migration `20260205120000_clerk_tasks_rls.sql` (see Pre-production checklist).
- [ ] **Onboarding loop:** We added a 300ms delay after JWT refresh; if you still see redirect loops, revisit (PRD known issues).
- [ ] **Linear:** If you use Linear, update sprint/board when auth is shipped (PRD Stage 7).

---

## 5.1 — User Feedback (feedback modal)

**Done by agent:** Branch `user-feedback`; `src/components/feedback-modal.tsx` (Dialog, react-hook-form + zod, success + auto-close); `src/lib/schemas/feedback.ts`; layout has provider + “Give Feedback” in header; `react-hook-form`, `@hookform/resolvers` installed.

- [ ] **Test feedback modal:** Open app → click “Give Feedback” → modal opens. Submit empty → validation blocks. Fill description, submit → check browser console for `[Feedback] { description: "..." }`. Success message appears, modal closes after 2s.
- [ ] **Optional:** Move “Give Feedback” to a footer if you add one (use `<FeedbackModalTrigger />` there; provider stays in layout).

**Next (5.2):** Connect form to n8n (webhook, AI, notifications, storage).
