"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconMap,
  IconBulb,
  IconArticle,
  IconBookmark,
  IconNotes,
  IconTrophy,
  IconBriefcase,
  IconMicroscope,
  IconSwords,
  IconConfetti,
  IconPencil,
} from "@tabler/icons-react";
import { AuthStatus } from "@/components/AuthStatus";
import { SidebarSkyline } from "@/components/SidebarSkyline";

interface NavItemProps {
  item: {
    name: string;
    href: string;
    matchHref?: string;
    icon: React.ElementType;
    badge?: string;
  };
  pathname: string;
  setIsOpen: (val: boolean) => void;
  /** Design token the section is coloured with. */
  tone: string;
}

const NavItem = ({ item, pathname, setIsOpen, tone }: NavItemProps) => {
  const isActive =
    item.href === "/home"
      ? pathname === "/home"
      : item.matchHref
        ? pathname.includes(item.matchHref)
        : pathname.startsWith(item.href);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={() => setIsOpen(false)}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 py-1.5 pl-1.5 pr-3 min-h-[48px] text-sm rounded-full transition-all duration-150 active:scale-[0.98] ${
        isActive
          ? "bg-white text-brand-800 font-bold shadow-[0_4px_14px_rgba(0,0,0,.22)]"
          : "text-white font-medium hover:bg-[var(--rail-tile)] hover:translate-x-[3px]"
      }`}
    >
      {/* The icon sits on its own tile, which takes the section's colour when
          the page is open — the same tone the page itself uses. */}
      <span
        className="w-9 h-9 rounded-full grid place-items-center shrink-0 transition-colors"
        style={
          isActive
            ? { background: `var(--${tone})`, color: "#fff" }
            : { background: "var(--rail-tile)", color: "#fff" }
        }
      >
        <Icon
          size={18}
          stroke={1.6}
          fill={isActive && item.name === "Concepts" ? "currentColor" : "none"}
        />
      </span>

      <span className="truncate">{item.name}</span>

      {item.badge && (
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold bg-[var(--rail-tile-hover)]">
          {item.badge}
        </span>
      )}

      {/* A dot on the open row. The white pill already says which page you are
          on; this says it again at the end of the line, where the eye lands
          when it is scanning down the rail rather than reading it. */}
      {isActive && !item.badge && (
        <span
          className="ml-auto w-2 h-2 rounded-full shrink-0"
          style={{ background: `var(--${tone})` }}
          aria-hidden
        />
      )}
    </Link>
  );
};

/** A section label, its tone dot and the rule that carries it across. */
const SectionLabel = ({ children, tone }: { children: React.ReactNode; tone: string }) => (
  // The dot is not decoration: it is the colour that section's own pages are
  // set in, so the rail says where you are about to go as well as where you
  // are. The rule that used to run past it is gone — with the sections spaced
  // this far apart it was holding nothing together.
  <h3 className="flex items-center gap-2.5 pl-3 text-[11px] font-[700] tracking-[0.12em] uppercase mb-3 text-rail-dim">
    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: `var(--${tone})` }} aria-hidden />
    {children}
  </h3>
);

export default function Sidebar() {
  const pathname = usePathname() || "";
  const match = pathname.match(/^\/lessons\/(\d+)/);
  const currentLessonId = match ? match[1] : "1";
  
  const dashboardItems = [
    { name: "Home", href: "/home", icon: IconHome },
    { name: "Roadmap", href: "/roadmap", icon: IconMap },
    { name: "Leaderboard", href: "/leaderboard", icon: IconTrophy },
    { name: "Duel", href: "/duel", matchHref: "/duel", icon: IconSwords },
    { name: "Compete", href: "/compete", matchHref: "/compete", icon: IconConfetti },
    { name: "Practice", href: "/practice", matchHref: "/practice", icon: IconPencil },
  ];

  /* Directories of people to reach outside the course — they answer a
     different question from the daily lessons, so they get their own group. */
  const opportunityItems = [
    { name: "Internships", href: "/internships", matchHref: "/internships", icon: IconBriefcase },
    { name: "Research", href: "/research", matchHref: "/research", icon: IconMicroscope },
  ];

  const learnItems = [
    {
      name: "Concepts",
      href: `/lessons/${currentLessonId}/concepts`,
      matchHref: "/concepts",
      icon: IconBulb,
    },
    {
      name: "Articles",
      href: `/lessons/${currentLessonId}/articles`,
      matchHref: "/articles",
      icon: IconArticle,
    },
    {
      name: "Quizzes",
      href: `/lessons/${currentLessonId}/quizzes`,
      matchHref: "/quizzes",
      icon: IconNotes,
    },
    {
      name: "My Notes",
      href: "/saved",
      matchHref: "/saved",
      icon: IconBookmark,
    },
  ];

  return (
    // The rail floats: a rounded panel with the page showing around it, rather
    // than a slab welded to the window edge. `h-full` is gone on purpose — the
    // flex row stretches it, and a height of 100% plus margins overflows.
    <aside
      className="app-chrome hidden md:flex w-[260px] m-s3 mr-0 rounded-xl text-white flex-col shrink-0 group relative z-40 overflow-hidden shadow-sh3"
      style={{
        background:
          "linear-gradient(170deg, var(--rail-top) 0%, var(--rail-mid) 45%, var(--rail-bottom) 100%)",
      }}
    >
      {/* Two soft lights behind everything, so a long flat panel has somewhere
          for the eye to rest. Pointer-events off: they are paint, not surface. */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(420px 320px at 85% -5%, var(--rail-glow), transparent 70%), radial-gradient(360px 300px at 0% 72%, var(--rail-glow), transparent 70%)",
        }}
      />

      {/* Scrollable area */}
      <div className="relative flex-1 overflow-y-auto overflow-x-hidden py-7 px-4 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Logo Header */}
        <div className="flex items-center gap-4 mb-8 relative px-1">
          {/* No white tile and no padding behind it: the mark is already a
              rounded square of its own, and a frame around a frame reads as a
              black sticker stuck on a white one. */}
          <div className="shrink-0 w-11 h-11 rounded-xl shadow-sm overflow-hidden">
            <img
              src="/favicon.png"
              alt="That's So Econ"
              width={44}
              height={44}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/90 leading-none mb-0.5">That&apos;s So</span>
            <span className="text-2xl font-black text-white leading-none">Econ<span className="text-white">!</span></span>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="mb-6">
          <SectionLabel tone="quiz">Dashboard</SectionLabel>
          <nav className="space-y-1">
            {dashboardItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} setIsOpen={() => {}} tone="quiz" />
            ))}
          </nav>
        </div>

        {/* Learn Section */}
        <div className="mb-6">
          <SectionLabel tone="article">Learn</SectionLabel>
          <nav className="space-y-1">
            {learnItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} setIsOpen={() => {}} tone="article" />
            ))}
          </nav>
        </div>

        {/* Opportunities Section */}
        <div>
          <SectionLabel tone="reward">Opportunities</SectionLabel>
          <nav className="space-y-1">
            {opportunityItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} setIsOpen={() => {}} tone="reward" />
            ))}
          </nav>
        </div>

        {/* The panel ends on a horizon: the city this course is about building. */}
        <div className="mt-auto -mx-4 pt-10">
          <SidebarSkyline />
        </div>
      </div>

      {/* Outside the scrolling area on purpose. Twelve rows and a skyline
          already overflow a short laptop, and signing out is not something to
          go looking for. Signing out used to be a grey line under a rule; on
          its own card it is something you can see and aim at. */}
      <div className="relative shrink-0 px-4 pb-4 pt-2">
        <div className="rounded-xl border border-rail-line bg-[var(--rail-tile)] px-2 py-1.5">
          <AuthStatus />
        </div>
      </div>
    </aside>
  );
}
