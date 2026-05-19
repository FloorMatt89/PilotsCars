'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? 'Login failed. Please check your credentials.')
        return
      }

      // Successful login — go to dashboard
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ minHeight: 'calc(100vh - 110px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: 'var(--color-surface-soft)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <span className="eyebrow eyebrow--ink" style={{ display: 'block', marginBottom: 12 }}>Crew portal</span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 500, letterSpacing: '-0.025em', margin: 0 }}>
            Welcome back.
          </h1>
          <p style={{ color: 'var(--color-muted)', marginTop: 8, fontSize: 15 }}>
            Sign in with your crew account.
          </p>
        </div>

        {/* Card */}
        <div className="contactform">
          <form onSubmit={handleSubmit}>
            <div className="formgrid">

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

              {/* Password */}
              <div className="formfield">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
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
                disabled={loading}
                style={{ width: '100%', opacity: loading ? 0.65 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>

            </div>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'var(--color-muted)' }}>
            No account yet?{' '}
            <Link href="/signup" style={{ color: 'var(--color-ink)', fontWeight: 500, textDecoration: 'underline' }}>
              Create your crew account
            </Link>
          </div>
        </div>

        {/* Fine print */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--color-muted)', marginTop: 20 }}>
          PilotCars is a closed marketplace for verified airline crew.
          <br />Accounts require airline ID approval before booking.
        </p>
      </div>
    </main>
  )
}
