'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  href?: string
  onClick?: () => void
  disabled?: boolean
  subtext?: string
}

export function StatCard({ label, value, href, onClick, disabled, subtext }: StatCardProps) {
  const content = (
    <div
      className={`ntuma-card relative flex flex-col justify-between gap-3 p-5 transition-all duration-200 border border-slate-200 bg-white ${
        disabled
          ? 'opacity-50 grayscale cursor-not-allowed'
          : 'hover:border-emerald-600 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group'
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-body text-xs font-semibold uppercase tracking-wider text-slate-500 group-hover:text-emerald-800 transition-colors">
          {label}
        </span>
        {href && !disabled && (
          <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-700 group-hover:text-white transition-all duration-200">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-3xl md:text-4xl text-emerald-950 font-medium tracking-tight group-hover:text-emerald-700 transition-colors">
          {value}
        </span>
        {subtext && (
          <span className="text-xs font-medium text-slate-400 group-hover:text-emerald-600 transition-colors">
            {subtext}
          </span>
        )}
      </div>
    </div>
  )

  if (href && !disabled) {
    return <Link href={href} className="block">{content}</Link>
  }

  if (onClick && !disabled) {
    return <button onClick={onClick} type="button" className="w-full text-left">{content}</button>
  }

  return content
}
