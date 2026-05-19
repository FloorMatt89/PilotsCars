'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [airlineIdFile, setAirlineIdFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'uploading-id'>('form')

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFileError('')
    const file = e.target.files?.[0] ?? null
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setFileError('Only JPEG and PNG files are accepted.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File must be 5 MB or smaller.')
      return
    }
    setAirlineIdFile(file)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (!airlineIdFile) {
      setError('Please upload a photo of your airline ID to continue.')
      return
    }

    setLoading(true)

    try {
      // Step 1: Create account
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          phone: phone || undefined,
        }),
      })

      const signupData = await signupRes.json()

      if (!signupRes.ok) {
        setError(signupData.message ?? 'Account creation failed. Please try again.')
        return
      }

      // Step 2: Upload airline ID
      setStep('uploading-id')

      const formData = new FormData()
      formData.append('file', airlineIdFile)

      const uploadRes = await fetch('/api/users/upload-airline-id', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        // Signup worked but ID upload failed — still redirect with a note
        console.warn('Airline ID upload failed after signup')
      }

      // Success — redirect to login with message
      router.push('/login?msg=id-submitted')

    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      setStep('form')
    }
  }

  const buttonLabel = step === 'uploading-id' ? 'Uploading ID…' : loading ? 'Creating account…' : 'Create account'

  return (
    <main style={{ minHeight: 'calc(100vh - 110px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: 'var(--color-surface-soft)' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>

        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <span className="eyebrow eyebrow--ink" style={{ display: 'block', marginBottom: 12 }}>Join the manifest</span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 500, letterSpacing: '-0.025em', margin: 0 }}>
            Create your crew account.
          </h1>
          <p style={{ color: 'var(--color-muted)', marginTop: 8, fontSize: 15, maxWidth: 380, margin: '8px auto 0' }}>
            Airline ID verification is required. An admin will review and approve your account before you can book.
          </p>
        </div>

        {/* Verification notice */}
        <div style={{ padding: '14px 18px', background: 'rgba(184, 146, 58, 0.10)', border: '1px solid rgba(184, 146, 58, 0.30)', borderRadius: 'var(--radius-sm)', marginBottom: 24, fontSize: 14, color: 'var(--color-body)', lineHeight: 1.5 }}>
          <strong style={{ fontWeight: 600, color: 'var(--color-ink)' }}>Closed marketplace —</strong>{' '}
          PilotCars is for verified airline crew only. Pilots, flight attendants, mechanics, dispatchers, and ground crew are all welcome.
        </div>

        {/* Card */}
        <div className="contactform">
          <form onSubmit={handleSubmit}>
            <div className="formgrid">

              {/* Full name */}
              <div className="formfield">
                <label htmlFor="full_name">Full name</label>
                <input
                  id="full_name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Capt. Jane Smith"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="formfield">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@airline.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="formfield">
                <label htmlFor="phone">Phone number <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--color-muted)' }}>(optional)</span></label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="formfield">
                <label htmlFor="password">Password <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--color-muted)' }}>(min. 8 characters)</span></label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Airline ID upload */}
              <div className="formfield">
                <label htmlFor="airline_id">Airline ID photo <span style={{ fontWeight: 600, color: 'var(--color-brass-strong)', textTransform: 'none', letterSpacing: 0 }}>required</span></label>
                <input
                  id="airline_id"
                  type="file"
                  accept="image/jpeg,image/png"
                  required
                  onChange={handleFileChange}
                  style={{ padding: '10px 14px', cursor: 'pointer' }}
                />
                {fileError && (
                  <p style={{ marginTop: 6, fontSize: 13, color: 'var(--color-error)' }}>{fileError}</p>
                )}
                {airlineIdFile && !fileError && (
                  <p style={{ marginTop: 6, fontSize: 13, color: 'var(--color-muted)' }}>
                    {airlineIdFile.name} — ready to upload
                  </p>
                )}
                <p style={{ marginTop: 6, fontSize: 12, color: 'var(--color-muted)' }}>
                  JPEG or PNG, max 5 MB. Your ID is stored privately and only visible to admins.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div style={{ padding: '12px 16px', background: 'rgba(193, 53, 21, 0.08)', border: '1px solid rgba(193, 53, 21, 0.25)', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', fontSize: 14 }}>
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !!fileError}
                style={{ width: '100%', opacity: (loading || !!fileError) ? 0.65 : 1, cursor: (loading || !!fileError) ? 'not-allowed' : 'pointer' }}
              >
                {buttonLabel}
              </button>

            </div>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--color-muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--color-ink)', fontWeight: 500, textDecoration: 'underline' }}>
              Sign in
            </Link>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-muted)', marginTop: 20 }}>
          No deposit required. All-inclusive pricing with unlimited miles and tolls.
          <br />Crew rates. No hidden fees.
        </p>
      </div>
    </main>
  )
}
