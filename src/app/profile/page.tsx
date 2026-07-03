'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  username: string
  displayName: string
  email: string | null
  role: string
  galleons: number
  sickles: number
  knuts: number
  subscriptionPlan: string | null
  subscriptionEnds: string | null
  createdAt: string
}

interface Transaction {
  id: string
  type: string
  amountG: number
  amountS: number
  amountK: number
  description: string
  balanceG: number
  createdAt: string
}

const PLAN_LABELS: Record<string, string> = {
  owl: '🦉 আউল',
  phoenix: '🔥 ফিনিক্স',
  dragon: '🐉 ড্রাগন',
}

const TYPE_LABELS: Record<string, string> = {
  bonus: 'বোনাস',
  subscription: 'সাবস্ক্রিপশন',
  conversion: 'রূপান্তর',
  purchase: 'ক্রয়',
  earning: 'আয়',
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('pyhood_user')
    if (!stored) {
      router.push('/login')
      return
    }

    const parsed = JSON.parse(stored)
    const userId = parsed.id

    const loadData = async () => {
      try {
        const [meRes, walletRes] = await Promise.all([
          fetch(`/api/auth/me?userId=${userId}`),
          fetch(`/api/wallet?userId=${userId}`),
        ])

        const meData = await meRes.json()
        const walletData = await walletRes.json()

        if (meData.success) {
          setUser(meData.user)
          // localStorage আপডেট
          localStorage.setItem('pyhood_user', JSON.stringify(meData.user))
        } else {
          setError(meData.error || 'প্রোফাইল লোড করা যায়নি')
        }

        if (walletData.success) {
          setTransactions(walletData.transactions || [])
        }
      } catch {
        setError('ডেটা লোডে সমস্যা')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatAmount = (t: Transaction) => {
    const parts: string[] = []
    if (t.amountG !== 0) parts.push(`${t.amountG}G`)
    if (t.amountS !== 0) parts.push(`${t.amountS}S`)
    if (t.amountK !== 0) parts.push(`${t.amountK}K`)
    return parts.join(' ')
  }

  const handleLogout = () => {
    localStorage.removeItem('pyhood_user')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="parchment-bg parchment-page">
        <div className="parchment-loading">
          <div className="spinner" />
          <p>🪄 প্রোফাইল লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="parchment-bg parchment-page">
        <div className="parchment-page-inner">
          <a href="/" className="parchment-back-link">← পত্রিকায় ফিরে যান</a>
          <div className="parchment-empty">
            <p style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</p>
            <p>{error || 'প্রোফাইল লোড করা যায়নি'}</p>
            <a href="/login" className="auth-back" style={{ marginTop: 16, display: 'inline-block' }}>
              লগইন পেজে যান
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="parchment-bg parchment-page">
      <div className="parchment-page-inner">
        <a href="/" className="parchment-back-link">← পত্রিকায় ফিরে যান</a>

        <h1 className="parchment-page-title">ইউজার প্রোফাইল</h1>
        <p className="parchment-page-subtitle">গ্রিংগটস ব্যাংক অ্যাকাউন্ট তথ্য</p>

        {/* প্রোফাইল কার্ড */}
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">🧙</div>
            <div>
              <div className="profile-name">{user.displayName}</div>
              <div className="profile-username">@{user.username}</div>
              <div className="profile-joined">📅 যোগদান: {formatDate(user.createdAt)}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <button
                onClick={handleLogout}
                style={{
                  fontFamily: 'var(--font-bengali)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  padding: '6px 14px',
                  background: 'transparent',
                  border: '1.5px solid rgba(74,65,42,0.3)',
                  borderRadius: 6,
                  color: 'var(--border-color)',
                  cursor: 'pointer',
                }}
              >
                🚪 লগআউট
              </button>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <div className="profile-stat-label">🪙 গ্যালিয়ন</div>
              <div className="profile-stat-value" style={{ color: '#8b6914' }}>{user.galleons}</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-label">🥈 সিকেল</div>
              <div className="profile-stat-value" style={{ color: '#707070' }}>{user.sickles}</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-label">🥉 নাট</div>
              <div className="profile-stat-value" style={{ color: '#8b4513' }}>{user.knuts}</div>
            </div>
            <div className="profile-stat">
              <div className="profile-stat-label">📜 সাবস্ক্রিপশন</div>
              <div className="profile-stat-value" style={{ fontSize: '0.95rem' }}>
                {user.subscriptionPlan && user.subscriptionEnds && new Date(user.subscriptionEnds) > new Date() ? (
                  <span className="subscription-badge active">
                    {PLAN_LABELS[user.subscriptionPlan] || user.subscriptionPlan}
                  </span>
                ) : (
                  <span className="subscription-badge inactive">অ্যাক্টিভ নয়</span>
                )}
              </div>
            </div>
          </div>

          {user.subscriptionPlan && user.subscriptionEnds && new Date(user.subscriptionEnds) > new Date() && (
            <div style={{ marginTop: 16, textAlign: 'center', fontFamily: 'var(--font-bengali)', fontSize: '0.85rem', color: 'rgba(74,65,42,0.6)' }}>
              মেয়াদ শেষ: {formatDate(user.subscriptionEnds)}
              <a href="/subscribe" style={{ display: 'block', color: 'var(--accent-gold)', fontWeight: 700, marginTop: 4 }}>
                প্ল্যান পরিবর্তন →
              </a>
            </div>
          )}

          {!user.subscriptionPlan && (
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <a href="/subscribe" style={{
                display: 'inline-block',
                fontFamily: 'var(--font-bengali)',
                fontWeight: 700,
                fontSize: '0.9rem',
                padding: '8px 20px',
                background: 'var(--accent-gold)',
                color: '#fff',
                borderRadius: 6,
                textDecoration: 'none',
              }}>
                🔮 সাবস্ক্রাইব করুন
              </a>
            </div>
          )}
        </div>

        {/* দ্রুত লিংক */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 30, flexWrap: 'wrap' }}>
          <a href="/wallet" style={{
            flex: 1,
            minWidth: 140,
            padding: '16px',
            background: 'rgba(255,255,255,0.4)',
            border: '2px solid var(--border-color)',
            borderRadius: 10,
            textAlign: 'center',
            textDecoration: 'none',
            color: 'var(--border-color)',
            fontFamily: 'var(--font-bengali)',
            fontWeight: 700,
            fontSize: '0.9rem',
            transition: 'transform 0.2s',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🏦</div>
            গ্রিংগটস ওয়ালেট
          </a>
          <a href="/subscribe" style={{
            flex: 1,
            minWidth: 140,
            padding: '16px',
            background: 'rgba(255,255,255,0.4)',
            border: '2px solid var(--border-color)',
            borderRadius: 10,
            textAlign: 'center',
            textDecoration: 'none',
            color: 'var(--border-color)',
            fontFamily: 'var(--font-bengali)',
            fontWeight: 700,
            fontSize: '0.9rem',
            transition: 'transform 0.2s',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>🔮</div>
            সাবস্ক্রিপশন প্ল্যান
          </a>
        </div>

        {/* সাম্প্রতিক লেনদেন */}
        <h2 style={{
          fontFamily: 'var(--font-bn-headline)',
          fontSize: '1.2rem',
          fontWeight: 800,
          color: 'var(--border-color)',
          marginBottom: 16,
        }}>
          📜 সাম্প্রতিক লেনদেন
        </h2>

        {transactions.length === 0 ? (
          <div className="parchment-empty">কোনো লেনদেন নেই</div>
        ) : (
          <div className="txn-table-wrapper">
            <table className="txn-table">
              <thead>
                <tr>
                  <th>ধরন</th>
                  <th>বিবরণ</th>
                  <th>পরিমাণ</th>
                  <th>তারিখ</th>
                </tr>
              </thead>
              <tbody style={{ maxHeight: 384, overflowY: 'auto' }}>
                {transactions.slice(0, 10).map(txn => (
                  <tr key={txn.id}>
                    <td>
                      <span className={`txn-type-badge ${txn.type}`}>
                        {TYPE_LABELS[txn.type] || txn.type}
                      </span>
                    </td>
                    <td>{txn.description}</td>
                    <td className={txn.amountG >= 0 ? 'txn-amount-positive' : 'txn-amount-negative'}>
                      {formatAmount(txn)}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(txn.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}