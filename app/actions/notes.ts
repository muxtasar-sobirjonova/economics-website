"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { ActionError, ActionResponse, catchActionError } from "@/lib/errors";
const SaveGlobalNoteSchema = z.object({
  lessonId: z.string().min(1).optional(),
  content: z.string().min(1).max(5000),
  color: z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, "Invalid color format").optional()
});

export async function saveGlobalNoteAction(lessonId: string | undefined, content: string, color: string = "#ffffff"): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;

    const limiter = await rateLimit(`notes:${userId}`, { interval: 60000, limit: 10 });
    if (!limiter.success) {
      throw new ActionError("Too many requests. Please try again in a minute.");
    }
    
    const parsed = SaveGlobalNoteSchema.safeParse({ lessonId, content, color });
    if (!parsed.success) {
      throw new ActionError(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
    }

    if (parsed.data.lessonId) {
      const { getLessonAccessStatus } = await import("@/lib/lesson-access");
      const lessonNum = parseInt(parsed.data.lessonId, 10);
      if (!isNaN(lessonNum)) {
        const access = await getLessonAccessStatus(userId, lessonNum);
        if (!access.isUnlocked) {
          throw new ActionError("Lesson is locked or invalid");
        }
      }
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeTrack: true }
    });
    const track = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

    await prisma.note.create({
      data: {
        userId,
        lessonId: parsed.data.lessonId || null,
        content: parsed.data.content,
        color: parsed.data.color,
        track,
      }
    });

    revalidatePath("/notes");
    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
}

const ToggleBookmarkSchema = z.string().min(1).max(255).startsWith("/");

export async function toggleBookmarkAction(slug: string): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      throw new ActionError("Unauthorized", "UNAUTHORIZED");
    }
    const userId = session.user.id;

    const limiter = await rateLimit(`bookmarks:${userId}`, { interval: 60000, limit: 20 });
    if (!limiter.success) {
      throw new ActionError("Too many requests. Please try again in a minute.");
    }
    
    const parsed = ToggleBookmarkSchema.safeParse(slug);
    if (!parsed.success) {
      throw new ActionError(`Invalid input: ${parsed.error.flatten().formErrors.join(", ")}`);
    }

    const userRecord = await prisma.user.findUnique({
      where: { id: userId },
      select: { activeTrack: true }
    });
    const track = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_slug_track: {
          userId,
          slug: parsed.data,
          track,
        }
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
          slug: parsed.data,
          track,
        }
      });
    }

    revalidatePath("/bookmarks");
    return { success: true, data: undefined };
  } catch (error) {
    return catchActionError(error);
  }
}
