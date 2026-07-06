'use client'

import { useEffect, useState } from 'react'

interface ArticleItem {
  id: string
  slug: string
  title: string
  subtitle: string | null
  section: string
  author: string
  category: string
  snippet: string | null
  imageUrl: string | null
  viewCount: number
  createdAt: string
}

const sectionMap: { key: string; name: string }[] = [
  { key: 'headline', name: 'শিরোনাম' },
  { key: 'lead', name: 'প্রধান' },
  { key: 'ministry', name: 'মন্ত্রণালয়' },
  { key: 'sports', name: 'ক্রীড়া' },
  { key: 'world', name: 'বিশ্ব' },
  { key: 'security', name: 'নিরাপত্তা' },
  { key: 'gossip', name: 'গুজব' },
  { key: 'economy', name: 'অর্থনীতি' },
  { key: 'entertainment', name: 'বিনোদন' },
  { key: 'local', name: 'স্থানীয়' },
  { key: 'mystery', name: 'রহস্য' },
]

const sectionNames: Record<string, string> = Object.fromEntries(sectionMap.map(s => [s.key, s.name]))

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']
  const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলা', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে']
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`
}

export default function SectionsPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(12)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [activeAuthor, setActiveAuthor] = useState<string | null>(null)
  const [authors, setAuthors] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const doFetch = async () => {
      setLoading(true)
      const params = new URLSearchParams({ page: String(page), limit: String(limit) })
      if (activeSection) params.set('section', activeSection)
      if (activeAuthor) params.set('author', activeAuthor)
      try {
        const res = await fetch(`/api/sections?${params}`)
        const data = await res.json()
        if (!cancelled) {
          setArticles(data.articles || [])
          setTotal(data.total || 0)
          setAuthors(data.authors || [])
        }
      } catch {
        if (!cancelled) setArticles([])
      }
      if (!cancelled) setLoading(false)
    }
    doFetch()
    return () => { cancelled = true }
  }, [page, limit, activeSection, activeAuthor])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <div className="newspaper-container">
        {/* মাস্টহেড */}
        <header className="mini-masthead">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="mini-logo-title">পাইপত্র</h1>
          </a>
          <div className="mini-masthead-info">
            <span>📂 বিভাগ সমূহ</span>
          </div>
        </header>

        <hr className="double-divider" />

        <main>
          <h2 style={{ fontFamily: 'var(--font-bn-headline)', fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: 20 }}>
            📂 বিভাগ অনুযায়ী সংবাদ
          </h2>

          {/* সেকশন ট্যাব */}
          <div className="section-tabs">
            <button
              className={`section-tab ${!activeSection ? 'active' : ''}`}
              onClick={() => { setActiveSection(null); setPage(1) }}
            >
              সব
            </button>
            {sectionMap.map(s => (
              <button
                key={s.key}
                className={`section-tab ${activeSection === s.key ? 'active' : ''}`}
                onClick={() => { setActiveSection(s.key); setPage(1) }}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* লেখক ফিল্টার */}
          {authors.length > 0 && (
            <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <label style={{ fontWeight: 700, fontSize: '0.9rem' }}>✍️ লেখক:</label>
              <select
                className="parchment-input"
                style={{ maxWidth: 300 }}
                value={activeAuthor || ''}
                onChange={e => { setActiveAuthor(e.target.value || null); setPage(1) }}
              >
                <option value="">সব লেখক</option>
                {authors.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              {activeAuthor && (
                <button
                  className="spell-btn"
                  onClick={() => { setActiveAuthor(null); setPage(1) }}
                >
                  ✕ মুছুন
                </button>
              )}
            </div>
          )}

          {/* ফিল্টার স্ট্যাটাস */}
          {(activeSection || activeAuthor) && (
            <div style={{ marginBottom: 15, fontSize: '0.85rem', color: 'rgba(0,0,0,0.6)', fontStyle: 'italic' }}>
              ফলাফল: {total.toLocaleString('bn-BD')} টি সংবাদ
              {activeSection && ` • বিভাগ: ${sectionNames[activeSection]}`}
              {activeAuthor && ` • লেখক: ${activeAuthor}`}
            </div>
          )}

          {/* আর্টিকেল গ্রিড */}
          {loading ? (
            <p className="loading-state">📜 সংবাদ লোড হচ্ছে...</p>
          ) : articles.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 0', fontStyle: 'italic' }}>
              এই বিভাগে কোনো সংবাদ নেই।
            </p>
          ) : (
            <div className="section-article-grid">
              {articles.map(art => (
                <a key={art.id} href={`/article/${art.slug}`} className="bottom-card">
                  <span className="card-tag">{sectionNames[art.section] || art.section}</span>
                  <h3 className="card-title">{art.title}</h3>
                  {art.snippet && <p className="card-snippet">{art.snippet}</p>}
                  <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'rgba(0,0,0,0.5)' }}>
                    <span>✍️ {art.author}</span>
                    <span>👁 {art.viewCount.toLocaleString('bn-BD')}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--border-color)' }}>
                    {formatDate(art.createdAt)}
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* প্যাজিনেশন */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button
                className="spell-btn"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
                style={{ opacity: page <= 1 ? 0.4 : 1 }}
              >
                ◀ পূর্ববর্তী
              </button>
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                {page.toLocaleString('bn-BD')} / {totalPages.toLocaleString('bn-BD')}
              </span>
              <button
                className="spell-btn"
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
                style={{ opacity: page >= totalPages ? 0.4 : 1 }}
              >
                পরবর্তী ▶
              </button>
            </div>
          )}
        </main>

        <hr className="double-divider" />

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <a href="/" className="article-back-btn">📜 পাইপত্রে ফিরে যান</a>
        </div>

        <footer style={{ textAlign: 'center', padding: '10px 0', fontSize: '0.85rem', fontFamily: 'var(--font-bengali)', color: 'var(--border-color)', marginTop: 'auto' }}>
          <p>© ১৭৪৩-২০২৬ পাইপত্র পাবলিকেশনস লিমিটেড। সর্বস্বত্ব সংরক্ষিত।</p>
          <nav style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 15, flexWrap: 'wrap' }}>
            <a href="/" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>হোমপেজ</a>
            <a href="/archive" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>আর্কাইভ</a>
            <a href="/sections" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>বিভাগ</a>
          </nav>
        </footer>
      </div>
    </div>
  )
}