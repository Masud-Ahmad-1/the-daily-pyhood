'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('ইউজারনেম অথবা পাসওয়ার্ড ভুল হয়েছে')
      } else {
        router.push('/admin')
      }
    } catch {
      setError('লগইনে সমস্যা হয়েছে, আবার চেষ্টা করুন')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="parchment-bg min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md mx-4" style={{ background: '#f2ebd9', border: '2px solid #4a412a' }}>
        <CardHeader className="text-center pb-2 pt-6 px-6">
          <div className="text-4xl mb-2">🪄</div>
          <CardTitle
            className="text-2xl"
            style={{ fontFamily: 'var(--font-display)', color: '#1f1f1e' }}
          >
            পাইপত্র
          </CardTitle>
          <CardDescription style={{ fontFamily: 'var(--font-bengali)', color: '#4a412a' }}>
            মন্ত্রণালয় সম্পাদক প্যানেলে প্রবেশ করুন
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-md text-sm text-center" style={{ background: '#fef2f2', color: '#8a1f1f', border: '1px solid #8a1f1f' }}>
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" style={{ fontFamily: 'var(--font-bengali)' }}>
                ইউজারনেম
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="ইউজারনেম লিখুন..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  fontFamily: 'var(--font-bengali)',
                  background: '#fffdf7',
                  border: '1px solid #4a412a',
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" style={{ fontFamily: 'var(--font-bengali)' }}>
                পাসওয়ার্ড
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="পাসওয়ার্ড লিখুন..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  fontFamily: 'var(--font-bengali)',
                  background: '#fffdf7',
                  border: '1px solid #4a412a',
                }}
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              style={{
                fontFamily: 'var(--font-bengali)',
                background: loading ? '#8a7a5a' : '#b59449',
                color: '#fffdf7',
                border: '1px solid #4a412a',
              }}
            >
              {loading ? '✨ যাচাই হচ্ছে...' : '🪄 প্রবেশ করুন'}
            </Button>
          </form>
          <p className="text-center mt-5 text-xs" style={{ color: '#8a7a5a', fontFamily: 'var(--font-bengali)' }}>
            অননুমোদিত প্রবেশ মন্ত্রণালয় আইনে শাস্তিযোগ্য অপরাধ
          </p>
        </CardContent>
      </Card>
    </div>
  )
}