/**
 * A problem, as written, turned into something to draw.
 *
 * A deliberately small Markdown: what a problem out of a paper actually needs
 * — paragraphs, a list, a table of figures, a diagram, bold, and maths — and
 * nothing else. It produces a typed tree, never a string of HTML, so there is
 * no path from a problem's text to markup in the page. That matters more here
 * than anywhere else on the site: problems are written by hosts, read by
 * everyone in the room, and `dangerouslySetInnerHTML` on that road would be a
 * standing invitation.
 *
 * The one exception is maths, which KaTeX renders itself, from a string this
 * parser only ever hands it verbatim.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "bold"; v: Inline[] }
  | { t: "italic"; v: Inline[] }
  | { t: "code"; v: string }
  | { t: "math"; v: string }
  | { t: "break" };

export type Align = "left" | "right" | "center";

export type Block =
  | { t: "p"; v: Inline[] }
  | { t: "h"; level: 2 | 3; v: Inline[] }
  | { t: "ul"; items: Inline[][] }
  | { t: "ol"; items: Inline[][]; start: number }
  | { t: "quote"; v: Inline[] }
  | { t: "table"; head: Inline[][]; rows: Inline[][][]; align: Align[] }
  | { t: "mathBlock"; v: string }
  | { t: "code"; v: string }
  | { t: "image"; src: string; alt: string };

/* ── Inline ──────────────────────────────────────────────────────────────── */

/**
 * `$…$` is maths; `$100` is money.
 *
 * The rule that separates them: a maths span may not begin or end against a
 * space, and may not span a line. "$100 and $200" fails on both counts and
 * stays text, which is what an author writing about prices expects. A literal
 * dollar can always be written `\$`.
 *
 * Written without a lookbehind on purpose. Half a classroom is on an older
 * iPhone, and a lookbehind in a bundle is a syntax error on Safari before
 * 16.4 — not a broken formula, a blank page.
 */
const INLINE_MATH = /\$([^\s$\n](?:(?:\\\$|[^$\n])*?[^\s$\n])?)\$/g;

/**
 * The rule above is not enough on its own, and economics is why.
 *
 * "Capex = 650 km × $12–24M = ~$7.8B" has two dollar signs with no space
 * against either, so it satisfies every test so far and renders "12–24M = ~"
 * as a formula. Money written twice on one line is the normal case in a
 * business problem, not an edge one.
 *
 * What separates them: money starts with a digit and carries no TeX. A formula
 * that starts with a digit — "$0 = 150 - 2P_{max}$" — almost always does. So a
 * span beginning with a digit is maths only if it contains a TeX marker.
 *
 * The cost is `$2x$`, which now reads as text. That is the right trade: a
 * price rendered as a formula is silent and wrong on every line it touches,
 * and the fix for `2x` is to write `$2 \times x$`.
 */
function looksLikeMaths(content: string): boolean {
  if (!/^\d/.test(content)) return true;
  return /[\\^_{}]/.test(content);
}

/** The first maths span that is one, rather than the first that looks like one. */
function findMaths(text: string): { before: string; captured: string; after: string } | null {
  INLINE_MATH.lastIndex = 0;

  let m: RegExpExecArray | null;
  while ((m = INLINE_MATH.exec(text)) !== null) {
    if (!looksLikeMaths(m[1])) {
      // Step past this opening dollar rather than past the whole span: the
      // closing one may open a real formula.
      INLINE_MATH.lastIndex = m.index + 1;
      continue;
    }
    return {
      before: text.slice(0, m.index),
      captured: m[1],
      after: text.slice(m.index + m[0].length),
    };
  }
  return null;
}

/**
 * Italic is `*this*` and never `_this_`.
 *
 * Economics is written with subscripts: `P_1`, `Q_d`, `MC_2`. Underscore
 * emphasis would turn "P_1 and Q_2" into "P<em>1 and Q</em>2" — silently, and
 * only in the problems that use two variables, which is most of them.
 */
const ITALIC = /\*(?=\S)([^*\n]*?\S)\*/;

function splitOnce(
  text: string,
  pattern: RegExp
): { before: string; captured: string; after: string } | null {
  const m = text.match(pattern);
  if (!m || m.index === undefined) return null;
  return {
    before: text.slice(0, m.index),
    // The first group that actually matched: an alternation leaves the others
    // undefined, and reading m[1] blindly is how that becomes a blank span.
    captured: m.slice(1).find((g) => typeof g === "string") ?? "",
    after: text.slice(m.index + m[0].length),
  };
}

/**
 * Order matters. Maths is taken first so that `_` and `*` inside a formula are
 * subscripts and multiplication rather than emphasis, and code next so that a
 * backtick span is never reinterpreted.
 */
export function parseInline(text: string): Inline[] {
  if (!text) return [];

  const math = findMaths(text);
  if (math) {
    return [
      ...parseInline(math.before),
      { t: "math", v: math.captured.replace(/\\\$/g, "$") },
      ...parseInline(math.after),
    ];
  }

  const code = splitOnce(text, /`([^`\n]+)`/);
  if (code) {
    return [...parseInline(code.before), { t: "code", v: code.captured }, ...parseInline(code.after)];
  }

  const bold = splitOnce(text, /\*\*([^\n]+?)\*\*/);
  if (bold) {
    return [...parseInline(bold.before), { t: "bold", v: parseInline(bold.captured) }, ...parseInline(bold.after)];
  }

  const italic = splitOnce(text, ITALIC);
  if (italic) {
    return [
      ...parseInline(italic.before),
      { t: "italic", v: parseInline(italic.captured) },
      ...parseInline(italic.after),
    ];
  }

  return [{ t: "text", v: text.replace(/\\\$/g, "$") }];
}

/** A paragraph's own line breaks are kept: an author who put an equation on its own line meant it. */
function parseParagraph(lines: string[]): Inline[] {
  const out: Inline[] = [];
  lines.forEach((line, i) => {
    if (i > 0) out.push({ t: "break" });
    out.push(...parseInline(line));
  });
  return out;
}

/* ── Blocks ──────────────────────────────────────────────────────────────── */

const IMAGE_ONLY = /^!\[([^\]]*)\]\(([^)\s]+)\)$/;
const BULLET = /^[-*•]\s+(.*)$/;
const NUMBERED = /^(\d{1,3})[.)]\s+(.*)$/;
const HEADING = /^(#{2,3})\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;
const TABLE_RULE = /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?$/;

function splitRow(line: string): string[] {
  return line
    .replace(/^\s*\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((c) => c.trim());
}

function alignOf(rule: string): Align[] {
  return splitRow(rule).map((c) => {
    const left = c.startsWith(":");
    const right = c.endsWith(":");
    if (left && right) return "center";
    // Columns of figures are read down their last digit, so a table of numbers
    // that is not right aligned is a table nobody can scan.
    return right ? "right" : "left";
  });
}

export function parseBlocks(source: string): Block[] {
  const lines = (source ?? "").replace(/\r\n?/g, "\n").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const paragraph: string[] = [];
  const flush = () => {
    if (paragraph.length) {
      blocks.push({ t: "p", v: parseParagraph(paragraph.splice(0)) });
    }
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      flush();
      i++;
      continue;
    }

    // Fenced code.
    if (trimmed.startsWith("```")) {
      flush();
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) body.push(lines[i++]);
      i++; // closing fence, or the end of the text
      blocks.push({ t: "code", v: body.join("\n") });
      continue;
    }

    // Display maths, opened and closed by $$ on their own lines or inline.
    if (trimmed.startsWith("$$")) {
      flush();
      const single = trimmed.match(/^\$\$(.+)\$\$$/);
      if (single) {
        blocks.push({ t: "mathBlock", v: single[1].trim() });
        i++;
        continue;
      }
      const body: string[] = [trimmed.slice(2)];
      i++;
      while (i < lines.length && !lines[i].trim().endsWith("$$")) body.push(lines[i++]);
      if (i < lines.length) body.push(lines[i++].trim().replace(/\$\$$/, ""));
      blocks.push({ t: "mathBlock", v: body.join("\n").trim() });
      continue;
    }

    const image = trimmed.match(IMAGE_ONLY);
    if (image) {
      flush();
      blocks.push({ t: "image", alt: image[1], src: image[2] });
      i++;
      continue;
    }

    const heading = trimmed.match(HEADING);
    if (heading) {
      flush();
      blocks.push({
        t: "h",
        level: heading[1].length === 2 ? 2 : 3,
        v: parseInline(heading[2]),
      });
      i++;
      continue;
    }

    // A table is a row followed by a rule; a row on its own is a paragraph
    // that happens to contain pipes.
    if (trimmed.includes("|") && i + 1 < lines.length && TABLE_RULE.test(lines[i + 1].trim())) {
      flush();
      const head = splitRow(trimmed).map(parseInline);
      const align = alignOf(lines[i + 1].trim());
      i += 2;

      const rows: Inline[][][] = [];
      while (i < lines.length && lines[i].trim().includes("|")) {
        rows.push(splitRow(lines[i].trim()).map(parseInline));
        i++;
      }
      blocks.push({ t: "table", head, align, rows });
      continue;
    }

    if (BULLET.test(trimmed)) {
      flush();
      const items: Inline[][] = [];
      while (i < lines.length && BULLET.test(lines[i].trim())) {
        items.push(parseInline(lines[i].trim().match(BULLET)![1]));
        i++;
      }
      blocks.push({ t: "ul", items });
      continue;
    }

    if (NUMBERED.test(trimmed)) {
      flush();
      const start = Number(trimmed.match(NUMBERED)![1]);
      const items: Inline[][] = [];
      while (i < lines.length && NUMBERED.test(lines[i].trim())) {
        items.push(parseInline(lines[i].trim().match(NUMBERED)![2]));
        i++;
      }
      blocks.push({ t: "ol", items, start });
      continue;
    }

    if (QUOTE.test(trimmed)) {
      flush();
      const body: string[] = [];
      while (i < lines.length && QUOTE.test(lines[i].trim())) {
        body.push(lines[i].trim().match(QUOTE)![1]);
        i++;
      }
      blocks.push({ t: "quote", v: parseParagraph(body) });
      continue;
    }

    paragraph.push(trimmed);
    i++;
  }

  flush();
  return blocks;
}

/** The statement as one line, for a list of problems or a page title. */
export function plainText(source: string, limit = 160): string {
  const flat = (source ?? "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    // Not `_`: it stopped being syntax when italic did, and stripping it turns
    // every subscript in the preview into a hole — "Q_d" into "Q d".
    .replace(/[#>*`|$]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return flat.length > limit ? `${flat.slice(0, limit - 1).trimEnd()}…` : flat;
}
