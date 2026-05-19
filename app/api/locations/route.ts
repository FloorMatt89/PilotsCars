import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/locations
// Returns all rental locations. Requires authentication.
export async function GET() {
  console.log('GET /api/locations')

  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 })
  }

  // 2. Fetch all locations
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .order('city', { ascending: true })

  if (error) {
    console.log('GET /api/locations — db error:', error.message)
    return NextResponse.json({ error: 'fetch_failed', message: error.message }, { status: 500 })
  }

  console.log('GET /api/locations — Done')
  return NextResponse.json({ locations }, { status: 200 })
}
