'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown, MessageCircle, ShieldCheck, Mail } from 'lucide-react'

const PHONE_1_DISPLAY = '+250 787 800 703'
const PHONE_1_RAW = '250787800703'
const WA_LINK_1 = `https://wa.me/${PHONE_1_RAW}`

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
  { label: 'Admin Portal', href: '/admin/login' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="md:hidden border-b border-emerald-900">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 font-display font-bold text-base text-brand-yellow"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          size={18}
          strokeWidth={1.75}
          className={`text-brand-yellow transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      className="bg-emerald-950 text-white"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="col-span-1">
            <Link href="/" className="inline-block mb-4" aria-label="Ntuma home">
              <div className="bg-white/95 px-4 py-2.5 rounded-2xl shadow-md inline-flex items-center">
                <Image
                  src="/logo.png"
                  alt="Ntuma Logo"
                  width={220}
                  height={70}
                  className="h-14 md:h-16 lg:h-20 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="font-body text-sm text-slate-100 font-semibold leading-relaxed">
              Vendor to door, every time.
            </p>
            <p className="font-body text-xs text-slate-200 leading-relaxed mt-2.5">
              Ntuma Nkuhahire — Your trusted daily errand and grocery delivery partner in Kigali, Rwanda (Gasabo, Kicukiro &amp; Nyarugenge). Connecting local markets, fresh farms, and vendors directly to your doorstep with speed, freshness, and care.
            </p>
          </div>

          {/* Column 2: Navigate */}
          <div>
            <p className="font-display font-bold text-base text-brand-yellow mb-5 tracking-wide">
              Navigate
            </p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white hover:text-brand-yellow transition-colors duration-150 flex items-center gap-1.5"
                  >
                    {link.label}
                    {link.href === '/admin/login' && (
                      <span className="text-[10px] font-mono font-medium uppercase px-1.5 py-0.5 rounded bg-emerald-900 text-brand-yellow border border-emerald-800">
                        Staff
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <p className="font-display font-bold text-base text-brand-yellow mb-5 tracking-wide">
              Contact
            </p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={WA_LINK_1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-sm text-white hover:text-brand-yellow transition-colors duration-150"
                >
                  <MessageCircle size={15} strokeWidth={1.75} className="text-brand-yellow shrink-0" />
                  {PHONE_1_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@ntumankuhahire.com"
                  className="font-body text-sm text-white hover:text-brand-yellow transition-colors duration-150 flex items-center gap-2"
                >
                  <Mail size={15} strokeWidth={1.75} className="text-brand-yellow shrink-0" />
                  info@ntumankuhahire.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:ntumankuhahire@gmail.com"
                  className="font-body text-sm text-white hover:text-brand-yellow transition-colors duration-150 flex items-center gap-2"
                >
                  <Mail size={15} strokeWidth={1.75} className="text-brand-yellow shrink-0" />
                  ntumankuhahire@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Admin */}
          <div>
            <p className="font-display font-bold text-base text-brand-yellow mb-5 tracking-wide">
              Legal & Staff
            </p>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white hover:text-brand-yellow transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/login"
                  className="font-body text-sm text-white hover:text-brand-yellow transition-colors duration-150 inline-flex items-center gap-1.5 pt-1"
                >
                  <ShieldCheck size={14} className="text-brand-yellow" />
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile: brand + accordions */}
        <div className="md:hidden">
          {/* Brand */}
          <div className="mb-8">
            <Link href="/" className="inline-block mb-3" aria-label="Ntuma home">
              <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-md inline-flex items-center">
                <Image
                  src="/logo.png"
                  alt="Ntuma Logo"
                  width={180}
                  height={55}
                  className="h-14 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="font-body text-sm text-slate-100 font-semibold mb-1">
              Vendor to door, every time.
            </p>
            <p className="font-body text-xs text-slate-200 leading-relaxed">
              Ntuma Nkuhahire — Your trusted daily errand and grocery delivery partner in Kigali, Rwanda (Gasabo, Kicukiro &amp; Nyarugenge). Connecting local markets, fresh farms, and vendors directly to your doorstep with speed, freshness, and care.
            </p>
          </div>

          <AccordionItem title="Navigate">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white hover:text-brand-yellow flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    {link.href === '/admin/login' && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900 text-brand-yellow">
                        Staff
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionItem>

          <AccordionItem title="Contact">
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={WA_LINK_1}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-sm text-white"
                >
                  <MessageCircle size={15} strokeWidth={1.75} className="text-brand-yellow shrink-0" />
                  {PHONE_1_DISPLAY}
                </a>
              </li>
              <li>
                <a href="mailto:info@ntumankuhahire.com" className="font-body text-sm text-white flex items-center gap-2">
                  <Mail size={15} strokeWidth={1.75} className="text-brand-yellow shrink-0" />
                  info@ntumankuhahire.com
                </a>
              </li>
              <li>
                <a href="mailto:ntumankuhahire@gmail.com" className="font-body text-sm text-white flex items-center gap-2">
                  <Mail size={15} strokeWidth={1.75} className="text-brand-yellow shrink-0" />
                  ntumankuhahire@gmail.com
                </a>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Legal & Staff">
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="font-body text-sm text-white hover:text-brand-yellow">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/admin/login"
                  className="font-body text-sm text-white hover:text-brand-yellow flex items-center gap-1.5 pt-1"
                >
                  <ShieldCheck size={14} className="text-brand-yellow" />
                  Staff Login
                </Link>
              </li>
            </ul>
          </AccordionItem>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-slate-300">
            © 2026 Ntuma Nkuhahire. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-200">
            <span>Gasabo, Kicukiro &amp; Nyarugenge — Kigali, Rwanda</span>
            <span>•</span>
            <Link
              href="/admin/login"
              className="text-white hover:text-brand-yellow transition-colors underline underline-offset-2"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
