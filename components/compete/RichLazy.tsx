"use client";

import dynamic from "next/dynamic";

/**
 * `Rich`, loaded when there is something to draw.
 *
 * KaTeX and its stylesheet are most of what a page carrying `Rich` weighs, and
 * on the practice screen nothing needs drawing until a problem has been asked
 * for — which is a server round trip, so the chunk arrives while that is in
 * flight rather than before the page can be used at all. `/compete` lost
 * 120 kB of first load to exactly this and got it back the same way.
 *
 * `ssr: false` costs nothing here: every caller renders it after a click.
 */
export const RichLazy = dynamic(
  () => import("./Rich").then((m) => m.Rich),
  {
    ssr: false,
    loading: () => (
      <div
        className="rounded-md bg-bg-sunk animate-pulse"
        style={{ height: "4.5rem" }}
        aria-hidden
      />
    ),
  }
);
