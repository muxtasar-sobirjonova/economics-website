import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  professors, reachOf, REACH_COPY, initialsOf, universityShort, tierLabel, tierRank,
} from "@/lib/research";
import { Directory } from "@/components/directory/Directory";
import type { DirConfig, DirRow } from "@/components/directory/types";

export const metadata: Metadata = {
  title: "Research Register | That's So Econ",
  description:
    "Faculty at Uzbekistan's universities and the contact each one publishes, so a research question reaches a person.",
};

const RANK = { personal: 0, office: 1, none: 2 } as const;

const ICON = {
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M17 4.5a3.5 3.5 0 010 7M21.5 20c0-2.8-1.7-4.8-4-5.6"/>',
  cap: '<path d="M3 9l9-5 9 5-9 5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
};

function tally(items: string[]) {
  const n: Record<string, number> = {};
  items.forEach((k) => (n[k] = (n[k] ?? 0) + 1));
  return Object.keys(n)
    .map((name) => ({ name, count: n[name] }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default async function ResearchPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const rows: DirRow[] = professors.map((p) => {
    const reach = reachOf(p.contactType);
    const copy = REACH_COPY[reach];

    return {
      id: p.id,
      title: p.name,
      subtitle: `${p.title ?? "Faculty"} · ${universityShort(p.university)}`,
      initial: initialsOf(p.name),
      group: p.university,
      place: p.city ?? "Unlisted",
      badge: {
        label: copy.label,
        tone: reach === "personal" ? "strong" : reach === "office" ? "soft" : "none",
      },
      flags: {
        direct: reach === "personal",
        contact: reach !== "none",
        [tierLabel(p.tier)]: true,
      },
      fields: [
        { label: "University", value: p.university },
        { label: "Department", value: p.department },
        { label: "Email", value: p.email, copy: true },
        { label: "Phone", value: p.phone, copy: true },
      ],
      note: { title: copy.label, body: copy.hint },
      mailto: p.email,
      sourceUrl: p.sourceUrl,
      // Direct contacts first, then the better-known universities: the point of
      // the page is reaching someone, so the reachable rise.
      rank: RANK[reach] * 10 + tierRank(p.tier),
    };
  });

  const config: DirConfig = {
    title: "Research Register",
    sub: "Faculty at Uzbekistan's universities and the contact each one publishes, so your research question reaches a person rather than a form.",
    stats: [
      { label: "Professors", value: professors.length, icon: ICON.people },
      { label: "Universities", value: new Set(professors.map((p) => p.university)).size, icon: ICON.cap },
      { label: "Cities", value: new Set(professors.map((p) => p.city ?? "Unlisted")).size, icon: ICON.pin },
      { label: "Direct contact", value: rows.filter((r) => r.flags.direct).length, icon: ICON.mail },
    ],
    rows,
    groups: tally(professors.map((p) => p.university)),
    places: tally(professors.map((p) => p.city ?? "Unlisted")),
    groupNoun: "University",
    placeNoun: "city",
    placePlural: "cities",
    toggles: [
      { key: "direct", label: "Direct contact", icon: ICON.check },
      { key: "contact", label: "Has contact", icon: ICON.mail },
    ],
    bands: {
      label: "Tier",
      key: "tier",
      options: tally(professors.map((p) => tierLabel(p.tier))),
    },
    sortByPlace: "By city",
  };

  return <Directory config={config} storageKey="tse.research.saved" />;
}
