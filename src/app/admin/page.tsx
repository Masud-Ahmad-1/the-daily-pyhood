'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Newspaper, FileText, Eye, CheckCircle, XCircle, Plus, ArrowRight } from 'lucide-react'

interface StatData {
  totalIssues: number
  publishedIssues: number
  unpublishedIssues: number
  totalArticles: number
  publishedArticles: number
  totalViews: number
}

interface RecentArticle {
  id: string
  title: string
  author: string
  section: string
  isPublished: boolean
  viewCount: number
  createdAt: string
}

const sectionNames: Record<string, string> = {
  headline: 'শিরোনাম',
  lead: 'প্রধান',
  ministry: 'মন্ত্রণালয়',
  sports: 'খেলাধুলা',
  world: 'বিশ্ব',
  security: 'নিরাপত্তা',
  gossip: 'গুজব',
  economy: 'অর্থনীতি',
  entertainment: 'বিনোদন',
  local: 'স্থানীয়',
  mystery: 'রহস্য',
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatData | null>(null)
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/newspaper').then((r) => r.json()),
      fetch('/api/admin/articles?page=1&limit=5').then((r) => r.json()),
    ])
      .then(([newspaperData, articlesData]) => {
        const issue = newspaperData.issue
        setStats({
          totalIssues: 1,
          publishedIssues: issue ? 1 : 0,
          unpublishedIssues: issue ? 0 : 1,
          totalArticles: issue?.articles?.length || 0,
          publishedArticles: issue?.articles?.filter((a: { isPublished: boolean }) => a.isPublished).length || 0,
          totalViews: issue?.articles?.reduce((sum: number, a: { viewCount: number }) => sum + a.viewCount, 0) || 0,
        })
        setRecentArticles(articlesData.data || articlesData.articles || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label: 'মোট সংখ্যা', value: stats?.totalIssues ?? 0, icon: Newspaper, color: '#b59449' },
    { label: 'মোট আর্টিকেল', value: stats?.totalArticles ?? 0, icon: FileText, color: '#4a7c59' },
    { label: 'মোট ভিউ', value: stats?.totalViews ?? 0, icon: Eye, color: '#5a6e8a' },
    { label: 'প্রকাশিত', value: stats?.publishedArticles ?? 0, icon: CheckCircle, color: '#2d7d46' },
    { label: 'অপ্রকাশিত', value: stats?.unpublishedIssues ?? 0, icon: XCircle, color: '#8a1f1f' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: '#8a7a5a', fontFamily: 'var(--font-bengali)' }}>✨ তথ্য লোড হচ্ছে...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1f1f1e' }}>
          স্বাগতম, সম্পাদক 🪄
        </h1>
        <p className="text-sm mt-1" style={{ color: '#6b5e4f' }}>
          পাইপত্র পত্রিকার অ্যাডমিন প্যানেল
        </p>
      </div>

      {/* পরিসংখ্যি কার্ড */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card
              key={card.label}
              style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}
            >
              <CardContent className="p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
                <div
                  className="p-2.5 rounded-lg"
                  style={{ background: `${card.color}15` }}
                >
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: '#1f1f1e' }}>
                    {card.value.toLocaleString('bn-BD')}
                  </p>
                  <p className="text-xs" style={{ color: '#8a7a5a' }}>
                    {card.label}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* দ্রুত অ্যাকশন */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => router.push('/admin/issues')}
          style={{ background: '#b59449', color: '#fffdf7' }}
        >
          <Plus size={16} className="mr-2" />
          নতুন সংখ্যা তৈরি
        </Button>
        <Button
          onClick={() => router.push('/admin/articles')}
          variant="outline"
          style={{ borderColor: '#b59449', color: '#b59449' }}
        >
          <FileText size={16} className="mr-2" />
          নতুন আর্টিকেল
        </Button>
        <Button
          onClick={() => router.push('/admin/content?tab=tickers')}
          variant="outline"
          style={{ borderColor: '#4a7c59', color: '#4a7c59' }}
        >
          <Plus size={16} className="mr-2" />
          নতুন কন্টেন্ট
        </Button>
      </div>

      {/* সাম্প্রতিক আর্টিকেল */}
      <Card style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
        <CardHeader className="pb-3 pt-5 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg" style={{ color: '#1f1f1e' }}>
              সাম্প্রতিক আর্টিকেল
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/admin/articles')}
              style={{ color: '#b59449' }}
            >
              সব দেখুন <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          {recentArticles.length === 0 ? (
            <p className="text-center py-8" style={{ color: '#8a7a5a' }}>
              কোনো আর্টিকেল নেই
            </p>
          ) : (
            <div className="space-y-2">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg"
                  style={{ background: '#f5f0e6' }}
                >
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-sm truncate"
                      style={{ color: '#1f1f1e' }}
                    >
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: '#8a7a5a' }}>
                        {article.author}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: '#b59449', color: '#b59449' }}
                      >
                        {sectionNames[article.section] || article.section}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span className="text-xs" style={{ color: '#8a7a5a' }}>
                      👁 {article.viewCount.toLocaleString('bn-BD')}
                    </span>
                    <Badge
                      style={{
                        background: article.isPublished ? '#2d7d46' : '#8a1f1f',
                        color: '#fff',
                      }}
                    >
                      {article.isPublished ? 'প্রকাশিত' : 'অপ্রকাশিত'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}