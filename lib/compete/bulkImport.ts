import { parseNumber } from "./answerCheck";

/**
 * Typing a paper in once instead of a form at a time.
 *
 * A paper arrives as ten problems in a PDF. Filling a form ten times is where
 * the evening goes, so this reads the whole thing out of one box: paste the
 * problems, mark up the few things a PDF cannot tell us — the answer, what it
 * is worth — and get ten drafts to check.
 *
 * Pure, and it validates nothing: it turns text into the same shape the
 * editor's form produces, and `parseProblem` and `buildQuestions` hold it to
 * exactly the standard a typed one is held to. One place decides what a valid
 * problem is, and it is not this file.
 */

/** A line of three or more dashes, alone, ends one and starts the next. */
const SEPARATOR = /^-{3,}$/;

/** `@points 5`. The key is a word; the value is the rest of the line. */
const DIRECTIVE = /^@([a-z]+)\b[ \t]*(.*)$/i;

const HEADING = /^#{1,3}\s+(.*)$/;

export interface ImportIssue {
  /** 1-based, counting blocks rather than lines: what the author sees. */
  block: number;
  problem: string;
}

/** Split a pasted document into blocks, dropping the empty ones. */
export function splitBlocks(source: string): string[] {
  return (source ?? "")
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .reduce<string[][]>(
      (blocks, line) => {
        if (SEPARATOR.test(line.trim())) blocks.push([]);
        else blocks[blocks.length - 1].push(line);
        return blocks;
      },
      [[]]
    )
    .map((lines) => lines.join("\n").trim())
    .filter(Boolean);
}

/* ── Problems ────────────────────────────────────────────────────────────── */

export interface ProblemRecord {
  title: string;
  topic: string;
  statement: string;
  imageUrl: string;
  answerKind: "NUMERIC" | "SHORT" | "OPEN";
  numericValue: string;
  numericTolerance: string;
  acceptedAnswers: string;
  answerHint: string;
  solution: string;
  maxPoints: number;
  gradingMode: "AUTO" | "AI" | "HOST";
}

/**
 * Read one block's directives.
 *
 * A directive's value runs to the end of its line and on through any lines
 * that follow it until the next one starts — so a worked solution can be four
 * lines long without anything being escaped, which is how solutions are
 * actually written.
 */
function readDirectives(block: string): { statement: string; fields: Map<string, string> } {
  const lines = block.split("\n");
  const fields = new Map<string, string>();

  let firstDirective = lines.length;
  let current: string | null = null;
  const buffer: string[] = [];

  const flush = () => {
    if (current) fields.set(current, buffer.join("\n").trim());
    buffer.length = 0;
  };

  lines.forEach((line, i) => {
    const match = line.match(DIRECTIVE);
    if (match) {
      flush();
      if (firstDirective === lines.length) firstDirective = i;
      current = match[1].toLowerCase();
      buffer.push(match[2]);
    } else if (current) {
      buffer.push(line);
    }
  });
  flush();

  return { statement: lines.slice(0, firstDirective).join("\n").trim(), fields };
}

/**
 * What an answer is, read from how it is written.
 *
 * A number is a number. Anything else is a short answer, with `|` separating
 * the spellings that count. Nothing at all is an open problem, which is the
 * honest reading of an author who gave no key.
 */
function readAnswer(raw: string): Pick<
  ProblemRecord,
  "answerKind" | "numericValue" | "acceptedAnswers"
> {
  const given = raw.trim();
  if (!given) return { answerKind: "OPEN", numericValue: "", acceptedAnswers: "" };

  const asNumber = parseNumber(given);
  if (asNumber !== null && !given.includes("|")) {
    return { answerKind: "NUMERIC", numericValue: given, acceptedAnswers: "" };
  }

  return { answerKind: "SHORT", numericValue: "", acceptedAnswers: given };
}

function readMarker(raw: string, kind: ProblemRecord["answerKind"], solution: string) {
  const given = raw.trim().toLowerCase();
  if (given === "ai") return "AI" as const;
  if (given === "host" || given === "me") return "HOST" as const;
  if (given === "auto" || given === "key") {
    // A key that does not exist cannot mark anything; the request is honoured
    // as closely as it can be rather than refused.
    return kind === "OPEN" ? ("HOST" as const) : ("AUTO" as const);
  }

  // Unstated: the key where there is one, the model where there is a solution
  // to mark against, and a person otherwise.
  if (kind !== "OPEN") return "AUTO" as const;
  return solution ? ("AI" as const) : ("HOST" as const);
}

export function parseProblemImport(source: string): {
  records: ProblemRecord[];
  issues: ImportIssue[];
} {
  const records: ProblemRecord[] = [];
  const issues: ImportIssue[] = [];

  splitBlocks(source).forEach((block, i) => {
    const at = i + 1;
    const { statement, fields } = readDirectives(block);
    const get = (key: string) => (fields.get(key) ?? "").trim();

    // A leading heading is the title, and is taken out of the statement: the
    // title is drawn above the problem, and leaving it in prints it twice.
    const lines = statement.split("\n");
    const heading = lines[0]?.trim().match(HEADING);
    const title = get("title") || (heading ? heading[1].trim() : "");
    const body = (heading && !get("title") ? lines.slice(1).join("\n") : statement).trim();

    if (!body) {
      issues.push({ block: at, problem: "nothing to read as a problem" });
      return;
    }

    const answer = readAnswer(get("answer"));
    const solution = get("solution");
    const rawPoints = Number(get("points"));

    records.push({
      title: title || `Problem ${at}`,
      topic: get("topic"),
      statement: body,
      imageUrl: get("image"),
      ...answer,
      numericTolerance: get("tolerance") || "0",
      answerHint: get("hint"),
      solution,
      maxPoints: Number.isFinite(rawPoints) && rawPoints > 0 ? Math.round(rawPoints) : 5,
      gradingMode: readMarker(get("marker"), answer.answerKind, solution),
    });
  });

  return { records, issues };
}

/* ── Multiple choice ─────────────────────────────────────────────────────── */

export interface QuestionRecord {
  topic: string;
  questiontext: string;
  options: string[];
  correctanswer: string;
  explanation: string;
}

const TOPIC_LINE = /^topic\s*:\s*(.*)$/i;
/** `* right` and `- wrong`. Marking every option says which lines are options. */
const OPTION_LINE = /^([*-])\s+(.*)$/;
const EXPLANATION_LINE = /^>\s?(.*)$/;

export function parseQuestionImport(source: string): {
  records: QuestionRecord[];
  issues: ImportIssue[];
} {
  const records: QuestionRecord[] = [];
  const issues: ImportIssue[] = [];

  splitBlocks(source).forEach((block, i) => {
    const at = i + 1;

    let topic = "";
    const questionLines: string[] = [];
    const options: string[] = [];
    const correct: string[] = [];
    const explanation: string[] = [];

    for (const raw of block.split("\n")) {
      const line = raw.trim();
      if (!line) continue;

      const topicMatch = line.match(TOPIC_LINE);
      if (topicMatch && options.length === 0) {
        topic = topicMatch[1].trim();
        continue;
      }

      const explained = line.match(EXPLANATION_LINE);
      if (explained) {
        explanation.push(explained[1].trim());
        continue;
      }

      const option = line.match(OPTION_LINE);
      if (option) {
        const text = option[2].trim();
        if (!text) continue;
        options.push(text);
        if (option[1] === "*") correct.push(text);
        continue;
      }

      // Anything else, before the options start, is the question.
      if (options.length === 0) questionLines.push(line);
    }

    const questiontext = questionLines.join(" ").trim();
    if (!questiontext) {
      issues.push({ block: at, problem: "no question text" });
      return;
    }
    if (correct.length === 0) {
      issues.push({ block: at, problem: "no option marked with * as the right one" });
      return;
    }
    if (correct.length > 1) {
      issues.push({ block: at, problem: `${correct.length} options marked right; mark one` });
      return;
    }

    records.push({
      topic,
      questiontext,
      options,
      correctanswer: correct[0],
      explanation: explanation.join(" ").trim(),
    });
  });

  return { records, issues };
}
