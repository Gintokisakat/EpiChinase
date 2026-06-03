"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/dashboard", icon: "🏠", label: "Inicio" },
  { href: "/review", icon: "📖", label: "Repasar" },
  { href: "/learn", icon: "📚", label: "Aprender" },
  { href: "/practice", icon: "🎯", label: "Practicar" },
  { href: "/stats", icon: "📊", label: "Estadísticas" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const hiddenPaths = ["/login", "/signup"];
  if (hiddenPaths.includes(pathname)) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-ink/5 bg-white/90 backdrop-blur-md safe-area-inset-bottom">
      <div className="mx-auto flex max-w-lg justify-around px-2 py-1">
        {tabs.map((tab) => {
          const active = tab.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[10px] transition-colors ${
                active ? "text-jade-600" : "text-ink/40 hover:text-ink/60"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
