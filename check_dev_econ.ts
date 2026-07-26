import { Track } from "@prisma/client";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const trackName = "DEVELOPMENT_ECONOMICS";
  const lessons = await prisma.lesson.findMany({
    where: { track: trackName },
    orderBy: { dayOrder: 'asc' }
  });

  const placeholders = [];
  const populated = [];
  
  for (const lesson of lessons) {
    if (lesson.conceptText!.includes('<p>Content coming soon...</p>') || lesson.articleText!.includes('<p>Content coming soon...</p>')) {
      placeholders.push(lesson.dayOrder);
    } else {
      populated.push(lesson.dayOrder);
    }
  }

  console.log("DEVELOPMENT ECONOMICS");
  console.log("Total Days: " + lessons.length);
  console.log("Populated Days: " + populated.join(", "));
  console.log("Placeholder Days: " + placeholders.length + " total");
}
main().catch(console.error).finally(() => prisma.$disconnect());
