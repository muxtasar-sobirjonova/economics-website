import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Creating ENUM type...');
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Track') THEN
          CREATE TYPE "Track" AS ENUM ('ENTREPRENEURSHIP_ECONOMICS', 'DEVELOPMENT_ECONOMICS', 'BEHAVIORAL_ECONOMICS');
        END IF;
      END
      $$;
    `);
    
    console.log('Migrating CompletedLesson...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "CompletedLesson" ALTER COLUMN "track" DROP DEFAULT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "CompletedLesson" ALTER COLUMN "track" TYPE "Track" USING track::text::"Track";`);

    console.log('Migrating QuizResult...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "QuizResult" ALTER COLUMN "track" DROP DEFAULT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "QuizResult" ALTER COLUMN "track" TYPE "Track" USING track::text::"Track";`);

    console.log('Migrating Lesson...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Lesson" ALTER COLUMN "track" DROP DEFAULT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Lesson" ALTER COLUMN "track" TYPE "Track" USING track::text::"Track";`);

    console.log('Migrating Quiz...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Quiz" ALTER COLUMN "track" DROP DEFAULT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Quiz" ALTER COLUMN "track" TYPE "Track" USING track::text::"Track";`);

    console.log('Migrating MistakeReview...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "MistakeReview" ALTER COLUMN "track" DROP DEFAULT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "MistakeReview" ALTER COLUMN "track" TYPE "Track" USING track::text::"Track";`);

    console.log('Migrating Note...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ALTER COLUMN "track" DROP DEFAULT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Note" ALTER COLUMN "track" TYPE "Track" USING track::text::"Track";`);

    console.log('Migrating Bookmark...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "Bookmark" ALTER COLUMN "track" DROP DEFAULT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE "Bookmark" ALTER COLUMN "track" TYPE "Track" USING track::text::"Track";`);

    console.log('Migrating TrackProgress...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "TrackProgress" ALTER COLUMN "track" TYPE "Track" USING track::text::"Track";`);

    console.log('Migrating User...');
    await prisma.$executeRawUnsafe(`ALTER TABLE "User" ALTER COLUMN "activeTrack" TYPE "Track" USING "activeTrack"::text::"Track";`);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
