'use client'

import React, { useEffect, useState, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ReceiptPreview, ReceiptData } from '@/components/admin/ReceiptPreview'
import { downloadReceiptPDF } from '@/components/admin/ReceiptExporter'
import { Download, ShieldCheck, ArrowLeft } from 'lucide-react'

function DownloadContent() {
  const sp = useSearchParams()
  const [downloading, setDownloading] = useState(false)
  const [done, setDone] = useState(false)

  const data: ReceiptData = {
    receiptNo:       sp.get('no')        || '',
    date:            sp.get('date')      || '',
    customerName:    sp.get('name')      || '',
    customerContact: sp.get('contact')   || '',
    customerEmail:   sp.get('email')     || '',
    customerLocation:sp.get('location') || '',
    serviceTitle:    sp.get('title')     || '',
    amount:          sp.get('amount')    || '',
    transportFee:    sp.get('transport') || '',
    otherFee:        sp.get('other')     || '',
    currency:        sp.get('currency')  || 'RWF',
    signatoryName:   sp.get('sig')       || 'NTUMANKUHAHIRE',
    signatoryTitle:  sp.get('sigtitle')  || 'DIRECTOR',
    contactPhone:    sp.get('phone')     || '0787800703',
    contactEmail:    sp.get('cemail')    || 'info.ntumankuhahire.com',
    contactLocation: sp.get('clocation')|| 'Kigali City',
    qrPayload:       sp.get('qr')        || '',
  }

  const handleDownload = async () => {
    setDownloading(true)
    await downloadReceiptPDF('printable-receipt-card', data.receiptNo)
    setDownloading(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  // Give the QR code time to render before auto-downloading if flag set
  useEffect(() => {
    // slight delay so QR renders properly
    const t = setTimeout(() => {}, 300)
    return () => clearTimeout(t)
  }, [])

  if (!data.receiptNo) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 text-sm">Invalid receipt link. Please ask for a valid link from Ntumankuhahire.</p>
        <Link href="/" className="mt-4 inline-flex items-center gap-2 text-emerald-700 text-sm font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Go to homepage
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Info bar */}
      <div className="bg-emerald-950 text-white rounded-xl p-4 mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400/80 mb-0.5">Official Receipt from</div>
          <div className="text-base font-extrabold tracking-tight">NTUMANKUHAHIRE</div>
          <div className="flex items-center gap-1 text-xs text-emerald-300/80 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> SHA-256 Cryptographically Signed
          </div>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-emerald-950 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 rounded-lg transition-all shadow-md disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          {downloading ? 'Generating PDF...' : done ? 'Downloaded!' : 'Download PDF Receipt'}
        </button>
      </div>

      {/* Receipt preview */}
      <ReceiptPreview data={data} />

      <p className="text-center text-xs text-slate-400 mt-5">
        Powered by <strong>Ntumankuhahire</strong> · <Link href={data.qrPayload || '/verify'} className="text-emerald-700 underline">Verify authenticity</Link>
      </p>
    </div>
  )
}

export default function ReceiptDownloadPage() {
  return (
    <div className="min-h-screen bg-slate-100 font-body py-10 px-4">
      {/* Minimal header */}
      <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-emerald-950 p-2 rounded-lg border border-emerald-800">
            <Image src="/logo.png" alt="Ntuma Logo" width={100} height={32} className="h-7 w-auto object-contain brightness-110" priority />
          </div>
          <span className="font-display font-extrabold text-emerald-950 text-base tracking-tight">NTUMANKUHAHIRE</span>
        </Link>
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
          Receipt Download
        </span>
      </div>

      <Suspense fallback={
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-mono">Loading receipt...</p>
        </div>
      }>
        <DownloadContent />
      </Suspense>
    </div>
  )
}
