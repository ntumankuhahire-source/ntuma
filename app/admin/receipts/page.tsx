'use client'

import React, { useState, useEffect } from 'react'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ReceiptPreview, ReceiptData } from '@/components/admin/ReceiptPreview'
import { downloadReceiptPDF } from '@/components/admin/ReceiptExporter'
import { buildReceiptQrUrl } from '@/lib/receiptHash'
import {
  Download,
  Printer,
  RotateCcw,
  QrCode,
  User,
  Building,
  ShoppingBag,
  FileBadge,
  CheckCircle,
  Copy,
  ShieldCheck,
  Share2,
  Truck,
  Link2,
} from 'lucide-react'

const INITIAL_DATA: ReceiptData = {
  receiptNo: `NT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
  customerName: '',
  customerContact: '',
  customerEmail: '',
  customerLocation: '',
  serviceTitle: '',
  amount: '',
  transportFee: '',
  otherFee: '',
  currency: 'RWF',
  signatoryName: 'NTUMANKUHAHIRE',
  signatoryTitle: 'DIRECTOR',
  contactPhone: '0787800703',
  contactEmail: 'info.ntumankuhahire.com',
  contactLocation: 'Kigali City',
  qrPayload: '',
}

function parseNum(val: string): number {
  const n = Number((val || '').replace(/,/g, '').trim())
  return isNaN(n) ? 0 : n
}

export default function ReceiptsPage() {
  const [formData, setFormData] = useState<ReceiptData>(INITIAL_DATA)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [copiedVerify, setCopiedVerify] = useState(false)
  const [copiedShare, setCopiedShare] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [shareableLink, setShareableLink] = useState('')

  // Auto-generate HMAC verification QR URL on key field change
  useEffect(() => {
    async function updateQrUrl() {
      const { url } = await buildReceiptQrUrl({
        receiptNumber: formData.receiptNo,
        amount: formData.amount,
        clientName: formData.customerName,
        date: formData.date,
      })
      setFormData((prev) => ({ ...prev, qrPayload: url }))
    }
    updateQrUrl()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.receiptNo, formData.amount, formData.customerName, formData.date])

  // Build shareable client download link (points to /receipt-download?data=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams({
        no: formData.receiptNo,
        date: formData.date,
        name: formData.customerName,
        contact: formData.customerContact,
        email: formData.customerEmail,
        location: formData.customerLocation,
        title: formData.serviceTitle,
        amount: formData.amount,
        transport: formData.transportFee,
        other: formData.otherFee,
        currency: formData.currency,
        sig: formData.signatoryName,
        sigtitle: formData.signatoryTitle,
        phone: formData.contactPhone,
        cemail: formData.contactEmail,
        clocation: formData.contactLocation,
        qr: formData.qrPayload,
      })
      const origin = typeof window !== 'undefined' ? window.location.origin : ''
      setShareableLink(`${origin}/receipt-download?${params.toString()}`)
    } catch {
      setShareableLink('')
    }
  }, [formData])

  const handleChange = (field: keyof ReceiptData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setFormData({
      ...INITIAL_DATA,
      receiptNo: `NT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    })
  }

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true)
    setDownloadSuccess(false)
    const success = await downloadReceiptPDF('printable-receipt-card', formData.receiptNo)
    setIsGeneratingPdf(false)
    if (success) {
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 3000)
    }
  }

  const handleCopyVerify = () => {
    navigator.clipboard.writeText(formData.qrPayload)
    setCopiedVerify(true)
    setTimeout(() => setCopiedVerify(false), 2000)
  }

  const handleCopyShare = () => {
    navigator.clipboard.writeText(shareableLink)
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 2000)
  }

  const total = parseNum(formData.amount) + parseNum(formData.transportFee) + parseNum(formData.otherFee)

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      <AdminTopbar title="Generate Official Receipt" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">

        {/* Action Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Clear / Reset
            </button>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> HMAC SHA-256
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-xs">
              <Printer className="w-4 h-4 text-slate-600" /> Print
            </button>
            <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-all shadow-md disabled:opacity-50">
              <Download className="w-4 h-4 text-yellow-400" />
              {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 no-print">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> PDF downloaded successfully!
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LEFT FORM ── */}
          <div className="lg:col-span-5 space-y-5 no-print">

            {/* 1. Identification */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <FileBadge className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Receipt Identification</h2>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Receipt Number</label>
                  <input type="text" value={formData.receiptNo} onChange={(e) => handleChange('receiptNo', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 outline-none" placeholder="NT-2026-1383" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Date</label>
                  <input type="text" value={formData.date} onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none" placeholder="August 15, 2026" />
                </div>
              </div>
            </div>

            {/* 2. Customer */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <Building className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Billed To (Customer)</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Client / Customer Name</label>
                  <input type="text" value={formData.customerName} onChange={(e) => handleChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold focus:ring-2 focus:ring-emerald-600 outline-none" placeholder="e.g. Enter Client Name" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[['Phone', 'customerContact', 'text', '0788000000'], ['Email', 'customerEmail', 'email', 'client@mail.com'], ['Location', 'customerLocation', 'text', 'Kigali, Rwanda']].map(([label, field, type, ph]) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
                      <input type={type} value={formData[field as keyof ReceiptData]} onChange={(e) => handleChange(field as keyof ReceiptData, e.target.value)}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none" placeholder={`e.g. ${ph}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Products & Amount */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">3. Products &amp; Amount</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Products / Description</label>
                  <input type="text" value={formData.serviceTitle} onChange={(e) => handleChange('serviceTitle', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none" placeholder="e.g. Fresh vegetables, groceries..." />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Products Amount</label>
                    <input type="text" value={formData.amount} onChange={(e) => handleChange('amount', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono font-bold focus:ring-2 focus:ring-emerald-600 outline-none" placeholder="e.g. 180000" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                    <select value={formData.currency} onChange={(e) => handleChange('currency', e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none">
                      <option value="RWF">RWF</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                {/* Transport + other fees */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Truck className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Fees (added to total)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Transport Fee</label>
                      <input type="text" value={formData.transportFee} onChange={(e) => handleChange('transportFee', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 outline-none" placeholder="e.g. 3000" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">Other Fee</label>
                      <input type="text" value={formData.otherFee} onChange={(e) => handleChange('otherFee', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 outline-none" placeholder="e.g. 500" />
                    </div>
                  </div>
                  {total > 0 && (
                    <div className="mt-2 px-3 py-2 bg-emerald-950 rounded-lg text-xs font-mono font-bold text-amber-400 flex justify-between items-center">
                      <span className="text-emerald-300/70 font-normal text-[11px]">TOTAL (incl. all fees)</span>
                      <span>{total.toLocaleString('en-US')} {formData.currency || 'RWF'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Owner Info */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">4. Issuer / Owner (Defaults)</h2>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Name</label>
                    <input type="text" value={formData.signatoryName} onChange={(e) => handleChange('signatoryName', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Title</label>
                    <input type="text" value={formData.signatoryTitle} onChange={(e) => handleChange('signatoryTitle', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-slate-50 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[['Telephone', 'contactPhone', 'font-mono'], ['Email', 'contactEmail', ''], ['Location', 'contactLocation', '']].map(([label, field, extra]) => (
                    <div key={field}>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">{label}</label>
                      <input type="text" value={formData[field as keyof ReceiptData]} onChange={(e) => handleChange(field as keyof ReceiptData, e.target.value)}
                        className={`w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-slate-50 focus:ring-2 focus:ring-emerald-600 outline-none ${extra}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. QR / Share Links */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <QrCode className="w-4 h-4 text-emerald-700" />
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">5. QR Verification &amp; Shareable Link</h2>
              </div>

              {/* Verification URL */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Verification URL (SHA-256 signed)</label>
                  <button onClick={handleCopyVerify} className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                    <Copy className="w-3 h-3" />{copiedVerify ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <input readOnly value={formData.qrPayload}
                  className="w-full px-3 py-2 text-[11px] font-mono border border-slate-300 rounded-lg bg-slate-50 outline-none select-all text-slate-700 cursor-pointer"
                  onClick={(e) => (e.target as HTMLInputElement).select()} />
              </div>

              {/* Shareable download link */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Share2 className="w-3 h-3 text-emerald-700" /> Client Download Link
                  </label>
                  <button onClick={handleCopyShare} className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1">
                    <Copy className="w-3 h-3" />{copiedShare ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <input readOnly value={shareableLink}
                  className="w-full px-3 py-2 text-[11px] font-mono border border-emerald-300 rounded-lg bg-emerald-50 outline-none select-all text-emerald-900 cursor-pointer"
                  onClick={(e) => (e.target as HTMLInputElement).select()} />
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <Link2 className="w-3 h-3" /> Share this link with the client — they can view &amp; download the receipt as PDF.
                </p>
              </div>
            </div>

          </div>

          {/* ── RIGHT: PREVIEW ── */}
          <div className="lg:col-span-7 sticky top-6">
            <div className="no-print mb-3 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">LIVE RECEIPT PREVIEW</span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">A4 Format</span>
            </div>
            <ReceiptPreview data={formData} />
          </div>

        </div>
      </div>
    </div>
  )
}
