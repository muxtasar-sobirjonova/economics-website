"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

import { NoteData } from "@/types";

export async function saveGlobalNoteAction(note: NoteData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const existingNote = await prisma.note.findUnique({
      where: { id: note.id },
    });

    if (existingNote) {
      if (existingNote.userId !== userId) {
        return { error: "Unauthorized" };
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
        },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to save note:", error);
    return { error: "Failed to save note" };
  }
}

export async function deleteGlobalNoteAction(noteId: string, lessonId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (existingNote) {
      if (existingNote.userId !== userId) {
        return { error: "Unauthorized" };
      }
      await prisma.note.delete({
        where: { id: noteId, userId },
      });
    }
    return { success: true };
  } catch (error) {
    console.error("Failed to delete note:", error);
    return { error: "Failed to delete note" };
  }
}
