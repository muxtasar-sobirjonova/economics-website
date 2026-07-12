const { PrismaClient } = require('@prisma/client');

// Use DIRECT_URL (port 5432) which works for direct Node.js connections
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://postgres.cqhyfjppewmkjphhewes:Hayotbek2018!@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres'
    }
  }
});

async function main() {
  const results = await prisma.quizResult.findMany({ orderBy: { id: 'asc' } });
  console.log('Total rows:', results.length);

  const counts = new Map();
  for (const r of results) {
    const key = r.userId + '|' + r.quizId;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  let hasDuplicates = false;
  for (const [key, count] of counts.entries()) {
    if (count > 1) { console.log('DUPLICATE:', key, 'x', count); hasDuplicates = true; }
  }
  if (!hasDuplicates) console.log('No duplicates found by key.');

  // Keep best score per userId+quizId, delete the rest
  const seen = new Map();
  const toDelete = [];
  const sorted = [...results].sort((a, b) => b.score - a.score);
  for (const r of sorted) {
    const key = r.userId + '|' + r.quizId;
    if (seen.has(key)) {
      toDelete.push(r.id);
    } else {
      seen.set(key, r.id);
    }
  }

  if (toDelete.length) {
    const del = await prisma.quizResult.deleteMany({ where: { id: { in: toDelete } } });
    console.log('Deleted', del.count, 'duplicate(s)');
  } else {
    console.log('Nothing to delete.');
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e.message); process.exit(1); });
