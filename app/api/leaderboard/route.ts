import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = (page - 1) * limit;

    // Instantly fetch from the pre-calculated 12-hour cron table
    const leaderboard = await prisma.leaderboardRank.findMany({
      orderBy: { rank: 'asc' },
      skip: offset,
      take: limit,
      select: {
        userId: true, // Need this as "id" for the client
        username: true,
        profileImage: true,
        lessonsCompleted: true,
        totalXP: true,
        rank: true
      }
    });

    // Map userId to id for frontend compatibility
    const mappedLeaderboard = leaderboard.map(user => ({
      id: user.userId,
      username: user.username,
      profileImage: user.profileImage,
      lessonsCompleted: user.lessonsCompleted,
      totalXP: user.totalXP,
      rank: user.rank
    }));

    const totalUsers = await prisma.leaderboardRank.count();

    const responseData = {
      success: true,
      data: mappedLeaderboard,
      pagination: {
        page,
        limit,
        total: totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      }
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Leaderboard GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch leaderboard" }, { status: 500 });
  }
}
