/**
 * Load the duel question bank.
 *
 *   npx tsx prisma/seed-duel-questions.ts questions.csv --check
 *   npx tsx prisma/seed-duel-questions.ts questions.csv
 *
 * --check validates the file and writes nothing, so a five-hundred-row bank
 * can be proofread before it ever reaches Postgres.
 *
 * Accepts .csv or .json. Required per row: the question text, at least two
 * options, and a correct answer. The answer may be the option's text, its
 * letter or its number. Options may be optionA…optionF columns, a single
 * `options` cell separated by |, or a JSON array.
 *
 * Re-running is safe: a question's id is derived from its text, so a corrected
 * file updates the rows it already loaded instead of doubling the bank.
 */
import { readFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { parseCsvRecords } from "../lib/duel/csv";
import { buildQuestions } from "../lib/duel/questionImport";

const prisma = new PrismaClient();

function readRecords(path: string): Record<string, unknown>[] {
  const text = readFileSync(path, "utf8");

  if (path.toLowerCase().endsWith(".json")) {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) {
      throw new Error("JSON must be an array of question objects");
    }
    return parsed;
  }
  return parseCsvRecords(text);
}

async function main() {
  const args = process.argv.slice(2);
  const path = args.find((a) => !a.startsWith("--"));
  const checkOnly = args.includes("--check");

  if (!path) {
    console.error("Usage: tsx prisma/seed-duel-questions.ts <file.csv|file.json> [--check]");
    process.exit(1);
  }

  const records = readRecords(path);
  console.log(`Read ${records.length} row(s) from ${path}`);

  const { questions, issues } = buildQuestions(records);

  if (issues.length > 0) {
    console.error(`\n${issues.length} row(s) could not be used:\n`);
    for (const issue of issues.slice(0, 40)) {
      console.error(`  row ${issue.row}: ${issue.problem}`);
    }
    if (issues.length > 40) console.error(`  … and ${issues.length - 40} more`);
    console.error("");
  }

  console.log(`${questions.length} question(s) valid`);

  // A plain object rather than a Map: the project compiles to ES5 and
  // spreading a Map needs downlevelIteration.
  const byTopic: Record<string, number> = {};
  for (const q of questions) byTopic[q.topic] = (byTopic[q.topic] ?? 0) + 1;
  Object.keys(byTopic)
    .sort((a, b) => byTopic[b] - byTopic[a])
    .forEach((topic) => console.log(`  ${topic}: ${byTopic[topic]}`));

  if (checkOnly) {
    console.log("\n--check: nothing written.");
    return;
  }
  if (questions.length === 0) {
    console.error("\nNothing valid to load.");
    process.exit(1);
  }

  let created = 0;
  let updated = 0;

  for (const q of questions) {
    const existing = await prisma.duelQuestion.findUnique({
      where: { id: q.id },
      select: { id: true },
    });

    await prisma.duelQuestion.upsert({
      where: { id: q.id },
      // Counters and `active` are deliberately not touched on update: they are
      // earned from real play, and a re-import must not erase them.
      create: { ...q, explanation: q.explanation ?? undefined },
      update: {
        topic: q.topic,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation ?? undefined,
      },
    });

    if (existing) updated++;
    else created++;
  }

  const total = await prisma.duelQuestion.count({ where: { active: true } });
  console.log(`\nCreated ${created}, updated ${updated}.`);
  console.log(`Bank now holds ${total} active question(s) — ${Math.floor(total / 10)} duel sets.`);

  if (total < 200) {
    console.warn("\nUnder 200 active questions: players will meet repeats quickly.");
  }
}

main()
  .catch((e) => {
    console.error(e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
