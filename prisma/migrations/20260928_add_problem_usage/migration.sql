-- How often a problem has been set.
--
-- Guarded, like every migration before it, so running it twice is a no-op.
-- One counter, defaulted to zero: problems already in the bank read as unused,
-- which is true of every room opened before this column existed.

ALTER TABLE "Problem" ADD COLUMN IF NOT EXISTS "timesUsed" INTEGER NOT NULL DEFAULT 0;

-- Backfill from the rooms that already exist, so the counter starts honest
-- rather than at zero for problems that have been set a dozen times.
-- Idempotent: it recomputes from the competitions table every run.
UPDATE "Problem" p
   SET "timesUsed" = COALESCE(u.n, 0)
  FROM (
        SELECT pid AS id, COUNT(*) AS n
          FROM "Competition", UNNEST("problemIds") AS pid
         GROUP BY pid
       ) u
 WHERE p."id" = u.id AND p."timesUsed" <> u.n;
