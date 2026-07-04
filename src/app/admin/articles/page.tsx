'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

interface Article {
  id: string
  slug: string
  title: string
  subtitle: string | null
  author: string
  section: string
  category: string
  snippet: string | null
  content: string
  imageUrl: string | null
  imageCaption: string | null
  isPublished: boolean
  sortOrder: number
  viewCount: number
  createdAt: string
  issue: { issueNumber: number; title: string }
}

interface Issue {
  id: string
  issueNumber: number
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

const emptyForm = {
  issueId: '',
  section: 'headline',
  title: '',
  subtitle: '',
  author: 'রিটা স্কিটার',
  category: 'সংবাদ',
  snippet: '',
  content: '',
  imageUrl: '',
  imageCaption: '',
  isPublished: false,
  sortOrder: 0,
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterIssue, setFilterIssue] = useState('all')
  const [filterSection, setFilterSection] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (filterIssue !== 'all') params.set('issueId', filterIssue)
    if (filterSection !== 'all') params.set('section', filterSection)
    fetch(`/api/admin/articles?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setArticles(data.articles || [])
          setTotalPages(data.totalPages || 1)
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [page, filterIssue, filterSection])

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/issues?limit=100')
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setIssues(data.issues || []) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const refreshArticles = () => {
    const params = new URLSearchParams({ page: String(page), limit: '20' })
    if (filterIssue !== 'all') params.set('issueId', filterIssue)
    if (filterSection !== 'all') params.set('section', filterSection)
    fetch(`/api/admin/articles?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || [])
        setTotalPages(data.totalPages || 1)
      })
      .catch(() => {})
  }

  const handleCreate = () => {
    setEditingId(null)
    setForm({ ...emptyForm, issueId: issues[0]?.id || '' })
    setDialogOpen(true)
  }

  const handleEdit = (article: Article) => {
    setEditingId(article.id)
    // content হলো JSON array — তাকে আবার প্যারাগ্রাফে রূপান্তর
    let contentText = ''
    try {
      const parsed = JSON.parse(article.content)
      if (Array.isArray(parsed)) {
        contentText = parsed.join('\n')
      }
    } catch {
      contentText = article.content
    }

    setForm({
      issueId: '', // প্রয়োজনে নির্বাচন করতে হবে
      section: article.section,
      title: article.title,
      subtitle: article.subtitle || '',
      author: article.author,
      category: article.category,
      snippet: article.snippet || '',
      content: contentText,
      imageUrl: article.imageUrl || '',
      imageCaption: article.imageCaption || '',
      isPublished: article.isPublished,
      sortOrder: article.sortOrder,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.issueId) return
    setSaving(true)
    try {
      // প্যারাগ্রাফ থেকে JSON array তৈরি
      const contentArray = JSON.stringify(form.content.split('\n').filter(p => p.trim()))

      const payload = {
        ...form,
        content: contentArray,
        subtitle: form.subtitle || null,
        snippet: form.snippet || null,
        imageUrl: form.imageUrl || null,
        imageCaption: form.imageCaption || null,
      }

      if (editingId) {
        await fetch(`/api/admin/articles/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch('/api/admin/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      setDialogOpen(false)
      refreshArticles()
    } catch {}
    setSaving(false)
  }

  const handleTogglePublished = async (article: Article) => {
    try {
      await fetch(`/api/admin/articles/${article.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !article.isPublished }),
      })
      refreshArticles()
    } catch {}
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await fetch(`/api/admin/articles/${deletingId}`, { method: 'DELETE' })
      setDeleteOpen(false)
      setDeletingId(null)
      refreshArticles()
    } catch {}
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1f1f1e' }}>আর্টিকেল পরিচালনা</h1>
          <p className="text-sm" style={{ color: '#8a7a5a' }}>সকল সংবাদ ও আর্টিকেল পরিচালনা করুন</p>
        </div>
        <Button onClick={handleCreate} style={{ background: '#b59449', color: '#fffdf7' }}>
          <Plus size={16} className="mr-2" /> নতুন আর্টিকেল
        </Button>
      </div>

      {/* ফিল্টার */}
      <div className="flex flex-wrap gap-3 sm:gap-4">
        <div className="flex-1 min-w-[180px]">
          <Select value={filterIssue} onValueChange={(v) => { setFilterIssue(v); setPage(1) }}>
            <SelectTrigger style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
              <SelectValue placeholder="সকল সংখ্যা" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল সংখ্যা</SelectItem>
              {issues.map((i) => (
                <SelectItem key={i.id} value={i.id}>নং {i.issueNumber.toLocaleString('bn-BD')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <Select value={filterSection} onValueChange={(v) => { setFilterSection(v); setPage(1) }}>
            <SelectTrigger style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
              <SelectValue placeholder="সকল বিভাগ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">সকল বিভাগ</SelectItem>
              {Object.entries(sectionNames).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ borderBottom: '2px solid #e0d8c5' }}>
                <TableHead style={{ color: '#4a412a' }}>শিরোনাম</TableHead>
                <TableHead className="hidden md:table-cell" style={{ color: '#4a412a' }}>বিভাগ</TableHead>
                <TableHead className="hidden md:table-cell" style={{ color: '#4a412a' }}>লেখক</TableHead>
                <TableHead className="hidden lg:table-cell" style={{ color: '#4a412a' }}>ভিউ</TableHead>
                <TableHead style={{ color: '#4a412a' }}>অবস্থা</TableHead>
                <TableHead className="text-right" style={{ color: '#4a412a' }}>কার্যক্রম</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8" style={{ color: '#8a7a5a' }}>
                    লোড হচ্ছে...
                  </TableCell>
                </TableRow>
              ) : articles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8" style={{ color: '#8a7a5a' }}>
                    কোনো আর্টিকেল নেই
                  </TableCell>
                </TableRow>
              ) : (
                articles.map((article) => (
                  <TableRow key={article.id} style={{ borderBottom: '1px solid #e0d8c5' }}>
                    <TableCell>
                      <div>
                        <p className="font-semibold text-sm truncate max-w-[200px]" style={{ color: '#1f1f1e' }}>
                          {article.title}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#8a7a5a' }}>
                          সংখ্যা {article.issue.issueNumber.toLocaleString('bn-BD')}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline" style={{ borderColor: '#b59449', color: '#b59449' }}>
                        {sectionNames[article.section] || article.section}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm" style={{ color: '#4a412a' }}>
                      {article.author}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm" style={{ color: '#4a412a' }}>
                      {article.viewCount.toLocaleString('bn-BD')}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={article.isPublished}
                        onCheckedChange={() => handleTogglePublished(article)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(article)} style={{ color: '#b59449' }}>
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setDeletingId(article.id); setDeleteOpen(true) }}
                          style={{ color: '#8a1f1f' }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* প্যাজিনেশন */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4" style={{ borderTop: '1px solid #e0d8c5' }}>
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ borderColor: '#b59449', color: '#b59449' }}>
              <ChevronLeft size={16} className="mr-1" /> পূর্ববর্তী
            </Button>
            <span className="text-sm" style={{ color: '#8a7a5a' }}>
              পৃষ্ঠা {page} / {totalPages}
            </span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ borderColor: '#b59449', color: '#b59449' }}>
              পরবর্তী <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        )}
      </Card>

      {/* তৈরি/সম্পাদনা ডায়ালগ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-6" style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#1f1f1e' }}>
              {editingId ? 'আর্টিকেল সম্পাদনা' : 'নতুন আর্টিকেল তৈরি'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: '#4a412a' }}>সংখ্যা *</Label>
                <Select value={form.issueId} onValueChange={(v) => setForm({ ...form, issueId: v })}>
                  <SelectTrigger style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}>
                    <SelectValue placeholder="সংখ্যা নির্বাচন" />
                  </SelectTrigger>
                  <SelectContent>
                    {issues.map((i) => (
                      <SelectItem key={i.id} value={i.id}>নং {i.issueNumber.toLocaleString('bn-BD')}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#4a412a' }}>বিভাগ *</Label>
                <Select value={form.section} onValueChange={(v) => setForm({ ...form, section: v })}>
                  <SelectTrigger style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(sectionNames).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#4a412a' }}>শিরোনাম *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="আর্টিকেলের শিরোনাম"
                style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#4a412a' }}>উপশিরোনাম</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="ঐচ্ছিক উপশিরোনাম"
                style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: '#4a412a' }}>লেখক</Label>
                <Input
                  value={form.author}
                  onChange={(e) => setForm({ ...form, author: e.target.value })}
                  placeholder="লেখকের নাম"
                  style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#4a412a' }}>ক্রম (sortOrder)</Label>
                <Input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })}
                  style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#4a412a' }}>সংক্ষিপ্ত বিবরণ (স্নিপেট)</Label>
              <Textarea
                value={form.snippet}
                onChange={(e) => setForm({ ...form, snippet: e.target.value })}
                placeholder="সংক্ষিপ্ত বিবরণ..."
                rows={2}
                style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
              />
            </div>

            <div className="space-y-2">
              <Label style={{ color: '#4a412a' }}>বিষয়বস্তু (প্রতিটি লাইন একটি অনুচ্ছেদ)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="প্রথম অনুচ্ছেদ...&#10;দ্বিতীয় অনুচ্ছেদ...&#10;তৃতীয় অনুচ্ছেদ..."
                rows={8}
                style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: '#4a412a' }}>ছবির URL</Label>
                <Input
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                  style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#4a412a' }}>ছবির ক্যাপশন</Label>
                <Input
                  value={form.imageCaption}
                  onChange={(e) => setForm({ ...form, imageCaption: e.target.value })}
                  placeholder="ছবির বিবরণ"
                  style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={form.isPublished}
                onCheckedChange={(checked) => setForm({ ...form, isPublished: checked })}
              />
              <Label style={{ color: '#4a412a' }}>
                {form.isPublished ? 'প্রকাশিত' : 'অপ্রকাশিত'}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} style={{ borderColor: '#e0d8c5', color: '#4a412a' }}>
              বাতিল
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.title || !form.issueId}
              style={{ background: '#b59449', color: '#fffdf7' }}
            >
              {saving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* মুছে ফেলার নিশ্চিতকরণ */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#1f1f1e' }}>মুছে ফেলবেন?</AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#8a7a5a' }}>
              এই আর্টিকেল মুছে যাবে এবং এটি পূর্বাবস্থায় ফেরানো যাবে না।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel style={{ color: '#4a412a' }}>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} style={{ background: '#8a1f1f' }}>
              মুছে ফেলুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}