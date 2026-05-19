'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IconPin, IconCalendar, IconBadge, IconSearch } from '@/components/Icons'

// Shape returned by GET /api/locations
interface Location {
  id: string
  name: string
  city: string
  address: string
}

const CREW_ROLES = [
  'UAL — Pilot',
  'AAL — Flight attendant',
  'DAL — Mechanic',
  'Family member',
]

// Mirrors the public.vehicle_type enum and the /vehicles page filter.
const VEHICLE_TYPES = [
  { value: '', label: 'All types' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'minivan', label: 'Minivan' },
]

// Local-time value for <input type="datetime-local"> (YYYY-MM-DDTHH:mm)
function dateTimeOffset(days: number, hour: number, minute: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(hour, minute, 0, 0)
  // Adjust to local ISO without the timezone suffix
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
}

export default function SearchDock() {
  const router = useRouter()

  const [locations, setLocations] = useState<Location[]>([])
  const [loadingLocations, setLoadingLocations] = useState(true)
  const [locationsError, setLocationsError] = useState('')

  // Controlled form state
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('') // '' = same as pick-up
  const [pickupAt, setPickupAt] = useState(dateTimeOffset(3, 14, 30))
  const [dropoffAt, setDropoffAt] = useState(dateTimeOffset(6, 9, 0))
  const [crewRole, setCrewRole] = useState(CREW_ROLES[0])
  const [vehicleType, setVehicleType] = useState('')

  // Validation message shown below the row
  const [error, setError] = useState('')

  // Load real rental locations from the database on mount
  useEffect(() => {
    console.log('SearchDock: Fetching locations...')
    fetch('/api/locations')
      .then((r) => {
        console.log('SearchDock: Locations API status:', r.status)
        if (r.status === 401) {
          // Public home page + auth-gated API: degrade gracefully.
          setLocationsError('sign-in')
          return null
        }
        return r.json()
      })
      .then((data) => {
        if (!data) return
        if (data.locations) {
          console.log('SearchDock: Loaded', data.locations.length, 'locations')
          setLocations(data.locations)
          if (data.locations.length > 0) setPickupLocation(data.locations[0].id)
        } else {
          setLocationsError('failed')
        }
      })
      .catch((err) => {
        console.error('SearchDock: Error fetching locations:', err)
        setLocationsError('failed')
      })
      .finally(() => setLoadingLocations(false))
  }, [])

  // Validate the form. Returns an error string, or '' when valid.
  function validate(): string {
    if (locationsError === 'sign-in') {
      return 'Sign in to search the live fleet.'
    }
    if (locationsError === 'failed') {
      return 'We could not load locations. Please refresh and try again.'
    }
    if (!pickupLocation) {
      return 'Choose a pick-up field to continue.'
    }
    if (!pickupAt || !dropoffAt) {
      return 'Enter both a pick-up and a drop-off date and time.'
    }
    const pickup = new Date(pickupAt)
    const dropoff = new Date(dropoffAt)
    if (Number.isNaN(pickup.getTime()) || Number.isNaN(dropoff.getTime())) {
      return 'Enter a valid pick-up and drop-off date and time.'
    }
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    if (pickup < now) {
      return 'Pick-up date cannot be in the past.'
    }
    if (dropoff <= pickup) {
      return 'Drop-off must be after pick-up.'
    }
    return ''
  }

  // Run the search: send the picked DB location to the live /vehicles results.
  function handleSearch() {
    const validationError = validate()
    if (validationError) {
      console.log('SearchDock: Validation failed —', validationError)
      setError(validationError)
      return
    }
    setError('')

    const [pickupDate, pickupTime] = pickupAt.split('T')
    const [returnDate, returnTime] = dropoffAt.split('T')

    const params = new URLSearchParams()
    params.set('location_id', pickupLocation)
    if (dropoffLocation) params.set('dropoff_id', dropoffLocation)
    params.set('pickup_date', pickupDate)
    params.set('pickup_time', pickupTime)
    params.set('return_date', returnDate)
    params.set('return_time', returnTime)
    if (vehicleType) params.set('vehicle_type', vehicleType)
    console.log('SearchDock: Searching with', params.toString())
    router.push(`/vehicles?${params.toString()}`)
  }

  // Location dropdown with loading / error / ready states
  function LocationField({
    label,
    value,
    onChange,
    sameAsPickup,
  }: {
    label: string
    value: string
    onChange: (v: string) => void
    sameAsPickup?: boolean
  }) {
    return (
      <div className="searchdock-cell">
        <span className="searchdock-label">{label}</span>
        <div className="searchdock-value">
          <IconPin />
          {loadingLocations ? (
            <input type="text" value="Loading fields…" readOnly />
          ) : locationsError ? (
            <input
              type="text"
              value={
                locationsError === 'sign-in'
                  ? 'Sign in to load fields'
                  : 'Fields unavailable'
              }
              readOnly
            />
          ) : locations.length === 0 ? (
            <input type="text" value="No fields available yet" readOnly />
          ) : (
            <select
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
                setError('')
              }}
              aria-label={label}
            >
              {sameAsPickup && <option value="">Same as pick-up</option>}
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.city} — {loc.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="searchdock" data-hero-reveal>
      <div className="searchdock-row">
        <LocationField
          label="Pick-up field"
          value={pickupLocation}
          onChange={setPickupLocation}
        />
        <LocationField
          label="Drop-off field"
          value={dropoffLocation}
          onChange={setDropoffLocation}
          sameAsPickup
        />

        <div className="searchdock-cell">
          <span className="searchdock-label">Pick-up date &amp; time</span>
          <div className="searchdock-value">
            <IconCalendar />
            <input
              type="datetime-local"
              value={pickupAt}
              onChange={(e) => {
                setPickupAt(e.target.value)
                setError('')
              }}
              aria-label="Pick-up date and time"
            />
          </div>
        </div>

        <div className="searchdock-cell">
          <span className="searchdock-label">Drop-off date &amp; time</span>
          <div className="searchdock-value">
            <IconCalendar />
            <input
              type="datetime-local"
              value={dropoffAt}
              min={pickupAt}
              onChange={(e) => {
                setDropoffAt(e.target.value)
                setError('')
              }}
              aria-label="Drop-off date and time"
            />
          </div>
        </div>

        <div className="searchdock-cell">
          <span className="searchdock-label">Crew ID</span>
          <div className="searchdock-value">
            <IconBadge />
            <select
              value={crewRole}
              onChange={(e) => setCrewRole(e.target.value)}
              aria-label="Crew ID"
            >
              {CREW_ROLES.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="button"
          className="searchdock-submit"
          onClick={handleSearch}
        >
          <IconSearch /> Search
        </button>
      </div>

      {error && (
        <div className="searchdock-error" role="alert">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
          {error}
        </div>
      )}

      <div className="searchdock-foot">
        <span>Vehicle type</span>
        <div className="seg-pills">
          {VEHICLE_TYPES.map((t) => (
            <button
              key={t.value || 'all'}
              type="button"
              className={`seg-pill${vehicleType === t.value ? ' is-active' : ''}`}
              onClick={() => setVehicleType(t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="searchdock-help" style={{ flexBasis: '100%' }}>
          All-inclusive pricing — insurance, unlimited miles, and tolls included. Verified crew only.
        </span>
      </div>
    </div>
  )
}
