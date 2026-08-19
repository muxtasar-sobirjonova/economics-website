"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconMap,
  IconBulb,
  IconTrophy,
  IconArticle,
  IconBookmark,
  IconNotes,
  IconBriefcase,
  IconMicroscope,
} from "@tabler/icons-react";

export function MobileBottomNav() {
  const pathname = usePathname() || "";
  const match = pathname.match(/^\/lessons\/(\d+)/);
  const currentLessonId = match ? match[1] : "1";

  const navItems = [
    { name: "Home", href: "/home", icon: IconHome },
    { name: "Roadmap", href: "/roadmap", icon: IconMap },
    { name: "Leaderboard", href: "/leaderboard", icon: IconTrophy },
    // Same order as the sidebar groups: dashboard, then opportunities, then learn.
    { name: "Internships", href: "/internships", matchHref: "/internships", icon: IconBriefcase },
    { name: "Research", href: "/research", matchHref: "/research", icon: IconMicroscope },
    { name: "Concepts", href: `/lessons/${currentLessonId}/concepts`, matchHref: "/concepts", icon: IconBulb },
    { name: "Articles", href: `/lessons/${currentLessonId}/articles`, matchHref: "/articles", icon: IconArticle },
    { name: "Quizzes", href: `/lessons/${currentLessonId}/quizzes`, matchHref: "/quizzes", icon: IconNotes },
    { name: "Notes", href: "/saved", matchHref: "/saved", icon: IconBookmark },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center overflow-x-auto py-1.5 px-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navItems.map((item) => {
          const isActive =
            item.href === "/home" || item.href === "/profile"
              ? pathname === item.href
              : item.matchHref
                ? pathname.includes(item.matchHref)
                : pathname.startsWith(item.href);
          
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 shrink-0 min-w-[72px] px-1 py-1.5 rounded-xl transition-all snap-center ${
                isActive 
                  ? "text-brand-primary" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`flex items-center justify-center w-12 h-8 rounded-full mb-1 transition-colors ${isActive ? "bg-brand-primary/10" : "bg-transparent"}`}>
                 <Icon size={22} stroke={isActive ? 2.5 : 1.5} fill={isActive && item.name === "Concepts" ? "currentColor" : "none"} />
              </div>
              <span className={`text-[10px] tracking-wide ${isActive ? "font-bold" : "font-medium"}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
