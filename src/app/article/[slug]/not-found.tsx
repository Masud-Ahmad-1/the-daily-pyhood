'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="parchment-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: '4rem' }}>📜</div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2rem',
        color: 'var(--accent-red)',
        textAlign: 'center',
      }}>
        প্রতিবেদন পাওয়া যায়নি
      </h1>
      <p style={{
        fontSize: '1rem',
        color: 'var(--border-color)',
        textAlign: 'center',
        maxWidth: 400,
        lineHeight: 1.7,
      }}>
        আপনি যে প্রতিবেদনটি খুঁজছেন তা বিদ্যমান নয় অথবা সরানো হয়েছে।
      </p>
      <Link href="/" className="article-back-btn">
        📜 পাইপত্রে ফিরে যান
      </Link>
    </div>
  )
}