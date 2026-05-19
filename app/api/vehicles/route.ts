import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const SIGNED_URL_EXPIRES_IN = 3600 // 1 hour

// GET /api/vehicles?location_id=XXX&vehicle_type=sedan
// Returns available vehicles with signed image URLs from Supabase Storage.
export async function GET(request: NextRequest) {
  console.log('GET /api/vehicles')

  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 })
  }

  // 2. Parse optional query filters
  const { searchParams } = request.nextUrl
  const location_id = searchParams.get('location_id')
  const vehicle_type = searchParams.get('vehicle_type')

  // 3. Build query — only available vehicles
  let query = supabase
    .from('vehicles')
    .select('id, make, model, year, color, daily_rate, vehicle_type, features, mileage, image_storage_path, location_id')
    .eq('is_available', true)

  if (location_id) {
    query = query.eq('location_id', location_id)
  }
  if (vehicle_type) {
    query = query.eq('vehicle_type', vehicle_type)
  }

  const { data: vehicles, error } = await query.order('daily_rate', { ascending: true })

  if (error) {
    console.log('GET /api/vehicles — db error:', error.message)
    return NextResponse.json({ error: 'fetch_failed', message: error.message }, { status: 500 })
  }

  // 4. Generate signed URLs for vehicle images
  const vehiclesWithImages = await Promise.all(
    (vehicles ?? []).map(async (vehicle) => {
      let images: string[] = []

      if (vehicle.image_storage_path) {
        const { data: signedUrlData, error: urlError } = await supabase.storage
          .from('vehicles-images')
          .createSignedUrl(vehicle.image_storage_path, SIGNED_URL_EXPIRES_IN)

        if (!urlError && signedUrlData?.signedUrl) {
          images = [signedUrlData.signedUrl]
        }
      }

      return {
        id: vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: vehicle.color,
        daily_rate: vehicle.daily_rate,
        vehicle_type: vehicle.vehicle_type,
        features: vehicle.features,
        mileage: vehicle.mileage,
        location_id: vehicle.location_id,
        images,
      }
    })
  )

  console.log('GET /api/vehicles — Done')
  return NextResponse.json({ vehicles: vehiclesWithImages }, { status: 200 })
}
