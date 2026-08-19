import { NextResponse } from "next/server";
import { Track } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

/**
 * The few numbers the sidebar shows on every page.
 *
 * Deliberately a client-fetched endpoint rather than a query in the app
 * layout: the layout wraps every authenticated page, so a slow or failing
 * lookup there would cost — or break — all of them. Here the worst case is a
 * sidebar that shows navigation and nothing else.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeTrack: true },
    });
    const track = (user?.activeTrack ?? Track.ENTREPRENEURSHIP_ECONOMICS) as Track;

    const [trackProgress, progress, lessonsCompleted] = await Promise.all([
      prisma.trackProgress.findUnique({
        where: { userId_track: { userId, track } },
        select: { currentDay: true, streak: true },
      }),
      prisma.userProgress.findUnique({
        where: { userId },
        select: { hearts: true, streak: true },
      }),
      prisma.completedLesson.count({ where: { userId, track } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        currentDay: trackProgress?.currentDay ?? 1,
        streak: trackProgress?.streak ?? progress?.streak ?? 0,
        hearts: progress?.hearts ?? 5,
        lessonsCompleted,
        totalDays: 56,
      },
    });
  } catch {
    // The sidebar treats any failure as "no data" and renders navigation only.
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
