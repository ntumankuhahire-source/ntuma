'use client'

import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { CATEGORIES } from '@/lib/categories'
import { CATALOG } from '@/lib/catalog'
import { Tag, Leaf, Scissors, Beef, ShoppingBag, Lock } from 'lucide-react'

/** Icon per category id */
const ICON_MAP: Record<string, React.ElementType> = {
  'fresh-produce':     Leaf,
  'ready-to-cook':     Scissors,
  'animal-products':   Beef,
  'supermarket-items': ShoppingBag,
}

/** Accent colour per category id */
const ACCENT_MAP: Record<string, { bg: string; text: string; border: string; chip: string }> = {
  'fresh-produce':     { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200', chip: 'bg-emerald-100 text-emerald-800' },
  'ready-to-cook':     { bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200',   chip: 'bg-amber-100  text-amber-800'   },
  'animal-products':   { bg: 'bg-rose-50',     text: 'text-rose-700',    border: 'border-rose-200',    chip: 'bg-rose-100   text-rose-800'    },
  'supermarket-items': { bg: 'bg-blue-50',     text: 'text-blue-700',    border: 'border-blue-200',    chip: 'bg-blue-100   text-blue-800'    },
}

export default function CategoriesPage() {
  // Count live products per category from the catalog constant
  const productCounts = Object.fromEntries(
    CATEGORIES.map((cat) => [
      cat.id,
      CATALOG.filter((p) => p.category === cat.id).length,
    ])
  )

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* No action button — categories are fixed system constants */}
      <AdminTopbar title="Categories" />

      <div className="p-8">
        {/* Read-only notice */}
        <div className="mb-8 flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-card px-5 py-3.5 text-sm text-slate-600 max-w-2xl">
          <Lock className="h-4 w-4 shrink-0 text-slate-400" />
          <span>
            Categories are <span className="font-semibold text-slate-800">fixed system constants</span> — no add, edit, or delete. Products are assigned to one of these 4 categories.
          </span>
        </div>

        {/* 4 fixed category cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.id] ?? Tag
            const accent = ACCENT_MAP[cat.id] ?? ACCENT_MAP['fresh-produce']
            const count = productCounts[cat.id] ?? 0

            return (
              <div
                key={cat.id}
                className={`ntuma-card flex flex-col gap-4 border ${accent.border}`}
              >
                {/* Header */}
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${accent.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`h-5 w-5 ${accent.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-emerald-950 leading-snug">
                      {cat.name}
                    </h3>
                    <p className={`font-mono text-[10px] uppercase tracking-wider mt-0.5 ${accent.text}`}>
                      {cat.id}
                    </p>
                  </div>
                </div>

                {/* relatedBy */}
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{cat.relatedBy}"
                </p>

                {/* Includes */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Includes
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {cat.includes}
                  </p>
                </div>

                {/* Subcategory chips */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Subcategories
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subcategories.map((sub) => (
                      <span
                        key={sub}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${accent.chip}`}
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Product count */}
                <div className="mt-auto pt-2 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 font-mono text-xs px-3 py-1.5 rounded-full shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${count > 0 ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                    {count} product{count !== 1 ? 's' : ''} live
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
