import { prisma } from './lib/prisma';
prisma.lesson.findMany().then(lessons => {
  lessons.forEach(l => console.log(`Lesson ${l.dayOrder}: conceptTakeaways=`, JSON.stringify(l.conceptTakeaways), `typeof=`, typeof l.conceptTakeaways));
});
