-- LeaderboardRank has been in schema.prisma without a migration, so the table
-- was never created. Every read of it — the board, the API and the 12-hour cron
-- that fills it — failed with "relation does not exist".
-- Guarded so it is safe to run against a database where it already exists.

CREATE TABLE IF NOT EXISTS "LeaderboardRank" (
    "userId" TEXT NOT NULL,
    "username" TEXT,
    "profileImage" TEXT,
    "lessonsCompleted" INTEGER NOT NULL,
    "totalXP" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,

    CONSTRAINT "LeaderboardRank_pkey" PRIMARY KEY ("userId")
);

CREATE INDEX IF NOT EXISTS "LeaderboardRank_rank_idx" ON "LeaderboardRank"("rank");
CREATE INDEX IF NOT EXISTS "LeaderboardRank_username_idx" ON "LeaderboardRank"("username");

DO $$
BEGIN
    ALTER TABLE "LeaderboardRank"
        ADD CONSTRAINT "LeaderboardRank_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;
