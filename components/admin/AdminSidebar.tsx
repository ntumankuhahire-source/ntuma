'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Tag, Package, Menu, X, LogOut, ShieldCheck } from 'lucide-react'
import { useState } from 'react'

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Categories', href: '/admin/categories', icon: Tag },
  { name: 'Products', href: '/admin/products', icon: Package },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  // Don't render sidebar on login page
  if (pathname === '/admin/login') {
    return null
  }

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 -m-2 text-emerald-950 bg-brand-yellow rounded-md shadow-md hover:bg-yellow-400"
        >
          <span className="sr-only">Open sidebar</span>
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Sidebar component - Rich Green Background with Yellow Typography */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-emerald-950 border-r border-emerald-900 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-emerald-950 px-5 pb-5 h-full">
          
          {/* Logo & Admin Badge */}
          <div className="flex h-20 shrink-0 items-center mt-1 gap-2 px-2 border-b border-emerald-900/80">
            <div className="bg-white/95 px-3 py-1.5 rounded-xl shadow-md inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Ntuma Logo"
                width={160}
                height={50}
                className="h-11 w-auto object-contain"
              />
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-yellow text-emerald-950 shadow-sm">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-1 flex-col mt-2">
            <ul role="list" className="flex flex-1 flex-col gap-y-2">
              {navigation.map((item) => {
                const isActive = item.href === '/admin' 
                  ? pathname === '/admin' 
                  : pathname.startsWith(item.href);

                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        group flex gap-x-3 p-3 text-sm leading-6 font-medium border-l-4 transition-colors
                        ${isActive 
                          ? 'border-brand-yellow text-brand-yellow bg-white/10' 
                          : 'border-transparent text-white hover:text-brand-yellow hover:bg-white/10 hover:border-white/20'
                        }
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 shrink-0 ${isActive ? 'text-brand-yellow' : 'text-white/70 group-hover:text-brand-yellow'}`}
                        aria-hidden="true"
                      />
                      <span className="tracking-wide">{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Logout Small Card Component */}
            <div className="mt-auto pt-4 border-t border-emerald-900/80">
              <div className="bg-emerald-900/70 border border-emerald-800/90 rounded-card p-3.5 shadow-lg flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-700 flex items-center justify-center text-brand-yellow">
                      <ShieldCheck className="w-4.5 h-4.5" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-emerald-950 rounded-full" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-brand-yellow truncate">
                      Staff Admin
                    </span>
                    <span className="text-[10px] text-emerald-300/70 truncate">
                      Ntuma Portal
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-amber-100 hover:text-red-200 bg-emerald-950/80 hover:bg-red-900/40 border border-emerald-800/80 hover:border-red-700/60 rounded-lg transition-all duration-200 group"
                >
                  <LogOut className="h-3.5 w-3.5 text-amber-200/70 group-hover:text-red-300 transition-colors" />
                  <span>{loggingOut ? 'Signing out…' : 'Sign Out'}</span>
                </button>
              </div>
            </div>

          </nav>
        </div>
      </div>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
