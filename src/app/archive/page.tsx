'use client'

import { useEffect, useState } from 'react'

interface IssueItem {
  id: string
  issueNumber: number
  publishDate: string
  title: string
  priceGalleons: number
  _count: { articles: number }
}

interface IssueArticles {
  id: string
  slug: string
  title: string
  section: string
  author: string
  snippet: string | null
  viewCount: number
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

function formatBengaliDate(dateStr: string): string {
  const d = new Date(dateStr)
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function ArchivePage() {
  const [issues, setIssues] = useState<IssueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null)
  const [issueArticles, setIssueArticles] = useState<IssueArticles[]>([])
  const [loadingArticles, setLoadingArticles] = useState(false)

  useEffect(() => {
    fetch('/api/archive')
      .then(r => r.json())
      .then(d => { setIssues(d.issues || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggleIssue = async (issueId: string) => {
    if (expandedIssue === issueId) {
      setExpandedIssue(null)
      setIssueArticles([])
      return
    }
    setExpandedIssue(issueId)
    setLoadingArticles(true)
    try {
      const res = await fetch(`/api/sections?limit=50`)
      const data = await res.json()
      setIssueArticles(data.articles || [])
    } catch {
      setIssueArticles([])
    }
    setLoadingArticles(false)
  }

  if (loading) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <p className="loading-state">📚 আর্কাইভ লোড হচ্ছে...</p>
      </div>
    )
  }

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <div className="newspaper-container">
        {/* মাস্টহেড */}
        <header className="mini-masthead">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="mini-logo-title">THE DAILY PYHOOD</h1>
          </a>
          <div className="mini-masthead-info">
            <span>📰 আর্কাইভ</span>
          </div>
        </header>

        <hr className="double-divider" />

        <main>
          <h2 style={{ fontFamily: 'var(--font-bn-headline)', fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: 25 }}>
            📜 সকল প্রকাশিত সংখ্যা
          </h2>

          {issues.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px 0', fontStyle: 'italic' }}>
              এখনও কোনো প্রকাশিত সংখ্যা নেই।
            </p>
          ) : (
            <div className="archive-list">
              {issues.map(issue => (
                <div key={issue.id} className="archive-issue-card">
                  <div
                    className="archive-issue-header"
                    onClick={() => toggleIssue(issue.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && toggleIssue(issue.id)}
                  >
                    <div className="archive-issue-meta">
                      <span className="archive-issue-number">সংখ্যা: {issue.issueNumber.toLocaleString('bn-BD')}</span>
                      <span className="archive-issue-date">{formatBengaliDate(issue.publishDate)}</span>
                    </div>
                    <div className="archive-issue-stats">
                      <span>📰 {issue._count.articles} টি সংবাদ</span>
                      <span>💰 {issue.priceGalleons} গ্যালিয়ন</span>
                      <span className="archive-expand-icon">{expandedIssue === issue.id ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {expandedIssue === issue.id && (
                    <div className="archive-issue-articles">
                      {loadingArticles ? (
                        <p style={{ textAlign: 'center', padding: 15, fontStyle: 'italic' }}>লোড হচ্ছে...</p>
                      ) : issueArticles.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: 15, fontStyle: 'italic' }}>এই সংখ্যায় কোনো প্রকাশিত সংবাদ নেই।</p>
                      ) : (
                        issueArticles.slice(0, 12).map(art => (
                          <a key={art.id} href={`/article/${art.slug}`} className="archive-article-row">
                            <div className="archive-article-info">
                              <span className="card-tag">{sectionNames[art.section] || art.section}</span>
                              <h3 className="archive-article-title">{art.title}</h3>
                              <p className="archive-article-meta">
                                {art.author} • 👁 {art.viewCount.toLocaleString('bn-BD')}
                              </p>
                            </div>
                            {art.snippet && (
                              <p className="archive-article-snippet">{art.snippet}</p>
                            )}
                          </a>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
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