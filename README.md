# Abaid-ul-Rehman Portfolio — v4 FINAL

## 🚀 Quick Deploy to Vercel

```bash
# 1. Extract zip, enter folder
cd abaid

# 2. Install dependencies
npm install

# 3. Test locally
npm run dev

# 4. Push to GitHub
git init && git add . && git commit -m "Portfolio v4 final"
git remote add origin https://github.com/abaid-6015/abaid-portfolio.git
git push -u origin main

# 5. Go to vercel.com → New Project → Import repo
# Framework: Vite | Build: npm run build | Output: dist
```

## 🔐 Admin Panel
- **Shortcut:** Ctrl + Shift + A
- **Username:** abaidulrehman
- **Password:** Abaid6015@()=$

## ✏️ What you can edit from Admin Panel
| Tab | What changes |
|-----|-------------|
| Hero | Name, bio, roles, stats, availability |
| Socials | Add/remove/toggle all profile links |
| About | Bio paragraphs, info card rows |
| Contact | Email, phone, location, Google Script URL |
| Skills | Add/edit/delete skill groups and levels |
| Projects | Add/edit/delete + upload screenshots |
| Experience | Work history entries |
| Education | Degree entries |
| Settings | Export/import/reset all data |

## 📸 Project Screenshots
- Click "Add Photos" on any project card
- Or use Admin → Projects → 📸 button
- Multiple images supported, full lightbox viewer

## 📧 Contact Form
- Already wired to Google Apps Script
- URL in Admin → Contact → Google Script URL
- To test: Admin → Contact → Send Test Email

## 📁 Profile Photo
- Place your photo at: `public/profile.jpg`
- Already included in this build


## ✅ October 2026 fixes
- Fixed `SiCss33 is not defined` in the Skills and Projects module icon maps (now `SiCss3`).
- Improved the custom cursor: no duplicate DOM handlers, no lingering animation frame after cleanup, touch-screen fallback.
- Contact form now validates input and only posts to a configured Google Apps Script URL. Since `no-cors` hides the server response, it honestly reports **request submitted**, not confirmed email delivery. Verify by checking your inbox.
- Deploy Vite on Vercel: **Root directory** `abaid` if repository contains the top-level folder; otherwise leave root at repository root, **Build command** `npm run build`, **Output directory** `dist`.
- Open your portfolio after deployment in a private/incognito tab without extensions to distinguish browser-extension messaging errors from app errors.

**Important security/data note:** This is a static frontend. The demo admin username and password are included in JavaScript shipped to visitors, so they are **not secure authentication**. The admin panel only changes `localStorage` in your own browser; changes are **not visible to other visitors** or synchronized between devices. For shared edits and secure admin access, use a real backend/database and server-side authentication.

### Test steps
1. Run `npm ci` then `npm run build` in the project folder.
2. Run `npm run dev`, then visit the local Vite URL.
3. Confirm Skills and Projects render (no `SiCss33` error), check mouse interactions and touch/mobile layout.
4. Test the contact form with a valid Google Apps Script deployment, and verify actual delivery in your inbox.
5. Push your changed files to the GitHub repository connected to Vercel and redeploy.
