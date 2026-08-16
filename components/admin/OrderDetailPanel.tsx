'use client'

import { Fragment, useEffect, useRef } from 'react'
import { X, Phone, MapPin, Calendar, Hash, Download, Package, CreditCard, FileText, FileSpreadsheet } from 'lucide-react'
import type { Order, OrderStatus } from '@/lib/sheetsApi'
import { CATEGORIES, QUICK_LIST_CATEGORY } from '@/lib/categories'
import { downloadOrderInvoice, downloadOrderInvoiceExcel } from './OrderInvoice'

const STATUS_CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  Pending:   { label: 'Pending',   className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  Confirmed: { label: 'Confirmed', className: 'bg-blue-100 text-blue-800 border-blue-200'       },
  Delivered: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  Cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800 border-red-200'         },
}

interface OrderDetailPanelProps {
  order: Order | null
  open: boolean
  onClose: () => void
  /** Called when admin changes status inline in the detail panel. */
  onStatusChange: (orderId: string, status: OrderStatus) => void
}

export function OrderDetailPanel({ order, open, onClose, onStatusChange }: OrderDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!order) return null

  const dateStr = new Date(order.createdAt).toLocaleDateString('en-RW', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  const timeStr = new Date(order.createdAt).toLocaleTimeString('en-RW', {
    hour: '2-digit', minute: '2-digit',
  })

  // Unique categories in this order
  const uniqueCategoryIds = [...new Set(order.items.map(i => i.category))]

  const statusCfg = STATUS_CONFIG[order.status]

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Order ${order.id} details`}
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg flex flex-col bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-6 py-5 bg-emerald-950">
          <div>
            <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-1">Order Details</p>
            <h2 className="text-xl font-display font-semibold text-white font-mono">{order.id}</h2>
            <p className="text-emerald-300 text-xs mt-1">{dateStr} at {timeStr}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 -mr-1 mt-1 p-2 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* Customer card */}
          <div className="px-6 pt-6 pb-5 border-b border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Customer</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-emerald-700">
                    {order.customerName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{order.customerName}</p>
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="font-mono text-xs text-emerald-700 hover:underline flex items-center gap-1 mt-0.5"
                  >
                    <Phone className="w-3 h-3" />
                    {order.customerPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-slate-500">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                <span>{order.location}</span>
              </div>

              {order.budget > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Hash className="w-4 h-4 shrink-0 text-slate-400" />
                  <span>Budget: <span className="font-mono font-semibold text-slate-700">{order.budget.toLocaleString()} RWF</span></span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CreditCard className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Payment: <span className="font-semibold text-slate-700">{order.modeOfPayment || 'Cash'}</span></span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4 shrink-0 text-slate-400" />
                <span>{dateStr}</span>
              </div>
            </div>
          </div>

          {/* Status section */}
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Status</h3>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.className}`}>
                {statusCfg.label}
              </span>
              <select
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {uniqueCategoryIds.map((catId) => {
                const isQuickList = catId === QUICK_LIST_CATEGORY
                const catName = isQuickList ? 'Quick List' : (CATEGORIES.find(c => c.id === catId)?.name ?? catId)
                return (
                  <span
                    key={catId}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      isQuickList
                        ? 'bg-violet-50 text-violet-800 border-violet-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    <Package className="w-3 h-3" />
                    {catName}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Line items table */}
          <div className="px-6 py-5 border-b border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Order Items ({order.items.length})
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Qty</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => {
                    const isQuickList = item.isCustom || item.category === QUICK_LIST_CATEGORY
                    const catName = isQuickList
                      ? 'Quick List'
                      : (CATEGORIES.find(c => c.id === item.category)?.name ?? item.category)
                    return (
                      <Fragment key={item.id}>
                        <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                          <td className="px-4 py-3">
                            <p className="font-medium text-slate-900">{item.productName}</p>
                            <p className={`text-xs mt-0.5 ${
                              isQuickList ? 'text-violet-500' : 'text-slate-400'
                            }`}>{catName}</p>
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-slate-600">
                            {isQuickList
                              ? (item.unit && item.unit !== '—' && item.unit !== '-' ? item.unit : item.qty)
                              : (item.unit && item.unit !== '—' && item.unit !== '-' ? (/^\d/.test(item.unit) && item.qty === 1 ? item.unit : `${item.qty} ${item.unit}`) : item.qty)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isQuickList ? (
                              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                Ask price
                              </span>
                            ) : (
                              <span className="font-mono font-semibold text-slate-800">
                                {item.subtotal.toLocaleString()} RWF
                              </span>
                            )}
                          </td>
                        </tr>
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
              <span className="text-sm font-semibold uppercase tracking-wider text-emerald-800">Order Total</span>
              <span className="font-mono font-bold text-xl text-emerald-900">{order.total.toLocaleString()} RWF</span>
            </div>
          </div>

        </div>

        {/* ── Pinned footer ─────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="rounded-card px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 transition-colors"
          >
            Close
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadOrderInvoice(order)}
              className="inline-flex items-center gap-1.5 rounded-card px-3.5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-xs"
              title="Download PDF Invoice"
            >
              <FileText className="h-4 w-4" />
              PDF Invoice
            </button>
            <button
              type="button"
              onClick={() => downloadOrderInvoiceExcel(order)}
              className="inline-flex items-center gap-1.5 rounded-card px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-xs"
              title="Download Excel Invoice (Single Sheet)"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel Invoice
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
