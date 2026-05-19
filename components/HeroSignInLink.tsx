'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// Renders the hero "Sign in" link only for logged-out visitors.
// Mirrors the auth check used in TopNav.
export default function HeroSignInLink() {
  const [status, setStatus] = useState<'loading' | 'in' | 'out'>('loading')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setStatus(user ? 'in' : 'out')
    })
  }, [])

  // Don't flash the link before we know, and hide it entirely once logged in.
  if (status !== 'out') return null

  return (
    <Link
      href="/login"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 48,
        padding: '0 20px',
        fontFamily: 'var(--font-display)',
        fontSize: 15,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.85)',
        textDecoration: 'none',
      }}
    >
      Sign in
    </Link>
  )
}
