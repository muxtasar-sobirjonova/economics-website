"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  IconHome,
  IconMap,
  IconTrophy,
} from "@tabler/icons-react";
import { AuthStatus } from "@/components/AuthStatus";

interface NavItemProps {
  item: {
    name: string;
    href: string;
    matchHref?: string;
    icon?: React.ElementType;
    /** Activity types are identified by their colour swatch, not an icon. */
    swatch?: string;
  };
  pathname: string;
}

const NavItem = ({ item, pathname }: NavItemProps) => {
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
      className={`flex items-center gap-s3 px-s3 py-[9px] rounded-md text-ui transition-colors ${
        isActive
          ? "bg-accent-soft text-accent-strong font-semibold shadow-[inset_2px_0_0_var(--accent)]"
          : "text-muted font-medium hover:bg-surface hover:text-ink"
      }`}
    >
      {Icon ? (
        <Icon size={16} stroke={2} className="shrink-0" />
      ) : (
        <span
          aria-hidden
          className="w-[7px] h-[7px] rounded-sm shrink-0"
          style={{ background: item.swatch }}
        />
      )}
      <span className="truncate">{item.name}</span>
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname() || "";
  const match = pathname.match(/^\/lessons\/(\d+)/);
  const currentLessonId = match ? match[1] : "1";

  const dashboardItems = [
    { name: "Home", href: "/home", icon: IconHome },
    { name: "Roadmap", href: "/roadmap", icon: IconMap },
    { name: "Leaderboard", href: "/leaderboard", icon: IconTrophy },
  ];

  const learnItems = [
    { name: "Concepts", href: `/lessons/${currentLessonId}/concepts`, matchHref: "/concepts", swatch: "var(--concept)" },
    { name: "Articles", href: `/lessons/${currentLessonId}/articles`, matchHref: "/articles", swatch: "var(--article)" },
    { name: "Quizzes", href: `/lessons/${currentLessonId}/quizzes`, matchHref: "/quizzes", swatch: "var(--quiz)" },
    { name: "My Notes", href: "/saved", matchHref: "/saved", swatch: "var(--faint)" },
  ];

  return (
    <aside className="hidden md:flex w-[232px] flex-col h-full shrink-0 bg-bg-sunk border-r border-line relative z-40">
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-s5 px-[14px] flex flex-col gap-s5">
        {/* Wordmark */}
        <Link href="/home" className="flex items-center gap-s3 px-[6px] rounded-md">
          <span className="w-9 h-9 rounded-md bg-surface border border-line grid place-items-center shrink-0 overflow-hidden p-1">
            <Image src="/favicon.png" alt="" width={28} height={28} className="w-full h-full object-contain" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-label uppercase text-faint">That&apos;s So</span>
            <span className="text-h3 font-semibold text-ink tracking-[-.02em] mt-[3px]">Econ</span>
          </span>
        </Link>

        <div>
          <h3 className="text-label font-semibold uppercase text-faint px-s2 pb-s2">
            Dashboard
          </h3>
          <nav className="grid gap-[2px]">
            {dashboardItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-label font-semibold uppercase text-faint px-s2 pb-s2">
            Learn
          </h3>
          <nav className="grid gap-[2px]">
            {learnItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>

        <div className="mt-auto">
          <AuthStatus />
        </div>
      </div>
    </aside>
  );
}
