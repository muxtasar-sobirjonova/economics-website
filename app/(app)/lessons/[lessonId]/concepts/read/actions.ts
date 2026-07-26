"use server";

import { auth } from "@/auth";
import { Track } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NoteData } from "@/types";
import { ActionError, ActionResponse, catchActionError } from "@/lib/errors";

export async function saveGlobalNoteAction(note: NoteData): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }

    const userId = session.user.id;

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
          content: note.content,
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
          content: note.content,
          color: note.color,
          source: note.source,
          timestamp: note.timestamp || new Date().toISOString(),
          track: Track.ENTREPRENEURSHIP_ECONOMICS,
        },
      });
    }
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
    return { success: true, data: undefined };
  } catch (error) {
    console.error("Failed to delete note:", error);
    return catchActionError(error);
  }
}
