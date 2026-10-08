"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  IconHome, IconMap, IconBulb, IconArticle, IconBookmark, IconNotes,
  IconTrophy, IconBriefcase, IconMicroscope, IconConfetti, IconPencil,
  IconChevronLeft, IconLogout,
} from "@tabler/icons-react";
import { SidebarSkyline } from "@/components/SidebarSkyline";

/**
 * The navigation rail.
 *
 * A flat panel in the brand colour rather than a gradient under two soft
 * lights: with one purple everywhere, the gradient was the only place in the
 * app still mixing three of them, and at this width nobody reads it as depth.
 *
 * It collapses to an icon rail. That is the one thing a 248px panel owes a
 * 1280px laptop, and the choice is remembered — wrapped, because site data can
 * be cleared and a rail that refuses to render is worse than one that forgets.
 */

const STORE = "tse.rail.collapsed";

interface Item {
  name: string;
  href: string;
  matchHref?: string;
  icon: React.ElementType;
}

function NavItem({
  item, pathname, collapsed,
}: {
  item: Item;
  pathname: string;
  collapsed: boolean;
}) {
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
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? item.name : undefined}
      className={`flex items-center gap-3 min-h-[48px] rounded-md text-read font-medium transition-colors ${
        collapsed ? "justify-center px-0" : "px-3"
      } ${
        isActive
          ? "bg-white font-bold"
          : "text-white font-medium hover:bg-[var(--rail-tile)]"
      }`}
      style={isActive ? { color: "var(--accent-strong)" } : undefined}
    >
      <Icon size={21} stroke={1.8} className="shrink-0" />
      {!collapsed && <span className="truncate">{item.name}</span>}
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname() || "";
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  /**
   * The server cannot know the choice, so the rail is rendered open and
   * corrected on mount. Without this flag that correction *animates*, and
   * every page load began with the rail sliding shut in front of you.
   */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORE) === "1");
    } catch {
      /* private window, blocked storage — it simply opens expanded */
    }
    setMounted(true);
  }, []);

  const toggle = () =>
    setCollapsed((v) => {
      const next = !v;
      try {
        window.localStorage.setItem(STORE, next ? "1" : "0");
      } catch {
        /* as above */
      }
      return next;
    });

  const match = pathname.match(/^\/lessons\/(\d+)/);
  const lessonId = match ? match[1] : "1";

  const groups: { label: string; items: Item[] }[] = [
    {
      label: "Dashboard",
      items: [
        { name: "Home", href: "/home", icon: IconHome },
        { name: "Roadmap", href: "/roadmap", matchHref: "/roadmap", icon: IconMap },
        { name: "Leaderboard", href: "/leaderboard", matchHref: "/leaderboard", icon: IconTrophy },
      ],
    },
    {
      label: "Case competitions",
      items: [
        { name: "Practice", href: "/practice", matchHref: "/practice", icon: IconPencil },
        { name: "Competitions", href: "/compete", matchHref: "/compete", icon: IconConfetti },
      ],
    },
    {
      label: "Learn",
      items: [
        { name: "Concepts", href: `/lessons/${lessonId}/concepts`, matchHref: "/concepts", icon: IconBulb },
        { name: "Articles", href: `/lessons/${lessonId}/articles`, matchHref: "/articles", icon: IconArticle },
        { name: "Quizzes", href: `/lessons/${lessonId}/quizzes`, matchHref: "/quizzes", icon: IconNotes },
        { name: "My notes", href: "/saved", matchHref: "/saved", icon: IconBookmark },
      ],
    },
    {
      label: "Opportunities",
      items: [
        { name: "Internships", href: "/internships", matchHref: "/internships", icon: IconBriefcase },
        { name: "Research", href: "/research", matchHref: "/research", icon: IconMicroscope },
      ],
    },
  ];

  const name = session?.user?.name || session?.user?.email || "Student";

  return (
    <aside
      className={`app-chrome hidden md:flex ${collapsed ? "w-[84px]" : "w-[272px]"} m-s3 mr-0 rounded-lg text-white flex-col shrink-0 relative z-40 overflow-hidden shadow-sh3 ${mounted ? "transition-[width] duration-200" : ""}`}
      style={{ background: "var(--accent)" }}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className={`flex items-center gap-s3 px-s2 pt-s3 pb-s3 ${collapsed ? "flex-col" : ""}`}>
        <span className="w-[42px] h-[42px] rounded-md bg-white grid place-items-center shrink-0 overflow-hidden p-1.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/favicon.png" alt="That's So Econ" width={38} height={38} className="w-full h-full object-contain" />
        </span>

        {!collapsed && (
          <span className="leading-[1.05] whitespace-nowrap min-w-0">
            <small className="block text-[11px] font-semibold opacity-80">That&apos;s So</small>
            <b className="font-reading text-h3 font-semibold tracking-tight">Econ!</b>
          </span>
        )}

        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          className={`${collapsed ? "" : "ml-auto"} w-8 h-8 rounded-md grid place-items-center shrink-0 transition-colors`}
          style={{ background: "var(--rail-tile)" }}
        >
          <IconChevronLeft
            size={16}
            stroke={2.4}
            style={{ transform: collapsed ? "rotate(180deg)" : undefined }}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-s2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {groups.map((g) => (
          <div key={g.label}>
            {collapsed ? (
              <div className="h-px mx-s3 my-s3" style={{ background: "var(--rail-line)" }} aria-hidden />
            ) : (
              <h3 className="text-ui font-semibold px-3 mt-s5 mb-s2 whitespace-nowrap first:mt-s2 text-rail-dim">
                {g.label}
              </h3>
            )}
            <div className="flex flex-col gap-1">
              {g.items.map((item) => (
                <NavItem key={item.name} item={item} pathname={pathname} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}

        {/* The panel ends on a horizon: the city this course is about building. */}
        {!collapsed && (
          <div className="mt-s6 -mx-s2">
            <SidebarSkyline />
          </div>
        )}
      </nav>

      {/* Whoever is signed in. Outside the scroll, so signing out is never
          below the fold on a short laptop. */}
      <div
        className={`shrink-0 flex items-center gap-s3 px-s2 pt-s3 pb-s3 mt-s2 mx-s2 border-t ${collapsed ? "justify-center" : ""}`}
        style={{ borderColor: "var(--rail-line)" }}
      >
        <span
          className="w-10 h-10 rounded-full grid place-items-center font-semibold text-ui shrink-0 bg-white"
          style={{ color: "var(--accent-strong)" }}
          aria-hidden
        >
          {name.charAt(0).toUpperCase()}
        </span>

        {!collapsed && (
          <>
            <span className="min-w-0 leading-[1.25]">
              <b className="block text-read font-bold truncate leading-tight">{name}</b>
              <span className="text-meta opacity-75">Student</span>
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              aria-label="Sign out"
              title="Sign out"
              className="ml-auto w-9 h-9 rounded-md grid place-items-center shrink-0 transition-colors hover:bg-[var(--rail-tile)]"
            >
              <IconLogout size={18} stroke={2} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
