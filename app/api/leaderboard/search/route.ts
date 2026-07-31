import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query || query.trim() === "") {
      return NextResponse.json({ success: true, data: [] });
    }

    const searchResults = await prisma.leaderboardRank.findMany({
      where: {
        username: {
          contains: query,
          mode: 'insensitive' // case-insensitive search
        }
      },
      orderBy: { rank: 'asc' },
      take: 20,
      select: {
        userId: true,
        username: true,
        profileImage: true,
        lessonsCompleted: true,
        totalXP: true,
        rank: true
      }
    });

    // Map userId to id for frontend compatibility
    const mappedSearchResults = searchResults.map(user => ({
      id: user.userId,
      username: user.username,
      profileImage: user.profileImage,
      lessonsCompleted: user.lessonsCompleted,
      totalXP: user.totalXP,
      rank: user.rank
    }));

    const responseData = {
      success: true,
      data: mappedSearchResults,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Leaderboard Search GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to search leaderboard" }, { status: 500 });
  }
}
