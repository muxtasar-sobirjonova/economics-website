/**
 * Turn pasted case files into SQL for the problem bank.
 *
 *   npx tsx prisma/seed-problems.ts content/cases --out problems.sql
 *
 * There is no route from this machine to Postgres — the credentials live in
 * Vercel as sensitive variables that cannot be read back — so this prints SQL
 * to paste into the Supabase editor, where the browser session is already
 * authorised. The same arrangement the duel bank uses.
 *
 * Every file is read by the importer the browser uses and validated by the
 * same `parseProblem` a typed problem goes through, so a problem loaded this
 * way is held to exactly the standard one written in the form is.
 *
 * Prefer --out over a shell redirect: `npm run` prints its own banner to
 * stdout and it would land in the file.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseProblemImport } from "../lib/compete/bulkImport";
import { parseProblem, PROBLEM_ERROR_COPY } from "../lib/compete/problem";
import { problemsToSql, problemId, type ProblemRow } from "../lib/compete/problemSql";

function filesIn(target: string): string[] {
  if (statSync(target).isFile()) return [target];
  return readdirSync(target)
    .filter((f) => f.endsWith(".txt") || f.endsWith(".md"))
    .sort()
    .map((f) => join(target, f));
}

function main() {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf("--out");
  const outPath = outIdx >= 0 ? args[outIdx + 1] : null;
  const target = args.find((a, i) => !a.startsWith("--") && i !== outIdx + 1);

  if (!target) {
    console.error("Usage: tsx prisma/seed-problems.ts <dir|file> [--out FILE]");
    process.exit(1);
  }

  // The report goes to stderr so stdout stays pure SQL when --out is absent.
  const say = console.error;

  const rows: ProblemRow[] = [];
  const seen = new Map<string, string>();
  let refused = 0;

  for (const file of filesIn(target)) {
    const { records, issues } = parseProblemImport(readFileSync(file, "utf8"));

    for (const issue of issues) {
      say(`  ${file} block ${issue.block}: ${issue.problem}`);
      refused++;
    }

    let kept = 0;
    records.forEach((record, i) => {
      const parsed = parseProblem(record);
      if ("error" in parsed) {
        say(`  ${file} block ${i + 1}: ${PROBLEM_ERROR_COPY[parsed.error]}`);
        refused++;
        return;
      }

      const id = problemId(parsed.problem.statement);
      const first = seen.get(id);
      if (first) {
        // Two identical statements would collide on the id and the second
        // would silently overwrite the first. Better to say so.
        say(`  ${file} block ${i + 1}: same statement as ${first}`);
        refused++;
        return;
      }
      seen.set(id, `${file} block ${i + 1}`);

      rows.push({ ...parsed.problem, id });
      kept++;
    });

    say(`${file}: ${kept} problem(s)`);
  }

  const marks = rows.reduce((sum, r) => sum + r.maxPoints, 0);
  say(`\n${rows.length} problem(s), ${marks} marks, ${refused} refused.`);

  if (rows.length === 0) process.exit(1);

  const sql = problemsToSql(rows);
  if (outPath) {
    writeFileSync(outPath, sql, "utf8");
    say(`Written to ${outPath}.`);
  } else {
    process.stdout.write(sql);
  }
}

main();
