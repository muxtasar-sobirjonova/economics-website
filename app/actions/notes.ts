"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SaveGlobalNoteSchema = z.object({
  lessonId: z.string().min(1).optional(),
  content: z.string().min(1).max(5000),
  color: z.string().max(20).optional()
});

export async function saveGlobalNoteAction(lessonId: string | undefined, content: string, color: string = "#ffffff") {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  
  const parsed = SaveGlobalNoteSchema.safeParse({ lessonId, content, color });
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
  }

  await prisma.note.create({
    data: {
      userId,
      lessonId: parsed.data.lessonId || null,
      content: parsed.data.content,
      color: parsed.data.color,
    }
  });

  revalidatePath("/notes");
}

const ToggleBookmarkSchema = z.string().min(1);

export async function toggleBookmarkAction(slug: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error("Unauthorized");
  }
  const userId = session.user.id;
  
  const parsed = ToggleBookmarkSchema.safeParse(slug);
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
  }

  const existing = await prisma.bookmark.findFirst({
    where: {
      userId,
      slug: parsed.data
    }
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id }
    });
  } else {
    await prisma.bookmark.create({
      data: {
        userId,
        slug: parsed.data
      }
    });
  }

  revalidatePath("/bookmarks");
}
