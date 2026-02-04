# Authentication & Onboarding PRD

## Status

Ready for Implementation

## Objective

Implement secure, user-friendly authentication with Clerk and Supabase, focusing on email/password login with a 3-screen onboarding experience for new users. Main app route: `/workspace`.

## Scope

**In Scope:**
- User signup with Clerk (email/password only)
- User login with Clerk (email/password only)
- Clerk + Supabase integration (native integration enabled in Clerk dashboard)
- Protected routes and middleware
- 3-screen skippable onboarding (custom pages, not Clerk's built-in onboarding UI)
- Custom redirects after auth actions
- Row-level security (RLS) policies for user data isolation
- Responsive auth UI matching our design system

**Out of Scope (Future Considerations):**
- Social login (Google, GitHub, etc.)
- Password reset flow (uses Clerk defaults initially)
- Email verification (uses Clerk defaults)
- Multi-factor authentication (MFA)
- User profile editing pages
- Advanced onboarding with custom fields
- Webhooks for data synchronization

## User Stories

1. As a new user, I want to sign up with email/password so I can start using the app
2. As a returning user, I want to log in quickly and go straight to my content
3. As a new user, I want to see a brief onboarding that explains the app's value
4. As any user, I want my data to be secure and isolated from other users
5. As a mobile user, I want auth flows to work smoothly on my device

## Acceptance Criteria

- [ ] Clerk project created with Supabase integration enabled in dashboard
- [ ] Signup page created at /sign-up with Clerk `<SignUp />` component
- [ ] Login page created at /sign-in with Clerk `<SignIn />` component
- [ ] Email/password authentication configured (no social providers)
- [ ] Middleware protects `/workspace` and nested routes
- [ ] First-time users see 3-screen onboarding after signup
- [ ] Returning users skip onboarding automatically
- [ ] Onboarding is skippable at any point
- [ ] Users redirect to correct pages after auth actions
- [ ] RLS policies prevent users from seeing each other's data
- [ ] Auth flows work on mobile and desktop
- [ ] Loading states show during auth operations
- [ ] Error messages are clear and actionable
- [ ] Auth pages match our design system

## Implementation Plan

### Stage 1: Clerk + Supabase Setup

**User actions (manual steps):**
- [ ] Go to [Clerk Dashboard](https://dashboard.clerk.com/) → Navigate to Integrations → Select Supabase
- [ ] Follow Clerk's setup wizard to connect your Supabase project
- [ ] Keep the Clerk dashboard tab open — you'll need API keys

**Configure Session Token (Critical for Onboarding):**
Before building anything, configure the session token in Clerk Dashboard:
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Navigate to: **Sessions** → **Customize session token**
3. Add this custom claim in the JSON editor:
```json
{
  "role": "authenticated",
  "metadata": "{{user.public_metadata}}"
}
```
4. Click **Save**

**Why:** Middleware checks the JWT session token. Without this, `publicMetadata` won't be in the JWT, and the onboarding status check will fail (infinite redirect loops).

**AI agent actions:**
- [ ] Install `@clerk/nextjs` package
- [ ] Ensure `@supabase/supabase-js` is installed (already present)
- [ ] Wrap the app with ClerkProvider in the root layout

**Environment variables:**
From Clerk Dashboard (Settings → API Keys):
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Publishable key
- `CLERK_SECRET_KEY` — Secret key

Redirect URLs:
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up`
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/workspace`
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/onboarding`

**Note:** Use `_FALLBACK_REDIRECT_URL` naming (not deprecated `_AFTER_`).

- [ ] Test that Clerk is connected (visit the app and see auth state)

### Stage 2: Auth Pages and User Button

**Create Authentication Pages:**
- [ ] Create `app/(auth)/sign-up/[[...sign-up]]/page.tsx`
- [ ] Add Clerk `<SignUp />` with `routing="path"` and `path="/sign-up"`
- [ ] Style signup page to match design system (Clerk appearance prop or CSS)
- [ ] Create `app/(auth)/sign-in/[[...sign-in]]/page.tsx`
- [ ] Add Clerk `<SignIn />` with `routing="path"` and `path="/sign-in"`
- [ ] Style login page to match design system
- [ ] Configure custom redirects in both components
- [ ] Test signup flow: create account → redirects to onboarding
- [ ] Test login flow: sign in → redirects to workspace

**Add User Button to Header:**
- [ ] Locate or create header component (e.g. in layout or a shared header)
- [ ] Import UserButton, SignedIn, SignedOut from `@clerk/nextjs`
- [ ] Add UserButton inside `<SignedIn>` in top-right of header
- [ ] Add SignInButton inside `<SignedOut>` for unauthenticated users
- [ ] Style per design system
- [ ] Test: Sign in → UserButton appears; click → Manage account / Sign out

### Stage 3: Protected Routes and Middleware

**Protected route:** `/workspace` (and nested paths like `/workspace/*`)

**AI agent actions:**
- [ ] Create `src/middleware.ts` (NOT project root)
- [ ] Import `clerkMiddleware`, `createRouteMatcher` from `@clerk/nextjs/server`
- [ ] Import `NextResponse` from `next/server`
- [ ] Define protected routes: `createRouteMatcher(["/workspace(.*)"])`
- [ ] Implement middleware with explicit userId check and manual redirect:
```ts
export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  if (!userId && isProtectedRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }
  return NextResponse.next();
});
```
- [ ] Add config matcher for Next.js internals, static files, API routes
- [ ] After creating middleware: delete `.next` cache, restart dev server
- [ ] Test: Visit /workspace signed out → redirect to /sign-in?redirect_url=...
- [ ] Test: Sign in → visit /workspace → loads; redirect-back works

**Critical:** Middleware MUST be in `src/middleware.ts`. Use explicit userId check with manual redirect, not `auth.protect()` alone.

### Stage 4: 3-Screen Onboarding

**Metadata:** Store `onboardingComplete` in `publicMetadata` (NOT `unsafeMetadata` — it won't be in JWT).

**AI agent actions:**

**1. Create Onboarding Layout & Page:**
- [ ] Create `app/(auth)/onboarding/layout.tsx` (server component)
- [ ] Use `auth()` from `@clerk/nextjs/server` to get userId and sessionClaims
- [ ] If not authenticated → redirect to /sign-in
- [ ] If `sessionClaims?.metadata?.onboardingComplete === true` → redirect to /workspace
- [ ] Create `app/(auth)/onboarding/page.tsx` (client component)

**2. Build 3-Screen Component:**
- **Screen 1:** "Welcome to [App Name]"; subheading about trackable actions; progress 1 of 3; Next, Skip
- **Screen 2:** "Stay in control with the approval layer"; benefits; progress 2 of 3; Next, Back, Skip
- **Screen 3:** "Ready to get started?"; progress 3 of 3; Get Started, Back, Skip

**3. Server Action for Metadata:**
- [ ] Create `app/(auth)/onboarding/actions.ts` with `"use server"`
- [ ] `completeOnboarding()`: gets userId from auth(), calls `clerkClient().users.updateUser(userId, { publicMetadata: { onboardingComplete: true } })`
- [ ] Returns `{ success: true }` or `{ error: "message" }`; do NOT call redirect() in server action

**4. Client Completion Logic (JWT Refresh Pattern):**
```ts
const { getToken } = useAuth();
const handleComplete = async () => {
  setIsCompleting(true);
  const result = await completeOnboarding();
  if (result?.error) { toast.error(result.error); setIsCompleting(false); return; }
  await getToken({ skipCache: true });  // CRITICAL: refresh JWT
  window.location.href = "/workspace";   // Hard redirect, NOT router.push()
};
```

**5. Update Middleware for Onboarding:**
- [ ] If user authenticated but `!onboardingComplete` and accessing protected route → redirect to /onboarding
- [ ] Exception: allow access to /onboarding page
- [ ] Read from `sessionClaims?.metadata?.onboardingComplete`

**6. Style:** Match design system; mobile responsive; smooth transitions (Framer Motion optional)

**7. Test:** New user → onboarding → Get Started; Skip; Returning user skips; Back navigation

### Stage 5: Database Setup and RLS

**Reference:** [Clerk + Supabase Integration](https://clerk.com/docs/guides/development/integrations/databases/supabase)

**Supabase setup (manual):**
- [ ] Clerk Dashboard → [Supabase integration](https://dashboard.clerk.com/setup/supabase) → Activate
- [ ] Supabase Dashboard → Authentication → Sign In / Up → Add provider → Clerk
- [ ] Paste Clerk domain

**AI agent actions:**
- [ ] Create table with `user_id text not null default auth.jwt()->>'sub'`
- [ ] Enable RLS on table
- [ ] Create policies: SELECT and INSERT restricted to own user_id
- [ ] Create Supabase client helper that passes Clerk session token (see Clerk docs)
- [ ] Test: User A creates record → User B cannot see it; unauthenticated denied

**Note:** No webhooks needed for basic auth + data isolation. Webhooks only needed for syncing profile data.

### Stage 6: Testing and Polish

- [ ] Test new user: signup → onboarding → workspace
- [ ] Test returning user: login → workspace (skip onboarding)
- [ ] Test error states: invalid email, weak password, email exists, wrong password
- [ ] Test mobile responsive
- [ ] Verify redirect_url works after login
- [ ] Use Chrome DevTools MCP for visual verification if available

### Stage 7: Documentation and Commit

- [ ] Update this PRD with ✅ for completed stages
- [ ] Document environment variables in .env.example
- [ ] Commit: `feat(auth): implement clerk authentication with supabase integration`
- [ ] Update Linear sprint board

## Technical References

- [Clerk + Supabase Integration](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Clerk Next.js Setup](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Add Onboarding Flow](https://clerk.com/docs/guides/development/add-onboarding-flow)
- [Clerk Redirects](https://clerk.com/docs/guides/custom-redirects)
- [Clerk Appearance](https://clerk.com/docs/customization/overview)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

## Key Technical Notes

**Middleware:** In `src/middleware.ts`. Use `createRouteMatcher` for protected routes. Explicit userId check + manual redirect. Clear `.next` and restart after changes.

**Session Token:** Configure custom claim `{"metadata": "{{user.public_metadata}}"}`. Middleware reads `sessionClaims.metadata.onboardingComplete`.

**Onboarding:** Store in `publicMetadata`. After update, call `getToken({ skipCache: true })`, then `window.location.href = "/workspace"`.

**Supabase:** RLS uses `auth.jwt()->>'sub'` for user_id. Create Clerk Supabase client helper per docs.

**Routes:** Sign-in fallback = `/workspace`. Sign-up fallback = `/onboarding`. Protected = `/workspace(.*)`.
