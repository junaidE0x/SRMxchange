# SRMxchange

**Campus-only student resource exchange platform for SRM Institute of Science and Technology**

> Built for **FAST Hackathon / PromptWars** (Problem Statement 1) — SRM KTR, August 2026

[![Live Demo](https://img.shields.io/badge/Live%20Demo-r--exchange--beryl.vercel.app-7C3AED?style=for-the-badge&logo=vercel)](https://r-exchange-beryl.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-13.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## The Problem

Every college campus sits on a massive amount of **dormant value**.

Students accumulate textbooks, handwritten notes, electronics from finished projects, event tickets, and skills — yet most of it goes unused because there is no efficient, trusted way to connect the person who has something with the person who needs it.

Current solutions (WhatsApp groups, notice boards, word of mouth) are:

- Unstructured and unsearchable
- Untrusted (anyone can join)
- Fragmented across different channels
- Inefficient — useful items simply never get found

## The Solution

**RExchange** is a verified, campus-only marketplace where SRM students can list, discover, and exchange resources.

- **Verified access** — only `@srmist.edu.in` emails can register
- **Unified discovery** — Books, Electronics, Notes, Skills, Tickets, Giveaways in one feed
- **Structured listings** — title, category, type (Free / Exchange / Paid), description
- **Request to Connect** — direct interest flow between students
- **Content moderation** — keyword filtering flags inappropriate listings
- **Save / Bookmark** — keep track of items you’re interested in

---

## Live Demo

**https://r-exchange-beryl.vercel.app**

---

## Features

### Authentication
- Email/password signup restricted to `@srmist.edu.in`
- Session persistence via Supabase Auth
- Protected dashboard routes

### Listings
- Create listings with category, type (Free / Exchange / Paid), and optional price
- Category filters + search
- Automated content moderation (`under_review` status for flagged content)
- My Listings page with delete support

### Social
- Request to Connect on any listing
- Incoming requests with Accept / Decline
- Save / Bookmark listings

### UX
- Dark mode + glassmorphism design
- Framer Motion page transitions & staggered card animations
- Responsive (sidebar on desktop → bottom nav on mobile)
- Toast notifications for every action

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 13.5 (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Icons | Lucide React |
| Backend | Supabase (Auth + PostgreSQL) |
| Toasts | Sonner |
| Deployment | Vercel |
| AI Scaffolding | Bolt.ai + Antigravity |

### Database Schema

```
profiles   → id, name, reg_no, dept, year, email
listings   → id, title, category, description, type, price, status, posted_by, created_at
requests   → id, listing_id, from_user, to_user, status, created_at
saved      → id, user_id, listing_id  (unique on user + listing)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) project

### 1. Clone the repository

```bash
git clone https://github.com/junaidE0x/RExchange.git
cd RExchange
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> Get these from **Supabase → Project Settings → API**  
> Use the **anon / public** key (not the service_role key).

### 4. Set up the database

In the Supabase SQL editor, create the four tables (`profiles`, `listings`, `requests`, `saved`) matching the schema above.  
Disable email confirmation under **Authentication → Providers → Email** for easier testing during development.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
RExchange/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Protected dashboard routes
│   ├── listing/[id]/       # Listing detail
│   └── ...
├── components/             # UI components (listing-card, dashboard-shell, etc.)
├── lib/
│   ├── supabase.js         # Supabase client
│   ├── auth.js             # signUp / signIn / getCurrentUser
│   └── listings.js         # CRUD + toggleSaved + moderation
├── hooks/
└── ...
```

---

## Architecture Decisions

| Decision | Reason |
|----------|--------|
| Web app over native | Instant shareable demo via Vercel; AI tools optimised for web |
| Supabase over custom backend | Zero server setup; Auth + Postgres + real-time out of the box |
| Email domain validation | SRM Academia API key unavailable → `@srmist.edu.in` restriction achieves the same guarantee |
| No RLS during hackathon | Reduced debugging overhead under time pressure (add in production) |

---

## Built With

- **Bolt.ai** — generated the complete UI scaffold from a single detailed prompt
- **Antigravity** — used for all backend integration and precise file-level edits
- **Cursor** — debugging and targeted fixes

---

## Roadmap (Post-Hackathon)

- [ ] Enable Supabase Row Level Security
- [ ] Real-time notifications on new requests
- [ ] In-app messaging after a request is accepted
- [ ] Image uploads via Supabase Storage
- [ ] Admin moderation panel
- [ ] SRM Academia API integration (auto-fill dept & year)
- [ ] PWA support

---

## License

This project was built for the **FAST Hackathon / PromptWars** at SRM Institute of Science and Technology, Kattankulathur (August 2026).

---

**Developer:** [Junaid E. Ahmed](https://github.com/junaidE0x)  
**Institution:** SRM KTR  
**Live:** [r-exchange-beryl.vercel.app](https://r-exchange-beryl.vercel.app)
