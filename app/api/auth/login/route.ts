import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'

// Validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/auth/login
// Authenticates an existing user and returns their profile + verification status.
export async function POST(request: NextRequest) {
  console.log('POST /api/auth/login')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json', message: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const { email, password } = body as Record<string, unknown>

  // --- Input validation ---
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'missing_email', message: 'Email is required.' }, { status: 400 })
  }

  const emailTrimmed = email.trim().toLowerCase()
  if (!EMAIL_REGEX.test(emailTrimmed)) {
    return NextResponse.json({ error: 'invalid_email', message: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'missing_password', message: 'Password is required.' }, { status: 400 })
  }

  const supabase = await createClient()

  // 1. Sign in with auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: emailTrimmed,
    password,
  })

  if (authError || !authData.user) {
    console.log('POST /api/auth/login — auth error:', authError?.message)
    return NextResponse.json(
      { error: 'login_failed', message: 'Username or password is incorrect.' },
      { status: 401 }
    )
  }

  // 2. Set the session (this persists it to cookies for SSR client)
  if (authData.session) {
    const { error: sessionError } = await supabase.auth.setSession(authData.session)
    if (sessionError) {
      console.log('POST /api/auth/login — setSession error:', sessionError.message)
      return NextResponse.json(
        { error: 'session_failed', message: 'Failed to save session.' },
        { status: 500 }
      )
    }
  }

  // 3. Fetch profile row using admin client (bypasses RLS)
  const adminClient = createAdminClient()
  const { data: profile, error: profileError } = await adminClient
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    console.log('POST /api/auth/login — profile fetch error:', profileError?.message)
    return NextResponse.json(
      { error: 'login_failed', message: 'Username or password is incorrect.' },
      { status: 401 }
    )
  }

  const response: Record<string, unknown> = {
    user: {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone: profile.phone,
      is_verified: profile.is_verified,
      verified_at: profile.verified_at,
      airline_id_image_url: profile.airline_id_image_url,
      created_at: profile.created_at,
    },
    is_verified: profile.is_verified,
  }

  // If the user hasn't been verified yet, include a helpful nudge message
  if (!profile.is_verified) {
    response.message = 'Please upload airline ID to book'
  }

  console.log('POST /api/auth/login — Done')
  return NextResponse.json(response, { status: 200 })
}
