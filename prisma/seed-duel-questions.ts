/**
 * Load the duel question bank.
 *
 *   npx tsx prisma/seed-duel-questions.ts questions.csv --check
 *   npx tsx prisma/seed-duel-questions.ts questions.csv --sql --out bank.sql
 *   npx tsx prisma/seed-duel-questions.ts questions.csv
 *
 * --check validates the file and writes nothing, so a five-hundred-row bank
 * can be proofread before it ever reaches Postgres.
 *
 * --sql writes the INSERT instead of connecting, for pasting into the Supabase
 * editor. The database credentials are sensitive Vercel variables that cannot
 * be read back, so this is the route that needs no credentials at all.
 *
 * Prefer --out over a shell redirect: `npm run` prints its own banner to
 * stdout, which lands in the file and makes the first line a syntax error.
 *
 * Accepts .csv or .json. Required per row: the question text, at least two
 * options, and a correct answer. The answer may be the option's text, its
 * letter or its number. Options may be optionA…optionF columns, a single
 * `options` cell separated by |, or a JSON array.
 *
 * Re-running is safe: a question's id is derived from its text, so a corrected
 * file updates the rows it already loaded instead of doubling the bank.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { parseCsvRecords } from "../lib/duel/csv";
import { buildQuestions } from "../lib/duel/questionImport";
import { questionsToSql } from "../lib/duel/questionSql";

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
  const checkOnly = args.includes("--check");
  const sqlOnly = args.includes("--sql");

  const outIdx = args.indexOf("--out");
  const outPath = outIdx >= 0 ? args[outIdx + 1] : undefined;

  // The value after --out is a path too, so it must not be mistaken for input.
  const path = args.find((a, i) => !a.startsWith("--") && i !== outIdx + 1);

  if (!path) {
    console.error(
      "Usage: tsx prisma/seed-duel-questions.ts <file.csv|file.json> [--check | --sql [--out FILE]]"
    );
    process.exit(1);
  }

  // In --sql mode the report goes to stderr so that stdout stays pure SQL and
  // can be redirected straight into a file.
  const say = sqlOnly ? console.error : console.log;

  const records = readRecords(path);
  say(`Read ${records.length} row(s) from ${path}`);

  const { questions, issues } = buildQuestions(records);

  if (issues.length > 0) {
    console.error(`\n${issues.length} row(s) could not be used:\n`);
    for (const issue of issues.slice(0, 40)) {
      console.error(`  row ${issue.row}: ${issue.problem}`);
    }
    if (issues.length > 40) console.error(`  … and ${issues.length - 40} more`);
    console.error("");
  }

  say(`${questions.length} question(s) valid`);

  // A plain object rather than a Map: the project compiles to ES5 and
  // spreading a Map needs downlevelIteration.
  const byTopic: Record<string, number> = {};
  for (const q of questions) byTopic[q.topic] = (byTopic[q.topic] ?? 0) + 1;
  Object.keys(byTopic)
    .sort((a, b) => byTopic[b] - byTopic[a])
    .forEach((topic) => say(`  ${topic}: ${byTopic[topic]}`));

  if (checkOnly) {
    say("\n--check: nothing written.");
    return;
  }
  if (questions.length === 0) {
    console.error("\nNothing valid to load.");
    process.exit(1);
  }
  if (sqlOnly) {
    const sql = questionsToSql(questions);
    if (outPath) {
      writeFileSync(outPath, sql, "utf8");
      say(`\n--sql: ${questions.length} question(s) written to ${outPath}`);
    } else {
      process.stdout.write(sql);
      console.error(`\n--sql: ${questions.length} question(s) written to stdout.`);
    }
    return;
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
