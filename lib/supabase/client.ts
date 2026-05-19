'use client'

import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase browser client.
 * Use this only in Client Components ("use client").
 * Never use this for sensitive operations — use the server client instead.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
