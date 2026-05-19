'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AnimationProvider from '@/components/AnimationProvider'
import { IconArrowRight } from '@/components/Icons'

// Types matching the API response shapes
interface Location {
  id: string
  name: string
  city: string
  address: string
}

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

const VEHICLE_TYPES = [
  { value: '', label: 'All types' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'minivan', label: 'Minivan' },
]

function VehicleCardLive({ vehicle, locationName }: { vehicle: Vehicle; locationName: string }) {
  const [imgError, setImgError] = useState(false)
  const imageUrl = vehicle.images?.[0]

  return (
    <Link
      href={`/booking/${vehicle.id}`}
      className="vcard"
      style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
    >
      {/* Photo area */}
      <div className="vcard-photo" style={{ background: 'var(--color-surface-strong)' }}>
        {imageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgError(true)}
          />
        ) : (
          /* Fallback placeholder when no image or load error */
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--color-muted)' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
              <path d="M4 17 6 7h12l2 10H4z" />
              <circle cx="8" cy="17" r="2" />
              <circle cx="16" cy="17" r="2" />
            </svg>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.5 }}>No photo</span>
          </div>
        )}
        {/* Vehicle type tag */}
        <span className="vcard-tag" style={{ textTransform: 'capitalize' }}>{vehicle.vehicle_type}</span>
      </div>

      {/* Body */}
      <div className="vcard-body">
        <div className="vcard-titlerow">
          <span className="vcard-title">{vehicle.year} {vehicle.make} {vehicle.model}</span>
        </div>

        <div className="vcard-meta">{vehicle.color} · {locationName}</div>

        {/* Features */}
        {vehicle.features && vehicle.features.length > 0 && (
          <div className="vcard-specs">
            {vehicle.features.slice(0, 3).map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        )}

        <div className="vcard-foot">
          <span className="vcard-price"><b>${vehicle.daily_rate}</b> / day</span>
          <span className="vcard-go">
            <IconArrowRight width={14} height={14} />
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function VehiclesPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [loadingLocations, setLoadingLocations] = useState(true)
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [locationsError, setLocationsError] = useState('')
  const [vehiclesError, setVehiclesError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  // Fetch locations on mount
  useEffect(() => {
    setLoadingLocations(true)
    fetch('/api/locations')
      .then((r) => r.json())
      .then((data) => {
        if (data.locations) {
          setLocations(data.locations)
        } else {
          setLocationsError('Could not load locations.')
        }
      })
      .catch(() => setLocationsError('Could not load locations.'))
      .finally(() => setLoadingLocations(false))
  }, [])

  // Fetch vehicles when filters change (after first search or on mount)
  function fetchVehicles() {
    setLoadingVehicles(true)
    setVehiclesError('')
    setHasSearched(true)

    const params = new URLSearchParams()
    if (selectedLocation) params.set('location_id', selectedLocation)
    if (selectedType) params.set('vehicle_type', selectedType)

    fetch(`/api/vehicles?${params.toString()}`)
      .then((r) => {
        if (r.status === 401) {
          // Not logged in — show a message
          setVehiclesError('Please sign in to browse available vehicles.')
          return null
        }
        return r.json()
      })
      .then((data) => {
        if (!data) return
        if (data.vehicles) {
          setVehicles(data.vehicles)
        } else {
          setVehiclesError(data.message ?? 'Could not load vehicles.')
        }
      })
      .catch(() => setVehiclesError('Could not load vehicles. Please try again.'))
      .finally(() => setLoadingVehicles(false))
  }

  // Get location name by id
  function locationName(id: string) {
    const loc = locations.find((l) => l.id === id)
    return loc ? `${loc.city} — ${loc.name}` : id
  }

  return (
    <main>
      <AnimationProvider />

      {/* Page header */}
      <section className="pagehead wrap" data-hero-reveal>
        <div className="pagehead-row">
          <div>
            <span className="eyebrow">Available fleet</span>
            <h1 style={{ marginTop: 12 }}>
              Browse the <em className="editorial-italic">fleet</em>
            </h1>
            <p className="breadcrumb">
              <Link href="/">Home</Link> &nbsp;/&nbsp; Vehicles
            </p>
          </div>
          <p>
            Sedans, SUVs, vans, and minivans — all available at verified crew locations.
            No deposit. All-inclusive pricing. Unlimited miles and tolls.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="wrap" style={{ paddingTop: 32, paddingBottom: 8 }} data-reveal>
        <div
          className="contactform"
          style={{ padding: '20px 24px', display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}
        >
          {/* Location dropdown — from database */}
          <div className="formfield" style={{ flex: '1 1 220px', minWidth: 180 }}>
            <label htmlFor="location-filter">Pick-up location</label>
            {loadingLocations ? (
              <div style={{ height: 48, display: 'flex', alignItems: 'center', fontSize: 14, color: 'var(--color-muted)' }}>
                Loading locations…
              </div>
            ) : locationsError ? (
              <div style={{ fontSize: 13, color: 'var(--color-error)', paddingTop: 8 }}>{locationsError}</div>
            ) : (
              <select
                id="location-filter"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All locations</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.city} — {loc.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Vehicle type filter */}
          <div className="formfield" style={{ flex: '1 1 180px', minWidth: 160 }}>
            <label htmlFor="type-filter">Vehicle type</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {VEHICLE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search button */}
          <button
            className="btn-primary"
            type="button"
            onClick={fetchVehicles}
            disabled={loadingVehicles}
            style={{ height: 48, padding: '0 28px', flexShrink: 0, opacity: loadingVehicles ? 0.65 : 1, cursor: loadingVehicles ? 'not-allowed' : 'pointer' }}
          >
            {loadingVehicles ? 'Searching…' : 'Search vehicles'}
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="section wrap" style={{ paddingTop: 24 }} data-reveal>

        {/* Error state */}
        {vehiclesError && (
          <div style={{ padding: '16px 20px', background: 'rgba(193, 53, 21, 0.08)', border: '1px solid rgba(193, 53, 21, 0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', fontSize: 14, marginBottom: 24 }}>
            {vehiclesError}
            {vehiclesError.includes('sign in') && (
              <> <Link href="/login" style={{ color: 'var(--color-error)', textDecoration: 'underline', fontWeight: 600 }}>Sign in here</Link>.</>
            )}
          </div>
        )}

        {/* Loading skeleton */}
        {loadingVehicles && (
          <div className="vgrid vgrid-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="vcard" style={{ opacity: 0.4 }}>
                <div className="vcard-photo" style={{ background: 'var(--color-surface-strong)', animation: 'pulse 1.5s ease-in-out infinite alternate' }} />
                <div className="vcard-body">
                  <div style={{ height: 18, background: 'var(--color-surface-strong)', borderRadius: 4, marginBottom: 10 }} />
                  <div style={{ height: 14, background: 'var(--color-surface-strong)', borderRadius: 4, width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Vehicles grid */}
        {!loadingVehicles && hasSearched && vehicles.length > 0 && (
          <>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="eyebrow eyebrow--ink">
                {vehicles.length} {vehicles.length === 1 ? 'vehicle' : 'vehicles'} available
              </span>
            </div>
            <div className="vgrid vgrid-3" data-stagger>
              {vehicles.map((v) => (
                <VehicleCardLive
                  key={v.id}
                  vehicle={v}
                  locationName={locationName(v.location_id)}
                />
              ))}
            </div>
          </>
        )}

        {/* Empty state */}
        {!loadingVehicles && hasSearched && !vehiclesError && vehicles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-surface-strong)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-muted)' }}>
                <path d="M4 17 6 7h12l2 10H4z" />
                <circle cx="8" cy="17" r="2" />
                <circle cx="16" cy="17" r="2" />
              </svg>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 500, margin: '0 0 8px' }}>No vehicles found</h2>
            <p style={{ color: 'var(--color-muted)', maxWidth: 360, margin: '0 auto' }}>
              Try a different location or vehicle type. New vehicles are added as crew members join.
            </p>
          </div>
        )}

        {/* Initial prompt — before first search */}
        {!loadingVehicles && !hasSearched && !vehiclesError && (
          <div style={{ textAlign: 'center', padding: '64px 24px' }}>
            <p style={{ color: 'var(--color-muted)', fontSize: 16 }}>
              Select a location and click <strong>Search vehicles</strong> to browse the fleet.
            </p>
            <p style={{ color: 'var(--color-muted)', fontSize: 14, marginTop: 8 }}>
              You must be signed in to view available vehicles.{' '}
              <Link href="/login" style={{ color: 'var(--color-ink)', fontWeight: 500, textDecoration: 'underline' }}>
                Sign in
              </Link>{' '}
              or{' '}
              <Link href="/signup" style={{ color: 'var(--color-ink)', fontWeight: 500, textDecoration: 'underline' }}>
                create an account
              </Link>.
            </p>
          </div>
        )}
      </section>

      <div style={{ height: 64 }} />
    </main>
  )
}
