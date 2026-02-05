# Prompt for next chat

Copy this into a new Composer or Chat to continue:

---

**Context:** I'm building a Next.js app (`my-app`) following PirateSkills Lesson 4.4 (Auth & Onboarding). We use Clerk + Supabase.

**What's done:** Stages 1–4 complete. Clerk auth, sign-in/sign-up pages, 3-screen onboarding at `/onboarding`, proxy for route protection. `auth-flow` branch has latest work.

**Known issue:** After completing onboarding (Get Started/Skip), user can loop between `/onboarding` and `/workspace`. Likely JWT/metadata timing. Tracked in `src/docs/auth-flow/auth-flow-prd.md` and `src/docs/agent-whats-next.md`.

**Next up:** Stage 5 — Database Setup and RLS (Clerk + Supabase integration, user_id, RLS policies, Supabase client with Clerk token). See `src/docs/auth-flow/auth-flow-prd.md` for full plan.

**Key docs:**
- `src/docs/auth-flow/auth-flow-prd.md` — Implementation plan
- `src/docs/agent-whats-next.md` — Open tasks and current focus
- `GIT-WORKFLOW.md` — PRs, commits, Linear

**Branch:** `auth-flow` (push when ready, then open PR to main)

---
