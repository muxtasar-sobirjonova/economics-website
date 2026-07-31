import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Instantly fetch from the pre-calculated 12-hour cron table
    const myRankResult = await prisma.leaderboardRank.findUnique({
      where: { userId }
    });

    const totalUsers = await prisma.leaderboardRank.count();

    if (!myRankResult) {
      return NextResponse.json({
        success: true,
        data: {
          rank: null,
          lessonsCompleted: 0,
          totalXP: 0,
          totalUsers
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        rank: myRankResult.rank,
        lessonsCompleted: myRankResult.lessonsCompleted,
        totalXP: myRankResult.totalXP,
        totalUsers
      }
    });
  } catch (error) {
    console.error("Leaderboard /me GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch current user rank" }, { status: 500 });
  }
}
