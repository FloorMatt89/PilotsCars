import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/admin/verify-airline-id
// Admin-only: approve or reject a user's airline ID verification.
// RLS enforces admin-only access via is_admin() check on the users update policy.
export async function POST(request: NextRequest) {
  console.log('POST /api/admin/verify-airline-id')

  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 })
  }

  // 2. Check admin claim in JWT app_metadata
  const { data: { session } } = await supabase.auth.getSession()
  const isAdmin = session?.user?.app_metadata?.role === 'admin'
  if (!isAdmin) {
    return NextResponse.json({ error: 'forbidden', message: 'Admin access required.' }, { status: 403 })
  }

  // 3. Parse and validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json', message: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const { user_id, approved } = body as Record<string, unknown>

  if (!user_id || typeof user_id !== 'string') {
    return NextResponse.json({ error: 'missing_user_id', message: 'user_id is required.' }, { status: 400 })
  }
  if (typeof approved !== 'boolean') {
    return NextResponse.json({ error: 'missing_approved', message: 'approved (boolean) is required.' }, { status: 400 })
  }

  // 4. Update user profile
  const updatePayload = approved
    ? { is_verified: true, verified_at: new Date().toISOString() }
    : { is_verified: false, verified_at: null }

  const { data: updatedProfile, error: updateError } = await supabase
    .from('users')
    .update(updatePayload)
    .eq('id', user_id)
    .select('id, email, full_name, is_verified, verified_at, airline_id_image_url')
    .single()

  if (updateError) {
    console.log('POST /api/admin/verify-airline-id — update error:', updateError.message)
    return NextResponse.json({ error: 'update_failed', message: updateError.message }, { status: 500 })
  }
  if (!updatedProfile) {
    return NextResponse.json({ error: 'user_not_found', message: 'User not found.' }, { status: 404 })
  }

  console.log('POST /api/admin/verify-airline-id — Done')
  return NextResponse.json({ user: updatedProfile }, { status: 200 })
}
