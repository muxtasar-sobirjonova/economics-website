-- Practice: one person working one problem on their own.
--
-- Guarded, like every migration before it, so running it twice is a no-op.
--
-- Its own table rather than a CompetitionAnswer with a null competition. A
-- practice attempt must never be counted into somebody's room score, and the
-- surest way to guarantee that is for it to live somewhere the scoring queries
-- cannot reach.

CREATE TABLE IF NOT EXISTS "ProblemAttempt" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "problemId" TEXT NOT NULL,
  "text"      TEXT NOT NULL,
  "points"    INTEGER NOT NULL DEFAULT 0,
  "maxPoints" INTEGER NOT NULL DEFAULT 0,
  "gradedBy"  "GradedBy" NOT NULL DEFAULT 'AUTO',
  "feedback"  TEXT,
  "ms"        INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProblemAttempt_pkey" PRIMARY KEY ("id")
);

-- One attempt per problem per person. Practising a problem twice is reading
-- the solution and typing it back, which teaches nobody anything.
CREATE UNIQUE INDEX IF NOT EXISTS "ProblemAttempt_userId_problemId_key"
  ON "ProblemAttempt" ("userId", "problemId");

CREATE INDEX IF NOT EXISTS "ProblemAttempt_userId_createdAt_idx"
  ON "ProblemAttempt" ("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "ProblemAttempt_problemId_idx"
  ON "ProblemAttempt" ("problemId");

DO $$ BEGIN
  ALTER TABLE "ProblemAttempt"
    ADD CONSTRAINT "ProblemAttempt_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE "ProblemAttempt"
    ADD CONSTRAINT "ProblemAttempt_problemId_fkey"
    FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Whether a problem may be practised at all.
--
-- Defaulted true, so the whole bank is practisable the day this runs. A host
-- saving a problem for a paper turns it off before setting the paper: that
-- prevents the leak, where the counter below only reports it.
ALTER TABLE "Problem" ADD COLUMN IF NOT EXISTS "practiceOpen" BOOLEAN NOT NULL DEFAULT true;

-- How many people have practised it.
--
-- Practice hands back the worked solution, so a problem with a number here is
-- one part of the room may already have the answer to. A host setting a paper
-- has to be able to see that, which is the whole reason this counter is on the
-- problem rather than being left to a COUNT at read time.
ALTER TABLE "Problem" ADD COLUMN IF NOT EXISTS "timesPractised" INTEGER NOT NULL DEFAULT 0;

-- Backfill, so the counter starts honest on a second run rather than drifting
-- below the attempts already recorded. Idempotent: it recomputes every run.
UPDATE "Problem" p
   SET "timesPractised" = COALESCE(a.n, 0)
  FROM (
        SELECT "problemId" AS id, COUNT(*) AS n
          FROM "ProblemAttempt"
         GROUP BY "problemId"
       ) a
 WHERE p."id" = a.id AND p."timesPractised" <> a.n;
