import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg']

// POST /api/users/upload-airline-id
// Accepts a JPEG/PNG image (max 5 MB), uploads it to the airline-ids bucket,
// and saves the storage path to the user's profile row.
export async function POST(request: NextRequest) {
  console.log('POST /api/users/upload-airline-id')

  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 })
  }

  // 2. Parse multipart form
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'invalid_form', message: 'Request must be multipart/form-data.' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'missing_file', message: 'A file field named "file" is required.' }, { status: 400 })
  }

  // 3. Validate file type and size
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'invalid_file_type', message: 'Only JPEG and PNG images are accepted.' },
      { status: 400 }
    )
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'file_too_large', message: 'File must be 5 MB or smaller.' },
      { status: 400 }
    )
  }

  // 4. Build storage path: airline-ids/<user_id>/<filename>
  const ext = file.type === 'image/png' ? 'png' : 'jpg'
  const filename = `${Date.now()}.${ext}`
  const storagePath = `${user.id}/${filename}`

  // 5. Upload to Supabase Storage
  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('airline-ids')
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    console.log('POST /api/users/upload-airline-id — storage error:', uploadError.message)
    return NextResponse.json(
      { error: 'upload_failed', message: uploadError.message },
      { status: 500 }
    )
  }

  // 6. Save storage path in public.users
  const { error: updateError } = await supabase
    .from('users')
    .update({ airline_id_image_url: storagePath })
    .eq('id', user.id)

  if (updateError) {
    console.log('POST /api/users/upload-airline-id — profile update error:', updateError.message)
    return NextResponse.json(
      { error: 'profile_update_failed', message: updateError.message },
      { status: 500 }
    )
  }

  console.log('POST /api/users/upload-airline-id — Done')
  return NextResponse.json(
    {
      status: 'uploaded',
      storage_path: storagePath,
      message: 'Airline ID uploaded successfully. An admin will review and verify your account.',
    },
    { status: 200 }
  )
}
