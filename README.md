# 📌 Smart Bookmark App

A full-stack real-time bookmark manager built using **Next.js (App Router)** and **Supabase**.

Users can securely sign in using **Google OAuth**, add bookmarks, and manage them in real-time. Each user's bookmarks are completely private using Supabase Row Level Security (RLS).

---

## 🚀 Live Demo

🔗 Live App: https://smart-bookmark-app-two-pi.vercel.app/  
🔗 GitHub Repository: https://github.com/Sabyasachiii/Smart-Bookmark-App  

---

## 🛠 Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS  
- **Backend:** Supabase (Auth + PostgreSQL + Realtime)  
- **Authentication:** Google OAuth (Supabase Auth)  
- **Database:** PostgreSQL  
- **Deployment:** Vercel  

---

## ✅ Features Implemented

### 1️⃣ Google Authentication Only
- Users can sign up and log in using **Google OAuth**
- No email/password login allowed
- Implemented using Supabase Auth
- Secure OAuth redirect configuration

---

### 2️⃣ Add Bookmark
- Logged-in users can add:
  - Bookmark title
  - Bookmark URL
- URLs are automatically formatted (adds `https://` if missing)

---

### 3️⃣ Private Bookmarks (RLS Security)

Each bookmark is linked to a specific `user_id`.

Supabase **Row Level Security (RLS)** is enabled on the `bookmarks` table.

Policy used:

```sql
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
