'use client'

import { useEffect, useState, useCallback } from 'react'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { DataTable } from '@/components/admin/DataTable'
import { SlideOverPanel } from '@/components/admin/SlideOverPanel'
import {
  fetchProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  type Product,
} from '@/lib/sheetsApi'
import { CATEGORIES } from '@/lib/categories'
import { Search, AlertTriangle, RefreshCw, Package } from 'lucide-react'

const UNITS = ['kg', 'pc', 'liter', 'tray', 'pack'] as const

function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [onDismiss])
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-950 text-white px-5 py-3.5 rounded-card shadow-xl text-sm font-medium">
      <span className="h-2 w-2 rounded-full bg-brand-yellow shrink-0" />
      {message}
    </div>
  )
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')

  const [panelOpen, setPanelOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  // Form state
  const [fName, setFName] = useState('')
  const [fCategory, setFCategory] = useState('')
  const [fPrice, setFPrice] = useState('')
  const [fUnit, setFUnit] = useState<string>('kg')
  const [fDescription, setFDescription] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const p = await fetchProducts()
      setProducts(p)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? p.category === filterCat : true
    return matchSearch && matchCat
  })

  // ── Panel helpers ────────────────────────────────────────────────────────
  function openAdd() {
    setEditTarget(null)
    setFName(''); setFCategory(''); setFPrice(''); setFUnit('kg'); setFDescription('')
    setPanelOpen(true)
  }

  function openEdit(product: Product) {
    setEditTarget(product)
    setFName(product.name)
    setFCategory(product.category)
    setFPrice(String(product.price))
    setFUnit(product.unit || 'kg')
    setFDescription(product.description)
    setPanelOpen(true)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
    await deleteProduct(id)
    setToast('Product deleted.')
  }

  async function handleSave() {
    if (!fName.trim() || !fCategory || !fPrice) return
    setIsSaving(true)
    if (editTarget) {
      const updated: Product = {
        ...editTarget,
        name: fName.trim(),
        category: fCategory,
        price: parseFloat(fPrice),
        unit: fUnit,
        description: fDescription,
      }
      setProducts((prev) => prev.map((p) => p.id === editTarget.id ? updated : p))
      await updateProduct(editTarget.id, updated)
      setToast('Product updated.')
    } else {
      const payload = {
        name: fName.trim(),
        category: fCategory,
        price: parseFloat(fPrice),
        unit: fUnit,
        description: fDescription,
      }
      const res = await addProduct(payload)
      if (res.success && res.data) {
        setProducts((prev) => [...prev, res.data!])
        setToast('Product added.')
      }
    }
    setIsSaving(false)
    setPanelOpen(false)
  }

  const saveDisabled = !fName.trim() || !fCategory || !fPrice

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <AdminTopbar
        title="Products"
        actionLabel="+ Add product"
        onAction={openAdd}
      />

      <div className="p-8">
        {/* Error banner */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-card px-5 py-4 text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Couldn't load data — </span>
            <button
              onClick={load}
              className="inline-flex items-center gap-1 font-medium underline underline-offset-2 hover:no-underline"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              try again
            </button>
          </div>
        )}

        {/* Search + filter */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-card border border-slate-300 pl-9 pr-3.5 py-2.5 text-sm text-emerald-950 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-colors bg-white"
              />
            </div>
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="rounded-card border border-slate-300 px-3.5 py-2.5 text-sm text-emerald-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-colors bg-white"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <DataTable.Skeleton />}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <Package className="h-7 w-7 text-emerald-600" />
            </div>
            <h3 className="font-display font-semibold text-lg text-emerald-950 mb-2">No products yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">
              Add products so customers can browse and place orders through the app.
            </p>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm px-5 py-2.5 rounded-card transition-colors"
            >
              Add your first product
            </button>
          </div>
        )}

        {/* No results state */}
        {!loading && !error && products.length > 0 && filtered.length === 0 && (
          <div className="text-center py-16 text-sm text-slate-500">
            No products match your search.
          </div>
        )}

        {/* Data table */}
        {!loading && !error && filtered.length > 0 && (
          <DataTable
            products={filtered}
            categories={CATEGORIES}
            onEdit={openEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Slide-over panel */}
      <SlideOverPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        title={editTarget ? 'Edit Product' : 'Add Product'}
        onSave={handleSave}
        saveDisabled={saveDisabled}
        isSaving={isSaving}
      >
        <div className="flex flex-col gap-6">

          {/* Name */}
          <div>
            <label htmlFor="prod-name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="prod-name"
              type="text"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
              placeholder="e.g. Tomatoes"
              className="w-full rounded-card border border-slate-300 px-3.5 py-2.5 text-sm text-emerald-950 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-colors"
            />
          </div>

          {/* Category — fixed 4-option select from lib/categories.ts */}
          <div>
            <label htmlFor="prod-cat" className="block text-sm font-medium text-slate-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="prod-cat"
              value={fCategory}
              onChange={(e) => setFCategory(e.target.value)}
              className="w-full rounded-card border border-slate-300 px-3.5 py-2.5 text-sm text-emerald-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-colors bg-white"
            >
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Price + Unit */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="prod-price" className="block text-sm font-medium text-slate-700 mb-1.5">
                Price <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="prod-price"
                  type="number"
                  min="0"
                  step="any"
                  value={fPrice}
                  onChange={(e) => setFPrice(e.target.value)}
                  placeholder="0"
                  className="w-full rounded-card border border-slate-300 px-3.5 py-2.5 pr-14 text-sm font-mono text-emerald-950 placeholder:text-slate-400 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-colors"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 pointer-events-none">
                  RWF
                </span>
              </div>
            </div>
            <div className="w-32">
              <label htmlFor="prod-unit" className="block text-sm font-medium text-slate-700 mb-1.5">
                Unit
              </label>
              <select
                id="prod-unit"
                value={fUnit}
                onChange={(e) => setFUnit(e.target.value)}
                className="w-full rounded-card border border-slate-300 px-3.5 py-2.5 text-sm text-emerald-950 focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-colors bg-white"
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="prod-desc" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="prod-desc"
              rows={4}
              value={fDescription}
              onChange={(e) => setFDescription(e.target.value)}
              placeholder="Optional details visible to customers…"
              className="w-full rounded-card border border-slate-300 px-3.5 py-2.5 text-sm text-emerald-950 placeholder:text-slate-400 resize-none focus:border-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 transition-colors"
            />
          </div>
        </div>
      </SlideOverPanel>

      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}
