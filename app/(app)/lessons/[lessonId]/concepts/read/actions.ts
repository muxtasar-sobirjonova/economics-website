"use server";

import { auth } from "@/auth";
import { Track } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NoteData } from "@/types";
import { ActionError, ActionResponse, catchActionError } from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { rateLimit } from "@/lib/rate-limit";

export async function saveGlobalNoteAction(note: NoteData): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }

    const userId = session.user.id;

    const content = (note.content || "").trim();
    if (!content) {
      throw new ActionError("Note is empty", "BAD_REQUEST");
    }
    if (content.length > 5000) {
      throw new ActionError("Note is too long (max 5000 characters)", "BAD_REQUEST");
    }

    const limiter = await rateLimit(`notes:${userId}`, { interval: 60000, limit: 30 });
    if (!limiter.success) {
      throw new ActionError("Too many requests. Please try again in a minute.");
    }

    // The note must belong to the track the user is currently studying,
    // otherwise it never shows up on the My Notes page.
    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeTrack: true },
    });
    const track: Track = userRecord?.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;

    const existingNote = await prisma.note.findUnique({
      where: { id: note.id },
    });

    if (existingNote) {
      if (existingNote.userId !== userId) {
        throw new ActionError("Unauthorized", "UNAUTHORIZED");
      }
      await prisma.note.update({
        where: { id: note.id, userId },
        data: {
          content,
          color: note.color,
          source: note.source,
          timestamp: note.timestamp || new Date().toISOString(),
        },
      });
    } else {
      await prisma.note.create({
        data: {
          id: note.id,
          userId,
          lessonId: note.lessonId,
          content,
          color: note.color,
          source: note.source,
          timestamp: note.timestamp || new Date().toISOString(),
          track,
        },
      });
    }

    revalidatePath("/saved");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to save note:", error);
    return catchActionError(error);
  }
}

export async function deleteGlobalNoteAction(noteId: string): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }

    const userId = session.user.id;

    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (existingNote) {
      if (existingNote.userId !== userId) {
        throw new ActionError("Unauthorized", "UNAUTHORIZED");
      }
      await prisma.note.delete({
        where: { id: noteId, userId },
      });
    }

    revalidatePath("/saved");
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete note:", error);
    return catchActionError(error);
  }
}
