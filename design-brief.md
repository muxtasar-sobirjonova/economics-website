# That's So Econ — Frontend Redesign Brief

You are redesigning the entire frontend of a live, working web app. The backend,
data model and routing are finished and must not change. Your job is the visual
and interaction layer only.

Read the whole brief before proposing anything.

---

## 1. What the product is

**That's So Econ** is a self-paced, gamified platform for learning economics
through real entrepreneurship stories.

A learner picks one **track** and works through a **56-day curriculum** split
into **8 chapters of 7 days**:

- **Days 1–6 of a chapter** — one lesson each. A lesson has three activities:
  1. **Concept** — a short explainer (5–10 min)
  2. **Article** — a longer magazine-style reading (5–20 min)
  3. **Quiz** — 10 multiple-choice questions (10 min)
- **Day 7 of a chapter** — a **chapter review quiz only** (no reading).

Passing a quiz (**80%+**, i.e. 8/10) marks the day complete and unlocks the next
day on the roadmap. Failing costs a heart and the day stays locked.

**Three tracks**, each with its own 8 chapters and its own independent progress:

- Entrepreneurship Economics
- Development Economics
- Behavioral Economics

**Progression systems layered on top:** XP, daily streak, hearts (5 max, one
regenerates every 4 hours), leagues (Bronze → Silver → Gold → Platinum →
Diamond), and a global leaderboard.

**Audience:** self-directed learners and students, roughly 16–30. Usage is
**mobile-first in practice** — most sessions happen on a phone.

---

## 2. Hard technical constraints

These are fixed. A design that ignores them cannot be built.

| Constraint    | Detail                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework     | Next.js 14 **App Router**, React 18, Server Components by default                                                                          |
| Styling       | **Tailwind CSS 3** + `@tailwindcss/typography` — no CSS-in-JS runtime                                                                      |
| Animation     | **framer-motion** (already a dependency), plus `canvas-confetti`                                                                           |
| Icons         | `@tabler/icons-react` and `lucide-react` only                                                                                              |
| Components    | No UI kit (no MUI/Chakra/shadcn wholesale). Radix `Slot` is available.                                                                     |
| Fonts         | Currently **Inter** via `next/font/google`. You may change it, but it must be loadable through `next/font` (Google Fonts or a local file). |
| Colour scheme | Light only today (`<meta name="color-scheme" content="light only">`). Adding dark mode is welcome but must be proposed explicitly.         |
| Hosting       | Vercel. Keep bundle size sane — no heavy 3D/WebGL libraries.                                                                               |
| Images        | `next/image` with remote patterns allowed for `images.unsplash.com`, `lh3.googleusercontent.com`, `cdn.sanity.io` only.                    |
| CSP           | Strict Content-Security-Policy is set. No external script/style/font hosts beyond those above.                                             |

Content is HTML strings from the database rendered via
`dangerouslySetInnerHTML` inside a `.prose` container — so the **typography
plugin styles are the article design**.

---

## 3. Complete route map

### Public (marketing)

| Route     | Purpose                                          |
| --------- | ------------------------------------------------ |
| `/`       | Landing page. Redirects to `/home` if signed in. |
| `/login`  | Email+password and Google sign-in                |
| `/signup` | Registration                                     |

### Authenticated app (shared shell: sidebar on desktop, header + bottom nav on mobile)

| Route                          | Purpose                                                |
| ------------------------------ | ------------------------------------------------------ |
| `/home`                        | Dashboard — the daily hub                              |
| `/roadmap`                     | The 56-day map, chapter by chapter                     |
| `/leaderboard`                 | Global ranking with podium                             |
| `/challenges`                  | Daily reflection prompts                               |
| `/saved`                       | "My Notes" — all saved notes, reviewable as flashcards |
| `/review`                      | Mistake review — questions answered wrong              |
| `/profile`                     | Account details                                        |
| `/track-selection`             | Pick / switch track                                    |
| `/topics`                      | Track overview ("More coming soon")                    |
| `/lessons/[day]/concepts`      | Concept overview card + learning path strip            |
| `/lessons/[day]/concepts/read` | The concept reading view                               |
| `/lessons/[day]/articles`      | Article overview card                                  |
| `/lessons/[day]/articles/read` | The magazine article reading view                      |
| `/lessons/[day]/quizzes`       | Quiz overview + last-attempt feedback                  |
| `/lessons/[day]/quizzes/read`  | The quiz player                                        |

---

## 4. Screen-by-screen specification

Design against this real content. Do not invent placeholder data.

### 4.1 `/` Landing page

Sections in order:

1. **Nav** — logo, links, "Log in" CTA
2. **Hero** — headline, subhead, two buttons ("Get started" → `/login`, "See the roadmap" → anchor). Currently has floating animated background orbs.
3. **"Your Personal Study Plan" → _Stop guessing. Start learning._** — dashboard mockup
4. **"Core Concepts" → _Build a Robust Mental Model._** — concepts mockup
5. **"Case Study Driven" → _Applied Case Studies._** — articles mockup
6. **"Active Recall & Assessment" → _Mastery through Assessment._** — quiz mockup
7. **"Spaced Repetition Notes" → _Highlight it. Save it. Never forget it._**
8. **"Active Recall" → _Review with Intent._** — flashcard mockup
9. **"Our Approach" → _Why Choose That's So Econ?_** — three feature cards:
   - "Learn by doing, not memorizing"
   - "Real case studies, not just theory"
   - "A study plan that adapts daily"
10. **"Support" → _Frequently Asked Questions_** — accordion
11. **Footer**

The mockup components (`DashboardMockup`, `ConceptsMockup`, `ArticlesMockup`,
`FlashcardMockup`, `NotesMockup`, `RoadmapMockup`) are hand-drawn fake UI inside
a fake browser chrome. They must be redrawn to match whatever new app design you
produce.

### 4.2 `/home` Dashboard

Top to bottom:

1. **Daily quote** — rotating quote strip, varies per track
2. **Hero greeting** — avatar circle with the user's initial, "Good morning, {name}", two CTAs, and a **week strip**: seven day circles (Mon–Sun) marked complete / missed / today / future, with a "Study today to build your streak →" nudge
3. **Today's Agenda card** — the core of the screen:
   - header "Today's Agenda" + "up to {N} minutes" pill
   - progress bar "{done} of {total} done"
   - 2–3 rows, each: coloured left accent bar, category badge (**CONCEPT** amber / **ARTICLE** blue / **QUIZ** purple), title, time pill, and a completion circle that fills green with a check when done
   - empty state: "All caught up! You've finished your agenda for today."
4. **Daily Challenge card** — a reflection prompt with a text input, sits beside the agenda on desktop
5. **"Your Learning Stats"** — five stat cards in a row:
   - Current Streak (flame) — "{n} days"
   - Lessons (check circle) — "{n} completed"
   - Avg Quiz Score (trophy) — "{n}%" with a tiny bar sparkline
   - XP This Week (star) — "{n} XP"
   - Total XP (star) — "{n} XP"

### 4.3 `/roadmap` — the signature screen

For each of the 8 chapters:

- A **chapter card**: number, title, description, "Start" button, each chapter with its own gradient (purple → blue → green → pink → orange → teal → indigo → amber)
- Below it an **SVG path** of nodes winding down the page: 6 lesson nodes + 1 chapter-quiz node. Three node states:
  - **Completed** — filled, check mark
  - **Active** — highlighted, animated dashed ring, "START QUIZ!" / "START" label above
  - **Locked** — grey with a padlock
- The last node of each chapter is the chapter quiz (larger, star icon)
- Bottom banner: "CHAPTER 9 COMING SOON"

**Right sidebar:** track switcher (three tracks), a **league card** (league name,
XP progress bar, "{n} XP to next league"), and quick links.

### 4.4 `/lessons/[day]/concepts` and `/articles` (overview pages)

- Top tab bar: Roadmap · Concepts · Articles · Quizzes · My Notes (underline on active)
- A hero banner card: icon, category eyebrow, title, reading-time, one-line description, and a "Start reading" CTA
- A **Learning Path slider** — horizontal strip of all days with completed/current/locked markers

### 4.5 Reading views (`/concepts/read`, `/articles/read`)

- Slim page header strip ("CONCEPTS" / "ARTICLES")
- "← Back to Concepts" link
- **Sticky bar**: "LESSON {n}" pill on the left, a "Select text to highlight" hint on the right
- Big uppercase title, "ESTIMATED READING TIME (10-20 MIN) • DAY 0{n}"
- Long-form body in a `.prose` container, max-width ~800px
- Bottom-right primary button: **"Next: Articles →"** / **"Next: Quizzes →"**
- **Text highlighter**: selecting text pops a floating toolbar with four colour swatches (yellow `#FCD34D`, blue `#93C5FD`, pink `#F9A8D4`, green `#6EE7B7`) and a delete button. Tapping an existing highlight re-opens it. Highlights persist in localStorage.
- **Notes drawer**: a tab pinned to the right edge reading "KEY TAKEAWAYS & MY NOTES" that slides open a 308px panel with two tabs:
  - **💡 Takeaways** — numbered list from the lesson
  - **🗒️ My Notes** — sticky notes with 5 colour swatches and B / I / U / S / H formatting buttons, "+ Add Note", and a "**+ Save a note**" button

### 4.6 `/lessons/[day]/quizzes` (overview)

- Hero banner: brain icon, quiz title, "10 min quiz"
- **"LESSON MASTERY"** panel — one of four states:
  - No attempts yet
  - "Excellent Work!" (≥8/10)
  - "Good job!" (≥6/10)
  - "Review Recommended" (<6/10) with "Review Concept" / "Review Article" links
- **"READY TO START"** panel — "Test yourself" / "Retake Quiz" + CTA
- Learning Path slider

### 4.7 `/lessons/[day]/quizzes/read` (quiz player)

- Top row: "← Back to Quizzes", "LESSON {n}" chip, "Question 3 of 10", "⭐ 4 / 10"
- **Segmented progress bar** — one segment per question, green = correct, red = wrong, pulsing blue = current
- **Question card** on a soft blue gradient, "QUESTION 3 OF 10" chip, "⚡ Medium" label
- **Four answer options** — letter badge A/B/C/D, hover slides right, selected outlines blue; after submit the correct one turns green with a check and particle burst, the wrong one turns red with an X and the card shakes
- Buttons: "← Previous", "Submit" / "Next Question →" / "Skip Question →" / "Finish Quiz"
- **Result screen**: giant "8 / 10", a message (🏆 Perfect Score! / ⭐ Excellent! / 👍 Good Job! / 📚 Keep Studying), falling confetti when passed, a "you need 8/10 to unlock the next topic" note when failed, and two buttons back to Quizzes / Roadmap
- The notes drawer is available here too

### 4.8 `/leaderboard`

- A **three-place podium**: "GRAND CHAMPION" centre, "RUNNER UP" left, "THIRD PLACE" right, each with avatar, name, lessons count
- Ranked rows below
- **"Your Standing"** card — your rank, lessons, total XP
- Search field
- Empty state: "No learners found — Complete a lesson to get on the board!"

### 4.9 `/saved` — My Notes

- Grid/list of saved notes, each tagged with its source (Concept / Article / Quiz) and lesson
- A **flashcard review mode** — cards fly left/right on swipe with spring physics, ending in "Card Review Complete"
- Empty state: "No notes yet!"
- Pagination

### 4.10 `/review` — Mistakes

- "Needs Review" and "Room for Improvement" groupings of questions answered incorrectly

### 4.11 `/challenges`

- "Challenge" prompt + "Your Reflection" text area

### 4.12 `/profile`

- "My Profile", "Total XP", "Joined", "Account Details", "Current Track"

### 4.13 `/track-selection`

- Three large track cards to pick from

### 4.14 App shell

- **Desktop sidebar** — 240px, solid purple `#51487F`, white text, active item darker `#362A5C` with a white left border. Two groups:
  - _Dashboard_: Home, Roadmap, Leaderboard, My Challenges
  - _Learn_: Concepts, Articles, Quizzes, My Notes
  - Auth status block at the bottom
- **Mobile header** — fixed 64px: compass icon + chevron (track switcher) on the left, an "XP {n}" pill and avatar on the right
- **Mobile bottom nav** — fixed, 8 items, horizontally scrollable: Home, Roadmap, Leaderboard, Challenges, Concepts, Articles, Quizzes, Notes

---

## 5. The current design system (what exists today)

```
Background      #F8F9FC   (every app page)
Reading pages   #FCF6F0   (warm cream)
Text            #1F2937 / #1A1A2E / #24203F
Brand primary   #7B6FE7   (purple — buttons, accents, active states)
Brand dark      #5A4FBD
Sidebar         #51487F, active #362A5C
Quiz accent     #3D52A0   (a second blue that appears only in the quiz)
Success         #22C55E    Error #EF4444
Category        CONCEPT #fef3c7/#d97706 · ARTICLE #dbeafe/#2563eb · QUIZ #f3e8ff/#9333ea
Highlighters    #FCD34D #93C5FD #F9A8D4 #6EE7B7
Note colours    #FFF9C4 #FFD6D6 #D6E8FF #D6F5E3 #E8D6FF
Legacy, unused  --rosewood #846A72 · --blush #F7C8D3 · --sage #A8B58A · --vanilla #FFF7E6
Font            Inter, weights 400–900
Radii           rounded-lg, xl, 2xl, 3xl, full — all mixed together
Shadow          shadow-sm · shadow-[0_8px_32px_rgba(0,0,0,0.04)] · shadow-[0_2px_8px_rgba(0,0,0,0.04)]
```

There are ~30 hand-written keyframe animations in `globals.css` (note swipe,
particle burst, confetti, shake, flash, shimmer, floating orbs).

---

## 6. Why it currently feels boring — fix these specifically

1. **One flat surface everywhere.** Every screen is the same `#F8F9FC` field with
   white `rounded-3xl` cards and a near-invisible shadow. The dashboard, the
   quiz and the leaderboard are visually indistinguishable. There is no
   hierarchy of surfaces, no depth, no sense of place.
2. **Purple is the only brand signal.** `#7B6FE7` carries every button, accent
   and active state. There is no secondary colour, no supporting neutrals with
   character, no accent reserved for reward moments.
3. **The type is single-note.** Inter at every weight from 500 to 900, with
   sizes hardcoded per component (`text-[13px]`, `text-[11px]`, `text-[44px]`).
   No type scale, no display face, no editorial contrast. A long-form magazine
   article is set in the same font as a nav label.
4. **A repetitive component vocabulary.** Almost every unit of information is
   "small round icon chip + bold label + big number". Stats, agenda rows,
   roadmap sidebar and profile all resolve to the same shape.
5. **No reward moment.** XP, streaks and league promotions just change a number.
   Confetti exists in the quiz result, but nothing celebrates a streak
   milestone, a chapter completion or a league promotion.
6. **The roadmap is the best idea and the weakest execution.** It is a
   hand-rolled SVG with hardcoded x-coordinates `[100, 260, 380, 240, 100, 300,
180]`, flat circles and dashed connectors. This should be the screen people
   screenshot and share.
7. **Placeholder-grade empty and loading states.** Grey pulsing rectangles and
   "Loading dashboard..." with a spinner.
8. **Inconsistent radii and shadows** — four radius values and three shadow
   recipes can appear on a single screen.
9. **Palette pollution.** Legacy tokens (`rosewood`, `blush`, `sage`, `vanilla`,
   `tropic`, `tide-mint`) are still defined, and stray one-off colours appear —
   e.g. the article Save button uses a teal `#4ebdd5` found nowhere else.
10. **Mobile is an afterthought.** The header holds only an XP pill and an
    avatar. The bottom bar crams 8 items into a horizontal scroller, which hides
    half the navigation. Reading views set 44px titles on a 375px screen.

---

## 7. What I want from the redesign

- A **distinct visual identity** — this should not look like a generic SaaS
  dashboard template. It teaches _entrepreneurship economics through stories_;
  the design should feel editorial and confident, not corporate.
- **A real design system**: a type scale, a spacing scale, one radius scale, a
  shadow/elevation scale, and semantic colour tokens (surface, surface-raised,
  border, text-primary, text-muted, accent, success, danger, and one colour per
  activity type) — expressed as CSS variables consumed by `tailwind.config.ts`.
- **Distinct spatial identities per mode**: the _dashboard_ (dense, glanceable),
  the _reading view_ (calm, long-form, generous measure), the _quiz_ (focused,
  high-contrast, one thing at a time), and the _roadmap_ (playful, spatial).
- **Gamification that feels earned** — a real moment when a day is cleared, a
  streak extends, a chapter closes or a league is won.
- **Mobile-first navigation that actually works** for 8 destinations.
- **Motion with intent** — framer-motion for state transitions and rewards, not
  decoration everywhere.

---

## 8. What to deliver

1. **Direction** — 2–3 sentences on the concept, plus the mood in words. No
   mood-board links.
2. **Design tokens** — a complete `globals.css` `:root` block and the matching
   `tailwind.config.ts` `theme.extend`, with every token named semantically.
3. **Type system** — font choice(s) loadable via `next/font`, the scale, and
   which role each step plays. Include the `.prose` overrides for article body
   copy.
4. **Core component specs** — button (all variants and states), card, badge/pill,
   stat tile, agenda row, quiz option, roadmap node, nav item, input, empty
   state, loading skeleton, toast.
5. **Full React + Tailwind code** for these five screens, in this priority order:
   1. `/roadmap` — the signature screen
   2. `/home` — the daily hub
   3. `/lessons/[day]/quizzes/read` — the quiz player
   4. `/lessons/[day]/concepts/read` — the reading view
   5. The app shell (sidebar, mobile header, mobile nav)
6. **Mobile layout for each of the five**, at 375px.
7. **A migration note** — which existing files each replacement maps to.

---

## 9. Non-negotiable requirements

- **Accessibility**: WCAG AA contrast, visible focus rings on every interactive
  element (the current code uses `focus-visible:ring-2` — keep an equivalent),
  full keyboard operation of the quiz and the roadmap, correct ARIA labels on
  icon-only buttons, and `prefers-reduced-motion` honoured for every animation.
- **Text selection must keep working** inside the article body — the highlighter
  depends on `window.getSelection()` over a container with `id="main-content"`.
  Do not apply `user-select: none` to body copy.
- **Touch targets** ≥ 44px on mobile.
- **Server Components stay server-side.** Only add `"use client"` where
  interaction genuinely requires it.
- **No layout shift** on load; skeletons must match the shape of real content.
- Every screen must be designed for its **empty, loading, error and success**
  states — not just the happy path.

---

## 10. Where to start

Begin with the **design tokens and the type system**, show me those first and
wait for my confirmation. Then do `/roadmap`. Do not generate all five screens
in one response.
