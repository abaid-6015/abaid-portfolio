# Abaid-ul-Rehman Portfolio v2

## 🚀 Deploy to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Portfolio v2 — with profile photo, game dev, social links"
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo (`abaid-portfolio`)
3. Framework: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**

## 🔐 Admin Panel
- Press **Ctrl+Shift+A** anywhere on the site
- Username: `abaidulrehman`
- Password: `Abaid6015@()=$`
- Edit skills, projects, experience from within the panel

## 📁 Profile Photo
- Place your photo at: `public/profile.jpg`
- Already included in this build

## ✏️ Quick Edits
- Social links → `src/components/Hero.jsx` & `src/components/Navbar.jsx`
- Live project links → `src/store/dataStore.js` (or via Admin Panel)
- Add Fiverr link when available → same files above

## 📦 Stack
- React 18 + Vite
- EmailJS (contact form)
- Framer Motion (animations)
- React Type Animation
- MongoDB-ready (contact form logs)
