import { prisma } from "@/lib/prisma";
import { ItemType, Track } from "@prisma/client";
import { touchStreak } from "@/lib/streak";

export class AgendaService {
  static async markItemDone(userId: string, lessonId: string, itemType: ItemType) {
    const todayDate = new Date();
    todayDate.setUTCHours(0,0,0,0);

    const parsedLessonId = parseInt(lessonId, 10);
    if (isNaN(parsedLessonId)) {
      throw new Error("Invalid lessonId");
    }

    const userRecord = await prisma.user.findUnique({ where: { id: userId }, select: { activeTrack: true } });
    if (!userRecord) {
      throw new Error("User record not found");
    }
    const track: Track = userRecord.activeTrack || Track.ENTREPRENEURSHIP_ECONOMICS;

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

      let created = false;
      if (!existing) {
        await tx.agendaCompletion.create({
          data: { userId, itemType, lessonId: realLesson.id, normalizedDate: todayDate }
        });
        created = true;
      }

      // Reading a concept or an article counts as studying today.
      await touchStreak(tx, userId, track);

      return created;
    });
  }
}
