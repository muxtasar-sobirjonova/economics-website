const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Renaming dateString to normalizedDate...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "DailyCompletion" RENAME COLUMN "dateString" TO "normalizedDate";`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "AgendaCompletion" RENAME COLUMN "dateString" TO "normalizedDate";`);
    console.log('Columns renamed successfully.');
  } catch (error) {
    if (error.message.includes('does not exist')) {
       console.log('Columns might have already been renamed. Proceeding...');
    } else {
       console.error('Migration failed:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
