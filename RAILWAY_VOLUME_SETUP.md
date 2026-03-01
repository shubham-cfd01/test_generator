# Keep User Data Across Deployments (Railway)

By default, user data is stored in SQLite on the container filesystem. **Each redeploy creates a new container and wipes this data.**

To persist users across deployments:

## 1. Add a Volume

1. In Railway → your **test_generator** service → **Settings**
2. Scroll to **Volumes**
3. Click **+ Add Volume**
4. Set **Mount Path** to: `/data`
5. Click **Add**

## 2. Set Environment Variable

1. Go to **Variables** tab
2. Add: `DATABASE_PATH` = `/data/users.db`
3. Save

## 3. Redeploy

Run `railway up` or push to GitHub. User data will now persist across deployments.
