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
      return (
        <div className="parchment-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 20 }}>
          <div style={{ fontSize: '3rem' }}>🪄</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-red)', textAlign: 'center' }}>
            জাদুভিত্তিক ত্রুটি
          </h2>
          <p style={{ color: 'var(--border-color)', textAlign: 'center', maxWidth: 400, lineHeight: 1.7 }}>
            এই প্রতিবেদনে একটি সমস্যা হয়েছে।
          </p>
          <a href="/" className="article-back-btn">📜 ডেইলি পাইহুডে ফিরে যান</a>
        </div>
      )
    }
    return this.props.children
  }
}