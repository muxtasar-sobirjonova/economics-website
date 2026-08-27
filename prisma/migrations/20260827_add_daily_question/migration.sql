-- One shared question a day. Guarded like the duel migration so it is safe to
-- run more than once.

CREATE TABLE IF NOT EXISTS "DailyAnswer" (
    "id"         TEXT NOT NULL,
    "userId"     TEXT NOT NULL,
    "day"        TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "chosen"     TEXT,
    "isCorrect"  BOOLEAN NOT NULL DEFAULT false,
    "ms"         INTEGER NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyAnswer_pkey" PRIMARY KEY ("id")
);

-- One answer per player per day, enforced here rather than in code so two
-- tabs cannot both slip through.
CREATE UNIQUE INDEX IF NOT EXISTS "DailyAnswer_userId_day_key" ON "DailyAnswer"("userId", "day");
CREATE INDEX        IF NOT EXISTS "DailyAnswer_day_idx"        ON "DailyAnswer"("day");

DO $$
BEGIN
    ALTER TABLE "DailyAnswer" ADD CONSTRAINT "DailyAnswer_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
