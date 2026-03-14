# Setup Guide — International Economics Study Site

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up for a free account
2. Click **New Project**
3. Fill in:
   - **Project name:** eco-study (or any name)
   - **Database password:** choose a strong password
   - **Region:** pick the closest to you (e.g., South Asia for India)
4. Wait ~2 minutes for the project to provision

## Step 2: Run the Database Schema

1. In your Supabase project, go to **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` in the eco-study folder
4. Paste the entire contents into the SQL editor
5. Click **Run** — this creates all tables and seeds the 8 course topics

> **Already ran the old schema?** If you ran the schema before `notes_md` and `session_number` columns were added, also run `supabase/migration.sql` in a separate SQL Editor query.

## Step 2.5: Seed Lectures & Practice Questions

After running the schema (and optionally migration.sql):

1. Make sure `.env.local` is configured with your Supabase keys (see Step 4)
2. Run the seed script from the `eco-study` folder:
   ```bash
   npm run seed
   ```
3. This inserts **9 lectures** (one per session file, with full notes) and **12 practice questions** from the sample questions PDF.

> Re-running `npm run seed` is safe — it skips items that already exist.

## Step 3: Get Your Supabase Keys

1. In your Supabase project, go to **Settings → API**
2. Copy:
   - **Project URL** (looks like `https://abc123.supabase.co`)
   - **`anon` / public key** (under Project API Keys)
   - **`service_role` / secret key** (under Project API Keys — keep this secret!)

## Step 4: Configure Environment Variables

1. In the `eco-study` folder, find `.env.local.example`
2. **Duplicate** it and rename it to `.env.local`
   ```
   copy .env.local.example .env.local
   ```
3. Open `.env.local` and fill in your Supabase values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
   ADMIN_PASSWORD=IIMV
   ```

## Step 5: Start the Dev Server

```bash
cd eco-study
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site should load with all 8 topics!

---

## Adding Content

### Add Lectures

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Password: **IIMV**
3. Click **Lectures → + Add Lecture**
4. For the **PDF Filename** field, use one of the files already copied to `public/pdfs/`:

| Lecture | PDF Filename |
|---|---|
| BOP Lecture | `PPT-7-INE-BalanceofPayments.pdf` |
| BOP Lecture Notes | `LN-1-INE-BOP.pdf` |
| History & Mercantilism | `PPT-1-INE-History-Mercantilism.pdf` |
| Basis for Trade | `PPT-2-INE-Basis-for-Trade.pdf` |
| H-O Model | `PPT-4-INE-HecksherOhlin-Model.pdf` |
| Balassa RCA | `PPT-3-Balassa-RCA.pdf` |
| Alternate Trade Theories | `PPT-5-INE-Alternate-Trade-Theories.pdf` |
| Gains from Trade | `PPT-4-INE-Gains-from-Trade.pdf` |
| Gains from Trade Notes | `LN-3-INE-Gain-Loss-Trade.pdf` |
| Tariffs & Quotas | `PPT-6-INE-Tariffs-Quotas.pdf` |
| Dollar Reserve Currency | `LN-4-INE-Dollar-Reserve-Currency-V2.pdf` |

### Add Practice Questions

1. In the Admin Panel, click **Questions → + Add Question**
2. The Sample Questions PDF (`public/pdfs/Sample Questions-International Economics.pdf`) has ready-to-use questions you can copy in
3. Tag each question with the correct topic and difficulty

---

## Deploy to Vercel

1. Push the `eco-study` folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com), import the repo
3. Add the same env variables from `.env.local` in Vercel's environment settings
4. Deploy — your site will be live at a `*.vercel.app` URL
5. Share the URL with your study group — no login needed, just browse!

---

## Project Structure

```
eco-study/
├── app/
│   ├── (site)/          ← Student-facing pages (home, topics, practice)
│   ├── admin/           ← Admin panel (password: IIMV)
│   └── api/             ← REST API for CRUD operations
├── components/
│   └── Sidebar.tsx      ← Navigation sidebar
├── lib/
│   ├── db.ts            ← Database query functions
│   ├── supabase.ts      ← Supabase client
│   └── types.ts         ← TypeScript types
├── public/
│   └── pdfs/            ← All lecture PDFs (already copied)
└── supabase/
    └── schema.sql       ← Run this in Supabase SQL Editor
```
