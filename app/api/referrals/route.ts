import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/referrals
// Returns the authenticated user's referral code, total commission earned,
// and a list of individual referral records with booking details.
export async function GET() {
  console.log('GET /api/referrals')

  const supabase = await createClient()

  // 1. Verify session
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'unauthorized', message: 'You must be logged in.' }, { status: 401 })
  }

  // 2. Fetch referrals where this user is the referrer, joined with booking info
  const { data: referrals, error } = await supabase
    .from('referrals')
    .select(`
      id,
      status,
      commission_earned,
      paid_at,
      created_at,
      referred_user_id,
      booking_id,
      bookings!referrals_booking_id_fkey (
        id,
        pickup_date,
        return_date,
        total_price,
        status
      )
    `)
    .eq('referrer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.log('GET /api/referrals — db error:', error.message)
    return NextResponse.json({ error: 'fetch_failed', message: error.message }, { status: 500 })
  }

  // 3. Aggregate total commission earned
  const totalCommissionEarned = (referrals ?? []).reduce(
    (sum, r) => sum + parseFloat(String(r.commission_earned ?? 0)),
    0
  )

  // 4. Generate a referral code for this user (referral_code column not yet in DB)
  //    For now, use a simple code based on user ID
  const generateReferralCode = (userId: string) => {
    return `PILOT-${userId.substring(0, 6).toUpperCase()}`
  }
  const referralCode = generateReferralCode(user.id)

  console.log('GET /api/referrals — Done')
  return NextResponse.json(
    {
      referral_code: referralCode,
      total_commission_earned: parseFloat(totalCommissionEarned.toFixed(2)),
      referrals: referrals ?? [],
    },
    { status: 200 }
  )
}
