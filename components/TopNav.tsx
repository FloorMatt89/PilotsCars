"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/vehicles", label: "Vehicles" },
  { href: "/referrals", label: "Referrals" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function TopNav() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', user.id)
          .single();
        setUserName(profile?.full_name || user.email || '');
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    window.location.href = '/';
  }

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
        <div className="topnav-utils" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {!isLoading && (
            <>
              {isLoggedIn ? (
                <>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      Logged in as
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-ink)' }}>
                      {userName.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link
                      className="topnav-signin"
                      href="/dashboard"
                      aria-label="Dashboard"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'rgba(255,255,255,0.65)',
                        fontFamily: 'var(--font-display)',
                        fontSize: 14,
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: '0 12px',
                        transition: 'color 150ms ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
