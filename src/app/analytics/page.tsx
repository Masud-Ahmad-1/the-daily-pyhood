'use client'

import { useEffect, useState } from 'react'

interface AnalyticsData {
  totalIssueViews: number
  totalArticleViews: number
  trendingArticles: {
    id: string
    slug: string
    title: string
    section: string
    author: string
    viewCount: number
  }[]
  sectionStats: {
    section: string
    _sum: { viewCount: number | null }
    _count: { viewCount: number }
  }[]
  dailyViews: { date: string; count: number }[]
  topAuthors: {
    author: string
    _sum: { viewCount: number | null }
    _count: { id: number }
  }[]
}

const sectionNames: Record<string, string> = {
  headline: 'শিরোনাম',
  lead: 'প্রধান',
  ministry: 'মন্ত্রণালয়',
  sports: 'ক্রীড়া',
  world: 'বিশ্ব',
  security: 'নিরাপত্তা',
  gossip: 'গুজব',
  economy: 'অর্থনীতি',
  entertainment: 'বিনোদন',
  local: 'স্থানীয়',
  mystery: 'রহস্য',
}

const barColors = [
  '#8a1f1f', '#b59449', '#4a6741', '#3d5a80', '#6b4c8a',
  '#8a6e3e', '#2c6e49', '#9c4a3e', '#5a5a8a', '#7a5c3e', '#3e6e7a',
]

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি']
  return `${days[d.getDay()]}, ${d.getDate()}`
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <p className="loading-state">🔮 পরিসংখ্যান লোড হচ্ছে...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <p className="loading-state">⚠️ পরিসংখ্যান পাওয়া যায়নি</p>
      </div>
    )
  }

  const maxSectionViews = Math.max(...(data.sectionStats.map(s => s._sum.viewCount || 0)), 1)
  const maxDailyViews = Math.max(...(data.dailyViews.map(d => d.count)), 1)

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <div className="newspaper-container">
        {/* মাস্টহেড */}
        <header className="mini-masthead">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="mini-logo-title">THE DAILY PYHOOD</h1>
          </a>
          <div className="mini-masthead-info">
            <span>🔮 পরিসংখ্যান</span>
          </div>
        </header>

        <hr className="double-divider" />

        <main>
          <h2 style={{ fontFamily: 'var(--font-bn-headline)', fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: 25 }}>
            🔮 মন্ত্রণালয় পরিসংখ্যান দপ্তর
          </h2>

          {/* স্ট্যাট কার্ড */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📰</div>
              <div className="stat-value">{data.totalIssueViews.toLocaleString('bn-BD')}</div>
              <div className="stat-label">মোট পত্রিকা ভিউ</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👁</div>
              <div className="stat-value">{data.totalArticleViews.toLocaleString('bn-BD')}</div>
              <div className="stat-label">মোট সংবাদ ভিউ</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">{data.trendingArticles[0]?.viewCount.toLocaleString('bn-BD') || '০'}</div>
              <div className="stat-label">সর্বোচ্চ ভিউ</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✍️</div>
              <div className="stat-value">{data.topAuthors.length.toLocaleString('bn-BD')}</div>
              <div className="stat-label">সক্রিয় লেখক</div>
            </div>
          </div>

          <hr className="double-divider" />

          {/* ট্রেন্ডিং আর্টিকেল */}
          <section style={{ marginBottom: 30 }}>
            <h2 className="widget-title" style={{ fontSize: '1.2rem' }}>🔥 ট্রেন্ডিং সংবাদ</h2>
            <div style={{ overflowX: 'auto' }}>
              <table className="analytics-table">
                <thead>
                  <tr>
                    <th>শিরোনাম</th>
                    <th>লেখক</th>
                    <th>বিভাগ</th>
                    <th>ভিউ</th>
                  </tr>
                </thead>
                <tbody>
                  {data.trendingArticles.map((art, i) => (
                    <tr key={art.id}>
                      <td>
                        <a href={`/article/${art.slug}`} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                          {i + 1}. {art.title}
                        </a>
                      </td>
                      <td>{art.author}</td>
                      <td><span className="card-tag">{sectionNames[art.section] || art.section}</span></td>
                      <td style={{ fontWeight: 700, textAlign: 'center' }}>👁 {art.viewCount.toLocaleString('bn-BD')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* সেকশন অনুযায়ী বার চার্ট */}
          <section style={{ marginBottom: 30 }}>
            <h2 className="widget-title" style={{ fontSize: '1.2rem' }}>📊 বিভাগ অনুযায়ী ভিউ</h2>
            <div className="bar-chart">
              {data.sectionStats.map((s, i) => {
                const views = s._sum.viewCount || 0
                const pct = (views / maxSectionViews) * 100
                return (
                  <div key={s.section} className="bar-row">
                    <div className="bar-label">{sectionNames[s.section] || s.section}</div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${Math.max(pct, 2)}%`,
                          backgroundColor: barColors[i % barColors.length],
                        }}
                      />
                    </div>
                    <div className="bar-value">{views.toLocaleString('bn-BD')}</div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* দৈনিক ভিউ ট্রেন্ড */}
          <section style={{ marginBottom: 30 }}>
            <h2 className="widget-title" style={{ fontSize: '1.2rem' }}>📈 দৈনিক ভিউ ট্রেন্ড (শেষ ৭ দিন)</h2>
            <div className="daily-chart">
              {data.dailyViews.map((d, i) => {
                const pct = (d.count / maxDailyViews) * 100
                return (
                  <div key={d.date} className="daily-bar-col">
                    <div className="daily-bar-value">{d.count.toLocaleString('bn-BD')}</div>
                    <div className="daily-bar-track">
                      <div
                        className="daily-bar-fill"
                        style={{ height: `${Math.max(pct, 3)}%` }}
                      />
                    </div>
                    <div className="daily-bar-label">{formatShortDate(d.date)}</div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* জনপ্রিয় লেখক */}
          <section style={{ marginBottom: 30 }}>
            <h2 className="widget-title" style={{ fontSize: '1.2rem' }}>✍️ সবচেয়ে জনপ্রিয় লেখক</h2>
            <div className="author-list">
              {data.topAuthors.map((a, i) => (
                <div key={a.author} className="author-item">
                  <div className="author-rank">#{(i + 1).toLocaleString('bn-BD')}</div>
                  <div className="author-info">
                    <div className="author-name">{a.author}</div>
                    <div className="author-stats">
                      {a._count.id.toLocaleString('bn-BD')} টি সংবাদ • {(a._sum.viewCount || 0).toLocaleString('bn-BD')} ভিউ
                    </div>
                  </div>
                  <div className="author-badge">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📜'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>

        <hr className="double-divider" />

        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <a href="/" className="article-back-btn">📜 ডেইলি পাইহুডে ফিরে যান</a>
        </div>

        <footer style={{ textAlign: 'center', padding: '10px 0', fontSize: '0.85rem', fontFamily: 'var(--font-bengali)', color: 'var(--border-color)', marginTop: 'auto' }}>
          <p>© ১৭৪৩-২০২৬ ডেইলি পাইহুড পাবলিকেশনস লিমিটেড। সর্বস্বত্ব সংরক্ষিত।</p>
          <nav style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 15 }}>
            <a href="/" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>হোমপেজ</a>
            <a href="/archive" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>আর্কাইভ</a>
            <a href="/sections" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>বিভাগ</a>
            <a href="/analytics" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>পরিসংখ্যান</a>
          </nav>
        </footer>
      </div>
    </div>
  )
}