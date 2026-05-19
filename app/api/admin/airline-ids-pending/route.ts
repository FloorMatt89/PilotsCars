import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SIGNED_URL_EXPIRES_IN = 3600 // 1 hour

// GET /api/admin/airline-ids-pending
// Admin-only: returns list of unverified users who have uploaded an airline ID,
// each with a short-lived signed URL so the admin can preview the image.
export async function GET() {
  console.log('GET /api/admin/airline-ids-pending')

  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 })
  }

  // 2. Check admin claim
  const { data: { session } } = await supabase.auth.getSession()
  const isAdmin = session?.user?.app_metadata?.role === 'admin'
  if (!isAdmin) {
    return NextResponse.json({ error: 'forbidden', message: 'Admin access required.' }, { status: 403 })
  }

  // 3. Fetch all unverified users that have an airline_id_image_url set
  const { data: pendingUsers, error } = await supabase
    .from('users')
    .select('id, email, full_name, phone, airline_id_image_url, created_at')
    .eq('is_verified', false)
    .not('airline_id_image_url', 'is', null)
    .order('created_at', { ascending: true })

  if (error) {
    console.log('GET /api/admin/airline-ids-pending — db error:', error.message)
    return NextResponse.json({ error: 'fetch_failed', message: error.message }, { status: 500 })
  }

  // 4. Generate a signed URL for each user's airline ID image
  const usersWithSignedUrls = await Promise.all(
    (pendingUsers ?? []).map(async (u) => {
      let airline_id_signed_url: string | null = null

      if (u.airline_id_image_url) {
        const { data: signedData, error: signedError } = await supabase.storage
          .from('airline-ids')
          .createSignedUrl(u.airline_id_image_url, SIGNED_URL_EXPIRES_IN)

        if (!signedError && signedData?.signedUrl) {
          airline_id_signed_url = signedData.signedUrl
        }
      }

      return {
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        phone: u.phone,
        airline_id_signed_url,
        submitted_at: u.created_at,
      }
    })
  )

  console.log('GET /api/admin/airline-ids-pending — Done')
  return NextResponse.json({ pending_users: usersWithSignedUrls }, { status: 200 })
}
