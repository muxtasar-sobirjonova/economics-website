-- Practice rounds over the multiple-choice bank.
--
-- Guarded, like every migration before it, so running it twice is a no-op.
--
-- A practice round is a DuelRun with rated = false. It is written to the same
-- table on purpose: the set of questions a player has already met is read off
-- DuelRun, so a question answered in practice counts as seen and can never
-- come back in a rated duel. Putting practice anywhere else would have meant
-- remembering to union two tables in that query forever.
--
-- Defaulted true, so every run that already exists stays rated.

ALTER TABLE "DuelRun" ADD COLUMN IF NOT EXISTS "rated" BOOLEAN NOT NULL DEFAULT true;

-- Finding an opponent always filters on it, and those queries look for a
-- finished, unpaired run.
CREATE INDEX IF NOT EXISTS "DuelRun_rated_status_finishedAt_idx"
  ON "DuelRun" ("rated", "status", "finishedAt");
