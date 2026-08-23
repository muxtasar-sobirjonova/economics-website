-- Duel mode: a rated head-to-head ladder.
--
-- Nothing here touches the curriculum tables. Every statement is guarded so
-- the migration can be re-run against a database that already has part of it
-- applied — the LeaderboardRank drift showed that mattering here.

DO $$
BEGIN
    CREATE TYPE "DuelRunStatus" AS ENUM ('OPEN', 'MATCHED', 'ABANDONED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "DuelQuestion" (
    "id"            TEXT NOT NULL,
    "topic"         TEXT NOT NULL,
    "questionText"  TEXT NOT NULL,
    "options"       TEXT[],
    "correctAnswer" TEXT NOT NULL,
    "explanation"   TEXT,
    "timesServed"   INTEGER NOT NULL DEFAULT 0,
    "timesCorrect"  INTEGER NOT NULL DEFAULT 0,
    "active"        BOOLEAN NOT NULL DEFAULT true,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DuelQuestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "DuelQuestion_topic_idx"  ON "DuelQuestion"("topic");
CREATE INDEX IF NOT EXISTS "DuelQuestion_active_idx" ON "DuelQuestion"("active");

CREATE TABLE IF NOT EXISTS "DuelSet" (
    "id"          TEXT NOT NULL,
    "questionIds" TEXT[],
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DuelSet_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "DuelSet_createdAt_idx" ON "DuelSet"("createdAt");

CREATE TABLE IF NOT EXISTS "DuelRun" (
    "id"           TEXT NOT NULL,
    "userId"       TEXT NOT NULL,
    "setId"        TEXT NOT NULL,
    "answers"      JSONB NOT NULL DEFAULT '[]',
    "score"        INTEGER NOT NULL DEFAULT 0,
    "totalMs"      INTEGER NOT NULL DEFAULT 0,
    "ratingBefore" INTEGER NOT NULL,
    "status"       "DuelRunStatus" NOT NULL DEFAULT 'OPEN',
    "startedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt"   TIMESTAMP(3),

    CONSTRAINT "DuelRun_pkey" PRIMARY KEY ("id")
);

-- A player faces a given set once. At the database level, so two tabs racing
-- each other cannot produce a second attempt at the same questions.
CREATE UNIQUE INDEX IF NOT EXISTS "DuelRun_userId_setId_key" ON "DuelRun"("userId", "setId");
CREATE INDEX IF NOT EXISTS "DuelRun_status_startedAt_idx"    ON "DuelRun"("status", "startedAt");
CREATE INDEX IF NOT EXISTS "DuelRun_userId_idx"              ON "DuelRun"("userId");

CREATE TABLE IF NOT EXISTS "Duel" (
    "id"        TEXT NOT NULL,
    "setId"     TEXT NOT NULL,
    "runAId"    TEXT NOT NULL,
    "runBId"    TEXT NOT NULL,
    "winnerId"  TEXT,
    "deltaA"    INTEGER NOT NULL,
    "deltaB"    INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Duel_pkey" PRIMARY KEY ("id")
);

-- One run settles one duel: a lucky round cannot be farmed against several
-- challengers.
CREATE UNIQUE INDEX IF NOT EXISTS "Duel_runAId_key"  ON "Duel"("runAId");
CREATE UNIQUE INDEX IF NOT EXISTS "Duel_runBId_key"  ON "Duel"("runBId");
CREATE INDEX        IF NOT EXISTS "Duel_createdAt_idx" ON "Duel"("createdAt");

CREATE TABLE IF NOT EXISTS "PlayerRating" (
    "userId"    TEXT NOT NULL,
    "rating"    INTEGER NOT NULL DEFAULT 1000,
    "played"    INTEGER NOT NULL DEFAULT 0,
    "won"       INTEGER NOT NULL DEFAULT 0,
    "lost"      INTEGER NOT NULL DEFAULT 0,
    "drawn"     INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayerRating_pkey" PRIMARY KEY ("userId")
);

CREATE INDEX IF NOT EXISTS "PlayerRating_rating_idx" ON "PlayerRating"("rating");

DO $$
BEGIN
    ALTER TABLE "DuelRun" ADD CONSTRAINT "DuelRun_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE "DuelRun" ADD CONSTRAINT "DuelRun_setId_fkey"
        FOREIGN KEY ("setId") REFERENCES "DuelSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE "Duel" ADD CONSTRAINT "Duel_setId_fkey"
        FOREIGN KEY ("setId") REFERENCES "DuelSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE "Duel" ADD CONSTRAINT "Duel_runAId_fkey"
        FOREIGN KEY ("runAId") REFERENCES "DuelRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE "Duel" ADD CONSTRAINT "Duel_runBId_fkey"
        FOREIGN KEY ("runBId") REFERENCES "DuelRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
    ALTER TABLE "PlayerRating" ADD CONSTRAINT "PlayerRating_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
