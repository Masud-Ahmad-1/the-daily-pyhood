'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="parchment-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: '3rem' }}>🪄</div>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        color: 'var(--accent-red)',
        textAlign: 'center',
      }}>
        জাদুভিত্তিক ত্রুটি
      </h1>
      <p style={{
        fontSize: '1rem',
        color: 'var(--border-color)',
        textAlign: 'center',
        maxWidth: 400,
        lineHeight: 1.7,
      }}>
        দুঃখিত, পৃষ্ঠায় একটি অপ্রত্যাশিত সমস্যা হয়েছে।
      </p>
      <button
        onClick={reset}
        className="magic-btn"
        style={{ fontSize: '1rem', padding: '10px 24px' }}
      >
        আবার চেষ্টা করুন
      </button>
      <a href="/" className="article-back-btn">
        📜 পাইপত্রে ফিরে যান
      </a>
    </div>
  )
}