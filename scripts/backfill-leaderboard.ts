import { prisma } from "../lib/prisma";

async function main() {
  console.log("Starting leaderboard backfill...");
  
  // Find all users
  const users = await prisma.user.findMany({
    select: { id: true }
  });
  
  console.log(`Found ${users.length} users. Backfilling...`);
  
  for (const user of users) {
    // Count lessons completed for this user
    // In our model, CompletedLesson represents a unique lesson completion per track
    // If a user completed the same lesson across 2 tracks, it's counted twice
    // For simplicity, we just count the distinct records or total records.
    const completedLessons = await prisma.completedLesson.findMany({
      where: { userId: user.id },
      orderBy: { date: 'asc' }
    });
    
    const count = completedLessons.length;
    let lastDate: Date | null = null;
    
    if (count > 0) {
      lastDate = completedLessons[count - 1].date;
    }
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lessonsCompleted: count,
        lastLessonCompletedAt: lastDate
      }
    });
    
    console.log(`Updated user ${user.id}: ${count} lessons`);
  }
  
  console.log("Backfill complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
