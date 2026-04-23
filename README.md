# 🌸 Bio Link Experience

> *"Judge me. But don't be boring."*

A personal, aesthetic Instagram bio link experience built with Next.js 14 (App Router), Tailwind CSS, Framer Motion, and Supabase.

---

## ✨ Features

- **Landing Page** — Elegant hero with two CTAs
- **Judge Flow** — 4-step interactive multi-step experience (no page reloads)
- **Anonymous Message Page** — Simple, warm input experience
- **Done Page** — Sparkle-filled thank you moment
- **Admin Dashboard** — Password-protected, with favorite/delete controls

---

## 🗂️ Project Structure

```
biolink-app/
├── app/
│   ├── page.tsx              # Landing page (/)
│   ├── judge/page.tsx        # Judge multi-step flow (/judge)
│   ├── message/page.tsx      # Anonymous message (/message)
│   ├── done/page.tsx         # Done/thank you (/done)
│   ├── admin/page.tsx        # Admin dashboard (/admin)
│   ├── api/
│   │   ├── submit/route.ts   # POST: save response
│   │   ├── messages/route.ts # GET: admin fetch all
│   │   ├── delete/route.ts   # DELETE: admin remove
│   │   └── favorite/route.ts # POST: admin toggle favorite
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── supabase.ts           # Client-side Supabase
│   └── supabase-admin.ts     # Server-side (service role)
├── .env.example
└── README.md
```

---

## 🛠️ Setup Guide

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the **SQL Editor**, run this to create the table:

```sql
create table responses (
  id uuid primary key default gen_random_uuid(),
  impression text,
  talk_choice text,
  message text,
  is_favorite boolean default false,
  created_at timestamp with time zone default now()
);

-- Optional: Add RLS policies if needed
alter table responses enable row level security;

-- Allow inserts from anon (for public submissions)
create policy "Allow anon insert" on responses
  for insert to anon with check (true);

-- Block public reads (admin uses service role via server)
create policy "No public reads" on responses
  for select to anon using (false);
```

3. Get your credentials from **Project Settings → API**:
   - Project URL
   - `anon` / public key
   - `service_role` key (keep secret!)

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_PASSWORD=your_secret_admin_password
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## 🚀 Deploy on Vercel

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. In **Environment Variables**, add all 4 variables from your `.env.local`
4. Click **Deploy** 🎉

> ✅ Vercel auto-detects Next.js — no build config needed.

---

## 🔐 Admin Access

Visit `/admin` and enter your `ADMIN_PASSWORD`.

- Responses are fetched **server-side** via the service role key
- The admin API routes check for `x-admin-password` header
- No Supabase data is exposed publicly

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Cream | `#FAF6F1` |
| Blush | `#F2C4CE` |
| Rose | `#D4818F` |
| Mocha | `#8B6355` |
| Warm Brown | `#6B4C3B` |

Fonts: **Cormorant Garamond** (display) + **Jost** (body)

---

## 📝 Notes

- All message submissions are anonymous — no IP or identity is stored
- The admin page is **not linked** from any public page
- The `SUPABASE_SERVICE_ROLE_KEY` is never exposed to the client

---

*Built with intention. Not generic.* 🌸
