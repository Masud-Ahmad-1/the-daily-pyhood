'use client'

import { useEffect, useState, useRef } from 'react'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  isRead: boolean
  createdAt: string
}

const typeIcons: Record<string, string> = {
  comment_reply: '🪶',
  new_article: '📰',
  subscription_expiry: '🔮',
  galleon_earned: '🪙',
  system: '⚡',
}

const typeLabels: Record<string, string> = {
  comment_reply: 'মন্তব্যের জবাব',
  new_article: 'নতুন সংবাদ',
  subscription_expiry: 'সাবস্ক্রিপশন',
  galleon_earned: 'গ্যালিয়ন',
  system: 'সিস্টেম',
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'এইমাত্র'
  if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`
  if (diff < 86400) return `${Math.floor(diff / 3600)} ঘন্টা আগে`
  if (diff < 604800) return `${Math.floor(diff / 86400)} দিন আগে`
  const d = new Date(dateStr)
  const months = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলাই', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে']
  return `${d.getDate()} ${months[d.getMonth()]}`
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const initialFetchDone = useRef(false)

  const fetchNotifications = async (p: number = 1, f: string = 'all') => {
    const userId = (() => { try { const s = localStorage.getItem('pyhood_user'); return s ? JSON.parse(s).id : null } catch { return null } })()
    if (!userId) { setLoading(false); return }
    setLoading(true)
    const params = new URLSearchParams({
      userId,
      page: p.toString(),
      limit: '15',
    })
    if (f === 'unread') params.set('unreadOnly', 'true')
    try {
      const res = await fetch(`/api/notifications?${params}`)
      const data = await res.json()
      setNotifications(data.notifications || [])
      setUnreadCount(data.unreadCount || 0)
      setTotalPages(data.totalPages || 0)
      setPage(p)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchNotifications(1, filter)
    }
  }, [filter, fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] }),
      })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch {}
  }

  const markAllRead = async () => {
    const userId = (() => { try { const s = localStorage.getItem('pyhood_user'); return s ? JSON.parse(s).id : null } catch { return null } })()
    if (!userId) return
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true, userId }),
      })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {}
  }

  if (typeof window === 'undefined' || !localStorage.getItem('pyhood_user')) {
    return (
      <div className="parchment-bg min-h-screen flex items-center justify-center">
        <div style={{ textAlign: 'center' }}>
          <p className="loading-state">🔔 নোটিফিকেশন দেখতে লগইন করুন</p>
          <a href="/login" className="article-back-btn" style={{ marginTop: 15, display: 'inline-block' }}>লগইন করুন</a>
        </div>
      </div>
    )
  }

  return (
    <div className="parchment-bg min-h-screen flex flex-col">
      <div className="newspaper-container">
        <header className="mini-masthead">
          <a href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h1 className="mini-logo-title">THE DAILY PYHOOD</h1>
          </a>
        </header>

        <hr className="double-divider" />

        <section className="notif-section">
          <div className="notif-header">
            <h2 className="widget-title" style={{ fontSize: '1.3rem', marginBottom: 0 }}>
              🔔 নোটিফিকেশন
              {unreadCount > 0 && <span className="notif-badge">{unreadCount.toLocaleString('bn-BD')}</span>}
            </h2>
            {unreadCount > 0 && (
              <button className="spell-btn" onClick={markAllRead}>সব পড়া হয়েছে</button>
            )}
          </div>

          {/* ফিল্টার */}
          <div className="notif-filters">
            <button className={`spell-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              সব ({(unreadCount + (notifications.length - notifications.filter(n => !n.isRead).length)).toLocaleString('bn-BD')})
            </button>
            <button className={`spell-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
              নতুন ({unreadCount.toLocaleString('bn-BD')})
            </button>
          </div>

          {/* তালিকা */}
          {loading ? (
            <p className="loading-state" style={{ textAlign: 'center', marginTop: 30 }}>🔔 নোটিফিকেশন লোড হচ্ছে...</p>
          ) : notifications.length === 0 ? (
            <div className="notif-empty">
              <div className="notif-empty-icon">🦉</div>
              <p>কোনো নোটিফিকেশন নেই</p>
              <p className="notif-empty-hint">মন্তব্য করলে বা সাবস্ক্রিপশন নিলে নোটিফিকেশন পাবেন</p>
            </div>
          ) : (
            <div className="notif-list">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`notif-card ${!n.isRead ? 'notif-unread' : ''}`}
                  onClick={() => { if (!n.isRead) markAsRead(n.id) }}
                >
                  <div className="notif-card-icon">{typeIcons[n.type] || '⚡'}</div>
                  <div className="notif-card-content">
                    <div className="notif-card-top">
                      <span className="notif-card-type">{typeLabels[n.type] || n.type}</span>
                      <span className="notif-card-time">{timeAgo(n.createdAt)}</span>
                    </div>
                    <h3 className="notif-card-title">{n.title}</h3>
                    <p className="notif-card-message">{n.message}</p>
                    {n.link && (
                      <a href={n.link} className="notif-card-link" onClick={e => e.stopPropagation()}>
                        দেখুন →
                      </a>
                    )}
                  </div>
                  {!n.isRead && <div className="notif-unread-dot" />}
                </div>
              ))}
            </div>
          )}

          {/* প্যাজিনেশন */}
          {totalPages > 1 && (
            <div className="comment-pagination" style={{ marginTop: 20 }}>
              <button className="spell-btn" disabled={page <= 1} onClick={() => fetchNotifications(page - 1, filter)}>◀ আগের</button>
              <span>{page.toLocaleString('bn-BD')} / {totalPages.toLocaleString('bn-BD')}</span>
              <button className="spell-btn" disabled={page >= totalPages} onClick={() => fetchNotifications(page + 1, filter)}>পরের ▶</button>
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