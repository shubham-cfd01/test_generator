# Railway + GitHub Auto-Deploy Setup

## Goal
Push to GitHub → Railway deploys automatically (no `railway up` needed).

## One-Time Setup (Do This Once)

### 1. Open Railway Service Settings
- Go to: https://railway.com/project/24e79ecd-04ce-4647-9ad0-fd107500619d
- Click your **test_generator** service
- Go to **Settings** tab

### 2. Connect GitHub Repo
- Find **Source** or **Connect Repo** section
- Click **Connect Repo** (or **Connect GitHub**)
- If prompted, authorize Railway to access your GitHub
- Select: **shubham-cfd01/test_generator**
- Select branch: **master** (or `main` if you use that)

### 3. Set Root Directory (if needed)
- If your app is in a subfolder, set **Root Directory** to that folder
- For this project: root is the repo root (no subfolder needed)

### 4. Save
- Railway will now deploy on every push to the connected branch

## After Setup
- `git push origin master` → Railway auto-deploys
- No need to run `railway up` manually

## If Repo Is Already Connected
- Check **Settings** → **Source** → ensure branch is **master**
- Redeploy: Railway dashboard → Deployments → Redeploy
