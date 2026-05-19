import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
    return NextResponse.json({ error: 'missing_email', message: 'email is required.' }, { status: 400 })
  }
  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'missing_password', message: 'password is required.' }, { status: 400 })
  }

  const supabase = await createClient()

  // 1. Sign in with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (authError || !authData.user) {
    console.log('POST /api/auth/login — auth error:', authError?.message)
    return NextResponse.json(
      { error: 'login_failed', message: 'Invalid email or password.' },
      { status: 401 }
    )
  }

  // 2. Fetch profile row
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', authData.user.id)
    .single()

  if (profileError || !profile) {
    console.log('POST /api/auth/login — profile fetch error:', profileError?.message)
    return NextResponse.json(
      { error: 'profile_not_found', message: 'User profile not found.' },
      { status: 404 }
    )
  }

  const response: Record<string, unknown> = {
    token: authData.session.access_token,
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
