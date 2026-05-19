import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/bookings
// Creates a new booking for the authenticated, verified user.
// GET /api/bookings
// Returns all bookings for the authenticated user with vehicle + location details.
export async function POST(request: NextRequest) {
  console.log('POST /api/bookings')

  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 })
  }

  // 2. Check that user is verified before even parsing input
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('is_verified')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'profile_not_found', message: 'User profile not found.' }, { status: 404 })
  }
  if (!profile.is_verified) {
    return NextResponse.json(
      { error: 'not_verified', message: 'Please upload your airline ID and wait for approval before booking.' },
      { status: 403 }
    )
  }

  // 3. Parse and validate body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json', message: 'Request body must be valid JSON.' }, { status: 400 })
  }

  const { vehicle_id, location_id, pickup_date, return_date, pickup_time, return_time } =
    body as Record<string, unknown>

  if (!vehicle_id || typeof vehicle_id !== 'string') {
    return NextResponse.json({ error: 'missing_vehicle_id', message: 'vehicle_id is required.' }, { status: 400 })
  }
  if (!location_id || typeof location_id !== 'string') {
    return NextResponse.json({ error: 'missing_location_id', message: 'location_id is required.' }, { status: 400 })
  }
  if (!pickup_date || typeof pickup_date !== 'string') {
    return NextResponse.json({ error: 'missing_pickup_date', message: 'pickup_date is required (YYYY-MM-DD).' }, { status: 400 })
  }
  if (!return_date || typeof return_date !== 'string') {
    return NextResponse.json({ error: 'missing_return_date', message: 'return_date is required (YYYY-MM-DD).' }, { status: 400 })
  }

  const pickupMs = new Date(pickup_date).getTime()
  const returnMs = new Date(return_date).getTime()
  if (isNaN(pickupMs) || isNaN(returnMs)) {
    return NextResponse.json({ error: 'invalid_dates', message: 'Dates must be in YYYY-MM-DD format.' }, { status: 400 })
  }
  if (returnMs < pickupMs) {
    return NextResponse.json({ error: 'date_order', message: 'return_date must be on or after pickup_date.' }, { status: 400 })
  }

  // 4. Fetch vehicle to get daily_rate and confirm it's available
  const { data: vehicle, error: vehicleError } = await supabase
    .from('vehicles')
    .select('id, daily_rate, is_available')
    .eq('id', vehicle_id)
    .single()

  if (vehicleError || !vehicle) {
    return NextResponse.json({ error: 'vehicle_not_found', message: 'Vehicle not found.' }, { status: 404 })
  }
  if (!vehicle.is_available) {
    return NextResponse.json({ error: 'vehicle_unavailable', message: 'This vehicle is not available.' }, { status: 409 })
  }

  // 5. Calculate total price
  // num_days = return_date - pickup_date (minimum 1 day)
  const msPerDay = 1000 * 60 * 60 * 24
  const numDays = Math.max(1, Math.round((returnMs - pickupMs) / msPerDay))
  const totalPrice = parseFloat((parseFloat(String(vehicle.daily_rate)) * numDays).toFixed(2))

  // 6. Insert booking — RLS policy enforces is_verified = true
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({
      user_id: user.id,
      vehicle_id,
      location_id,
      pickup_date,
      return_date,
      pickup_time: pickup_time ?? null,
      return_time: return_time ?? null,
      total_price: totalPrice,
      status: 'pending',
    })
    .select()
    .single()

  if (insertError) {
    console.log('POST /api/bookings — insert error:', insertError.message)
    return NextResponse.json({ error: 'booking_failed', message: insertError.message }, { status: 500 })
  }

  console.log('POST /api/bookings — Done')
  return NextResponse.json(
    {
      booking: {
        id: booking.id,
        vehicle_id: booking.vehicle_id,
        location_id: booking.location_id,
        pickup_date: booking.pickup_date,
        return_date: booking.return_date,
        pickup_time: booking.pickup_time,
        return_time: booking.return_time,
        status: booking.status,
        total_price: booking.total_price,
        num_days: numDays,
        created_at: booking.created_at,
      },
    },
    { status: 201 }
  )
}

export async function GET() {
  console.log('GET /api/bookings')

  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 })
  }

  // 2. Fetch bookings with joined vehicle and location data
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      id,
      pickup_date,
      return_date,
      pickup_time,
      return_time,
      status,
      total_price,
      notes,
      created_at,
      updated_at,
      vehicles (
        id, make, model, year, color, vehicle_type, daily_rate
      ),
      locations (
        id, name, city, address, phone
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.log('GET /api/bookings — db error:', error.message)
    return NextResponse.json({ error: 'fetch_failed', message: error.message }, { status: 500 })
  }

  console.log('GET /api/bookings — Done')
  return NextResponse.json({ bookings }, { status: 200 })
}
