'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  Zap,
  CloudSun,
  UserX,
  Megaphone,
  ListOrdered,
  ScrollText,
  Mail,
  LogOut,
  Menu,
  X,
  Wallet,
  UserCircle,
  CreditCard,
  BarChart3,
} from 'lucide-react'

const menuItems = [
  { href: '/admin', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
  { href: '/admin/issues', label: 'সংখ্যা পরিচালনা', icon: Newspaper },
  { href: '/admin/articles', label: 'আর্টিকেল পরিচালনা', icon: FileText },
  { href: '/admin/content', label: 'কন্টেন্ট পরিচালনা', icon: ScrollText },
  { href: '/admin/analytics', label: 'পরিসংখ্যান', icon: BarChart3 },
]

const contentSubItems = [
  { href: '/admin/content?tab=tickers', label: 'টিকার', icon: Zap },
  { href: '/admin/content?tab=weathers', label: 'আবহাওয়া', icon: CloudSun },
  { href: '/admin/content?tab=wanted', label: 'ওয়ান্টেড', icon: UserX },
  { href: '/admin/content?tab=ads', label: 'বিজ্ঞাপন', icon: Megaphone },
  { href: '/admin/content?tab=classifieds', label: 'ক্লাসিফাইড', icon: ListOrdered },
  { href: '/admin/content?tab=decrees', label: 'ডিক্রি', icon: ScrollText },
  { href: '/admin/content?tab=letters', label: 'চিঠি', icon: Mail },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/admin')
      .then((r) => {
        if (r.ok) {
          setAuthenticated(true)
        } else {
          router.push('/admin/login')
        }
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false))
  }, [router])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#1a1816' }}>
        <div className="text-center" style={{ fontFamily: 'var(--font-bengali)', color: '#b59449' }}>
          <div className="text-4xl mb-3 animate-pulse">🪄</div>
          <p>যাচাই হচ্ছে...</p>
        </div>
      </div>
    )
  }

  if (!authenticated && pathname !== '/admin/login') return null
  if (pathname === '/admin/login') return <>{children}</>

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href.split('?')[0])
  }

  if (!authenticated) return <>{children}</>

  return (
    <div className="min-h-screen flex" style={{ background: '#f5f0e6', fontFamily: 'var(--font-bengali)' }}>
      {/* মোবাইল ওভারলে */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* সাইডবার */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ background: '#1a1816', borderRight: '1px solid #2d2820' }}
      >
        {/* হেডার */}
        <div className="p-4 sm:p-5 flex items-center justify-between" style={{ borderBottom: '1px solid #2d2820' }}>
          <div>
            <h1
              className="text-lg font-bold"
              style={{ fontFamily: 'var(--font-display)', color: '#b59449' }}
            >
              পাইপত্র
            </h1>
            <p className="text-xs" style={{ color: '#8a7a5a' }}>
              সম্পাদক প্যানেল
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded"
            style={{ color: '#b59449' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* নেভিগেশন */}
        <ScrollArea className="flex-1 py-2">
          <div className="px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href)
                    setSidebarOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left"
                  style={{
                    background: active ? 'rgba(181, 148, 73, 0.15)' : 'transparent',
                    color: active ? '#b59449' : '#c4b99a',
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            })}
          </div>

          <Separator className="my-3" style={{ background: '#2d2820' }} />

          <div className="px-3">
            <p className="px-3 text-xs mb-2 font-semibold" style={{ color: '#8a7a5a' }}>
              ইউজার ফিচার
            </p>
            <div className="space-y-1">
              {[
                { href: '/wallet', label: 'গ্রিংগটস ওয়ালেট', icon: Wallet },
                { href: '/profile', label: 'ইউজার প্রোফাইল', icon: UserCircle },
                { href: '/subscribe', label: 'সাবস্ক্রিপশন প্ল্যান', icon: CreditCard },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href)
                      setSidebarOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left"
                    style={{
                      color: '#a09580',
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          <Separator className="my-3" style={{ background: '#2d2820' }} />

          <div className="px-3">
            <p className="px-3 text-xs mb-2 font-semibold" style={{ color: '#8a7a5a' }}>
              কন্টেন্ট পরিচালনা
            </p>
            <div className="space-y-1">
              {contentSubItems.map((item) => {
                const Icon = item.icon
                const active = pathname === item.href
                return (
                  <button
                    key={item.href}
                    onClick={() => {
                      router.push(item.href)
                      setSidebarOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-left"
                    style={{
                      background: active ? 'rgba(181, 148, 73, 0.15)' : 'transparent',
                      color: active ? '#b59449' : '#a09580',
                    }}
                  >
                    <Icon size={16} />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </ScrollArea>

        {/* লগআউট */}
        <div className="p-3" style={{ borderTop: '1px solid #2d2820' }}>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-sm"
            style={{ color: '#c4b99a' }}
          >
            <LogOut size={18} />
            লগআউট
          </Button>
        </div>
      </aside>

      {/* মূল কন্টেন্ট */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* টপ বার */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 py-3.5"
          style={{ background: '#fffdf7', borderBottom: '1px solid #e0d8c5' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md"
            style={{ color: '#1f1f1e' }}
          >
            <Menu size={22} />
          </button>
          <h2 className="text-lg font-semibold" style={{ color: '#1f1f1e' }}>
            {menuItems.find((i) => isActive(i.href))?.label ||
              contentSubItems.find((i) => pathname === i.href)?.label ||
              'অ্যাডমিন প্যানেল'}
          </h2>
        </header>

        {/* পেজ কন্টেন্ট */}
        <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}