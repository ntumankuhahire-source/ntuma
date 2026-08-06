'use client'

import { useState } from 'react'
import { ChevronDown, MessageCircle } from 'lucide-react'

const PHONE_DISPLAY = '+250 788 524 634'
const PHONE_RAW = '250788524634'
const WA_LINK = `https://wa.me/${PHONE_RAW}`

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
]

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="md:hidden border-b border-emerald-900">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 font-display font-semibold text-sm text-white"
        aria-expanded={open}
      >
        {title}
        <ChevronDown
          size={16}
          strokeWidth={1.5}
          className={`text-emerald-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  )
}

export default function Footer() {
  return (
    <footer
      className="bg-emerald-950 text-emerald-100"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="col-span-1">
            <div className="logo-badge text-base mb-4">
              ntuma<span className="text-emerald-700 ml-0.5">.</span>
            </div>
            <p className="font-body text-sm text-emerald-300 leading-relaxed">
              Vendor to door, every time.
            </p>
          </div>

          {/* Column 2: Navigate */}
          <div>
            <p className="font-display font-semibold text-sm text-white mb-5">
              Navigate
            </p>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-emerald-300 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <p className="font-display font-semibold text-sm text-white mb-5">
              Contact
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-sm text-emerald-300 hover:text-white transition-colors duration-150"
                >
                  <MessageCircle size={13} strokeWidth={1.75} />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@ntuma.rw"
                  className="font-body text-sm text-emerald-300 hover:text-white transition-colors duration-150"
                >
                  hello@ntuma.rw
                  <span className="ml-1 text-xs text-emerald-600 italic">(placeholder)</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <p className="font-display font-semibold text-sm text-white mb-5">
              Legal
            </p>
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-emerald-300 hover:text-white transition-colors duration-150"
                  >
                    {link.label}
                    <span className="ml-1 text-xs text-emerald-600 italic">(placeholder)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mobile: brand + accordions */}
        <div className="md:hidden">
          {/* Brand */}
          <div className="mb-8">
            <div className="logo-badge text-base mb-3">
              ntuma<span className="text-emerald-700 ml-0.5">.</span>
            </div>
            <p className="font-body text-sm text-emerald-300">
              Vendor to door, every time.
            </p>
          </div>

          <AccordionItem title="Navigate">
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-emerald-300 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </AccordionItem>

          <AccordionItem title="Contact">
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-sm text-emerald-300"
                >
                  <MessageCircle size={13} strokeWidth={1.75} />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href="mailto:hello@ntuma.rw" className="font-body text-sm text-emerald-300">
                  hello@ntuma.rw
                </a>
              </li>
            </ul>
          </AccordionItem>

          <AccordionItem title="Legal">
            <ul className="flex flex-col gap-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="font-body text-sm text-emerald-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </AccordionItem>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-emerald-500">
            © 2026 Ntuma Nkuhahire. All rights reserved.
          </p>
          <p className="font-body text-xs text-emerald-600">
            Nyagatare &amp; Kigali, Rwanda
          </p>
        </div>
      </div>
    </footer>
  )
}
