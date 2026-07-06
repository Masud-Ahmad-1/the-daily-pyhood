'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="bn">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#f2ebd9',
        fontFamily: "'Noto Sans Bengali', 'Hind Siliguri', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          maxWidth: 500,
        }}>
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>🪄</div>
          <h1 style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: '1.5rem',
            color: '#8a1f1f',
            marginBottom: 16,
          }}>
            জাদুভিত্তিক ত্রুটি
          </h1>
          <p style={{
            fontSize: '1rem',
            color: '#4a412a',
            lineHeight: 1.7,
            marginBottom: 24,
          }}>
            দুঃখিত, পৃষ্ঠায় একটি অপ্রত্যাশিত সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
          </p>
          <button
            onClick={reset}
            style={{
              background: '#8a1f1f',
              color: '#fff',
              border: 'none',
              padding: '12px 28px',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              borderRadius: 4,
              fontFamily: "'Noto Sans Bengali', sans-serif",
            }}
          >
            আবার চেষ্টা করুন
          </button>
          <div style={{ marginTop: 20 }}>
            <a href="/" style={{
              color: '#b59449',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              borderBottom: '1px dotted #b59449',
            }}>
              📜 পাইপত্রে ফিরে যান
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}