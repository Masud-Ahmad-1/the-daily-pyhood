'use client'

import { useEffect, useState } from 'react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [SessionProvider, setSessionProvider] = useState<React.ComponentType<{ children: React.ReactNode }>>()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    import('next-auth/react').then(mod => {
      setSessionProvider(() => mod.SessionProvider)
      setMounted(true)
    }).catch(() => {
      setMounted(true)
    })
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  if (!SessionProvider) {
    return <>{children}</>
  }

  return <SessionProvider>{children}</SessionProvider>
}