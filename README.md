# SRMxchange

**Campus-only student resource exchange platform for SRM Institute of Science and Technology**

A verified marketplace where SRM students can list, discover, and exchange textbooks, notes, electronics, skills, tickets, and more — without relying on scattered WhatsApp groups or notice boards.

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

**SRMxchange** is a verified, campus-only platform built for SRM students.

- **Verified access** — currently restricted to `@srmist.edu.in` emails (moving to official SRM Academia authentication)
- **Unified discovery** — Books, Electronics, Notes, Skills, Tickets, Giveaways in one feed
- **Structured listings** — title, category, type (Free / Exchange / Paid), description
- **Request to Connect** — mutual acceptance flow; phone numbers are shared only after both sides accept
- **Content moderation** — keyword filtering blocks inappropriate listings from being posted
- **Save / Bookmark** — keep track of items you’re interested in

---

## Features

### Authentication
- Email/password signup currently restricted to `@srmist.edu.in`
- Session persistence via Supabase Auth
- Protected dashboard routes
- Row Level Security (RLS) enabled on all tables in Supabase

### Listings
- Create listings with category, type (Free / Exchange / Paid), and optional price
- Category filters + search
- Automated text moderation — listings containing inappropriate keywords are **rejected and never posted**
- My Listings page with delete support

### Social
- Request to Connect on any listing
- Mutual acceptance required before contact details are shared
- On mutual accept, both users can exchange phone numbers
- Incoming requests with Accept / Decline
- Save / Bookmark listings

### UX
- Dark mode + glassmorphism design
- Framer Motion page transitions & staggered card animations
- Responsive (sidebar on desktop → bottom nav on mobile)
- Toast notifications for every action

---

## Tech Stack

| Layer          | Technology                   |
| -------------- | ---------------------------- |
| Framework      | Next.js 13.5 (App Router)    |
| Styling        | Tailwind CSS + shadcn/ui     |
| Animation      | Framer Motion                |
| Icons          | Lucide React                 |
| Backend        | Supabase (Auth + PostgreSQL) |
| Toasts         | Sonner                       |
| Deployment     | Vercel                       |

### Database Schema

```
profiles  → id, name, reg_no, dept, year, email
listings  → id, title, category, description, type, price, status, posted_by, created_at
requests  → id, listing_id, from_user, to_user, status, created_at
saved     → id, user_id, listing_id (unique on user + listing)
```

RLS policies are enabled so users only access data they are allowed to see or modify.

---

## Project Structure

```
SRMxchange/
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

| Decision                     | Reason                                                                 |
| ---------------------------- | ---------------------------------------------------------------------- |
| Web app over native          | Instant shareable URL; easier iteration and deployment                 |
| Supabase over custom backend | Auth + Postgres + real-time with zero server setup                     |
| Email domain validation      | Ensures only SRM students can register (interim until Academia API)    |
| RLS enabled                  | Per-user access control on profiles, listings, requests, and saved     |
| Keyword block on post        | Inappropriate listings are rejected at create-time, not just flagged   |
| Phone share on mutual accept | Contact details stay private until both parties agree                  |

---

## Roadmap

Planned and in-progress updates:

- [ ] **SRM Academia authentication** — replace domain-only checks with official SRM Gmail / Academia API key flow for true institutional verification
- [ ] **Google Vision AI** — *Activation pending* automated image moderation (detect inappropriate or irrelevant content)
- [ ] **Full profile page and Privacy Settings** — editable WhatsApp phone number and privacy settings
- [ ] Admin moderation panel
- [ ] PWA support (add to home screen + offline basics)

---

## License

Copyright © 2026 Junaid E. Ahmed. All Rights Reserved.

This project is proprietary. No part of this codebase may be copied, modified, distributed, or used without explicit written permission from the author.

---

**Developer:** [Junaid E. Ahmed](https://github.com/junaidE0x)  
**Institution:** SRM KTR
