import { describe, it, expect } from "vitest";
import { parseInline, parseBlocks, plainText, type Inline, type Block } from "@/lib/compete/markdown";

/** The text a tree carries, so a test can assert content without walking types. */
function textOf(nodes: Inline[]): string {
  return nodes
    .map((n) =>
      n.t === "text" || n.t === "math" || n.t === "code"
        ? n.v
        : n.t === "break"
          ? "\n"
          : textOf(n.v)
    )
    .join("");
}

const kinds = (nodes: Inline[]) => nodes.map((n) => n.t);

describe("parseInline — maths against money", () => {
  it("reads a formula", () => {
    const nodes = parseInline("Given $Q_d = 100 - 2P$ find P.");
    expect(kinds(nodes)).toEqual(["text", "math", "text"]);
    expect(nodes[1]).toEqual({ t: "math", v: "Q_d = 100 - 2P" });
  });

  it("leaves prices alone", () => {
    // The trap: "$100 and $200" looks exactly like a maths span.
    const nodes = parseInline("It costs $100 and $200 in the second year.");
    expect(kinds(nodes)).toEqual(["text"]);
    expect(textOf(nodes)).toBe("It costs $100 and $200 in the second year.");
  });

  it("takes a one-character formula", () => {
    expect(parseInline("$P$")[0]).toEqual({ t: "math", v: "P" });
  });

  it("refuses a span that opens or closes against a space", () => {
    expect(kinds(parseInline("$ x $"))).toEqual(["text"]);
  });

  it("lets an author escape a dollar", () => {
    expect(textOf(parseInline("A \\$5 note"))).toBe("A $5 note");
  });

  it("leaves two prices on one line alone", () => {
    // The trap a business case walks into constantly: two dollar signs with no
    // space against either satisfies every other rule, and "12–24M = ~" would
    // be set as a formula on a line that is only ever about money.
    const line = "Capex = 650 km × $12–24M = ~$7.8B to ~$15.6B (midpoint ~$11.7B).";
    expect(kinds(parseInline(line))).toEqual(["text"]);
    expect(textOf(parseInline(line))).toBe(line);
  });

  it("still reads a formula that happens to start with a number", () => {
    // Money starts with a digit and carries no TeX; a formula that starts with
    // one almost always does.
    const nodes = parseInline("$0 = 150 - 2P_{max} \\implies P_{max} = 75$");
    expect(kinds(nodes)).toEqual(["math"]);
  });

  it("finds a real formula after a price on the same line", () => {
    const nodes = parseInline("At $16/dose the demand is $Q_d = 100 - 2P$ here.");
    expect(kinds(nodes)).toEqual(["text", "math", "text"]);
    expect(nodes[1]).toEqual({ t: "math", v: "Q_d = 100 - 2P" });
  });
});

describe("parseInline — emphasis", () => {
  it("reads bold and italic", () => {
    expect(kinds(parseInline("**all** of *it*"))).toEqual(["bold", "text", "italic"]);
  });

  it("never treats a subscript as emphasis", () => {
    // "P_1 and Q_2" must not become "P<em>1 and Q</em>2".
    const nodes = parseInline("P_1 and Q_2 both rise");
    expect(kinds(nodes)).toEqual(["text"]);
    expect(textOf(nodes)).toBe("P_1 and Q_2 both rise");
  });

  it("never treats multiplication as emphasis", () => {
    expect(kinds(parseInline("5 * 3 * 2"))).toEqual(["text"]);
  });

  it("leaves symbols inside a formula to the formula", () => {
    const nodes = parseInline("$a_1 * b_2$");
    expect(nodes).toEqual([{ t: "math", v: "a_1 * b_2" }]);
  });

  it("reads inline code", () => {
    expect(parseInline("use `npm run dev`")[1]).toEqual({ t: "code", v: "npm run dev" });
  });
});

describe("parseBlocks", () => {
  const first = (src: string): Block => parseBlocks(src)[0];

  it("splits paragraphs on blank lines and reflows the wrapping inside one", () => {
    // A newline inside a paragraph is where the editor wrapped, not where the
    // author meant to break. Honouring it set every pasted case as a ragged
    // column.
    const blocks = parseBlocks("Line one\nLine two\n\nSecond paragraph");
    expect(blocks).toHaveLength(2);
    expect(blocks[0].t).toBe("p");
    expect(textOf((blocks[0] as { v: Inline[] }).v)).toBe("Line one Line two");
  });

  it("keeps a break the author asked for", () => {
    // The usual Markdown signals, so verse and addresses still work.
    expect(textOf((parseBlocks("Line one  \nLine two")[0] as { v: Inline[] }).v))
      .toBe("Line one\nLine two");
    expect(textOf((parseBlocks("Line one\\\nLine two")[0] as { v: Inline[] }).v))
      .toBe("Line one\nLine two");
  });

  it("reads headings", () => {
    expect(first("## Part one")).toMatchObject({ t: "h", level: 2 });
    expect(first("### Part one")).toMatchObject({ t: "h", level: 3 });
  });

  it("reads a bulleted list", () => {
    const b = first("- one\n- two\n- three") as Extract<Block, { t: "ul" }>;
    expect(b.t).toBe("ul");
    expect(b.items).toHaveLength(3);
    expect(textOf(b.items[2])).toBe("three");
  });

  it("reads a numbered list and remembers where it started", () => {
    const b = first("3. third\n4. fourth") as Extract<Block, { t: "ol" }>;
    expect(b.t).toBe("ol");
    expect(b.start).toBe(3);
    expect(b.items).toHaveLength(2);
  });

  it("keeps a wrapped item in the item it belongs to", () => {
    // The bug this guards: a question copied out of a paper wraps, and the
    // second line used to end the list, orphan itself as a paragraph, and
    // leave the next number starting a fresh list of one.
    const blocks = parseBlocks(
      "1. Artel uchun o'zaro talab elastikligini\n   hisoblang va izohlang.\n" +
        "2. Quvvat cheklovi MC egri chizig'iga qanday\n   ta'sir qiladi?"
    );

    expect(blocks).toHaveLength(1);
    const b = blocks[0] as Extract<Block, { t: "ol" }>;
    expect(b.items).toHaveLength(2);
    expect(textOf(b.items[0])).toBe("Artel uchun o'zaro talab elastikligini hisoblang va izohlang.");
    expect(textOf(b.items[1])).toBe("Quvvat cheklovi MC egri chizig'iga qanday ta'sir qiladi?");
  });

  it("continues a bulleted item the same way", () => {
    const b = first("- a long point that runs\n  onto a second line\n- a short one") as Extract<
      Block,
      { t: "ul" }
    >;
    expect(b.items).toHaveLength(2);
    expect(textOf(b.items[0])).toBe("a long point that runs onto a second line");
  });

  it("continues an item that wrapped without being indented", () => {
    // Text pasted out of a .docx keeps no indentation at all.
    const b = first("1. the question runs\nstraight on") as Extract<Block, { t: "ol" }>;
    expect(b.items).toHaveLength(1);
    expect(textOf(b.items[0])).toBe("the question runs straight on");
  });

  it("ends the list at a blank line rather than swallowing what follows", () => {
    const blocks = parseBlocks("1. one\n2. two\n\nA paragraph after it.");
    expect(blocks.map((b) => b.t)).toEqual(["ol", "p"]);
    expect(textOf((blocks[1] as { v: Inline[] }).v)).toBe("A paragraph after it.");
  });

  it("ends the list at anything that starts a block of its own", () => {
    // A heading, a quote and a table must not be eaten as the rest of an item.
    expect(parseBlocks("- one\n## Heading").map((b) => b.t)).toEqual(["ul", "h"]);
    expect(parseBlocks("- one\n> quoted").map((b) => b.t)).toEqual(["ul", "quote"]);
    expect(parseBlocks("- one\n| A | B |\n| --- | --- |").map((b) => b.t)).toEqual(["ul", "table"]);
    expect(parseBlocks("- one\n![d](/problems/a.png)").map((b) => b.t)).toEqual(["ul", "image"]);
  });

  it("switches list when the marker changes", () => {
    expect(parseBlocks("- bulleted\n1. numbered").map((b) => b.t)).toEqual(["ul", "ol"]);
  });

  it("reads a table, with figures right aligned", () => {
    const b = first(
      "| Year | Output |\n| --- | ---: |\n| 2023 | 1,200 |\n| 2024 | 1,350 |"
    ) as Extract<Block, { t: "table" }>;

    expect(b.t).toBe("table");
    expect(b.head.map(textOf)).toEqual(["Year", "Output"]);
    expect(b.align).toEqual(["left", "right"]);
    expect(b.rows).toHaveLength(2);
    expect(b.rows[1].map(textOf)).toEqual(["2024", "1,350"]);
  });

  it("does not turn a sentence containing a pipe into a table", () => {
    expect(first("Choose A | B and explain")).toMatchObject({ t: "p" });
  });

  it("reads display maths on one line and across several", () => {
    expect(first("$$E = mc^2$$")).toEqual({ t: "mathBlock", v: "E = mc^2" });
    expect(first("$$\n\\frac{a}{b}\n$$")).toEqual({ t: "mathBlock", v: "\\frac{a}{b}" });
  });

  it("reads a picture on its own line", () => {
    expect(first("![Supply and demand](/problems/sd.png)")).toEqual({
      t: "image", alt: "Supply and demand", src: "/problems/sd.png",
    });
  });

  it("reads a quote and a code fence", () => {
    expect(first("> Assume no taxes.")).toMatchObject({ t: "quote" });
    expect(first("```\nQd = 100 - 2P\n```")).toEqual({ t: "code", v: "Qd = 100 - 2P" });
  });

  it("closes an unclosed fence at the end of the text", () => {
    // A host who forgets the closing fence gets their text, not a blank page.
    expect(first("```\nleft open")).toEqual({ t: "code", v: "left open" });
  });

  it("survives an empty statement", () => {
    expect(parseBlocks("")).toEqual([]);
    expect(parseBlocks("   \n  \n")).toEqual([]);
  });

  it("reads a whole problem the way it was written", () => {
    const blocks = parseBlocks(
      [
        "## Problem 4",
        "",
        "Demand is $Q_d = 100 - 2P$.",
        "",
        "| P | Qd |",
        "| --- | ---: |",
        "| 10 | 80 |",
        "",
        "- Find the equilibrium",
        "- State the surplus",
      ].join("\n")
    );
    expect(blocks.map((b) => b.t)).toEqual(["h", "p", "table", "ul"]);
  });
});

describe("plainText", () => {
  it("flattens a statement for a list", () => {
    expect(plainText("## Problem 4\n\nDemand is $Q_d = 100$.")).toBe("Problem 4 Demand is Q_d = 100 .");
  });

  it("cuts a long one at the limit", () => {
    const out = plainText("word ".repeat(100), 40);
    expect(out.length).toBeLessThanOrEqual(40);
    expect(out.endsWith("…")).toBe(true);
  });
});
