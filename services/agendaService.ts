import { prisma } from "@/lib/prisma";
import { ItemType } from "@prisma/client";

export class AgendaService {
  static async markItemDone(userId: string, lessonId: string, itemType: ItemType) {
    const todayDate = new Date();
    todayDate.setUTCHours(0,0,0,0);

    const parsedLessonId = parseInt(lessonId, 10);
    if (isNaN(parsedLessonId)) {
      throw new Error("Invalid lessonId");
    }

    const userRecord = await prisma.user.findUnique({ where: { id: userId }, select: { activeTrack: true } });
    const track = userRecord?.activeTrack || "ENTREPRENEURSHIP_ECONOMICS";

    const realLesson = await prisma.lesson.findUnique({
      where: { track_dayOrder: { track, dayOrder: parsedLessonId } }
    });

    if (!realLesson) {
      throw new Error("Lesson not found");
    }

    return await prisma.$transaction(async (tx) => {
      const existing = await tx.agendaCompletion.findFirst({
        where: { userId, itemType, lessonId: realLesson.id, normalizedDate: todayDate }
      });

      if (!existing) {
        await tx.agendaCompletion.create({
          data: { userId, itemType, lessonId: realLesson.id, normalizedDate: todayDate }
        });
        
        // Return true if newly created
        return true;
      }
      return false;
    });
  }
}
