-- Marking a question for review.
--
-- Guarded, like every migration before it, so running it twice is a no-op.
-- One nullable-by-default boolean; no existing row changes meaning.

ALTER TABLE "CompetitionAnswer" ADD COLUMN IF NOT EXISTS "flagged" BOOLEAN NOT NULL DEFAULT false;
