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
} from "@tabler/icons-react";
import { AuthStatus } from "@/components/AuthStatus";

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
}

const NavItem = ({ item, pathname, setIsOpen }: NavItemProps) => {
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
      className={`flex items-center py-2.5 text-sm gap-3 transition-all duration-150 active:scale-[0.97] rounded-xl relative overflow-hidden border-l-[3px] ${
        isActive
          ? "font-bold shadow-sm pl-[9px] pr-3 bg-[#362A5C] text-white border-l-white"
          : "text-white hover:bg-[#51487F] hover:text-white font-medium px-3 border-transparent"
      }`}
    >
      <div className="flex items-center gap-3 z-10 relative">
        <div className={isActive ? "" : "text-white"}>
          <Icon 
            size={20} 
            stroke={1.5} 
            fill={isActive && item.name === "Concepts" ? "currentColor" : "none"} 
          />
        </div>
        <span>{item.name}</span>
      </div>
      {item.badge && (
        <span className="bg-[#51487F] text-white text-[10px] px-2 py-0.5 rounded-full ml-auto font-bold z-10 relative">
          {item.badge}
        </span>
      )}
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
    { name: "My Challenges", href: "/challenges", matchHref: "/challenges", icon: IconBulb },
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
    <aside className="hidden md:flex w-[240px] text-white flex-col h-full shrink-0 group border-r border-[#3A3C56] bg-[#51487F] relative z-40">
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-7 px-5 flex flex-col">
        {/* Logo Header */}
        <div className="flex items-center gap-3 mb-6 relative px-1">
          <div className="bg-brand-primary text-white font-black text-[22px] shrink-0 flex items-center justify-center w-11 h-11 rounded-xl shadow-sm">
             T
          </div>
          <span className="font-bold text-white text-[22px] tracking-wide">
            That&apos;s So Econ.
          </span>
        </div>

        {/* Dashboard Section */}
        <div className="mb-8 mt-2">
          <h3 className="pl-3 text-[11px] font-[700] tracking-[0.1em] text-gray-200 uppercase mb-3">
            DASHBOARD
          </h3>
          <nav className="space-y-1.5">
            {dashboardItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} setIsOpen={() => {}} />
            ))}
          </nav>
        </div>

        {/* Learn Section */}
        <div>
          <h3 className="pl-3 text-[11px] font-[700] tracking-[0.1em] text-gray-200 uppercase mb-3">
            LEARN
          </h3>
          <nav className="space-y-1.5">
            {learnItems.map((item) => (
              <NavItem key={item.name} item={item} pathname={pathname} setIsOpen={() => {}} />
            ))}
          </nav>
        </div>

        {/* Bottom Area (User Profile) */}
        <div className="mt-auto pt-6 border-t border-[#3A3C56]">
          <AuthStatus />
        </div>
      </div>
    </aside>
  );
}
