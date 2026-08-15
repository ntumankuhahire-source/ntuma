'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { Eye, Download, ChevronDown, SlidersHorizontal, X, Phone, Package } from 'lucide-react'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { OrderDetailPanel } from '@/components/admin/OrderDetailPanel'
import { downloadOrderInvoice } from '@/components/admin/OrderInvoice'
import { listOrders, updateOrderStatus } from '@/lib/sheetsApi'
import type { Order, OrderStatus } from '@/lib/sheetsApi'
import { CATEGORIES, QUICK_LIST_CATEGORY } from '@/lib/categories'

// ── Status config ──────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  Confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  Delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Cancelled: 'bg-red-100 text-red-800 border-red-200',
}

// Select styled as a colored pill — uses an overlay trick
const STATUS_SELECT_STYLES: Record<OrderStatus, string> = {
  Pending:   'bg-yellow-50 text-yellow-800 border-yellow-200 focus:ring-yellow-300',
  Confirmed: 'bg-blue-50 text-blue-800 border-blue-200 focus:ring-blue-300',
  Delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200 focus:ring-emerald-300',
  Cancelled: 'bg-red-50 text-red-800 border-red-200 focus:ring-red-300',
}

// ── Category pill colors ────────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<string, string> = {
  'fresh-produce':     'bg-lime-100 text-lime-800 border-lime-200',
  'ready-to-cook':     'bg-amber-100 text-amber-800 border-amber-200',
  'animal-products':   'bg-orange-100 text-orange-800 border-orange-200',
  'supermarket-items': 'bg-sky-100 text-sky-800 border-sky-200',
  'Quick List':        'bg-violet-100 text-violet-800 border-violet-200',
}

function getCategoryStyle(catId: string): string {
  return CATEGORY_STYLES[catId] ?? 'bg-slate-100 text-slate-700 border-slate-200'
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-RW', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

function formatDateInput(iso: string) {
  return new Date(iso).toISOString().slice(0, 10) // "YYYY-MM-DD"
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders]               = useState<Order[]>([])
  const [loading, setLoading]             = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [panelOpen, setPanelOpen]         = useState(false)

  // Filters
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterStatus, setFilterStatus]     = useState<string>('all')
  const [filterPayment, setFilterPayment]   = useState<string>('all')
  const [filterDate, setFilterDate]         = useState<string>('')

  // Load orders on mount
  useEffect(() => {
    listOrders()
      .then(setOrders)
      .finally(() => setLoading(false))
  }, [])

  // ── Filtered view ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filterStatus !== 'all' && o.status !== filterStatus) return false
      if (filterPayment !== 'all') {
        const pMode = (o.modeOfPayment || 'Cash').toLowerCase()
        if (filterPayment === 'Cash' && !pMode.includes('cash')) return false
        if (filterPayment === 'Mobile Money' && !pMode.includes('mobile') && !pMode.includes('momo')) return false
      }
      if (filterCategory !== 'all') {
        const hasCat = o.items.some(i => i.category === filterCategory)
        if (!hasCat) return false
      }
      if (filterDate) {
        const orderDay = formatDateInput(o.createdAt)
        if (orderDay !== filterDate) return false
      }
      return true
    })
  }, [orders, filterStatus, filterPayment, filterCategory, filterDate])

  const hasFilters = filterStatus !== 'all' || filterPayment !== 'all' || filterCategory !== 'all' || filterDate !== ''
  const clearFilters = () => { setFilterStatus('all'); setFilterPayment('all'); setFilterCategory('all'); setFilterDate('') }

  // ── Status update (optimistic) ───────────────────────────────────────────
  const handleStatusChange = useCallback(async (orderId: string, newStatus: OrderStatus) => {
    // Optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : prev)
    }

    // Persist
    const res = await updateOrderStatus(orderId, newStatus)
    if (!res.success) {
      // Revert on failure (in a real app you'd also toast an error)
      console.error('Failed to update order status:', res.error)
      const reverted = await listOrders()
      setOrders(reverted)
    }
  }, [selectedOrder])

  // ── Open detail panel ────────────────────────────────────────────────────
  const openPanel = (order: Order) => {
    setSelectedOrder(order)
    setPanelOpen(true)
  }
  const closePanel = () => setPanelOpen(false)

  // ── Summary stats ─────────────────────────────────────────────────────────
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0)

  const pendingCount = orders.filter(o => o.status === 'Pending').length

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <AdminTopbar
        title="Orders"
        ghostActionLabel="Export"
        onGhostAction={() => {
          // TODO: implement CSV export once Sheets backend is connected
          console.log('Export clicked — functionality coming with Sheets backend')
        }}
      />

      <div className="p-6 space-y-6">

        {/* ── Summary stat cards ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders',    value: String(orders.length),          sub: 'all time'           },
            { label: 'Pending',         value: String(pendingCount),            sub: 'need attention'     },
            { label: 'Delivered',       value: String(orders.filter(o=>o.status==='Delivered').length),  sub: 'completed' },
            { label: 'Revenue (RWF)',   value: totalRevenue.toLocaleString(),   sub: 'confirmed + delivered', mono: true },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">{card.label}</p>
              <p className={`font-bold text-2xl text-emerald-900 leading-tight ${card.mono ? 'font-mono' : 'font-display'}`}>
                {card.value}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Filter row ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex flex-wrap items-end gap-4">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 self-center shrink-0" />

            {/* Category filter */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</label>
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={e => setFilterCategory(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                  <option value={QUICK_LIST_CATEGORY}>Quick List</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Status filter */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Payment filter */}
            <div className="flex flex-col gap-1 min-w-[140px]">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Payment</label>
              <div className="relative">
                <select
                  value={filterPayment}
                  onChange={e => setFilterPayment(e.target.value)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                >
                  <option value="all">All Payments</option>
                  <option value="Cash">Cash</option>
                  <option value="Mobile Money">Mobile Money</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
              </div>
            </div>

            {/* Date filter */}
            <div className="flex flex-col gap-1 min-w-[150px]">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
              />
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:text-emerald-900 transition-colors self-end pb-2"
              >
                <X className="w-3.5 h-3.5" />
                Clear filters
              </button>
            )}

            {/* Result count */}
            <div className="ml-auto self-end pb-2 text-xs text-slate-400 font-mono">
              {filtered.length} of {orders.length} orders
            </div>
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
              <span className="text-sm">Loading orders…</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Package className="w-10 h-10 text-slate-300" />
              <p className="text-sm font-medium">
                {hasFilters ? 'No orders match your filters.' : 'No orders yet.'}
              </p>
              {hasFilters && (
                <button onClick={clearFilters} className="text-sm text-emerald-700 hover:underline">
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {[
                      'Order ID', 'Date', 'Payment', 'Categories', 'Items',
                      'Total', 'Customer', 'Location', 'Status', 'Actions'
                    ].map(col => (
                      <th
                        key={col}
                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap ${
                          col === 'Total'   ? 'text-right' :
                          col === 'Actions' ? 'text-right' : 'text-left'
                        }`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((order, idx) => {
                    // Unique categories in order
                    const catIds = [...new Set(order.items.map(i => i.category))]
                    const visibleCats = catIds.slice(0, 2)
                    const extraCats   = catIds.length - 2

                    // Items summary
                    const firstItem = order.items[0]
                    const extraItems = order.items.length - 1

                    return (
                      <tr
                        key={order.id}
                        className={`transition-colors hover:bg-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
                      >
                        {/* Order ID */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-semibold text-emerald-700">
                            {order.id}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs text-slate-600 whitespace-nowrap">
                            {formatDate(order.createdAt)}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                              (order.modeOfPayment || 'Cash').toLowerCase().includes('mobile') || (order.modeOfPayment || 'Cash').toLowerCase().includes('momo')
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {order.modeOfPayment || 'Cash'}
                          </span>
                        </td>

                        {/* Categories */}
                        <td className="px-4 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {visibleCats.map(catId => {
                              const catName = catId === QUICK_LIST_CATEGORY
                                ? 'Quick List'
                                : (CATEGORIES.find(c => c.id === catId)?.name ?? catId)
                              return (
                                <span
                                  key={catId}
                                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${getCategoryStyle(catId)}`}
                                >
                                  {catName}
                                </span>
                              )
                            })}
                            {extraCats > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                +{extraCats}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Items summary */}
                        <td className="px-4 py-3.5 max-w-[160px]">
                          <p className="text-slate-700 font-medium truncate">
                            {firstItem?.productName ?? '—'}
                          </p>
                          {extraItems > 0 && (
                            <p className="text-xs text-slate-400 mt-0.5">+{extraItems} more</p>
                          )}
                        </td>

                        {/* Total */}
                        <td className="px-4 py-3.5 text-right whitespace-nowrap">
                          <span className="font-mono font-bold text-slate-900">
                            {order.total.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">RWF</span>
                        </td>

                        {/* Customer */}
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-slate-800 whitespace-nowrap">
                            {order.customerName}
                          </p>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="font-mono text-xs text-emerald-700 hover:underline flex items-center gap-0.5 mt-0.5"
                          >
                            <Phone className="w-3 h-3" />
                            {order.customerPhone}
                          </a>
                        </td>

                        {/* Location */}
                        <td className="px-4 py-3.5 max-w-[140px]">
                          <span className="text-slate-600 text-xs truncate block">
                            {order.location}
                          </span>
                        </td>

                        {/* Status — inline select */}
                        <td className="px-4 py-3.5">
                          <div className="relative inline-block">
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value as OrderStatus)
                              }
                              className={`appearance-none cursor-pointer border rounded-full px-3 py-1 pr-7 text-xs font-bold focus:outline-none focus:ring-2 transition-all ${
                                STATUS_SELECT_STYLES[order.status]
                              }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown className="w-3 h-3 absolute right-2 top-1.5 pointer-events-none text-current opacity-60" />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 justify-end">
                            <button
                              onClick={() => openPanel(order)}
                              title="View order details"
                              className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => downloadOrderInvoice(order)}
                              title="Download PDF invoice"
                              className="p-2 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ── Order Detail Panel ────────────────────────────────────────────── */}
      <OrderDetailPanel
        order={selectedOrder}
        open={panelOpen}
        onClose={closePanel}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
