'use client'

import { useEffect, useState } from 'react'

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
  try {
    const d = new Date(dateStr)
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  } catch {
    return dateStr
  }
}

function parseContent(jsonStr: string): string[] {
  if (!jsonStr) return ['']
  try {
    const parsed = JSON.parse(jsonStr)
    if (!Array.isArray(parsed)) return [String(parsed)]
    return parsed.map((item: unknown) => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && 'text' in item) return String((item as Record<string, unknown>).text)
      if (item && typeof item === 'object' && 'content' in item) return String((item as Record<string, unknown>).content)
      return String(item)
    })
  } catch {
    return [jsonStr]
  }
}

function safeNum(val: unknown): number {
  return typeof val === 'number' ? val : 0
}

function safeStr(val: unknown): string {
  return typeof val === 'string' ? val : ''
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [html, setHtml] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    params.then(p => {
      const slug = p.slug
      fetch(`/api/articles/${slug}`)
        .then(r => {
          if (!r.ok) throw new Error('আর্টিকেল পাওয়া যায়নি')
          return r.json()
        })
        .then(d => {
          if (cancelled) return
          try {
            const article = d.article || {}
            const issue = d.issue || {}
            const relatedArticles = d.relatedArticles || []
            const paragraphs = parseContent(article.content || '""')
            const vc = safeNum(article.viewCount)
            const inum = safeNum(issue.issueNumber)
            const dateStr = safeStr(issue.publishDate)
            const dateDisplay = dateStr ? formatBengaliDate(dateStr) : ''
            const sectionLabel = sectionNames[article.section] || article.section || ''

            let relatedHtml = ''
            if (relatedArticles.length > 0) {
              const cards = relatedArticles.map((ra: Record<string, unknown>) => {
                const rSlug = safeStr(ra.slug)
                const rTitle = safeStr(ra.title)
                const rAuthor = safeStr(ra.author)
                const rSection = sectionNames[safeStr(ra.section)] || safeStr(ra.section)
                const rSnippet = safeStr(ra.snippet)
                const rViews = safeNum(ra.viewCount)
                return `<a href="/article/${rSlug}" class="related-card">
                  <span class="card-tag">${rSection}</span>
                  <h3 class="card-title">${rTitle}</h3>
                  <p style="font-size:0.82rem;color:rgba(0,0,0,0.6);margin-bottom:6px">${rAuthor}</p>
                  ${rSnippet ? `<p class="card-snippet">${rSnippet}</p>` : ''}
                  <p style="font-size:0.75rem;color:var(--accent-gold);margin-top:8px;font-weight:700">👁 ${rViews.toLocaleString('bn-BD')}</p>
                </a>`
              }).join('')
              relatedHtml = `
                <section>
                  <h2 class="widget-title" style="font-size:1.2rem;text-align:center">📰 এই সংখ্যার অন্যান্য সংবাদ</h2>
                  <div class="related-grid">${cards}</div>
                </section>
                <hr class="double-divider" />`
            }

            let imageHtml = ''
            if (article.imageUrl) {
              const imgFilter = article.imageFilter || 'sepia-filter'
              const caption = article.imageCaption ? `<p class="photo-caption">${article.imageCaption}</p>` : ''
              imageHtml = `
                <div class="photo-frame" style="max-width:450px;margin:15px auto">
                  <div class="photo-border">
                    <img src="${article.imageUrl}" alt="${article.title || ''}" class="magical-photo ${imgFilter}" loading="lazy" />
                  </div>
                  ${caption}
                </div>`
            }

            const bodyHtml = paragraphs.map((para: string, i: number) => {
              if (!para) return '<p></p>'
              if (i === 0 && para.length > 0) {
                return `<p class="lead-para"><span class="drop-cap">${para.charAt(0)}</span>${para.slice(1)}</p>`
              }
              return `<p>${para}</p>`
            }).join('')

            const subtitle = article.subtitle ? `<p class="full-subtitle">${article.subtitle}</p>` : ''

            const fullHtml = `
              <header class="mini-masthead">
                <a href="/" style="text-decoration:none;color:inherit">
                  <h1 class="mini-logo-title">THE DAILY PYHOOD</h1>
                </a>
                <div class="mini-masthead-info">
                  <span>${dateDisplay}</span>
                  <span>•</span>
                  <span>নং ${inum.toLocaleString('bn-BD')}</span>
                </div>
              </header>
              <hr class="double-divider" />
              <article>
                <div style="display:flex;justify-content:space-between;margin-bottom:12px;border-bottom:1px dashed rgba(74,65,42,0.25);padding-bottom:8px;font-size:0.85rem;font-weight:700;letter-spacing:1px;flex-wrap:wrap;gap:4px">
                  <span style="color:var(--accent-red)">${sectionLabel} • ${article.category || 'সংবাদ'}</span>
                  <span class="article-view-count">👁 ${vc.toLocaleString('bn-BD')} ভিউ</span>
                </div>
                <h1 class="full-title">${article.title || ''}</h1>
                ${subtitle}
                <p class="article-author">লেখক: ${article.author || ''}</p>
                <hr class="double-divider" />
                ${imageHtml}
                <div class="article-body-text">${bodyHtml}</div>
              </article>
              <hr class="double-divider" />
              <div style="text-align:center;margin:25px 0">
                <a href="/" class="article-back-btn">📜 ডেইলি পাইহুডে ফিরে যান</a>
              </div>
              ${relatedHtml}
              <footer style="text-align:center;padding:10px 0;font-size:0.85rem;font-family:var(--font-bengali);color:var(--border-color);margin-top:auto">
                <p>© ১৭৪৩-২০২৬ ডেইলি পাইহুড পাবলিকেশনস লিমিটেড। সর্বস্বত্ব সংরক্ষিত।</p>
                <nav style="margin-top:8px;display:flex;justify-content:center;gap:15px;flex-wrap:wrap">
                  <a href="/" style="color:var(--accent-gold);font-weight:700">হোমপেজ</a>
                  <a href="/archive" style="color:var(--accent-gold);font-weight:700">আর্কাইভ</a>
                  <a href="/sections" style="color:var(--accent-gold);font-weight:700">বিভাগ</a>
                </nav>
              </footer>`
            setHtml(fullHtml)
          } catch (renderErr) {
            setHtml(`<div style="text-align:center;padding:40px 20px">
              <div style="font-size:3rem">🪄</div>
              <h2 style="font-family:var(--font-display);color:var(--accent-red);margin:15px 0">জাদুভিত্তিক ত্রুটি</h2>
              <p style="color:var(--border-color);margin-bottom:20px">প্রতিবেদন প্রদর্শনে সমস্যা হয়েছে।</p>
              <a href="/" class="article-back-btn">📜 ডেইলি পাইহুডে ফিরে যান</a>
            </div>`)
          }
          setLoading(false)
        })
        .catch(e => {
          if (cancelled) return
          const isSub = (e.message || '').toLowerCase().includes('subscri')
          setHtml(`<div style="text-align:center;padding:40px 20px">
            <div style="font-size:3rem">${isSub ? '🔮' : '🪄'}</div>
            <h2 style="font-family:var(--font-display);color:var(--accent-red);margin:15px 0">${isSub ? 'সাবস্ক্রিপশন সমস্যা' : 'ত্রুটি'}</h2>
            <p style="color:var(--border-color);margin-bottom:20px">${isSub ? 'এই প্রতিবেদন পড়তে সাবস্ক্রিপশন প্রয়োজন।' : e.message || 'প্রতিবেদন পাওয়া যায়নি'}</p>
            ${isSub ? '<a href="/subscribe" class="article-back-btn" style="background:var(--accent-gold);color:#000;border-color:var(--accent-gold)">🔮 সাবস্ক্রিপশন পেজে যান</a><br/><br/>' : ''}
            <a href="/" class="article-back-btn">📜 ডেইলি পাইহুডে ফিরে যান</a>
          </div>`)
          setLoading(false)
        })
    })
    return () => { cancelled = true }
  }, [params])

  if (loading) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <p className="loading-state">📜 প্রতিবেদন লোড হচ্ছে...</p>
      </div>
    )
  }

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <div className="newspaper-container">
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  )
}