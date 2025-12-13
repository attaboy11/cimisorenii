# cimisorenii
# BanterBoard (Friends Football Hub)

A private-ish, mobile-first football banter site for a friend group (Villa, Arsenal, Man United, Chelsea) with:
- Banter feed + deterministic “roast cards”
- Facts with citations + freshness timestamps
- Fixtures/results (seeded by default, optional live provider)
- Predictions + automatic points + leaderboard
- Trivia game + leaderboard
- Watch-party events + RSVP + ICS calendar download
- Admin tools (invite codes, facts, banter packs, blocked terms)

Built to be fun, interactive, and shareable — without turning toxic.

---

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **SQLite** + **Prisma**
- Optional: **Framer Motion** for light animations

---

## Features

### 1) Invite-code access (no email)
- Owner creates invite codes in `/admin`
- Friends sign in by entering a code + display name + club
- Designed for small groups

### 2) Banter Engine (deterministic)
- Generate roast cards by:
  - target club, rival club
  - intensity (mild/medium/savage)
  - style (dry/absurd/statistical/poetic)
- Uses a seeded PRNG so the same inputs produce the same output “of the day”
- Supports custom inside-joke “Banter Packs” (admin-managed)

### 3) Facts with citations + “last updated”
- Facts stored with:
  - claim text, category, source name + URL, lastCheckedAt
- UI always shows source and freshness

### 4) Predictions + points + leaderboard
- Predict scores for upcoming fixtures
- Points awarded once results are known (seeded or live)
- Leaderboard updates automatically

### 5) Trivia
- 10-question quick game with timer
- Seeded question bank (club-specific + general)
- Scoring + leaderboard

### 6) Events (watch-parties) + ICS export
- Create watch-party events linked to fixtures
- RSVP yes/no/maybe
- Download calendar invite (.ics)

### 7) Tone guard
- Blocks/flags banned terms and prompts rephrase
- Admin can manage blocked terms

---

## Getting Started

### Prerequisites
- Node.js 18+ (20+ recommended)
- npm / pnpm / yarn (examples below use **npm**)

### Install
```bash
npm install
