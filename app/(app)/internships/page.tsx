import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { organisations, featured, regionLabel } from "@/lib/internships";
import { Directory } from "@/components/directory/Directory";
import type { DirConfig, DirRow } from "@/components/directory/types";

export const metadata: Metadata = {
  title: "Internship Exchange | That's So Econ",
  description:
    "Organisations across Uzbekistan that take interns, and how to reach them.",
};

const ICON = {
  building: '<path d="M4 21V7l8-4 8 4v14M9 21v-6h6v6"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  check: '<path d="M5 12l5 5 9-10"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 8l9 6 9-6"/>',
};

function tally(items: string[]) {
  const n: Record<string, number> = {};
  items.forEach((k) => (n[k] = (n[k] ?? 0) + 1));
  return Object.keys(n)
    .map((name) => ({ name, count: n[name] }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export default async function InternshipsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  /**
   * Two lists, one page.
   *
   * `organisations` is the public registry — 702 rows, most of which simply
   * exist near you. `featured` is the 33 somebody checked by hand, each with a
   * programme that actually takes interns. They share no id and almost no
   * names, so they are not the same rows with a flag: they are different
   * records, and the featured ones are the answer to the question the page is
   * really being asked.
   */
  /**
   * The registry's fourteen region names, to fold the featured list's free
   * text onto. "Tashkent HQ, nationwide" and "Tashkent" are one place, and a
   * dropdown that lists both twice is a dropdown nobody uses.
   */
  const known = [...new Set(organisations.map((o) => regionLabel(o.region)))];
  const toRegion = (raw: string) => {
    const text = raw.split("(")[0].trim();
    const hit = known.find((k) => text.toLowerCase().startsWith(k.toLowerCase()));
    return hit ?? text.split(",")[0].trim() ?? text;
  };

  const featuredRows: DirRow[] = featured.map((f, i) => {
    const region = toRegion(f.region);

    return {
      // Negative, so a featured id can never collide with a registry one.
      id: -(i + 1),
      title: f.name,
      subtitle: [f.address, region].filter(Boolean).join(" · "),
      initial: (f.name.trim()[0] ?? "?").toUpperCase(),
      group: f.sector,
      place: region,
      badge: { label: "Route", tone: "strong" },
      flags: { route: true, contact: Boolean(f.email || f.phone || f.website) },
      fields: [
        { label: "Address", value: f.address },
        { label: "Sector", value: f.sector },
        { label: "Email", value: f.email, copy: true },
        { label: "Phone", value: f.phone, copy: true },
        { label: "Website", value: f.website, copy: true },
      ],
      note: {
        title: "Confirmed internship route",
        body:
          f.notes ??
          "Somebody checked this one by hand: it runs a programme that takes interns.",
      },
      // These publish a careers portal more often than an address, so the
      // button goes to the source rather than to a mailbox that bounces.
      mailto: f.email && f.email.includes("@") ? f.email : null,
      sourceUrl: f.website ?? f.source,
      rank: 0,
    };
  });

  const taken = new Set(featured.map((f) => f.name.trim().toLowerCase()));

  const registryRows: DirRow[] = organisations
    .filter((o) => !taken.has(o.name.trim().toLowerCase()))
    .map((o) => {
    const region = regionLabel(o.region);
    const hasContact = Boolean(o.email || o.phone);

    return {
      id: o.id,
      title: o.name,
      subtitle: [o.address, o.city, region].filter(Boolean).join(" · "),
      initial: (o.name.trim()[0] ?? "?").toUpperCase(),
      group: o.category,
      place: region,
      flags: { route: false, contact: hasContact },
      fields: [
        { label: "Address", value: [o.address, o.city, region].filter(Boolean).join(", ") || null },
        { label: "Sector", value: o.category },
        { label: "Email", value: o.email, copy: true },
        { label: "Phone", value: o.phone, copy: true },
      ],
      note: null,
      mailto: o.email,
      sourceUrl: o.sourceUrl,
      // A confirmed route first, then anything you can actually write to.
      rank: 10 + (hasContact ? 0 : 1),
    };
  });

  const rows = [...featuredRows, ...registryRows];

  const config: DirConfig = {
    title: "Internship Exchange",
    sub: "Organisations across Uzbekistan that take interns, and how to reach them. Compiled from public registries and company sources.",
    stats: [
      { label: "Organisations", value: rows.length, icon: ICON.building },
      { label: "Regions", value: new Set(rows.map((r) => r.place)).size, icon: ICON.pin },
      { label: "Confirmed routes", value: rows.filter((r) => r.flags.route).length, icon: ICON.check },
      { label: "With contact", value: rows.filter((r) => r.flags.contact).length, icon: ICON.mail },
    ],
    rows,
    groups: tally(rows.map((r) => r.group)),
    places: tally(rows.map((r) => r.place)),
    groupNoun: "Sector",
    placeNoun: "region",
    placePlural: "regions",
    toggles: [
      { key: "route", label: "Confirmed route", icon: ICON.check },
      { key: "contact", label: "Has contact", icon: ICON.mail },
    ],
    sortByPlace: "By region",
  };

  return <Directory config={config} storageKey="tse.internships.saved" />;
}
