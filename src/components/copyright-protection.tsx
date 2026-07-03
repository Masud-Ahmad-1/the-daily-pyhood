'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { toast } from 'sonner'

export default function CopyrightProtection() {
  const pathname = usePathname()

  // অ্যাডমিন পেজে প্রটেকশন সক্রিয় করব না
  if (pathname.startsWith('/admin')) return null

  return <CopyrightEffects />
}

function CopyrightEffects() {
  const handleCopy = useCallback((e: ClipboardEvent) => {
    e.preventDefault()
    toast.error('📜 ডেইলি পাইহুডের কপিরাইট সুরক্ষিত। অনুমোদন ছাড়া কপি করা নিষিধ্ধ।', {
      duration: 3000,
      position: 'top-center',
    })
  }, [])

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault()
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ctrl+C ব্লক (copy event handler দিয়ে হ্যান্ডেল হলেও অতিরিক্ত সুরক্ষা)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault()
      toast.error('📜 ডেইলি পাইহুডের কপিরাইট সুরক্ষিত। অনুমোদন ছাড়া কপি করা নিষিধ্ধ।', {
        duration: 3000,
        position: 'top-center',
      })
      return
    }
    // Ctrl+U (সোর্স ভিউ) ব্লক
    if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
      e.preventDefault()
      return
    }
    // Ctrl+S (সেভ) ব্লক
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      return
    }
    // F12 (ডেভটুলস) ব্লক
    if (e.key === 'F12') {
      e.preventDefault()
      return
    }
  }, [])

  const handleDragStart = useCallback((e: DragEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      e.preventDefault()
    }
  }, [])

  useEffect(() => {
    // বডিতে প্রটেক্টেড-টেক্সট ক্লাস যোগ
    document.body.classList.add('protected-text')

    // ইমেজে pointer-events: none স্টাইল যোগ
    const style = document.createElement('style')
    style.id = 'copyright-img-protection'
    style.textContent = `
      img {
        -webkit-user-drag: none !important;
        pointer-events: none;
      }
      img:hover {
        pointer-events: none !important;
      }
    `
    document.head.appendChild(style)

    // ইভেন্ট লিসেনার যোগ
    document.addEventListener('copy', handleCopy)
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('dragstart', handleDragStart)

    return () => {
      document.body.classList.remove('protected-text')
      document.removeEventListener('copy', handleCopy)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('dragstart', handleDragStart)
      const existingStyle = document.getElementById('copyright-img-protection')
      if (existingStyle) existingStyle.remove()
    }
  }, [handleCopy, handleContextMenu, handleKeyDown, handleDragStart])

  return null
}