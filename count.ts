import { PrismaClient } from '@prisma/client'; const p = new PrismaClient(); p.user.count().then(c => console.log('COUNT=' + c));
