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
        <Link className="topnav-logo" href="/" aria-label="Pilot Cars home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-pilot.png" alt="Pilot Cars" />
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
          <a className="topnav-locale" href="#" aria-label="Language">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
            </svg>{" "}
            EN
          </a>
          <a className="topnav-signin" href="#">Crew sign in</a>
          <a className="btn-primary" href="#" style={{ height: 40, padding: "0 18px", fontSize: 14 }}>
            List your car
          </a>
        </div>
      </div>
    </header>
  );
}
