'use client'

import { Trash2, Pencil } from 'lucide-react'
import type { Product } from '@/lib/sheetsApi'

/** Duck-typed interface — accepts both sheetsApi Category and lib/categories Category */
interface CategoryLike {
  id: string
  name: string
}

const CATEGORY_COLORS: string[] = [
  'bg-emerald-100 text-emerald-800',
  'bg-blue-100 text-blue-800',
  'bg-violet-100 text-violet-800',
  'bg-amber-100 text-amber-800',
  'bg-pink-100 text-pink-800',
  'bg-cyan-100 text-cyan-800',
]

function categoryColorClass(id: string) {
  // Deterministic color from id
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash)
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length]
}

interface DataTableProps {
  products: Product[]
  categories: CategoryLike[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-slate-200 bg-white">
      <table className="min-w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {['Product', 'Category', 'Price', 'Description', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-4 py-4"><div className="h-4 w-32 bg-slate-200 rounded" /></td>
              <td className="px-4 py-4"><div className="h-5 w-20 bg-slate-200 rounded-full" /></td>
              <td className="px-4 py-4"><div className="h-4 w-20 bg-slate-200 rounded ml-auto" /></td>
              <td className="px-4 py-4"><div className="h-4 w-40 bg-slate-200 rounded" /></td>
              <td className="px-4 py-4"><div className="h-4 w-12 bg-slate-200 rounded" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function DataTable({ products, categories, onEdit, onDelete }: DataTableProps) {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]))

  return (
    <div className="overflow-hidden rounded-card border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                Description
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => {
              const cat = categoryMap[product.category]
              return (
                <tr key={product.id} className="group hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="font-medium text-sm text-emerald-950">{product.name}</span>
                  </td>
                  <td className="px-5 py-4">
                    {cat ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColorClass(cat.id)}`}>
                        {cat.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs italic">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="font-mono text-sm text-emerald-950">
                      {Number(product.price).toLocaleString()}
                      <span className="text-slate-400 ml-1 text-xs">RWF</span>
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell max-w-xs">
                    <span
                      title={product.description}
                      className="text-sm text-slate-500 truncate block"
                    >
                      {product.description || <span className="italic text-slate-300">—</span>}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(product)}
                        title="Edit product"
                        className="p-1.5 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        title="Delete product"
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

DataTable.Skeleton = TableSkeleton
