'use client'

import React, { useState } from 'react'
import { AdminTopbar } from '@/components/admin/AdminTopbar'
import { ReceiptPreview, ReceiptData } from '@/components/admin/ReceiptPreview'
import { downloadReceiptPDF } from '@/components/admin/ReceiptExporter'
import {
  Download,
  Printer,
  Sparkles,
  RotateCcw,
  QrCode,
  User,
  Building,
  DollarSign,
  FileBadge,
  CheckCircle,
  AlertCircle,
  Copy,
} from 'lucide-react'

// Demo data matching user's image sample
const DEMO_DATA: ReceiptData = {
  receiptNo: 'NT-2026-1383',
  date: 'July 13, 2026',
  customerName: 'CAPR Rwanda',
  customerContact: '0788241529',
  customerEmail: 'info@capr.org.rw',
  customerLocation: 'Kigali,Rwanda',
  serviceTitle: 'CAPR WEB DEVELOPMENT',
  amount: '180,000',
  currency: 'RWF',
  signatoryName: 'Muhoza Plaisir',
  signatoryTitle: 'NTUMANKUHAHIRE — DIRECTOR',
  contactPhone: '0782557168',
  contactEmail: 'plaisirmuhoza@gmail.com',
  contactLocation: 'Nyagatare City',
  qrPayload: 'https://ntumankuhahire.rw/verify/NT-2026-1383',
}

const INITIAL_DATA: ReceiptData = {
  receiptNo: `NT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
  date: new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }),
  customerName: 'CAPR Rwanda',
  customerContact: '0788241529',
  customerEmail: 'info@capr.org.rw',
  customerLocation: 'Kigali, Rwanda',
  serviceTitle: 'CAPR WEB DEVELOPMENT',
  amount: '180000',
  currency: 'RWF',
  signatoryName: 'Muhoza Plaisir',
  signatoryTitle: 'NTUMANKUHAHIRE — DIRECTOR',
  contactPhone: '0782557168',
  contactEmail: 'plaisirmuhoza@gmail.com',
  contactLocation: 'Nyagatare City',
  qrPayload: 'https://ntumankuhahire.rw/verify/NT-2026-1383',
}

export default function ReceiptsPage() {
  const [formData, setFormData] = useState<ReceiptData>(INITIAL_DATA)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleChange = (field: keyof ReceiptData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // Auto update QR payload if receiptNo changes and user hasn't overridden
      if (field === 'receiptNo') {
        updated.qrPayload = `https://ntumankuhahire.rw/verify/${value}`
      }
      return updated
    })
  }

  const handleFillDemo = () => {
    setFormData(DEMO_DATA)
  }

  const handleReset = () => {
    setFormData({
      ...INITIAL_DATA,
      receiptNo: `NT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
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

  const handlePrint = () => {
    window.print()
  }

  const handleCopyQrLink = () => {
    navigator.clipboard.writeText(formData.qrPayload)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
      {/* Top Header Bar */}
      <AdminTopbar
        title="Generate Official Receipt"
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Action Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-950 bg-brand-yellow hover:bg-yellow-400 rounded-lg transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4" /> Fill Sample Image Data
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Form
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4 text-slate-600" /> Print Receipt
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 rounded-lg transition-all shadow-md disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-brand-yellow" />
              {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Receipt'}
            </button>
          </div>
        </div>

        {downloadSuccess && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in no-print">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            PDF generated and downloaded successfully!
          </div>
        )}

        {/* Main Grid: Form Inputs (Left) & Live Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: FORM INPUTS */}
          <div className="lg:col-span-5 space-y-6 no-print">
            
            {/* 1. Receipt Identification */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <FileBadge className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  1. Receipt Identification
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Receipt Number
                  </label>
                  <input
                    type="text"
                    value={formData.receiptNo}
                    onChange={(e) => handleChange('receiptNo', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                    placeholder="NT-2026-1383"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                    placeholder="July 13, 2026"
                  />
                </div>
              </div>
            </div>

            {/* 2. Customer / Billed To Info */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <Building className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  2. Billed To (Customer)
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Client / Organization Name
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
                    placeholder="CAPR Rwanda"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      value={formData.customerContact}
                      onChange={(e) => handleChange('customerContact', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="0788241529"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => handleChange('customerEmail', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="info@capr.org.rw"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.customerLocation}
                      onChange={(e) => handleChange('customerLocation', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Kigali,Rwanda"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Service & Pricing */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  3. Service & Amount
                </h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Title / Description
                  </label>
                  <input
                    type="text"
                    value={formData.serviceTitle}
                    onChange={(e) => handleChange('serviceTitle', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                    placeholder="CAPR WEB DEVELOPMENT"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={formData.amount}
                      onChange={(e) => handleChange('amount', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="180,000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg bg-white font-mono focus:ring-2 focus:ring-emerald-600 outline-none"
                    >
                      <option value="RWF">RWF</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Authorized Signatory */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                <User className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  4. Signatory & Contact
                </h2>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Signatory Name
                    </label>
                    <input
                      type="text"
                      value={formData.signatoryName}
                      onChange={(e) => handleChange('signatoryName', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Muhoza Plaisir"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Role / Title
                    </label>
                    <input
                      type="text"
                      value={formData.signatoryTitle}
                      onChange={(e) => handleChange('signatoryTitle', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="NTUMANKUHAHIRE — DIRECTOR"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Issuer Phone
                    </label>
                    <input
                      type="text"
                      value={formData.contactPhone}
                      onChange={(e) => handleChange('contactPhone', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="0782557168"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Issuer Email
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="plaisirmuhoza@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Issuer City
                    </label>
                    <input
                      type="text"
                      value={formData.contactLocation}
                      onChange={(e) => handleChange('contactLocation', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                      placeholder="Nyagatare City"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. QR Code Verification Payload */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-700" />
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    5. QR Code Verification Payload
                  </h2>
                </div>
                <button
                  onClick={handleCopyQrLink}
                  className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verification URL / Code Payload
                </label>
                <input
                  type="text"
                  value={formData.qrPayload}
                  onChange={(e) => handleChange('qrPayload', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 outline-none"
                  placeholder="https://ntumankuhahire.rw/verify/NT-2026-1383"
                />
                <p className="text-[11px] text-slate-500 mt-1.5">
                  Scanning the receipt&apos;s QR code will encode this link/verification string.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT: LIVE RECEIPT PREVIEW */}
          <div className="lg:col-span-7 sticky top-6">
            <div className="no-print mb-3 flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                LIVE RECEIPT PREVIEW
              </span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium border border-emerald-200">
                Pixel-Perfect A4 Format
              </span>
            </div>

            {/* Receipt Component */}
            <ReceiptPreview data={formData} />
          </div>

        </div>
      </div>
    </div>
  )
}
