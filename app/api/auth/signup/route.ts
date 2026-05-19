import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/auth/signup
// Registers a new user with Supabase Auth and creates their profile row.
export async function POST(request: NextRequest) {
  console.log('POST /api/auth/signup')

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json', message: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const { email, password, full_name, phone } = body as Record<string, unknown>

  // --- Input validation ---
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'missing_email', message: 'email is required.' }, { status: 400 })
  }
  if (!password || typeof password !== 'string' || password.length < 8) {
    return NextResponse.json({ error: 'weak_password', message: 'password must be at least 8 characters.' }, { status: 400 })
  }
  if (!full_name || typeof full_name !== 'string') {
    return NextResponse.json({ error: 'missing_full_name', message: 'full_name is required.' }, { status: 400 })
  }
  if (phone !== undefined && typeof phone !== 'string') {
    return NextResponse.json({ error: 'invalid_phone', message: 'phone must be a string.' }, { status: 400 })
  }

  const supabase = await createClient()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
  })

  if (authError || !authData.user) {
    console.log('POST /api/auth/signup — auth error:', authError?.message)
    return NextResponse.json(
      { error: 'signup_failed', message: authError?.message ?? 'Signup failed.' },
      { status: 400 }
    )
  }

  // 2. Create profile row in public.users
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: email.trim().toLowerCase(),
      full_name: full_name.trim(),
      phone: phone ? (phone as string).trim() : null,
      is_verified: false,
    })
    .select()
    .single()

  if (profileError) {
    console.log('POST /api/auth/signup — profile insert error:', profileError.message)
    // Auth user was created but profile failed — return partial success with error context
    return NextResponse.json(
      { error: 'profile_creation_failed', message: profileError.message },
      { status: 500 }
    )
  }

  console.log('POST /api/auth/signup — Done')
  return NextResponse.json(
    {
      token: authData.session?.access_token ?? null,
      user: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        phone: profile.phone,
        is_verified: profile.is_verified,
        created_at: profile.created_at,
      },
    },
    { status: 201 }
  )
}
