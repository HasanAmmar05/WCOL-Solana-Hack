"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Nav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Leaderboard" },
    { href: "/match", label: "Live Match" },
    { href: "/commit", label: "Terminal" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 h-16 flex items-center">
      <div className="w-full max-w-5xl mx-auto flex items-center px-6 gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="flex items-center justify-center w-8 h-8 bg-white text-black rounded-full font-bold text-sm tracking-tighter mr-3 group-hover:bg-neutral-200 transition-colors">
            W
          </div>
          <span className="font-semibold text-white tracking-tight">WCOL</span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors hover:text-white
                  ${isActive ? "text-white" : "text-neutral-400"}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
