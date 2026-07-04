'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

interface Issue {
  id: string
  issueNumber: number
  title: string
  publishDate: string
  priceGalleons: number
  isPublished: boolean
  createdAt: string
  _count: {
    articles: number
    tickers: number
    weathers: number
    wantedPosters: number
    ads: number
    classifieds: number
    decrees: number
    letters: number
  }
}

const emptyForm = {
  title: 'The Daily Pyhood',
  priceGalleons: 5,
  publishDate: new Date().toISOString().split('T')[0],
  isPublished: false,
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/admin/issues?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setIssues(data.issues || [])
          setTotalPages(data.totalPages || 1)
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [page])

  const refresh = () => {
    fetch(`/api/admin/issues?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        setIssues(data.issues || [])
        setTotalPages(data.totalPages || 1)
      })
      .catch(() => {})
  }

  const handleCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const handleEdit = (issue: Issue) => {
    setEditingId(issue.id)
    setForm({
      title: issue.title,
      priceGalleons: issue.priceGalleons,
      publishDate: new Date(issue.publishDate).toISOString().split('T')[0],
      isPublished: issue.isPublished,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        await fetch(`/api/admin/issues/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      } else {
        await fetch('/api/admin/issues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
      }
      setDialogOpen(false)
      refresh()
    } catch {}
    setSaving(false)
  }

  const handleTogglePublished = async (issue: Issue) => {
    try {
      await fetch(`/api/admin/issues/${issue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !issue.isPublished }),
      })
      refresh()
    } catch {}
  }

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await fetch(`/api/admin/issues/${deletingId}`, { method: 'DELETE' })
      setDeleteOpen(false)
      setDeletingId(null)
      refresh()
    } catch {}
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#1f1f1e' }}>সংখ্যা পরিচালনা</h1>
          <p className="text-sm" style={{ color: '#8a7a5a' }}>পত্রিকার সকল সংখ্যা পরিচালনা করুন</p>
        </div>
        <Button onClick={handleCreate} style={{ background: '#b59449', color: '#fffdf7' }}>
          <Plus size={16} className="mr-2" /> নতুন সংখ্যা
        </Button>
      </div>

      <Card style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ borderBottom: '2px solid #e0d8c5' }}>
                <TableHead style={{ color: '#4a412a' }}>সংখ্যা</TableHead>
                <TableHead style={{ color: '#4a412a' }}>তারিখ</TableHead>
                <TableHead style={{ color: '#4a412a' }}>আর্টিকেল</TableHead>
                <TableHead style={{ color: '#4a412a' }}>মূল্য</TableHead>
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
              ) : issues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8" style={{ color: '#8a7a5a' }}>
                    কোনো সংখ্যা নেই
                  </TableCell>
                </TableRow>
              ) : (
                issues.map((issue) => (
                  <TableRow key={issue.id} style={{ borderBottom: '1px solid #e0d8c5' }}>
                    <TableCell className="font-semibold" style={{ color: '#1f1f1e' }}>
                      নং {issue.issueNumber.toLocaleString('bn-BD')}
                    </TableCell>
                    <TableCell style={{ color: '#4a412a' }}>
                      {new Date(issue.publishDate).toLocaleDateString('bn-BD')}
                    </TableCell>
                    <TableCell style={{ color: '#4a412a' }}>
                      {issue._count.articles}টি
                    </TableCell>
                    <TableCell style={{ color: '#4a412a' }}>
                      {issue.priceGalleons} গ্যালিয়ন
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={issue.isPublished}
                        onCheckedChange={() => handleTogglePublished(issue)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(issue)}
                          style={{ color: '#b59449' }}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setDeletingId(issue.id); setDeleteOpen(true) }}
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
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              style={{ borderColor: '#b59449', color: '#b59449' }}
            >
              <ChevronLeft size={16} className="mr-1" /> পূর্ববর্তী
            </Button>
            <span className="text-sm" style={{ color: '#8a7a5a' }}>
              পৃষ্ঠা {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              style={{ borderColor: '#b59449', color: '#b59449' }}
            >
              পরবর্তী <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        )}
      </Card>

      {/* তৈরি/সম্পাদনা ডায়ালগ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="p-5 sm:p-6" style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#1f1f1e' }}>
              {editingId ? 'সংখ্যা সম্পাদনা' : 'নতুন সংখ্যা তৈরি'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label style={{ color: '#4a412a' }}>শিরোনাম</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label style={{ color: '#4a412a' }}>মূল্য (গ্যালিয়ন)</Label>
                <Input
                  type="number"
                  value={form.priceGalleons}
                  onChange={(e) => setForm({ ...form, priceGalleons: parseInt(e.target.value) || 0 })}
                  style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: '#4a412a' }}>প্রকাশের তারিখ</Label>
                <Input
                  type="date"
                  value={form.publishDate}
                  onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
                  style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
                />
              </div>
            </div>
            {editingId && (
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.isPublished}
                  onCheckedChange={(checked) => setForm({ ...form, isPublished: checked })}
                />
                <Label style={{ color: '#4a412a' }}>
                  {form.isPublished ? 'প্রকাশিত' : 'অপ্রকাশিত'}
                </Label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} style={{ borderColor: '#e0d8c5', color: '#4a412a' }}>
              বাতিল
            </Button>
            <Button onClick={handleSave} disabled={saving} style={{ background: '#b59449', color: '#fffdf7' }}>
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
              এই সংখ্যার সকল আর্টিকেল, টিকার, আবহাওয়া ও অন্যান্য কন্টেন্ট মুছে যাবে। এই কাজ পূর্বাবস্থায় ফেরানো যাবে না।
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