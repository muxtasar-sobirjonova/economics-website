/**
 * A small RFC 4180 reader.
 *
 * Written rather than installed because the question bank arrives from a
 * spreadsheet and the alternative — splitting on commas — quietly mangles any
 * question containing one. Kept apart from the seed script so the parsing can
 * be tested without a database.
 */

/** Rows of raw cells. Quoted fields may contain commas, quotes and newlines. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let i = 0;

  // A byte-order mark survives an Excel export and would corrupt the first header.
  if (text.charCodeAt(0) === 0xfeff) i = 1;

  const endField = () => {
    row.push(field);
    field = "";
  };
  const endRow = () => {
    endField();
    rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const c = text[i];

    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        quoted = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }

    if (c === '"' && field === "") {
      quoted = true;
      i++;
      continue;
    }
    if (c === ",") {
      endField();
      i++;
      continue;
    }
    if (c === "\r") {
      if (text[i + 1] === "\n") i++;
      endRow();
      i++;
      continue;
    }
    if (c === "\n") {
      endRow();
      i++;
      continue;
    }

    field += c;
    i++;
  }

  // A file ending in a newline must not produce a trailing empty row.
  if (field !== "" || row.length > 0) endRow();

  return rows;
}

/** Header row plus data rows, as objects keyed by trimmed lower-case header. */
export function parseCsvRecords(text: string): Record<string, string>[] {
  const rows = parseCsv(text).filter((r) => r.some((c) => c.trim() !== ""));
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((cells) => {
    const rec: Record<string, string> = {};
    header.forEach((key, idx) => {
      if (key) rec[key] = (cells[idx] ?? "").trim();
    });
    return rec;
  });
}
