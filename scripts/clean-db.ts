import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Finding orphaned UserProgress records...');
  // Instead of complex logic, just use raw SQL to delete where userId doesn't exist
  await prisma.$executeRawUnsafe(`DELETE FROM "UserProgress" WHERE "userId" NOT IN (SELECT id FROM "User")`);
  
  // Clean other tables just in case
  await prisma.$executeRawUnsafe(`DELETE FROM "CompletedLesson" WHERE "userId" NOT IN (SELECT id FROM "User")`);
  await prisma.$executeRawUnsafe(`DELETE FROM "QuizResult" WHERE "userId" NOT IN (SELECT id FROM "User")`);
  
  console.log('Cleaned up orphaned records successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
