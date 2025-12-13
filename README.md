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

Environment

Create .env from the example:

cp .env.example .env

Typical .env contents:

DATABASE_URL="file:./dev.db"

# Optional: enable live fixtures/results (pluggable provider)
# PROVIDER_MODE="seeded"  # default
# PROVIDER_MODE="live"
# FOOTBALL_API_KEY="..."

Database (Prisma)

npx prisma migrate dev
npx prisma db seed

Run dev server

npm run dev

Open:
	•	http://localhost:3000

⸻

Scripts

Common scripts (may vary slightly depending on repo implementation):

npm run dev
npm run build
npm run start
npm run lint
npm run test


⸻

App Tour
	•	/ — dashboard: today’s headline banter, next fixtures, next watch party, “this day” rivalry nugget
	•	/banter — banter feed + roast card generator + reactions
	•	/clubs/[club] — club overview, fixtures/results, rivalry quick actions
	•	/predictions — predict upcoming fixtures + points + leaderboard
	•	/trivia — timed trivia runs + leaderboard
	•	/events — watch parties + RSVP + ICS download
	•	/admin — invite codes, facts, banter packs, blocked terms, provider mode

⸻

How the Seeded “Roast Cards” Work

Roast generation is deterministic for consistency and shareability:
	•	Seed is derived from:
	•	date (YYYY-MM-DD)
	•	target club + rival club
	•	intensity + style
	•	optional user salt
	•	Result: friends can reproduce the same roast set by using the same inputs.

If you want “freshness,” change any of:
	•	style, intensity, or (optionally) “daily salt” in settings.

⸻

Data Provider Modes

Seeded mode (default)
	•	Fixtures/results are loaded from the seeded DB dataset
	•	Fully offline-capable and demo-friendly

Live mode (optional)
	•	If configured, the app fetches fixtures/results from a free football API
	•	Fallback behavior: if live provider fails, the UI gracefully falls back to seeded data
	•	UI shows:
	•	Data source: seeded | live
	•	Last updated: ...

⸻

Admin Notes

Creating invite codes
	1.	Log in as Owner
	2.	Go to /admin
	3.	Create invite codes and share them with friends

Managing tone guard
	•	Add/remove blocked terms in /admin
	•	Tone guard runs client-side before posting content

Adding facts
	•	Include:
	•	source name
	•	source URL
	•	lastCheckedAt timestamp
	•	Facts should be broadly stable (avoid overly time-sensitive claims unless you plan to refresh)

⸻

Deployment

Vercel

This is designed to deploy cleanly to Vercel.

Build command:

npm run build

Production start:

npm run start

Note: if you’re using SQLite on Vercel, you may want to switch to a hosted DB later. For friend-group MVP, local hosting (or a small VPS) is often simpler.

⸻

Smoke Test Checklist (12)
	1.	Start app, open /, see dashboard tiles populated
	2.	Log in using an invite code, confirm club selection persists
	3.	Go to /banter, generate a roast card, post it to feed
	4.	React to a post with 😂 / 🤡 / 🧂 / 🧠
	5.	Add a blocked term in /admin, try posting it, confirm tone guard triggers
	6.	Visit /clubs/aston-villa, confirm fixtures/results render
	7.	Go to /predictions, submit a prediction for a fixture
	8.	Update a fixture result (seeded/admin tool), verify points award + leaderboard changes
	9.	Go to /trivia, run a 10-question game, confirm scoring stored
	10.	Confirm trivia leaderboard updates
	11.	Create a watch-party event in /events, RSVP, confirm status updates
	12.	Download ICS and import into calendar (Google/Apple)

⸻

Disclaimer

This is a banter site for friends. Keep it fun: no slurs, no hate, no harassment. The tone guard exists to help maintain that line.

⸻

License

MIT (or your preferred license).


