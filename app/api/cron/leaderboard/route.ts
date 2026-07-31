import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

// Fix #1: Allow Vercel to run this function for up to 5 minutes (requires Pro for 5m, defaults to max available)
export const maxDuration = 300; 

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (
      process.env.NODE_ENV === 'production' && 
      process.env.CRON_SECRET && 
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    console.log("Running leaderboard cron job...");

    // Run within a transaction
    await prisma.$transaction(async (tx) => {
      // Fix #2: "Blue/Green" atomic UPSERT. No TRUNCATE lock, no flicker.
      // Readers see the old data until the instant this transaction commits.
      await tx.$executeRaw`
        INSERT INTO "LeaderboardRank" ("userId", "username", "profileImage", "lessonsCompleted", "totalXP", "rank")
        WITH RankedUsers AS (
          SELECT 
            u.id, 
            u.name as username, 
            u.image as "profileImage", 
            u."lessonsCompleted",
            COALESCE(up."totalXP", 0) as "totalXP",
            RANK() OVER (
              ORDER BY u."lessonsCompleted" DESC, 
              u."lastLessonCompletedAt" ASC NULLS LAST, 
              u."createdAt" ASC
            ) as rank
          FROM "User" u
          LEFT JOIN "UserProgress" up ON u.id = up."userId"
          WHERE u."lessonsCompleted" > 0
        )
        SELECT 
          id, 
          username, 
          "profileImage", 
          "lessonsCompleted", 
          CAST("totalXP" as INTEGER) as "totalXP",
          CAST(rank as INTEGER) as rank
        FROM RankedUsers
        ON CONFLICT ("userId") DO UPDATE SET
          "username" = EXCLUDED."username",
          "profileImage" = EXCLUDED."profileImage",
          "lessonsCompleted" = EXCLUDED."lessonsCompleted",
          "totalXP" = EXCLUDED."totalXP",
          "rank" = EXCLUDED."rank"
      `;

      // Clean up any stale records of users who dropped to 0 lessons (if that ever happens)
      await tx.$executeRaw`
        DELETE FROM "LeaderboardRank" 
        WHERE "userId" NOT IN (SELECT id FROM "User" WHERE "lessonsCompleted" > 0)
      `;
    });

    console.log("Leaderboard cron job completed successfully.");

    return NextResponse.json({ success: true, message: "Leaderboard updated successfully" });
  } catch (error) {
    console.error("Leaderboard Cron Error:", error);
    return NextResponse.json({ success: false, error: "Failed to update leaderboard" }, { status: 500 });
  }
}
