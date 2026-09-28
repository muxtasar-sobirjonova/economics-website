-- What a room calls a player.
--
-- Guarded, so running it twice is a no-op. One nullable column: a player who
-- never picked a name keeps their own, which is how every existing row reads.

ALTER TABLE "CompetitionPlayer" ADD COLUMN IF NOT EXISTS "alias" TEXT;
