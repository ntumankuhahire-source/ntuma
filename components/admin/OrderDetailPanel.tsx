'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import {
  X, Phone, MapPin, Calendar, Hash, Download, Package, CreditCard,
  FileText, FileSpreadsheet, Edit2, Trash2, Plus, Save, RotateCcw, AlertTriangle
} from 'lucide-react'
import type { Order, OrderItem, OrderStatus } from '@/lib/sheetsApi'
import { CATEGORIES, QUICK_LIST_CATEGORY } from '@/lib/categories'
import { downloadOrderInvoice, downloadOrderInvoiceExcel } from './OrderInvoice'
import { updateOrder, deleteOrder } from '@/lib/sheetsApi'

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
  onStatusChange: (orderId: string, status: OrderStatus) => void
  onOrderUpdated?: (updatedOrder: Order) => void
  onOrderDeleted?: (orderId: string) => void
}

export function OrderDetailPanel({
  order,
  open,
  onClose,
  onStatusChange,
  onOrderUpdated,
  onOrderDeleted,
}: OrderDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [editedOrder, setEditedOrder] = useState<Order | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Reset editing/delete state when drawer opens/closes or order changes
  useEffect(() => {
    setIsEditing(false)
    setConfirmDelete(false)
    setEditedOrder(order ? JSON.parse(JSON.stringify(order)) : null)
  }, [order, open])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        if (isEditing) {
          setIsEditing(false)
        } else {
          onClose()
        }
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose, isEditing])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!order) return null

  const activeOrder = isEditing && editedOrder ? editedOrder : order

  const dateStr = new Date(activeOrder.createdAt).toLocaleDateString('en-RW', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  const timeStr = new Date(activeOrder.createdAt).toLocaleTimeString('en-RW', {
    hour: '2-digit', minute: '2-digit',
  })

  const uniqueCategoryIds = [...new Set(activeOrder.items.map(i => i.category))]
  const statusCfg = STATUS_CONFIG[activeOrder.status]

  // Handlers for Editing
  const startEditing = () => {
    setEditedOrder(JSON.parse(JSON.stringify(order)))
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setIsEditing(false)
    setEditedOrder(JSON.parse(JSON.stringify(order)))
  }

  const updateItemField = (index: number, field: keyof OrderItem, val: any) => {
    setEditedOrder((prev) => {
      if (!prev) return prev
      const newItems = [...prev.items]
      const target = { ...newItems[index], [field]: val }

      if (field === 'qty' || field === 'price' || field === 'isCustom') {
        const q = Number(target.qty) || 0
        const p = Number(target.price) || 0
        target.subtotal = target.isCustom ? 0 : q * p
      }

      newItems[index] = target
      const newTotal = newItems.reduce((acc, i) => acc + (i.isCustom ? 0 : i.subtotal), 0)
      return { ...prev, items: newItems, total: newTotal }
    })
  }

  const removeItem = (index: number) => {
    setEditedOrder((prev) => {
      if (!prev) return prev
      const newItems = prev.items.filter((_, i) => i !== index)
      const newTotal = newItems.reduce((acc, i) => acc + (i.isCustom ? 0 : i.subtotal), 0)
      return { ...prev, items: newItems, total: newTotal }
    })
  }

  const addItem = () => {
    setEditedOrder((prev) => {
      if (!prev) return prev
      const newItem: OrderItem = {
        id: `i-${prev.id}-${Date.now()}`,
        orderId: prev.id,
        category: 'fresh-produce',
        productName: 'New Produce Item',
        qty: 1,
        unit: 'kg',
        price: 1000,
        subtotal: 1000,
        isCustom: false,
      }
      const newItems = [...prev.items, newItem]
      const newTotal = newItems.reduce((acc, i) => acc + (i.isCustom ? 0 : i.subtotal), 0)
      return { ...prev, items: newItems, total: newTotal }
    })
  }

  const handleSaveOrder = async () => {
    if (!editedOrder) return
    setIsSaving(true)
    try {
      const res = await updateOrder(editedOrder.id, editedOrder)
      if (res.success) {
        if (onOrderUpdated) onOrderUpdated(editedOrder)
        setIsEditing(false)
      } else {
        alert(res.error || 'Failed to update order')
      }
    } catch (err: any) {
      alert(err.message || 'Error updating order')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteOrder = async () => {
    setIsDeleting(true)
    try {
      const res = await deleteOrder(order.id)
      if (res.success) {
        if (onOrderDeleted) onOrderDeleted(order.id)
        onClose()
      } else {
        alert(res.error || 'Failed to delete order')
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting order')
    } finally {
      setIsDeleting(false)
      setConfirmDelete(false)
    }
  }

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
        aria-label={`Order ${activeOrder.id} details`}
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xl flex flex-col bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                {isEditing ? 'Editing Order' : 'Order Details'}
              </span>
              {isEditing && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Edit Mode
                </span>
              )}
            </div>
            <h2 className="text-xl font-display font-semibold text-white font-mono">{activeOrder.id}</h2>
            <p className="text-emerald-300 text-xs mt-0.5">{dateStr} at {timeStr}</p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <button
                  type="button"
                  onClick={startEditing}
                  title="Edit this order"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-800 text-emerald-100 hover:bg-emerald-700 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  title="Delete this order"
                  className="p-1.5 rounded-lg text-red-300 hover:text-white hover:bg-red-900/60 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Alert Banner */}
        {confirmDelete && (
          <div className="bg-red-50 border-b border-red-200 p-4 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs text-red-800 font-medium">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Are you sure you want to delete order <strong>{order.id}</strong> permanently?</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── Scrollable body ──────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">

          {/* Customer info card */}
          <div className="px-6 pt-5 pb-5 border-b border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Customer Information</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-3">
              {isEditing && editedOrder ? (
                /* Editable Customer Inputs */
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Customer Name</label>
                    <input
                      type="text"
                      value={editedOrder.customerName}
                      onChange={(e) => setEditedOrder({ ...editedOrder, customerName: e.target.value })}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Phone Number</label>
                      <input
                        type="text"
                        value={editedOrder.customerPhone}
                        onChange={(e) => setEditedOrder({ ...editedOrder, customerPhone: e.target.value })}
                        className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Mode of Payment</label>
                      <select
                        value={editedOrder.modeOfPayment || 'Cash'}
                        onChange={(e) => setEditedOrder({ ...editedOrder, modeOfPayment: e.target.value })}
                        className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Mobile Money">Mobile Money</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Delivery Location</label>
                    <input
                      type="text"
                      value={editedOrder.location}
                      onChange={(e) => setEditedOrder({ ...editedOrder, location: e.target.value })}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Budget (RWF)</label>
                    <input
                      type="number"
                      value={editedOrder.budget}
                      onChange={(e) => setEditedOrder({ ...editedOrder, budget: Number(e.target.value) || 0 })}
                      className="w-full mt-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                /* Display Customer Details */
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-emerald-700">
                        {activeOrder.customerName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{activeOrder.customerName}</p>
                      <a
                        href={`tel:${activeOrder.customerPhone}`}
                        className="font-mono text-xs text-emerald-700 hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3" />
                        {activeOrder.customerPhone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                    <span>{activeOrder.location}</span>
                  </div>

                  {activeOrder.budget > 0 && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Hash className="w-4 h-4 shrink-0 text-slate-400" />
                      <span>Budget: <span className="font-mono font-semibold text-slate-700">{activeOrder.budget.toLocaleString()} RWF</span></span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CreditCard className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>Payment: <span className="font-semibold text-slate-700">{activeOrder.modeOfPayment || 'Cash'}</span></span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Status section */}
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Order Status</h3>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.className}`}>
                {statusCfg.label}
              </span>
              <select
                value={activeOrder.status}
                onChange={(e) => {
                  const newStatus = e.target.value as OrderStatus
                  if (isEditing && editedOrder) {
                    setEditedOrder({ ...editedOrder, status: newStatus })
                  } else {
                    onStatusChange(order.id, newStatus)
                  }
                }}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer font-medium"
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Line items table */}
          <div className="px-6 py-5 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Order Items ({activeOrder.items.length})
              </h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={addItem}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Item
                </button>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-3 py-2.5">Product</th>
                    <th className="text-center px-3 py-2.5">Qty / Unit</th>
                    <th className="text-right px-3 py-2.5">Price</th>
                    <th className="text-right px-3 py-2.5">Subtotal</th>
                    {isEditing && <th className="px-2 py-2.5 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeOrder.items.map((item, idx) => {
                    const isQuickList = item.isCustom || item.category === QUICK_LIST_CATEGORY

                    if (isEditing && editedOrder) {
                      return (
                        <tr key={item.id || idx} className="bg-white">
                          <td className="p-2 min-w-[140px]">
                            <input
                              type="text"
                              value={item.productName}
                              onChange={(e) => updateItemField(idx, 'productName', e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              placeholder="Product name"
                            />
                            <select
                              value={item.category}
                              onChange={(e) => updateItemField(idx, 'category', e.target.value)}
                              className="w-full mt-1 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-600 focus:outline-none"
                            >
                              {CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                              <option value={QUICK_LIST_CATEGORY}>Quick List</option>
                            </select>
                          </td>
                          <td className="p-2 max-w-[90px]">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                value={item.qty}
                                onChange={(e) => updateItemField(idx, 'qty', Number(e.target.value) || 1)}
                                className="w-12 bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-xs font-mono text-center focus:outline-none"
                              />
                              <input
                                type="text"
                                value={item.unit || ''}
                                onChange={(e) => updateItemField(idx, 'unit', e.target.value)}
                                className="w-12 bg-slate-50 border border-slate-200 rounded px-1 py-1 text-xs text-center focus:outline-none"
                                placeholder="unit"
                              />
                            </div>
                          </td>
                          <td className="p-2 max-w-[90px]">
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) => updateItemField(idx, 'price', Number(e.target.value) || 0)}
                              className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs font-mono text-right focus:outline-none"
                            />
                          </td>
                          <td className="p-2 text-right font-mono text-xs font-bold text-slate-900">
                            {item.subtotal.toLocaleString()} RWF
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(idx)}
                              className="p-1 rounded text-red-500 hover:bg-red-50 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    }

                    // View Mode
                    const catName = isQuickList
                      ? 'Quick List'
                      : (CATEGORIES.find(c => c.id === item.category)?.name ?? item.category)
                    return (
                      <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-3 py-3">
                          <p className="font-medium text-slate-900">{item.productName}</p>
                          <p className={`text-xs mt-0.5 ${
                            isQuickList ? 'text-violet-500' : 'text-slate-400'
                          }`}>{catName}</p>
                        </td>
                        <td className="px-3 py-3 text-center font-mono text-slate-600">
                          {isQuickList
                            ? (item.unit && item.unit !== '—' && item.unit !== '-' ? item.unit : item.qty)
                            : (item.unit && item.unit !== '—' && item.unit !== '-' ? (/^\d/.test(item.unit) && item.qty === 1 ? item.unit : `${item.qty} ${item.unit}`) : item.qty)}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-slate-600">
                          {isQuickList ? 'Ask price' : `${item.price.toLocaleString()} RWF`}
                        </td>
                        <td className="px-3 py-3 text-right">
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
              <span className="font-mono font-bold text-xl text-emerald-900">{activeOrder.total.toLocaleString()} RWF</span>
            </div>
          </div>

        </div>

        {/* ── Pinned footer ─────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={isSaving}
                className="rounded-card px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOrder}
                disabled={isSaving}
                className="inline-flex items-center gap-1.5 rounded-card px-5 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors shadow-sm disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Order Changes'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-card px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
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
            </>
          )}
        </div>
      </div>
    </>
  )
}
