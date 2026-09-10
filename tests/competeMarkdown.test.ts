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

  it("splits paragraphs on blank lines and keeps line breaks inside one", () => {
    const blocks = parseBlocks("Line one\nLine two\n\nSecond paragraph");
    expect(blocks).toHaveLength(2);
    expect(blocks[0].t).toBe("p");
    expect(textOf((blocks[0] as { v: Inline[] }).v)).toBe("Line one\nLine two");
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
