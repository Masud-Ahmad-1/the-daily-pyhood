'use client'

import { Component, ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ArticleErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      const errMsg = this.state.error?.message || 'অজানা ত্রুটি'
      const isSubError = errMsg.toLowerCase().includes('subscri') || errMsg.toLowerCase().includes('permission') || errMsg.toLowerCase().includes('access')
      return (
        <div className="parchment-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 20 }}>
          <div style={{ fontSize: '3rem' }}>{isSubError ? '🔮' : '🪄'}</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-red)', textAlign: 'center' }}>
            {isSubError ? 'সাবস্ক্রিপশন সমস্যা' : 'জাদুভিত্তিক ত্রুটি'}
          </h2>
          <p style={{ color: 'var(--border-color)', textAlign: 'center', maxWidth: 400, lineHeight: 1.7 }}>
            {isSubError
              ? 'এই প্রতিবেদন পড়তে সাবস্ক্রিপশন প্রয়োজন। অনুগ্রহ করে সাবস্ক্রাইব করুন অথবা পরে আবার চেষ্টা করুন।'
              : 'এই প্রতিবেদনে একটি সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।'
            }
          </p>
          {isSubError && (
            <a href="/subscribe" className="article-back-btn" style={{ background: 'var(--accent-gold)', color: '#000', borderColor: 'var(--accent-gold)' }}>
              🔮 সাবস্ক্রিপশন পেজে যান
            </a>
          )}
          <a href="/" className="article-back-btn">📜 পাইপত্রে ফিরে যান</a>
        </div>
      )
    }
    return this.props.children
  }
}