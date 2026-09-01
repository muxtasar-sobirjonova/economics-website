# Handoff

Written so a fresh session can pick this up without re-deriving anything.
Everything below was true at commit `6cba9fc`.

---

## The project

**That's So Econ** (`thatssoecon.uz`) — a Next.js 14 App Router site teaching a
56-day economics curriculum. Prisma + PostgreSQL on Supabase, NextAuth v5
(Google + credentials), deployed on Vercel.

The learner-facing curriculum (`/home`, `/roadmap`, lessons, `/leaderboard`)
predates this work. Recent work added four things:

| Page           | What it is                                                              |
| -------------- | ----------------------------------------------------------------------- |
| `/internships` | Directory of 702 organisations across 14 regions, with a choropleth map |
| `/research`    | 208 university faculty, ranked by department depth                      |
| `/duel`        | A **rated** 1v1 economics ladder with Elo                               |
| `/compete`     | **Unrated** Blooket-style competition rooms                             |

---

## Working conventions

The user writes in Uzbek and expects Uzbek replies. Code, comments and commit
messages are in English.

**No database access.** There are no working credentials on this machine —
`DATABASE_URL` and `DIRECT_URL` are sensitive Vercel variables that cannot be
read back, and the local `.env` holds placeholders. Every migration has been
run by the user pasting SQL into the **Supabase SQL editor**. Nothing in the
duel or competition code has ever been executed against a real database by the
assistant.

This shapes the whole approach:

- Risky logic is written as **pure functions with tests** so it can be verified
  without a database. The Prisma layer is thin on top.
- UI is checked by rendering components with mock data in a throwaway
  `app/dev-*` route, measuring in the browser (horizontal scroll, clipped text,
  tap targets under 44px, contrast), then **deleting the route before
  committing**. Do not leave `dev-*` routes in a commit.
- Migrations are hand-written SQL, **guarded statement by statement**
  (`CREATE IF NOT EXISTS`, enum and FK wrapped against `duplicate_object`) so
  they are safe to run more than once. This matters: `LeaderboardRank` was once
  in the schema with no migration, so the table never existed and every read of
  it failed.

Checks before every commit: `npx tsc --noEmit`, `npx next lint`,
`npx vitest run`, `npx next build`. All must be clean.

---

## State of play

### Migrations

| Migration                     | Ran?                        |
| ----------------------------- | --------------------------- |
| `20260824_add_duel_mode`      | ✅ yes — `/duel` works live |
| `20260828_add_competitions`   | ✅ yes — `/compete` loads   |
| `20260827_add_daily_question` | ⚠️ **unverified**           |

The daily question is loaded inside a `try/catch` on `/duel`, so a missing
`DailyAnswer` table fails silently and the block simply does not render. Check:

```sql
select table_name from information_schema.tables
where table_name in ('Staff','Competition','CompetitionPlayer','CompetitionAnswer','DailyAnswer')
order by table_name;
```

Five rows expected. If `DailyAnswer` is missing, run
`prisma/migrations/20260827_add_daily_question/migration.sql`.

### Environment

`ADMIN_EMAILS` is set in Vercel (Production, Secret). It defines the **owner** —
the root of the permission tree, deliberately outside the database so a mistake
in the app can never lock everyone out. The user has several Google accounts
with confusingly similar addresses; if the host button or `/duel/bank` is
missing, the signed-in email does not match this variable.

### Question bank

**100 questions**, written by the assistant, spread across six topics
(Microeconomics 22, Macroeconomics 20, Entrepreneurship 16, Finance 14,
Behavioural 14, Development 14).

`content-duel-questions.csv` and `bank.sql` are **gitignored on purpose** — this
repository is public, and a bank with its answers in it would make the rating
measure who read GitHub. The database is the source of truth once loaded.

Regenerate the SQL with:

```bash
npm run duel:sql -- content-duel-questions.csv --out bank.sql
```

Use `--out`, not `> bank.sql`: `npm run` prints its own banner to stdout and it
lands in the file.

---

## The binding constraint

**100 questions ÷ 10 per duel = 10 duels before a player meets repeats.**

No feature changes this. The question editor at `/duel/bank` exists precisely to
take the developer out of the content loop — anyone with `MANAGE_QUESTIONS` can
now write questions in a form. Growing the bank is more valuable than any
remaining feature.

Competitions are cheap on content by comparison: thirty players see the same
twenty questions, so a competition consumes twenty, not twenty per player.

---

## Duel mode

Rated, Elo, asynchronous.

**Why asynchronous.** With this many users a live queue is always empty. The
first player to face a set leaves it `OPEN`; the next is dealt the identical set
and both are settled on submit. Live pairing sits on top: someone who started in
the last five minutes is preferred, so two people pressing start together do
meet.

### Rules enforced in the database, not in code

- `DuelRun` unique on `(userId, setId)` — two tabs racing cannot produce a
  second attempt at questions already seen.
- `Duel` unique on each run id — one lucky round settles one duel and cannot be
  farmed for rating against several challengers.

### Rules that took judgement

- **The correct answer is never selected** when serving a duel. Not fetched and
  stripped later — never fetched, so no refactor downstream can leak it.
- **The tiebreak clock is the server's**, measured from run creation to
  submission. Per-question client times are display only; a client that reports
  its own time will eventually report zero.
- **Answers match by question id, never by position**, so a reordered payload
  cannot shift a correct answer onto a different question.
- **Options are shuffled per serve.** The bank stores one order, and at one
  point every correct answer in it sat in slot A.
- **Answers open only once a duel is settled.** A set still waiting for a
  challenger is in circulation; showing its answers to the player who just
  finished shows them to whoever they talk to next.
- **The clock is not reset when resuming** an unfinished run, or reloading would
  buy thinking time. The board says so rather than letting the player lose a
  tiebreak mysteriously.

### Elo

`lib/duel/elo.ts`. Start 1000, K=40 for the first ten duels then 20. A decided
duel always moves the ladder by at least a point — across a 900-point gap the
raw delta rounds below half, and a win displayed as `+0` reads as a bug.

### Other pieces

- **Ghost race** — you are playing a run that already happened, so the
  opponent's per-question time and running score are shown. Never their answer:
  knowing they were right does not narrow four options; knowing their answer
  gives it away.
- **Review** (`/duel/[runId]`) — both sets of answers side by side with
  explanations, and the rows where exactly one player got it are marked.
  Correctness is **recomputed** against the question rather than read from the
  flag stored at grading time, so a corrected question reviews against the truth.
- **Challenge links** — `/duel?face=<runId>`. Declined silently when stale,
  already settled, or sent back to its author; the engine falls through to an
  ordinary duel rather than showing an error.
- **Rematch** — prefers a set that opponent is waiting on, falls through
  otherwise. A preference, not a promise.
- **Rating graph** — reconstructed by walking deltas forward from 1000, which is
  exact.
- **Question of the day** — one question for everyone, chosen deterministically
  from the date so no cron picks it. Day is a calendar string in
  `Asia/Tashkent`, not a timestamp: "one a day" is a question about dates.

### Calibration — `/duel/bank`

Four options means guessing scores 25%. A question served enough times and
landing **at or below 15%** is flagged _Check the key_: genuinely hard questions
still clear chance because some players know the answer, so falling far under it
is the signature of a **wrong answer key**, not difficulty. Above 95% is flagged
too — real, but it separates nobody.

The first real duels came back 2/10, 3/10, 2/10, which is chance level. Whether
that is a hard bank or bad keys is exactly what this page is for. **Come back to
it after a week of play** — that data should decide whether the 20-second timer
is too short, not a guess.

Retiring sets `active = false` and never deletes: the counters are the evidence
that sent someone there.

---

## Competitions

Unrated, host-run rooms. `/compete`.

**Unrated on purpose.** The host chooses length and topic, so results are not
comparable between events and must never reach Elo. That constraint is what lets
a host set whatever rules they like.

**⚠️ The trap that was closed.** A player who meets a question in a competition
knows the answer. Competition answers now count toward the same "seen" set the
duel engine keeps, so those questions never appear in that player's rated duels.
Without this every competition would have quietly corrupted the ladder, and the
damage would have been invisible. **Any new way of showing a question to a
player must feed the same set.**

**Self-paced, not host-advanced.** Players answer at their own speed inside the
window while standings update underneath. Kahoot-style lockstep is more dramatic
and much more fragile — one slow connection, one reload, one late arrival each
become a problem. Here a reload resumes at the first unanswered question and
joining late costs only the clock.

**Live without sockets.** Polling every 2.5–4 seconds. Vercel cannot hold a
WebSocket open; if polling ever becomes a cost problem, Supabase Realtime is
already available and needs no new service.

**Ending is the host's call.** Everyone having finished does not mean everyone
has arrived, and a room that closed itself would shut out someone who joined a
minute ago.

Right and wrong stay hidden until the competition **ends** — a player who
finishes early is still in a room where others are answering.

---

## Permissions

Telegram-shaped. `lib/permissions.ts` (pure, tested) and `lib/staff.ts`.

- **Owner** comes from `ADMIN_EMAILS`, holds everything, cannot be demoted from
  inside the app.
- **Admins** live in the `Staff` table with a list of `StaffPermission`:
  `HOST_COMPETITIONS`, `MANAGE_QUESTIONS`, `MANAGE_ADMINS`.
- An admin may **only grant rights they hold themselves** — without this rule
  anyone with `MANAGE_ADMINS` could promote themselves to everything.
- **Nobody may edit their own rights.** That stops the attack and the accident
  in one.

Managed at `/admin/staff`, which is **not linked from the navigation** — it is
visible to a handful of people, and a link would be noise for everyone else.
Pages that a viewer may not use return **404, not a refusal**: a page whose
existence is a hint should not be there.

---

## Design system

Tokens live in `app/globals.css` under a `.theme-v2` opt-in class; Tailwind
names in `tailwind.config.ts` map onto them. **Class names and variable names
differ** and this has caused real bugs twice:

| Tailwind class | CSS variable |
| -------------- | ------------ |
| `text-ink`     | `--text`     |
| `border-line`  | `--border`   |

An inline `fill="var(--ink)"` fails silently — SVG falls back to black, correct
on white and invisible in dark mode. `tests/cssTokens.test.ts` now reads
`globals.css` and fails on any `var(--x)` used in source but never defined. It
has already caught the second occurrence.

Also note: **`white/N` opacity utilities render nothing** across the whole app,
because `white` is mapped to `var(--white)` and Tailwind 3 cannot apply an
opacity modifier to a bare `var()`. About 17 usages are silently transparent.
Use an explicit `rgba()`. There is a pending task to fix this at the root, which
would make all 17 appear at once and needs each checked visually.

The site's visual language is **isometric blocks** — the roadmap plot, the
leaderboard podium, the duel towers, the sidebar skyline. New visuals should
speak it.

`tsconfig.json` now sets `"target": "ES2017"`. Without it tsc assumed ES5 and
rejected iterating a `Set` or `Map`, which blocked three correct changes.

---

## Tests

171 passing. The pattern is to test **the pure half**: Elo, grading, question
selection, CSV parsing and import validation, SQL escaping, review building,
calibration thresholds, permissions, join codes, competition setup, daily
question selection, and the CSS token guard.

Two tests once failed on assertions rather than code — a semicolon count across
a whole file and a spread threshold that sat on a sample minimum. In both cases
the fix was to **assert the property**, not loosen the number.

---

## What is worth doing next

1. **Write questions.** The bank is the constraint. Everything else is second.
2. **Wait a week, then read `/duel/bank`.** It will say whether keys are wrong
   or the bank is merely hard, and whether the 20-second timer needs changing.
3. Per-topic accuracy on a profile — the data is already in `DuelRun.answers`
   plus `DuelQuestion.topic`, no migration needed.
4. Daily streak — free from `DailyAnswer`.
5. Notification when a duel settles — needs a `lastSeenAt` column.

Deliberately **not** yet: time controls (bullet/blitz/rapid), topic-filtered
rated duels, tournaments. All three fragment a player pool that is already too
small; they make sense once there are more people.
