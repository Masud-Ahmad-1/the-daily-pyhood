'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface WalletData {
  galleons: number
  sickles: number
  knuts: number
  totalInGalleons: number
  transactions: Transaction[]
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

const TYPE_LABELS: Record<string, string> = {
  bonus: 'বোনাস',
  subscription: 'সাবস্ক্রিপশন',
  conversion: 'রূপান্তর',
  purchase: 'ক্রয়',
  earning: 'আয়',
}

const CURRENCIES = [
  { value: 'galleons', label: '🪙 গ্যালিয়ন' },
  { value: 'sickles', label: '🥈 সিকেল' },
  { value: 'knuts', label: '🥉 নাট' },
]

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // রূপান্তর ফর্ম
  const [fromCurrency, setFromCurrency] = useState('galleons')
  const [toCurrency, setToCurrency] = useState('sickles')
  const [amount, setAmount] = useState('')
  const [converting, setConverting] = useState(false)
  const [convertMsg, setConvertMsg] = useState<{ type: 'success' | 'warning'; text: string } | null>(null)

  const router = useRouter()

  const userId = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('pyhood_user') || '{}').id : null

  const loadWallet = async () => {
    if (!userId) {
      router.push('/login')
      return
    }
    try {
      const res = await fetch(`/api/wallet?userId=${userId}`)
      const data = await res.json()
      if (data.success) {
        setWallet(data)
      } else {
        setError(data.error || 'ওয়ালেট লোড করা যায়নি')
      }
    } catch {
      setError('ডেটা লোডে সমস্যা')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userId) {
      router.push('/login')
      return
    }
    loadWallet()
  }, [router])

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !amount || Number(amount) <= 0) return

    setConverting(true)
    setConvertMsg(null)

    try {
      const res = await fetch('/api/wallet/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          from: fromCurrency,
          to: toCurrency,
          amount: Number(amount),
        }),
      })
      const data = await res.json()

      if (data.success) {
        setConvertMsg({ type: 'success', text: data.message })
        setAmount('')
        loadWallet()
      } else {
        setConvertMsg({ type: 'warning', text: data.error || 'রূপান্তর ব্যর্থ' })
      }
    } catch {
      setConvertMsg({ type: 'warning', text: 'সার্ভারে সমস্যা' })
    } finally {
      setConverting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'short',
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

  if (loading) {
    return (
      <div className="parchment-bg parchment-page">
        <div className="parchment-loading">
          <div className="spinner" />
          <p>🏦 গ্রিংগটস ওয়ালেট লোড হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (error || !wallet) {
    return (
      <div className="parchment-bg parchment-page">
        <div className="parchment-page-inner">
          <a href="/" className="parchment-back-link">← পত্রিকায় ফিরে যান</a>
          <div className="parchment-empty">
            <p style={{ fontSize: '2rem', marginBottom: 12 }}>🏦</p>
            <p>{error || 'ওয়ালেট লোড করা যায়নি'}</p>
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
        <a href="/profile" className="parchment-back-link">← প্রোফাইলে ফিরে যান</a>

        <h1 className="parchment-page-title">🏦 গ্রিংগটস ওয়ালেট</h1>
        <p className="parchment-page-subtitle">আপনার জাদুভিত্তিক মুদ্রার হিসাব</p>

        {/* ৩ মুদ্রার ব্যালেন্স */}
        <div className="wallet-balances">
          <div className="wallet-balance-card galleon">
            <span className="wallet-currency-icon">🪙</span>
            <div className="wallet-currency-name gold">গ্যালিয়ন (G)</div>
            <div className="wallet-amount gold">{wallet.galleons}</div>
          </div>
          <div className="wallet-balance-card sickle">
            <span className="wallet-currency-icon">🥈</span>
            <div className="wallet-currency-name silver">সিকেল (S)</div>
            <div className="wallet-amount silver">{wallet.sickles}</div>
          </div>
          <div className="wallet-balance-card knut">
            <span className="wallet-currency-icon">🥉</span>
            <div className="wallet-currency-name bronze">নাট (K)</div>
            <div className="wallet-amount bronze">{wallet.knuts}</div>
          </div>
        </div>

        {/* মোট ব্যালেন্স */}
        <div className="wallet-total">
          <div className="wallet-total-label">মোট সম্পদ (গ্যালিয়নে)</div>
          <div className="wallet-total-amount">{wallet.totalInGalleons} 🪙</div>
        </div>

        {/* মুদ্রা রূপান্তর */}
        <div className="convert-section">
          <div className="convert-title">🔄 মুদ্রা রূপান্তর</div>

          {convertMsg && (
            <div className={convertMsg.type === 'success' ? 'parchment-success' : 'parchment-warning'}>
              {convertMsg.type === 'success' ? '✅' : '⚠️'} {convertMsg.text}
            </div>
          )}

          <form className="convert-form" onSubmit={handleConvert}>
            <div className="convert-group">
              <label>থেকে</label>
              <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)}>
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="convert-group">
              <label>পরিমাণ</label>
              <input
                type="number"
                min="1"
                step="1"
                placeholder="পরিমাণ লিখুন"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="convert-group">
              <label>প্রতি</label>
              <select value={toCurrency} onChange={e => setToCurrency(e.target.value)}>
                {CURRENCIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <button className="convert-btn" type="submit" disabled={converting || fromCurrency === toCurrency}>
              {converting ? '🔄 হচ্ছে...' : '✨ রূপান্তর'}
            </button>
          </form>
          <div className="convert-info">
            হার: ১ গ্যালিয়ন = ১৭ সিকেল = ৪৯৩ নাট
          </div>
        </div>

        {/* লেনদেন ইতিহাস */}
        <h2 style={{
          fontFamily: 'var(--font-bn-headline)',
          fontSize: '1.2rem',
          fontWeight: 800,
          color: 'var(--border-color)',
          marginBottom: 16,
        }}>
          📜 লেনদেন ইতিহাস
        </h2>

        {wallet.transactions.length === 0 ? (
          <div className="parchment-empty">কোনো লেনদেন নেই</div>
        ) : (
          <div className="txn-table-wrapper" style={{ maxHeight: 400, overflowY: 'auto' }}>
            <table className="txn-table">
              <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                <tr>
                  <th>ধরন</th>
                  <th>বিবরণ</th>
                  <th>পরিমাণ</th>
                  <th>ব্যালেন্স</th>
                  <th>তারিখ</th>
                </tr>
              </thead>
              <tbody>
                {wallet.transactions.map(txn => (
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
                    <td>{txn.balanceG}G</td>
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