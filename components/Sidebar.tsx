"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  IconHome,
  IconMap,
  IconBulb,
  IconWorld,
  IconArticle,
  IconClipboardList,
  IconBookmark,
  IconMoon,
  IconChevronLeft,
  IconChevronDown,
  IconArrowRight,
  IconPencil,
  IconNotes,
  IconBell,
  IconMenu2,
  IconX
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
  
  const [isOpen, setIsOpen] = useState(false);

  const dashboardItems = [
    { name: "Home", href: "/home", icon: IconHome },
    { name: "Roadmap", href: "/roadmap", icon: IconMap },
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
    <>
      {/* Mobile Header / Hamburger */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#51487F] text-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-brand-primary text-white font-black text-lg shrink-0 flex items-center justify-center w-8 h-8 rounded-lg shadow-sm">
             T
          </div>
          <span className="font-bold text-white text-lg tracking-wide">
            That's So Econ.
          </span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1" aria-label="Toggle menu" aria-expanded={isOpen}>
          {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
        </button>
      </div>

      <aside className={`w-[240px] text-white flex flex-col h-full shrink-0 relative group border-r border-[#3A3C56] bg-[#51487F] transition-transform duration-300 md:translate-x-0 fixed md:relative z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"}`} >
        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-7 px-5 flex flex-col">
          {/* Logo Header */}
          <div className="hidden md:flex items-center gap-3 mb-6 relative px-1">
            <div className="bg-brand-primary text-white font-black text-[22px] shrink-0 flex items-center justify-center w-11 h-11 rounded-xl shadow-sm">
               T
            </div>
            <span className="font-bold text-white text-[22px] tracking-wide">
              That's So Econ.
            </span>
          </div>



          {/* Dashboard Section */}
          <div className="mb-8">
            <h3 className="pl-3 text-[11px] font-[700] tracking-[0.1em] text-gray-200 uppercase mb-3">
              DASHBOARD
            </h3>
            <nav className="space-y-1.5">
              {dashboardItems.map((item) => (
                <NavItem key={item.name} item={item} pathname={pathname} setIsOpen={setIsOpen} />
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
                <NavItem key={item.name} item={item} pathname={pathname} setIsOpen={setIsOpen} />
              ))}
            </nav>
          </div>

          {/* Bottom Area (User Profile) */}
          <div className="mt-auto pt-6 border-t border-[#3A3C56]">
            <AuthStatus />
          </div>
        </div>
      </aside>
      
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" aria-hidden="true" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
}
