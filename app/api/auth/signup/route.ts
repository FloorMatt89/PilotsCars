import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Validation regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[\d\s\-\+\(\)]{10,}$/ // At least 10 digits/chars
const NAME_REGEX = /^[a-zA-Z\s\-']{2,}$/ // Letters, spaces, hyphens, apostrophes
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ // Min 8 chars, upper, lower, digit, special

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
    return NextResponse.json({ error: 'missing_email', message: 'Email is required.' }, { status: 400 })
  }

  const emailTrimmed = email.trim().toLowerCase()
  if (!EMAIL_REGEX.test(emailTrimmed)) {
    return NextResponse.json({ error: 'invalid_email', message: 'Please enter a valid email address.' }, { status: 400 })
  }

  if (!password || typeof password !== 'string') {
    return NextResponse.json({ error: 'missing_password', message: 'Password is required.' }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'weak_password', message: 'Password must be at least 8 characters.' }, { status: 400 })
  }

  if (!full_name || typeof full_name !== 'string') {
    return NextResponse.json({ error: 'missing_full_name', message: 'Full name is required.' }, { status: 400 })
  }

  const nameTrimmed = (full_name as string).trim()
  if (!NAME_REGEX.test(nameTrimmed)) {
    return NextResponse.json({ error: 'invalid_full_name', message: 'Full name must contain at least 2 characters (letters only).' }, { status: 400 })
  }

  if (phone !== undefined && phone !== null && phone !== '') {
    if (typeof phone !== 'string') {
      return NextResponse.json({ error: 'invalid_phone', message: 'Phone must be a valid string.' }, { status: 400 })
    }
    const phoneTrimmed = (phone as string).trim()
    if (phoneTrimmed && !PHONE_REGEX.test(phoneTrimmed)) {
      return NextResponse.json({ error: 'invalid_phone', message: 'Phone number must be at least 10 digits.' }, { status: 400 })
    }
  }

  const supabase = await createClient()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: emailTrimmed,
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
  const phoneTrimmed = phone && typeof phone === 'string' ? phone.trim() : null
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      email: emailTrimmed,
      full_name: nameTrimmed,
      phone: phoneTrimmed,
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
