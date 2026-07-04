'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

export default function AdminAnalyticsPage() {
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
      <div className="flex items-center justify-center h-64">
        <p style={{ color: '#8a7a5a', fontFamily: 'var(--font-bengali)' }}>🔮 পরিসংখ্যান লোড হচ্ছে...</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: '#8a7a5a', fontFamily: 'var(--font-bengali)' }}>⚠️ পরিসংখ্যান পাওয়া যায়নি</p>
      </div>
    )
  }

  const maxSectionViews = Math.max(...(data.sectionStats.map(s => s._sum.viewCount || 0)), 1)
  const maxDailyViews = Math.max(...(data.dailyViews.map(d => d.count)), 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1f1f1e' }}>
          🔮 মন্ত্রণালয় পরিসংখ্যান দপ্তর
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b5e4f' }}>
          পত্রিকার ভিউ, ট্রেন্ডিং সংবাদ ও লেখক পরিসংখ্যান
        </p>
      </div>

      {/* স্ট্যাট কার্ড */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'মোট পত্রিকা ভিউ', value: data.totalIssueViews, icon: '📰' },
          { label: 'মোট সংবাদ ভিউ', value: data.totalArticleViews, icon: '👁' },
          { label: 'সর্বোচ্চ ভিউ', value: data.trendingArticles[0]?.viewCount || 0, icon: '🔥' },
          { label: 'সক্রিয় লেখক', value: data.topAuthors.length, icon: '✍️' },
        ].map(card => (
          <Card key={card.label} style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
            <CardContent className="p-4 sm:p-5 text-center">
              <div className="text-2xl mb-1">{card.icon}</div>
              <p className="text-2xl font-bold" style={{ color: '#8a1f1f' }}>
                {card.value.toLocaleString('bn-BD')}
              </p>
              <p className="text-xs mt-1" style={{ color: '#8a7a5a' }}>{card.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ট্রেন্ডিং আর্টিকেল */}
      <Card style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-lg" style={{ color: '#1f1f1e' }}>
            🔥 ট্রেন্ডিং সংবাদ
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  <th style={{ background: '#f5f0e6', border: '1px solid #e0d8c5', padding: '10px 14px', textAlign: 'left', fontWeight: 800, fontSize: '0.8rem' }}>শিরোনাম</th>
                  <th style={{ background: '#f5f0e6', border: '1px solid #e0d8c5', padding: '10px 14px', textAlign: 'left', fontWeight: 800, fontSize: '0.8rem' }}>লেখক</th>
                  <th style={{ background: '#f5f0e6', border: '1px solid #e0d8c5', padding: '10px 14px', textAlign: 'left', fontWeight: 800, fontSize: '0.8rem' }}>বিভাগ</th>
                  <th style={{ background: '#f5f0e6', border: '1px solid #e0d8c5', padding: '10px 14px', textAlign: 'center', fontWeight: 800, fontSize: '0.8rem' }}>ভিউ</th>
                </tr>
              </thead>
              <tbody>
                {data.trendingArticles.map((art, i) => (
                  <tr key={art.id}>
                    <td style={{ border: '1px solid #e0d8c5', padding: '10px 14px' }}>
                      <a href={`/article/${art.slug}`} style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {i + 1}. {art.title}
                      </a>
                    </td>
                    <td style={{ border: '1px solid #e0d8c5', padding: '10px 14px' }}>{art.author}</td>
                    <td style={{ border: '1px solid #e0d8c5', padding: '10px 14px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8a1f1f', letterSpacing: '1px' }}>
                        {sectionNames[art.section] || art.section}
                      </span>
                    </td>
                    <td style={{ border: '1px solid #e0d8c5', padding: '10px 14px', fontWeight: 700, textAlign: 'center' }}>
                      👁 {art.viewCount.toLocaleString('bn-BD')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* বিভাগ অনুযায়ী ভিউ */}
      <Card style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-lg" style={{ color: '#1f1f1e' }}>
            📊 বিভাগ অনুযায়ী ভিউ
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.sectionStats.map((s, i) => {
              const views = s._sum.viewCount || 0
              const pct = (views / maxSectionViews) * 100
              return (
                <div key={s.section} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 60px', alignItems: 'center', gap: 6 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {sectionNames[s.section] || s.section}
                  </div>
                  <div style={{ height: 22, background: '#f5f0e6', border: '1px solid #e0d8c5', borderRadius: 2, overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.max(pct, 2)}%`,
                        backgroundColor: barColors[i % barColors.length],
                        borderRadius: 1,
                        transition: 'width 0.8s ease',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, textAlign: 'right' }}>
                    {views.toLocaleString('bn-BD')}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* দৈনিক ভিউ ট্রেন্ড */}
      <Card style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-lg" style={{ color: '#1f1f1e' }}>
            📈 দৈনিক ভিউ ট্রেন্ড (শেষ ৭ দিন)
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8, height: 180 }}>
            {data.dailyViews.map(d => {
              const pct = (d.count / maxDailyViews) * 100
              return (
                <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 4 }}>
                    {d.count.toLocaleString('bn-BD')}
                  </div>
                  <div style={{ width: '100%', maxWidth: 50, height: 140, background: '#f5f0e6', border: '1px solid #e0d8c5', borderRadius: 2, display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: '100%',
                        height: `${Math.max(pct, 3)}%`,
                        background: '#b59449',
                        borderRadius: 1,
                        transition: 'height 0.8s ease',
                        minHeight: 4,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.7rem', marginTop: 6, fontWeight: 600, textAlign: 'center' }}>
                    {formatShortDate(d.date)}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* জনপ্রিয় লেখক */}
      <Card style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
        <CardHeader className="pb-3 pt-5 px-5">
          <CardTitle className="text-lg" style={{ color: '#1f1f1e' }}>
            ✍️ সবচেয়ে জনপ্রিয় লেখক
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.topAuthors.map((a, i) => (
              <div key={a.author} style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '12px 15px', border: '1px solid #e0d8c5', background: '#f5f0e6' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 900, color: '#b59449', minWidth: 40, textAlign: 'center' }}>
                  #{(i + 1).toLocaleString('bn-BD')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{a.author}</div>
                  <div style={{ fontSize: '0.8rem', color: '#8a7a5a', marginTop: 2 }}>
                    {a._count.id.toLocaleString('bn-BD')} টি সংবাদ • {(a._sum.viewCount || 0).toLocaleString('bn-BD')} ভিউ
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem' }}>
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📜'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}