# Personal Portal

Phase 1 skeleton for a single-user life portal. It includes password auth, a SQLite schema, a protected placeholder home page, and an unauthenticated health check.

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local env file:

```bash
cp .env.example .env.local
```

Generate an auth password hash:

```bash
node -e "const crypto=require('crypto'); const password=process.argv[1]; const salt=crypto.randomBytes(16).toString('base64url'); const iterations=310000; const hash=crypto.pbkdf2Sync(password,salt,iterations,32,'sha256').toString('base64url'); console.log(`pbkdf2:${iterations}:${salt}:${hash}`)" "your-password"
```

Generate a session secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Set these values in `.env.local`:

```bash
DB_PATH=./data/portal.db
AUTH_PASSWORD_HASH=pbkdf2:310000:...
SESSION_SECRET=...
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`. Visiting `/` while logged out redirects to `/login`. `/api/health` is public and checks `SELECT 1`.

## Database

The database file defaults to `./data/portal.db`. The schema initializes automatically on first DB connection and creates:

- `entries`
- `entries_fts`
- `mood_entries`
- `finance_entries`

Local database files under `data/*.db` are ignored by git.

## Fly.io Deployment

This project uses a Dockerfile because `better-sqlite3` has native bindings and should be built in a Linux environment compatible with the runtime image.

Install and authenticate the Fly CLI, then create the app and volume:

```bash
fly launch --no-deploy
fly volumes create portal_data --region sin --size 1
```

If you change the Fly app name, update `app = "personal-portal"` in `fly.toml`.

Set secrets:

```bash
fly secrets set AUTH_PASSWORD_HASH='pbkdf2:310000:...' SESSION_SECRET='...'
```

Deploy:

```bash
fly deploy
```

After deploy:

```bash
fly status
fly open
```

The Fly volume is mounted at `/data`, and `DB_PATH=/data/portal.db` is set in `fly.toml`, so SQLite data persists across deploys and restarts.

## Post-Deploy Checks

- Open the public Fly URL on desktop and on a phone browser.
- Confirm `/api/health` returns `200`.
- Sign in at `/login`.
- Confirm `/` shows row counts.
- Redeploy with `fly deploy`, then confirm the same SQLite file is still used through the mounted volume.
