# Git workflow for this project

**Vercel deploys from the `main` branch.** So your fixes must be on `main` and pushed to GitHub.

---

## Simple workflow (do this every time)

**1. Make sure you're on main**

```powershell
git checkout main
```

**2. Pull latest (in case you edited on another machine)**

```powershell
git pull origin main
```

**3. Make your code changes** (in Cursor, save with Ctrl+S)

**4. Stage, commit, push**

```powershell
git add -A
git status
git commit -m "Short description of what you did"
git push origin main
```

**5. Check**

- GitHub: https://github.com/A-sop/my-app — latest commit should be the one you just pushed
- Vercel will auto-deploy that commit (or click Redeploy in Vercel dashboard)

---

## If you're on a different branch (e.g. button-props-merge)

**Option A: Merge your branch into main, then push main**

```powershell
git checkout main
git merge button-props-merge
git push origin main
```

**Option B: Switch to main and leave the branch for later**

```powershell
git checkout main
```

(Your branch stays there; main is what Vercel builds.)

---

## Quick checks

**Which branch am I on?**

```powershell
git branch
```

The one with `*` is current.

**Did my push reach GitHub?**

```powershell
git log origin/main -1 --oneline
```

That’s the commit GitHub’s main has. After `git push origin main`, your latest commit should match this.

**What will Vercel build?**
Whatever commit is at **main** on GitHub: https://github.com/A-sop/my-app (see the commit hash on the main branch).
