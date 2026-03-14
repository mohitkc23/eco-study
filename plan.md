# 📘 eco-study Website — Improvement Plan

> **Course:** International Economics · IIM Visakhapatnam · MBA 2025–27  
> **Stack:** Next.js 16, Supabase, TailwindCSS  
> Last updated: 2026-03-14

---

## 🔍 Current State Summary

| Area | Status |
|---|---|
| Home page | ✅ Working — shows topics grid with stats |
| Practice Questions | ✅ Working — filter by topic, show model answer |
| Topic Detail Pages | ✅ Working — shows lectures per topic |
| Admin Panel | ⚠️ Protected by login, but **blank on first visit** (middleware redirect issue) |
| Mobile Responsiveness | ⚠️ Sidebar collapses, but layout needs polish |
| Search / Flashcards / Progress | ❌ Missing — major feature gaps |
| Dark Mode | ❌ Not implemented |
| SEO / Meta Tags | ❌ Not implemented per page |

---

## 💡 Suggested Improvements

Grouped by **priority**. Mark your preferences with ✅ / ❌ / 🔄 (change).

---

### 🔴 Priority 1 — Fix / Complete Existing Features

#### 1.1 Fix Admin Page Blank Screen
- **Problem:** The `/admin` page shows blank on first visit — the auth middleware redirects to `/admin/login` but after login it may not redirect back correctly.
- **Fix:** Debug the `middleware.ts` auth redirect flow and ensure the `layout.tsx` in admin properly guards and redirects.

#### 1.2 Add More Questions Per Topic
- **Problem:** Most topics have 0–2 questions. The exam prep content (`exam-prep-sample-questions.md`) has many more questions already in markdown files.
- **Fix:** Build a **bulk import script** that reads the markdown content files and seeds Supabase with questions and lectures automatically.

#### 1.3 Full Content for All Sessions
- The `content files/` folder has 10 session `.md` files. But only **9 lectures** are showing in the DB.
- **Fix:** Ensure all session content is properly imported into Supabase.

---

### 🟡 Priority 2 — High-Impact New Features

#### 2.1 🔎 Global Search
- Add a search bar in the header/sidebar to search across **topics, lectures, and questions**.
- Keyboard shortcut: `Ctrl+K` / `Cmd+K` (like Notion/Linear).
- Shows instant results as you type.

#### 2.2 📇 Flashcard Mode
- A new `/flashcards` page where questions appear as flip-cards.
- User sees the question → clicks to reveal the answer.
- Can mark as "Got it ✅" or "Review again 🔄".
- Tracks which cards the user has mastered (store in `localStorage`).

#### 2.3 📊 Progress Tracker
- Track how many questions per topic the user has attempted/answered correctly.
- Show a **progress bar** on each topic card on the home page.
- Store progress in `localStorage` (no login required for students).

#### 2.4 📝 Notes / Highlights
- Let students highlight important lines in lecture notes and add personal annotations.
- Saved in `localStorage`.

---

### 🟢 Priority 3 — UI / UX Polish

#### 3.1 Dark Mode Toggle
- Add a 🌙/☀️ toggle in the header.
- Persist preference in `localStorage`.

#### 3.2 Improved Mobile Layout
- The sidebar currently overlaps content on small screens.
- Make it a proper **slide-in drawer** with an overlay/backdrop on mobile.

#### 3.3 Topic Page with Lecture Content Viewer
- Currently, topic pages list lectures but don't show content inline.
- Add an **accordion / tab** to expand and read lecture notes directly on the page.

#### 3.4 Better Home Page Hero
- The current dark header is good but static.
- Add a subtle **progress summary widget** ("You've practiced X of Y questions!") to make it feel personal.

#### 3.5 Breadcrumbs
- Add breadcrumb navigation on topic and practice pages so users always know where they are.

---

### 🔵 Priority 4 — Admin Panel Completion

#### 4.1 Bulk Import from Markdown Files
- Add an **"Import from .md file"** button in the Admin panel to parse and upload session content.

#### 4.2 Question Editor Improvements
- Add a **rich text / markdown preview** when writing questions and answers in the admin.

#### 4.3 Reorder / Drag Topics
- Allow admin to drag-and-drop topics to reorder them.

---

## 🗓️ Suggested Build Order

```
Phase 1 (Fix): Admin redirect fix → Bulk content import
Phase 2 (Features): Search → Flashcards → Progress Tracker
Phase 3 (Polish): Dark mode → Mobile drawer → Topic content viewer
Phase 4 (Admin): Rich editor → Bulk import button → Reorder
```

---

## ✍️ Your Feedback

Please review and let me know:
- Which features do you **want** vs **don't want**?
- Any features I **missed** that you had in mind?
- What is your **top priority** to build first?
- Any **design preferences** (color scheme, fonts, layout changes)?

Once you give feedback, I'll update this plan and start building!
