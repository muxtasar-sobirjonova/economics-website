-- Staff permissions and competitions.
--
-- Guarded throughout, like the duel migrations, so it is safe to run twice.
-- Nothing here alters an existing table except by adding foreign keys that
-- point at User; no curriculum or duel data is touched.

DO $$ BEGIN
    CREATE TYPE "StaffPermission" AS ENUM ('HOST_COMPETITIONS', 'MANAGE_QUESTIONS', 'MANAGE_ADMINS');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE "CompetitionStatus" AS ENUM ('LOBBY', 'RUNNING', 'ENDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE "CompetitionAccess" AS ENUM ('OPEN', 'LINK');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "Staff" (
    "userId"      TEXT NOT NULL,
    "permissions" "StaffPermission"[],
    "grantedById" TEXT,
    "note"        TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("userId")
);

CREATE TABLE IF NOT EXISTS "Competition" (
    "id"                 TEXT NOT NULL,
    "code"               TEXT NOT NULL,
    "title"              TEXT NOT NULL,
    "hostId"             TEXT NOT NULL,
    "status"             "CompetitionStatus" NOT NULL DEFAULT 'LOBBY',
    "access"             "CompetitionAccess" NOT NULL DEFAULT 'OPEN',
    "questionIds"        TEXT[],
    "topic"              TEXT,
    "secondsPerQuestion" INTEGER NOT NULL DEFAULT 25,
    "createdAt"          TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt"          TIMESTAMP(3),
    "endedAt"            TIMESTAMP(3),

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("id")
);

-- A join code names exactly one competition.
CREATE UNIQUE INDEX IF NOT EXISTS "Competition_code_key"            ON "Competition"("code");
CREATE INDEX        IF NOT EXISTS "Competition_status_createdAt_idx" ON "Competition"("status", "createdAt");
CREATE INDEX        IF NOT EXISTS "Competition_hostId_idx"           ON "Competition"("hostId");

CREATE TABLE IF NOT EXISTS "CompetitionPlayer" (
    "id"            TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "userId"        TEXT NOT NULL,
    "score"         INTEGER NOT NULL DEFAULT 0,
    "totalMs"       INTEGER NOT NULL DEFAULT 0,
    "answered"      INTEGER NOT NULL DEFAULT 0,
    "joinedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt"    TIMESTAMP(3),

    CONSTRAINT "CompetitionPlayer_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "CompetitionPlayer_competitionId_userId_key" ON "CompetitionPlayer"("competitionId", "userId");
CREATE INDEX        IF NOT EXISTS "CompetitionPlayer_competitionId_score_idx"  ON "CompetitionPlayer"("competitionId", "score");

CREATE TABLE IF NOT EXISTS "CompetitionAnswer" (
    "id"            TEXT NOT NULL,
    "competitionId" TEXT NOT NULL,
    "userId"        TEXT NOT NULL,
    "questionId"    TEXT NOT NULL,
    "chosen"        TEXT,
    "isCorrect"     BOOLEAN NOT NULL DEFAULT false,
    "ms"            INTEGER NOT NULL DEFAULT 0,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompetitionAnswer_pkey" PRIMARY KEY ("id")
);

-- One answer per question per player: a double submit cannot score twice.
CREATE UNIQUE INDEX IF NOT EXISTS "CompetitionAnswer_competitionId_userId_questionId_key"
    ON "CompetitionAnswer"("competitionId", "userId", "questionId");
CREATE INDEX IF NOT EXISTS "CompetitionAnswer_competitionId_idx" ON "CompetitionAnswer"("competitionId");
CREATE INDEX IF NOT EXISTS "CompetitionAnswer_userId_idx"        ON "CompetitionAnswer"("userId");

DO $$ BEGIN
    ALTER TABLE "Staff" ADD CONSTRAINT "Staff_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Competition" ADD CONSTRAINT "Competition_hostId_fkey"
        FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "CompetitionPlayer" ADD CONSTRAINT "CompetitionPlayer_competitionId_fkey"
        FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "CompetitionPlayer" ADD CONSTRAINT "CompetitionPlayer_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "CompetitionAnswer" ADD CONSTRAINT "CompetitionAnswer_competitionId_fkey"
        FOREIGN KEY ("competitionId") REFERENCES "Competition"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "CompetitionAnswer" ADD CONSTRAINT "CompetitionAnswer_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
