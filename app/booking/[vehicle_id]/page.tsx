'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  color: string
  daily_rate: number
  vehicle_type: string
  features: string[] | null
  images: string[]
  location_id: string
}

interface Location {
  id: string
  name: string
  city: string
}

function calcDays(pickup: string, ret: string): number {
  if (!pickup || !ret) return 0
  const ms = new Date(ret).getTime() - new Date(pickup).getTime()
  if (ms <= 0) return 0
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)))
}

export default function BookingPage({ params }: { params: Promise<{ vehicle_id: string }> }) {
  const { vehicle_id } = use(params)
  const router = useRouter()

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [loadingVehicle, setLoadingVehicle] = useState(true)
  const [vehicleError, setVehicleError] = useState('')

  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [pickupTime, setPickupTime] = useState('10:00')
  const [returnTime, setReturnTime] = useState('10:00')
  const [locationId, setLocationId] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [imgError, setImgError] = useState(false)

  const numDays = calcDays(pickupDate, returnDate)
  const totalPrice = vehicle ? (vehicle.daily_rate * (numDays || 1)).toFixed(2) : '0.00'

  // Fetch vehicle data
  useEffect(() => {
    setLoadingVehicle(true)
    // Fetch all vehicles to find the one by id (no single-vehicle endpoint)
    fetch('/api/vehicles')
      .then((r) => {
        if (r.status === 401) {
          setVehicleError('Please sign in to make a booking.')
          return null
        }
        return r.json()
      })
      .then((data) => {
        if (!data) return
        const found = (data.vehicles ?? []).find((v: Vehicle) => v.id === vehicle_id)
        if (found) {
          setVehicle(found)
          setLocationId(found.location_id)
        } else {
          setVehicleError('Vehicle not found.')
        }
      })
      .catch(() => setVehicleError('Could not load vehicle details.'))
      .finally(() => setLoadingVehicle(false))

    // Also fetch locations for display
    fetch('/api/locations')
      .then((r) => r.json())
      .then((data) => setLocations(data.locations ?? []))
      .catch(() => {})
  }, [vehicle_id])

  function locationName(id: string) {
    const loc = locations.find((l) => l.id === id)
    return loc ? `${loc.city} — ${loc.name}` : id
  }

  async function handleBook() {
    setError('')
    if (!pickupDate || !returnDate) {
      setError('Please select pickup and return dates.')
      return
    }
    if (new Date(returnDate) < new Date(pickupDate)) {
      setError('Return date must be on or after the pickup date.')
      return
    }
    if (!locationId) {
      setError('No location found for this vehicle.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id,
          location_id: locationId,
          pickup_date: pickupDate,
          return_date: returnDate,
          pickup_time: pickupTime,
          return_time: returnTime,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 403 && data.error === 'not_verified') {
          setError('Your airline ID is still pending approval. You can book once an admin verifies your account.')
        } else if (res.status === 401) {
          setError('Please sign in to make a booking.')
        } else {
          setError(data.message ?? 'Booking failed. Please try again.')
        }
        return
      }

      // Success — redirect to dashboard
      router.push('/dashboard?booked=1')

    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Today's date string for min date
  const today = new Date().toISOString().split('T')[0]

  return (
    <main style={{ minHeight: 'calc(100vh - 110px)', background: 'var(--color-surface-soft)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 24px' }}>

        {/* Breadcrumb */}
        <p style={{ fontSize: 13, color: 'var(--color-muted)', marginBottom: 32 }}>
          <Link href="/">Home</Link> &nbsp;/&nbsp;
          <Link href="/vehicles">Vehicles</Link> &nbsp;/&nbsp;
          <span>Booking</span>
        </p>

        {/* Loading */}
        {loadingVehicle && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--color-muted)' }}>
            Loading vehicle details…
          </div>
        )}

        {/* Vehicle error */}
        {vehicleError && (
          <div style={{ padding: '16px 20px', background: 'rgba(193,53,21,0.08)', border: '1px solid rgba(193,53,21,0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', fontSize: 14, marginBottom: 24 }}>
            {vehicleError}
            {vehicleError.includes('sign in') && (
              <> <Link href="/login" style={{ color: 'var(--color-error)', fontWeight: 600, textDecoration: 'underline' }}>Sign in</Link>.</>
            )}
          </div>
        )}

        {!loadingVehicle && vehicle && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'start' }}>

            {/* Left — vehicle summary */}
            <div>
              {/* Vehicle photo */}
              <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', aspectRatio: '4/3', background: 'var(--color-surface-strong)', marginBottom: 24 }}>
                {vehicle.images?.[0] && !imgError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: 'var(--color-muted)' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                      <path d="M4 17 6 7h12l2 10H4z" />
                      <circle cx="8" cy="17" r="2" />
                      <circle cx="16" cy="17" r="2" />
                    </svg>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.5 }}>No photo available</span>
                  </div>
                )}
              </div>

              {/* Vehicle details */}
              <div className="contactform">
                <div style={{ marginBottom: 4 }}>
                  <span className="eyebrow eyebrow--ink" style={{ textTransform: 'capitalize' }}>{vehicle.vehicle_type}</span>
                </div>
                <h2 style={{ fontSize: 24, fontWeight: 500, letterSpacing: '-0.02em', margin: '8px 0' }}>
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h2>
                <p style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 16 }}>
                  {vehicle.color} · {locationName(vehicle.location_id)}
                </p>

                {vehicle.features && vehicle.features.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {vehicle.features.map((f) => (
                      <span key={f} style={{ fontFamily: 'var(--font-body)', fontSize: 13, padding: '5px 12px', background: 'var(--color-surface-strong)', borderRadius: 'var(--radius-full)', color: 'var(--color-body)' }}>
                        {f}
                      </span>
                    ))}
                  </div>
                )}

                {/* Pricing breakdown */}
                <div style={{ borderTop: '1px solid var(--color-hairline)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                    <span style={{ color: 'var(--color-muted)' }}>Daily rate</span>
                    <span style={{ fontWeight: 600 }}>${vehicle.daily_rate} / day</span>
                  </div>
                  {numDays > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
                      <span style={{ color: 'var(--color-muted)' }}>Duration</span>
                      <span style={{ fontWeight: 600 }}>{numDays} {numDays === 1 ? 'day' : 'days'}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--color-hairline)', fontSize: 18, fontWeight: 600 }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--color-ink)' }}>${numDays > 0 ? totalPrice : `${vehicle.daily_rate.toFixed(2)} (1 day min)`}</span>
                  </div>
                  <p style={{ marginTop: 8, fontSize: 12, color: 'var(--color-muted)' }}>
                    All-inclusive — insurance, unlimited miles, and tolls included. No deposit.
                  </p>
                </div>
              </div>
            </div>

            {/* Right — booking form */}
            <div>
              <div className="contactform">
                <div style={{ marginBottom: 20 }}>
                  <span className="eyebrow eyebrow--ink" style={{ display: 'block', marginBottom: 8 }}>Booking details</span>
                  <h3 style={{ fontSize: 22, fontWeight: 500, letterSpacing: '-0.015em', margin: 0 }}>
                    Confirm your reservation
                  </h3>
                </div>

                <div className="formgrid">

                  {/* Pickup date */}
                  <div className="formfield">
                    <label htmlFor="pickup_date">Pickup date</label>
                    <input
                      id="pickup_date"
                      type="date"
                      required
                      min={today}
                      value={pickupDate}
                      onChange={(e) => {
                        setPickupDate(e.target.value)
                        if (returnDate && e.target.value > returnDate) setReturnDate('')
                      }}
                    />
                  </div>

                  {/* Pickup time */}
                  <div className="formfield">
                    <label htmlFor="pickup_time">Pickup time</label>
                    <input
                      id="pickup_time"
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                    />
                  </div>

                  {/* Return date */}
                  <div className="formfield">
                    <label htmlFor="return_date">Return date</label>
                    <input
                      id="return_date"
                      type="date"
                      required
                      min={pickupDate || today}
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                    />
                  </div>

                  {/* Return time */}
                  <div className="formfield">
                    <label htmlFor="return_time">Return time</label>
                    <input
                      id="return_time"
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                    />
                  </div>

                  {/* Dynamic total */}
                  {numDays > 0 && (
                    <div style={{ padding: '14px 16px', background: 'var(--color-surface-soft)', border: '1px solid var(--color-hairline)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 14, color: 'var(--color-muted)' }}>{numDays} {numDays === 1 ? 'day' : 'days'} × ${vehicle.daily_rate}</span>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--color-ink)' }}>${totalPrice}</span>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div style={{ padding: '12px 16px', background: 'rgba(193,53,21,0.08)', border: '1px solid rgba(193,53,21,0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', fontSize: 14 }}>
                      {error}
                      {error.includes('sign in') && (
                        <> <Link href="/login" style={{ color: 'var(--color-error)', fontWeight: 600, textDecoration: 'underline' }}>Sign in here</Link>.</>
                      )}
                      {error.includes('airline ID') && (
                        <> <Link href="/dashboard" style={{ color: 'var(--color-error)', fontWeight: 600, textDecoration: 'underline' }}>Check dashboard</Link>.</>
                      )}
                    </div>
                  )}

                  {/* Confirm button */}
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleBook}
                    disabled={loading}
                    style={{ width: '100%', opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? 'Confirming booking…' : 'Confirm booking'}
                  </button>

                  <p style={{ fontSize: 12, color: 'var(--color-muted)', textAlign: 'center' }}>
                    No deposit required. Cancel within 24 hours for a full refund.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Responsive fallback for mobile */}
        <style>{`
          @media (max-width: 720px) {
            .booking-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

      </div>
    </main>
  )
}
