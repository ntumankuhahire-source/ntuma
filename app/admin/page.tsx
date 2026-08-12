'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { StatCard } from '@/components/admin/StatCard'
import { fetchCategories, fetchProducts, listOrders, type Category, type Product, type Order } from '@/lib/sheetsApi'
import { Plus, ArrowRight, ShoppingBag, Tag, Package, ExternalLink, Clock, CheckCircle2, TrendingUp } from 'lucide-react'

export default function OverviewPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts]     = useState<Product[]>([])
  const [orders, setOrders]         = useState<Order[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [catData, prodData, orderData] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
          listOrders(),
        ])
        setCategories(catData)
        setProducts(prodData)
        setOrders(orderData)
      } catch (err) {
        console.error('Error loading overview data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const pendingOrders = orders.filter(o => o.status === 'Pending')
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed')
  const deliveredOrders = orders.filter(o => o.status === 'Delivered')
  
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0)

  // Top 5 recent orders
  const recentOrders = orders.slice(0, 5)

  // Map category product counts
  const categoryCounts = categories.map(cat => {
    const count = products.filter(p => (p.category || (p as any).categoryId) === cat.id).length
    return { ...cat, productCount: count }
  })

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <AdminTopbar title="Overview" />

      <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto w-full">
        
        {/* ── Upper Clickable Stat Cards ────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 font-body">
              Metrics Overview
            </h2>
            <span className="text-xs text-slate-400 font-mono">
              Click any card to manage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              label="Total Categories"
              value={loading ? '…' : categories.length}
              href="/admin/categories"
              subtext="Manage categories →"
            />
            <StatCard
              label="Total Products"
              value={loading ? '…' : products.length}
              href="/admin/products"
              subtext="Manage products →"
            />
            <StatCard
              label="Total Orders"
              value={loading ? '…' : orders.length}
              href="/admin/orders"
              subtext="View orders →"
            />
            <StatCard
              label="Pending Orders"
              value={loading ? '…' : pendingOrders.length}
              href="/admin/orders"
              subtext="Needs attention →"
            />
          </div>
        </div>

        {/* ── Quick Action Shortcuts ────────────────────────────────────────── */}
        <div className="bg-white rounded-card border border-slate-200 p-5 shadow-xs">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/admin/categories"
              className="flex items-center justify-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-card text-xs font-medium transition-colors border border-emerald-200/60"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              Add Category
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center justify-center gap-2 p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-card text-xs font-medium transition-colors border border-emerald-200/60"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              Add Product
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-card text-xs font-medium transition-colors border border-slate-200"
            >
              <ShoppingBag className="w-4 h-4 text-slate-500" />
              Manage Orders
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-card text-xs font-medium transition-colors border border-slate-200"
            >
              <ExternalLink className="w-4 h-4 text-slate-500" />
              View Storefront
            </a>
          </div>
        </div>

        {/* ── Summaries Section ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Summary Column 1 & 2: Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-card border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base text-emerald-950">
                  Recent Orders
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest customer orders placed through Ntuma
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-900 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="flex-1 overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-sm text-slate-400 animate-pulse">
                  Loading recent orders…
                </div>
              ) : recentOrders.length === 0 ? (
                <div className="p-12 text-center text-sm text-slate-400">
                  No orders recorded yet.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="px-5 py-3">Order ID</th>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Total</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-3.5 font-mono font-medium text-emerald-800">
                          {order.id}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-800">{order.customerName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{order.customerPhone}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              order.status === 'Pending'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : order.status === 'Confirmed'
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-red-100 text-red-800 border border-red-200'
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono font-medium text-slate-900">
                          {order.total.toLocaleString()} <span className="text-[10px] text-slate-400">RWF</span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Link
                            href="/admin/orders"
                            className="text-emerald-700 hover:text-emerald-950 font-medium hover:underline"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Summary Column 3: Category Distribution & Order Stats */}
          <div className="space-y-6">
            
            {/* Revenue & Status breakdown */}
            <div className="bg-white rounded-card border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-sm text-emerald-950">
                  Sales & Status
                </h3>
                <TrendingUp className="w-4 h-4 text-emerald-700" />
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-card border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Total Estimated Revenue
                  </span>
                  <span className="font-mono text-2xl font-bold text-emerald-950">
                    {totalRevenue.toLocaleString()} <span className="text-xs text-slate-400 font-normal">RWF</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Pending
                    </span>
                    <span className="font-mono font-semibold text-slate-800">{pendingOrders.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      Confirmed
                    </span>
                    <span className="font-mono font-semibold text-slate-800">{confirmedOrders.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Delivered
                    </span>
                    <span className="font-mono font-semibold text-slate-800">{deliveredOrders.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category breakdown summary */}
            <div className="bg-white rounded-card border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-sm text-emerald-950">
                  Categories Summary
                </h3>
                <Tag className="w-4 h-4 text-emerald-700" />
              </div>

              {loading ? (
                <div className="text-xs text-slate-400 py-4 animate-pulse">Loading categories…</div>
              ) : categoryCounts.length === 0 ? (
                <div className="text-xs text-slate-400 py-4">No categories created yet.</div>
              ) : (
                <div className="space-y-3">
                  {categoryCounts.map((cat) => {
                    const percentage = products.length > 0 ? Math.round((cat.productCount / products.length) * 100) : 0
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-700">{cat.name}</span>
                          <span className="font-mono text-slate-500">{cat.productCount} products</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(percentage, 5)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
