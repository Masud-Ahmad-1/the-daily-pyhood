'use client'

import { useEffect, useState } from 'react'

interface SearchResult {
  id: string
  slug: string
  title: string
  subtitle: string | null
  author: string
  section: string
  category: string
  snippet: string
  imageUrl: string | null
  viewCount: number
  issueNumber: number
  publishDate: string
  createdAt: string
}

const sectionNames: Record<string, string> = {
  headline: 'শিরোনাম', lead: 'প্রধান', ministry: 'মন্ত্রণালয়',
  sports: 'ক্রীড়া', world: 'বিশ্ব', security: 'নিরাপত্তা',
  gossip: 'গুজব', economy: 'অর্থনীতি', entertainment: 'বিনোদন',
  local: 'স্থানীয়', mystery: 'রহস্য',
}

const sectionList = Object.entries(sectionNames)

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [section, setSection] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTime, setSearchTime] = useState(0)

  const doSearch = async (p: number = 1) => {
    const q = query.trim()
    if (q.length < 2) return
    setLoading(true)
    setSearched(true)
    const start = performance.now()
    const params = new URLSearchParams({ q, page: p.toString(), limit: '12' })
    if (section) params.set('section', section)
    try {
      const res = await fetch(`/api/search?${params}`)
      const data = await res.json()
      setResults(data.results || [])
      setTotal(data.total || 0)
      setTotalPages(data.totalPages || 0)
      setPage(p)
      setSearchTime(Math.round(performance.now() - start))
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) doSearch(1)
    }, 500)
    return () => clearTimeout(timer)
  }, [query, section])

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <div className="newspaper-container">
        {/* ছোট মাস্টহেড */}
        <header className="mini-masthead">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="mini-logo-title">THE DAILY PYHOOD</h1>
          </a>
        </header>

        <hr className="double-divider" />

        <section className="search-section">
          <h2 className="widget-title" style={{ fontSize: '1.4rem', textAlign: 'center', marginBottom: 20 }}>
            🔍 জাদুভিত্তিক সার্চ
          </h2>

          {/* সার্চ বার */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input parchment-input"
              placeholder="সংবাদ, লেখক, বিষয় খুঁজুন..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button className="search-clear" onClick={() => { setQuery(''); setResults([]); setSearched(false) }}>✕</button>
            )}
          </div>

          {/* সেকশন ফিল্টার */}
          <div className="search-filters">
            <button
              className={`spell-btn ${!section ? 'active' : ''}`}
              onClick={() => setSection('')}
            >সব বিভাগ</button>
            {sectionList.map(([key, name]) => (
              <button
                key={key}
                className={`spell-btn ${section === key ? 'active' : ''}`}
                onClick={() => setSection(section === key ? '' : key)}
              >{name}</button>
            ))}
          </div>

          {/* ফলাফল */}
          {loading && <p className="loading-state" style={{ textAlign: 'center', marginTop: 30 }}>🔍 জাদুভিত্তিক আর্কাইভ খোঁজা হচ্ছে...</p>}

          {!loading && searched && (
            <div className="search-results-info">
              <span>&ldquo;{query}&rdquo; — {total.toLocaleString('bn-BD')}টি ফলাফল</span>
              {searchTime > 0 && <span className="search-time">{searchTime}ms</span>}
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="search-results-grid">
              {results.map(r => (
                <a key={r.id} href={`/article/${r.slug}`} className="search-result-card">
                  {r.imageUrl && (
                    <div className="search-result-img">
                      <img src={r.imageUrl} alt={r.title} className="magical-photo sepia-filter" loading="lazy" />
                    </div>
                  )}
                  <div className="search-result-content">
                    <div className="search-result-meta">
                      <span className="card-tag">{sectionNames[r.section] || r.section}</span>
                      <span className="search-result-issue">নং {r.issueNumber.toLocaleString('bn-BD')}</span>
                    </div>
                    <h3 className="search-result-title">{r.title}</h3>
                    {r.subtitle && <p className="search-result-subtitle">{r.subtitle}</p>}
                    <p className="search-result-snippet">{r.snippet}</p>
                    <div className="search-result-footer">
                      <span>✍️ {r.author}</span>
                      <span>👁 {r.viewCount.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="search-no-results">
              <div className="search-no-icon">🪄</div>
              <p>কোনো ফলাফল পাওয়া যায়নি</p>
              <p className="search-no-hint">ভিন্ন কিছু শব্দ দিয়ে চেষ্টা করুন</p>
            </div>
          )}

          {/* প্যাজিনেশন */}
          {!loading && totalPages > 1 && (
            <div className="search-pagination">
              <button className="spell-btn" disabled={page <= 1} onClick={() => doSearch(page - 1)}>◀ আগের</button>
              <span>{page.toLocaleString('bn-BD')} / {totalPages.toLocaleString('bn-BD')}</span>
              <button className="spell-btn" disabled={page >= totalPages} onClick={() => doSearch(page + 1)}>পরের ▶</button>
            </div>
          )}

          {/* জনপ্রিয় সার্চ */}
          {!searched && (
            <div className="popular-searches">
              <h3 className="widget-title" style={{ fontSize: '1rem', marginBottom: 12 }}>🔥 জনপ্রিয় সার্চ</h3>
              <div className="popular-tags">
                {['হগওয়ার্টস', 'মন্ত্রণালয়', 'কুইডিচ', 'ডার্ক আর্টস', 'আজকাবান', 'ড্রাগন', 'ফিনিক্স', 'প্রফেসর ডাম্বলডোর'].map(tag => (
                  <button key={tag} className="popular-tag" onClick={() => setQuery(tag)}>{tag}</button>
                ))}
              </div>
            </div>
          )}
        </section>

        <hr className="double-divider" />

        <footer style={{ textAlign: 'center', padding: '10px 0', fontSize: '0.85rem', fontFamily: 'var(--font-bengali)', color: 'var(--border-color)' }}>
          <p>© ১৭৪৩-২০২৬ ডেইলি পাইহুড পাবলিকেশনস লিমিটেড। সর্বস্বত্ব সংরক্ষিত।</p>
        </footer>
      </div>
    </div>
  )
}