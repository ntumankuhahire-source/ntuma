'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, MessageCircle } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/order' },
  { label: 'About', href: '/#about' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Testimonials', href: '/#testimonials' },
  { label: 'Contact', href: '/#contact' },
]

const PHONE_DISPLAY = '+250 787 800 703'
const PHONE_RAW = '+250787800703'
const WA_LINK = `https://wa.me/${PHONE_RAW.replace('+', '')}`

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 transition-all duration-300 ${
          scrolled ? 'h-16' : 'h-[84px]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="Ntuma home" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Ntuma Logo"
              width={200}
              height={65}
              className="h-12 md:h-16 w-auto object-contain py-1"
              priority
            />
          </Link>

          {/* Center nav — desktop only */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link py-1">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right — phone + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-brand-black hover:text-emerald-700 transition-colors duration-200"
              aria-label={`Call or WhatsApp ${PHONE_DISPLAY}`}
            >
              {PHONE_DISPLAY}
            </a>
            <Link href="/order" className="btn-primary text-sm">
              Start an order
            </Link>
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 -mr-2 text-brand-black hover:text-emerald-700 transition-colors"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={22} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <div
        className={`fixed inset-0 z-[60] bg-white flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Mobile menu header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Ntuma home">
            <Image
              src="/logo.png"
              alt="Ntuma Logo"
              width={160}
              height={50}
              className="h-12 w-auto object-contain"
            />
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 -mr-2 text-brand-black hover:text-emerald-700 transition-colors"
            aria-label="Close menu"
          >
            <X size={22} strokeWidth={1.75} />
          </button>
        </div>

        {/* Mobile nav links */}
        <nav className="flex-1 flex flex-col justify-center px-8 gap-2">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display font-semibold text-3xl text-brand-black hover:text-emerald-700 transition-colors py-3 border-b border-slate-50"
              style={{ transitionDelay: menuOpen ? `${i * 60}ms` : '0ms' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile menu footer */}
        <div className="px-8 py-8 flex flex-col gap-3">
          <p className="font-mono text-sm text-slate-500 mb-1">Get in touch</p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 btn-primary w-full justify-center"
            onClick={() => setMenuOpen(false)}
          >
            <MessageCircle size={18} strokeWidth={1.75} />
            WhatsApp us
          </a>
          <Link
            href="/order"
            className="btn-ghost w-full justify-center"
            onClick={() => setMenuOpen(false)}
          >
            Start an order
          </Link>
        </div>
      </div>
    </>
  )
}
