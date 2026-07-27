"use server";
import { Track } from "@prisma/client";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function saveDailyChallengeThought(content: string, challengeId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  // Find existing note for today's challenge
  const existingNote = await prisma.note.findFirst({
    where: {
      userId: session.user.id,
      source: `DailyChallenge-${challengeId}`
    }
  });

  if (existingNote) {
    if (!content.trim()) {
      // If content is completely empty, delete it
      return prisma.note.delete({
        where: { id: existingNote.id }
      });
    }
    return prisma.note.update({
      where: { id: existingNote.id },
      data: { content }
    });
  } else {
    if (!content.trim()) return; // Don't create empty notes
    const userRecord = await prisma.user.findUnique({ where: { id: session.user.id }, select: { activeTrack: true } });
    const activeTrack = userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;
    return prisma.note.create({
      data: {
        userId: session.user.id,
        content,
        source: `DailyChallenge-${challengeId}`,
        color: "#F8F9FC", 
        track: activeTrack
      }
    });
  }
}
