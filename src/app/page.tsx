'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

// ===== টাইপ ডিফিনিশন =====
interface Article {
  id: string; slug: string; section: string; title: string
  subtitle: string | null; author: string; category: string
  snippet: string | null; content: string; imageUrl: string | null
  imageFilter: string | null; imageCaption: string | null; viewCount: number
}
interface Ticker { id: string; message: string }
interface Weather { id: string; location: string; emoji: string; forecast: string }
interface WantedPoster { id: string; name: string; description: string; reward: string; imageUrl: string | null }
interface Classified { id: string; heading: string; body: string }
interface Decree { id: string; title: string; decreeNumber: string; body: string; signedBy: string }
interface Letter { id: string; author: string; body: string }
interface Ad { id: string; title: string; subtitle: string | null; description: string | null; imageUrl: string | null; price: string | null; articleSlug: string | null }

interface NewspaperData {
  issue: {
    id: string; issueNumber: number; publishDate: string; priceGalleons: number
    articles: Article[]; tickers: Ticker[]; weathers: Weather[]
    wantedPosters: WantedPoster[]; classifieds: Classified[]
    decrees: Decree[]; letters: Letter[]; ads: Ad[]
  }
}

// ===== কন্টেন্ট পার্সার =====
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
  } catch { return [jsonStr] }
}

// ===== উইজার্ডিং ডেট জেনারেটর =====
function generateWizardingDate(): string {
  const now = new Date()
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার']
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর']
  const dayName = days[now.getDay()]
  const dateNum = now.getDate()
  const monthName = months[now.getMonth()]
  const year = now.getFullYear()
  let suffix = ''
  if (year % 3 === 0) suffix = ' (ড্রাগনের বছর)'
  else if (year % 3 === 1) suffix = ' (ফিনিক্সের বছর)'
  else suffix = ' (হিপোগ্রিফের বছর)'
  return `${dayName}, ${dateNum} ${monthName} ${year}${suffix}`
}

// ===== মেইন কম্পোনেন্ট =====
export default function Home() {
  const [data, setData] = useState<NewspaperData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSpell, setActiveSpell] = useState('finite')
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [secretUnlocked, setSecretUnlocked] = useState(false)

  const sparkContainer = useRef<HTMLDivElement>(null)
  const spellThrottle = useRef(false)
  const soundPage = useRef<HTMLAudioElement | null>(null)
  const soundMagic = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch('/api/newspaper')
      .then(r => { if (!r.ok) throw new Error('API error'); return r.json() })
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [])

  useEffect(() => {
    try {
      soundPage.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-84.wav')
      soundMagic.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav')
    } catch {}
  }, [])

  const createSparkle = useCallback((x: number, y: number) => {
    if (!sparkContainer.current) return
    const sparkle = document.createElement('div')
    sparkle.className = 'sparkle'
    const offset = 8
    sparkle.style.left = `${x + (Math.random() - 0.5) * offset}px`
    sparkle.style.top = `${y + (Math.random() - 0.5) * offset}px`
    const colors: Record<string, { bg: string; shadow: string }> = {
      lumos: { bg: '#fff9c4', shadow: '0 0 12px #fffde7, 0 0 22px #ffe082' },
      nox: { bg: '#b2dfdb', shadow: '0 0 12px #80cbc4, 0 0 22px #004d40' },
      confundo: { bg: '#e1bee7', shadow: '0 0 12px #ce93d8, 0 0 22px #4a148c' },
      finite: { bg: '#ffe082', shadow: '0 0 10px #ffb300, 0 0 20px #ffa000' },
    }
    const c = colors[activeSpell] || colors.finite
    sparkle.style.background = c.bg
    sparkle.style.boxShadow = c.shadow
    const size = Math.random() * 6 + 3
    sparkle.style.width = `${size}px`
    sparkle.style.height = `${size}px`
    sparkContainer.current.appendChild(sparkle)
    sparkle.addEventListener('animationend', () => sparkle.remove())
  }, [activeSpell])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      document.body.style.setProperty('--cursor-x', `${e.clientX}px`)
      document.body.style.setProperty('--cursor-y', `${e.clientY}px`)
      if (spellThrottle.current) return
      spellThrottle.current = true
      createSparkle(e.clientX, e.clientY)
      setTimeout(() => { spellThrottle.current = false }, 15)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [createSparkle])

  const playSound = (type: 'page' | 'magic') => {
    if (!soundEnabled) return
    const audio = type === 'page' ? soundPage.current : soundMagic.current
    if (audio) { audio.currentTime = 0; audio.play().catch(() => {}) }
  }

  const castSpell = (spell: string) => {
    document.body.classList.remove('lumos-active', 'nox-active', 'confundo-active')
    setActiveSpell(spell)
    if (spell !== 'finite') {
      document.body.classList.add(`${spell}-active`)
      playSound('magic')
    } else {
      playSound('page')
    }
  }

  const openArticle = (article: Article) => {
    playSound('page')
    window.open('/article/' + article.slug, '_self')
  }



  // ===== লোডিং স্টেট =====
  if (loading) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <p className="loading-state">🪄 জাদুভিত্তিক প্রতিবেদন লোড হচ্ছে...</p>
      </div>
    )
  }

  if (!data || !data.issue) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <p className="loading-state">⚠️ প্রতিবেদন পাওয়া যায়নি</p>
      </div>
    )
  }

  const { issue } = data
  const articles = Array.isArray(issue.articles) ? issue.articles : []
  const headline = articles.find(a => a.section === 'headline')
  const otherArticles = articles.filter(a => a.section !== 'headline')
  const tickers = Array.isArray(issue.tickers) ? issue.tickers : []
  const classifieds = Array.isArray(issue.classifieds) ? issue.classifieds : []
  const decrees = Array.isArray(issue.decrees) ? issue.decrees : []
  const letters = Array.isArray(issue.letters) ? issue.letters : []
  const ads = Array.isArray(issue.ads) ? issue.ads : []

  const tickerMessages = tickers.map(t => `⚡ ${t.message}`).join(' ')

  // আর্টিকেল সারিগুলো: প্রথম সারিতে ৫টি, দ্বিতীয় সারিতে বাকি
  const row1Articles = otherArticles.slice(0, 5)
  const row2Articles = otherArticles.slice(5, 10)

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">সরাসরি বিষয়বস্তুতে যান</a>
      <div className="spell-glow" aria-hidden="true" />
      <div ref={sparkContainer} className="sparkle-layer" aria-hidden="true" />

      <div className="newspaper-container">
        {/* ===== মাস্টহেড ব্লক (ক্লাসিক ব্রডশিট) ===== */}
        <div className="masthead-block">
          {/* নেভিগেশন বার — ভেতরে */}
          <nav className="top-nav-bar" aria-label="পৃষ্ঠা নেভিগেশন">
            <a href="/archive" className="nav-link-sm">আর্কাইভ</a>
            <span className="nav-divider-dot" aria-hidden="true">·</span>
            <a href="/sections" className="nav-link-sm">বিভাগ</a>
            <span className="nav-divider-dot" aria-hidden="true">·</span>
            <a href="/subscribe" className="nav-link-sm">সাবস্ক্রিপশন</a>
            <span className="nav-divider-dot" aria-hidden="true">·</span>
            <span className="nav-status" aria-live="polite">জাদুভিত্তিক সংযোগ: <span className="status-online">সক্রিয়</span></span>
          </nav>

          {/* মূল মাস্টহেড */}
          <header className="masthead-v2" role="banner" aria-label="The Daily Pyhood পত্রিকার মাস্টহেড">
            {/* বাম: সূর্যরশ্মি এমবলেম */}
            <div className="masthead-emblem" aria-hidden="true">
              <div className="emblem-outer">
                <div className="emblem-sunburst">
                  {[...Array(12)].map((_, i) => (
                    <span key={i} className="sun-ray" style={{ transform: `rotate(${i * 30}deg)` }} />
                  ))}
                </div>
                <div className="emblem-inner">
                  <span className="emblem-letter">P</span>
                </div>
              </div>
            </div>

            {/* কেন্দ্র: শিরোনাম */}
            <div className="masthead-center">
              <p className="masthead-tagline-v2">জাদুভিত্তিক বিশ্বের শীর্ষ পত্রিকা</p>
              <h1 className="logo-title-v2">THE DAILY PYHOOD</h1>
              <p className="masthead-subtitle-v2">লন্ডন থেকে প্রকাশিত</p>
            </div>

            {/* ডান: ইস্যু স্ট্যাম্প */}
            <div className="masthead-stamp" aria-hidden="true">
              <div className="stamp-box">
                <div className="stamp-number">{String(issue.issueNumber).padStart(5, '0')}</div>
                <div className="stamp-label">WIZARDING WORLD</div>
              </div>
            </div>
          </header>

          {/* অলংকারিক ডিভাইডার */}
          <div className="masthead-ornament" aria-hidden="true">
            <span className="ornament-wing left">&#10040;</span>
            <span className="ornament-line" />
            <span className="ornament-fleur">&#10053;</span>
            <span className="ornament-diamond">&#9670;</span>
            <span className="ornament-fleur">&#10053;</span>
            <span className="ornament-line" />
            <span className="ornament-wing right">&#10040;</span>
          </div>

          {/* ইস্যু তথ্য বার */}
          <div className="issue-bar-v2" aria-label="প্রকাশনা তথ্য">
            <span className="issue-date">{generateWizardingDate()}</span>
            <span className="issue-sep">|</span>
            <span className="issue-price">মূল্য: {issue.priceGalleons} গ্যালিয়ন</span>
            <span className="issue-sep">|</span>
            <span className="issue-num">নং {issue.issueNumber.toLocaleString('bn-BD')}</span>
          </div>

          {/* শীর্ষ কীওয়ার্ড বার */}
          <div className="masthead-keywords" aria-hidden="true">
            <span>জাদু</span>
            <span className="kw-sep">✦</span>
            <span>রহস্য</span>
            <span className="kw-sep">✦</span>
            <span>মন্ত্র</span>
            <span className="kw-sep">✦</span>
            <span>প্রভাব</span>
            <span className="kw-sep">✦</span>
            <span>আদেশ</span>
            <span className="kw-sep">✦</span>
            <span>রহস্যময়</span>
          </div>
        </div>

        {/* ব্রেকিং টিকার */}
        <div className="ticker-container" role="marquee" aria-label="ব্রেকিং সংবাদ">
          <div className="ticker-label">ব্রেকিং:</div>
          <div className="ticker-wrap" aria-live="off">
            <div className="ticker-content">{tickerMessages} ⚡</div>
          </div>
        </div>

        <hr className="double-divider" />

        {/* ===== পত্রিকা গ্রিড লেআউট ===== */}
        <main id="main-content">
          <div className="newspaper-content-grid">

            {/* ---- রো ১-২: প্রধান শিরোনাম (৩ col) | সাইডবার (১ col) ---- */}

            {/* কলাম ১-৩: প্রধান শিরোনাম */}
            {headline && (() => {
              const headlineParagraphs = parseContent(headline.content)
              const firstThree = headlineParagraphs.slice(0, 3)
              return (
                <div className="grid-headline">
                  <article>
                    <h2 className="main-headline" style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: 4 }}>
                      <a onClick={() => openArticle(headline)}>{headline.title}</a>
                    </h2>
                    {headline.subtitle && (
                      <h3 className="main-subheadline" style={{ textAlign: 'center', marginBottom: 10 }}>{headline.subtitle}</h3>
                    )}
                    {headline.imageUrl && (
                      <div className="photo-frame" style={{ maxWidth: '100%', margin: '0 auto 10px' }}>
                        <div className="photo-border">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={headline.imageUrl}
                            alt={headline.title}
                            className={`magical-photo ${headline.imageFilter || ''}`}
                            loading="lazy"
                            style={{ width: '100%' }}
                          />
                        </div>
                        {headline.imageCaption && <p className="photo-caption">{headline.imageCaption}</p>}
                      </div>
                    )}
                    <div className="headline-body-text" style={{ columnGap: '16px', columnRule: '1px solid rgba(74,65,42,0.15)', textAlign: 'justify', fontSize: '0.9rem', lineHeight: 1.45 }}>
                      {firstThree.map((para, i) => (
                        <p key={i} style={{ marginBottom: 8, textIndent: i === 0 ? 0 : '1.5em' }}>
                          {i === 0 && <span className="drop-cap" style={{ fontSize: '3rem', float: 'left', lineHeight: 0.85, paddingRight: 6, color: 'var(--accent-red)', fontFamily: 'var(--font-bn-headline)' }}>{para.charAt(0)}</span>}
                          {i === 0 ? para.slice(1) : para}
                        </p>
                      ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                      <a onClick={() => openArticle(headline)} className="read-more">সম্পূর্ণ প্রতিবেদন পড়ুন...</a>
                    </div>
                  </article>
                </div>
              )
            })()}

            {/* কলাম ৪: সাইডবার (ডিক্রি + চিঠি + বিজ্ঞাপন) */}
            <div className="grid-sidebar-top grid-cell">
              {/* ডিক্রি */}
              {decrees[0] && (
                <div className="sidebar-widget">
                  <div className="decree-box">
                    <div className="decree-header">{decrees[0].title}</div>
                    <div className="decree-number">{decrees[0].decreeNumber}</div>
                    <p className="decree-body" style={{ fontSize: '0.9rem' }}>&ldquo;{decrees[0].body}&rdquo;</p>
                    <div className="decree-sign">স্বাক্ষরিত: {decrees[0].signedBy}</div>
                  </div>
                </div>
              )}

              {/* পাঠকের চিঠি */}
              {letters[0] && (
                <div className="sidebar-widget">
                  <h2 className="widget-title">পাঠকের চিঠি</h2>
                  <span className="letter-author" style={{ fontSize: '0.88rem' }}>{letters[0].author}:</span>
                  <p className="letter-body" style={{ fontSize: '0.9rem' }}>&ldquo;{letters[0].body}&rdquo;</p>
                </div>
              )}

              {/* বিজ্ঞাপন */}
              {ads[0] && (
                <div className="sidebar-widget">
                  <div className="ad-container" style={{ padding: 0 }}>
                    <div className="ad-label">বিজ্ঞাপন</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <h3 className="ad-title" style={{ fontSize: '0.95rem' }}>
                        {ads[0].articleSlug ? (
                          <a onClick={() => {
                            const linked = articles.find(a => a.slug === ads[0].articleSlug)
                            if (linked) openArticle(linked)
                          }}>{ads[0].title}</a>
                        ) : ads[0].title}
                      </h3>
                      {ads[0].subtitle && <p className="ad-subtitle" style={{ fontSize: '0.85rem' }}>{ads[0].subtitle}</p>}
                      {ads[0].imageUrl && (
                        <div className="potion-img-frame" style={{ width: 60, height: 80 }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={ads[0].imageUrl} alt={ads[0].title} className="magical-photo potion-photo" loading="lazy" />
                        </div>
                      )}
                      {ads[0].price && <span className="ad-price" style={{ fontSize: '0.88rem' }}>{ads[0].price}</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ---- রো ৩: প্রথম ৪টি আর্টিকেল ---- */}
            {row1Articles.length > 0 && (
              <div className="grid-articles-row-1">
                {row1Articles.slice(0, 4).map(article => (
                  <div key={article.id} className="grid-article-card">
                    <h3 className="grid-article-title" onClick={() => openArticle(article)}>
                      {article.title}
                    </h3>
                    <p className="grid-article-snippet">{article.snippet}</p>
                    <div className="grid-article-meta">
                      {article.category} • {article.author}
                    </div>
                  </div>
                ))}
                {/* ফাঁকা কার্ড পূরণ */}
                {Array.from({ length: Math.max(0, 4 - row1Articles.length) }).map((_, i) => (
                  <div key={`empty-r1-${i}`} className="grid-article-card" />
                ))}
              </div>
            )}

            {/* ---- রো ৪: দ্বিতীয় সারি আর্টিকেল + ক্লাসিফাইড ---- */}
            <div className="grid-articles-row-2">
              {/* ক্লাসিফাইড */}
              {classifieds.length > 0 ? (
                <div className="grid-article-card">
                  <h3 className="widget-title" style={{ fontSize: '0.95rem', marginBottom: 6 }}>দৈনিক বিজ্ঞাপন</h3>
                  {classifieds.slice(0, 3).map((c, i) => (
                    <div key={c.id} style={i > 0 ? { marginTop: 6, borderTop: '1px dashed rgba(74,65,42,0.15)', paddingTop: 6 } : {}}>
                      <span className="classified-heading" style={{ fontSize: '0.88rem', fontWeight: 700 }}>{c.heading}</span>
                      <p className="classified-body" style={{ fontSize: '0.88rem', lineHeight: 1.4 }}>{c.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                row2Articles.length > 0 && (
                  <div className="grid-article-card">
                    <h3 className="grid-article-title" onClick={() => openArticle(row2Articles[0])}>
                      {row2Articles[0].title}
                    </h3>
                    <p className="grid-article-snippet">{row2Articles[0].snippet}</p>
                    <div className="grid-article-meta">{row2Articles[0].category} • {row2Articles[0].author}</div>
                  </div>
                )
              )}

              {/* বাকি আর্টিকেল */}
              {(classifieds.length > 0 ? row2Articles : row2Articles.slice(1)).map(article => (
                <div key={article.id} className="grid-article-card">
                  <h3 className="grid-article-title" onClick={() => openArticle(article)}>
                    {article.title}
                  </h3>
                  <p className="grid-article-snippet">{article.snippet}</p>
                  <div className="grid-article-meta">
                    {article.category} • {article.author}
                  </div>
                </div>
              ))}

              {/* ফাঁকা কার্ড পূরণ */}
              {Array.from({
                length: Math.max(0, 3 - (classifieds.length > 0 ? row2Articles.length : row2Articles.length - 1))
              }).map((_, i) => (
                <div key={`empty-r2-${i}`} className="grid-article-card" />
              ))}
            </div>

            {/* ---- রো ৫: ওয়ান্ড প্র্যাকটিস (ফুল উইডথ) ---- */}
            <div className="grid-full-row">
              <div className="wand-practice-inner" style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <h2 className="widget-title">ওয়ান্ড প্র্যাকটিস</h2>
                  <p style={{ fontSize: '0.9rem', marginBottom: 10 }}>
                    পত্রিকার উপর আপনার ওয়ান্ড (মাউস) ঘুরিয়ে জাদুভিত্তিক স্পার্ক দেখুন!
                  </p>
                  <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }} aria-label="মন্ত্র নিয়ন্ত্রণ">
                    {['lumos', 'nox', 'confundo', 'finite'].map(spell => (
                      <button
                        key={spell}
                        className={`spell-btn ${activeSpell === spell ? 'active' : ''}`}
                        onClick={() => castSpell(spell)}
                        aria-pressed={activeSpell === spell}
                      >
                        {spell === 'lumos' ? 'লুমোস' : spell === 'nox' ? 'নক্স' : spell === 'confundo' ? 'কনফুন্ডো' : 'ফাইনাইট'}
                      </button>
                    ))}
                  </nav>
                </div>
                <div style={{ flex: '1 1 300px' }}>
                  <button className="magic-btn" onClick={() => { setSecretUnlocked(true); playSound('magic') }}>
                    রেভেলিও (গোপন সেকশন উন্মোচন)
                  </button>
                  <div className={`secret-box ${secretUnlocked ? 'unlocked' : ''}`} style={{ marginTop: 10 }}>
                    {!secretUnlocked ? (
                      <div className="lock-icon" onClick={() => { setSecretUnlocked(true); playSound('magic') }}>
                        🔒 লক করা সেকশন
                      </div>
                    ) : (
                      <p className="secret-content">
                        <em>&ldquo;আমরা জানতে পেরেছি যে রহস্যময় বিভাগ সম্প্রতি মিশর থেকে একটি রহস্যময় জ্বলজ্বলে অর্ব অধিগ্রহণ করেছে। মন্ত্রণালয়ের কর্মকর্তারা বিবরণ দিতে অস্বীকার করছেন...&rdquo;</em>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* ===== ওয়াক্স সিল + ফুটার ===== */}
        <div className="wax-seal-wrap" style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }} aria-hidden="true">
          <div className="wax-seal">
            <div className="seal-inner">
              <span className="seal-letter">P</span>
              <span className="seal-text">PYHOOD APPROVED</span>
            </div>
          </div>
        </div>

        <hr className="double-divider" />

        <footer className="site-footer" style={{ textAlign: 'center', padding: '8px 0', fontSize: '0.85rem', fontFamily: 'var(--font-bengali)', color: 'var(--border-color)' }} role="contentinfo">
          <nav style={{ display: 'flex', justifyContent: 'center', gap: 15, marginBottom: 8, flexWrap: 'wrap' }} aria-label="ফুটার নেভিগেশন">
            <a href="/archive" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>📚 আর্কাইভ</a>
            <a href="/sections" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>📂 বিভাগ</a>
            <a href="/subscribe" style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>🔮 সাবস্ক্রিপশন</a>
          </nav>
          <p>© ১৭৪৩-২০২৬ ডেইলি পাইহুড পাবলিকেশনস লিমিটেড। সর্বস্বত্ব সংরক্ষিত।</p>
        </footer>
      </div>
    </div>
  )
}