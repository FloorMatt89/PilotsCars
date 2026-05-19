import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/users/profile
// Returns the authenticated user's profile data
export async function GET() {
  console.log('GET /api/users/profile')

  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 })
  }

  // 2. Fetch user profile
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, email, full_name, phone, is_verified')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    console.log('GET /api/users/profile — profile fetch error:', profileError?.message)
    return NextResponse.json(
      { error: 'profile_not_found', message: 'User profile not found.' },
      { status: 404 }
    )
  }

  console.log('GET /api/users/profile — Done')
  return NextResponse.json(profile, { status: 200 })
}
