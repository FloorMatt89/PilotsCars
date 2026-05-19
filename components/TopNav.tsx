"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/referrals", label: "Referrals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function TopNav() {
  const pathname = usePathname();

  return (
    <header className="topnav">
      <div className="topnav-inner">
        <Link className="topnav-logo" href="/" aria-label="PilotCars home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-pilot.png" alt="PilotCars" />
        </Link>
        <nav className="topnav-tabs" aria-label="Primary">
          {TABS.map((t) => {
            const isActive = pathname === t.href || (t.href !== "/" && pathname.startsWith(t.href));
            return (
              <Link
                key={t.href}
                className={`topnav-tab${isActive ? " is-active" : ""}`}
                href={t.href}
              >
                {t.label}
              </Link>
            );
          })}
        </nav>
        <div className="topnav-utils">
          <Link
            className="topnav-signin"
            href="/dashboard"
            aria-label="Dashboard"
          >
            Dashboard
          </Link>
          <Link
            className="topnav-signin"
            href="/login"
          >
            Sign in
          </Link>
          <Link
            className="btn-primary"
            href="/signup"
            style={{ height: 40, padding: "0 18px", fontSize: 14 }}
          >
            Join crew
          </Link>
        </div>
      </div>
    </header>
  );
}
