'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Plan {
  id: string
  name: string
  priceGalleons: number
  priceSickles: number
  features: string[]
  icon: string
}

interface StoredUser {
  id: string
  username: string
  displayName: string
  galleons: number
  sickles: number
  knuts: number
  subscriptionPlan: string | null
  subscriptionEnds: string | null
}

export default function SubscribePage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [user, setUser] = useState<StoredUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'warning'; text: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('pyhood_user')
    if (!stored) {
      router.push('/login')
      return
    }

    const parsed = JSON.parse(stored)
    setUser(parsed)

    // প্ল্যান ও আপডেটেড ইউজার লোড
    const load = async () => {
      try {
        const [plansRes, meRes] = await Promise.all([
          fetch('/api/subscription/plans'),
          fetch(`/api/auth/me?userId=${parsed.id}`),
        ])

        const plansData = await plansRes.json()
        if (plansData.plans) setPlans(plansData.plans)

        const meData = await meRes.json()
        if (meData.success) {
          setUser(meData.user)
          localStorage.setItem('pyhood_user', JSON.stringify(meData.user))
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router])

  const handleSubscribe = async (planId: string) => {
    if (!user) return
    setSubscribing(planId)
    setMessage(null)

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, plan: planId }),
      })
      const data = await res.json()

      if (data.success) {
        setUser(prev => prev ? {
          ...prev,
          galleons: data.newBalance,
          subscriptionPlan: planId,
          subscriptionEnds: data.endsAt,
        } : prev)
        localStorage.setItem('pyhood_user', JSON.stringify({
          ...user,
          galleons: data.newBalance,
          subscriptionPlan: planId,
          subscriptionEnds: data.endsAt,
        }))
        setMessage({ type: 'success', text: data.message })
      } else {
        setMessage({ type: 'warning', text: data.error || 'সাবস্ক্রিপশন ব্যর্থ' })
      }
    } catch {
      setMessage({ type: 'warning', text: 'সার্ভারে সমস্যা হয়েছে' })
    } finally {
      setSubscribing(null)
    }
  }

  if (loading) {
    return (
      <div className="parchment-bg parchment-page">
        <div className="parchment-loading">
          <div className="spinner" />
          <p>🔮 প্ল্যান লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="parchment-bg parchment-page">
      <div className="parchment-page-inner">
        <a href="/profile" className="parchment-back-link">← প্রোফাইলে ফিরে যান</a>

        <h1 className="parchment-page-title">সাবস্ক্রিপশন প্ল্যান</h1>
        <p className="parchment-page-subtitle">
          আপনার ব্যালেন্স: 🪙 {user?.galleons || 0} গ্যালিয়ন
        </p>

        {message && (
          <div className={message.type === 'success' ? 'parchment-success' : 'parchment-warning'}>
            {message.type === 'success' ? '✅' : '⚠️'} {message.text}
          </div>
        )}

        <div className="plan-grid">
          {plans.map(plan => {
            const isCurrent = user?.subscriptionPlan === plan.id && user?.subscriptionEnds && new Date(user.subscriptionEnds) > new Date()
            const canAfford = (user?.galleons || 0) >= plan.priceGalleons
            const isSubscribing = subscribing === plan.id

            return (
              <div
                key={plan.id}
                className={`plan-card ${plan.id === 'dragon' ? 'dragon' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <span className="plan-icon">{plan.icon}</span>
                <div className="plan-name">{plan.name}</div>
                <div className="plan-price">
                  {plan.priceGalleons} 🪙
                  <span className="plan-price-period"> /মাস</span>
                </div>

                <ul className="plan-features">
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>

                {isCurrent ? (
                  <button className="plan-subscribe-btn current-btn" disabled>
                    ✓ বর্তমান প্ল্যান
                  </button>
                ) : (
                  <>
                    {!canAfford && (
                      <div className="parchment-warning" style={{ marginBottom: 12, fontSize: '0.8rem' }}>
                        পর্যাপ্ত গ্যালিয়ন নে। প্রয়োজন: {plan.priceGalleons}G
                      </div>
                    )}
                    <button
                      className="plan-subscribe-btn"
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isSubscribing || !canAfford}
                    >
                      {isSubscribing ? '🔮 প্রক্রিয়াধীন...' : `🪄 ${plan.priceGalleons}G দিয়ে সাবস্ক্রাইব`}
                    </button>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}