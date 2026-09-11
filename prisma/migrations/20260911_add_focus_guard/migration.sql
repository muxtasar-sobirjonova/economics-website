-- Watching whether someone stayed on the page.
--
-- Guarded statement by statement, like every migration before it, so running
-- it a second time is a no-op rather than an error.
--
-- Nothing here changes what an existing row means. `focusPolicy` defaults to
-- NONE, so every competition that already exists is watched exactly as much as
-- it was before this ran: not at all.

DO $$ BEGIN
    CREATE TYPE "FocusPolicy" AS ENUM ('NONE', 'WARN', 'LOCK');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "Competition" ADD COLUMN IF NOT EXISTS "focusPolicy"    "FocusPolicy" NOT NULL DEFAULT 'NONE';
ALTER TABLE "Competition" ADD COLUMN IF NOT EXISTS "focusAllowance" INTEGER NOT NULL DEFAULT 2;

ALTER TABLE "CompetitionPlayer" ADD COLUMN IF NOT EXISTS "awayLog"   JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "CompetitionPlayer" ADD COLUMN IF NOT EXISTS "awayCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CompetitionPlayer" ADD COLUMN IF NOT EXISTS "awayMs"    INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "CompetitionPlayer" ADD COLUMN IF NOT EXISTS "lockedAt"  TIMESTAMP(3);
