import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BanterBoard | Friends Football Hub",
  description: "Roasts, trivia, predictions for the crew",
};

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/banter", label: "Banter" },
  { href: "/predictions", label: "Predictions" },
  { href: "/trivia", label: "Trivia" },
  { href: "/events", label: "Events" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="gradient">
      <body className="max-w-6xl mx-auto px-4 pb-20">
        <header className="flex items-center justify-between py-4">
          <Link href="/" className="font-black text-xl tracking-tight">BanterBoard</Link>
          <nav className="flex gap-3 text-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-800 hover:border-slate-700">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        {children}
        <footer className="text-xs text-slate-400 py-8 text-center">Built for the crew · London time</footer>
      </body>
    </html>
  );
}
