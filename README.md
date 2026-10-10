# Abaid Portfolio — MongoDB CMS + Secured Admin

React 18 + Vite 5 frontend, Vercel Node.js serverless APIs, MongoDB Atlas. The first public visit seeds the original portfolio profile and projects if the database has no `site` document. Once seeded, the **database is authoritative**. Content can be edited by authenticated admins and appears publicly on every browser. Open visitor pages also refresh from MongoDB every 60 seconds; the admin editor is excluded from polling to avoid overwriting unsaved edits.

## Local setup

1. Install **Node.js 22** (or 20.19+). Open this folder and run `npm install` (which generates a fresh package-lock.json). Because no dependency registry was available when the archive was generated, a lockfile is deliberately not included rather than supplying an inconsistent lockfile.
2. Copy `.env.example` to `.env.local` and fill in the **server-only** secrets. Do not commit `.env.local`.
3. Set `MONGODB_URI` to your rotated Atlas URI. The code always uses database `portfolio`, and stores abaid in the `portfolio.abaid` collection. The same database can hold both `abaid` and `mutaal` collections.
4. Set `SESSION_SECRET` to a random secret with at least 32 characters (suggested command: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`).
5. Set `ADMIN_BOOTSTRAP_ABAID_PASSWORD` to the **existing password** from your previous portfolio (or a new strong password if rotating immediately). This password is used only the first time the admin user is initialized. User name: `abaidulrehman`. No passwords are included in frontend code or the ZIP.
6. Run `npm run dev:full` and open Vite's local URL. The Node API uses port 3001; Vite proxies `/api` to it. Alternatively, use `npm run dev:api` and `npm run dev` in separate terminals.
7. Press **Ctrl + Shift + A** to open admin login. If the browser captures the keyboard shortcut, visit `/admin` on your portfolio domain instead. Then open Settings → Change Admin Password and update to a unique strong password. Once the admin account exists, you can remove the bootstrap environment variable (do not remove the Mongo URI or session secret).

## Deployment to Vercel

- Make a Git repository **for this abaid folder** or set Vercel's Root Directory to `abaid` if deploying both from one repository. Do not upload both frontend roots as one Vercel app.
- Framework Preset: **Vite**. Build Command: `npm run build`; Output Directory: `dist`. The `api` directory contains Node.js Vercel Functions.
- In Project Settings → Environment Variables, create `MONGODB_URI`, `SESSION_SECRET`, `ADMIN_BOOTSTRAP_ABAID_PASSWORD` (server-only, no `VITE_` prefix). Apply them to Production and Preview as appropriate and redeploy after adding them.
- MongoDB Atlas must permit your deployment's network access. Atlas M0 typically cannot allowlist fixed Vercel function IPs. If using `0.0.0.0/0` in Atlas for serverless access, use a least-privileged Atlas DB user, a strong rotated password and restrictive app-level authentication. Prefer a private connection or fixed egress configuration when possible.
- First open the public site to seed `portfolio.abaid` with `_id:'site'`. First admin login creates `_id:'admin'` with a salted scrypt hash. Project image documents have `_id:'photo:<random-id>'` in **the same collection**, not localStorage.
- Deploy the other portfolio with its own Vercel project and its own matching bootstrap password and preferably a separate session secret. Both can use the same `portfolio` database with different collections.

## Admin and image functionality

- The public site can only **view** project screenshots and open the gallery; only an authenticated admin can upload or delete screenshots under Admin → Projects → 📸.
- Each image is compressed by the browser, checked server-side for actual JPG/PNG/WebP/GIF file signatures, limited to 1.7 MB and stored in MongoDB. Maximum 10 photos per project. The images appear for everyone after refreshing the portfolio.
- Admin editing uses protected API calls, debounced autosave, cookie sessions (HttpOnly, SameSite=Strict, Secure on HTTPS), session revocation after password change, attempt lockout, origin checks, and salted scrypt password hashes.
- Settings → Export produces a backup of the portfolio text/structured data; **photo binary data is not included**. Keep separate copies of your images. Previously uploaded browser-local images are **not automatically migrated** — upload them again via Admin → Projects. To migrate earlier text edits, export JSON using the **old** portfolio Settings and import it into the new Admin → Settings.
- After changing a section, wait for the **Synced with MongoDB** indicator before navigating away or reloading. An error banner appears if the save fails.

## Security and troubleshooting

- The MongoDB URI and bootstrap credentials from the earlier client-only version should be treated as compromised; **rotate the Atlas DB password**, change both admin passwords, and invalidate old deployments.
- `SESSION_SECRET` MUST be unique, random, and kept server-side. Never use `VITE_` for it or expose it to client bundles.
- `Ctrl + Shift + A` is only an undisclosed UI route, **not** a security boundary. The backend checks signed sessions for every write.
- If the portfolio shows "temporarily unavailable", inspect the Vercel Function logs, URI, Atlas user privileges, and allowed networks.
- If an upload returns 413, compress the screenshot to below 1.7 MB. If login is locked, wait 15 minutes.
- If you rotate bootstrap password after first login, it will **not** change the admin account's password; use Settings → Change Admin Password.

### API reference

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/content?site=abaid` | GET | Public content and screenshot URLs |
| `/api/content` | PUT | Authenticated edits |
| `/api/content` | POST | Authenticated JSON import/reset |
| `/api/auth?site=abaid` | GET | Check signed admin session |
| `/api/auth` | POST | Login, logout, password change |
| `/api/photo` | GET | View screenshot |
| `/api/photo` | POST, DELETE | Authenticated photo management |

## Verification limitations

Static JS/JSX parsing can be checked offline. A complete npm/Vite build, Atlas connection, and live Vercel deployment need internet access, dependencies, and a configured Atlas account; they must be validated after setup. Never treat mock tests as proof that remote deployment works.
