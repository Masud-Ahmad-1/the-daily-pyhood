export default function NotFound() {
  return (
    <div className="parchment-bg min-h-screen">
      <div className="error-page">
        <h1>৪০৪</h1>
        <p>📜 এই পাতাটি নক্স মন্ত্রের মতো অদৃশ্য হয়ে গেছে!</p>
        <p style={{ fontSize: '0.95rem', opacity: 0.5, marginBottom: '1rem' }}>
          সম্ভবত ফ্লো নেটওয়ার্কের কোনো ত্রুটি ঘটেছে, অথবা এই পাতা কখনোই বিদ্যমান ছিল না।
        </p>
        <a href="/" className="magic-btn">
          🏠 হগওয়ার্টসে ফিরে যান
        </a>
      </div>
    </div>
  )
}