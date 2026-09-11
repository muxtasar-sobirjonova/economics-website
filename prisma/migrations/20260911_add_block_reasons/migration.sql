-- Blocking someone, with a reason, and disqualifying them afterwards.
--
-- Guarded statement by statement, like every migration before it, so running
-- it a second time is a no-op rather than an error.
--
-- Nothing here changes what an existing row means: every column is nullable
-- and nothing is backfilled. A player who was never blocked reads exactly as
-- they did before this ran.

ALTER TABLE "CompetitionPlayer" ADD COLUMN IF NOT EXISTS "lockReason"       TEXT;
ALTER TABLE "CompetitionPlayer" ADD COLUMN IF NOT EXISTS "lockedById"       TEXT;
ALTER TABLE "CompetitionPlayer" ADD COLUMN IF NOT EXISTS "disqualifiedAt"   TIMESTAMP(3);
ALTER TABLE "CompetitionPlayer" ADD COLUMN IF NOT EXISTS "disqualifyReason" TEXT;

-- The host's end-of-room review reads one room's disqualified players.
CREATE INDEX IF NOT EXISTS "CompetitionPlayer_competitionId_disqualifiedAt_idx"
    ON "CompetitionPlayer"("competitionId", "disqualifiedAt");
