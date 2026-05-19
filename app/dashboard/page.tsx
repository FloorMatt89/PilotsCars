'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone: string | null
  is_verified: boolean
  verified_at: string | null
  created_at: string
}

interface BookingVehicle {
  id: string
  make: string
  model: string
  year: number
  color: string
  vehicle_type: string
}

interface BookingLocation {
  id: string
  name: string
  city: string
}

interface Booking {
  id: string
  pickup_date: string
  return_date: string
  pickup_time: string | null
  return_time: string | null
  status: string
  total_price: number
  created_at: string
  vehicles: BookingVehicle | null
  locations: BookingLocation | null
}

interface ReferralData {
  referral_code: string | null
  total_commission_earned: number
  referrals: unknown[]
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    pending: { bg: 'rgba(184,146,58,0.12)', color: 'var(--color-brass-strong)', label: 'Pending' },
    confirmed: { bg: 'rgba(79,153,79,0.12)', color: '#2e7d2e', label: 'Confirmed' },
    active: { bg: 'rgba(79,153,79,0.12)', color: '#2e7d2e', label: 'Active' },
    completed: { bg: 'rgba(106,106,106,0.12)', color: 'var(--color-muted)', label: 'Completed' },
    cancelled: { bg: 'rgba(193,53,21,0.10)', color: 'var(--color-error)', label: 'Cancelled' },
  }
  const s = map[status] ?? { bg: 'rgba(106,106,106,0.12)', color: 'var(--color-muted)', label: status }
  return (
    <span style={{ padding: '4px 10px', background: s.bg, color: s.color, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 'var(--radius-full)' }}>
      {s.label}
    </span>
  )
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Inner component uses useSearchParams — must be wrapped in Suspense
function DashboardContent() {
  const searchParams = useSearchParams()
  const justBooked = searchParams.get('booked') === '1'

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)

      try {
        // Fetch user profile, bookings, and referrals in parallel
        const [profileRes, bookingsRes, referralsRes] = await Promise.all([
          fetch('/api/users/profile'),
          fetch('/api/bookings'),
          fetch('/api/referrals'),
        ])

        console.log('Dashboard API responses:', { profile: profileRes.status, bookings: bookingsRes.status, referrals: referralsRes.status })

        // Check if user is authenticated
        if (profileRes.status === 401 || bookingsRes.status === 401) {
          console.log('Dashboard: User not authenticated')
          setAuthError(true)
          setLoading(false)
          return
        }

        // Fetch profile data
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          console.log('Dashboard: Profile loaded', profileData)
          setProfile(profileData)
        } else {
          console.log('Dashboard: Profile fetch failed', profileRes.status)
        }

        // Fetch bookings data
        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json()
          console.log('Dashboard: Bookings loaded', bookingsData)
          setBookings(bookingsData.bookings ?? [])
        } else {
          console.log('Dashboard: Bookings fetch failed', bookingsRes.status)
        }

        // Fetch referrals data
        if (referralsRes.ok) {
          const referralsData = await referralsRes.json()
          console.log('Dashboard: Referrals loaded', referralsData)
          setReferralData(referralsData)
        } else {
          console.log('Dashboard: Referrals fetch failed', referralsRes.status)
        }

        setLoading(false)
      } catch (error) {
        console.error('Dashboard: Error loading data', error)
        setLoading(false)
      }
    }

    load()
  }, [])

  function copyCode() {
    if (!referralData?.referral_code) return
    navigator.clipboard.writeText(referralData.referral_code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <main style={{ minHeight: 'calc(100vh - 110px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-soft)' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>
          <div style={{ marginBottom: 12 }}>Loading your dashboard…</div>
        </div>
      </main>
    )
  }

  if (authError) {
    return (
      <main style={{ minHeight: 'calc(100vh - 110px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-soft)', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <h2 style={{ fontSize: 24, fontWeight: 500, margin: '0 0 12px' }}>Sign in to view your dashboard</h2>
          <p style={{ color: 'var(--color-muted)', marginBottom: 24 }}>You need a crew account to access your bookings and referral earnings.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/login" className="btn-primary">Sign in</Link>
            <Link href="/signup" className="btn-secondary">Create account</Link>
          </div>
        </div>
      </main>
    )
  }

  const upcomingBookings = bookings.filter((b) => new Date(b.pickup_date) >= new Date() && b.status !== 'cancelled')
  const pastBookings = bookings.filter((b) => new Date(b.pickup_date) < new Date() || b.status === 'completed')

  return (
    <main style={{ background: 'var(--color-surface-soft)', minHeight: 'calc(100vh - 110px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        {/* Booking success banner */}
        {justBooked && (
          <div style={{ padding: '16px 20px', background: 'rgba(79,153,79,0.10)', border: '1px solid rgba(79,153,79,0.30)', borderRadius: 'var(--radius-sm)', marginBottom: 28, fontSize: 14, color: '#2e7d2e', fontWeight: 500 }}>
            Booking confirmed! We will send confirmation details to your email.
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <span className="eyebrow eyebrow--ink" style={{ display: 'block', marginBottom: 8 }}>Crew dashboard</span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500, letterSpacing: '-0.025em', margin: 0 }}>
            {profile?.full_name ? `Welcome back, ${profile.full_name.split(' ')[0]}.` : 'Your crew dashboard.'}
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>

          {/* Profile card */}
          <div className="contactform" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span className="eyebrow eyebrow--ink">Account</span>
            {profile ? (
              <>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 4 }}>{profile.full_name}</div>
                  <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>{profile.email}</div>
                  {profile.phone && <div style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 2 }}>{profile.phone}</div>}
                </div>
                <div>
                  {profile.is_verified ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(79,153,79,0.10)', border: '1px solid rgba(79,153,79,0.30)', borderRadius: 'var(--radius-full)', fontSize: 13, fontWeight: 600, color: '#2e7d2e' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4f994f', display: 'inline-block' }} />
                      Verified crew member — you can book
                    </span>
                  ) : (
                    <div style={{ padding: '12px 16px', background: 'rgba(184,146,58,0.10)', border: '1px solid rgba(184,146,58,0.30)', borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--color-body)', lineHeight: 1.5 }}>
                      <strong style={{ fontWeight: 600, color: 'var(--color-ink)' }}>Airline ID pending approval</strong>
                      <br />An admin will review your ID shortly. You can book once approved.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--color-muted)', fontSize: 14 }}>
                Profile details will appear here after your first booking.
              </p>
            )}
            <Link href="/vehicles" className="btn-secondary" style={{ alignSelf: 'flex-start', fontSize: 14, height: 40, padding: '0 18px' }}>
              Browse vehicles
            </Link>
          </div>

          {/* Referral card */}
          <div style={{ background: '#1a1a1a', color: 'var(--color-on-dark)', borderRadius: 'var(--radius-md)', padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span className="eyebrow eyebrow--on-dark">Referral program</span>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', color: '#F0CB6B' }}>
                ${referralData?.total_commission_earned?.toFixed(2) ?? '0.00'}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
                Total earned from referrals
              </div>
            </div>

            {referralData?.referral_code ? (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
                  Your referral code
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px dashed rgba(255,255,255,0.25)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 600, letterSpacing: '0.06em', color: '#F0CB6B', wordBreak: 'break-all' }}>
                    {referralData.referral_code}
                  </div>
                  <button
                    type="button"
                    onClick={copyCode}
                    style={{ flexShrink: 0, padding: '10px 16px', background: copied ? 'rgba(79,153,79,0.3)' : 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 'var(--radius-sm)', color: '#fff', fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'background 150ms ease', whiteSpace: 'nowrap' }}
                  >
                    {copied ? 'Copied!' : 'Copy code'}
                  </button>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                Make your first referral to generate your unique code. Earn 8% commission on every booking.
              </p>
            )}

            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', paddingTop: 4, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              Share your code with fellow crew — earn 8% commission on every completed booking.
            </div>
          </div>

        </div>

        {/* Upcoming bookings */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', margin: 0 }}>Upcoming bookings</h2>
            <Link href="/vehicles" style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 500, color: 'var(--color-ink)', textDecoration: 'underline' }}>
              Book a vehicle
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <div style={{ padding: '32px 28px', background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--color-muted)' }}>
              No upcoming bookings.{' '}
              <Link href="/vehicles" style={{ color: 'var(--color-ink)', fontWeight: 500, textDecoration: 'underline' }}>Browse available vehicles</Link>.
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {upcomingBookings.map((b) => (
                <BookingRow key={b.id} booking={b} />
              ))}
            </div>
          )}
        </div>

        {/* Past bookings */}
        {pastBookings.length > 0 && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', margin: '0 0 16px' }}>Booking history</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {pastBookings.map((b) => (
                <BookingRow key={b.id} booking={b} past />
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}

// Wrap DashboardContent in Suspense so useSearchParams works in static builds
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <main style={{ minHeight: 'calc(100vh - 110px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-surface-soft)' }}>
        <div style={{ textAlign: 'center', color: 'var(--color-muted)' }}>Loading your dashboard…</div>
      </main>
    }>
      <DashboardContent />
    </Suspense>
  )
}

function BookingRow({ booking: b, past }: { booking: Booking; past?: boolean }) {
  return (
    <div style={{ background: 'var(--color-canvas)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-md)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', opacity: past ? 0.8 : 1 }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 4 }}>
          {b.vehicles ? `${b.vehicles.year} ${b.vehicles.make} ${b.vehicles.model}` : 'Vehicle details unavailable'}
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
          {b.locations ? `${b.locations.city} — ${b.locations.name}` : ''}
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--color-body)' }}>
        <div>{formatDate(b.pickup_date)} → {formatDate(b.return_date)}</div>
        {b.pickup_time && <div style={{ color: 'var(--color-muted)', marginTop: 2 }}>{b.pickup_time} — {b.return_time}</div>}
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--color-ink)', marginBottom: 6 }}>
          ${typeof b.total_price === 'number' ? b.total_price.toFixed(2) : b.total_price}
        </div>
        <StatusBadge status={b.status} />
      </div>
    </div>
  )
}
