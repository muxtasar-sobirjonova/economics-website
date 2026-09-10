import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { parseBlocks, type Block, type Inline } from "@/lib/compete/markdown";

/**
 * Drawing a problem.
 *
 * Every node comes from the parser as data and is turned into an element here,
 * so nothing an author writes can become markup. Maths is the exception, and a
 * narrow one: KaTeX is handed the formula string and produces its own markup
 * from it, with `trust` off so `\href` and friends are refused.
 */

function Math({ tex, display }: { tex: string; display: boolean }) {
  let html: string;
  try {
    html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      trust: false,
      output: "html",
    });
  } catch {
    // A formula nobody can parse is shown as it was typed. A problem with one
    // bad line should still be a readable problem.
    return <code className="font-mono text-meta">{tex}</code>;
  }

  return (
    <span
      className={display ? "block overflow-x-auto py-s2" : "inline-block align-middle"}
      // KaTeX's own output, from a string it was handed verbatim.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Spans({ nodes }: { nodes: Inline[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.t) {
          case "text":
            return <React.Fragment key={i}>{n.v}</React.Fragment>;
          case "bold":
            return (
              <strong key={i} className="font-semibold text-ink">
                <Spans nodes={n.v} />
              </strong>
            );
          case "italic":
            return (
              <em key={i}>
                <Spans nodes={n.v} />
              </em>
            );
          case "code":
            return (
              <code
                key={i}
                className="font-mono text-meta px-1 py-[1px] rounded-sm bg-bg-sunk text-ink"
              >
                {n.v}
              </code>
            );
          case "math":
            return <Math key={i} tex={n.v} display={false} />;
          case "break":
            return <br key={i} />;
        }
      })}
    </>
  );
}

function One({ block }: { block: Block }) {
  switch (block.t) {
    case "p":
      return (
        <p className="text-ui text-ink leading-relaxed">
          <Spans nodes={block.v} />
        </p>
      );

    case "h":
      return block.level === 2 ? (
        <h3 className="text-h3 font-semibold text-ink">
          <Spans nodes={block.v} />
        </h3>
      ) : (
        <h4 className="text-ui font-semibold text-ink">
          <Spans nodes={block.v} />
        </h4>
      );

    case "ul":
      return (
        <ul className="list-disc pl-s5 flex flex-col gap-s2 text-ui text-ink">
          {block.items.map((item, i) => (
            <li key={i}>
              <Spans nodes={item} />
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol start={block.start} className="list-decimal pl-s5 flex flex-col gap-s2 text-ui text-ink">
          {block.items.map((item, i) => (
            <li key={i}>
              <Spans nodes={item} />
            </li>
          ))}
        </ol>
      );

    case "quote":
      return (
        <blockquote className="border-l-2 border-line pl-s4 text-ui text-muted italic">
          <Spans nodes={block.v} />
        </blockquote>
      );

    case "code":
      return (
        <pre className="rounded-md border border-line bg-bg-sunk p-s3 overflow-x-auto">
          <code className="font-mono text-meta text-ink whitespace-pre">{block.v}</code>
        </pre>
      );

    case "mathBlock":
      return <Math tex={block.v} display />;

    case "image":
      return (
        // A diagram out of a paper arrives at whatever size it was scanned;
        // next/image wants dimensions nobody here has.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.src}
          alt={block.alt}
          loading="lazy"
          className="max-w-full h-auto rounded-md border border-line bg-white"
        />
      );

    case "table":
      return (
        // The table scrolls, the page does not: a wide table on a phone must
        // never make the whole problem slide sideways.
        <div className="overflow-x-auto rounded-md border border-line">
          <table className="w-full border-collapse text-meta">
            <thead>
              <tr>
                {block.head.map((cell, i) => (
                  <th
                    key={i}
                    scope="col"
                    className="text-label uppercase text-faint bg-bg-sunk px-s3 py-s2 border-b border-line whitespace-nowrap"
                    style={{ textAlign: block.align[i] ?? "left" }}
                  >
                    <Spans nodes={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td
                      key={c}
                      className="px-s3 py-s2 border-b border-line text-ink tabular last:border-b-0"
                      style={{ textAlign: block.align[c] ?? "left" }}
                    >
                      <Spans nodes={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** A written problem, a solution, or a host's note. */
export function Rich({ source, className = "" }: { source: string; className?: string }) {
  const blocks = parseBlocks(source);
  if (blocks.length === 0) return null;

  return (
    <div className={`flex flex-col gap-s3 ${className}`}>
      {blocks.map((block, i) => (
        <One key={i} block={block} />
      ))}
    </div>
  );
}
