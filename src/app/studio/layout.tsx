'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/studio/login'

  if (isLogin) return <>{children}</>

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--dark)' }}>
      <AdminSidebar />
      <main style={{ flex: 1, marginLeft: 240, padding: '40px 44px', overflowX: 'hidden', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  )
}
