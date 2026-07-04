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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Pencil, Trash2 } from 'lucide-react'

// ===== টাইপ ডিফিনিশন =====
interface Issue { id: string; issueNumber: number }

interface ContentTab {
  key: string
  label: string
  emoji: string
  apiPath: string
  fields: FieldDef[]
  getEmptyForm: () => Record<string, string | number | boolean>
  getRowLabel: (item: Record<string, unknown>) => string
  getRowSub?: (item: Record<string, unknown>) => string
}

interface FieldDef {
  key: string
  label: string
  type: 'text' | 'textarea' | 'number' | 'select' | 'switch'
  placeholder?: string
  required?: boolean
  rows?: number
  options?: { label: string; value: string }[]
}

// ===== ট্যাব কনফিগারেশন =====
const tabs: ContentTab[] = [
  {
    key: 'tickers',
    label: 'টিকার',
    emoji: '⚡',
    apiPath: '/api/admin/tickers',
    fields: [
      { key: 'message', label: 'বার্তা', type: 'textarea', placeholder: 'ব্রেকিং নিউজ বার্তা...', required: true, rows: 2 },
      { key: 'sortOrder', label: 'ক্রম', type: 'number' },
    ],
    getEmptyForm: () => ({ issueId: '', message: '', sortOrder: 0 }),
    getRowLabel: (item) => String(item.message),
  },
  {
    key: 'weathers',
    label: 'আবহাওয়া',
    emoji: '🌤️',
    apiPath: '/api/admin/weathers',
    fields: [
      { key: 'location', label: 'স্থান', type: 'text', placeholder: 'হগওয়ার্টস', required: true },
      { key: 'emoji', label: 'ইমোজি', type: 'text', placeholder: '☀️' },
      { key: 'forecast', label: 'পূর্বাভাস', type: 'textarea', placeholder: 'মেঘলা আকাশ...', required: true, rows: 2 },
      { key: 'sortOrder', label: 'ক্রম', type: 'number' },
    ],
    getEmptyForm: () => ({ issueId: '', location: '', emoji: '☀️', forecast: '', sortOrder: 0 }),
    getRowLabel: (item) => `${item.emoji} ${item.location}`,
    getRowSub: (item) => String(item.forecast),
  },
  {
    key: 'wanted',
    label: 'ওয়ান্টেড',
    emoji: '🪄',
    apiPath: '/api/admin/wanted',
    fields: [
      { key: 'name', label: 'নাম', type: 'text', placeholder: 'সিরিয়াস ব্ল্যাক', required: true },
      { key: 'description', label: 'বিবরণ', type: 'textarea', placeholder: 'বিবরণ লিখুন...', required: true, rows: 3 },
      { key: 'reward', label: 'পুরস্কার', type: 'text', placeholder: '১০,০০০ গ্যালিয়ন' },
      { key: 'imageUrl', label: 'ছবির URL', type: 'text', placeholder: 'https://...' },
      { key: 'isPublished', label: 'প্রকাশিত', type: 'switch' },
    ],
    getEmptyForm: () => ({ issueId: '', name: 'সিরিয়াস ব্ল্যাক', description: '', reward: '১০,০০০ গ্যালিয়ন', imageUrl: '', isPublished: true }),
    getRowLabel: (item) => String(item.name),
    getRowSub: (item) => `পুরস্কার: ${item.reward}`,
  },
  {
    key: 'ads',
    label: 'বিজ্ঞাপন',
    emoji: '📢',
    apiPath: '/api/admin/ads',
    fields: [
      { key: 'title', label: 'শিরোনাম', type: 'text', placeholder: 'বিজ্ঞাপনের শিরোনাম', required: true },
      { key: 'subtitle', label: 'উপশিরোনাম', type: 'text', placeholder: 'ঐচ্ছিক' },
      { key: 'description', label: 'বিবরণ', type: 'textarea', placeholder: 'বিজ্ঞাপনের বিবরণ...', rows: 3 },
      { key: 'imageUrl', label: 'ছবির URL', type: 'text', placeholder: 'https://...' },
      { key: 'price', label: 'মূল্য', type: 'text', placeholder: '৫০০ গ্যালিয়ন' },
      { key: 'articleSlug', label: 'আর্টিকেল স্লাগ', type: 'text', placeholder: 'সংশ্লিষ্ট আর্টিকেল' },
      { key: 'sortOrder', label: 'ক্রম', type: 'number' },
    ],
    getEmptyForm: () => ({ issueId: '', title: '', subtitle: '', description: '', imageUrl: '', price: '', articleSlug: '', sortOrder: 0 }),
    getRowLabel: (item) => String(item.title),
    getRowSub: (item) => item.subtitle ? String(item.subtitle) : undefined,
  },
  {
    key: 'classifieds',
    label: 'ক্লাসিফাইড',
    emoji: '📋',
    apiPath: '/api/admin/classifieds',
    fields: [
      { key: 'heading', label: 'শিরোনাম', type: 'text', placeholder: 'বিজ্ঞাপন শিরোনাম', required: true },
      { key: 'body', label: 'বিবরণ', type: 'textarea', placeholder: 'বিজ্ঞাপনের বিবরণ...', required: true, rows: 3 },
      { key: 'sortOrder', label: 'ক্রম', type: 'number' },
    ],
    getEmptyForm: () => ({ issueId: '', heading: '', body: '', sortOrder: 0 }),
    getRowLabel: (item) => String(item.heading),
    getRowSub: (item) => String(item.body),
  },
  {
    key: 'decrees',
    label: 'ডিক্রি',
    emoji: '📜',
    apiPath: '/api/admin/decrees',
    fields: [
      { key: 'title', label: 'শিরোনাম', type: 'text', placeholder: 'মন্ত্রণালয় ডিক্রি', required: true },
      { key: 'decreeNumber', label: 'ডিক্রি নম্বর', type: 'text', placeholder: '১২৭৩/২০২৬', required: true },
      { key: 'body', label: 'ডিক্রির বিষয়বস্তু', type: 'textarea', placeholder: 'ডিক্রির পুরো পাঠ...', required: true, rows: 4 },
      { key: 'signedBy', label: 'স্বাক্ষরকারী', type: 'text', placeholder: 'মন্ত্রী কর্নেলিয়াস ফাজ উইজার্ড', required: true },
      { key: 'sortOrder', label: 'ক্রম', type: 'number' },
    ],
    getEmptyForm: () => ({ issueId: '', title: 'মন্ত্রণালয় ডিক্রি', decreeNumber: '', body: '', signedBy: '', sortOrder: 0 }),
    getRowLabel: (item) => `${item.title} — ${item.decreeNumber}`,
    getRowSub: (item) => `স্বাক্ষরিত: ${item.signedBy}`,
  },
  {
    key: 'letters',
    label: 'চিঠি',
    emoji: '✉️',
    apiPath: '/api/admin/letters',
    fields: [
      { key: 'author', label: 'লেখক', type: 'text', placeholder: 'চিঠি লেখকের নাম', required: true },
      { key: 'body', label: 'চিঠির বিষয়বস্তু', type: 'textarea', placeholder: 'চিঠির পাঠ...', required: true, rows: 4 },
      { key: 'sortOrder', label: 'ক্রম', type: 'number' },
    ],
    getEmptyForm: () => ({ issueId: '', author: '', body: '', sortOrder: 0 }),
    getRowLabel: (item) => String(item.author),
    getRowSub: (item) => String(item.body),
  },
]

// ===== কন্টেন্ট ম্যানেজার কম্পোনেন্ট =====
function ContentManager({ tab, issues }: { tab: ContentTab; issues: Issue[] }) {
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [filterIssue, setFilterIssue] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string | number | boolean>>(tab.getEmptyForm())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    const params = filterIssue !== 'all' ? `?issueId=${filterIssue}` : ''
    fetch(`${tab.apiPath}${params}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setItems(Array.isArray(data) ? data : []) })
      .catch(() => { if (!cancelled) setItems([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [tab.apiPath, filterIssue])

  const refreshItems = () => {
    const params = filterIssue !== 'all' ? `?issueId=${filterIssue}` : ''
    fetch(`${tab.apiPath}${params}`)
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
  }

  const handleCreate = () => {
    setEditingId(null)
    setForm({ ...tab.getEmptyForm(), issueId: issues[0]?.id || '' })
    setDialogOpen(true)
  }

  const handleEdit = (item: Record<string, unknown>) => {
    setEditingId(String(item.id))
    const newForm: Record<string, string | number | boolean> = { ...tab.getEmptyForm() }
    tab.fields.forEach((f) => {
      if (item[f.key] !== undefined) {
        newForm[f.key] = item[f.key] as string | number | boolean
      }
    })
    newForm.issueId = String(item.issueId || '')
    setForm(newForm)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form }
      if (editingId) {
        payload.id = editingId
        await fetch(tab.apiPath, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        await fetch(tab.apiPath, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }
      setDialogOpen(false)
      refreshItems()
    } catch {}
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deletingId) return
    setSaving(true)
    try {
      await fetch(`${tab.apiPath}?id=${deletingId}`, { method: 'DELETE' })
      setDeleteOpen(false)
      setDeletingId(null)
      refreshItems()
    } catch {}
    setSaving(false)
  }

  const renderField = (field: FieldDef) => {
    if (field.type === 'textarea') {
      return (
        <div key={field.key} className="space-y-2">
          <Label style={{ color: '#4a412a' }}>{field.label} {field.required && '*'}</Label>
          <Textarea
            value={String(form[field.key] || '')}
            onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
          />
        </div>
      )
    }

    if (field.type === 'switch') {
      return (
        <div key={field.key} className="flex items-center gap-3">
          <Switch
            checked={Boolean(form[field.key])}
            onCheckedChange={(checked) => setForm({ ...form, [field.key]: checked })}
          />
          <Label style={{ color: '#4a412a' }}>
            {field.label}: {form[field.key] ? 'হ্যাঁ' : 'না'}
          </Label>
        </div>
      )
    }

    if (field.type === 'number') {
      return (
        <div key={field.key} className="space-y-2">
          <Label style={{ color: '#4a412a' }}>{field.label}</Label>
          <Input
            type="number"
            value={String(form[field.key] || 0)}
            onChange={(e) => setForm({ ...form, [field.key]: parseInt(e.target.value) || 0 })}
            style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
          />
        </div>
      )
    }

    if (field.type === 'select' && field.options) {
      return (
        <div key={field.key} className="space-y-2">
          <Label style={{ color: '#4a412a' }}>{field.label}</Label>
          <Select value={String(form[field.key])} onValueChange={(v) => setForm({ ...form, [field.key]: v })}>
            <SelectTrigger style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )
    }

    // text (default)
    return (
      <div key={field.key} className="space-y-2">
        <Label style={{ color: '#4a412a' }}>{field.label} {field.required && '*'}</Label>
        <Input
          value={String(form[field.key] || '')}
          onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
          placeholder={field.placeholder}
          style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex-1 min-w-[180px]">
          <Select value={filterIssue} onValueChange={setFilterIssue}>
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
        <Button onClick={handleCreate} style={{ background: '#b59449', color: '#fffdf7' }}>
          <Plus size={16} className="mr-2" /> নতুন {tab.label}
        </Button>
      </div>

      <Card style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ borderBottom: '2px solid #e0d8c5' }}>
                <TableHead style={{ color: '#4a412a' }}>বিষয়বস্তু</TableHead>
                <TableHead className="hidden md:table-cell" style={{ color: '#4a412a' }}>বিবরণ</TableHead>
                <TableHead className="text-right" style={{ color: '#4a412a' }}>কার্যক্রম</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8" style={{ color: '#8a7a5a' }}>
                    লোড হচ্ছে...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8" style={{ color: '#8a7a5a' }}>
                    কোনো {tab.label} নেই
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={String(item.id)} style={{ borderBottom: '1px solid #e0d8c5' }}>
                    <TableCell>
                      <p className="font-semibold text-sm" style={{ color: '#1f1f1e' }}>
                        {tab.getRowLabel(item)}
                      </p>
                      {tab.key === 'wanted' && (
                        <Badge
                          className="mt-1"
                          style={{
                            background: item.isPublished ? '#2d7d46' : '#8a1f1f',
                            color: '#fff',
                          }}
                        >
                          {item.isPublished ? 'প্রকাশিত' : 'অপ্রকাশিত'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm truncate max-w-[300px]" style={{ color: '#8a7a5a' }}>
                        {tab.getRowSub?.(item) || ''}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(item)} style={{ color: '#b59449' }}>
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setDeletingId(String(item.id)); setDeleteOpen(true) }}
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
      </Card>

      {/* তৈরি/সম্পাদনা ডায়ালগ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto p-5 sm:p-6" style={{ background: '#fffdf7', border: '1px solid #e0d8c5' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#1f1f1e' }}>
              {editingId ? `${tab.label} সম্পাদনা` : `নতুন ${tab.label}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* ইস্যু সিলেক্ট */}
            <div className="space-y-2">
              <Label style={{ color: '#4a412a' }}>সংখ্যা *</Label>
              <Select value={String(form.issueId)} onValueChange={(v) => setForm({ ...form, issueId: v })}>
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

            {/* ডায়নামিক ফিল্ড */}
            {tab.fields.map(renderField)}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} style={{ borderColor: '#e0d8c5', color: '#4a412a' }}>
              বাতিল
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.issueId}
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
              এই {tab.label} মুছে যাবে এবং এটি পূর্বাবস্থায় ফেরানো যাবে না।
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

// ===== মূল পেজ =====
export default function ContentPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'tickers'

  useEffect(() => {
    fetch('/api/admin/issues?limit=100')
      .then((r) => r.json())
      .then((data) => setIssues(data.issues || []))
      .catch(() => {})
  }, [])

  const activeTabConfig = tabs.find((t) => t.key === activeTab) || tabs[0]

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold" style={{ color: '#1f1f1e' }}>কন্টেন্ট পরিচালনা</h1>
        <p className="text-sm" style={{ color: '#8a7a5a' }}>টিকার, আবহাওয়া, ওয়ান্টেড, বিজ্ঞাপন, ক্লাসিফাইড, ডিক্রি ও চিঠি পরিচালনা করুন</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => window.history.replaceState(null, '', `/admin/content?tab=${v}`)}>
        <TabsList className="flex flex-wrap h-auto gap-1 p-1" style={{ background: '#f5f0e6', border: '1px solid #e0d8c5' }}>
          {tabs.map((t) => (
            <TabsTrigger
              key={t.key}
              value={t.key}
              className="data-[state=active]:text-white text-sm px-3 py-1.5"
              style={{
                '--tw-tabs-trigger-color': '#4a412a',
                fontFamily: 'var(--font-bengali)',
              } as React.CSSProperties}
            >
              {t.emoji} {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((t) => (
          <TabsContent key={t.key} value={t.key}>
            <ContentManager tab={t} issues={issues} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}