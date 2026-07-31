"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconMap,
  IconBulb,
  IconTrophy,
} from "@tabler/icons-react";

export function MobileBottomNav() {
  const pathname = usePathname() || "";

  const navItems = [
    { name: "Home", href: "/home", icon: IconHome },
    { name: "Roadmap", href: "/roadmap", icon: IconMap },
    { name: "Leaderboard", href: "/leaderboard", icon: IconTrophy },
    { name: "Challenges", href: "/challenges", matchHref: "/challenges", icon: IconBulb },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around py-1.5 px-2">
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
              className={`flex flex-col items-center justify-center flex-1 px-1 py-1.5 rounded-xl transition-all ${
                isActive 
                  ? "text-brand-primary" 
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`flex items-center justify-center w-12 h-8 rounded-full mb-1 transition-colors ${isActive ? "bg-brand-primary/10" : "bg-transparent"}`}>
                 <Icon size={22} stroke={isActive ? 2.5 : 1.5} />
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
