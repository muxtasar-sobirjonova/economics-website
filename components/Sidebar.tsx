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
      className={`flex items-center gap-3 py-1.5 pl-1.5 pr-3 text-sm rounded-xl transition-all duration-150 active:scale-[0.98] ${
        isActive
          ? "bg-white text-brand-800 font-bold shadow-[0_2px_10px_rgba(0,0,0,.18)]"
          : "text-white font-medium hover:bg-[rgba(255,255,255,.09)] hover:translate-x-[3px]"
      }`}
    >
      {/* The icon sits on its own tile, which takes the section's colour when
          the page is open — the same tone the page itself uses. */}
      <span
        className="w-8 h-8 rounded-lg grid place-items-center shrink-0 transition-colors"
        style={
          isActive
            ? { background: `var(--${tone}-soft)`, color: `var(--${tone})` }
            : { background: "rgba(255,255,255,.10)", color: "#fff" }
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
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold bg-[rgba(255,255,255,.16)]">
          {item.badge}
        </span>
      )}
    </Link>
  );
};

/** A section label, its tone dot and the rule that carries it across. */
const SectionLabel = ({ children, tone }: { children: React.ReactNode; tone: string }) => (
  <h3 className="flex items-center gap-2.5 pl-1.5 text-[11px] font-[700] tracking-[0.1em] uppercase mb-3 text-[rgba(255,255,255,.72)]">
    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: `var(--${tone})` }} aria-hidden />
    {children}
    <span className="h-px flex-1 bg-[rgba(255,255,255,.16)]" aria-hidden />
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
    <aside className="hidden md:flex w-[248px] text-white flex-col h-full shrink-0 group border-r border-[rgba(0,0,0,.25)] relative z-40 bg-gradient-to-b from-[#5A4F94] via-[#4C4380] to-[#3A3163]">
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-7 px-5 flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Logo Header */}
        <div className="flex items-center gap-4 mb-8 relative px-1">
          <div className="bg-white text-white font-black text-[22px] shrink-0 flex items-center justify-center w-11 h-11 rounded-xl shadow-sm overflow-hidden p-1">
            <img src="/favicon.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/90 leading-none mb-0.5">That&apos;s So</span>
            <span className="text-2xl font-black text-white leading-none">Econ<span className="text-white">!</span></span>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="mb-7">
          <SectionLabel tone="quiz">Dashboard</SectionLabel>
          <nav className="space-y-1">
            {dashboardItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} setIsOpen={() => {}} tone="quiz" />
            ))}
          </nav>
        </div>

        {/* Learn Section */}
        <div className="mb-7">
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
        <div className="mt-auto -mx-5 pt-10">
          <SidebarSkyline />
        </div>

        <div className="pt-4 border-t border-[rgba(255,255,255,.14)]">
          <AuthStatus />
        </div>
      </div>
    </aside>
  );
}
