-- Problem competitions: written answers, marks, and a marker.
--
-- Guarded statement by statement, like every migration before it, so running
-- it a second time is a no-op rather than an error.
--
-- Nothing here changes what an existing row means. `Competition.format`
-- defaults to QUIZ, so every competition that already exists stays exactly the
-- quiz it was, and `CompetitionAnswer.points`/`maxPoints` default to 0 and 1 —
-- the values a marked quiz answer already carried implicitly.

DO $$ BEGIN
    CREATE TYPE "CompetitionFormat" AS ENUM ('QUIZ', 'PROBLEMS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE "ProblemAnswerKind" AS ENUM ('NUMERIC', 'SHORT', 'OPEN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE "ProblemGrading" AS ENUM ('AUTO', 'AI', 'HOST');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE "GradedBy" AS ENUM ('PENDING', 'AUTO', 'AI', 'HOST');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "Problem" (
    "id"               TEXT NOT NULL,
    "title"            TEXT NOT NULL DEFAULT 'Problem',
    "topic"            TEXT NOT NULL DEFAULT 'General',
    "statement"        TEXT NOT NULL,
    "imageUrl"         TEXT,
    "answerKind"       "ProblemAnswerKind" NOT NULL DEFAULT 'OPEN',
    "numericValue"     DOUBLE PRECISION,
    "numericTolerance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "acceptedAnswers"  TEXT[],
    "answerHint"       TEXT,
    "solution"         TEXT,
    "maxPoints"        INTEGER NOT NULL DEFAULT 5,
    "gradingMode"      "ProblemGrading" NOT NULL DEFAULT 'HOST',
    "authorId"         TEXT,
    "active"           BOOLEAN NOT NULL DEFAULT true,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Problem_topic_idx"    ON "Problem"("topic");
CREATE INDEX IF NOT EXISTS "Problem_active_idx"   ON "Problem"("active");
CREATE INDEX IF NOT EXISTS "Problem_authorId_idx" ON "Problem"("authorId");

-- SET NULL, not CASCADE: a problem outlives the account that wrote it, and a
-- deleted author must not take a room's questions with them.
DO $$ BEGIN
    ALTER TABLE "Problem" ADD CONSTRAINT "Problem_authorId_fkey"
        FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "Competition" ADD COLUMN IF NOT EXISTS "format"          "CompetitionFormat" NOT NULL DEFAULT 'QUIZ';
ALTER TABLE "Competition" ADD COLUMN IF NOT EXISTS "problemIds"      TEXT[];
ALTER TABLE "Competition" ADD COLUMN IF NOT EXISTS "durationMinutes" INTEGER;
ALTER TABLE "Competition" ADD COLUMN IF NOT EXISTS "gradedAt"        TIMESTAMP(3);

ALTER TABLE "CompetitionAnswer" ADD COLUMN IF NOT EXISTS "text"      TEXT;
ALTER TABLE "CompetitionAnswer" ADD COLUMN IF NOT EXISTS "points"    INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CompetitionAnswer" ADD COLUMN IF NOT EXISTS "maxPoints" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "CompetitionAnswer" ADD COLUMN IF NOT EXISTS "gradedBy"  "GradedBy" NOT NULL DEFAULT 'AUTO';
ALTER TABLE "CompetitionAnswer" ADD COLUMN IF NOT EXISTS "feedback"  TEXT;
ALTER TABLE "CompetitionAnswer" ADD COLUMN IF NOT EXISTS "gradedAt"  TIMESTAMP(3);
ALTER TABLE "CompetitionAnswer" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Quiz answers already on the board were marked right or wrong when they were
-- given, and the standings were built from that. Carry the same fact into the
-- new column so those rooms read identically after this runs. Idempotent: it
-- only touches rows still at the default.
UPDATE "CompetitionAnswer"
   SET "points" = 1
 WHERE "isCorrect" = true AND "points" = 0;

-- The host's marking screen reads one room's unmarked answers at a time.
CREATE INDEX IF NOT EXISTS "CompetitionAnswer_competitionId_gradedBy_idx"
    ON "CompetitionAnswer"("competitionId", "gradedBy");
