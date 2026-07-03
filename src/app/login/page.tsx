'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // লগইন ফিল্ড
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // রেজিস্ট্রেশন ফিল্ড
  const [regUsername, setRegUsername] = useState('')
  const [regDisplayName, setRegDisplayName] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regEmail, setRegEmail] = useState('')

  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('pyhood_user', JSON.stringify(data.user))
        router.push('/profile')
      } else {
        setError(data.error || 'লগইন ব্যর্থ')
      }
    } catch {
      setError('সার্ভারে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername,
          displayName: regDisplayName,
          password: regPassword,
          email: regEmail || undefined,
        }),
      })
      const data = await res.json()

      if (data.success) {
        localStorage.setItem('pyhood_user', JSON.stringify(data.user))
        router.push('/profile')
      } else {
        setError(data.error || 'নিবন্ধন ব্যর্থ')
      }
    } catch {
      setError('সার্ভারে সমস্যা হয়েছে')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="parchment-bg parchment-page">
      <div className="parchment-page-inner">
        <a href="/" className="parchment-back-link">← পত্রিকায় ফিরে যান</a>

        <h1 className="parchment-page-title">গ্রিংগটস ব্যাংকে প্রবেশ</h1>
        <p className="parchment-page-subtitle">আপনার জাদুভিত্তিক অ্যাকাউন্টে প্রবেশ করুন</p>

        <div className="auth-container">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError('') }}
              type="button"
            >
              🔑 লগইন
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => { setTab('register'); setError('') }}
              type="button"
            >
              ✨ নিবন্ধন
            </button>
          </div>

          {error && <div className="auth-error">⚠️ {error}</div>}

          {tab === 'login' ? (
            <form onSubmit={handleLogin}>
              <div className="auth-field">
                <label htmlFor="login-username">ইউজারনেম</label>
                <input
                  id="login-username"
                  type="text"
                  placeholder="আপনার ইউজারনেম লিখুন"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="login-password">পাসওয়ার্ড</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? '🔮 যাচাই হচ্ছে...' : '🪄 লগইন করুন'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="auth-field">
                <label htmlFor="reg-username">ইউজারনেম</label>
                <input
                  id="reg-username"
                  type="text"
                  placeholder="অনন্য ইউজারনেম (কমপক্ষে ৩ অক্ষর)"
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value.trim())}
                  required
                  minLength={3}
                  autoComplete="username"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-display">প্রদর্শন নাম</label>
                <input
                  id="reg-display"
                  type="text"
                  placeholder="আপনার পূর্ণ নাম"
                  value={regDisplayName}
                  onChange={e => setRegDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-password">পাসওয়ার্ড</label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="পাসওয়ার্ড (কমপক্ষে ৪ অক্ষর)"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  required
                  minLength={4}
                  autoComplete="new-password"
                />
              </div>
              <div className="auth-field">
                <label htmlFor="reg-email">ইমেইল (ঐচ্ছিক)</label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="আপনার ইমেইল (ঐচ্ছিক)"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'rgba(74,65,42,0.6)', marginBottom: 12, fontFamily: 'var(--font-bengali)' }}>
                🎁 নিবন্ধনে ৫০ গ্যালিয়ন স্বাগত বোনাস পাবেন!
              </p>
              <button className="auth-submit" type="submit" disabled={loading}>
                {loading ? '🔮 নিবন্ধন হচ্ছে...' : '✨ অ্যাকাউন্ট তৈরি করুন'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}